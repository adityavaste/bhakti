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
  Download,
  Loader2,
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
  const [isDownloading, setIsDownloading] = useState(false);

  // Cross-platform mobile download handler
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentStation.streamUrl) return;

    try {
      setIsDownloading(true);

      // Check if it's a live streaming URL (live shoutcasts cannot be saved as static mp3 files)
      if (
        currentStation.streamUrl.includes("stream.zeno.fm") ||
        currentStation.streamUrl.endsWith(".m3u8")
      ) {
        alert("This is a 24/7 continuous live broadcast and cannot be downloaded as a file.");
        setIsDownloading(false);
        return;
      }

      // Fetch file blob to force genuine file download on mobile Safari & Chrome
      const response = await fetch(currentStation.streamUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const fileName = `${currentStation.name.toLowerCase().replace(/\s+/g, "-")}.mp3`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to direct link:", err);
      // Fallback direct link trigger for iOS Safari
      const link = document.createElement("a");
      link.href = currentStation.streamUrl;
      link.download = `${currentStation.name}.mp3`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-2.5 sm:px-6 pb-2.5 sm:pb-3 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        
        {/* Expanded Station Selector Panel */}
        {isExpanded && (
          <div className="mb-2 bg-[#1C0B0E]/95 backdrop-blur-xl border border-amber-900/40 rounded-3xl p-4 sm:p-5 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-xs sm:text-sm text-amber-200">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
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
                    className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl text-left transition-all border ${
                      isActive
                        ? "bg-amber-500/20 border-amber-400/60 shadow-md"
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={station.artwork}
                      alt={station.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-amber-400/30 shrink-0"
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
        <div className="bg-[#1C0B0E]/95 backdrop-blur-md border border-amber-900/50 shadow-2xl rounded-2xl p-2 sm:p-3 flex items-center justify-between gap-2 sm:gap-3 text-white">
          
          {/* Station Info & Expand Trigger */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer group flex-1"
          >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-amber-950/80 border border-amber-500/30 flex items-center justify-center">
  {currentStation.artwork ? (
    <img
      src={currentStation.artwork}
      alt={currentStation.name}
      onError={(e) => {
        // Fallback if image fails
        e.currentTarget.style.display = "none";
      }}
      className="w-full h-full object-cover"
    />
  ) : null}
  <span className="text-amber-400 text-xs font-serif">ॐ</span>
</div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xs sm:text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                  {currentStation.name}
                </span>
                <span className="hidden md:inline-block px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] uppercase font-bold tracking-wider">
                  24/7 LIVE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-300 truncate">
                {currentStation.deity} • <span className="text-amber-400/80">Tap to switch</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Download + Sleep Timer + Play/Pause */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Direct Mobile & Desktop Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 text-stone-300 hover:text-white transition-all disabled:opacity-50"
              title="Download Mantra MP3 to Device"
              aria-label="Download Audio"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Download className="w-4 h-4 text-amber-300" />
              )}
            </button>

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
                aria-label="Sleep Timer"
              >
                <Clock className="w-4 h-4" />
                {sleepTimerMinutes && (
                  <span className="text-[10px] font-bold">{sleepTimerMinutes}m</span>
                )}
              </button>

              {/* Sleep Timer Dropdown */}
              {showTimerMenu && (
                <div className="absolute bottom-12 right-0 bg-[#250F13] border border-amber-900/50 rounded-2xl p-2 shadow-2xl w-36 text-center space-y-1 z-30">
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
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-60"
              aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Expand / Collapse Chevron */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 sm:p-1.5 text-stone-400 hover:text-white"
              aria-label="Expand Stations"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}