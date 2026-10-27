"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, ExternalLink, RefreshCw, Volume2, VolumeX, Maximize2 } from "lucide-react";

interface LiveStreamPlayerProps {
  channelId?: string;
  fallbackVideoId: string;
  title: string;
  templeId: string;
  officialYoutube?: string;
  thumbnail?: string;
}

function cleanVideoId(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes("?")) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function LiveStreamPlayer({
  channelId,
  fallbackVideoId,
  title,
  templeId,
  officialYoutube,
  thumbnail,
}: LiveStreamPlayerProps) {
  const playerRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const validVideoId = cleanVideoId(fallbackVideoId);

  useEffect(() => {
    setIsLoading(true);
    setHasPlaybackError(false);

    if (!validVideoId) {
      if (!channelId) {
        setHasPlaybackError(true);
        setIsLoading(false);
      }
      return;
    }

    if (typeof window !== "undefined") {
      const win = window as any;
      if (!win.YT) {
        const existing = document.getElementById("yt-iframe-api");
        if (!existing) {
          const tag = document.createElement("script");
          tag.id = "yt-iframe-api";
          tag.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(tag);
        }
      }
    }

    let isSubscribed = true;

    const init = () => {
      const win = typeof window !== "undefined" ? (window as any) : null;
      if (!win?.YT?.Player || !wrapperRef.current || !isSubscribed) {
        setTimeout(init, 100);
        return;
      }

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }

      wrapperRef.current.innerHTML = "";
      const mountNode = document.createElement("div");
      mountNode.style.width = "100%";
      mountNode.style.height = "100%";
      wrapperRef.current.appendChild(mountNode);

      try {
        playerRef.current = new win.YT.Player(mountNode, {
          videoId: validVideoId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 1,
            mute: 1,
            playsinline: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isSubscribed) return;
              setIsLoading(false);
              const p = event.target;
              p.playVideo();
              try {
                const dur = p.getDuration();
                if (dur > 0) p.seekTo(dur, true);
              } catch {}
            },
            onError: () => {
              if (!isSubscribed) return;
              setHasPlaybackError(true);
              setIsLoading(false);
            },
          },
        });
      } catch {
        setHasPlaybackError(true);
        setIsLoading(false);
      }
    };

    const win = typeof window !== "undefined" ? (window as any) : null;
    if (win?.YT && win?.YT?.Player) {
      init();
    } else if (win) {
      win.onYouTubeIframeAPIReady = init;
    }

    return () => {
      isSubscribed = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [validVideoId, channelId, templeId]);

  const toggleAudio = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {}
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (hasPlaybackError) {
    return (
      <div className="relative w-full h-full bg-[#1A0A0C] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
          />
        )}
        <div className="relative z-10 max-w-md space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sanctum Stream Offline or Updating</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            The trust is currently cycling its transmission or broadcasting exclusively on their official channel.
          </p>
          {officialYoutube && (
            <a
              href={officialYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
            >
              <span>Watch on Official Trust Channel</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Fallback to official channel stream if video ID is missing
  if (!validVideoId && channelId) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden select-none">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0`}
          title={title}
          className="w-full h-full border-0 pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-auto bg-gradient-to-b from-black/60 to-transparent" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden select-none">
      <div ref={wrapperRef} className="w-full h-full pointer-events-none" />

      {/* Top shield (blocks clicking YouTube channel avatar/links) */}
      <div className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-auto bg-gradient-to-b from-black/60 to-transparent" />

      {/* Bottom control bar */}
      <div className="absolute bottom-0 left-0 right-0 h-14 z-20 pointer-events-auto bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-wider uppercase drop-shadow">
            LIVE GARBHAGRIHA
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5 px-2.5"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold">Sound On</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all shadow-md active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 text-white gap-2">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-xs text-stone-300">Connecting to Live Garbhagriha...</span>
        </div>
      )}
    </div>
  );
}