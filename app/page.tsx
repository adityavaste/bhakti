"use client";
import Link from 'next/link';

import Navbar from '@/components/Navbar';
import React, { useState, useMemo } from 'react';
import {
  Landmark,
  HeartHandshake,
  Ticket,
  Play,
  MapPin,
  Clock,
  Search,
  Flame,
  Compass,
  Heart,
  Calendar,
  ExternalLink,
  X,
  Menu,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Info,
  Volume2,
  Share2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sun
} from 'lucide-react';

// --- MOCK DATA: Temples & Live Streams ---
const TEMPLES_DATA = [
  {
    id: 'vitthal-pandharpur',
    name: 'Shri Vitthal Rukmini Temple',
    city: 'Pandharpur',
    state: 'Maharashtra',
    tradition: 'Vaishnav',
    isLive: true,
    isOfficialVerified: true,
    viewersCount: '18.4K',
    nextAarti: 'Kakad Aarti (04:30 AM)',
    currentDarshan: 'Nitya Pooja & Mukh Darshan',
    image: 'https://photos.mytemplemypride.com/ef0566c4-03b9-4186-aeb8-1b55e119a952/89c9c005-649a-4238-8b30-9897a5ea0928.png',
    embedVideoId: "0VfT9g20lMY",
officialYoutube: "https://www.youtube.com/live/0VfT9g20lMY?si=k5iFO96lhsKrmZ7q",
    description: 'The supreme abode of Lord Vitthal (Vithoba) and Mother Rukmini on the banks of Chandrabhaga river.',
    timings: [
      { name: 'Kakad Aarti', time: '04:30 AM' },
      { name: 'Panchamrut Pooja', time: '10:45 AM' },
      { name: 'Dhoop Aarti', time: '06:45 PM' },
      { name: 'Shej Aarti', time: '11:00 PM' }
    ]
  },
  { 
    id: 'tirupati-balaji',
    name: 'Tirumala Venkateswara Swamy Temple',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    tradition: 'Vaishnav',
    isLive: true,
    isOfficialVerified: true,
    viewersCount: '42.1K',
    nextAarti: 'Suprabhatam (03:00 AM)',
    currentDarshan: 'Sarva Darshanam Live',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXwsxCKMl_QxmqRbRG_3M_9U3KQLT0MMBIvvjcR49wlQ&s=10',
    embedVideoId: 'XxdarKTmJ8c',
    officialChannelUrl: 'https://www.youtube.com/live/XxdarKTmJ8c?si=1Eqdt1GtTqqW5gXh',
    description: 'The sacred Seven Hills of Tirumala, abode of Lord Sri Venkateswara (Balaji), Kaliyuga Pratyaksha Daivam.',
    timings: [
      { name: 'Suprabhata Seva', time: '03:00 AM' },
      { name: 'Thomala Seva', time: '04:30 AM' },
      { name: 'Archana', time: '05:30 AM' },
      { name: 'Ekanta Seva', time: '11:30 PM' }
    ]
  },
  {
    id: 'siddhivinayak-mumbai',
    name: 'Shree Siddhivinayak Temple',
    city: 'Prabhadevi, Mumbai',
    state: 'Maharashtra',
    tradition: 'Ganesha',
    isLive: true,
    isOfficialVerified: true,
    viewersCount: '12.8K',
    nextAarti: 'Maha Aarti (07:30 PM)',
    currentDarshan: 'Charan Sparsh & Abhishek',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAzc2VlWVxP24wLti9GGvqP3SnyfHJ3xrlEnynoV3_Lg&s=10',
    embedVideoId: "oWdSHxrwcBI",
officialYoutube: "https://www.youtube.com/live/oWdSHxrwcBI?si=EzenLmAlPVsLWzTO",
    description: 'Renowned six-storey sanctuary dedicated to Lord Ganesha, fulfiller of heartfelt wishes.',
    timings: [
      { name: 'Kakad Aarti', time: '05:30 AM' },
      { name: 'Shree Darshan', time: '06:00 AM' },
      { name: 'Maha Aarti', time: '07:30 PM' },
      { name: 'Shejarati', time: '09:50 PM' }
    ]
  },
  {
    id: 'kashi-vishwanath',
    name: 'Shri Kashi Vishwanath Jyotirlinga',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    tradition: 'Jyotirlinga',
    isLive: true,
    isOfficialVerified: true,
    viewersCount: '29.3K',
    nextAarti: 'Sandhya Aarti (07:00 PM)',
    currentDarshan: 'Ganga Snan & Shringar Darshan',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtZ0AuANV-sRg-bLsA-8WXvaJLlF8SW7I8Hf64Fgj8jg&s=10',
    embedVideoId: "WPZ0xL0-sKs",
officialYoutube: "https://www.youtube.com/live/WPZ0xL0-sKs?si=N2dC3cm2_KTcvjEk",
    description: 'Sacred golden-spired shrine of Lord Shiva in the eternal holy city of Kashi on the Ganga ghats.',
    timings: [
      { name: 'Mangala Aarti', time: '03:00 AM' },
      { name: 'Bhog Aarti', time: '11:15 AM' },
      { name: 'Sandhya Aarti', time: '07:00 PM' },
      { name: 'Shayan Aarti', time: '10:30 PM' }
    ]
  },
  {
    id: 'jagannath-puri',
    name: 'Shree Jagannath Temple',
    city: 'Puri',
    state: 'Odisha',
    tradition: 'Vaishnav',
    isLive: false,
    isOfficialVerified: true,
    viewersCount: 'Offline',
    nextAarti: 'Dwaraphita (05:00 AM)',
    currentDarshan: 'Stream restarts during morning ritual',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGHyzXPrc9825due8eV48mtBhD01PZ5FS2YFgMCXirEQ&s=10',
    embedVideoId: "1aAU3moRfGw",
officialYoutube: "https://www.youtube.com/live/1aAU3moRfGw?si=A7E7Pq-fU2WQXyWq",
    description: 'Ancient Char Dham sanctuary of Lord Jagannath, Balabhadra, and Devi Subhadra.',
    timings: [
      { name: 'Dwaraphita & Mangal Aarti', time: '05:00 AM' },
      { name: 'Gopal Ballav Bhog', time: '09:00 AM' },
      { name: 'Madhyanha Dhoop', time: '01:00 PM' },
      { name: 'Badasinghar Bhoga', time: '11:00 PM' }
    ]
  },
  {
    id: 'shirdi-saibaba',
    name: 'Shirdi Sai Baba Sansthan',
    city: 'Shirdi',
    state: 'Maharashtra',
    tradition: 'Universal',
    isLive: true,
    isOfficialVerified: true,
    viewersCount: '24.6K',
    nextAarti: 'Dhoop Aarti (Sunset)',
    currentDarshan: 'Samadhi Mandir Darshan',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlDhJDDA5usMIXTkVdietvZ1E1fhXtsC9Z4MOriWrTaA&s=10',
    embedVideoId: "MHEqo6oOwWE",
    officialChannelUrl: 'https://www.youtube.com/@ShirdiSaiSansthanLive',
    description: 'The holy abode and samadhi of Sadguru Sai Baba, welcoming millions of all faiths.',
    timings: [
      { name: 'Kakad Aarti', time: '04:30 AM' },
      { name: 'Madhyan Aarti', time: '12:00 PM' },
      { name: 'Dhoop Aarti', time: 'Sunset' },
      { name: 'Shej Aarti', time: '10:30 PM' }
    ]
  }
];

// --- MOCK DATA: Regions ---
const REGIONS_DATA = [
  { name: 'Maharashtra', templesCount: 42, icon: '🕉️', highlight: 'Pandharpur, Siddhivinayak, Trimbakeshwar' },
  { name: 'Andhra Pradesh', templesCount: 38, icon: '🛕', highlight: 'Tirumala Tirupati, Srisailam, Simhachalam' },
  { name: 'Uttar Pradesh', templesCount: 54, icon: '🪔', highlight: 'Kashi Vishwanath, Ayodhya Ram Mandir, Mathura' },
  { name: 'Tamil Nadu', templesCount: 68, icon: '🔱', highlight: 'Meenakshi Amman, Ramanathaswamy, Brihadisvara' },
  { name: 'Gujarat', templesCount: 29, icon: '☀️', highlight: 'Somnath Jyotirlinga, Dwarkadhish, Ambaji' },
  { name: 'Odisha', templesCount: 22, icon: '🌊', highlight: 'Jagannath Puri, Lingaraj, Konark Sun Temple' },
  { name: 'Karnataka', templesCount: 36, icon: '🔔', highlight: 'Murudeshwar, Udupi Krishna, Chamundeshwari' },
  { name: 'Rajasthan', templesCount: 31, icon: '🌺', highlight: 'Khatu Shyam, Shrinathji Nathdwara, Brahma Temple' }
];

// --- MOCK DATA: Spiritual Yatras ---
const YATRAS_DATA = [
  {
    title: '12 Jyotirlinga Darshan',
    badge: 'Supreme Shiva Yatra',
    duration: '14 to 21 Days',
    keyShrines: 'Somnath, Mahakaleshwar, Kashi, Kedarnath & more',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMYhCpgHy3vKQHMPXOOAGxeeuQBL1wcKL6HjapTFV0TQ&s=10',
    description: 'Sacred pilgrimage to the 12 radiant shrines of Mahadev scattered across holy India.'
  },
  {
    title: 'Char Dham Yatra',
    badge: 'Himalayan Spiritual Circuit',
    duration: '10 to 12 Days',
    keyShrines: 'Yamunotri, Gangotri, Kedarnath, Badrinath',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX_6I8mb74QcpO38dzpO8Z9hj9Dni0f3-xizmS3e4ZAw&s=10',
    description: 'Ascend into the divine Garhwal Himalayas to purify mind and spirit at India’s premier pilgrimage.'
  },
  {
    title: 'Ashtavinayak Yatra',
    badge: 'Maharashtra Sacred Circuit',
    duration: '3 to 4 Days',
    keyShrines: 'Mayureshwar, Siddhivinayak, Ballaleshwar, Varadvinayak & 4 more',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEg-3M1Hj86mNjaKnc_o3nkteBvsidX2Jf46030_PiOA&s=10',
    description: 'A deeply revered circle covering eight self-manifested (Swayambhu) Ganesha temples.'
  },
  {
    title: 'Tirupati Balaji & Kanipakam Yatra',
    badge: 'South India Grace',
    duration: '2 to 3 Days',
    keyShrines: 'Tirumala Hills, Padmavathi Ammavari, Kanipakam',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHXu6gE_dWMDs7oonLZDdVmx_1T2Z-eMAb1FUOIhzeBw&s=10',
    description: 'Darshan of Lord Venkateswara paired with the holy sacred ponds and local ancient temples.'
  },
  {
    title: 'Shirdi & Shani Shingnapur',
    badge: 'Devotion & Faith',
    duration: '2 Days',
    keyShrines: 'Shirdi Samadhi Mandir, Dwarkamai, Shani Dev Shrine',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVPMpSFzkzJIr98NHaEWgnTpNgjXFeTiBj_FjQeC-ZuQ&s=10',
    description: 'Experience deep tranquility and surrender at Sai Baba’s holy abode in Ahmednagar.'
  }
];

// --- MOCK DATA: Devotee Services ---
const SERVICES_DATA = [
  {
    title: "Darshan Pass Booking",
    desc: "Reserve verified sanctum entry passes, VIP darshan slots, and senior citizen priority tokens before your pilgrimage.",
    badge: "E-Token",
    icon: Ticket,
    href: "/darshan-pass",
  },
  {
    title: "Temple Trip Planning",
    desc: "Curated yatra itineraries for Ashtavinayak, Char Dham, Jyotirlinga, and regional pilgrim circuits.",
    badge: "Yatra Circuits",
    icon: Compass,
    href: "/trips",
  },
  {
    title: "Donation to Temples",
    desc: "Direct contributions toward Annadanam, gaushalas, and shrine maintenance with 80G tax receipts.",
    badge: "Direct Trust",
    icon: HeartHandshake,
    href: "/donations",
  },
  {
    title: "Aarti & Darshan Timings",
    desc: "Verified schedules for Kakad Aarti, Bhog, Sandhya Aarti, and Shej Aarti across major shrines.",
    badge: "Live Schedules",
    icon: Clock,
    href: "/live-darshan",
  },
  {
    title: "Temple Information & Guidance",
    desc: "Detailed guides on temple architecture, dress codes, nearest transport, and sanctum protocols.",
    badge: "Directory",
    icon: Landmark,
    href: "/temples",
  },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTemple, setSelectedTemple] =
    useState<(typeof TEMPLES_DATA)[number] | null>(null);

  const [selectedYatra, setSelectedYatra] =
    useState<(typeof YATRAS_DATA)[number] | null>(null);

  const [serviceModal, setServiceModal] = useState<{
    title: string;
    desc: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');

  // Filter temples based on category and search query
  const filteredTemples = useMemo(() => {
    return TEMPLES_DATA.filter(temple => {
      const matchesSearch =
        temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' ||
        temple.tradition.toLowerCase() === activeCategory.toLowerCase();

      const matchesState =
        selectedStateFilter === 'All' ||
        temple.state.toLowerCase() === selectedStateFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [searchQuery, activeCategory, selectedStateFilter]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>

      <div className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-sans antialiased selection:bg-amber-100 selection:text-amber-900">



        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle Decorative Background Mandala Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-200/30 to-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-100/60 rounded-full blur-2xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold tracking-wide shadow-sm">
                  <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>CONNECTING MILLIONS TO SACRED ROOTS</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#381014] tracking-tight leading-[1.15]">
                  Live {' '}
                  <span className=" br text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-700 to-amber-700 underline decoration-amber-300 decoration-wavy decoration-2">
                    Darshan
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-stone-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Connect with India's sacred temples through live darshan, discover spiritual destinations, and plan your next divine journey — all in one peaceful place.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/live-darshan"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold text-white bg-gradient-to-r from-amber-600 via-rose-700 to-amber-700 hover:from-amber-700 hover:to-rose-800 shadow-lg shadow-amber-800/20 transform hover:-translate-y-0.5 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Live Darshan</span>
                  </Link>

                  <Link
                    href="/temples"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-stone-800 bg-white/80 hover:bg-white border border-stone-300/80 hover:border-amber-600/50 shadow-sm transition-all"
                  >
                    
                    <span>Explore Temples</span>
                  </Link>
                </div>

               
              </div>

              {/* Right Visual Card Column */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">

                  {/* Temple Feature Hero Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white group">
                    <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                      <img
                        src="https://photos.mytemplemypride.com/ef0566c4-03b9-4186-aeb8-1b55e119a952/89c9c005-649a-4238-8b30-9897a5ea0928.png"
                        alt="Pandharpur Vitthal Temple Sanctum"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Live Badge */}
                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>Live Broadcast</span>
                      </div>

                      {/* Verified Trust Stamp */}
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-300/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>Official Trust</span>
                      </div>

                      {/* Bottom Info on Hero Card */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Featured Sanctum</p>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold leading-tight mt-0.5">
                          Shri Vitthal Rukmini Mandir
                        </h3>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-xs text-stone-200">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-300" />
                            Pandharpur, Maharashtra
                          </span>
                          <span className="font-semibold text-amber-300">18.4K Devotees Watching</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action below image */}
                    <div className="p-4 bg-amber-50/70 border-t border-amber-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-stone-500 font-medium">Ongoing ritual:</p>
                        <p className="text-sm font-semibold text-stone-800">Nitya Pooja & Mahanaivedya</p>
                      </div>
                      <button
                        onClick={() => setSelectedTemple(TEMPLES_DATA[0])}
                        className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold tracking-wide uppercase shadow transition-colors flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Watch Live</span>
                      </button>
                    </div>
                  </div>

                  {/* Floating Diya Card Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-amber-200/80 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                      <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Next Major Aarti</p>
                      <p className="text-xs text-stone-500">Sandhya Aarti in 45 mins</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

       

        {/* SECTION: Live Darshan Section (Crucial Core Feature) */}
        <section id="live-darshan" className="py-16 sm:py-24 bg-[#F5EDE1]/50 border-y border-amber-900/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-widest mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  Direct Sanctum Broadcasts
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#381014]">
                  Live Darshan from Sacred Temples
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
                  Experience real-time spiritual presence. Feeds are sourced directly from verified temple trusts and official YouTube streams.
                </p>
              </div>

              {/* Category / Tradition Filter Tabs */}
              <div className="flex items-center flex-wrap gap-2">
                {['All', 'Vaishnav', 'Jyotirlinga', 'Ganesha'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat
                        ? 'bg-amber-800 text-white shadow-sm'
                        : 'bg-white/80 text-stone-700 hover:bg-white border border-stone-200'
                      }`}
                  >
                    {cat === 'All' ? 'All Temples' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and State Filters Bar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-amber-900/10 mb-8 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by temple name, city, or deity (e.g. Pandharpur, Kashi, Tirupati)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-800 placeholder:text-stone-400"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-stone-200 pt-2 sm:pt-0 sm:pl-3">
                <span className="text-xs text-stone-500 whitespace-nowrap font-medium">State:</span>
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none font-medium"
                >
                  <option value="All">All States</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Odisha">Odisha</option>
                </select>
              </div>
            </div>

            {/* Temples Grid */}
            {filteredTemples.length === 0 ? (
              <div className="text-center py-16 bg-white/60 rounded-3xl border border-stone-200">
                <Info className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <h3 className="font-serif text-lg font-bold text-stone-800">No Temples Found</h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1">
                  Try searching with a different temple name, or reset the filters to see all available live broadcasts.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setSelectedStateFilter('All'); }}
                  className="mt-4 px-4 py-2 bg-amber-700 text-white text-xs font-semibold rounded-full"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredTemples.map((temple) => (
                  <div
                    key={temple.id}
                    className="bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Card Media Header */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                      <img
                        src={temple.image}
                        alt={temple.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Live Indicator */}
                      <div className="absolute top-3.5 left-3.5">
                        {temple.isLive ? (
                          <span className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            Live Now
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-stone-800/80 backdrop-blur-md text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            Aarti Hours Only
                          </span>
                        )}
                      </div>

                      {/* Viewers or Next Aarti */}
                      <div className="absolute top-3.5 right-3.5">
                        <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-amber-200 text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10">
                          {temple.isLive ? `${temple.viewersCount} watching` : 'Upcoming Stream'}
                        </span>
                      </div>

                      {/* State & City overlay */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <p className="text-xs font-medium text-amber-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {temple.city}, {temple.state}
                        </p>
                        <h3 className="text-lg font-serif font-bold leading-snug line-clamp-1">
                          {temple.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {temple.description}
                      </p>

                      {/* Ritual Status */}
                      <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="font-medium">Current Status:</span>
                          <span className="font-semibold text-amber-900">{temple.currentDarshan}</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="font-medium">Upcoming Aarti:</span>
                          <span className="text-stone-800 font-medium">{temple.nextAarti}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTemple(temple)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white text-xs font-bold uppercase tracking-wider shadow transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Watch Darshan</span>
                        </button>

                        <a
                          href={temple.officialChannelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors"
                          title="Open Official YouTube Channel"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All link */}
            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  setSelectedStateFilter('All');
                  scrollToSection('regions');
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 group"
              >
                <span>Explore All 500+ Indian Temples Across States</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </section>

        {/* SECTION: Explore Temples by Region */}
        <section id="regions" className="py-16 sm:py-24 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Geographic Pilgrimage</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#381014] mt-1">
                Explore Temples by Region
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2">
                From the Himalayan peaks of Uttarakhand to the towering gopurams of Tamil Nadu, discover the timeless sacred architecture of Indian states.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {REGIONS_DATA.map((region) => (
                <div
                  key={region.name}
                  onClick={() => {
                    setSelectedStateFilter(region.name);
                    scrollToSection('live-darshan');
                  }}
                  className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-sm hover:shadow-md hover:border-amber-400/80 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-amber-50 group-hover:scale-110 transition-transform">
                        {region.icon}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                        {region.templesCount} Temples
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {region.highlight}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                    <span>View State Temples</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION: Popular Spiritual Yatras */}
        <section id="yatras" className="py-16 sm:py-24 bg-[#F5EDE1]/60 border-t border-amber-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-700">Sacred Circuits</span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#381014] mt-1">
                  Popular Spiritual Yatras
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
                  Time-honored pilgrimages for spiritual renewal. Learn sacred routes, best seasons to visit, and essential travel guidance.
                </p>
              </div>
              <button
                onClick={() => setServiceModal({
                  title: 'Custom Spiritual Yatra Planning',
                  desc: 'Our upcoming itinerary builder helps devotees organize family trips, special darshan timings, dharamsala reservations, and wheelchair assistance across all major sacred circuits.'
                })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors"
              >
                Plan Custom Yatra
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {YATRAS_DATA.map((yatra) => (
                <div
                  key={yatra.title}
                  className="bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={yatra.image}
                      alt={yatra.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                      {yatra.badge}
                    </span>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-xs text-amber-300 font-medium">Estimated: {yatra.duration}</p>
                      <h3 className="text-lg font-serif font-bold leading-tight">{yatra.title}</h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs text-stone-600 leading-relaxed mb-3">
                        {yatra.description}
                      </p>
                      <div className="text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="font-semibold text-stone-800">Key Shrines: </span>
                        <span className="text-stone-600">{yatra.keyShrines}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedYatra(yatra)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-700/60 hover:bg-amber-50 text-amber-900 text-xs font-bold tracking-wider uppercase transition-colors"
                    >
                      <span>Explore Trip Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION: Devotee Services */}
        <section id="services" className="py-16 sm:py-24 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Digital Facilitation
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#381014] mt-1">
                Devotee Services & Facilities
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2">
                Modern digital services designed to make temple visitation seamless, transparent, and spiritually enriching.
              </p>
            </div>

            {/* Services Grid with Direct Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES_DATA.map((srv) => {
                const IconComponent = srv.icon;
                return (
                  <Link
                    key={srv.title}
                    href={srv.href || "#"}
                    className="bg-white rounded-2xl p-6 border border-amber-900/10 shadow-sm hover:shadow-md hover:border-amber-400 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center group-hover:bg-amber-800 group-hover:text-amber-50 transition-colors">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                          {srv.badge}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center text-xs font-bold text-amber-800">
                      <span>Explore Service</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

        {/* SECTION: Why Bhakti? */}
        <section className="py-16 bg-gradient-to-br from-amber-900 via-[#381014] to-rose-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Pure Devotion & Trust</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50 mt-1">
                Why Devotees Trust Bhakti
              </h2>
              <p className="text-stone-300 text-sm sm:text-base mt-2">
                Built with reverence to serve elderly parents, global NRIs, and devotees who seek genuine spiritual connection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">Verified Official Feeds</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Zero fake links. We solely curate authorized temple trust YouTube channels and authorized broadcasts.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">100% Direct Donations</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  No middleman commissions. Devotees are routed directly to government and trust registered E-Hundis.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">Authentic Yatra Guidance</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Practical information regarding temple dress codes, VIP passes, special entry protocols, and timings.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">Inclusive for Everyone</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Empowering sick, elderly, or distant devotees across the globe to receive daily holy darshan and peace.
                </p>
              </div>
            </div>

          </div>
        </section>



        {/* --- MODAL 1: LIVE DARSHAN VIDEO PLAYER MODAL --- */}
        {selectedTemple && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#1F1714] text-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-amber-900/40 max-h-[92vh] flex flex-col">

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-200">
                    {selectedTemple.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTemple(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Player Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {selectedTemple.embedVideoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${selectedTemple.embedVideoId}?autoplay=1&mute=0`}
                    title={`${selectedTemple.name} Official Live Stream`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <Clock className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                    <h4 className="font-serif text-xl font-bold">Stream Offline During Private Rituals</h4>
                    <p className="text-sm text-stone-300 max-w-md mx-auto">
                      The sanctum doors are currently closed for inner shringar pooja. Please tune in during scheduled Aarti timings or visit the official channel.
                    </p>
                    <a
                      href={selectedTemple.officialChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      <span>Check Official YouTube Channel</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Details / Aarti Timings */}
              <div className="p-6 overflow-y-auto space-y-5 bg-[#261E1A]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs text-amber-300 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedTemple.city}, {selectedTemple.state}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Verified feed managed by the authorized Devasthanam Trust
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedTemple.officialChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-stone-200 transition-colors"
                    >
                      <span>Open in YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedTemple.name,
                            text: `Watch live darshan from ${selectedTemple.name}`,
                            url: window.location.href
                          }).catch(() => { });
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition-colors"
                      title="Share Darshan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Aarti Schedule Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Daily Temple Aarti Schedule
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {selectedTemple.timings.map((t, idx) => (
                      <div key={idx} className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                        <p className="text-xs font-semibold text-stone-200">{t.name}</p>
                        <p className="text-xs text-amber-300 font-mono mt-0.5">{t.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 bg-black/30 p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-amber-200">Devotee Notice: </span>
                  Video player latency may vary by 10-30 seconds compared to live broadcast. For official hundi donations or prasad sevas, please visit the verified website of this temple trust.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- MODAL 2: SPIRITUAL YATRA DETAIL MODAL --- */}
        {selectedYatra && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white text-stone-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10 max-h-[90vh] flex flex-col">

              <div className="relative h-56 w-full">
                <img src={selectedYatra.image} alt={selectedYatra.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={() => setSelectedYatra(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-black/40 px-2 py-0.5 rounded-full">
                    {selectedYatra.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-1">{selectedYatra.title}</h3>
                  <p className="text-xs text-stone-300 mt-0.5">Recommended Duration: {selectedYatra.duration}</p>
                </div>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 mb-1">Pilgrimage Overview</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {selectedYatra.description}
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Holy Shrines Included:</h4>
                  <p className="text-xs sm:text-sm font-medium text-stone-800">{selectedYatra.keyShrines}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900">Key Tips for Devotees</h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                    <li>Traditional Indian attire is mandatory (Dhoti/Kurta for men, Saree/Salwar for women).</li>
                    <li>Book special entry passes at least 30-45 days in advance during festival months.</li>
                    <li>Wheelchair assistance and battery car facilities are available for elderly pilgrims at most major shrines.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedYatra(null);
                      setServiceModal({
                        title: `Yatra Notification Registered`,
                        desc: `You will be notified when comprehensive travel planning, certified dharamsala tie-ups, and tour guides launch for ${selectedYatra.title}.`
                      });
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow"
                  >
                    Request Trip Itinerary Guide
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- MODAL 3: GENERIC SERVICE / INFO MODAL --- */}
        {serviceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white text-stone-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-amber-200">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif font-bold text-xl text-center text-[#381014] mb-2">
                {serviceModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 text-center leading-relaxed mb-6">
                {serviceModal.desc}
              </p>
              <button
                onClick={() => setServiceModal(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Understand & Close
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );

}