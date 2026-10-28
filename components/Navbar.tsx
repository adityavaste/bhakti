"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Radio,
  Menu,
  X,
  Compass,
  Landmark,
  HeartHandshake,
  ChevronRight,
  SunMedium,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Live Darshan", href: "/live-darshan", icon: Radio, badge: "Live" },
  { label: "Temples", href: "/temples", icon: Landmark },
  { label: "Spiritual Trips", href: "/trips", icon: Compass },
  { label: "jap mala", href: "/japa", icon: Compass },
  
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add subtle shadow and background elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#F0E6D8]"
          : "bg-[#FDFBF7] border-b border-[#F5EDE2]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2D1609] group-hover:text-amber-800 transition-colors">
               Darshan 
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700/80 -mt-0.5">
               Bringing You Closer to God, Every Day
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? "text-amber-900 bg-amber-100/70 font-semibold"
                      : "text-[#4A3B32] hover:text-amber-900 hover:bg-[#F5ECE0]"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${
                        link.badge ? "text-red-500 animate-pulse" : "text-amber-700"
                      }`}
                    />
                  )}
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold tracking-wider uppercase bg-red-100 text-red-600 rounded-full border border-red-200">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Watch Live CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/live-darshan"
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-md shadow-orange-600/25 hover:shadow-lg hover:shadow-orange-600/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>Watch Live Darshan</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/live-darshan"
              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
              title="Watch Live Darshan"
            >
              <Radio className="w-5 h-5 animate-pulse" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#3D2817] hover:bg-[#F2E5D5] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F0E6D8] bg-[#FAF5EE] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-amber-100/90 text-amber-900 font-semibold"
                      : "text-[#3E2D22] hover:bg-[#F2E5D5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-amber-700" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase bg-red-100 text-red-600 rounded-full border border-red-200">
                      {link.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-amber-900/30" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-[#EADBCC]">
            <Link
              href="/live-darshan"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-md text-sm"
            >
              <Radio className="w-4 h-4" />
              <span>Watch Live Darshan Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}