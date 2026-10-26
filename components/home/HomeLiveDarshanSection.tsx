"use client";

import React, { useState } from "react";
import Link from "next/link";
import LiveStreamPlayer from "@/components/darshan/LiveStreamPlayer";
import {
  Users,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  Radio,
  CheckCircle2,
} from "lucide-react";

export interface HomeTemple {
  id: string;
  name: string;
  city: string;
  state: string;
  tradition: string;
  isLive: boolean;
  isOfficialVerified: boolean;
  viewersCount: string;
  nextAarti: string;
  currentDarshan: string;
  image: string;
  embedVideoId: string;
  officialYoutube?: string;
  officialChannelUrl?: string;
  description: string;
  timings: { name: string; time: string }[];
}

const TEMPLES_DATA: HomeTemple[] = [
  {
    id: "vitthal-pandharpur",
    name: "Shri Vitthal Rukmini Temple",
    city: "Pandharpur",
    state: "Maharashtra",
    tradition: "Vaishnav",
    isLive: true,
    isOfficialVerified: true,
    viewersCount: "18.4K",
    nextAarti: "Kakad Aarti (04:30 AM)",
    currentDarshan: "Nitya Pooja & Mukh Darshan",
    image:
      "https://photos.mytemplemypride.com/ef0566c4-03b9-4186-aeb8-1b55e119a952/89c9c005-649a-4238-8b30-9897a5ea0928.png",
    embedVideoId: "0VfT9g20lMY",
    officialYoutube: "https://www.youtube.com/live/0VfT9g20lMY",
    description:
      "The supreme abode of Lord Vitthal (Vithoba) and Mother Rukmini on the banks of Chandrabhaga river.",
    timings: [
      { name: "Kakad Aarti", time: "04:30 AM" },
      { name: "Panchamrut Pooja", time: "10:45 AM" },
      { name: "Dhoop Aarti", time: "06:45 PM" },
      { name: "Shej Aarti", time: "11:00 PM" },
    ],
  },
  {
    id: "tirupati-balaji",
    name: "Tirumala Venkateswara Swamy Temple",
    city: "Tirupati",
    state: "Andhra Pradesh",
    tradition: "Vaishnav",
    isLive: true,
    isOfficialVerified: true,
    viewersCount: "42.1K",
    nextAarti: "Suprabhatam (03:00 AM)",
    currentDarshan: "Sarva Darshanam Live",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXwsxCKMl_QxmqRbRG_3M_9U3KQLT0MMBIvvjcR49wlQ&s=10",
    embedVideoId: "XxdarKTmJ8c",
    officialYoutube: "https://www.youtube.com/live/XxdarKTmJ8c",
    description:
      "The sacred Seven Hills of Tirumala, abode of Lord Sri Venkateswara (Balaji), Kaliyuga Pratyaksha Daivam.",
    timings: [
      { name: "Suprabhata Seva", time: "03:00 AM" },
      { name: "Thomala Seva", time: "04:30 AM" },
      { name: "Archana", time: "05:30 AM" },
      { name: "Ekanta Seva", time: "11:30 PM" },
    ],
  },
  {
    id: "siddhivinayak-mumbai",
    name: "Shree Siddhivinayak Temple",
    city: "Prabhadevi, Mumbai",
    state: "Maharashtra",
    tradition: "Ganesha",
    isLive: true,
    isOfficialVerified: true,
    viewersCount: "12.8K",
    nextAarti: "Maha Aarti (07:30 PM)",
    currentDarshan: "Charan Sparsh & Abhishek",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAzc2VlWVxP24wLti9GGvqP3SnyfHJ3xrlEnynoV3_Lg&s=10",
    embedVideoId: "oWdSHxrwcBI",
    officialYoutube: "https://www.youtube.com/live/oWdSHxrwcBI",
    description:
      "Renowned six-storey sanctuary dedicated to Lord Ganesha, fulfiller of heartfelt wishes.",
    timings: [
      { name: "Kakad Aarti", time: "05:30 AM" },
      { name: "Shree Darshan", time: "06:00 AM" },
      { name: "Maha Aarti", time: "07:30 PM" },
      { name: "Shejarati", time: "09:50 PM" },
    ],
  },
  {
    id: "kashi-vishwanath",
    name: "Shri Kashi Vishwanath Jyotirlinga",
    city: "Varanasi",
    state: "Uttar Pradesh",
    tradition: "Jyotirlinga",
    isLive: true,
    isOfficialVerified: true,
    viewersCount: "29.3K",
    nextAarti: "Sandhya Aarti (07:00 PM)",
    currentDarshan: "Ganga Snan & Shringar Darshan",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtZ0AuANV-sRg-bLsA-8WXvaJLlF8SW7I8Hf64Fgj8jg&s=10",
    embedVideoId: "WPZ0xL0-sKs",
    officialYoutube: "https://www.youtube.com/live/WPZ0xL0-sKs",
    description:
      "Sacred golden-spired shrine of Lord Shiva in the eternal holy city of Kashi on the Ganga ghats.",
    timings: [
      { name: "Mangala Aarti", time: "03:00 AM" },
      { name: "Bhog Aarti", time: "11:15 AM" },
      { name: "Sandhya Aarti", time: "07:00 PM" },
      { name: "Shayan Aarti", time: "10:30 PM" },
    ],
  },
  {
    id: "jagannath-puri",
    name: "Shree Jagannath Temple",
    city: "Puri",
    state: "Odisha",
    tradition: "Vaishnav",
    isLive: false,
    isOfficialVerified: true,
    viewersCount: "Offline",
    nextAarti: "Dwaraphita (05:00 AM)",
    currentDarshan: "Stream restarts during morning ritual",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGHyzXPrc9825due8eV48mtBhD01PZ5FS2YFgMCXirEQ&s=10",
    embedVideoId: "1aAU3moRfGw",
    officialYoutube: "https://www.youtube.com/live/1aAU3moRfGw",
    description:
      "Ancient Char Dham sanctuary of Lord Jagannath, Balabhadra, and Devi Subhadra.",
    timings: [
      { name: "Dwaraphita & Mangal Aarti", time: "05:00 AM" },
      { name: "Gopal Ballav Bhog", time: "09:00 AM" },
      { name: "Madhyanha Dhoop", time: "01:00 PM" },
      { name: "Badasinghar Bhoga", time: "11:00 PM" },
    ],
  },
  {
    id: "shirdi-saibaba",
    name: "Shirdi Sai Baba Sansthan",
    city: "Shirdi",
    state: "Maharashtra",
    tradition: "Universal",
    isLive: true,
    isOfficialVerified: true,
    viewersCount: "24.6K",
    nextAarti: "Dhoop Aarti (Sunset)",
    currentDarshan: "Samadhi Mandir Darshan",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlDhJDDA5usMIXTkVdietvZ1E1fhXtsC9Z4MOriWrTaA&s=10",
    embedVideoId: "FIyZjCazWdI",
    officialYoutube: "https://www.youtube.com/@ShirdiSaiSansthanLive",
    description:
      "The holy abode and samadhi of Sadguru Sai Baba, welcoming millions of all faiths.",
    timings: [
      { name: "Kakad Aarti", time: "04:30 AM" },
      { name: "Madhyan Aarti", time: "12:00 PM" },
      { name: "Dhoop Aarti", time: "Sunset" },
      { name: "Shej Aarti", time: "10:30 PM" },
    ],
  },
];

export default function HomeLiveDarshanSection() {
  const [activeTemple, setActiveTemple] = useState<HomeTemple>(TEMPLES_DATA[0]);

  const officialLink =
    activeTemple.officialYoutube || activeTemple.officialChannelUrl;

  return (
    <section className="py-12 bg-[#FDFBF7] text-[#2D1609]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F0E6D8] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Real-Time Sanctum Broadcasts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1214]">
              Live Temple Darshan
            </h2>
            <p className="text-sm text-[#6B5548] mt-1">
              Connect directly with India&apos;s holy sanctums. Tap any shrine below to change the live feed.
            </p>
          </div>

          <Link
            href="/live-darshan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-red-700 transition-colors"
          >
            <span>Open Multi-Shrine Sanctuary</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Video Theatre */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Player Display */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-900/30">
              
              <div className="aspect-video w-full bg-[#180A0B] relative flex items-center justify-center">
                {activeTemple.isLive && activeTemple.embedVideoId ? (
                  <LiveStreamPlayer
                    key={activeTemple.id}
                    templeId={activeTemple.id}
                    fallbackVideoId={activeTemple.embedVideoId}
                    title={`${activeTemple.name} Live Stream`}
                    officialYoutube={officialLink}
                    thumbnail={activeTemple.image}
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <img
                      src={activeTemple.image}
                      alt={activeTemple.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
                    />
                    <div className="relative z-10 max-w-md space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/60 text-amber-200 border border-amber-500/30 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Private Sanctum Rites in Progress</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white">
                        {activeTemple.name}
                      </h3>
                      <p className="text-xs text-[#D5C2B4]">
                        {activeTemple.currentDarshan || "Broadcast resumes during upcoming scheduled aarti."}
                      </p>
                      {officialLink && (
                        <a
                          href={officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                        >
                          <span>Open Official Channel</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Bar Under Player */}
              <div className="p-4 bg-[#230D0F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#F7EDE2]">
                      {activeTemple.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeTemple.tradition}
                    </span>
                  </div>
                  <p className="text-xs text-[#C8B2A4] mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{activeTemple.city}, {activeTemple.state}</span>
                    <span className="mx-1">•</span>
                    <span className="text-amber-200">{activeTemple.currentDarshan}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/live-darshan"
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
                  >
                    Enter Full Sanctuary
                  </Link>
                </div>
              </div>
            </div>

            {/* Aarti Schedule Strip */}
            <div className="bg-[#FAF5EE] rounded-xl p-4 border border-[#EFE4D6] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-[#2D1609]">
                  Upcoming Aarti:
                </span>
                <span className="text-xs font-medium text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-300/60">
                  {activeTemple.nextAarti}
                </span>
              </div>
              <div className="text-[11px] text-[#786354]">
                Official Trust Live Feed • High-Bitrate Audio
              </div>
            </div>
          </div>

          {/* Temple Selector Cards */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="font-serif font-bold text-sm text-[#2A1214] px-1 flex items-center justify-between">
              <span>Select Shrine to Watch</span>
              <span className="text-[11px] font-sans text-stone-500 font-normal">
                {TEMPLES_DATA.length} Temples
              </span>
            </h4>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {TEMPLES_DATA.map((temple) => {
                const isSelected = activeTemple.id === temple.id;

                return (
                  <button
                    key={temple.id}
                    type="button"
                    onClick={() => setActiveTemple(temple)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${
                      isSelected
                        ? "bg-[#351417] text-white border-amber-600 shadow-md ring-1 ring-amber-500/30"
                        : "bg-white hover:bg-[#FDF9F3] text-[#2C180E] border-[#EADFCF]"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-900">
                      <img
                        src={temple.image}
                        alt={temple.name}
                        className="w-full h-full object-cover"
                      />
                      {temple.isLive ? (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-bold tracking-wider leading-tight">
                          LIVE
                        </span>
                      ) : (
                        <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-stone-800 text-stone-300 text-[8px] font-semibold leading-tight">
                          OFFLINE
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-serif font-bold text-sm truncate">
                          {temple.name}
                        </p>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? "text-amber-300/90" : "text-amber-800"
                        }`}
                      >
                        {temple.city}, {temple.state}
                      </p>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? "text-stone-300" : "text-stone-500"
                        }`}
                      >
                        {temple.nextAarti}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}