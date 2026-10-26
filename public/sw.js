// public/sw.js
const CACHE_NAME = 'bhakti-cache-v1';

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch listener with safeguards
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Only handle GET requests
  if (event.request.method !== 'GET') return;

  // 2. Ignore non-HTTP(S) schemes (e.g. chrome-extension://, blob:)
  if (!url.protocol.startsWith('http')) return;

  // 3. Let video/audio streaming requests pass through directly (avoids breaking live streams)
  if (
    event.request.headers.get('range') ||
    url.pathname.endsWith('.mp4') ||
    url.pathname.endsWith('.m3u8') ||
    url.hostname.includes('youtube') ||
    url.hostname.includes('googlevideo')
  ) {
    return;
  }

  // 4. Network-first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid basic responses for offline viewing
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // If offline and requesting an HTML page, serve home route
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Push notification click listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // If payload contains a custom target URL, use it; otherwise default to /live-darshan
  const targetUrl = event.notification.data?.url || '/live-darshan';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});