// app/temples/page.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Landmark } from "lucide-react";

export default function TemplesPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b border-[#F0E6D8] pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Temples Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1214] mt-2 flex items-center gap-2">
            <Landmark className="w-8 h-8 text-amber-700" />
            Sacred Temples Directory
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Explore major shrines, historical architecture, and verified rituals across India.
          </p>
        </div>

        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-500">
            Temples catalog is loading. Explore live broadcasts in the{" "}
            <Link href="/live-darshan" className="text-amber-800 font-bold hover:underline">
              Live Darshan Sanctuary
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}