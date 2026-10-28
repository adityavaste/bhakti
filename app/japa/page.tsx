"use client";

import React, { useState } from "react";
import Link from "next/link";
import DigitalJapaMala from "@/components/darshan/DigitalJapaMala";
import {
  Sparkles,
  ChevronRight,
  Heart,
  ShieldCheck,
  BookOpen,
  Volume2,
  Vibrate,
  Award,
  Sun,
  Flame,
} from "lucide-react";

const POPULAR_MANTRAS_INFO = [
  {
    name: "Om Namah Shivaya",
    meaning: "I bow to Lord Shiva, the inner auspiciousness and pure consciousness.",
    tradition: "Shaivite",
    benefits: "Dissolves inner anxiety, calms the restless mind, and cultivates stillness.",
  },
  {
    name: "Hare Krishna Mahamantra",
    meaning: "O All-Attractive Krishna, O Energy of the Divine, engage me in devotion.",
    tradition: "Vaishnav",
    benefits: "Purifies heart emotions, awakens unconditional bliss and divine joy.",
  },
  {
    name: "Gayatri Mantra",
    meaning: "We meditate on the supreme effulgent light that illuminates our intellect.",
    tradition: "Vedic",
    benefits: "Sharpens clarity, grants spiritual vitality, and removes negative impressions.",
  },
  {
    name: "Ram Krishna Hari",
    meaning: "The sacred continuous remembrance of the supreme Varkari lineage.",
    tradition: "Varkari / Vitthal",
    benefits: "Opens the heart to surrender and connects directly with Pandharpur.",
  },
];

export default function JapaPage() {
  const [activeTab, setActiveTab] = useState<"counter" | "guide">("counter");

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Breadcrumb & Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 border border-amber-300/60 px-3.5 py-1.5 rounded-full shadow-xs">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Sacred Sadhana</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#381014] tracking-tight">
            Digital Japa Mala
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
            Carry the sacred 108 Tulsi beads wherever you go. Complete your daily mantra 
            sadhana with tactile haptic vibration, authentic wood chime resonance, and auto-tracked malas.
          </p>

          {/* Tab Switcher */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("counter")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "counter"
                  ? "bg-amber-800 text-white shadow-md"
                  : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              Chanting Counter
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "guide"
                  ? "bg-amber-800 text-white shadow-md"
                  : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
              }`}
            >
              Mantra Meaning & Guide
            </button>
          </div>
        </div>

        {/* TAB 1: Main Counter Widget */}
        {activeTab === "counter" && (
          <div className="space-y-12">
            
            {/* The Digital Mala Component */}
            <div className="flex justify-center">
              <DigitalJapaMala />
            </div>

            {/* Why 108 Beads Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
              <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                  <Vibrate className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2D1609]">Haptic Bead Feel</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every tap produces a subtle micro-vibration mimicking the physical roll of a tulsi or rudraksha bead.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2D1609]">Acoustic Resonance</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Soft wood-percussion sound on every count, culminating in a resonant temple bell chime on the 108th bead.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2D1609]">Unbroken Sadhana</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Completed malas and total lifetime chants save automatically to your local device so you never lose progress.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Guide & Vedic Philosophy */}
        {activeTab === "guide" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Mantras Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {POPULAR_MANTRAS_INFO.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-amber-900/10 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-amber-950">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
                      {item.tradition}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 italic border-l-2 border-amber-600/60 pl-3">
                    &ldquo;{item.meaning}&rdquo;
                  </p>
                  <div className="text-xs text-stone-600 pt-1">
                    <span className="font-bold text-stone-800">Spiritual Benefit: </span>
                    {item.benefits}
                  </div>
                </div>
              ))}
            </div>

            {/* Why 108 Info Banner */}
            <div className="bg-gradient-to-br from-[#2E1215] to-[#1F0A0C] text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>The Significance of 108</span>
              </div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-amber-100">
                Why Are There 108 Beads in a Sacred Japa Mala?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-300 leading-relaxed pt-2">
                <div>
                  <span className="font-bold text-amber-200 block mb-1">Cosmic Geometry</span>
                  The distance between the Earth and the Sun is approximately 108 times the Sun&apos;s diameter. The distance between the Earth and Moon is 108 times the Moon&apos;s diameter.
                </div>
                <div>
                  <span className="font-bold text-amber-200 block mb-1">Ayurvedic Marma Points</span>
                  According to ancient Ayurveda, there are 108 vital intersection points of life-energy (*prana*) across the subtle human body.
                </div>
                <div>
                  <span className="font-bold text-amber-200 block mb-1">Astrological Harmony</span>
                  There are 12 astrological houses and 9 planets in Vedic astrology: $12 \times 9 = 108$, representing full universal alignment.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devotee Notice Footer */}
        <div className="text-center pt-8 border-t border-[#F0E6D8]">
          <Link
            href="/live-darshan"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-red-700 transition-colors"
          >
            <span>Proceed to Live Sanctum Darshan</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}