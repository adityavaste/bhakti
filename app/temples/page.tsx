"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Sparkles,
  Radio,
  Clock,
  Compass,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Building2,
  Info,
} from "lucide-react";

// --- Type Definitions ---

export interface TempleDetail {
  id: string;
  name: string;
  hindiName?: string;
  deity: string;
  tradition: "Vaishnav" | "Shaiv / Jyotirlinga" | "Shaktipeeth" | "Ganesha" | "Universal";
  city: string;
  state: string;
  region: string;
  architecturalStyle: string;
  century: string;
  image: string;
  liveAvailable: boolean;
  liveSlug?: string;
  bestTimeToVisit: string;
  dressCode: string;
  timings: string;
  description: string;
  highlights: string[];
}

// --- Curated Temples Across India ---

const ALL_TEMPLES: TempleDetail[] = [
  {
    id: "vitthal-rukmini-pandharpur",
    name: "Shri Vitthal Rukmini Mandir",
    hindiName: "श्री विठ्ठल रुक्मिणी मंदिर",
    deity: "Lord Vitthal & Mata Rukmini",
    tradition: "Vaishnav",
    city: "Pandharpur",
    state: "Maharashtra",
    region: "West India",
    architecturalStyle: "Hemadpanthi / Maratha",
    century: "12th Century CE",
    image:
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
    liveAvailable: true,
    liveSlug: "pandharpur",
    bestTimeToVisit: "Ashadhi & Kartiki Ekadashi (July - Nov)",
    dressCode: "Traditional Indian attire recommended; footwear strictly prohibited inside outer gates.",
    timings: "05:00 AM – 11:00 PM",
    description:
      "The prime sanctum of the historic Varkari Bhakti movement. Pilgrims walk hundreds of miles barefoot during the divine Ashadhi Wari to embrace Lord Panduranga.",
    highlights: ["Padasparsha Darshan", "Chandrabhaga River Snan", "Varkari Saint Samadhis"],
  },
  {
    id: "tirumala-venkateswara",
    name: "Tirumala Venkateswara Temple",
    hindiName: "तिरुमाला वेंकटेश्वर मंदिर",
    deity: "Lord Sri Venkateswara (Balaji)",
    tradition: "Vaishnav",
    city: "Tirupati",
    state: "Andhra Pradesh",
    region: "South India",
    architecturalStyle: "Dravidian Architecture",
    century: "9th Century CE onwards",
    image:
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80",
    liveAvailable: true,
    liveSlug: "tirupati",
    bestTimeToVisit: "September to February (Brahmotsavam in Sept/Oct)",
    dressCode: "Mandatory traditional: Dhoti/Kurta for men, Saree/Churidar with Dupatta for women.",
    timings: "03:00 AM – 01:00 AM (Next Day)",
    description:
      "Located on the seventh peak of Venkatadri hill range. Known as Kaliyuga Vaikuntham, it is the most revered and visited Vaishnava pilgrimage center on Earth.",
    highlights: ["Ananda Nilayam Vimana", "Tirupati Laddu Prasadam", "Srivari Seva"],
  },
  {
    id: "kashi-vishwanath",
    name: "Shri Kashi Vishwanath Dham",
    hindiName: "श्री काशी विश्वनाथ धाम",
    deity: "Lord Shiva (Jyotirlinga)",
    tradition: "Shaiv / Jyotirlinga",
    city: "Varanasi",
    state: "Uttar Pradesh",
    region: "North India",
    architecturalStyle: "Nagara / Modern Corridor",
    century: "Rebuilt 1780 by Ahilyabai Holkar",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    liveAvailable: true,
    liveSlug: "kashi",
    bestTimeToVisit: "October to March (Maha Shivaratri & Dev Deepawali)",
    dressCode: "Modest cultural wear. Traditional attire required for Sparsh Darshan.",
    timings: "03:00 AM – 11:00 PM",
    description:
      "Standing proudly on the western ghats of holy Ganga. One of the greatest of the twelve sacred Jyotirlingas, granting Moksha to all sincere seekers.",
    highlights: ["Golden Shikhara", "Direct Ganga Corridor", "Daily Mangala Aarti"],
  },
  {
    id: "siddhivinayak-mumbai",
    name: "Shree Siddhivinayak Temple",
    hindiName: "श्री सिद्धिविनायक मंदिर",
    deity: "Lord Ganesha (Navasacha)",
    tradition: "Ganesha",
    city: "Mumbai",
    state: "Maharashtra",
    region: "West India",
    architecturalStyle: "Modern Multi-tiered Temple",
    century: "Founded 1801 CE",
    image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
    liveAvailable: true,
    liveSlug: "siddhivinayak",
    bestTimeToVisit: "Angarki Chaturthi & Ganeshotsav",
    dressCode: "Comfortable respectful attire. Western casuals allowed if decent.",
    timings: "05:30 AM – 10:00 PM",
    description:
      "One of the richest and most beloved shrines of Lord Ganesha in Prabhadevi, Mumbai, revered as the wish-fulfilling deity with trunk curved to the right.",
    highlights: ["Gold-plated Sanctum Dome", "Tuesday Angarki Darshan", "Modak Prasadam"],
  },
  {
    id: "jagannath-puri",
    name: "Shree Jagannath Temple",
    hindiName: "श्री जगन्नाथ मंदिर",
    deity: "Lord Jagannath, Balabhadra & Subhadra",
    tradition: "Vaishnav",
    city: "Puri",
    state: "Odisha",
    region: "East India",
    architecturalStyle: "Kalinga Architecture",
    century: "1161 CE by Anantavarman",
    image:
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
    liveAvailable: false,
    bestTimeToVisit: "November to February (Ratha Yatra in June/July)",
    dressCode: "Traditional conservative dress. Foreign nationals restricted to outer gate as per temple customs.",
    timings: "05:30 AM – 10:30 PM",
    description:
      "One of the sacred Char Dhams. Famed for its monumental 214-foot Shikhara, the world-renowned Ratha Yatra, and the legendary Mahaprasad cooked in earthen pots.",
    highlights: ["Nilachakra", "Mahaprasad Ananda Bazaar", "Aruna Stambha"],
  },
  {
    id: "meenakshi-amman",
    name: "Madurai Meenakshi Sundareswarar",
    hindiName: "मदुरै मीनाक्षी अम्मन मंदिर",
    deity: "Goddess Meenakshi & Lord Sundareswarar",
    tradition: "Shaktipeeth",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "South India",
    architecturalStyle: "Dravidian Gopuram Architecture",
    century: "Rebuilt 16th Century CE",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    liveAvailable: false,
    bestTimeToVisit: "October to March (Chithirai Festival in April)",
    dressCode: "Strict traditional Tamil dress code (Dhoti/Veshti for men, Sarees for women).",
    timings: "05:00 AM – 12:30 PM & 04:00 PM – 10:00 PM",
    description:
      "An architectural wonder featuring 14 towering, colorfully sculpted Gopurams, the thousand-pillar hall, and the sacred Golden Lotus pond.",
    highlights: ["1000 Pillar Hall", "Porthamarai Kulam", "Evening Palliyarai Pooja"],
  },
  {
    id: "somnath-jyotirlinga",
    name: "Shri Somnath Jyotirlinga",
    hindiName: "श्री सोमनाथ ज्योतिर्लिंग",
    deity: "Lord Shiva (1st Jyotirlinga)",
    tradition: "Shaiv / Jyotirlinga",
    city: "Prabhas Patan, Veraval",
    state: "Gujarat",
    region: "West India",
    architecturalStyle: "Chalukya / Kailash Mahameru Prasada",
    century: "Rebuilt 1951 CE",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    liveAvailable: true,
    bestTimeToVisit: "September to March",
    dressCode: "Modest and neat Indian clothing.",
    timings: "06:00 AM – 10:00 PM",
    description:
      "The first among the twelve holy Jyotirlinga shrines of Lord Shiva, standing gracefully at the confluence of three rivers on the shores of the Arabian Sea.",
    highlights: ["Baan Stambha (Arrow Pillar)", "Sound & Light Show", "Sea-front Aarti"],
  },
  {
    id: "kamakhya-temple",
    name: "Maa Kamakhya Devalaya",
    hindiName: "माँ कामाख्या देवालय",
    deity: "Maa Kamakhya (Yoni Peeth)",
    tradition: "Shaktipeeth",
    city: "Guwahati",
    state: "Assam",
    region: "Northeast India",
    architecturalStyle: "Nilachal Style (Beehive Dome)",
    century: "Rebuilt 1565 CE",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    liveAvailable: false,
    bestTimeToVisit: "October to April (Ambubachi Mela in June)",
    dressCode: "Traditional and conservative Indian attire.",
    timings: "05:30 AM – 08:00 PM",
    description:
      "The paramount Shaktipeeth atop Nilachal Hill, symbolizing the eternal power of creation and Tantric traditions of ancient India.",
    highlights: ["Natural Spring Sanctum", "Ambubachi Fest", "Panoramic Brahmaputra View"],
  },
  {
    id: "shirdi-sai-mandir",
    name: "Shri Sai Baba Samadhi Mandir",
    hindiName: "श्री साईं बाबा समाधि मंदिर",
    deity: "Sadguru Sai Baba",
    tradition: "Universal",
    city: "Shirdi",
    state: "Maharashtra",
    region: "West India",
    architecturalStyle: "Modern Marble Sanctum",
    century: "Early 20th Century CE",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    liveAvailable: true,
    liveSlug: "shirdi",
    bestTimeToVisit: "All year round; Guru Purnima & Dussehra special celebrations",
    dressCode: "Simple, respectful modest wear.",
    timings: "04:00 AM – 11:15 PM",
    description:
      "The holy ground where Sai Baba lived and preached universal brotherhood: 'Sabka Malik Ek'. Pilgrims experience pure peace and communal harmony.",
    highlights: ["Dwarkamai", "Chavadi", "Lendi Baug", "Gurusthan"],
  },
];

const STATES = [
  "All States",
  "Maharashtra",
  "Andhra Pradesh",
  "Uttar Pradesh",
  "Tamil Nadu",
  "Gujarat",
  "Odisha",
  "Assam",
];

const TRADITIONS = [
  "All Traditions",
  "Vaishnav",
  "Shaiv / Jyotirlinga",
  "Shaktipeeth",
  "Ganesha",
  "Universal",
];

export default function ExploreTemplesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedTradition, setSelectedTradition] = useState("All Traditions");
  const [onlyLive, setOnlyLive] = useState(false);
  const [inspectingTemple, setInspectingTemple] = useState<TempleDetail | null>(null);

  // Filter temples based on query, state, tradition, and live feed availability
  const filteredTemples = useMemo(() => {
    return ALL_TEMPLES.filter((temple) => {
      const matchesSearch =
        temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        selectedState === "All States" || temple.state === selectedState;

      const matchesTradition =
        selectedTradition === "All Traditions" || temple.tradition === selectedTradition;

      const matchesLive = !onlyLive || temple.liveAvailable;

      return matchesSearch && matchesState && matchesTradition && matchesLive;
    });
  }, [searchQuery, selectedState, selectedTradition, onlyLive]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Introduction */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Sacred Bharat Pilgrim Directory</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A1214] tracking-tight">
            Explore Sacred Temples of India
          </h1>
          
          <p className="text-sm sm:text-base text-[#6B5548] leading-relaxed">
            Discover divine shrines, architectural splendors, and ancient pilgrim traditions across every corner of India. View darshan timings, dress codes, and verified live streams.
          </p>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="bg-[#FAF5EE] rounded-3xl p-5 border border-[#EDE2D4] shadow-sm space-y-4">
          
          {/* Top row: search + live filter toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by temple name, deity, holy city, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-[#E3D4C2] focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-[#2D1609]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <label className="flex items-center gap-2 self-start sm:self-auto cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-[#E3D4C2] text-xs font-medium text-[#4A372C] select-none hover:bg-amber-50/50 transition-colors">
              <input
                type="checkbox"
                checked={onlyLive}
                onChange={(e) => setOnlyLive(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Only Temples with Live Darshan
              </span>
            </label>
          </div>

          {/* Bottom row: State filter pills & Tradition selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-[#E8DEC9]">
            
            {/* State filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <span className="text-xs font-semibold text-[#8C7667] mr-1 shrink-0">State:</span>
              {STATES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedState === st
                      ? "bg-amber-700 text-white font-semibold shadow-xs"
                      : "bg-white text-[#554032] hover:bg-amber-100/60 border border-[#E4D5C2]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Tradition selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-[#8C7667]">Tradition:</span>
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value)}
                className="bg-white px-3 py-1.5 rounded-lg text-xs border border-[#E4D5C2] text-[#422F23] font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {TRADITIONS.map((tr) => (
                  <option key={tr} value={tr}>
                    {tr}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Results Count & Active Status */}
        <div className="flex items-center justify-between text-xs text-[#7A6658] px-1">
          <span>
            Showing <strong className="text-[#2C1315]">{filteredTemples.length}</strong> sacred shrines
          </span>
          {(selectedState !== "All States" || selectedTradition !== "All Traditions" || searchQuery || onlyLive) && (
            <button
              type="button"
              onClick={() => {
                setSelectedState("All States");
                setSelectedTradition("All Traditions");
                setSearchQuery("");
                setOnlyLive(false);
              }}
              className="text-amber-800 font-semibold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Temples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemples.map((temple) => (
            <div
              key={temple.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#EFE5D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Photo & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={temple.image}
                  alt={temple.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
                    {temple.tradition}
                  </span>
                  {temple.liveAvailable && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Live Feed
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#2B1214]/85 backdrop-blur-sm text-amber-200 text-[11px] px-2.5 py-0.5 rounded-md border border-amber-500/30">
                    {temple.century}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs text-[#7B685B]">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{temple.city}, {temple.state}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#2A1315] leading-snug group-hover:text-amber-800 transition-colors">
                    {temple.name}
                  </h3>

                  <p className="text-xs font-medium text-amber-900">
                    {temple.deity}
                  </p>

                  <p className="text-xs text-[#6B564A] line-clamp-2 leading-relaxed pt-1">
                    {temple.description}
                  </p>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {temple.highlights.slice(0, 2).map((hl, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#FAF5EE] text-[#554032] border border-[#E9DFCE] px-2 py-0.5 rounded-md"
                    >
                      {hl}
                    </span>
                  ))}
                  {temple.highlights.length > 2 && (
                    <span className="text-[10px] bg-[#FAF5EE] text-[#7B675A] border border-[#E9DFCE] px-1.5 py-0.5 rounded-md">
                      +{temple.highlights.length - 2} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#F2E8DC] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectingTemple(temple)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-[#3E291C] bg-[#FAF4ED] hover:bg-[#F2E5D5] border border-[#E7DAC9] transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Temple Details</span>
                  </button>

                  {temple.liveAvailable ? (
                    <Link
                      href={`/live-darshan?temple=${temple.liveSlug || temple.id}`}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Live Darshan</span>
                    </Link>
                  ) : (
                    <Link
                      href="/trips"
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 transition-colors flex items-center justify-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Plan Yatra</span>
                    </Link>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredTemples.length === 0 && (
          <div className="text-center py-16 bg-[#FAF5EE] rounded-3xl border border-[#EDE2D4] space-y-3">
            <p className="font-serif text-lg font-semibold text-[#3D2619]">
              No temples match your current filters.
            </p>
            <p className="text-xs text-[#756153]">
              Try searching with another keyword or resetting the state and tradition filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedState("All States");
                setSelectedTradition("All Traditions");
                setSearchQuery("");
                setOnlyLive(false);
              }}
              className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Detailed Temple Drawer / Modal */}
      {inspectingTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF5EE] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E9DFCE] relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Close */}
            <button
              type="button"
              onClick={() => setInspectingTemple(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Image */}
            <div className="relative aspect-[16/8] shrink-0 bg-stone-900">
              <img
                src={inspectingTemple.image}
                alt={inspectingTemple.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1214] via-transparent to-black/30" />
              
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                  {inspectingTemple.tradition} • {inspectingTemple.architecturalStyle}
                </span>
                <h2 className="font-serif text-2xl font-bold mt-0.5">
                  {inspectingTemple.name}
                </h2>
                <p className="text-xs text-stone-300">
                  {inspectingTemple.city}, {inspectingTemple.state}
                </p>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#4C382C]">
              
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2C1315] mb-1">
                  About the Sanctum
                </h4>
                <p className="leading-relaxed text-[#604B3E]">
                  {inspectingTemple.description}
                </p>
              </div>

              {/* Key Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#EBDDCB]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7667] tracking-wider block">
                    Presiding Deity
                  </span>
                  <span className="font-semibold text-[#2C1315] mt-0.5 block">
                    {inspectingTemple.deity}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7667] tracking-wider block">
                    Darshan Timings
                  </span>
                  <span className="font-semibold text-[#2C1315] mt-0.5 block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    {inspectingTemple.timings}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7667] tracking-wider block">
                    Best Time to Visit
                  </span>
                  <span className="font-semibold text-[#2C1315] mt-0.5 block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    {inspectingTemple.bestTimeToVisit}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7667] tracking-wider block">
                    Historical Era
                  </span>
                  <span className="font-semibold text-[#2C1315] mt-0.5 block">
                    {inspectingTemple.century}
                  </span>
                </div>
              </div>

              {/* Dress Code Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-950 font-semibold block">Dress Code & Protocol:</strong>
                  <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                    {inspectingTemple.dressCode}
                  </p>
                </div>
              </div>

              {/* Special Features */}
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2C1315] mb-2">
                  Sacred Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inspectingTemple.highlights.map((hl, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#EFE3D3] text-[#3E291C] font-medium text-[11px]"
                    >
                      ✦ {hl}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-white border-t border-[#EAE0D1] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setInspectingTemple(null)}
                className="px-4 py-2 text-xs font-semibold text-[#665143] hover:bg-stone-100 rounded-xl transition-colors"
              >
                Close
              </button>

              {inspectingTemple.liveAvailable ? (
                <Link
                  href={`/live-darshan?temple=${inspectingTemple.liveSlug || inspectingTemple.id}`}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Watch Live Sanctum</span>
                </Link>
              ) : (
                <Link
                  href="/trips"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore Yatra Itinerary</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}