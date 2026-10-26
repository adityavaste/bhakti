'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show your custom install UI
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already in standalone/installed mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    }
    
    // Clear the deferredPrompt so it can't be used again
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      zIndex: 9999,
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #ffcc80'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/icon-192x192.png" 
          alt="App Icon" 
          style={{ width: '48px', height: '48px', borderRadius: '10px' }} 
        />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#111' }}>
            Darshan App
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Fast live darshan & aarti alerts
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setShowBanner(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: '#888',
            cursor: 'pointer'
          }}
        >
          Later
        </button>
        <button 
          onClick={handleInstallClick}
          style={{
            backgroundColor: '#ff9933',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Install App
        </button>
      </div>
    </div>
  );
}