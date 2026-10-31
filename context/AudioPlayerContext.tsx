"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

export interface RadioStation {
  id: string;
  name: string;
  category: string;
  streamUrl: string;
  deity: string;
  artwork: string;
  description: string;
}
// Inside context/AudioPlayerContext.tsx

// 1. Clean, verified streams that work across all mobile & desktop browsers
export const STATIONS: RadioStation[] = [
  {
    id: "sanctum-flute",
    name: "Sanctum Bansuri & Tanpura",
    category: "Ambient Meditation",
    streamUrl: "/audio/bansuri-flute.mp3", // Served directly from your own domain!
    deity: "Universal Divine",
    artwork: "https://images.unsplash.com/photo-1609803384069-1cac59620400?q=80&w=400&auto=format&fit=crop",
    description: "Deep, calming bamboo flute and tanpura resonance for peaceful contemplation.",
  },
  {
    id: "om-chant",
    name: "Sacred Om Meditation",
    category: "Mantras & Peace",
    streamUrl: "/audio/om-chant.mp3",
    deity: "Lord Shiva",
    artwork: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=400&auto=format&fit=crop",
    description: "Continuous peaceful Om vibrations to quiet the mind.",
  },
  {
    id: "gayatri-mantra",
    name: "Akhand Gayatri Mantra",
    category: "Vedic Chants",
    streamUrl: "/audio/gayatri-mantra.mp3",
    deity: "Mother Gayatri",
    artwork: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=400&auto=format&fit=crop",
    description: "Sacred recitation of the Gayatri Mahamantra.",
  },
];

interface AudioContextType {
  currentStation: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  playStation: (station: RadioStation) => void;
  togglePlay: () => void;
  sleepTimerMinutes: number | null;
  setSleepTimer: (minutes: number | null) => void;
}

const AudioPlayerContext = createContext<AudioContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<RadioStation>(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize standard audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, []);

  // Update Native Lock-Screen MediaSession Controls
  const updateMediaSession = useCallback((station: RadioStation) => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: `${station.deity} • Bhakti Sacred Radio`,
        album: station.category,
        artwork: [
          { src: station.artwork, sizes: "512x512", type: "image/png" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play().catch(() => {});
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
      });
    }
  }, []);
const playStation = useCallback(
    (station: RadioStation) => {
      const audio = audioRef.current;
      if (!audio) return;

      setIsLoading(true);
      setCurrentStation(station);

      // Cleanly stop any existing playback
      try {
        audio.pause();
      } catch {}

      // DO NOT set audio.crossOrigin = "anonymous" for media streams!
      audio.removeAttribute("crossorigin");

      // Prepare new stream
      audio.src = station.streamUrl;
      audio.loop = true;
      audio.preload = "auto";

      // Wait until browser confirms enough audio buffer is ready to play
      const handleCanPlay = () => {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            updateMediaSession(station);
          })
          .catch((err) => {
            console.warn("Autoplay or source error:", err);
            setIsLoading(false);
            setIsPlaying(false);
          });
      };

      // Use one-time event listener for smooth initialization
      audio.addEventListener("canplay", handleCanPlay, { once: true });
      audio.load();
    },
    [updateMediaSession]
  );
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!audioRef.current.src || audioRef.current.src === "") {
        playStation(currentStation);
      } else {
        setIsLoading(true);
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            updateMediaSession(currentStation);
          })
          .catch(() => {
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    }
  }, [isPlaying, currentStation, playStation, updateMediaSession]);

  // Sleep Timer Countdown
  const setSleepTimer = (minutes: number | null) => {
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    setSleepTimerMinutes(minutes);

    if (minutes && minutes > 0) {
      timerTimeoutRef.current = setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
        setSleepTimerMinutes(null);
      }, minutes * 60 * 1000);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        isLoading,
        playStation,
        togglePlay,
        sleepTimerMinutes,
        setSleepTimer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}