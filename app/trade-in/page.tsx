"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  Check,
  Building2,
  Truck,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Copy,
  ExternalLink,
  Smartphone,
  Cpu,
  Info,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { insertTradeInToDB } from "@/lib/supabase/client";
import { PHONES, Phone } from "@/lib/data/phones";
import { useSettings } from "@/lib/store/settings-context";

// ==========================================================
// DATA: SOURCE DEVICE CATALOG & VALUATION BASELINES
// ==========================================================

interface DeviceModel {
  brand: "Apple" | "Samsung" | "Google" | "Xiaomi" | "Tecno";
  name: string;
  baseValuation: number; // For standard 128GB/256GB in Flawless condition
  storageOptions: string[];
}

const TRADE_SOURCE_MODELS: DeviceModel[] = [
  // --- APPLE IPHONES ---
  { brand: "Apple", name: "iPhone 16 Pro Max", baseValuation: 720000, storageOptions: ["256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 16 Pro", baseValuation: 610000, storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 16", baseValuation: 480000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 15 Pro Max", baseValuation: 550000, storageOptions: ["256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 15 Pro", baseValuation: 460000, storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 15 Plus", baseValuation: 390000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 15", baseValuation: 350000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 14 Pro Max", baseValuation: 420000, storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 14 Pro", baseValuation: 360000, storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 14 Plus", baseValuation: 300000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 14", baseValuation: 270000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 13 Pro Max", baseValuation: 330000, storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 13 Pro", baseValuation: 280000, storageOptions: ["128GB", "256GB", "512GB", "1TB"] },
  { brand: "Apple", name: "iPhone 13", baseValuation: 220000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 12 Pro Max", baseValuation: 230000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 12 Pro", baseValuation: 190000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 12", baseValuation: 155000, storageOptions: ["64GB", "128GB", "256GB"] },
  { brand: "Apple", name: "iPhone 11 Pro Max", baseValuation: 160000, storageOptions: ["64GB", "256GB", "512GB"] },
  { brand: "Apple", name: "iPhone 11", baseValuation: 120000, storageOptions: ["64GB", "128GB", "256GB"] },

  // --- SAMSUNG GALAXY ---
  { brand: "Samsung", name: "Galaxy S24 Ultra", baseValuation: 580000, storageOptions: ["256GB", "512GB", "1TB"] },
  { brand: "Samsung", name: "Galaxy S24+", baseValuation: 440000, storageOptions: ["256GB", "512GB"] },
  { brand: "Samsung", name: "Galaxy S24", baseValuation: 360000, storageOptions: ["128GB", "256GB"] },
  { brand: "Samsung", name: "Galaxy Z Fold 6", baseValuation: 690000, storageOptions: ["256GB", "512GB", "1TB"] },
  { brand: "Samsung", name: "Galaxy Z Flip 6", baseValuation: 410000, storageOptions: ["256GB", "512GB"] },
  { brand: "Samsung", name: "Galaxy S23 Ultra", baseValuation: 420000, storageOptions: ["256GB", "512GB", "1TB"] },
  { brand: "Samsung", name: "Galaxy S23+", baseValuation: 310000, storageOptions: ["256GB", "512GB"] },
  { brand: "Samsung", name: "Galaxy S23", baseValuation: 260000, storageOptions: ["128GB", "256GB"] },
  { brand: "Samsung", name: "Galaxy Z Fold 5", baseValuation: 510000, storageOptions: ["256GB", "512GB"] },
  { brand: "Samsung", name: "Galaxy Z Flip 5", baseValuation: 300000, storageOptions: ["256GB", "512GB"] },
  { brand: "Samsung", name: "Galaxy S22 Ultra", baseValuation: 300000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Samsung", name: "Galaxy S22+", baseValuation: 220000, storageOptions: ["128GB", "256GB"] },
  { brand: "Samsung", name: "Galaxy S22", baseValuation: 180000, storageOptions: ["128GB", "256GB"] },
  { brand: "Samsung", name: "Galaxy A55 5G", baseValuation: 160000, storageOptions: ["128GB", "256GB"] },
  { brand: "Samsung", name: "Galaxy A54 5G", baseValuation: 130000, storageOptions: ["128GB", "256GB"] },

  // --- GOOGLE PIXEL ---
  { brand: "Google", name: "Pixel 9 Pro XL", baseValuation: 560000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Google", name: "Pixel 9 Pro", baseValuation: 480000, storageOptions: ["128GB", "256GB"] },
  { brand: "Google", name: "Pixel 8 Pro", baseValuation: 330000, storageOptions: ["128GB", "256GB", "512GB"] },
  { brand: "Google", name: "Pixel 8", baseValuation: 240000, storageOptions: ["128GB", "256GB"] },
  { brand: "Google", name: "Pixel 7 Pro", baseValuation: 210000, storageOptions: ["128GB", "256GB"] },

  // --- XIAOMI ---
  { brand: "Xiaomi", name: "Xiaomi 14 Ultra", baseValuation: 520000, storageOptions: ["512GB", "1TB"] },
  { brand: "Xiaomi", name: "Xiaomi 13 Ultra", baseValuation: 380000, storageOptions: ["256GB", "512GB"] },
  { brand: "Xiaomi", name: "Xiaomi 13T Pro", baseValuation: 220000, storageOptions: ["256GB", "512GB"] },

  // --- TECNO ---
  { brand: "Tecno", name: "Phantom V Fold 2", baseValuation: 420000, storageOptions: ["512GB"] },
  { brand: "Tecno", name: "Phantom V Fold", baseValuation: 300000, storageOptions: ["512GB"] },
  { brand: "Tecno", name: "Camon 30 Premier", baseValuation: 180000, storageOptions: ["512GB"] },
];

const PHYSICAL_CONDITIONS = [
  {
    id: "flawless",
    title: "Like New (Flawless)",
    desc: "No scratches at all, original parts, battery health 85% or above",
    factor: 1.0,
  },
  {
    id: "excellent",
    title: "Very Good Condition",
    desc: "Only tiny faint marks from normal pocket use, clean screen, battery 80% or above",
    factor: 0.88,
  },
  {
    id: "good",
    title: "Good (Used)",
    desc: "Visible scratches on body or edges, but screen and cameras work 100% normally",
    factor: 0.74,
  },
  {
    id: "damaged",
    title: "Cracked Screen or Back Glass",
    desc: "Screen or back glass is cracked, but the phone turns on and works",
    factor: 0.50,
  },
];

// Storage tier multipliers
const STORAGE_MULTIPLIERS: Record<string, number> = {
  "64GB": 0.92,
  "128GB": 1.0,
  "256GB": 1.08,
  "512GB": 1.18,
  "1TB": 1.30,
};

function TradeInContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";

  // Fast Swap Mode: 'iphone-to-samsung' | 'samsung-to-iphone' | 'custom'
  const [swapMode, setSwapMode] = useState<"iphone-to-samsung" | "samsung-to-iphone" | "custom">("iphone-to-samsung");

  // Source Device State (The phone user is trading in)
  const [sourceBrand, setSourceBrand] = useState<"Apple" | "Samsung" | "Google" | "Xiaomi" | "Tecno">("Apple");
  const [sourceModel, setSourceModel] = useState<string>("iPhone 14 Pro Max");
  const [sourceStorage, setSourceStorage] = useState<string>("256GB");
  const [selectedCondition, setSelectedCondition] = useState<string>("flawless");

  // Hardware Diagnostic Checklist
  const [displayFunctional, setDisplayFunctional] = useState(true);
  const [biometricsFunctional, setBiometricsFunctional] = useState(true);
  const [camerasFunctional, setCamerasFunctional] = useState(true);
  const [hasOriginalBox, setHasOriginalBox] = useState(true);

  // Target Flagship Upgrade State (The phone user wants to acquire)
  const [targetSlug, setTargetSlug] = useState<string>("samsung-galaxy-s24-ultra");

  // User Proposed Worth of their device
  const [proposedWorth, setProposedWorth] = useState<string>("420000");
  const [isProposedCustom, setIsProposedCustom] = useState<boolean>(false);

  // Client Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [inspectionProtocol, setInspectionProtocol] = useState<"douala_lounge" | "yaounde_lounge" | "doorstep_vip">("douala_lounge");
  const [submitted, setSubmitted] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState("");
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Handle URL query parameter pre-selection (e.g. /trade-in?target=iphone-16-pro-max)
  useEffect(() => {
    const targetParam = searchParams?.get("target");
    if (targetParam) {
      const found = PHONES.find((p) => p.slug === targetParam);
      if (found) {
        setTargetSlug(found.slug);
        if (found.brand === "Apple") {
          setSwapMode("samsung-to-iphone");
          setSourceBrand("Samsung");
          setSourceModel("Galaxy S23 Ultra");
        } else if (found.brand === "Samsung") {
          setSwapMode("iphone-to-samsung");
          setSourceBrand("Apple");
          setSourceModel("iPhone 14 Pro Max");
        } else {
          setSwapMode("custom");
        }
      }
    }
  }, [searchParams]);

  // Handle Fast Swap Switcher clicks
  const handleSetSwapMode = (mode: "iphone-to-samsung" | "samsung-to-iphone" | "custom") => {
    setSwapMode(mode);
    if (mode === "iphone-to-samsung") {
      setSourceBrand("Apple");
      setSourceModel("iPhone 14 Pro Max");
      setSourceStorage("256GB");
      setTargetSlug("samsung-galaxy-s24-ultra");
    } else if (mode === "samsung-to-iphone") {
      setSourceBrand("Samsung");
      setSourceModel("Galaxy S23 Ultra");
      setSourceStorage("256GB");
      setTargetSlug("iphone-16-pro-max");
    }
  };

  // Available source models for selected brand
  const availableSourceModels = useMemo(() => {
    return TRADE_SOURCE_MODELS.filter((m) => m.brand === sourceBrand);
  }, [sourceBrand]);

  // Current selected source model spec
  const currentModelData = useMemo(() => {
    return (
      availableSourceModels.find((m) => m.name === sourceModel) ||
      availableSourceModels[0] ||
      TRADE_SOURCE_MODELS[0]
    );
  }, [availableSourceModels, sourceModel]);

  // Current condition object
  const currentCondition = useMemo(() => {
    return PHYSICAL_CONDITIONS.find((c) => c.id === selectedCondition) || PHYSICAL_CONDITIONS[0];
  }, [selectedCondition]);

  // Automated Trade-in Credit Calculation
  const algorithmicValuation = useMemo(() => {
    const base = currentModelData.baseValuation;
    const condFactor = currentCondition.factor;
    const storageFactor = STORAGE_MULTIPLIERS[sourceStorage] || 1.0;

    let total = base * condFactor * storageFactor;

    // Deductions for hardware flaws
    if (!displayFunctional) total *= 0.70;
    if (!biometricsFunctional) total *= 0.85;
    if (!camerasFunctional) total *= 0.85;

    // Bonus for original box & accessories
    if (hasOriginalBox) total += 10000;

    // Round to nearest 5,000 FCFA
    return Math.max(30000, Math.round(total / 5000) * 5000);
  }, [
    currentModelData,
    currentCondition,
    sourceStorage,
    displayFunctional,
    biometricsFunctional,
    camerasFunctional,
    hasOriginalBox,
  ]);

  // Auto-sync proposed worth if user hasn't manually entered a custom figure
  useEffect(() => {
    if (!isProposedCustom) {
      setProposedWorth(algorithmicValuation.toString());
    }
  }, [algorithmicValuation, isProposedCustom]);

  // Parsed user proposed worth
  const parsedProposedWorth = useMemo(() => {
    const num = parseInt(proposedWorth.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? algorithmicValuation : num;
  }, [proposedWorth, algorithmicValuation]);

  // Delta between Client Proposed Valuation and AURA Algorithmic Valuation
  const valuationDelta = useMemo(() => {
    return parsedProposedWorth - algorithmicValuation;
  }, [parsedProposedWorth, algorithmicValuation]);

  const valuationDeltaPercent = useMemo(() => {
    if (algorithmicValuation === 0) return 0;
    return Math.round((valuationDelta / algorithmicValuation) * 100);
  }, [valuationDelta, algorithmicValuation]);

  // Selected Target Flagship from catalog
  const targetFlagship: Phone = useMemo(() => {
    const found = PHONES.find((p) => p.slug === targetSlug);
    return found || PHONES[0];
  }, [targetSlug]);

  // Target Flagship Retail Price
  const targetRetailPrice = targetFlagship.basePrice;

  // Net Upgrade Balances Payable
  const algorithmicNetBalance = Math.max(0, targetRetailPrice - algorithmicValuation);
  const clientProposedNetBalance = Math.max(0, targetRetailPrice - parsedProposedWorth);

  // Form submission & voucher reservation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const voucher = `SWAP-${sourceBrand.substring(0, 3).toUpperCase()}-${targetFlagship.brand.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedVoucher(voucher);
    setSubmitted(true);

    const notesSummary = `SWAP: ${sourceBrand} ${sourceModel} (${sourceStorage}, ${currentCondition.title}) → New: ${targetFlagship.name} (${formatCFA(targetRetailPrice)}) | Our Estimate: ${formatCFA(algorithmicValuation)} | Customer Proposed: ${formatCFA(parsedProposedWorth)} (Diff: ${valuationDelta >= 0 ? "+" : ""}${formatCFA(valuationDelta)}) | Balance Due: ${formatCFA(clientProposedNetBalance)} | Store: ${inspectionProtocol.replace("_", " ").toUpperCase()}`;

    try {
      await insertTradeInToDB({
        id: `TRD-${Math.floor(1000 + Math.random() * 9000)}`,
        client_name: customerName,
        phone: customerPhone,
        city: inspectionProtocol.includes("yaounde") ? "Yaoundé" : "Douala",
        brand: sourceBrand,
        model: `${sourceModel} (${sourceStorage})`,
        storage: sourceStorage,
        condition: currentCondition.title,
        valuation_fcfa: algorithmicValuation,
        voucher_code: voucher,
        status: "pending",
        notes: notesSummary,
      });
    } catch {
      // Graceful fallback
    }
  };

  // 1-Click WhatsApp Direct Dispatch
  const handleWhatsAppDispatch = () => {
    const message = `*AURA LUXE MOBILE — PHONE SWAP DETAILS*
Voucher Code: *${generatedVoucher}*
Customer Name: *${customerName}*
Phone: *${customerPhone}*

*MY CURRENT PHONE (TRADING IN):*
• Phone: ${sourceBrand} ${sourceModel} (${sourceStorage})
• Condition: ${currentCondition.title}
• Estimated Value: ${formatCFA(algorithmicValuation)}
• My Proposed Price: ${formatCFA(parsedProposedWorth)}

*NEW PHONE I WANT:*
• Model: ${targetFlagship.name}
• Retail Price: ${formatCFA(targetRetailPrice)}
• Amount I Pay to Swap: ${formatCFA(clientProposedNetBalance)}

*WHERE I WANT TO SWAP:*
• Location: ${inspectionProtocol.replace("_", " ").toUpperCase()}

Hello AURA, I just completed my phone swap request online. Please confirm stock and when I can come.`;

    const url = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleCopyVoucher = () => {
    if (navigator.clipboard && generatedVoucher) {
      navigator.clipboard.writeText(generatedVoucher);
      setCopiedVoucher(true);
      setTimeout(() => setCopiedVoucher(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090D] text-zinc-100 py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* 1. Hero Header */}
        <div className="border border-white/10 bg-[#0E0E12] p-6 sm:p-8 relative">
          {/* Viewfinder corner crosshairs */}
          <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                  [ PHONE SWAP &amp; TRADE-IN ]
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                Swap Your Old Phone For A New One.
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                Trade in your current iPhone or Samsung and use its value toward any brand new phone in our store. Tell us what you think your phone is worth, see your price difference right away, and reserve your swap with our Douala or Yaoundé store.
              </p>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 font-mono text-[10px]">
              <div className="p-2.5 bg-black border border-white/10 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-zinc-300">FREE SECURE DATA WIPE &amp; RESET</span>
              </div>
              <div className="p-2.5 bg-black border border-white/10 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#25D366]" />
                <span className="text-zinc-300">DOUALA &amp; YAOUNDÉ STORES</span>
              </div>
            </div>
          </div>

          {/* 2. Fast Swap Mode Switcher */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Choose Swap Type:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSetSwapMode("iphone-to-samsung")}
                  className={`px-4 py-2.5 rounded-none border text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    swapMode === "iphone-to-samsung"
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-black border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>[ ⇄ SWAP IPHONE FOR SAMSUNG ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetSwapMode("samsung-to-iphone")}
                  className={`px-4 py-2.5 rounded-none border text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    swapMode === "samsung-to-iphone"
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-black border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>[ ⇄ SWAP SAMSUNG FOR IPHONE ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetSwapMode("custom")}
                  className={`px-4 py-2.5 rounded-none border text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    swapMode === "custom"
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "bg-black border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>[ ⇄ SWAP ANY OTHER PHONE ]</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The 2-Column Trade-in Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================== */}
          {/* LEFT 7 COLS: THE EASY SWAP FORM */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 space-y-8">

            {/* STEP 1: CURRENT PHONE */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  1. The Phone You Want to Swap (Your Current Phone)
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  Brand: {sourceBrand}
                </span>
              </div>

              {/* Brand Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Select Phone Brand:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(["Apple", "Samsung", "Google", "Xiaomi", "Tecno"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setSourceBrand(b);
                        const first = TRADE_SOURCE_MODELS.find((m) => m.brand === b);
                        if (first) {
                          setSourceModel(first.name);
                          setSourceStorage(first.storageOptions[0] || "128GB");
                        }
                      }}
                      className={`py-2 px-1 text-center rounded-none border text-xs font-mono font-bold uppercase transition-all ${
                        sourceBrand === b
                          ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                          : "bg-black border-white/10 text-zinc-300 hover:text-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model & Storage Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Select Phone Model:
                  </label>
                  <select
                    value={sourceModel}
                    onChange={(e) => {
                      const newModel = e.target.value;
                      setSourceModel(newModel);
                      const found = availableSourceModels.find((m) => m.name === newModel);
                      if (found && !found.storageOptions.includes(sourceStorage)) {
                        setSourceStorage(found.storageOptions[0] || "128GB");
                      }
                    }}
                    className="w-full p-3 rounded-none bg-black border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  >
                    {availableSourceModels.map((m) => (
                      <option key={m.name} value={m.name} className="bg-black text-white">
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Storage Size:
                  </label>
                  <select
                    value={sourceStorage}
                    onChange={(e) => setSourceStorage(e.target.value)}
                    className="w-full p-3 rounded-none bg-black border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  >
                    {currentModelData.storageOptions.map((s) => (
                      <option key={s} value={s} className="bg-black text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 2: NEW PHONE YOU WANT */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  2. The New Phone You Want to Buy
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  100% BRAND NEW IN BOX
                </span>
              </div>

              {/* Target Phone Picker */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Choose the new phone you want:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[310px] overflow-y-auto pr-1 no-scrollbar">
                  {PHONES.map((phone) => {
                    const isSelected = phone.slug === targetSlug;
                    return (
                      <button
                        key={phone.id}
                        type="button"
                        onClick={() => setTargetSlug(phone.slug)}
                        className={`p-3 rounded-none border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? "bg-black border-[#D4AF37] shadow-lg shadow-amber-500/10 ring-1 ring-[#D4AF37]"
                            : "bg-black/60 border-white/10 hover:border-white/25"
                        }`}
                      >
                        <img
                          src={phone.images[0]}
                          alt={phone.name}
                          className="w-12 h-12 object-cover rounded-none bg-black shrink-0 border border-white/10"
                        />
                        <div className="flex-1 min-w-0 font-mono">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-zinc-400 uppercase">{phone.brand}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">{phone.name}</h4>
                          <p className="text-[11px] font-bold text-[#D4AF37] mt-0.5">
                            {formatCFA(phone.basePrice)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 3: PHONE CONDITION */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  3. Condition of Your Current Phone
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  HONEST ASSESSMENT
                </span>
              </div>

              {/* Physical Grade Selection */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  How does the phone look physically?
                </label>
                <div className="space-y-2">
                  {PHYSICAL_CONDITIONS.map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setSelectedCondition(cond.id)}
                      className={`w-full p-3.5 rounded-none border text-left flex items-start justify-between transition-all ${
                        selectedCondition === cond.id
                          ? "bg-black border-[#D4AF37] ring-1 ring-[#D4AF37]"
                          : "bg-black/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono uppercase">
                            {cond.title}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                            {Math.round(cond.factor * 100)}% VALUE
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-sans leading-snug">
                          {cond.desc}
                        </p>
                      </div>

                      {selectedCondition === cond.id && (
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 ml-2 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Functional Diagnostic Checklist */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Quick Feature Check:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={displayFunctional}
                      onChange={(e) => setDisplayFunctional(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-zinc-200 text-[11px]">Screen and touch work perfectly</span>
                  </label>

                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={biometricsFunctional}
                      onChange={(e) => setBiometricsFunctional(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-zinc-200 text-[11px]">Face ID or Fingerprint works</span>
                  </label>

                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={camerasFunctional}
                      onChange={(e) => setCamerasFunctional(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-zinc-200 text-[11px]">All cameras take clear photos</span>
                  </label>

                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasOriginalBox}
                      onChange={(e) => setHasOriginalBox(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-[#D4AF37] text-[11px]">Original box included (+10,000 F bonus)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* STEP 4: PROPOSED WORTH & PRICE COMPARISON */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  4. What You Think Your Phone Is Worth
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  FAIR PRICING
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black border border-white/10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-mono uppercase font-bold text-white block">
                      How much do you think your phone is worth? (FCFA):
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Our Estimated Price: {formatCFA(algorithmicValuation)}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={proposedWorth}
                      onChange={(e) => {
                        setIsProposedCustom(true);
                        setProposedWorth(e.target.value);
                      }}
                      placeholder={algorithmicValuation.toString()}
                      className="w-full p-3.5 bg-zinc-950 border border-white/20 rounded-none text-white font-mono font-black text-lg focus:outline-none focus:border-[#D4AF37] tracking-wider"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#D4AF37] font-bold">
                      FCFA
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Enter your desired price so our store team can review it with you.
                    </span>
                    {isProposedCustom && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProposedCustom(false);
                          setProposedWorth(algorithmicValuation.toString());
                        }}
                        className="text-[10px] text-[#D4AF37] hover:underline font-mono uppercase"
                      >
                        [ Reset to our estimated price ]
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Comparison Card */}
                <div className="p-4 rounded-none bg-black border border-white/15 space-y-3 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 pb-2 border-b border-white/10 flex items-center justify-between">
                    <span>PRICE COMPARISON</span>
                    <span>DIFFERENCE: {valuationDelta >= 0 ? `+${formatCFA(valuationDelta)}` : formatCFA(valuationDelta)} ({valuationDeltaPercent}%)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-zinc-950 border border-white/10">
                      <span className="text-[9px] text-zinc-500 uppercase block">Our Estimated Price:</span>
                      <span className="text-sm font-black text-white block mt-0.5">{formatCFA(algorithmicValuation)}</span>
                    </div>

                    <div className="p-2.5 bg-zinc-950 border border-white/10">
                      <span className="text-[9px] text-[#D4AF37] uppercase block">Your Proposed Price:</span>
                      <span className="text-sm font-black text-[#D4AF37] block mt-0.5">{formatCFA(parsedProposedWorth)}</span>
                    </div>
                  </div>

                  {/* Dynamic Status Indicator */}
                  {valuationDelta <= 0 ? (
                    <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-2 font-sans">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span><strong>Great Match:</strong> Your proposed price matches or is lower than our estimate. You can complete your swap right away!</span>
                    </div>
                  ) : valuationDeltaPercent <= 15 ? (
                    <div className="p-2.5 bg-amber-950/30 border border-amber-500/40 text-amber-200 text-[11px] flex items-center gap-2 font-sans">
                      <Info className="w-4 h-4 shrink-0 text-amber-400" />
                      <span><strong>Close Offer:</strong> Your price is very close to our estimate (+{valuationDeltaPercent}%). Bring your phone to our store and we will inspect it to give you the top price.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2 font-sans">
                      <Info className="w-4 h-4 shrink-0 text-rose-400" />
                      <span><strong>Higher Than Usual:</strong> Your proposed price is higher than our estimate (+{valuationDeltaPercent}%). Our technicians will carefully inspect it in store to see if we can accommodate your offer.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================== */}
          {/* RIGHT 5 COLS: SUMMARY & CONFIRMATION */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            <div className="bg-[#0E0E12] border border-[#D4AF37]/50 p-6 sm:p-7 relative shadow-2xl font-mono">
              {/* Corner crosshairs */}
              <span className="absolute top-2 left-2 text-[#D4AF37] text-xs select-none">+</span>
              <span className="absolute top-2 right-2 text-[#D4AF37] text-xs select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[#D4AF37] text-xs select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[#D4AF37] text-xs select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Swap Summary &amp; Estimate
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 uppercase">
                  PRICE VALID FOR 7 DAYS
                </span>
              </div>

              {/* Hardware Summary */}
              <div className="mt-4 space-y-3 text-xs">
                {/* Source device */}
                <div className="p-3 bg-black border border-white/10 space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase block tracking-wider">YOUR CURRENT PHONE (TRADING IN):</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sourceBrand} {sourceModel}</span>
                    <span className="text-zinc-400">{sourceStorage}</span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] block">{currentCondition.title}</span>
                </div>

                {/* Target flagship */}
                <div className="p-3 bg-black border border-white/10 space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase block tracking-wider">THE NEW PHONE YOU WANT:</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{targetFlagship.name}</span>
                    <span className="text-emerald-400 font-bold">{formatCFA(targetRetailPrice)}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block">{targetFlagship.warranty}</span>
                </div>

                {/* The Exchange Math */}
                <div className="p-4 bg-zinc-950 border border-white/15 space-y-2 font-mono">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>New Phone Price:</span>
                    <span>{formatCFA(targetRetailPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#25D366] text-[11px]">
                    <span>Value for Your Old Phone:</span>
                    <span>- {formatCFA(algorithmicValuation)}</span>
                  </div>
                  {hasOriginalBox && (
                    <div className="flex justify-between text-[#D4AF37] text-[10px]">
                      <span>Original Box Bonus:</span>
                      <span>- 10,000 FCFA</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/15 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-black text-white block uppercase">
                        Total You Pay To Swap:
                      </span>
                      <span className="text-[9px] text-zinc-400 font-sans">
                        Pay only this difference in store or on delivery
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#D4AF37]">
                      {formatCFA(algorithmicNetBalance)}
                    </span>
                  </div>

                  {isProposedCustom && valuationDelta !== 0 && (
                    <div className="pt-1 text-[10px] text-zinc-400 flex justify-between border-t border-white/5">
                      <span>If your proposed price is accepted:</span>
                      <span className="text-white font-bold">{formatCFA(clientProposedNetBalance)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form or Issued State */}
              {submitted ? (
                <div className="mt-5 space-y-4 pt-4 border-t border-white/10 animate-in fade-in duration-300">
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase">
                      Swap Request Confirmed!
                    </h4>
                    <p className="text-xs text-zinc-300 font-sans">
                      Thank you, <strong className="text-white">{customerName}</strong>. We have saved your swap request. Here is your voucher code:
                    </p>
                    
                    <div className="p-2.5 bg-black border border-emerald-500/60 flex items-center justify-between mt-2">
                      <span className="font-mono text-sm font-black text-emerald-400 tracking-wider">
                        {generatedVoucher}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVoucher}
                        className="p-1 text-zinc-400 hover:text-white"
                        title="Copy Code"
                      >
                        {copiedVoucher ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 font-mono">
                    <button
                      type="button"
                      onClick={handleWhatsAppDispatch}
                      className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#25D366] transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>[ SEND DETAILS TO US ON WHATSAPP ]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="w-full py-2.5 px-4 bg-black hover:bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors"
                    >
                      [ SWAP ANOTHER PHONE ]
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-3 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                    Confirm Your Swap &amp; Reserve Phone:
                  </span>

                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full p-3 rounded-none bg-black border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] font-sans"
                  />

                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Phone (+237 6XX XX XX XX)"
                    className="w-full p-3 rounded-none bg-black border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] font-sans"
                  />

                  {/* Inspection Protocol Choice */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Where would you like to do the swap?
                    </label>
                    <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setInspectionProtocol("douala_lounge")}
                        className={`p-2.5 rounded-none border text-left flex items-center justify-between transition-colors ${
                          inspectionProtocol === "douala_lounge"
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <span>Douala Store (Bonapriso)</span>
                        {inspectionProtocol === "douala_lounge" && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectionProtocol("yaounde_lounge")}
                        className={`p-2.5 rounded-none border text-left flex items-center justify-between transition-colors ${
                          inspectionProtocol === "yaounde_lounge"
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <span>Yaoundé Store (Bastos)</span>
                        {inspectionProtocol === "yaounde_lounge" && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectionProtocol("doorstep_vip")}
                        className={`p-2.5 rounded-none border text-left flex items-center justify-between transition-colors ${
                          inspectionProtocol === "doorstep_vip"
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                            : "bg-black border-white/10 text-zinc-400"
                        }`}
                      >
                        <span>Home or Office Delivery (Douala or Yaoundé)</span>
                        {inspectionProtocol === "doorstep_vip" && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all border border-[#D4AF37] shadow-lg shadow-amber-500/10 mt-2"
                  >
                    [ SUBMIT SWAP REQUEST &amp; RESERVE PHONE ]
                  </button>
                </form>
              )}

              {/* Guarantees */}
              <div className="mt-5 pt-3 border-t border-white/10 text-[10px] text-zinc-400 space-y-1.5 font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>We safely erase all your personal data and photos before the swap</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>The value of your old phone is deducted directly from your new phone price</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function TradeInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090D] flex items-center justify-center text-[#D4AF37] font-mono text-xs">
          [ LOADING PHONE SWAP PAGE... ]
        </div>
      }
    >
      <TradeInContent />
    </Suspense>
  );
}
