// components/InstallPrompt.tsx
'use client';

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Don't show if already opened inside the installed standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-white/95 backdrop-blur-md border border-[#E8DCC4] rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#FFF3E0] border border-[#FFE0B2] flex items-center justify-center text-xl shrink-0">
          🪔
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[#2D1609]">Install Divine Darshan</h4>
          <p className="text-xs text-[#7A624E]">Direct live darshan & aarti notifications</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="text-xs text-[#8A7563] hover:text-[#2D1609] px-2 py-1 transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="text-xs font-semibold bg-[#FF8A00] hover:bg-[#E07A00] text-white px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
        >
          Install
        </button>
      </div>
    </div>
  );
}