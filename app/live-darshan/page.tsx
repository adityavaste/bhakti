"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Radio,
    Flame,
    Volume2,
    VolumeX,
    Maximize2,
    Users,
    Clock,
    Sparkles,
    Search,
    Bell,
    Share2,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    Filter,
    Grid2X2,
    Square,
    X,
} from "lucide-react";

// --- Type Definitions ---

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
}

export interface OfferingParticle {
    id: number;
    type: "flower" | "diya";
    symbol: string;
    left: number;
    bottom: number;
}

// Extend Window interface for Safari webkitAudioContext support
declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

// --- Verified Sample Data ---

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
        thumbnail: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
        embedUrl: "https://www.youtube.com/embed/zIlth8iGL_w",
        officialYoutube: "https://www.youtube.com/live/zIlth8iGL_w",
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
        thumbnail: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
       embedUrl: "https://www.youtube.com/embed/WPZ0xL0-sKs",
officialYoutube: "https://www.youtube.com/live/WPZ0xL0-sKs?si=N2dC3cm2_KTcvjEk",
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
        thumbnail: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80",
  embedUrl: "https://www.youtube.com/embed/EMMWSBPvbrE",
officialYoutube: "https://www.youtube.com/live/EMMWSBPvbrE?si=IxMcBUejl_04bncr",
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
        id: "siddhivinayak-mumbai",
        name: "Shree Siddhivinayak Ganapati Mandir",
        deity: "Lord Ganesha",
        category: "Ganesha",
        city: "Mumbai",
        state: "Maharashtra",
        live: true,
        currentRitual: "Sandhya Dhoop Aarti",
        viewers: 19540,
        verifiedTrust: "Shree Siddhivinayak Temple Trust (Prabhadevi)",
        thumbnail: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
        embedUrl: "https://www.youtube.com/embed/oWdSHxrwcBI",
officialYoutube: "https://www.youtube.com/live/oWdSHxrwcBI?si=EzenLmAlPVsLWzTO",
        aartis: [
            { name: "Kakad Aarti", time: "05:30 AM", completed: true },
            { name: "Shree Darshan", time: "06:00 AM", completed: true },
            { name: "Naivedhya", time: "12:15 PM", completed: true },
            { name: "Sandhya Aarti", time: "07:30 PM", completed: false, current: true },
            { name: "Shej Aarti", time: "09:50 PM", completed: false },
        ],
        about: "Fulfiller of vows (Navasacha Ganapati), situated in Prabhadevi, Mumbai.",
    },
    {
        id: "shirdi-sai-baba",
        name: "Shirdi Sai Baba Sansthan",
        deity: "Sai Baba",
        category: "Universal",
        city: "Shirdi",
        state: "Maharashtra",
        live: true,
        currentRitual: "Dhoop Aarti Darshan",
        viewers: 34200,
        verifiedTrust: "Shri Saibaba Sansthan Trust, Shirdi",
        thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
        embedUrl: "https://www.youtube.com/embed/MHEqo6oOwWE",
officialYoutube: "https://www.youtube.com/live/MHEqo6oOwWE?si=HJo3ZlcNMtxy8YJJ",
        aartis: [
            { name: "Kakad Aarti", time: "04:30 AM", completed: true },
            { name: "Madhyan Aarti", time: "12:00 PM", completed: true },
            { name: "Dhoop Aarti", time: "Sunset", completed: false, current: true },
            { name: "Shej Aarti", time: "10:30 PM", completed: false },
        ],
        about: "Samadhi Mandir of Sai Baba, preaching universal harmony and devotion.",
    },
    {
        id: "jagannath-puri",
        name: "Shree Jagannath Temple",
        deity: "Lord Jagannath, Balabhadra & Subhadra",
        category: "Vaishnav",
        city: "Puri",
        state: "Odisha",
        live: false,
        currentRitual: "Garbhagriha Rites (Private)",
        viewers: 0,
        verifiedTrust: "Shree Jagannath Temple Administration (SJTA)",
        thumbnail: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
        embedUrl: "https://www.youtube.com/embed/1aAU3moRfGw",
officialYoutube: "https://www.youtube.com/live/1aAU3moRfGw?si=A7E7Pq-fU2WQXyWq",
        aartis: [
            { name: "Mangala Alati", time: "05:00 AM", completed: true },
            { name: "Mailam", time: "06:00 AM", completed: true },
            { name: "Sandhya Dhupa", time: "07:00 PM", completed: false },
            { name: "Badasinghar Bhoga", time: "11:00 PM", completed: false },
        ],
        about: "Ancient Chardham Dham sanctum on the coast of the Bay of Bengal.",
    },
];

export default function LiveDarshanPage() {
    const [selectedTemple, setSelectedTemple] = useState<Temple>(TEMPLES_DATA[0]);
    const [secondaryTemple, setSecondaryTemple] = useState<Temple | null>(TEMPLES_DATA[1]);
    const [viewMode, setViewMode] = useState<"single" | "split">("single");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [offerings, setOfferings] = useState<OfferingParticle[]>([]);
    const [offeringCount, setOfferingCount] = useState<number>(1428);
    const [reminderModalOpen, setReminderModalOpen] = useState<boolean>(false);
    const [selectedAartiReminder, setSelectedAartiReminder] = useState<string | null>(null);
    const [reminderSuccess, setReminderSuccess] = useState<boolean>(false);

    // Audio Context Ref with strict typing
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Synthesize Temple Bell using Web Audio API
    const playTempleBell = (): void => {
        try {
            if (!audioCtxRef.current) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioCtxRef.current = new AudioContextClass();
                }
            }

            const ctx = audioCtxRef.current;
            if (!ctx) return;

            if (ctx.state === "suspended") {
                ctx.resume();
            }

            const now = ctx.currentTime;
            const fundamental = 587.33; // D5 tone
            const harmonics = [1, 2.02, 3.01, 4.25, 5.4];
            const gains = [0.45, 0.28, 0.18, 0.1, 0.05];

            harmonics.forEach((harmonicRatio: number, index: number) => {
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();

                osc.type = index === 0 ? "sine" : "triangle";
                osc.frequency.setValueAtTime(fundamental * harmonicRatio, now);

                const initialGain = gains[index] || 0.1;
                gainNode.gain.setValueAtTime(initialGain, now);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

                osc.connect(gainNode);
                gainNode.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 3.2);
            });
        } catch {
            // Audio autoplay policy fallback
        }
    };

    // Add virtual offering (Pushpa / Diya)
    const handleOffer = (type: "flower" | "diya"): void => {
        playTempleBell();
        const symbol = type === "flower" ? "🌸" : "🪔";
        const newId = Date.now() + Math.random();
        const newOffering: OfferingParticle = {
            id: newId,
            type,
            symbol,
            left: 15 + Math.random() * 70,
            bottom: 20,
        };

        setOfferings((prev: OfferingParticle[]) => [...prev, newOffering]);
        setOfferingCount((count: number) => count + 1);

        setTimeout(() => {
            setOfferings((prev: OfferingParticle[]) =>
                prev.filter((item: OfferingParticle) => item.id !== newId)
            );
        }, 2400);
    };

    // Filter temples safely
    const filteredTemples: Temple[] = TEMPLES_DATA.filter((temple: Temple) => {
        const matchesQuery =
            temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            temple.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            temple.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
            temple.state.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            activeCategory === "All" || temple.category === activeCategory;

        return matchesQuery && matchesCategory;
    });

    const categories = [
        "All",
        "Vaishnav",
        "Shaiv / Jyotirlinga",
        "Devi / Shakti",
        "Ganesha",
        "Universal",
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Breadcrumb & Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#F0E6D8] pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                            <Link href="/" className="hover:underline">Home</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span>Live Darshan Sanctuary</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1214] mt-1">
                            Live Sanctum Darshan
                        </h1>
                        <p className="text-sm text-[#6B5548] mt-1">
                            Official live streams from sacred shrines across India. Offer pushpa, ring temple bells, and join ongoing aartis.
                        </p>
                    </div>

                    {/* View switcher */}
                    <div className="flex items-center gap-2 self-start md:self-auto bg-[#F4EDE3] p-1.5 rounded-xl border border-[#E9DFD0]">
                        <button
                            type="button"
                            onClick={() => setViewMode("single")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === "single"
                                ? "bg-white text-amber-950 shadow-sm font-semibold"
                                : "text-[#6A574A] hover:text-[#2A1214]"
                                }`}
                        >
                            <Square className="w-3.5 h-3.5" />
                            <span>Single Sanctum</span>
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
                            <span>Dual Darshan</span>
                        </button>
                    </div>
                </div>

                {/* Live Stage Theatre */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Video Viewport(s) - 8 cols */}
                    <div className="lg:col-span-8 space-y-4">

                        <div
                            className={`grid gap-4 ${viewMode === "split" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                                }`}
                        >
                            {/* Primary Temple Screen */}
                            <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-900/30 group">

                                {/* Floating Offering Particles */}
                                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                                    {offerings.map((offering: OfferingParticle) => (
                                        <span
                                            key={offering.id}
                                            style={{
                                                left: `${offering.left}%`,
                                                bottom: `${offering.bottom}%`,
                                            }}
                                            className="absolute text-3xl select-none animate-bounce transition-all duration-1000 ease-out"
                                        >
                                            {offering.symbol}
                                        </span>
                                    ))}
                                </div>

                                {/* Video / Fallback Area */}
                                <div className="aspect-video w-full bg-[#180A0B] relative flex items-center justify-center">
                                    {selectedTemple.live && selectedTemple.embedUrl ? (
                                        <iframe
                                            key={selectedTemple.id}
                                            src={`${selectedTemple.embedUrl}${selectedTemple.embedUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
                                            title={`${selectedTemple.name} Live Stream`}
                                            className="h-full w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
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
                                                    Live broadcast resumes during the upcoming scheduled aarti. You can still visit the verified trust channel.
                                                </p>
                                                <a
                                                    href={selectedTemple.officialYoutube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                                                >
                                                    <span>Open Official YouTube Feed</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Overlaid Badges */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                                        {selectedTemple.live ? (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/95 backdrop-blur-sm text-white text-xs font-bold tracking-wide shadow-md">
                                                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                                LIVE
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-full bg-stone-800/90 backdrop-blur-sm text-stone-300 text-xs font-medium">
                                                SCHEDULED
                                            </span>
                                        )}
                                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/90 text-xs flex items-center gap-1">
                                            <Users className="w-3 h-3 text-amber-400" />
                                            {selectedTemple.viewers.toLocaleString()} Devotees
                                        </span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-20 pointer-events-none">
                                        <span className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 font-medium">
                                            {selectedTemple.currentRitual}
                                        </span>
                                    </div>
                                </div>

                                {/* Primary Temple Header info under video */}
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

                                    {/* Devotional Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={playTempleBell}
                                            className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                                            title="Ring the Sacred Temple Bell"
                                        >
                                            <span>🔔</span>
                                            <span className="hidden sm:inline">Ring Bell</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleOffer("flower")}
                                            className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                                            title="Offer Pushpa"
                                        >
                                            <span>🌸</span>
                                            <span>Pushpa</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleOffer("diya")}
                                            className="px-3 py-1.5 bg-amber-500/30 hover:bg-amber-500/50 text-amber-100 border border-amber-400/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                                            title="Offer Deepam"
                                        >
                                            <span>🪔</span>
                                            <span>Diya</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Temple Screen (Only in Split View) */}
                            {viewMode === "split" && secondaryTemple && (
                                <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-900/30 flex flex-col justify-between">
                                    <div className="aspect-video w-full bg-[#180A0B] relative flex items-center justify-center">
                                        {secondaryTemple.live && secondaryTemple.embedUrl ? (
                                            <iframe
                                                src={`${secondaryTemple.embedUrl}&autoplay=1&mute=1`}
                                                title={`${secondaryTemple.name} Dual View`}
                                                className="w-full h-full border-0"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="p-4 text-center text-white space-y-2">
                                                <p className="font-serif font-semibold">{secondaryTemple.name}</p>
                                                <p className="text-xs text-stone-400">Stream in ritual transition</p>
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-[10px] font-bold text-white">
                                            LIVE 2
                                        </div>
                                    </div>

                                    <div className="p-3 bg-[#230D0F] text-white flex items-center justify-between">
                                        <div>
                                            <p className="font-serif text-sm font-semibold truncate max-w-[180px]">
                                                {secondaryTemple.name}
                                            </p>
                                            <p className="text-[11px] text-[#C4B2A5]">
                                                {secondaryTemple.city}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextIndex =
                                                    (TEMPLES_DATA.findIndex((t: Temple) => t.id === secondaryTemple.id) + 1) %
                                                    TEMPLES_DATA.length;
                                                setSecondaryTemple(TEMPLES_DATA[nextIndex]);
                                            }}
                                            className="text-xs text-amber-300 hover:underline"
                                        >
                                            Switch
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Daily Aarti Schedule Card */}
                        <div className="bg-[#FAF5EE] rounded-2xl p-5 border border-[#EFE4D6]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-700" />
                                    <h3 className="font-serif font-bold text-base text-[#2D1609]">
                                        Daily Aarti & Ritual Timings — {selectedTemple.name}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setReminderModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    <Bell className="w-3.5 h-3.5 text-amber-800" />
                                    <span>Set Aarti Reminder</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {selectedTemple.aartis.map((aarti: AartiItem, index: number) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-xl border text-center transition-all ${aarti.current
                                            ? "bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500"
                                            : aarti.completed
                                                ? "bg-[#F3EBE0]/60 border-[#E5DACB] opacity-75"
                                                : "bg-white border-[#EADECC]"
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-[#32170D] truncate">
                                            {aarti.name}
                                        </div>
                                        <div className="text-sm font-serif font-semibold text-amber-900 mt-1">
                                            {aarti.time}
                                        </div>
                                        <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider">
                                            {aarti.current ? (
                                                <span className="text-amber-700 inline-flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                                                    Ongoing
                                                </span>
                                            ) : aarti.completed ? (
                                                <span className="text-stone-500">Completed</span>
                                            ) : (
                                                <span className="text-amber-800/80">Upcoming</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Sidebar: Temple Directory List (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">

                        {/* Search and Category Filter Box */}
                        <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#EFE4D6] space-y-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-amber-800/60 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search temple, deity, or city..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full bg-white pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5D7C5] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                />
                            </div>

                            {/* Categories Pills */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                                {categories.map((cat: string) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setActiveCategory(cat)}
                                        className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors ${activeCategory === cat
                                            ? "bg-amber-800 text-white font-medium"
                                            : "bg-white text-[#523E32] hover:bg-amber-100/60 border border-[#E7DAC9]"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List of Sacred Temples */}
                        <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                            {filteredTemples.length === 0 ? (
                                <div className="text-center py-10 bg-[#FAF5EE] rounded-xl border border-[#EFE4D6]">
                                    <p className="text-xs text-[#7A6658]">No temples match your search.</p>
                                </div>
                            ) : (
                                filteredTemples.map((temple: Temple) => {
                                    const isSelected = selectedTemple.id === temple.id;

                                    return (
                                        <button
                                            key={temple.id}
                                            type="button"
                                            onClick={() => setSelectedTemple(temple)}
                                            className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center gap-3 border ${isSelected
                                                ? "bg-[#351417] text-white border-amber-700 shadow-md scale-[1.01]"
                                                : "bg-white hover:bg-[#FDF9F3] text-[#2C180E] border-[#EADFCF]"
                                                }`}
                                        >
                                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                                                <img
                                                    src={temple.thumbnail}
                                                    alt={temple.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {temple.live && (
                                                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h4 className="font-serif font-bold text-sm truncate">
                                                        {temple.name}
                                                    </h4>
                                                    {temple.live ? (
                                                        <span
                                                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isSelected
                                                                ? "bg-red-500 text-white"
                                                                : "bg-red-100 text-red-600"
                                                                }`}
                                                        >
                                                            Live
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-stone-400">Offline</span>
                                                    )}
                                                </div>

                                                <p
                                                    className={`text-xs truncate ${isSelected ? "text-amber-200" : "text-amber-800"
                                                        }`}
                                                >
                                                    {temple.deity}
                                                </p>
                                                <p
                                                    className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-[#C7B3A3]" : "text-[#7B675A]"
                                                        }`}
                                                >
                                                    {temple.city}, {temple.state}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Community Darshan Stats */}
                        <div className="bg-[#FAF5EE] rounded-xl p-4 border border-[#EFE4D6] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🌸</span>
                                <div>
                                    <div className="font-bold text-[#2E180F]">
                                        {offeringCount.toLocaleString()} Offerings Today
                                    </div>
                                    <div className="text-[11px] text-[#7A675B]">
                                        Devotees sending flowers & diyas
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Aarti Reminder Modal */}
            {reminderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#FAF5EE] border border-[#E8DEC9] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => {
                                setReminderModalOpen(false);
                                setReminderSuccess(false);
                            }}
                            className="absolute top-4 right-4 text-[#654E41] hover:text-[#281308]"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2.5 text-amber-800 mb-2">
                            <Bell className="w-5 h-5" />
                            <h3 className="font-serif font-bold text-lg text-[#2A1315]">
                                Set Aarti Reminder
                            </h3>
                        </div>

                        <p className="text-xs text-[#6B574A] mb-4">
                            Select an aarti for <strong>{selectedTemple.name}</strong> to receive a digital notification before sacred rites begin.
                        </p>

                        {reminderSuccess ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                <h4 className="text-sm font-bold text-emerald-900">
                                    Reminder Scheduled!
                                </h4>
                                <p className="text-xs text-emerald-700">
                                    You will receive a notification 10 minutes prior to {selectedAartiReminder}.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReminderModalOpen(false);
                                        setReminderSuccess(false);
                                    }}
                                    className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {selectedTemple.aartis.map((aarti: AartiItem, idx: number) => (
                                        <label
                                            key={idx}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-colors ${selectedAartiReminder === aarti.name
                                                ? "bg-amber-100 border-amber-600 text-amber-950 font-semibold"
                                                : "bg-white border-[#EADFCF] hover:bg-[#F6EFE5]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="radio"
                                                    name="aartiSelection"
                                                    value={aarti.name}
                                                    checked={selectedAartiReminder === aarti.name}
                                                    onChange={() => setSelectedAartiReminder(aarti.name)}
                                                    className="accent-amber-600"
                                                />
                                                <span>{aarti.name}</span>
                                            </div>
                                            <span className="font-serif text-amber-900">{aarti.time}</span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    disabled={!selectedAartiReminder}
                                    onClick={() => setReminderSuccess(true)}
                                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                                >
                                    Confirm Aarti Alert
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}