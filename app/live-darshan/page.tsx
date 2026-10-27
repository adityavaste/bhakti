"use client";

import LiveStreamPlayer from "@/components/darshan/LiveStreamPlayer";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Sparkles,
  Search,
  Bell,
  BellRing,
  VolumeX,
  Eye,
  ExternalLink,
  ChevronRight,
  Grid2X2,
  Square,
  PlayCircle,
} from "lucide-react";

// --- Types ---
export interface AartiItem {
  name: string;
  time: string;
  completed: boolean;
  current?: boolean;
}

export interface Temple {
  id: string;
  name: string;
  deity: string;
  category: "Vaishnav" | "Shaiv / Jyotirlinga" | "Devi / Shakti" | "Ganesha" | "Universal";
  city: string;
  state: string;
  live: boolean;
  currentRitual: string;
  viewers: number;
  verifiedTrust: string;
  thumbnail: string;
  embedUrl: string;
  officialYoutube: string;
  aartis: AartiItem[];
  about: string;
  channelId?: string;
  fallbackVideoId: string;
}

export interface ActiveAlarm {
  id: string; // templeId + "-" + aartiName
  templeId: string;
  templeName: string;
  deity: string;
  aartiName: string;
  timeStr: string; // e.g. "09:15 PM" or "04:30 AM"
  enabled: boolean;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// --- Sample Data ---
const TEMPLES_DATA: Temple[] = [
  {
    id: "pandharpur-vitthal",
    name: "Shri Vitthal Rukmini Mandir",
    deity: "Lord Vitthal & Mother Rukmini",
    category: "Vaishnav",
    city: "Pandharpur",
    state: "Maharashtra",
    live: true,
    currentRitual: "Dhoop Aarti & Darshan",
    viewers: 28420,
    verifiedTrust: "Shree Vitthal Rukmini Mandir Samiti",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPRe_AbXY_qOx7le34fmCagoX5K436IYKzJBvIiKqUw&s=10",
    embedUrl: "https://www.youtube.com/embed/d0T2EtIUB3E",
    officialYoutube: "https://www.youtube.com/live/0VfT9g20lMY",
    channelId: "UC4QBKRPvGu_jN8FsOXwGSzQ",
    fallbackVideoId: "0VfT9g20lMY",
    aartis: [
      { name: "Kakad Aarti", time: "04:30 AM", completed: true },
      { name: "Panchamrut Snan", time: "06:00 AM", completed: true },
      { name: "Madhyanha Bhog", time: "11:00 AM", completed: true },
      { name: "Dhoop Aarti", time: "06:30 PM", completed: false, current: true },
      { name: "Shej Aarti", time: "10:30 PM", completed: false },
    ],
    about: "The primary spiritual sanctum of the Varkari tradition on the banks of Chandrabhaga.",
  },
  {
    id: "kashi-vishwanath",
    name: "Shri Kashi Vishwanath Dham",
    deity: "Lord Shiva (Jyotirlinga)",
    category: "Shaiv / Jyotirlinga",
    city: "Varanasi",
    state: "Uttar Pradesh",
    live: true,
    currentRitual: "Sandhya Shringar & Ganga Aaradhana",
    viewers: 45110,
    verifiedTrust: "Shri Kashi Vishwanath Temple Trust",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz66Z0-lfOltyDPYmHbwKiz-aQVqiLDqZz6ZDWHbp2tA&s=10",
    embedUrl: "https://www.youtube.com/embed/WPZ0xL0-sKs",
    officialYoutube: "https://www.youtube.com/live/WPZ0xL0-sKs",
    channelId: "UC6v3e7eS-kH_F9mRjG15t6g",
    fallbackVideoId: "WPZ0xL0-sKs",
    aartis: [
      { name: "Mangala Aarti", time: "03:00 AM", completed: true },
      { name: "Bhog Aarti", time: "11:30 AM", completed: true },
      { name: "Sandhya Aarti", time: "07:00 PM", completed: false, current: true },
      { name: "Shringar Aarti", time: "09:00 PM", completed: false },
      { name: "Shayan Aarti", time: "10:30 PM", completed: false },
    ],
    about: "One of the most sacred of the twelve Jyotirlingas, situated on the western bank of the holy Ganges.",
  },
  {
    id: "tirupati-balaji",
    name: "Tirumala Venkateswara Temple",
    deity: "Lord Sri Venkateswara",
    category: "Vaishnav",
    city: "Tirupati",
    state: "Andhra Pradesh",
    live: true,
    currentRitual: "Sarvadarsanam & Sahasra Deepalankara",
    viewers: 62800,
    verifiedTrust: "Tirumala Tirupati Devasthanams (TTD)",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-ipMhrWS3b4kGIbV3IYINZ11IuETufiX4c5g_FLCuqQ&s=10",
    embedUrl: "https://www.youtube.com/embed/EMMWSBPvbrE",
    officialYoutube: "https://www.youtube.com/live/EMMWSBPvbrE",
    channelId: "UCoj525WIszT7Mnp7seDPsTA",
    fallbackVideoId: "EMMWSBPvbrE",
    aartis: [
      { name: "Suprabhatam", time: "03:00 AM", completed: true },
      { name: "Thomala Seva", time: "05:30 AM", completed: true },
      { name: "Archana", time: "06:30 AM", completed: true },
      { name: "Deepalankara Seva", time: "05:30 PM", completed: false, current: true },
      { name: "Ekanta Seva", time: "11:00 PM", completed: false },
    ],
    about: "Kali Yuga Vaikuntha located on the sacred seven hills of Seshachalam in Tirumala.",
  },
  {
    id: "shirdi-sai-baba",
    name: "Shri Saibaba Sansthan",
    deity: "Shirdi Sai Baba",
    category: "Universal",
    city: "Shirdi",
    state: "Maharashtra",
    live: true,
    currentRitual: "Live Samadhi Mandir Darshan",
    viewers: 62800,
    verifiedTrust: "Shri Saibaba Sansthan Trust (Shirdi)",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-ipMhrWS3b4kGIbV3IYINZ11IuETufiX4c5g_FLCuqQ&s=10",
embedUrl: "https://www.youtube.com/embed/n40cgPVVViE",
officialYoutube: "https://www.youtube.com/live/n40cgPVVViE?si=88dbWkriA1_XH8U2",
    channelId: "UCoj525WIszT7Mnp7seDPsTA",
    fallbackVideoId: "EMMWSBPvbrE",
    aartis: [
      { name: "Kakad Aarti", time: "04:30 AM", completed: true },
      { name: "Madhyan Aarti", time: "12:00 PM", completed: false, current: true },
      { name: "Dhoop Aarti", time: "sunset", completed: false },
      { name: "Shej Aarti", time: "10:00 PM", completed: false },
    ],
    about: "The sacred Samadhi Mandir of Shri Sai Baba in Shirdi, visited by millions of devotees worldwide for eternal peace and blessings.",
  },
];

// Helper to convert time string to 24hr format
function formatTimeTo24H(timeStr: string): string | null {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

export default function LiveDarshanPage() {
  const [selectedTemple, setSelectedTemple] = useState<Temple>(TEMPLES_DATA[0]);
  const [secondaryTemple, setSecondaryTemple] = useState<Temple>(TEMPLES_DATA[1]);
  const [viewMode, setViewMode] = useState<"single" | "split">("single");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Alarms State
  const [alarms, setAlarms] = useState<ActiveAlarm[]>([]);
  const [ringingAlarm, setRingingAlarm] = useState<ActiveAlarm | null>(null);
  const lastFiredMinuteRef = useRef<string>("");

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundLoopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ensureAudioUnlocked = () => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) {
          audioCtxRef.current = new AudioClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.error("Audio unlock error:", e);
    }
  };

  const playBellChime = useCallback(() => {
    try {
      ensureAudioUnlocked();
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "closed") return;

      const now = ctx.currentTime;
      const fundamental = 587.33; // Sacred D5 chime
      const harmonics = [1, 2.02, 3.01, 4.25];
      const gains = [0.4, 0.25, 0.15, 0.08];

      harmonics.forEach((ratio, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(fundamental * ratio, now);

        gainNode.gain.setValueAtTime(gains[idx], now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.8);
      });
    } catch (e) {
      console.error("Play chime error:", e);
    }
  }, []);

  const startAlarmSound = useCallback(() => {
    playBellChime();
    if (soundLoopIntervalRef.current) clearInterval(soundLoopIntervalRef.current);
    soundLoopIntervalRef.current = setInterval(playBellChime, 1400);
  }, [playBellChime]);

  const stopAlarm = useCallback(() => {
    if (soundLoopIntervalRef.current) {
      clearInterval(soundLoopIntervalRef.current);
      soundLoopIntervalRef.current = null;
    }
    setRingingAlarm(null);
  }, []);

  const triggerAlarm = useCallback(
    (alarm: ActiveAlarm) => {
      setRingingAlarm(alarm);
      startAlarmSound();

      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([500, 250, 500, 250, 1000]);
      }

      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(`🔔 Aarti Alarm: ${alarm.aartiName}`, {
            body: `${alarm.aartiName} at ${alarm.templeName} is starting now (${alarm.timeStr})!`,
            requireInteraction: true,
          });
        }
      }
    },
    [startAlarmSound]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("divine_alarms_v2");
      if (saved) setAlarms(JSON.parse(saved));
    } catch { }
  }, []);

  const saveAlarms = (updated: ActiveAlarm[]) => {
    setAlarms(updated);
    try {
      localStorage.setItem("divine_alarms_v2", JSON.stringify(updated));
    } catch { }
  };

  const toggleAlarm = async (
    templeId: string,
    templeName: string,
    deity: string,
    aartiName: string,
    timeStr: string
  ) => {
    ensureAudioUnlocked();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }

    const alarmId = `${templeId}-${aartiName}`;
    const exists = alarms.find((a) => a.id === alarmId);

    if (exists) {
      const updated = alarms.map((a) =>
        a.id === alarmId ? { ...a, enabled: !a.enabled } : a
      );
      saveAlarms(updated);
    } else {
      const newAlarm: ActiveAlarm = {
        id: alarmId,
        templeId,
        templeName,
        deity,
        aartiName,
        timeStr,
        enabled: true,
      };
      saveAlarms([...alarms, newAlarm]);
    }
  };

  const isAlarmActive = (templeId: string, aartiName: string) => {
    const item = alarms.find((a) => a.id === `${templeId}-${aartiName}`);
    return Boolean(item && item.enabled);
  };

  const testAlarmIn5Seconds = () => {
    ensureAudioUnlocked();
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    setTimeout(() => {
      triggerAlarm({
        id: "test-alarm",
        templeId: selectedTemple.id,
        templeName: selectedTemple.name,
        deity: selectedTemple.deity,
        aartiName: "Test Aarti Verification",
        timeStr: "Now",
        enabled: true,
      });
    }, 5000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHH = String(now.getHours()).padStart(2, "0");
      const currentMM = String(now.getMinutes()).padStart(2, "0");
      const current24H = `${currentHH}:${currentMM}`;

      if (lastFiredMinuteRef.current === current24H) return;

      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;
        const alarm24H = formatTimeTo24H(alarm.timeStr);
        if (alarm24H === current24H) {
          lastFiredMinuteRef.current = current24H;
          triggerAlarm(alarm);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, triggerAlarm]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#F0E6D8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Live Darshan Sanctuary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1214] mt-1">
              Live Darshan
            </h1>
            <p className="text-sm text-[#6B5548] mt-1">
              Watch official live feeds, offer pushpa, ring temple bells, and set guaranteed aarti alarms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={testAlarmIn5Seconds}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-300 border border-amber-400 transition-all shadow-xs"
              title="Rings an alarm in exactly 5 seconds to verify sound and pop-ups"
            >
              <PlayCircle className="w-4 h-4 text-amber-900" />
              <span>Test Alarm (5s)</span>
            </button>

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-[#F4EDE3] p-1.5 rounded-xl border border-[#E9DFD0]">
              <button
                type="button"
                onClick={() => setViewMode("single")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === "single"
                    ? "bg-white text-amber-950 shadow-sm font-semibold"
                    : "text-[#6A574A] hover:text-[#2A1214]"
                  }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Single</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === "split"
                    ? "bg-white text-amber-950 shadow-sm font-semibold"
                    : "text-[#6A574A] hover:text-[#2A1214]"
                  }`}
              >
                <Grid2X2 className="w-3.5 h-3.5" />
                <span>Dual</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Theatre & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Primary Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-900/30">
              {/* Video / Fallback Area */}
              <div className="aspect-video w-full bg-[#180A0B] relative flex items-center justify-center">
                {selectedTemple.live && (selectedTemple.embedUrl || selectedTemple.channelId) ? (
                  <LiveStreamPlayer
                    key={selectedTemple.id}
                    templeId={selectedTemple.id}
                    channelId={selectedTemple.channelId}
                    fallbackVideoId={selectedTemple.fallbackVideoId || selectedTemple.embedUrl}
                    title={`${selectedTemple.name} Live Stream`}
                    officialYoutube={selectedTemple.officialYoutube}
                    thumbnail={selectedTemple.thumbnail}
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src={selectedTemple.thumbnail}
                      alt={selectedTemple.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                    />
                    <div className="relative z-10 max-w-md space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/60 text-amber-200 border border-amber-500/30 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Private Sanctum Rites in Progress</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white">
                        {selectedTemple.name}
                      </h3>
                      <p className="text-xs text-[#D5C2B4]">
                        Live broadcast resumes during the upcoming scheduled aarti.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Header Info Below Player */}
              <div className="p-4 bg-[#230D0F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#F7EDE2] flex items-center gap-2">
                    {selectedTemple.name}
                    <span className="text-[11px] font-sans font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedTemple.city}, {selectedTemple.state}
                    </span>
                  </h2>
                  <p className="text-xs text-[#C8B2A4] mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    Verified Source: {selectedTemple.verifiedTrust}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={playBellChime}
                    className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <span>🔔</span>
                    <span>Ring Bell</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Aarti Timetable & Alarms Card */}
            <div className="bg-[#FAF5EE] rounded-2xl p-5 border border-[#EFE4D6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <h3 className="font-serif font-bold text-base text-[#2D1609]">
                    Daily Aarti Timings & Alarms — {selectedTemple.name}
                  </h3>
                </div>
                <span className="text-[11px] text-[#786354]">
                  Click the bell icon to toggle daily ringing alarms
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {selectedTemple.aartis.map((aarti, idx) => {
                  const active = isAlarmActive(selectedTemple.id, aarti.name);

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between ${active
                          ? "bg-amber-100 border-amber-600 ring-2 ring-amber-500/50 shadow-sm"
                          : "bg-white border-[#EADECC]"
                        }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#32170D] truncate">
                          {aarti.name}
                        </div>
                        <div className="text-sm font-serif font-semibold text-amber-900 mt-1">
                          {aarti.time}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#F0E6D8] flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                          {active ? "Alarm Set" : "Scheduled"}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            toggleAlarm(
                              selectedTemple.id,
                              selectedTemple.name,
                              selectedTemple.deity,
                              aarti.name,
                              aarti.time
                            )
                          }
                          title={active ? "Turn Off Alarm" : `Set Alarm for ${aarti.time}`}
                          className={`p-1.5 rounded-lg transition-all ${active
                              ? "bg-red-600 text-white shadow-sm ring-2 ring-red-400/50"
                              : "text-amber-800 hover:bg-amber-100"
                            }`}
                        >
                          <Bell className={`w-3.5 h-3.5 ${active ? "animate-pulse" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#2A1214] px-1">
              Select Holy Shrine
            </h4>
            <div className="space-y-2">
              {TEMPLES_DATA.map((temple) => (
                <button
                  key={temple.id}
                  type="button"
                  onClick={() => {
                    ensureAudioUnlocked();
                    setSelectedTemple(temple);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${selectedTemple.id === temple.id
                      ? "bg-[#351417] text-white border-amber-700 shadow-md"
                      : "bg-white hover:bg-[#FDF9F3] text-[#2C180E] border-[#EADFCF]"
                    }`}
                >
                  <img
                    src={temple.thumbnail}
                    alt={temple.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-sm truncate">{temple.name}</p>
                    <p className="text-xs text-amber-700/80 truncate">{temple.city}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ringing Alarm Screen Overlay */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#FAF5EE] border-2 border-red-500 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40">
                <BellRing className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
                🔔 Sacred Aarti Alarm ({ringingAlarm.timeStr})
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1214]">
                {ringingAlarm.aartiName}
              </h2>
              <p className="text-sm font-medium text-amber-900 mt-1">
                {ringingAlarm.templeName}
              </p>
              <p className="text-xs text-[#7A6456] mt-0.5">{ringingAlarm.deity}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={stopAlarm}
                className="w-full py-3.5 px-4 bg-[#2C1315] hover:bg-black text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>Stop & Dismiss Alarm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}