"use client";

import React, { useState } from "react";
import {
  useAudioPlayer,
  STATIONS,
  RadioStation,
} from "@/context/AudioPlayerContext";
import {
  Play,
  Pause,
  Radio,
  Clock,
  ChevronUp,
  ChevronDown,
  Volume2,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function RadioPlayerDock() {
  const {
    currentStation,
    isPlaying,
    isLoading,
    togglePlay,
    playStation,
    sleepTimerMinutes,
    setSleepTimer,
  } = useAudioPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-6 pb-3 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        
        {/* Expanded Station Selector Panel */}
        {isExpanded && (
          <div className="mb-2 bg-[#1C0B0E]/95 backdrop-blur-xl border border-amber-900/40 rounded-3xl p-5 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-sm text-amber-200">
                  Select Sacred Ambient Channel
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {STATIONS.map((station: RadioStation) => {
                const isActive = station.id === currentStation.id;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => {
                      playStation(station);
                      setIsExpanded(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all border ${
                      isActive
                        ? "bg-amber-500/20 border-amber-400/60 shadow-md"
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={station.artwork}
                      alt={station.name}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-400/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs truncate text-white">
                          {station.name}
                        </span>
                        {isActive && isPlaying && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-amber-300/80 truncate">
                        {station.deity} • {station.category}
                      </p>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 font-light">
                        {station.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Floating Mini-Player Bar */}
        <div className="bg-[#1C0B0E]/95 backdrop-blur-md border border-amber-900/50 shadow-2xl rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-white">
          
          {/* Station Info & Expand Trigger */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-amber-500/30">
              <img
                src={currentStation.artwork}
                alt={currentStation.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_100ms] h-full" />
                    <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_300ms] h-2/3" />
                    <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_200ms] h-4/5" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                  {currentStation.name}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] uppercase font-bold tracking-wider">
                  24/7 LIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-300 truncate">
                {currentStation.deity} • <span className="text-amber-400/80">Tap to switch</span>
              </p>
            </div>
          </div>

          {/* Controls: Sleep Timer + Play/Pause */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Sleep Timer Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTimerMenu(!showTimerMenu)}
                className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 ${
                  sleepTimerMinutes
                    ? "bg-amber-600 text-white border-amber-400"
                    : "bg-white/5 border-white/10 text-stone-300 hover:text-white"
                }`}
                title="Bedtime Sleep Timer"
              >
                <Clock className="w-4 h-4" />
                {sleepTimerMinutes && (
                  <span className="text-[10px] font-bold">{sleepTimerMinutes}m</span>
                )}
              </button>

              {/* Sleep Timer Dropdown */}
              {showTimerMenu && (
                <div className="absolute bottom-12 right-0 bg-[#250F13] border border-amber-900/50 rounded-2xl p-2 shadow-2xl w-36 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                    Sleep Timer
                  </span>
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setSleepTimer(mins);
                        setShowTimerMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                    >
                      {mins} Minutes
                    </button>
                  ))}
                  {sleepTimerMinutes && (
                    <button
                      type="button"
                      onClick={() => {
                        setSleepTimer(null);
                        setShowTimerMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-white/10"
                    >
                      Turn Off Timer
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Play / Pause Primary Button */}
            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Expand / Collapse Chevron */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-stone-400 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}