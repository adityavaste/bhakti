"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, ExternalLink, RefreshCw } from "lucide-react";

interface LiveStreamPlayerProps {
  channelId?: string;
  fallbackVideoId: string;
  title: string;
  templeId: string;
  officialYoutube?: string;
  thumbnail?: string;
}

// Clean helper to extract valid 11-char YouTube ID
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  const validVideoId = cleanVideoId(fallbackVideoId);
  const useChannelIframe = !validVideoId && Boolean(channelId);

  useEffect(() => {
    setIsLoading(true);
    setHasPlaybackError(false);

    // If we are using the channel live_stream URL, standard iframe handles it
    if (useChannelIframe) {
      return;
    }

    if (!validVideoId) {
      setHasPlaybackError(true);
      setIsLoading(false);
      return;
    }

    // Safe script injection
    if (typeof window !== "undefined") {
      const win = window as any;
      if (!win.YT) {
        const existingScript = document.getElementById("yt-iframe-api");
        if (!existingScript) {
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
      if (!win?.YT?.Player) {
        setTimeout(init, 100);
        return;
      }

      if (!isSubscribed || !wrapperRef.current) return;

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
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: typeof window !== "undefined" ? window.location.origin : "",
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
            onError: (event: any) => {
              if (!isSubscribed) return;
              console.warn("YouTube Stream Error code:", event.data);
              setHasPlaybackError(true);
              setIsLoading(false);
            },
          },
        });
      } catch (err) {
        console.error("Player init error:", err);
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
  }, [validVideoId, useChannelIframe, templeId]);

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
            <span>Sanctum Stream Updating</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            The trust is currently cycling its transmission or broadcasting on their official channel.
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

  // If no direct videoId, fallback cleanly to native channel iframe
  if (useChannelIframe) {
    return (
      <div className="relative w-full h-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&playsinline=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 text-white gap-2">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-xs text-stone-300">Connecting to Sanctum...</span>
        </div>
      )}
      <div ref={wrapperRef} className="w-full h-full" />
    </div>
  );
}