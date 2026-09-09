"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Send,
  CheckCircle2,
  RotateCcw,
  Smartphone,
  Check,
} from "lucide-react";
import { useAi } from "@/lib/store/ai-context";
import { useSettings } from "@/lib/store/settings-context";

interface FaqItem {
  id: string;
  category: string;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    id: "authenticity",
    category: "Device Authenticity",
    q: "How do I verify that my smartphone is 100% genuine and authentic?",
    a: "We stock both Brand New Factory-Sealed devices and Certified Pre-Owned (Grade A) devices. For Brand New units, you can verify the serial number live on the official Apple Coverage portal (checkcoverage.apple.com) or Samsung warranty database prior to unboxing. For Certified Pre-Owned units, each phone undergoes a comprehensive 30+ point hardware, screen, and battery health inspection (guaranteed 85%+ battery health and 100% original OEM parts) with full IMEI-documented receipts.",
  },
  {
    id: "payment",
    category: "Payment Methods",
    q: "What payment methods are supported across Cameroon?",
    a: "We accept MTN Mobile Money (*126#), Orange Money (#150#), and Cash on Delivery upon physical inspection and testing of your device at your address or our Buea showroom.",
  },
  {
    id: "delivery",
    category: "Express Delivery",
    q: "How fast is delivery to my city?",
    a: "For orders in Buea (Molyko, Checkpoint, Mile 17, Clerks Quarters), our dedicated courier delivers same-day within 1–2 hours (free showroom pickup is also available). For Douala, Yaoundé, Bafoussam, Bamenda, Limbe, and all other regions of Cameroon, our secure express agency transit delivers within 24 hours.",
  },
  {
    id: "swap",
    category: "Phone Swap / Trade-In",
    q: "How does the Phone Swap / Trade-In service work?",
    a: "You can use our online 4-step Trade-In calculator to get an instant appraisal for your current iPhone, Samsung, Pixel, or Tecno. Bring or send your device to our showroom where technicians verify its condition, and the appraised value is immediately deducted from your new flagship purchase.",
  },
  {
    id: "warranty",
    category: "Warranty & Returns",
    q: "What warranty coverage is included with my purchase?",
    a: "Brand New sealed smartphones include a 6 to 12-month hardware warranty, while Certified Pre-Owned units include our 3 to 6-month Boutique Hardware Guarantee. Additionally, all purchases include our 7-Day Immediate Replacement Guarantee: if your device exhibits any hardware fault or defect within 7 days, we exchange it for a replacement unit immediately.",
  },
  {
    id: "data-transfer",
    category: "Showroom Services",
    q: "Can you help transfer my data from my old phone to my new phone?",
    a: "Yes. When you purchase or swap a phone at our Buea showroom, our technicians provide complimentary secure data migration (contacts, photos, WhatsApp chats, apps) and perform a certified data wipe of your old device.",
  },
];

const INQUIRY_TOPICS = [
  "Order Tracking & Dispatch",
  "Phone Availability & Pricing",
  "Phone Swap / Trade-In Inquiry",
  "Warranty & 7-Day Exchange",
  "Showroom Visit & In-Store Pickup",
  "Payment Assistance (MTN / Orange)",
];

export default function SupportPage() {
  const { setIsAiOpen } = useAi();
  const { settings } = useSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>("all");

  // Quick Inquiry form state
  const [inquiryTopic, setInquiryTopic] = useState(INQUIRY_TOPICS[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [inquiryNotes, setInquiryNotes] = useState("");

  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";
  const primaryPhone = settings.whatsappPhone || "+237 699 442 100";
  const secondaryPhone = settings.secondaryPhone || "+237 670 000 000";

  // Filtered FAQs
  const categories = ["all", "Device Authenticity", "Payment Methods", "Express Delivery", "Warranty & Returns", "Phone Swap / Trade-In"];
  
  const filteredFaqs = activeFaqCategory === "all"
    ? FAQS
    : FAQS.filter((f) => f.category === activeFaqCategory);

  const handleSendInquiryWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Please enter your name and WhatsApp phone number.");
      return;
    }

    const message = `*AURA LUXE MOBILE — CUSTOMER INQUIRY*
Topic: *${inquiryTopic}*
Customer Name: *${customerName.trim()}*
Phone: *${customerPhone.trim()}*
${inquiryNotes.trim() ? `Notes: ${inquiryNotes.trim()}\n` : ""}
Hello AURA Support, I would like assistance regarding ${inquiryTopic}. Please connect me with a concierge.`;

    const url = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. ARCHITECTURAL HERO HEADER (Straight Edges with Crosshairs) */}
        <div className="border border-white/10 bg-[#0E0E12] p-6 sm:p-10 relative rounded-none shadow-2xl">
          {/* Viewfinder corner crosshairs */}
          <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#D4AF37] block">
                Customer Care &amp; Showroom Hub
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                How Can We Assist You?
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                Visit our showroom in Buea, track ongoing deliveries across Cameroon, request instant trade-in assistance, or chat directly with our sales concierge.
              </p>
            </div>

            {/* Live Operational Status */}
            <div className="p-4 bg-black border border-white/10 text-xs font-mono shrink-0 space-y-2 rounded-none">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
                <span>SHOWROOM OPEN TODAY</span>
              </div>
              <div className="text-zinc-400 text-[11px] space-y-1 font-sans">
                <p>Mon – Sat: 8:00 AM – 8:00 PM</p>
                <p>Sunday: 12:00 PM – 6:00 PM</p>
                <p className="text-[#D4AF37] font-mono text-[10px]">Checkpoint, Molyko, Buea</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. QUICK ACTION CONTACT TILES (4 Equal Straight-Edged Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: WhatsApp Concierge */}
          <a
            href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent("Hello AURA Luxe Mobile, I would like customer support.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-[#0E0E12] border border-white/10 hover:border-[#25D366]/60 transition-all rounded-none group cursor-pointer block relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#0A1A10] border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#25D366] uppercase font-bold">Fast Reply</span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono">WhatsApp Concierge</h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Instant chat for stock confirmation, pricing, and live photos.
            </p>
            <span className="text-xs font-mono font-bold text-[#25D366] mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Chat</span>
              <span>→</span>
            </span>
          </a>

          {/* Card 2: Phone Call */}
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
            className="p-5 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/60 transition-all rounded-none group cursor-pointer block relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-black border border-white/15 flex items-center justify-center text-[#D4AF37]">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Direct Line</span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono">Direct Phone Call</h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Speak directly with our store manager or sales desk.
            </p>
            <span className="text-xs font-mono font-bold text-[#D4AF37] mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{primaryPhone}</span>
              <span>→</span>
            </span>
          </a>

          {/* Card 3: Showroom Directions */}
          <Link
            href="#showroom-details"
            className="p-5 bg-[#0E0E12] border border-white/10 hover:border-white/30 transition-all rounded-none group cursor-pointer block relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-black border border-white/15 flex items-center justify-center text-[#D4AF37]">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">Showroom</span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono">Buea Showroom</h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Visit our physical store at Checkpoint Molyko for testing &amp; pickup.
            </p>
            <span className="text-xs font-mono font-bold text-white mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Location</span>
              <span>↓</span>
            </span>
          </Link>

          {/* Card 4: AI Budget Concierge */}
          <button
            type="button"
            onClick={() => setIsAiOpen(true)}
            className="p-5 bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/60 text-left transition-all rounded-none group cursor-pointer block relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">24/7 Active</span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase font-mono">AI Phone Advisor</h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Get smartphone recommendations based on your FCFA budget.
            </p>
            <span className="text-xs font-mono font-bold text-[#D4AF37] mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Advisor</span>
              <span>→</span>
            </span>
          </button>

        </div>

        {/* 3. SHOWROOM & LOGISTICS HUBS (2-Column Grid) */}
        <div id="showroom-details" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Physical Showroom (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0E0E12] border border-white/10 p-6 sm:p-8 rounded-none space-y-6 relative">
            <span className="absolute top-2 right-2 text-zinc-700 font-mono text-[10px] select-none">+</span>

            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                  PHYSICAL STORE LOCATION
                </span>
                <h2 className="text-xl font-bold text-white uppercase font-mono mt-1">
                  Buea Flagship Showroom
                </h2>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                Active Showroom
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Physical Address:</span>
                <p className="text-white font-sans font-medium text-xs">
                  {settings.bueaAddress || "Check Point, Molyko, Buea, South West Region, Cameroon"}
                </p>
                <span className="text-[10px] text-[#D4AF37] font-mono block pt-1">Opposite UB Junction Corridor</span>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Direct Contacts:</span>
                <p className="text-white font-mono text-xs">{primaryPhone}</p>
                <p className="text-zinc-400 font-mono text-xs">{secondaryPhone}</p>
                <p className="text-[#D4AF37] font-mono text-[10px]">{settings.email || "support@auraluxe.cm"}</p>
              </div>
            </div>

            {/* Showroom Services Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold block">
                In-Store Showroom Services:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300 font-sans">
                <div className="p-2.5 bg-black/40 border border-white/5 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Physical Device Inspection &amp; Testing</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Free Data Migration &amp; Certified Wipe</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Instant Trade-In Valuation &amp; Swap</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-white/5 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Cash on Delivery / In-Store Pickup</span>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent("Hello AURA, I am planning to visit the Buea showroom today. Please confirm opening hours and availability.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#0A1A10] hover:bg-[#0E2617] border border-[#25D366]/40 text-[#25D366] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-none transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Showroom Team on WhatsApp</span>
            </a>
          </div>

          {/* Right: Quick Inquiry Dispatcher Form (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0E0E12] border border-white/10 p-6 sm:p-8 rounded-none space-y-5 relative">
            <span className="absolute top-2 right-2 text-zinc-700 font-mono text-[10px] select-none">+</span>

            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                FAST INQUIRY &amp; CALLBACK
              </span>
              <h2 className="text-xl font-bold text-white uppercase font-mono mt-1">
                Send Direct Inquiry
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Choose a topic and connect directly with the appropriate support desk.
              </p>
            </div>

            <form onSubmit={handleSendInquiryWhatsApp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  Inquiry Topic <span className="text-[#D4AF37]">*</span>
                </label>
                <select
                  value={inquiryTopic}
                  onChange={(e) => setInquiryTopic(e.target.value)}
                  className="w-full bg-black border border-white/15 px-3 py-2.5 text-xs text-white rounded-none focus:outline-none focus:border-[#D4AF37] font-mono"
                >
                  {INQUIRY_TOPICS.map((topic) => (
                    <option key={topic} value={topic} className="bg-black text-white">
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  Your Full Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Wisdom Besong"
                  className="w-full bg-black border border-white/15 px-3.5 py-2.5 text-xs text-white rounded-none focus:outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  WhatsApp &amp; Phone Number <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 699 00 00 00"
                  className="w-full bg-black border border-white/15 px-3.5 py-2.5 text-xs text-white rounded-none focus:outline-none focus:border-[#D4AF37] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  Details / Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  placeholder="e.g. Inquiring about iPhone 16 Pro Max 256GB Desert Titanium stock..."
                  className="w-full bg-black border border-white/15 px-3.5 py-2 text-xs text-white rounded-none focus:outline-none focus:border-[#D4AF37] font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 gold-gradient-bg text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-none hover:opacity-95 transition cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <Send className="w-3.5 h-3.5 text-black" />
                <span>Submit Inquiry via WhatsApp</span>
              </button>
            </form>
          </div>

        </div>

        {/* 4. CATEGORIZED FAQ ACCORDION */}
        <div className="border border-white/10 bg-[#0E0E12] p-6 sm:p-8 rounded-none space-y-6 shadow-2xl relative">
          <span className="absolute top-2 right-2 text-zinc-700 font-mono text-[10px] select-none">+</span>

          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                KNOWLEDGE BASE &amp; POLICIES
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-mono mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Clear answers to common questions
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3 py-1.5 border text-xs uppercase tracking-wider font-bold transition-all shrink-0 rounded-none cursor-pointer ${
                  activeFaqCategory === cat
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "bg-[#141419] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "ALL QUESTIONS" : cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* FAQ Items Accordion */}
          <div className="divide-y divide-white/10 border border-white/10 bg-black">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold tracking-wider block">
                        {faq.category}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white font-sans block">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-300 leading-relaxed font-sans border-t border-white/5 pt-3 bg-[#0c0c10]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. SERVICE GUARANTEES FOOTER STRIP (Straight Edges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-zinc-300 font-mono">
          <div className="p-4 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <span className="font-bold text-white block uppercase text-[11px]">100% Authentic Hardware</span>
              <span className="text-zinc-400 text-[10px] font-sans">Sealed new & certified pre-owned with IMEI documentation</span>
            </div>
          </div>

          <div className="p-4 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-3">
            <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block uppercase text-[11px]">Nationwide Express</span>
              <span className="text-zinc-400 text-[10px] font-sans">Buea 1-2h • Douala/Yaoundé 24h</span>
            </div>
          </div>

          <div className="p-4 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <span className="font-bold text-white block uppercase text-[11px]">7-Day Replacement</span>
              <span className="text-zinc-400 text-[10px] font-sans">Immediate hardware exchange</span>
            </div>
          </div>

          <div className="p-4 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="font-bold text-white block uppercase text-[11px]">Molyko Showroom</span>
              <span className="text-zinc-400 text-[10px] font-sans">Check Point, Buea Pickup Hub</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
