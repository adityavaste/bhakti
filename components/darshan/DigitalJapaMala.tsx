"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Trophy,
  ChevronDown,
  Smartphone,
} from "lucide-react";

const MANTRAS = [
  { id: "shiva", name: "Om Namah Shivaya", deity: "Lord Shiva" },
  { id: "krishna", name: "Hare Krishna Mahamantra", deity: "Lord Krishna" },
  { id: "vitthal", name: "Ram Krishna Hari", deity: "Lord Vitthal" },
  { id: "gayatri", name: "Gayatri Mantra", deity: "Mother Gayatri" },
  { id: "ganesh", name: "Om Gam Ganapataye Namaha", deity: "Lord Ganesha" },
  { id: "sai", name: "Om Sai Ram", deity: "Shirdi Sai Baba" },
  { id: "ram", name: "Shri Ram Jai Ram Jai Jai Ram", deity: "Lord Rama" },
];

const BEADS_PER_MALA = 108;

export default function DigitalJapaMala() {
  const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0]);
  const [currentCount, setCurrentCount] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);
  const [totalLifetimeChants, setTotalLifetimeChants] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(true);
  const [isVolumeKeyMode, setIsVolumeKeyMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isAudioUnlockedRef = useRef<boolean>(false);

  // Reliable sync audio primer for iOS & Android
  const ensureAudioUnlocked = () => {
    try {
      if (typeof window === "undefined") return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        const AudioConstructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioConstructor) {
          audioCtxRef.current = new AudioConstructor();
        }
      }

      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }

      // Play 1-sample silent buffer once to permanently unlock mobile audio pipeline
      if (ctx && !isAudioUnlockedRef.current) {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        isAudioUnlockedRef.current = true;
      }
    } catch (e) {
      console.warn("Audio unlock error:", e);
    }
  };

  // Acoustic Bead Sound (Synthesized wood click + metallic bell)
  const playBeadClickSound = useCallback((isMilestone = false) => {
    if (!isAudioEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== "running") {
        ensureAudioUnlocked();
      }

      const activeCtx = audioCtxRef.current;
      if (!activeCtx || activeCtx.state === "closed") return;

      const now = activeCtx.currentTime;

      if (isMilestone) {
        // Clear Sacred Tibetan Singing Bowl / Ghanta chime for bead 108
        const osc = activeCtx.createOscillator();
        const gain = activeCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5 chime
        osc.frequency.exponentialRampToValueAtTime(293.66, now + 1.2);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.connect(gain);
        gain.connect(activeCtx.destination);

        osc.start(now);
        osc.stop(now + 1.5);
      } else {
        // High-definition wooden tulsi bead clack
        const osc = activeCtx.createOscillator();
        const gain = activeCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(activeCtx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (err) {
      console.warn("Sound generation failed:", err);
    }
  }, [isAudioEnabled]);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const savedMalas = localStorage.getItem("japa_completed_malas");
      const savedTotal = localStorage.getItem("japa_lifetime_chants");
      const savedVolMode = localStorage.getItem("japa_vol_key_mode");
      if (savedMalas) setCompletedMalas(parseInt(savedMalas, 10));
      if (savedTotal) setTotalLifetimeChants(parseInt(savedTotal, 10));
      if (savedVolMode) setIsVolumeKeyMode(savedVolMode === "true");
    } catch {}
  }, []);

  // Main Chanting Action
  const handleChantTap = useCallback(() => {
    // 1. Synchronous unlock in direct user tap handler
    ensureAudioUnlocked();

    setCurrentCount((prevCount) => {
      const nextCount = prevCount + 1;
      const isCompleted = nextCount === BEADS_PER_MALA;

      // Haptics
      if (isHapticsEnabled && typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          if (isCompleted) {
            navigator.vibrate([150, 100, 250]);
          } else {
            navigator.vibrate(35);
          }
        } catch {}
      }

      // Audio
      playBeadClickSound(isCompleted);

      // Save Lifetime
      setTotalLifetimeChants((prev) => {
        const updated = prev + 1;
        try {
          localStorage.setItem("japa_lifetime_chants", String(updated));
        } catch {}
        return updated;
      });

      if (isCompleted) {
        setCompletedMalas((prev) => {
          const updated = prev + 1;
          try {
            localStorage.setItem("japa_completed_malas", String(updated));
          } catch {}
          return updated;
        });

        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3500);
        return 0;
      }

      return nextCount;
    });
  }, [isHapticsEnabled, playBeadClickSound]);

  // Volume Key Listener
  useEffect(() => {
    if (!isVolumeKeyMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "AudioVolumeUp" ||
        e.key === "AudioVolumeDown" ||
        e.key === "VolumeUp" ||
        e.key === "VolumeDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.code === "Space"
      ) {
        e.preventDefault();
        handleChantTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVolumeKeyMode, handleChantTap]);

  const toggleVolumeKeyMode = () => {
    ensureAudioUnlocked();
    const nextVal = !isVolumeKeyMode;
    setIsVolumeKeyMode(nextVal);
    try {
      localStorage.setItem("japa_vol_key_mode", String(nextVal));
    } catch {}
  };

  const toggleAudio = () => {
    ensureAudioUnlocked();
    setIsAudioEnabled((prev) => !prev);
  };

  const resetCurrentMala = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Reset current mala count back to 0?")) {
      setCurrentCount(0);
    }
  };

  const progressPercent = Math.round((currentCount / BEADS_PER_MALA) * 100);

  return (
    <div className="w-full max-w-md mx-auto bg-[#231215] text-[#F5EDE1] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/40 relative select-none overflow-hidden">
      {/* Background Mandala Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-amber-600/20 to-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Controls */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              📿
            </span>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">
                Digital Japa Mala
              </h3>
              <p className="text-[11px] text-amber-200/70">108 Sacred Beads</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Volume Key Toggle */}
            <button
              type="button"
              onClick={toggleVolumeKeyMode}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 ${
                isVolumeKeyMode
                  ? "bg-amber-600 text-white border-amber-400 shadow-md ring-1 ring-amber-400"
                  : "bg-white/5 border-white/10 text-stone-400 hover:text-white"
              }`}
              title="Toggle Hardware Volume Keys"
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] font-bold">Vol Keys</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-all ${
                isAudioEnabled
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-white/5 border-white/10 text-stone-400"
              }`}
              title={isAudioEnabled ? "Mute Bead Sound" : "Enable Bead Sound"}
            >
              {isAudioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Haptic Toggle */}
            <button
              type="button"
              onClick={() => setIsHapticsEnabled(!isHapticsEnabled)}
              className={`p-2 rounded-xl border transition-all ${
                isHapticsEnabled
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-white/5 border-white/10 text-stone-400"
              }`}
              title="Toggle Haptic Vibration"
            >
              <Vibrate className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Volume Mode Banner */}
        {isVolumeKeyMode && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hardware volume keys active
            </span>
            <span className="text-[10px] text-amber-300/80 font-mono">Vol Up / Down</span>
          </div>
        )}

        {/* Mantra Switcher */}
        <div className="relative">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/80 mb-1 block">
            Selected Divine Chant:
          </label>
          <div className="relative">
            <select
              value={selectedMantra.id}
              onChange={(e) => {
                const found = MANTRAS.find((m) => m.id === e.target.value);
                if (found) setSelectedMantra(found);
              }}
              className="w-full appearance-none bg-black/40 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {MANTRAS.map((m) => (
                <option key={m.id} value={m.id} className="bg-stone-900 text-white">
                  {m.name} ({m.deity})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Touch Wheel */}
      <div
        onClick={handleChantTap}
        className="my-8 relative cursor-pointer group flex flex-col items-center justify-center"
      >
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-white/10 stroke-current"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-amber-500 stroke-current transition-all duration-150 ease-out"
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-[#17090B] to-[#34161B] border-2 border-amber-500/40 shadow-inner flex flex-col items-center justify-center group-active:scale-95 transition-transform duration-100">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80 mb-0.5">
              Bead Count
            </span>
            <div className="text-5xl font-serif font-extrabold text-white tracking-tight">
              {currentCount}
            </div>
            <div className="text-xs font-mono text-stone-400 mt-1">
              of {BEADS_PER_MALA}
            </div>
            <span className="text-[10px] text-amber-300/60 mt-2 text-center px-4">
              {isVolumeKeyMode
                ? "Press Phone Volume Key or Tap"
                : "Tap anywhere to chant"}
            </span>
          </div>
        </div>

        {/* 108 Celebration */}
        {showCelebration && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300 z-30">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <h4 className="font-serif text-xl font-bold text-white">
              1 Sacred Mala Completed!
            </h4>
            <p className="text-xs text-stone-300 mt-1">
              108 chants of {selectedMantra.name} offered with devotion.
            </p>
            <span className="mt-3 text-[11px] font-bold text-amber-400">
              Om Shanti Shanti Shanti
            </span>
          </div>
        )}
      </div>

      {/* Footer Stats & Reset */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="space-y-0.5">
          <p className="text-stone-400 text-[11px]">Completed Malas</p>
          <p className="font-serif font-bold text-base text-amber-300">
            {completedMalas}{" "}
            <span className="text-xs font-sans font-normal text-stone-400">malas</span>
          </p>
        </div>

        <div className="text-right space-y-0.5">
          <p className="text-stone-400 text-[11px]">Lifetime Chants</p>
          <p className="font-mono font-bold text-base text-white">
            {totalLifetimeChants.toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={resetCurrentMala}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-400 hover:text-white transition-colors"
          title="Reset this 108 cycle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}