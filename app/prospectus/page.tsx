"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  PhoneCall,
  MessageCircle,
  Code2,
  Database,
  Lock,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  Wrench,
  Cpu,
  Truck,
  FileCheck,
  ExternalLink,
  Store,
  DollarSign,
  TrendingUp,
  Award,
  Globe,
  Star,
  Check,
  ArrowRight,
  ChevronRight,
  Laptop,
  CreditCard,
  Send,
  Copy,
  ChevronDown,
  HelpCircle,
  Activity,
  Maximize2,
  Clock,
  Shield,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";

export default function PlatformProspectusPage() {
  const [activeTab, setActiveTab] = useState<
    "storefront" | "checkout" | "receipts" | "reviews" | "tradein" | "admin"
  >("storefront");
  const [monthlySales, setMonthlySales] = useState<number>(30);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const WHATSAPP_NUMBER = "237695349833";
  const WHATSAPP_DISPLAY = "+237 695 34 98 33";
  const DEVELOPER_NAME = "Wisdom Besong";

  const getWaUrl = (subject: string) => {
    const text = `Hello ${DEVELOPER_NAME}, I am reviewing the AURA Luxe E-Commerce Platform prospectus (${subject}). Let's discuss acquisition and deployment.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Calculations for ROI Calculator
  const avgPhonePriceFCFA = 450000;
  const grossMonthlyVolume = monthlySales * avgPhonePriceFCFA;
  const shopifyYearlyCostUSD = 1200; // Base + 2% transaction fees
  const shopifyYearlyCostFCFA = Math.round(shopifyYearlyCostUSD * 600);
  const tradeInUpsellMonthlyFCFA = Math.round(monthlySales * 0.25 * 35000); // 25% swap customers

  const FAQ_ITEMS = [
    {
      q: "What exactly do I get when I acquire this platform?",
      a: "You receive 100% full, unencrypted perpetual ownership of the entire Next.js 16 and Supabase codebase, the complete PostgreSQL database schemas, RLS security policies, Cloudinary image upload pipeline, Apple-grade PDF invoice engine, and administrative controls. There are zero recurring platform licensing fees.",
    },
    {
      q: "How fast can we launch this under my own brand name and domain?",
      a: "With our Turnkey Deployment package, we typically configure your custom domain (e.g. yourshop.cm or yourbrand.com), customize your store name, logo, color palette, pre-load your initial product catalog, and go live within 24 to 48 hours.",
    },
    {
      q: "What are the ongoing monthly hosting and server costs?",
      a: "Because this platform is built on modern serverless architecture (Next.js Edge and Supabase Cloud), the infrastructure cost is $0/month on the generous free tiers. Even at high volumes (thousands of visitors/day), server costs typically remain under $25/month — a fraction of Shopify's high pricing and transaction cut.",
    },
    {
      q: "Can this system be used for other retail niches besides phones?",
      a: "Yes, absolutely! The architecture easily adapts to Laptops & MacBooks, Sneaker boutiques, Luxury watches, Fashion & Perfumes, Gaming consoles, or Automotive parts with custom specs and attribute variants.",
    },
    {
      q: "How do payments and customer orders work in Cameroon?",
      a: "The platform is tailored for African buying habits: customers can choose Pay on Delivery with door-to-door courier dispatch, direct MTN Mobile Money / Orange Money transfer instructions, or in-person Showroom Pickup. Orders trigger real-time receipts, live tracking numbers, and 1-tap WhatsApp notifications.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. TOP FLOATING EXECUTIVE CONTROL BAR */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              CONFIDENTIAL COMMERCIAL PROSPECTUS // LIVE SYSTEM DEMO
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
              title="Copy Page Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Share URL</span>
                </>
              )}
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/15 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Live Storefront</span>
            </Link>

            <a
              href={getWaUrl("General Acquisition")}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black" />
              <span>WhatsApp Developer ({WHATSAPP_DISPLAY})</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">

        {/* 2. HERO / EXECUTIVE SUMMARY BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#121218] via-[#0B0B0E] to-[#070709] border-2 border-[#D4AF37] p-6 sm:p-12 shadow-[0_0_80px_rgba(212,175,55,0.18)]">
          {/* Ambient Lighting Gradients */}
          <div className="absolute -top-20 right-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Tagline Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10.5px] font-mono uppercase tracking-widest font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMERCIAL PLATFORM PROSPECTUS • PERPETUAL ASSET</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Architect: <strong className="text-white">{DEVELOPER_NAME}</strong>
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-sans leading-tight">
                Turnkey Luxury E-Commerce &amp; Retail Operating System
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed font-sans">
                An enterprise-grade, high-converting digital storefront and back-office management system engineered specifically for high-ticket smartphone, electronics, and luxury retail in Cameroon and Africa. Fully built, live-tested, and ready for immediate white-label handover.
              </p>
            </div>

            {/* 6 Key Architectural Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 text-xs font-mono">
              <div className="p-3 bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">SPEED</span>
                <div className="font-bold text-emerald-400">&lt;300ms Load</div>
                <span className="text-[9.5px] text-zinc-400">Next.js 16 Edge</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">PAYMENTS</span>
                <div className="font-bold text-[#D4AF37]">MoMo / COD</div>
                <span className="text-[9.5px] text-zinc-400">Cameroon Ready</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">INVOICING</span>
                <div className="font-bold text-cyan-400">Apple-Style PDF</div>
                <span className="text-[9.5px] text-zinc-400">Instant Download</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">TRADE-IN</span>
                <div className="font-bold text-purple-400">AI Swap Engine</div>
                <span className="text-[9.5px] text-zinc-400">FCFA Valuations</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">ADMIN</span>
                <div className="font-bold text-amber-400">Mobile-First</div>
                <span className="text-[9.5px] text-zinc-400">Camera Uploads</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">FEES</span>
                <div className="font-bold text-emerald-400">0% Cut / Month</div>
                <span className="text-[9.5px] text-zinc-400">100% Code Owner</span>
              </div>
            </div>

            {/* Direct CTA Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={getWaUrl("Acquisition Inquiry")}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition hover:opacity-95 shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Discuss Acquisition on WhatsApp</span>
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/15 flex items-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>Call {WHATSAPP_DISPLAY}</span>
              </a>

              <Link
                href="/admin"
                target="_blank"
                className="px-5 py-3.5 bg-black hover:bg-zinc-900 text-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/40 flex items-center gap-1.5 transition ml-auto"
              >
                <span>Test Live Admin Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        {/* 3. THE 3 AFRICAN E-COMMERCE FLAWS & HOW THIS WINS */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              01 // THE COMMERCIAL ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
              Why African Online Retailers Struggle &amp; How This System Solves It
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-3 relative hover:border-[#D4AF37]/50 transition">
              <div className="w-8 h-8 bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h3 className="font-bold text-white text-sm uppercase font-sans">
                The Customer Trust Deficit
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Cameroon consumers rarely prepay 500k+ FCFA for electronics online due to fraud fears. This platform incorporates an <strong>&quot;Inspect First, Pay on Delivery&quot;</strong> architecture, serial verification checks, and official PDF proof-of-purchase receipts with warranty stamps that build instant buyer credibility.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-3 relative hover:border-[#D4AF37]/50 transition">
              <div className="w-8 h-8 bg-amber-950/80 border border-amber-500/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h3 className="font-bold text-white text-sm uppercase font-sans">
                Sluggish WordPress / Shopify Lag
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Heavy WooCommerce templates take 6 to 10 seconds on mobile 3G/4G networks in Douala and Yaoundé, bleeding up to 70% of potential buyers. This system uses Next.js 16 with static page pre-rendering, delivering <strong>sub-300ms instant page loads</strong>.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-3 relative hover:border-[#D4AF37]/50 transition">
              <div className="w-8 h-8 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h3 className="font-bold text-white text-sm uppercase font-sans">
                Recurring Shopify SaaS Bleed
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Shopify charges monthly subscription fees ($39-$299/mo) plus 2% transaction cuts and plugin charges. With this platform, you get <strong>100% full source code ownership</strong> with zero monthly platform fees, hosted on serverless clouds for virtually $0/month.
              </p>
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE LIVE SUBSYSTEM SHOWCASE */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                02 // INTERACTIVE SUBSYSTEM PREVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
                Explore the 6 Core Engines Built Into This Platform
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">Click any engine to inspect</span>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
            {[
              { id: "storefront", label: "01 // Customer Storefront", icon: ShoppingBag },
              { id: "checkout", label: "02 // Cameroon Checkout", icon: Truck },
              { id: "receipts", label: "03 // Apple-Grade PDF Receipts", icon: FileCheck },
              { id: "reviews", label: "04 // Customer Reviews & Proof", icon: Star },
              { id: "tradein", label: "05 // AI Trade-In / Swap Hub", icon: Cpu },
              { id: "admin", label: "06 // Mobile-First Admin Command", icon: Wrench },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition cursor-pointer border ${
                    isActive
                      ? "bg-[#D4AF37] text-black font-extrabold border-[#D4AF37] shadow-md"
                      : "bg-[#0E0E12] text-zinc-400 border-white/10 hover:text-white hover:border-white/25"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 bg-[#0E0E12] border border-white/15 min-h-[320px] relative">
            
            {/* Tab 1: Storefront */}
            {activeTab === "storefront" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      High-Ticket Luxury Storefront &amp; Realtime Filtering
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      Engineered to convey the authority of an official flagship boutique.
                    </p>
                  </div>
                  <Link
                    href="/phones"
                    target="_blank"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-[#D4AF37] font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Test Catalog Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      HORIZONTAL BRAND TRACK
                    </span>
                    <p className="text-zinc-300 text-xs">
                      1-Tap brand selection (Apple, Samsung, Google, Xiaomi, Tecno, Infinix) optimized for touch on mobile screens with zero layout shift.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      STORAGE &amp; COLOR PRICING MATRIX
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Dynamically updates price, savings badges, and stock count as customers toggle between 256GB, 512GB, and 1TB finishes.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      CONDITION &amp; WARRANTY BADGES
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Transparent labeling separating <strong>Brand New Sealed</strong> from <strong>Certified Refurbished</strong> with warranty duration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Cameroon Checkout */}
            {activeTab === "checkout" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      Frictionless Cameroon Localized Checkout Flow
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      Zero registration barriers. Customers complete orders in under 45 seconds.
                    </p>
                  </div>
                  <Link
                    href="/checkout"
                    target="_blank"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-emerald-400 font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Test Checkout Flow</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-emerald-400 font-bold text-[11px] block uppercase">
                      LOCAL PAYMENT CHANNELS
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Native support for Pay on Delivery, MTN Mobile Money, Orange Money, and Showroom Pickup with city-specific delivery fee calculations.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-emerald-400 font-bold text-[11px] block uppercase">
                      EMERALD GREEN SUCCESS BEACON
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Instant, reassuring green visual feedback eliminates buyer confusion and confirms vault device allocation immediately.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-emerald-400 font-bold text-[11px] block uppercase">
                      1-TAP WHATSAPP DISPATCH
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Pre-filled WhatsApp message connects the buyer directly to the store manager with exact Order ID and destination address.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Receipts */}
            {activeTab === "receipts" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      Apple &amp; Farfetch-Grade Invoicing Engine
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      Generates crisp, high-resolution vector PDF proofs of purchase on device.
                    </p>
                  </div>
                  <Link
                    href="/checkout/success"
                    target="_blank"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-[#D4AF37] font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition"
                  >
                    <span>View Receipt Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      OFFLINE PDF GENERATION
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Built with client-side vector rendering (`jspdf`). Downloads instantly in under 1 second without hitting slow external server APIs.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      OFFICIAL QR VERIFICATION
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Includes encrypted order tracking QR code, 24K architectural gold rules, itemized VAT breakdowns, and warranty certificates.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      ON-SCREEN MODAL PARITY
                    </span>
                    <p className="text-zinc-300 text-xs">
                      In-browser receipt preview matches the downloadable PDF 1-to-1, allowing buyers to inspect their invoice before saving.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      Authentic Customer Reviews &amp; Social Proof
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      Builds deep buyer trust with verified Cameroon testimonials and concierge replies.
                    </p>
                  </div>
                  <Link
                    href="/phones/iphone-16-pro-max"
                    target="_blank"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-amber-300 font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Inspect Reviews Feed</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-amber-300 font-bold text-[11px] block uppercase">
                      5★–1★ HISTOGRAM BREAKDOWN
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Interactive percentage distribution bars, overall score calculator, and aspect ratings for Battery Health, Delivery Speed, and Condition.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-amber-300 font-bold text-[11px] block uppercase">
                      CAMEROON VERIFIED BUYER BADGES
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Tags reviews with client town (Molyko Buea, Bastos Yaoundé, Akwa Douala, Limbe, Bamenda) and variant purchased for maximum authenticity.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-amber-300 font-bold text-[11px] block uppercase">
                      CONCIERGE REPLY ENGINE
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Store administrators can reply directly to customer feedback from the admin panel, publishing official endorsements on the PDP.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Trade-In Hub */}
            {activeTab === "tradein" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      Interactive Multi-Brand Smartphone Trade-In Engine
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      Turns old phones into discount vouchers, driving high-ticket flagship upgrades.
                    </p>
                  </div>
                  <Link
                    href="/trade-in"
                    target="_blank"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-purple-400 font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Test Swap Calculator</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-purple-400 font-bold text-[11px] block uppercase">
                      INSTANT FCFA VALUATIONS
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Automated algorithm assesses phone brand, model, storage, and cosmetic condition (Flawless, Good, Fair) to calculate instant trade-in value.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-purple-400 font-bold text-[11px] block uppercase">
                      UNIQUE VOUCHER GENERATION
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Generates unique trade-in voucher codes (e.g. `SWAP-7849-BUEA`) that customers present at the showroom or during checkout.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-purple-400 font-bold text-[11px] block uppercase">
                      ADMIN APPRAISAL LEDGER
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Tracks incoming swap requests in the admin panel with 1-click WhatsApp approval templates and status management.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Admin */}
            {activeTab === "admin" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase font-sans">
                      Mobile-First Showroom Admin Control Center
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      Add inventory, manage orders, and control site configuration from your phone.
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    target="_blank"
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-[#D4AF37] font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Launch Admin Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      1-TAP PHONE CAMERA UPLOADS
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Integrated with Cloudinary API: Snap a photo of a new device in the showroom and it uploads directly to the live customer storefront.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      GEMINI AI AUTOFILL ASSISTANT
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Type a phone name (e.g. &quot;S24 Ultra 512GB Titanium&quot;) and AI automatically populates specs, highlights, and box contents in seconds.
                    </p>
                  </div>
                  <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[#D4AF37] font-bold text-[11px] block uppercase">
                      SUPABASE AUTH &amp; RLS GOVERNANCE
                    </span>
                    <p className="text-zinc-300 text-xs">
                      Role-based access control ensuring only verified administrators can modify inventory, update order statuses, or configure site settings.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 5. HEAD-TO-HEAD COMPARISON MATRIX */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              03 // COMPETITIVE BENCHMARK
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
              How This Platform Compares to Alternatives
            </h2>
          </div>

          <div className="overflow-x-auto border border-white/15 bg-[#0E0E12]">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/15 bg-black text-white/50 font-mono text-[10.5px] uppercase tracking-wider">
                  <th className="py-4 px-4 font-bold text-white">CAPABILITY / CRITERIA</th>
                  <th className="py-4 px-4 font-bold text-[#D4AF37] bg-[#D4AF37]/10 border-x border-[#D4AF37]/30">
                    THIS TURNKEY PLATFORM
                  </th>
                  <th className="py-4 px-4">SHOPIFY STORE</th>
                  <th className="py-4 px-4">WORDPRESS / WOOCOMMERCE</th>
                  <th className="py-4 px-4">TRADITIONAL DEV AGENCY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono text-[11px]">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Page Load Speed (Mobile 3G/4G)</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    &lt; 300ms (Next.js 16)
                  </td>
                  <td className="py-3 px-4 text-zinc-400">2.5s - 4.5s</td>
                  <td className="py-3 px-4 text-rose-400">6.0s - 10.0s (Heavy)</td>
                  <td className="py-3 px-4 text-zinc-400">Varies widely</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-white">Monthly Platform Subscription</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    0 FCFA / Month (Free Cloud)
                  </td>
                  <td className="py-3 px-4 text-rose-400">$39 - $299 / Month</td>
                  <td className="py-3 px-4 text-zinc-400">Hosting fees ($15-$50/mo)</td>
                  <td className="py-3 px-4 text-zinc-400">Maintenance retainer ($200+/mo)</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-white">Full Source Code Ownership</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    100% Perpetual (You Own It)
                  </td>
                  <td className="py-3 px-4 text-rose-400">0% (Rented Platform)</td>
                  <td className="py-3 px-4 text-zinc-300">Open source (fragile plugins)</td>
                  <td className="py-3 px-4 text-zinc-300">Often proprietary lock-in</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-white">Cameroon MoMo &amp; COD Flow</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    Native &amp; Pre-Integrated
                  </td>
                  <td className="py-3 px-4 text-rose-400">Requires expensive third-party apps</td>
                  <td className="py-3 px-4 text-amber-400">Requires complex plugin setup</td>
                  <td className="py-3 px-4 text-zinc-400">Billed as custom add-on</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-white">AI Trade-In / Swap Calculator</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    Pre-Built with Voucher Ledger
                  </td>
                  <td className="py-3 px-4 text-rose-400">Not Available</td>
                  <td className="py-3 px-4 text-rose-400">Not Available</td>
                  <td className="py-3 px-4 text-rose-400">+$1,500 custom build</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-white">Apple-Grade PDF Invoicing</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    Built-In Offline Engine
                  </td>
                  <td className="py-3 px-4 text-amber-400">$10/mo app add-on</td>
                  <td className="py-3 px-4 text-amber-400">PDF plugin required</td>
                  <td className="py-3 px-4 text-zinc-400">+$500 custom build</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-white">Time to Go Live</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold bg-[#D4AF37]/5 border-x border-[#D4AF37]/20">
                    24 - 48 Hours
                  </td>
                  <td className="py-3 px-4 text-zinc-400">1 - 2 Weeks</td>
                  <td className="py-3 px-4 text-zinc-400">2 - 4 Weeks</td>
                  <td className="py-3 px-4 text-rose-400">2 - 3 Months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. INTERACTIVE ROI & PROFIT IMPACT CALCULATOR */}
        <div className="p-6 sm:p-10 bg-[#0E0E12] border-2 border-[#D4AF37] space-y-6">
          <div className="border-b border-white/10 pb-4 space-y-1">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              04 // FINANCIAL IMPACT ESTIMATOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Calculate Your Business Upside
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Drag the slider to adjust your estimated monthly phone sales and see the platform&apos;s financial advantage.
            </p>
          </div>

          <div className="space-y-6">
            {/* Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 uppercase">ESTIMATED MONTHLY SALES VOLUME:</span>
                <span className="text-lg font-black text-[#D4AF37]">{monthlySales} Phones / Month</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>10 Phones (Small Boutique)</span>
                <span>75 Phones (Medium Shop)</span>
                <span>150+ Phones (Major Retailer)</span>
              </div>
            </div>

            {/* Financial Ledger Output */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">ESTIMATED MONTHLY GMV</span>
                <div className="text-xl sm:text-2xl font-black font-mono text-white">
                  {formatCFA(grossMonthlyVolume)}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Based on 450k FCFA average ticket</span>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">
                  SHOPIFY FEES SAVED / YEAR
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  +{formatCFA(shopifyYearlyCostFCFA)}
                </div>
                <span className="text-[10px] font-mono text-emerald-400/80">0% SaaS subscription costs</span>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block font-bold">
                  SWAP UPSELL MARGIN / MO
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#D4AF37]">
                  +{formatCFA(tradeInUpsellMonthlyFCFA)}
                </div>
                <span className="text-[10px] font-mono text-zinc-400">From automated phone trade-ins</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. HOW I PERSONALIZE IT FOR YOU (48-HOUR ROADMAP) */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              05 // CUSTOMIZATION &amp; ONBOARDING ROADMAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
              The 48-Hour White-Label Handover Blueprint
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                Brand &amp; Visual Identity
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                We rebrand the storefront with your custom store name, logo, color palette, announcement banner, and contact channels.
              </p>
            </div>

            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                Product Catalog Import
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                We import your specific inventory models, storage tiers, colors, and prices so your store is fully stocked on Day 1.
              </p>
            </div>

            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                Domain &amp; Cloud Setup
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                We connect your custom domain (e.g. <em>yourbrand.cm</em> or <em>.com</em>) with free SSL certificate and Supabase cloud database.
              </p>
            </div>

            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                04
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                Admin Staff Onboarding
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                A live walk-through teaching you and your staff how to add products on mobile, manage incoming orders, and reply to reviews.
              </p>
            </div>
          </div>
        </div>

        {/* 8. COMMERCIAL ACQUISITION PACKAGES */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              06 // ACQUISITION PACKAGES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
              Commercial Acquisition Options
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tier 1 */}
            <div className="p-6 sm:p-7 bg-[#0E0E12] border border-white/15 space-y-5 relative">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">TIER 01</span>
                <h3 className="text-lg font-black uppercase text-white font-sans">
                  Core Source Code License
                </h3>
                <p className="text-xs text-zinc-400 font-sans">For tech founders &amp; internal software engineering teams</p>
              </div>

              <div className="py-3 border-y border-white/10 font-mono">
                <div className="text-xs text-zinc-400">Immediate Git Repository Handover</div>
                <div className="text-xl font-bold text-white mt-0.5">100% Perpetual Code Ownership</div>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full Next.js 16 + Supabase Codebase</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Database Schemas, RLS Policies &amp; Triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Receipt PDF &amp; Trade-In Engines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Deployment Guide &amp; Environment Setup Docs</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={getWaUrl("Tier 1 - Source Code License")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <span>Inquire for Tier 1</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="p-6 sm:p-7 bg-[#121218] border-2 border-[#D4AF37] space-y-5 relative shadow-[0_0_50px_rgba(212,175,55,0.18)]">
              <span className="absolute -top-3 right-6 px-3 py-0.5 bg-[#D4AF37] text-black font-mono text-[10px] font-extrabold uppercase tracking-widest">
                MOST POPULAR
              </span>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">TIER 02</span>
                <h3 className="text-lg font-black uppercase text-white font-sans">
                  Turnkey Live Deployment
                </h3>
                <p className="text-xs text-zinc-300 font-sans">We set up everything for you. Ready to sell in 48 hours.</p>
              </div>

              <div className="py-3 border-y border-white/10 font-mono">
                <div className="text-xs text-[#D4AF37]">Complete Done-For-You Setup</div>
                <div className="text-xl font-bold text-white mt-0.5">Fully Branded &amp; Live</div>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Everything in Tier 1</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Custom Logo, Brand Colors &amp; Content Setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Custom Domain Setup (e.g. yourshop.cm)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Supabase Cloud Database Provisioning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Live Admin Staff Onboarding Video Call</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={getWaUrl("Tier 2 - Turnkey Live Deployment")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:opacity-95 shadow-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  <span>Select Turnkey Package</span>
                </a>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-6 sm:p-7 bg-[#0E0E12] border border-white/15 space-y-5 relative">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">TIER 03</span>
                <h3 className="text-lg font-black uppercase text-white font-sans">
                  Enterprise VIP Partnership
                </h3>
                <p className="text-xs text-zinc-400 font-sans">Custom features, payment gateways &amp; priority support</p>
              </div>

              <div className="py-3 border-y border-white/10 font-mono">
                <div className="text-xs text-zinc-400">Dedicated Technical Concierge</div>
                <div className="text-xl font-bold text-white mt-0.5">3 Months Retainer Included</div>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Everything in Tier 1 &amp; Tier 2</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct Mobile Money API Gateway Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated SMS Dispatch System Setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 Months Dedicated Maintenance &amp; Upgrades</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={getWaUrl("Tier 3 - Enterprise VIP Partnership")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <span>Select Enterprise VIP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 9. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              07 // FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
              Questions You Might Have Before Acquiring
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0E0E12] border border-white/10 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold uppercase font-sans text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-zinc-300 leading-relaxed font-sans border-t border-white/5">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 10. DIRECT DEVELOPER CONTACT CARD */}
        <div className="p-8 sm:p-10 bg-[#0E0E12] border-2 border-[#D4AF37] space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[10.5px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                <Award className="w-4 h-4" />
                <span>DIRECT FOUNDER &amp; LEAD ARCHITECT</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-sans">
                Acquire This Platform Directly from {DEVELOPER_NAME}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl font-sans leading-relaxed">
                Based in Cameroon (Buea / Douala / Yaoundé). Immediate Git repository handover, official commercial bill of sale, and live technical deployment available today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={getWaUrl("Platform Purchase Negotiation")}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition shadow-xl"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="px-5 py-4 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/20 transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>Call {WHATSAPP_DISPLAY}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-black border border-white/10 space-y-1">
              <span className="text-zinc-500 uppercase text-[10px]">DIRECT WHATSAPP LINE</span>
              <div className="text-sm font-bold text-white">{WHATSAPP_DISPLAY}</div>
              <span className="text-[10px] text-emerald-400">Online &amp; ready for discussion</span>
            </div>

            <div className="p-4 bg-black border border-white/10 space-y-1">
              <span className="text-zinc-500 uppercase text-[10px]">LEAD ARCHITECT CREDENTIALS</span>
              <div className="text-sm font-bold text-[#D4AF37]">Full-Stack Web &amp; Mobile Engineer</div>
              <span className="text-[10px] text-zinc-400">Next.js 16 • Supabase • React Native</span>
            </div>

            <div className="p-4 bg-black border border-white/10 space-y-1">
              <span className="text-zinc-500 uppercase text-[10px]">TRANSACTION CERTAINTY</span>
              <div className="text-sm font-bold text-white">Full Intellectual Property Transfer</div>
              <span className="text-[10px] text-zinc-400">Bill of sale &amp; complete asset handover</span>
            </div>
          </div>
        </div>

        {/* FOOTER NOTICE */}
        <div className="text-center text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/5 space-y-1">
          <div>CONFIDENTIAL PROSPECTUS // PROPRIETARY ASSET OF {DEVELOPER_NAME.toUpperCase()}</div>
          <div className="text-zinc-600">Sharable link: https://phone.wisedev.online/prospectus</div>
        </div>

      </div>
    </div>
  );
}
