"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
  Info,
  ChevronRight,
  ArrowLeft,
  Ticket,
  MapPin,
  ExternalLink,
  Flame,
  AlertTriangle,
  QrCode,
  Download,
} from "lucide-react";

// --- Type Definitions ---

export interface PassType {
  id: string;
  name: string;
  hindiName: string;
  priceText: string;
  description: string;
  avgWaitTime: string;
  quotaAvailable: number;
}

export interface TempleBookingInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  trustName: string;
  officialPortal: string;
  image: string;
  availablePasses: PassType[];
  timeSlots: string[];
}

export interface DevoteeDetail {
  fullName: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  idType: "Aadhaar" | "Voter ID" | "Passport";
  idNumber: string;
}

// --- Verified Shrines Dataset for E-Passes ---

const BOOKING_TEMPLES: TempleBookingInfo[] = [
  {
    id: "tirumala-tirupati",
    name: "Tirumala Venkateswara Temple",
    city: "Tirupati",
    state: "Andhra Pradesh",
    trustName: "Tirumala Tirupati Devasthanams (TTD)",
    officialPortal: "https://tirupatibalaji.ap.gov.in",
    image:
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80",
    availablePasses: [
      {
        id: "sed-300",
        name: "Special Entry Darshan (SED)",
        hindiName: "विशेष प्रवेश दर्शन (₹300)",
        priceText: "₹300 / Devotee (Govt Trust Rate)",
        description: "Official pre-booked quota managed by TTD for accelerated sanctum queue entry.",
        avgWaitTime: "1.5 – 2.5 hours",
        quotaAvailable: 42,
      },
      {
        id: "sarva-free",
        name: "Sarvadarsanam Free E-Token",
        hindiName: "निःशुल्क सर्वदर्शन टोकन",
        priceText: "Free (Nil Fee)",
        description: "Standard general queue pass for all pilgrims with timed reporting slot.",
        avgWaitTime: "4 – 6 hours",
        quotaAvailable: 118,
      },
      {
        id: "senior-disabled",
        name: "Senior Citizens & Divyangjan Pass",
        hindiName: "वरिष्ठ नागरिक एवं दिव्यांग पास",
        priceText: "Free (Special Assistance)",
        description: "Reserved gate access for devotees aged 65+ and differently-abled pilgrims.",
        avgWaitTime: "45 mins",
        quotaAvailable: 15,
      },
    ],
    timeSlots: [
      "07:00 AM – 09:00 AM",
      "09:00 AM – 11:00 AM",
      "12:00 PM – 02:00 PM",
      "03:00 PM – 05:00 PM",
      "06:00 PM – 08:00 PM",
    ],
  },
  {
    id: "kashi-vishwanath",
    name: "Shri Kashi Vishwanath Dham",
    city: "Varanasi",
    state: "Uttar Pradesh",
    trustName: "Shri Kashi Vishwanath Temple Trust",
    officialPortal: "https://shrikashivishwanath.org",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    availablePasses: [
      {
        id: "sugam-darshan",
        name: "Sugam Darshan E-Pass",
        hindiName: "सुगम दर्शन ई-पास",
        priceText: "₹300 / Devotee",
        description: "Dedicated priority corridor pass through Gate No. 4 with temple guide assistance.",
        avgWaitTime: "30 – 45 mins",
        quotaAvailable: 64,
      },
      {
        id: "mangala-aarti-pass",
        name: "Mangala Aarti Morning Pass",
        hindiName: "मंगला आरती प्रवेश पास",
        priceText: "₹500 / Devotee",
        description: "Exclusive 03:00 AM sacred morning aarti entry in the main sanctum sanctorum.",
        avgWaitTime: "Direct Seated Entry",
        quotaAvailable: 6,
      },
      {
        id: "general-queue",
        name: "Free Samanya Darshan Token",
        hindiName: "सामान्य दर्शन टोकन",
        priceText: "Free",
        description: "Regular queue access through the newly inaugurated grand Ganga Corridor.",
        avgWaitTime: "2 – 3 hours",
        quotaAvailable: 240,
      },
    ],
    timeSlots: [
      "06:00 AM – 08:00 AM",
      "09:00 AM – 11:00 AM",
      "01:00 PM – 03:00 PM",
      "04:00 PM – 06:00 PM",
      "07:30 PM – 09:30 PM",
    ],
  },
  {
    id: "shirdi-sai",
    name: "Shri Sai Baba Samadhi Mandir",
    city: "Shirdi",
    state: "Maharashtra",
    trustName: "Shri Saibaba Sansthan Trust, Shirdi",
    officialPortal: "https://online.sai.org.in",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    availablePasses: [
      {
        id: "shirdi-vip-200",
        name: "VIP Paid Darshan Pass",
        hindiName: "सशुल्क शीघ्र दर्शन पास (₹200)",
        priceText: "₹200 / Devotee",
        description: "Accelerated entry through Gate 2 directly leading to the Samadhi Hall.",
        avgWaitTime: "40 mins",
        quotaAvailable: 50,
      },
      {
        id: "shirdi-free-pass",
        name: "Free Time-Slot E-Darshan Token",
        hindiName: "समयबद्ध निःशुल्क दर्शन टोकन",
        priceText: "Free",
        description: "Standard time-slotted pass to avoid standing in long physical queues.",
        avgWaitTime: "1.5 hours",
        quotaAvailable: 180,
      },
    ],
    timeSlots: [
      "06:30 AM – 08:30 AM",
      "10:00 AM – 12:00 PM",
      "02:00 PM – 04:00 PM",
      "05:00 PM – 07:00 PM",
      "08:00 PM – 10:00 PM",
    ],
  },
];

export default function DarshanPassPage() {
  // Booking Workflow State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedTemple, setSelectedTemple] = useState<TempleBookingInfo>(BOOKING_TEMPLES[0]);
  const [selectedPass, setSelectedPass] = useState<PassType>(BOOKING_TEMPLES[0].availablePasses[0]);
  const [bookingDate, setBookingDate] = useState<string>("2026-10-25");
  const [selectedSlot, setSelectedSlot] = useState<string>(BOOKING_TEMPLES[0].timeSlots[0]);

  // Devotee Information
  const [devotees, setDevotees] = useState<DevoteeDetail[]>([
    { fullName: "", age: "", gender: "Male", idType: "Aadhaar", idNumber: "" },
  ]);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [agreeRules, setAgreeRules] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string>("");

  const handleTempleChange = (temple: TempleBookingInfo) => {
    setSelectedTemple(temple);
    setSelectedPass(temple.availablePasses[0]);
    setSelectedSlot(temple.timeSlots[0]);
  };

  const addDevotee = () => {
    if (devotees.length < 6) {
      setDevotees([
        ...devotees,
        { fullName: "", age: "", gender: "Male", idType: "Aadhaar", idNumber: "" },
      ]);
    }
  };

  const removeDevotee = (index: number) => {
    if (devotees.length > 1) {
      setDevotees(devotees.filter((_, i) => i !== index));
    }
  };

  const updateDevotee = (index: number, field: keyof DevoteeDetail, value: string) => {
    const updated = [...devotees];
    updated[index] = { ...updated[index], [field]: value };
    setDevotees(updated);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = "DD-" + Math.floor(100000 + Math.random() * 900000);
    setConfirmationNumber(generatedId);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1609] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Ticket className="w-3.5 h-3.5 text-amber-700" />
            <span>Official Temple Devasthanam Passes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1214]">
            Book Darshan Pass & Seva E-Token
          </h1>
          <p className="text-xs sm:text-sm text-[#6C5749] leading-relaxed">
            Reserve verified sanctum entry passes, VIP darshan slots, and senior citizen priority tokens before your pilgrimage.
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#EDE2D4] max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div
              className={`py-2 rounded-xl transition-colors ${
                step >= 1
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-[#786354] border border-[#E9DFCE]"
              }`}
            >
              1. Choose Temple & Pass
            </div>
            <div
              className={`py-2 rounded-xl transition-colors ${
                step >= 2
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-[#786354] border border-[#E9DFCE]"
              }`}
            >
              2. Slot & Devotees
            </div>
            <div
              className={`py-2 rounded-xl transition-colors ${
                step >= 3
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-[#786354] border border-[#E9DFCE]"
              }`}
            >
              3. Verification & Token
            </div>
          </div>
        </div>

        {/* STEP 1: Select Temple and Pass Type */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Step 1A: Temple Selection Tabs */}
            <div>
              <label className="block font-serif text-base font-bold text-[#2D1609] mb-3">
                Select Sacred Shrine
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BOOKING_TEMPLES.map((t) => {
                  const isSelected = selectedTemple.id === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTempleChange(t)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#331316] text-white border-amber-600 shadow-md scale-[1.01]"
                          : "bg-white text-[#2D1609] border-[#EADFCE] hover:bg-[#FAF4ED]"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-200">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-serif font-bold text-sm leading-snug">
                          {t.name}
                        </h3>
                        <p
                          className={`text-xs ${
                            isSelected ? "text-amber-200" : "text-[#796556]"
                          }`}
                        >
                          {t.city}, {t.state}
                        </p>
                      </div>

                      <div
                        className={`mt-3 pt-2 text-[11px] border-t flex items-center justify-between ${
                          isSelected ? "border-white/10 text-white/80" : "border-[#F1E7DA] text-[#645041]"
                        }`}
                      >
                        <span>{t.availablePasses.length} Pass categories</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1B: Choose Pass Category for Selected Temple */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-serif text-base font-bold text-[#2D1609]">
                  Available Darshan Categories — {selectedTemple.name}
                </label>
                <a
                  href={selectedTemple.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Official Devasthanam Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedTemple.availablePasses.map((pass) => {
                  const isSelected = selectedPass.id === pass.id;
                  return (
                    <div
                      key={pass.id}
                      onClick={() => setSelectedPass(pass)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/30 shadow-sm"
                          : "bg-white border-[#E9DFCE] hover:border-amber-400"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-serif font-bold text-sm text-[#2A1214]">
                            {pass.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {pass.quotaAvailable} left
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900 font-medium">
                          {pass.hindiName}
                        </p>
                        <p className="text-xs text-[#634E41] leading-relaxed">
                          {pass.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EDE1D1] space-y-1">
                        <div className="text-xs font-bold text-amber-950">
                          {pass.priceText}
                        </div>
                        <div className="text-[11px] text-[#7A675B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>Estimated wait: {pass.avgWaitTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Action */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-md flex items-center gap-2 transition-all"
              >
                <span>Continue to Date & Devotee Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Slot Selection & Devotees Details */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Selected Summary Pill */}
            <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#EDE2D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Selected Temple & Pass
                </span>
                <h3 className="font-serif font-bold text-base text-[#2C1315]">
                  {selectedTemple.name} — {selectedPass.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-amber-900 hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Selection</span>
              </button>
            </div>

            {/* Date & Time Slot Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-[#E9DFCE]">
              <div>
                <label className="block text-xs font-bold text-[#351E13] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Darshan Date</span>
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min="2026-10-23"
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#E4D5C2] rounded-xl px-3 py-2.5 text-xs text-[#2A1315] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <span className="text-[11px] text-[#786455] mt-1 block">
                  Bookings open up to 60 days in advance as per Devasthanam norms.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#351E13] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Reporting Time Slot</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTemple.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                        selectedSlot === slot
                          ? "bg-amber-600 text-white border-amber-600 font-semibold shadow-xs"
                          : "bg-[#FAF5EE] text-[#4F3B2F] border-[#E8DEC9] hover:bg-amber-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Devotees Information Form */}
            <div className="bg-white p-6 rounded-2xl border border-[#E9DFCE] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-700" />
                  <h3 className="font-serif font-bold text-base text-[#2C1315]">
                    Devotee Details ({devotees.length}/6 Max)
                  </h3>
                </div>
                {devotees.length < 6 && (
                  <button
                    type="button"
                    onClick={addDevotee}
                    className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    + Add Devotee
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {devotees.map((devotee, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF5EE] border border-[#EFE4D6] space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-amber-950">
                        Devotee #{idx + 1}
                      </span>
                      {devotees.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDevotee(idx)}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-[#715D4F] mb-1">
                          Full Name (As per Govt ID)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Chandra Sharma"
                          value={devotee.fullName}
                          onChange={(e) => updateDevotee(idx, "fullName", e.target.value)}
                          className="w-full bg-white border border-[#E3D4C2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#715D4F] mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          placeholder="Age"
                          value={devotee.age}
                          onChange={(e) => updateDevotee(idx, "age", e.target.value)}
                          className="w-full bg-white border border-[#E3D4C2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#715D4F] mb-1">
                          Gender
                        </label>
                        <select
                          value={devotee.gender}
                          onChange={(e) =>
                            updateDevotee(
                              idx,
                              "gender",
                              e.target.value as "Male" | "Female" | "Other"
                            )
                          }
                          className="w-full bg-white border border-[#E3D4C2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#715D4F] mb-1">
                          Photo ID Proof
                        </label>
                        <select
                          value={devotee.idType}
                          onChange={(e) =>
                            updateDevotee(
                              idx,
                              "idType",
                              e.target.value as "Aadhaar" | "Voter ID" | "Passport"
                            )
                          }
                          className="w-full bg-white border border-[#E3D4C2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Aadhaar">Aadhaar Card</option>
                          <option value="Voter ID">Voter ID</option>
                          <option value="Passport">Passport</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] text-[#715D4F] mb-1">
                          ID Number (Verification at Temple Gates)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. XXXX-XXXX-1234"
                          value={devotee.idNumber}
                          onChange={(e) => updateDevotee(idx, "idNumber", e.target.value)}
                          className="w-full bg-white border border-[#E3D4C2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#543F33] bg-[#FAF5EE] border border-[#E7DAC9] hover:bg-[#F2E7D7] transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 shadow-md flex items-center gap-2 transition-all"
              >
                <span>Proceed to Review & Confirm</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Review & Final Trust Confirmation */}
        {step === 3 && (
          <form
            onSubmit={handleSubmitBooking}
            className="space-y-6 animate-in fade-in duration-200"
          >
            <div className="bg-white p-6 rounded-2xl border border-[#E9DFCE] space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#2A1214] border-b border-[#F0E6D8] pb-3">
                Review Pilgrimage Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#EDE2D4]">
                  <span className="text-[10px] uppercase font-bold text-[#867061] block">
                    Temple & Location
                  </span>
                  <strong className="text-[#2B1416] text-sm block mt-0.5">
                    {selectedTemple.name}
                  </strong>
                  <span className="text-[#655245]">{selectedTemple.city}, {selectedTemple.state}</span>
                </div>

                <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#EDE2D4]">
                  <span className="text-[10px] uppercase font-bold text-[#867061] block">
                    Darshan Category
                  </span>
                  <strong className="text-[#2B1416] text-sm block mt-0.5">
                    {selectedPass.name}
                  </strong>
                  <span className="text-amber-800 font-semibold">{selectedPass.priceText}</span>
                </div>

                <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#EDE2D4]">
                  <span className="text-[10px] uppercase font-bold text-[#867061] block">
                    Date & Reporting Slot
                  </span>
                  <strong className="text-[#2B1416] text-sm block mt-0.5">
                    {bookingDate}
                  </strong>
                  <span className="text-[#655245]">{selectedSlot}</span>
                </div>
              </div>

              {/* Devotees List */}
              <div className="pt-2">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#645042] mb-2">
                  Devotees in this Pass ({devotees.length})
                </h4>
                <div className="divide-y divide-[#F1E8DC] border border-[#EDE2D4] rounded-xl overflow-hidden text-xs">
                  {devotees.map((d, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FAF5EE] flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <span className="font-bold text-[#2A1315]">
                        {i + 1}. {d.fullName || "Devotee"} ({d.age || "--"} yrs, {d.gender})
                      </span>
                      <span className="text-[11px] text-[#715E50]">
                        {d.idType}: {d.idNumber || "Not entered"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#483327] mb-1">
                    Mobile Number (For SMS & E-Token alert)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E3D4C2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#483327] mb-1">
                    Email Address (For PDF Pass)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="devotee@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E3D4C2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Strict Trust Notice */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Devasthanam Direct Gateway Notice</span>
                </div>
                <p className="leading-relaxed text-[11px] text-amber-900">
                  Divine Darshan connects directly with the sanctioned e-token quota of{" "}
                  <strong>{selectedTemple.trustName}</strong>. There are no middleman surcharges. Original government photo IDs matching the submitted details must be presented at the temple gate.
                </p>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreeRules}
                  onChange={(e) => setAgreeRules(e.target.checked)}
                  className="mt-0.5 rounded accent-amber-600"
                />
                <span className="text-xs text-[#5D493D] leading-relaxed">
                  I certify that all devotee details match their original government photo identification and agree to observe the sacred temple dress code and queue sanctity.
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#543F33] bg-[#FAF5EE] border border-[#E7DAC9] hover:bg-[#F2E7D7] transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={!agreeRules}
                className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-red-700 disabled:opacity-50 shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Generate Digital Darshan Token</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success Digital E-Pass Receipt */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC9] shadow-lg max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                Slot Reserved Successfully
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1214]">
                Your Darshan E-Token is Ready
              </h2>
              <p className="text-xs text-[#6B574A] mt-1">
                Booking Reference: <strong className="text-[#2A1214]">{confirmationNumber}</strong>
              </p>
            </div>

            {/* Visual Digital Pass Card */}
            <div className="p-5 rounded-2xl bg-[#FAF5EE] border-2 border-dashed border-[#E3D3C1] text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE0D1] pb-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2C1415]">
                    {selectedTemple.name}
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    {selectedPass.name} ({devotees.length} Devotees)
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E0D2C0] flex items-center justify-center text-amber-800">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#7A6658] uppercase font-bold block">
                    Scheduled Date
                  </span>
                  <span className="font-bold text-[#2A1315]">{bookingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A6658] uppercase font-bold block">
                    Reporting Time
                  </span>
                  <span className="font-bold text-[#2A1315]">{selectedSlot}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A6658] uppercase font-bold block">
                    Primary Devotee
                  </span>
                  <span className="font-medium text-[#2A1315]">
                    {devotees[0].fullName || "Devotee"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A6658] uppercase font-bold block">
                    Govt ID Proof
                  </span>
                  <span className="font-medium text-[#2A1315]">
                    {devotees[0].idType} ({devotees[0].idNumber || "Verified"})
                  </span>
                </div>
              </div>
            </div>

            {/* Gate Instructions */}
            <div className="text-left text-xs bg-amber-50/70 p-4 rounded-xl border border-amber-200/60 space-y-1 text-[#4F3D31]">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-800" />
                <span>Sanctum Entry Guidelines</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] pt-1">
                <li>Report at the e-pass queue gate 15 minutes before your allotted slot.</li>
                <li>Carry the original physical photo ID card entered during booking.</li>
                <li>Electronic items and mobile phones must be deposited at temple cloakrooms.</li>
              </ul>
            </div>

            {/* Pass Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#E0D2C0] text-[#3E291C] hover:bg-[#F2E5D6] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print PDF Pass</span>
              </button>

              <Link
                href="/live-darshan"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Watch Live Darshan Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}