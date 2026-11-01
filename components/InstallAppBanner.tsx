"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return; // Already installed, do not show
    }

    // 2. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Check dismissed flag in localStorage
    const dismissed = localStorage.getItem("bhakti_install_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 24 * 60 * 60 * 1000) {
      return; // Don't annoy user for 24 hours if dismissed
    }

    // 4. Capture native Android/Chrome install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If on iOS or mobile, still show the prompt so users can save to homescreen
    if (isIosDevice) {
      setIsVisible(true);
    } else {
      // Fallback: If beforeinstallprompt hasn't fired after 2 seconds on mobile, show it anyway
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native Android PWA install dialog
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // Show Apple Safari "Add to Home Screen" instructions
      setShowIOSInstructions(true);
    } else {
      alert("To install: tap your browser's menu (⋮) at the top right and select 'Add to Home screen' or 'Install App'.");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("bhakti_install_dismissed", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Install Capsule positioned safely ABOVE the bottom audio dock (bottom-20) */}
      <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto">
        <div className="bg-[#FAF6F0] border-2 border-amber-600/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 text-stone-900">
          
          {/* App Icon & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-serif text-lg font-bold shadow-md shrink-0">
              🕉️
            </div>
            <div className="min-w-0">
              <h4 className="font-serif font-bold text-xs text-[#2A1114] truncate">
                Install Darshan App
              </h4>
              <p className="text-[10px] text-stone-600 truncate font-light">
                Instant Darshan & Offline Audio
              </p>
            </div>
          </div>

          {/* Action Buttons: Install + Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-[#2A1114] hover:bg-[#3D181D] active:scale-95 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Install on iPhone / iPad
            </h3>
            <ol className="text-left text-xs text-stone-600 space-y-2.5 list-decimal pl-5">
              <li>
                Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> <strong>Share</strong> button at the bottom of Safari.
              </li>
              <li>
                Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
              </li>
              <li>
                Tap <strong>Add</strong> at the top right to get the app on your home screen.
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2.5 bg-[#2A1114] text-white rounded-xl text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}