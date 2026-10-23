// app/manifest.ts
export default function manifest() {
  return {
    name: 'bhakti',
    short_name: 'darshan',
    start_url: '/',
    display: 'standalone' as const,
    background_color: '#ffffff', // Pure white splash background
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable' as const,
      },
    ],
  };
}