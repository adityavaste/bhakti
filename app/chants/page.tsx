"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  X,
  ChevronRight,
  ShieldCheck,
  Search,
  RotateCcw,
  RotateCw,
} from "lucide-react";

interface SacredTrack {
  id: string;
  title: string;
  deity: string;
  category: "chalisa" | "mantra" | "stotram" | "aarti";
  artist: string;
  youtubeId: string;
  duration: string;
  thumbnail: string;
  description: string;
  sacredBenefits: string;
}

const SACRED_TRACKS: SacredTrack[] = [
  {
    id: "hanuman-chalisa",
    title: "Shree Hanuman Chalisa",
    deity: "Lord Hanuman",
    category: "chalisa",
    artist: "Hariharan • Gulshan Kumar (T-Series)",
    youtubeId: "vCtWWUwzNiE",
    duration: "9:42",
    thumbnail: "/hanumanchalisa.jpeg",
    description: "The timeless 40-verse hymn composed by Goswami Tulsidas invoking strength, courage, and protection.",
    sacredBenefits: "Dispels fear, bestows inner mental vitality, and dissolves negative obstacles.",
  },
  {
    id: "maha-mrityunjaya",
    title: "Maha Mrityunjaya Mantra (108 Times)",
    deity: "Lord Shiva",
    category: "mantra",
    artist: "Shankar Sahney (T-Series)",
    youtubeId: "EAxn00hdnUQ",
    duration: "43:50",
    thumbnail: "/Maha Mrityunjaya Mantra.jpeg",
    description: "The Great Death-Conquering Moksha hymn from the Rigveda dedicated to Tryambaka.",
    sacredBenefits: "Supports physical healing, longevity, deep peace, and spiritual liberation.",
  },
  {
    id: "gayatri-mantra",
    title: "Akhand Gayatri Mantra (108 Times)",
    deity: "Mother Gayatri",
    category: "mantra",
    artist: "Anuradha Paudwal (T-Series)",
    youtubeId: "oJU-fHqMZhM",
    duration: "25:18",
    thumbnail: "/Akhand Gayatri Mantra.jpeg",
    description: "The supreme Vedic solar mantra illuminating inner consciousness and wisdom.",
    sacredBenefits: "Sharpens intellect, clears mental confusion, and awakens divine awareness.",
  },
  {
    id: "shiv-tandav",
    title: "Shiv Tandav Stotram",
    deity: "Lord Shiva",
    category: "stotram",
    artist: "Pushkar Kandpal (T-Series)",
    youtubeId: "S980-z1qx3g",
    duration: "9:15",
    thumbnail: "/Shiv Tandav Stotram.jpeg",
    description: "The ecstatic hymn of cosmic energy composed by Ravana praising Shiva's infinite beauty and dance.",
    sacredBenefits: "Cultivates unshakeable willpower, boundless confidence, and emotional focus.",
  },
  {
    id: "ganesh-aarti",
    title: "Sukhakarta Dukhaharta Aarti",
    deity: "Lord Ganesha",
    category: "aarti",
    artist: "Anuradha Paudwal (T-Series)",
    youtubeId: "gFr5p5AyuD0",
    duration: "5:20",
    thumbnail: "/Sukhakarta Dukhaharta Aarti.jpeg",
    description: "Traditional auspicious aarti composed by Samarth Ramdas honoring the remover of obstacles.",
    sacredBenefits: "Invites auspicious beginnings, peace at home, and success in ventures.",
  },
  {
    id: "Bajrang Baan",
    title: "Bajrang Baan",
    deity: "Lord Hanuman",
    category: "stotram",
    artist: "Vianet LoFi Bhajans",
    youtubeId: "dXl2NdlmeIE",
    duration: "9:15",
    thumbnail: "/Bajrang Baan.jpeg",
    description: "The ecstatic hymn of cosmic energy composed by Ravana praising Shiva's infinite beauty and dance.",
    sacredBenefits: "Cultivates unshakeable willpower, boundless confidence, and emotional focus.",
  },
];

export default function ChantsPage() {
  const [selectedTrack, setSelectedTrack] = useState<SacredTrack | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = SACRED_TRACKS.filter((track) => {
    const matchesCategory =
      selectedCategory === "all" || track.category === selectedCategory;
    const matchesQuery =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.deity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Titles */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 border border-amber-300/60 px-3.5 py-1.5 rounded-full shadow-xs">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Sacred Mantras & Chalisas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#381014] tracking-tight">
            Divine Chants & Stotrams
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Recite and listen to the world&apos;s most revered devotional recordings.
            Compliantly rendered with dedicated in-app playback and full seek controls.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Chants" },
              { id: "chalisa", label: "Chalisas" },
              { id: "mantra", label: "Vedic Mantras" },
              { id: "stotram", label: "Stotrams" },
              { id: "aarti", label: "Aartis" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? "bg-amber-900 text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search deity or mantra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail with Play Hover */}
                <div
                  onClick={() => setSelectedTrack(track)}
                  className="relative aspect-video w-full overflow-hidden cursor-pointer bg-stone-900"
                >
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono rounded">
                    {track.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                      {track.deity}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase font-medium">
                      {track.category}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#250F13] group-hover:text-amber-800 transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-[11px] text-stone-500 font-medium">
                    {track.artist}
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {track.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-amber-900/5 text-[11px] text-stone-600">
                    <span className="font-bold text-amber-950">Blessing: </span>
                    {track.sacredBenefits}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedTrack(track)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2A1114] to-[#3B171C] hover:from-[#3D181D] hover:to-[#4D1E24] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>Watch & Sing Along</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {selectedTrack && (
          <VideoPlayerModal
            track={selectedTrack}
            onClose={() => setSelectedTrack(null)}
          />
        )}

      </div>
    </div>
  );
}

function VideoPlayerModal({
  track,
  onClose,
}: {
  track: SacredTrack;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentTimeRef = useRef(0);
  currentTimeRef.current = currentTime;

  const sendCommand = useCallback((func: string, args: (string | number | boolean)[] = []) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      sendCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendCommand("playVideo");
      setIsPlaying(true);
    }
  };

  const seekBy = (seconds: number) => {
    const targetTime = Math.max(0, Math.min(duration || 9999, currentTimeRef.current + seconds));
    setCurrentTime(targetTime);
    sendCommand("seekTo", [targetTime, true]);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSeekCommit = () => {
    setIsSeeking(false);
    sendCommand("seekTo", [currentTimeRef.current, true]);
  };

  // Sync state and listen to YouTube PostMessage events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (!data) return;

        // Sync duration & playback state from YouTube events
        if (data.event === "infoDelivery" && data.info) {
          if (typeof data.info.duration === "number") {
            setDuration(data.info.duration);
          }
          if (typeof data.info.currentTime === "number" && !isSeeking) {
            setCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.playerState === "number") {
            // 1 = Playing, 2 = Paused, 0 = Ended
            if (data.info.playerState === 1) setIsPlaying(true);
            if (data.info.playerState === 2) setIsPlaying(false);
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);

    // Initial setup handshakes
    const timer = setInterval(() => {
      sendCommand("listening");
    }, 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(timer);
    };
  }, [sendCommand, isSeeking]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#1A0A0C] border border-amber-900/50 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#230E11] border-b border-white/10 flex items-center justify-between text-white">
          <div>
            <h3 className="font-serif font-bold text-base text-amber-200">
              {track.title}
            </h3>
            <p className="text-[11px] text-stone-300">
              {track.deity} • {track.artist}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage with Pointer Block */}
        <div className="relative aspect-video w-full bg-black overflow-hidden group select-none">
          {/* YouTube player isolated with pointer-events-none */}
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
            title={track.title}
            className="w-full h-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          />

          {/* Transparent Tap Shield: toggle play/pause without leaving app */}
          <div
            onClick={togglePlay}
            className="absolute inset-0 cursor-pointer flex items-center justify-center bg-transparent z-10"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-amber-600/95 text-white flex items-center justify-center shadow-2xl transition-transform transform scale-100 hover:scale-105">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
            )}
          </div>

          {/* Sealed In-App Custom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 pointer-events-auto space-y-2">
            
            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-amber-200 w-11 text-right shrink-0">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min={0}
                max={duration || 100}
                step={1}
                value={currentTime}
                onMouseDown={() => setIsSeeking(true)}
                onTouchStart={() => setIsSeeking(true)}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />

              <span className="text-[11px] font-mono text-stone-400 w-11 shrink-0">
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback Buttons: -10s, Play/Pause, +10s */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-2">
                {/* Rewind 10 seconds */}
                <button
                  type="button"
                  onClick={() => seekBy(-10)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Rewind 10 Seconds"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">10s</span>
                </button>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Forward 10 seconds */}
                <button
                  type="button"
                  onClick={() => seekBy(10)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Forward 10 Seconds"
                >
                  <span className="text-[10px] font-mono">10s</span>
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                In-App Player
              </span>
            </div>

          </div>
        </div>

        {/* Modal Footer Description */}
        <div className="p-4 sm:p-5 text-xs text-stone-300 bg-[#1A0A0C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
          <p className="text-stone-400 leading-relaxed max-w-xl">
            {track.description}
          </p>
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dedicated App Player</span>
          </div>
        </div>

      </div>
    </div>
  );
}