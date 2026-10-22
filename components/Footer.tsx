import React from "react";
import Link from "next/link";
import {
  Flame,
  Radio,
  Heart,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#210D0E] text-[#F4ECE1]  border-amber-600 selection:bg-amber-700 selection:text-white">
      {/* Decorative Golden Accent Ribbon */}
      <div className=" bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 opacity-90" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Mission (Cols 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Divine Darshan
              </span>
            </Link>

            <p className="text-sm text-[#D1BEAF] leading-relaxed max-w-sm">
              India&apos;s authentic spiritual platform connecting millions of devotees worldwide
              with sacred temples through live darshan streams, verified aarti schedules, and pilgrim guidance.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Temple Feeds & YouTube Trust Aggregations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8B4A5]">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/live-darshan"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Live Sanctums</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </Link>
              </li>
              <li>
                <Link href="/temples" className="hover:text-amber-300 transition-colors">
                  Temple Directory
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-amber-300 transition-colors">
                  Spiritual Yatras
                </Link>
              </li>
              <li>
                <Link href="/donations" className="hover:text-amber-300 transition-colors">
                  Direct Trust Donations
                </Link>
              </li>
            </ul>
          </div>

          {/* Sacred Shrines */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4">
              Sacred Shrines
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8B4A5]">
              <li>
                <Link href="/live-darshan?temple=pandharpur" className="hover:text-amber-300 transition-colors">
                  Vitthal Rukmini, Pandharpur
                </Link>
              </li>
              <li>
                <Link href="/live-darshan?temple=kashi" className="hover:text-amber-300 transition-colors">
                  Kashi Vishwanath, Varanasi
                </Link>
              </li>
              <li>
                <Link href="/live-darshan?temple=tirupati" className="hover:text-amber-300 transition-colors">
                  Tirumala Balaji, Tirupati
                </Link>
              </li>
              <li>
                <Link href="/live-darshan?temple=siddhivinayak" className="hover:text-amber-300 transition-colors">
                  Siddhivinayak, Mumbai
                </Link>
              </li>
              <li>
                <Link href="/live-darshan?temple=puri" className="hover:text-amber-300 transition-colors">
                  Jagannath Temple, Puri
                </Link>
              </li>
              <li>
                <Link href="/live-darshan?temple=shirdi" className="hover:text-amber-300 transition-colors">
                  Sai Baba Mandir, Shirdi
                </Link>
              </li>
            </ul>
          </div>

          {/* Devotee Support & Services */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4">
              Devotee Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8B4A5]">
              <li>
                <Link href="/aarti-timings" className="hover:text-amber-300 transition-colors">
                  Aarti & Darshan Timings
                </Link>
              </li>
              <li>
                <Link href="/yatra-guidelines" className="hover:text-amber-300 transition-colors">
                  Pilgrim Dress Code & Rules
                </Link>
              </li>
              <li>
                <Link href="/onboard-temple" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Register a Temple Trust</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-300 transition-colors">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer / Trust Notice */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-[#2E1416]/80 rounded-xl p-4 border border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-[#DECBC0]">
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="leading-relaxed">
              <strong className="text-amber-300 font-semibold">Devotional Aggregator Notice: </strong>
              Divine Darshan aggregates official and verified live streams directly from recognized temple trusts
              and their sanctioned YouTube broadcasting channels. All temple names, logos, traditions, and audio-video streams
              remain the copyrighted property of their respective Devasthanam and Trust Boards.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#AA9485]">
          <p>© {currentYear} Divine Darshan. Dedicated with devotion to pilgrims across Bharat.</p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-amber-300 transition-colors">
              Content Disclaimer
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}