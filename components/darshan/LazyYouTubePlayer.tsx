"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface LazyYouTubePlayerProps {
  videoIdOrUrl: string;
  title: string;
  templeId: string;
}

export default function LazyYouTubePlayer({
  videoIdOrUrl,
  title,
  templeId,
}: LazyYouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Format to privacy-enhanced youtube-nocookie with forced autoplay & mute
  const formatEmbedUrl = (raw: string) => {
    let clean = raw.replace("www.youtube.com", "www.youtube-nocookie.com");
    if (!clean.includes("youtube-nocookie.com")) {
      clean = clean.replace("youtube.com", "youtube-nocookie.com");
    }
    const separator = clean.includes("?") ? "&" : "?";
    // mute=1 is mandatory for browsers to allow autoplay without user gesture
    return `${clean}${separator}autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Loading Spinner while video buffer connects */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      <iframe
        key={templeId} // Forces complete re-render upon temple change
        src={formatEmbedUrl(videoIdOrUrl)}
        title={title}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}