"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Printer,
  Download,
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
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";

export default function PlatformProspectusPage() {
  const [selectedTier, setSelectedTier] = useState<"starter" | "turnkey" | "vip">("turnkey");
  const [copiedLink, setCopiedLink] = useState(false);

  const WHATSAPP_NUMBER = "237695349833";
  const WHATSAPP_DISPLAY = "+237 695 34 98 33";
  const DEVELOPER_NAME = "Wisdom Besong";

  const getWaUrl = (subject: string) => {
    const text = `Hello ${DEVELOPER_NAME}, I am interested in acquiring the AURA Luxe E-Commerce Platform (${subject}). Let's discuss terms and live deployment.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* STYLES FOR CLEAN PRINT / PDF GENERATION */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          nav, footer, .no-print {
            display: none !important;
          }
          .print-clean {
            background-color: #ffffff !important;
            color: #111111 !important;
            border-color: #e5e7eb !important;
            box-shadow: none !important;
          }
          .print-card {
            border: 1px solid #d1d5db !important;
            background: #fafafa !important;
            color: #111111 !important;
            page-break-inside: avoid;
          }
          .print-text-dark {
            color: #111111 !important;
          }
          .print-gold {
            color: #b45309 !important;
          }
        }
      `}</style>

      {/* TOP FLOATING PROSPECTUS ACTION BAR */}
      <div className="no-print sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              CONFIDENTIAL COMMERCIAL PROSPECTUS // TURNKEY PLATFORM SALE
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
              title="Save or Print as PDF Document"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Save / Print PDF</span>
            </button>

            <a
              href={getWaUrl("General Acquisition")}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black" />
              <span>WhatsApp Developer ({WHATSAPP_DISPLAY})</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-14">

        {/* 1. HERO / EXECUTIVE PITCH HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#121218] via-[#0B0B0E] to-[#070709] border-2 border-[#D4AF37] p-6 sm:p-12 shadow-[0_0_80px_rgba(212,175,55,0.15)] print-clean">
          <div className="relative z-10 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10.5px] font-mono uppercase tracking-widest font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMERCIAL SOFTWARE ASSET SPECIFICATION</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Author &amp; Lead Architect: <strong className="text-white">{DEVELOPER_NAME}</strong>
              </span>
            </div>

            <div className="space-y-3 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans print-text-dark">
                Turnkey Luxury E-Commerce &amp; Smartphone Retail Platform
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans print-text-dark">
                An enterprise-grade, high-converting digital storefront and back-office management system engineered specifically for high-ticket retail in Cameroon and Africa. Fully functional, live-tested, and ready for immediate white-label deployment under your brand.
              </p>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-black/60 border border-white/10 space-y-0.5 print-card">
                <span className="text-[10px] font-mono uppercase text-zinc-400">FRONTEND SPEED</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">100/100</div>
                <span className="text-[10px] text-zinc-500">Next.js 16 Turbopack</span>
              </div>
              <div className="p-3.5 bg-black/60 border border-white/10 space-y-0.5 print-card">
                <span className="text-[10px] font-mono uppercase text-zinc-400">CAMEROON LOGISTICS</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-[#D4AF37] print-gold">MTN / Orange / COD</div>
                <span className="text-[10px] text-zinc-500">Pay on Delivery Ready</span>
              </div>
              <div className="p-3.5 bg-black/60 border border-white/10 space-y-0.5 print-card">
                <span className="text-[10px] font-mono uppercase text-zinc-400">ADMIN CONTROL</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400">Mobile-First</div>
                <span className="text-[10px] text-zinc-500">AI Phone Autofill &amp; Cloud</span>
              </div>
              <div className="p-3.5 bg-black/60 border border-white/10 space-y-0.5 print-card">
                <span className="text-[10px] font-mono uppercase text-zinc-400">SOURCE CODE OWNERSHIP</span>
                <div className="text-lg sm:text-xl font-bold font-mono text-purple-400">100% Perpetual</div>
                <span className="text-[10px] text-zinc-500">Zero Recurring Shopify Fees</span>
              </div>
            </div>

            {/* Direct CTA Bar */}
            <div className="no-print pt-4 flex flex-wrap items-center gap-3">
              <a
                href={getWaUrl("Acquisition Inquiry")}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition hover:opacity-95 shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Discuss Purchase on WhatsApp</span>
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/15 flex items-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>Call {WHATSAPP_DISPLAY}</span>
              </a>

              <Link
                href="/"
                target="_blank"
                className="px-5 py-3.5 bg-black hover:bg-zinc-900 text-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/40 flex items-center gap-1.5 transition ml-auto"
              >
                <span>Open Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        {/* 2. THE PROBLEM IT SOLVES (WHY THIS WINS IN CAMEROON) */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              01 // MARKET ADVANTAGE
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5 print-text-dark">
              Why African Retailers Lose 70% of Online Sales &amp; How This Solves It
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-3 print-card">
              <div className="w-8 h-8 bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h3 className="font-bold text-white text-sm uppercase font-sans print-text-dark">
                The Trust &amp; Fraud Barrier
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Cameroon shoppers will not prepay 600,000 FCFA online. This platform features an integrated <strong>&quot;Inspect First, Pay on Delivery&quot;</strong> architecture, authentic serial-number verification steps, and official proof-of-purchase receipts that build immediate buyer confidence.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-3 print-card">
              <div className="w-8 h-8 bg-amber-950/80 border border-amber-500/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h3 className="font-bold text-white text-sm uppercase font-sans print-text-dark">
                Slow, Clunky WordPress &amp; Shopify
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Traditional WordPress sites take 6-10 seconds on mobile 3G/4G in Douala/Yaoundé, causing huge bounce rates. This system is built with Next.js 16 and edge caching, rendering pages in <strong>under 300 milliseconds</strong> with zero lag.
              </p>
            </div>

            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-3 print-card">
              <div className="w-8 h-8 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h3 className="font-bold text-white text-sm uppercase font-sans print-text-dark">
                No Monthly SaaS Subscriptions
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Shopify charges $39 to $299 every single month plus 2% transaction fees. You acquire <strong>100% full source code ownership</strong> with zero monthly platform fees, hosted freely on modern serverless clouds.
              </p>
            </div>
          </div>
        </div>

        {/* 3. COMPLETE FEATURE INVENTORY MATRIX */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              02 // COMPLETE SYSTEM SPECIFICATIONS
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5 print-text-dark">
              What Is Already Built &amp; Tested in This Codebase
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Feature 1 */}
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5 print-card">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span className="print-text-dark">Complete Catalog &amp; Dynamic Filter Engine</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Instant horizontal brand bar (Apple, Samsung, Google, Xiaomi, Tecno), condition badges (Brand New vs. Certified Refurbished), storage &amp; color pricing matrix, live stock indicators, and instant fuzzy ripgrep search.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Live on /phones and /phones/[slug]</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5 print-card">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span className="print-text-dark">Frictionless Cameroon Checkout &amp; WhatsApp Flow</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                2-step checkout supporting Pay on Delivery, MTN MoMo, Orange Money, and Showroom Pickup. Features distinctive emerald green verification beacon and 1-tap WhatsApp dispatch confirmation.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Live on /checkout and /checkout/success</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5 print-card">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span className="print-text-dark">Luxury PDF Invoicing &amp; Proof of Purchase Hub</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Apple/Farfetch-grade downloadable PDF invoice engine (`jspdf`) with QR code verification, 24K architectural lines, customer address, warranty stamps, and on-screen modal preview.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Built into orders, checkout, and receipt modal</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5 print-card">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="print-text-dark">Real Customer Reviews &amp; Rating Breakdown</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Overall score snapshot, 5★–1★ interactive histogram, aspect ratings (Battery, Delivery, Condition), verified buyer badges by Cameroon city, review submission modal, and admin reply moderation.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Live on every product page and admin panel</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5 print-card">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="print-text-dark">AI-Powered Smartphone Trade-In / Swap Hub</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Multi-brand phone swap calculator (iPhone, Samsung, Google, etc.). Automatically computes market trade-in valuations in FCFA, generates unique voucher codes, and triggers direct swap requests.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Live on /trade-in with admin voucher ledger</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2.5 print-card">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Wrench className="w-4 h-4 text-purple-400" />
                <span className="print-text-dark">Mobile-First Admin Command &amp; AI Product Autofill</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Store managers can add inventory directly from a smartphone on the showroom floor. Features Cloudinary direct camera uploads, Gemini AI spec autofill, order dispatch tracking, and site config.
              </p>
              <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Live on /admin with Supabase Auth governance</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. HOW WE CUSTOMIZE IT FOR THE BUYER */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              03 // TAILORED CUSTOMIZATION SERVICES
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5 print-text-dark">
              How I Will Personalize This Platform for Your Exact Business
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2 print-card">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider print-text-dark">
                Brand &amp; Logo Customization
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Rebranding with your boutique name, logo, custom color palette, contact numbers, showroom address, and custom domain (e.g. <em>yourbrand.cm</em> or <em>yourbrand.com</em>).
              </p>
            </div>

            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2 print-card">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider print-text-dark">
                Product Catalog &amp; Niche Adaptation
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Adaptable to any niche: Smartphones, Laptops &amp; MacBooks, Sneakers &amp; Luxury Fashion, Perfumes, Electronics, or Automotive Parts with initial inventory pre-loaded.
              </p>
            </div>

            <div className="p-5 bg-[#0E0E12] border border-white/10 space-y-2 print-card">
              <div className="w-7 h-7 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h4 className="font-bold text-white text-xs uppercase font-sans tracking-wider print-text-dark">
                Payment Gateways &amp; Currencies
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed print-text-dark">
                Integration with direct automated mobile money APIs (Campay, NotchPay, CinetPay, Stripe, Flutterwave) or multi-currency switching (FCFA, NGN, USD, EUR, GBP).
              </p>
            </div>

          </div>
        </div>

        {/* 5. FUTURE ROADMAP & EXTENSIONS */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              04 // EXTENSION ROADMAP
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5 print-text-dark">
              Advanced Capabilities We Can Add on Request
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-black/60 border border-white/10 space-y-1.5 print-card">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white uppercase print-text-dark">Native Mobile Apps</h4>
              <p className="text-zinc-400 leading-relaxed print-text-dark">
                Packaged into native iOS &amp; Android Apps published on App Store &amp; Google Play with push notifications.
              </p>
            </div>

            <div className="p-4 bg-black/60 border border-white/10 space-y-1.5 print-card">
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="font-bold text-white uppercase print-text-dark">Automated SMS Gateway</h4>
              <p className="text-zinc-400 leading-relaxed print-text-dark">
                Automated SMS alerts sent to customer phones upon order dispatch and tracking updates via Orange/MTN SMS.
              </p>
            </div>

            <div className="p-4 bg-black/60 border border-white/10 space-y-1.5 print-card">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-white uppercase print-text-dark">Showroom POS Barcode</h4>
              <p className="text-zinc-400 leading-relaxed print-text-dark">
                Physical showroom barcode &amp; thermal receipt printer integration for in-store walk-in sales syncing with website stock.
              </p>
            </div>

            <div className="p-4 bg-black/60 border border-white/10 space-y-1.5 print-card">
              <Award className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-white uppercase print-text-dark">VIP Loyalty &amp; Coupons</h4>
              <p className="text-zinc-400 leading-relaxed print-text-dark">
                Customer reward point system, influencer referral codes, and time-limited promotional discount banners.
              </p>
            </div>
          </div>
        </div>

        {/* 6. COMMERCIAL ACQUISITION PACKAGES */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              05 // ACQUISITION PACKAGES
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5 print-text-dark">
              Commercial Acquisition Options
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tier 1 */}
            <div className="p-6 bg-[#0E0E12] border border-white/15 space-y-5 relative print-card">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">TIER 01</span>
                <h3 className="text-lg font-black uppercase text-white font-sans print-text-dark">
                  Source Code License
                </h3>
                <p className="text-xs text-zinc-400">For tech-savvy founders &amp; internal software teams</p>
              </div>

              <div className="py-3 border-y border-white/10 font-mono">
                <div className="text-xs text-zinc-400">Immediate Git Repository Transfer</div>
                <div className="text-xl font-bold text-white mt-0.5 print-text-dark">Full Perpetual Ownership</div>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full Next.js 16 + Supabase Codebase</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Database Schemas, RLS &amp; Triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Receipt PDF &amp; Trade-In Engines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Deployment Guide &amp; Env Documentation</span>
                </li>
              </ul>

              <div className="no-print pt-2">
                <a
                  href={getWaUrl("Tier 1 - Source Code License")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <span>Select Tier 1</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="p-6 bg-[#121218] border-2 border-[#D4AF37] space-y-5 relative shadow-[0_0_40px_rgba(212,175,55,0.15)] print-card">
              <span className="absolute -top-3 right-6 px-3 py-0.5 bg-[#D4AF37] text-black font-mono text-[10px] font-extrabold uppercase tracking-widest">
                RECOMMENDED
              </span>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">TIER 02</span>
                <h3 className="text-lg font-black uppercase text-white font-sans print-text-dark">
                  Turnkey Live Deployment
                </h3>
                <p className="text-xs text-zinc-300">We set up everything for you. Ready to sell in 48 hours.</p>
              </div>

              <div className="py-3 border-y border-white/10 font-mono">
                <div className="text-xs text-[#D4AF37]">Complete Done-For-You Setup</div>
                <div className="text-xl font-bold text-white mt-0.5 print-text-dark">White-Label &amp; Live</div>
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
                  <span>Admin Staff Onboarding Session</span>
                </li>
              </ul>

              <div className="no-print pt-2">
                <a
                  href={getWaUrl("Tier 2 - Turnkey Live Deployment")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:opacity-95 shadow-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  <span>Select Turnkey Package</span>
                </a>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-6 bg-[#0E0E12] border border-white/15 space-y-5 relative print-card">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">TIER 03</span>
                <h3 className="text-lg font-black uppercase text-white font-sans print-text-dark">
                  Enterprise VIP Partnership
                </h3>
                <p className="text-xs text-zinc-400">Custom features, payment gateways &amp; priority support</p>
              </div>

              <div className="py-3 border-y border-white/10 font-mono">
                <div className="text-xs text-zinc-400">Dedicated Technical Concierge</div>
                <div className="text-xl font-bold text-white mt-0.5 print-text-dark">3 Months Retainer Included</div>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Everything in Tier 1 &amp; Tier 2</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct Mobile Money API Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated SMS Dispatch System</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 Months Dedicated Maintenance &amp; Upgrades</span>
                </li>
              </ul>

              <div className="no-print pt-2">
                <a
                  href={getWaUrl("Tier 3 - Enterprise VIP Partnership")}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <span>Select Enterprise VIP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 7. CONTACT & DEVELOPER PROFILE */}
        <div className="p-8 bg-[#0E0E12] border-2 border-[#D4AF37] space-y-6 print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                DIRECT FOUNDER &amp; DEVELOPER LINE
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-sans print-text-dark">
                Acquire This Platform Directly from {DEVELOPER_NAME}
              </h3>
              <p className="text-xs text-zinc-400">
                Buea / Douala / Yaoundé, Cameroon • Immediate contract and asset handover available
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={getWaUrl("Platform Purchase Negotiation")}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition shadow-xl"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/20 transition"
              >
                <span>Call {WHATSAPP_DISPLAY}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-black border border-white/10 space-y-1">
              <span className="text-zinc-500 uppercase text-[10px]">DIRECT TELEPHONE &amp; WHATSAPP</span>
              <div className="text-sm font-bold text-white print-text-dark">{WHATSAPP_DISPLAY}</div>
              <span className="text-[10px] text-emerald-400">Available 24/7 for business inquiries</span>
            </div>

            <div className="p-4 bg-black border border-white/10 space-y-1">
              <span className="text-zinc-500 uppercase text-[10px]">ENGINEERING CREDENTIALS</span>
              <div className="text-sm font-bold text-[#D4AF37]">Full-Stack Web &amp; Mobile Architect</div>
              <span className="text-[10px] text-zinc-400">Next.js 16 • Supabase • React Native</span>
            </div>

            <div className="p-4 bg-black border border-white/10 space-y-1">
              <span className="text-zinc-500 uppercase text-[10px]">TRANSACTION SECURITY</span>
              <div className="text-sm font-bold text-white print-text-dark">Contract &amp; Asset Handover</div>
              <span className="text-[10px] text-zinc-400">Official bill of sale &amp; IP transfer</span>
            </div>
          </div>
        </div>

        {/* FOOTER NOTICE */}
        <div className="text-center text-[11px] font-mono text-zinc-500 pt-4 border-t border-white/5">
          <span>CONFIDENTIAL PITCH DECK • PROPRIETARY ASSET OF {DEVELOPER_NAME.toUpperCase()} • ALL RIGHTS RESERVED</span>
        </div>

      </div>
    </div>
  );
}
