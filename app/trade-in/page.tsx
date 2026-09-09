"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Building2,
  Truck,
  Sparkles,
  MessageCircle,
  Copy,
  Smartphone,
  ChevronRight,
  Search,
  CheckCheck,
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
  baseValuation: number;
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
    grade: "GRADE A+",
    title: "Like New (Flawless)",
    desc: "No scratches at all, original screen, battery health 85%+",
    factor: 1.0,
  },
  {
    id: "excellent",
    grade: "GRADE A",
    title: "Very Good Condition",
    desc: "Light signs of normal pocket use, clean glass, battery 80%+",
    factor: 0.88,
  },
  {
    id: "good",
    grade: "GRADE B",
    title: "Good (Used)",
    desc: "Visible scratches on body or bezel, screen & camera fully working",
    factor: 0.74,
  },
  {
    id: "damaged",
    grade: "GRADE C",
    title: "Cracked Glass",
    desc: "Screen or back glass has cracks, but phone turns on & functions",
    factor: 0.50,
  },
];

const STORAGE_MULTIPLIERS: Record<string, number> = {
  "64GB": 0.92,
  "128GB": 1.0,
  "256GB": 1.08,
  "512GB": 1.18,
  "1TB": 1.30,
};

const BRANDS = ["Apple", "Samsung", "Google", "Xiaomi", "Tecno"] as const;

function TradeInWizardContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";

  // Wizard Step State (1: Current Phone, 2: Condition, 3: Dream Phone, 4: Deal Summary)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Current Device
  const [sourceBrand, setSourceBrand] = useState<"Apple" | "Samsung" | "Google" | "Xiaomi" | "Tecno">("Apple");
  const [sourceModel, setSourceModel] = useState<string>("iPhone 14 Pro Max");
  const [sourceStorage, setSourceStorage] = useState<string>("256GB");
  const [modelSearch, setModelSearch] = useState<string>("");

  // Step 2: Condition
  const [selectedCondition, setSelectedCondition] = useState<string>("flawless");

  // Step 3: Target Dream Flagship Phone
  const [targetSlug, setTargetSlug] = useState<string>("samsung-galaxy-s24-ultra");
  const [targetBrandFilter, setTargetBrandFilter] = useState<string>("all");

  // Step 4: Contact & Submission
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [inspectionProtocol, setInspectionProtocol] = useState<"buea_showroom" | "doorstep_vip">("buea_showroom");
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
      }
    }
  }, [searchParams]);

  // Available source models for selected brand
  const availableSourceModels = useMemo(() => {
    const models = TRADE_SOURCE_MODELS.filter((m) => m.brand === sourceBrand);
    if (!modelSearch.trim()) return models;
    return models.filter((m) =>
      m.name.toLowerCase().includes(modelSearch.toLowerCase().trim())
    );
  }, [sourceBrand, modelSearch]);

  // When brand changes, auto-select first model
  const handleSelectBrand = (brand: typeof sourceBrand) => {
    setSourceBrand(brand);
    setModelSearch("");
    const models = TRADE_SOURCE_MODELS.filter((m) => m.brand === brand);
    if (models.length > 0) {
      setSourceModel(models[0].name);
      setSourceStorage(models[0].storageOptions[0]);
    }
  };

  // Current selected source model spec
  const currentModelData = useMemo(() => {
    return (
      TRADE_SOURCE_MODELS.find((m) => m.name === sourceModel) ||
      availableSourceModels[0] ||
      TRADE_SOURCE_MODELS[0]
    );
  }, [sourceModel, availableSourceModels]);

  // Current condition object
  const currentCondition = useMemo(() => {
    return PHYSICAL_CONDITIONS.find((c) => c.id === selectedCondition) || PHYSICAL_CONDITIONS[0];
  }, [selectedCondition]);

  // Trade-in Credit Calculation
  const algorithmicValuation = useMemo(() => {
    const base = currentModelData.baseValuation;
    const condFactor = currentCondition.factor;
    const storageFactor = STORAGE_MULTIPLIERS[sourceStorage] || 1.0;
    const total = base * condFactor * storageFactor;
    return Math.max(30000, Math.round(total / 5000) * 5000);
  }, [currentModelData, currentCondition, sourceStorage]);

  // Selected Target Flagship from catalog
  const targetFlagship: Phone = useMemo(() => {
    const found = PHONES.find((p) => p.slug === targetSlug);
    return found || PHONES[0];
  }, [targetSlug]);

  const targetRetailPrice = targetFlagship.basePrice;
  const netUpgradeBalance = Math.max(0, targetRetailPrice - algorithmicValuation);

  // Filtered target phones for Step 3
  const targetPhonesList = useMemo(() => {
    if (targetBrandFilter === "all") return PHONES;
    return PHONES.filter(
      (p) => p.brand.toLowerCase() === targetBrandFilter.toLowerCase()
    );
  }, [targetBrandFilter]);

  // Form submission & voucher reservation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const voucher = `SWAP-${sourceBrand.substring(0, 3).toUpperCase()}-${targetFlagship.brand.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedVoucher(voucher);
    setSubmitted(true);

    const notesSummary = `SWAP: ${sourceBrand} ${sourceModel} (${sourceStorage}, ${currentCondition.title}) → New: ${targetFlagship.name} (${formatCFA(targetRetailPrice)}) | Trade-In Value: ${formatCFA(algorithmicValuation)} | Net Balance Due: ${formatCFA(netUpgradeBalance)} | Store: ${inspectionProtocol.replace("_", " ").toUpperCase()}`;

    try {
      await insertTradeInToDB({
        id: `TRD-${Math.floor(1000 + Math.random() * 9000)}`,
        client_name: customerName,
        phone: customerPhone,
        city: inspectionProtocol === "buea_showroom" ? "Buea" : "Nationwide",
        brand: sourceBrand,
        model: `${sourceModel} (${sourceStorage})`,
        storage: sourceStorage,
        condition: currentCondition.title,
        valuation_fcfa: algorithmicValuation,
        voucher_code: voucher,
        status: "pending",
        notes: notesSummary,
      });

      fetch("/api/email/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: customerName,
          clientPhone: customerPhone,
          city: inspectionProtocol === "buea_showroom" ? "Buea" : "Nationwide",
          brand: sourceBrand,
          model: sourceModel,
          storage: sourceStorage,
          condition: currentCondition.title,
          valuationFcfa: algorithmicValuation,
          voucherCode: voucher,
        }),
      }).catch((err) => {
        console.warn("Background swap email trigger warning:", err);
      });
    } catch {
      // Graceful fallback
    }
  };

  // 1-Click WhatsApp Direct Dispatch
  const handleWhatsAppDispatch = () => {
    const voucherText = generatedVoucher ? `\nVoucher Code: *${generatedVoucher}*` : "";
    const message = `*AURA LUXE MOBILE — PHONE SWAP INQUIRY*${voucherText}
Customer Name: *${customerName || "Interested Client"}*
Phone: *${customerPhone || "Via WhatsApp"}*

*1. MY OLD PHONE (TRADING IN):*
• Model: ${sourceBrand} ${sourceModel} (${sourceStorage})
• Condition: ${currentCondition.title}
• Estimated Trade-In Value: *${formatCFA(algorithmicValuation)}*

*2. NEW PHONE I WANT:*
• Model: ${targetFlagship.name}
• Store Price: ${formatCFA(targetRetailPrice)}

*3. ESTIMATED BALANCE I PAY:*
*${formatCFA(netUpgradeBalance)}*

*SWAP LOCATION:*
• ${inspectionProtocol === "buea_showroom" ? "AURA Showroom — Molyko Check Point, Buea" : "Courier / Nationwide Delivery"}

Hello AURA, I want to confirm stock and complete this phone swap.`;

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

  // Steps definition for top progress indicator
  const WIZARD_STEPS = [
    { num: 1, title: "Your Phone" },
    { num: 2, title: "Condition" },
    { num: 3, title: "Dream Phone" },
    { num: 4, title: "Swap Deal" },
  ];

  return (
    <div className="min-h-screen bg-[#09090D] text-zinc-100 py-8 sm:py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Header Banner (Straight Architectural Edges) */}
        <div className="border border-white/10 bg-[#0E0E12] p-6 sm:p-8 relative rounded-none">
          {/* Viewfinder corner crosshairs */}
          <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase rounded-none">
              <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
              <span>Instant Phone Swap &amp; Trade-In</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Upgrade Your Phone in 4 Simple Steps
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Trade in your old phone and use its cash value towards any new flagship phone.
            </p>
          </div>
        </div>

        {/* 2. Top Step-by-Step Progress Bar (Straight Edges) */}
        <div className="bg-[#0E0E12] border border-white/10 p-3 sm:p-4 rounded-none shadow-2xl">
          <div className="grid grid-cols-4 gap-2">
            {WIZARD_STEPS.map((s) => {
              const isActive = step === s.num;
              const isPassed = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num as any);
                  }}
                  disabled={s.num > step}
                  className={`flex items-center gap-2 p-2 sm:p-2.5 border text-left transition-all rounded-none ${
                    isActive
                      ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                      : isPassed
                      ? "bg-white/5 border-emerald-500/30 text-emerald-400 cursor-pointer"
                      : "bg-transparent border-white/5 text-zinc-600 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold font-mono shrink-0 rounded-none ${
                      isActive
                        ? "bg-[#D4AF37] text-black"
                        : isPassed
                        ? "bg-emerald-500 text-black"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <span className="text-[11px] font-bold block truncate font-mono uppercase tracking-wider">
                      {s.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. WIZARD STEP CONTAINER (Straight Edges with Crosshairs) */}
        <div className="bg-[#0E0E12] border border-white/10 p-5 sm:p-8 rounded-none shadow-2xl relative min-h-[420px]">
          {/* Crosshairs */}
          <span className="absolute top-2 left-2 text-zinc-700 font-mono text-[10px] select-none pointer-events-none">+</span>
          <span className="absolute top-2 right-2 text-zinc-700 font-mono text-[10px] select-none pointer-events-none">+</span>
          <span className="absolute bottom-2 left-2 text-zinc-700 font-mono text-[10px] select-none pointer-events-none">+</span>
          <span className="absolute bottom-2 right-2 text-zinc-700 font-mono text-[10px] select-none pointer-events-none">+</span>

          {/* ========================================================== */}
          {/* STEP 1: CURRENT DEVICE DETAILS                             */}
          {/* ========================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                  STEP 1 OF 4 • YOUR CURRENT PHONE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase mt-1">
                  What phone do you currently have?
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Select your brand, model, and storage capacity to see its trade-in baseline.
                </p>
              </div>

              {/* Brand Selector Chips (Straight Edges) */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider block">
                  1. Select Brand:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleSelectBrand(b)}
                      className={`p-3 border text-center transition-all cursor-pointer font-mono font-bold text-xs uppercase tracking-wider rounded-none ${
                        sourceBrand === b
                          ? "gold-gradient-bg text-black border-[#D4AF37]"
                          : "bg-[#141419] border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selector with Quick Search Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider block">
                    2. Select Model ({availableSourceModels.length} models):
                  </label>
                  {availableSourceModels.length > 8 && (
                    <div className="relative w-40 sm:w-52">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder="Search model..."
                        className="w-full bg-black border border-white/15 pl-8 pr-2.5 py-1 text-xs text-white rounded-none focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {availableSourceModels.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSourceModel(m.name);
                        setSourceStorage(m.storageOptions[0]);
                      }}
                      className={`p-3 border text-left transition-all cursor-pointer rounded-none ${
                        sourceModel === m.name
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                          : "bg-[#141419] border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold block truncate font-mono">{m.name}</span>
                        {sourceModel === m.name && (
                          <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 block font-mono mt-1">
                        Est. up to {formatCFA(m.baseValuation)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Capacity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider block">
                  3. Storage Capacity:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentModelData.storageOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSourceStorage(st)}
                      className={`px-4 py-2 border text-xs font-mono font-bold transition-all cursor-pointer rounded-none ${
                        sourceStorage === st
                          ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                          : "bg-[#141419] border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preliminary Estimate Card (Straight Edges) */}
              <div className="p-4 bg-black border border-[#D4AF37]/30 rounded-none flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    Preliminary Value for {sourceBrand} {sourceModel} ({sourceStorage})
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#D4AF37] font-mono">
                    {formatCFA(algorithmicValuation)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 gold-gradient-bg text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 rounded-none hover:opacity-95 cursor-pointer shadow-lg transition-all"
                >
                  <span>Next: Condition</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* STEP 2: PHYSICAL CONDITION                                 */}
          {/* ========================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                  STEP 2 OF 4 • PHONE CONDITION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase mt-1">
                  What condition is your {sourceModel} in?
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Choose the option that most accurately describes your phone&apos;s physical and functional state.
                </p>
              </div>

              {/* Condition Cards Grid (Straight Edges) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PHYSICAL_CONDITIONS.map((cond) => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setSelectedCondition(cond.id)}
                    className={`p-4 border text-left transition-all cursor-pointer rounded-none relative ${
                      selectedCondition === cond.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                        : "bg-[#141419] border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-white/10 text-[#D4AF37] text-[10px] font-mono font-bold">{cond.grade}</span>
                        <span className="text-xs font-black uppercase text-white font-mono">{cond.title}</span>
                      </div>
                      {selectedCondition === cond.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {cond.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Navigation Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-white/5 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition rounded-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-zinc-500 block font-mono uppercase">Appraised Trade-In Value</span>
                    <span className="text-sm font-bold text-[#D4AF37] font-mono">{formatCFA(algorithmicValuation)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-3 gold-gradient-bg text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 rounded-none hover:opacity-95 cursor-pointer shadow-lg transition-all"
                  >
                    <span>Next: Dream Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* STEP 3: SELECT TARGET UPGRADE PHONE                        */}
          {/* ========================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                  STEP 3 OF 4 • TARGET UPGRADE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase mt-1">
                  Which new phone do you want to get?
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Pick any genuine flagship from AURA&apos;s boutique catalog.
                </p>
              </div>

              {/* Target Brand Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {["all", "Apple", "Samsung", "Google", "Xiaomi", "Tecno"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setTargetBrandFilter(b)}
                    className={`px-3 py-1.5 border text-xs font-mono font-bold transition-all shrink-0 cursor-pointer rounded-none ${
                      targetBrandFilter === b
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                        : "bg-[#141419] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {b === "all" ? "ALL FLAGSHIPS" : b.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Target Phone Cards (Straight Edges) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {targetPhonesList.map((p) => {
                  const isSelected = targetSlug === p.slug;
                  const delta = Math.max(0, p.basePrice - algorithmicValuation);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTargetSlug(p.slug)}
                      className={`p-3 border text-left transition-all cursor-pointer rounded-none relative flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white ring-1 ring-[#D4AF37]"
                          : "bg-[#141419] border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <div className="relative aspect-square w-full bg-black border border-white/5 p-2 mb-2 flex items-center justify-center overflow-hidden rounded-none">
                        <Image
                          src={p.images[0] || "/placeholder.png"}
                          alt={p.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold block">
                          {p.brand}
                        </span>
                        <span className="text-xs font-bold text-white block truncate uppercase">
                          {p.name}
                        </span>
                        <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-baseline justify-between">
                          <span className="text-[10px] text-zinc-400 font-mono">Top-up:</span>
                          <span className="text-xs font-bold text-[#D4AF37] font-mono">
                            {formatCFA(delta)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-white/5 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition rounded-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-3 gold-gradient-bg text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 rounded-none hover:opacity-95 cursor-pointer shadow-lg transition-all"
                >
                  <span>Next: View Final Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* STEP 4: FINAL SWAP DEAL & 1-TAP CLAIM                      */}
          {/* ========================================================== */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-widest block">
                  STEP 4 OF 4 • INSTANT DEAL SUMMARY
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase mt-1">
                  Your Phone Swap Breakdown
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Review your trade-in math, generate a voucher, or claim this deal directly on WhatsApp.
                </p>
              </div>

              {/* Hero Math Calculation Box (Straight Architectural Table) */}
              <div className="bg-black border border-[#D4AF37]/30 p-5 rounded-none space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10 font-mono">
                  <div className="pt-2 sm:pt-0">
                    <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                      Your Phone Trade Value
                    </span>
                    <span className="text-xs text-zinc-300 block mt-0.5 truncate font-sans">
                      {sourceBrand} {sourceModel} ({sourceStorage})
                    </span>
                    <span className="text-base sm:text-lg font-bold text-emerald-400 mt-1 block">
                      + {formatCFA(algorithmicValuation)}
                    </span>
                  </div>

                  <div className="pt-3 sm:pt-0 sm:px-3">
                    <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                      Target Phone Price
                    </span>
                    <span className="text-xs text-zinc-300 block mt-0.5 truncate font-sans">
                      {targetFlagship.name}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white mt-1 block">
                      {formatCFA(targetRetailPrice)}
                    </span>
                  </div>

                  <div className="pt-3 sm:pt-0 sm:px-3">
                    <span className="text-[10px] uppercase text-[#D4AF37] block font-bold">
                      You Pay Only (Top-up Balance)
                    </span>
                    <span className="text-xs text-zinc-400 block mt-0.5 font-sans">
                      Net upgrade cash payable
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#D4AF37] mt-1 block">
                      {formatCFA(netUpgradeBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Voucher Success Alert if generated */}
              {submitted && generatedVoucher && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-none space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Trade-in Voucher Reserved Successfully!</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyVoucher}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-none text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {copiedVoucher ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedVoucher ? "COPIED" : "COPY CODE"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">
                    Code: <strong className="text-emerald-400 font-mono">{generatedVoucher}</strong>
                  </p>
                </div>
              )}

              {/* Fast Contact & Claim Form (Straight Edges) */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
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
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
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
                </div>

                {/* Location selector */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 font-bold">
                    Where will you complete the swap?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectionProtocol("buea_showroom")}
                      className={`p-3 border text-left text-xs transition cursor-pointer rounded-none flex items-center gap-2.5 ${
                        inspectionProtocol === "buea_showroom"
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                          : "bg-black border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <div>
                        <span className="font-bold block text-white font-mono uppercase">Buea Showroom</span>
                        <span className="text-[10px] text-zinc-400">Checkpoint Molyko</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInspectionProtocol("doorstep_vip")}
                      className={`p-3 border text-left text-xs transition cursor-pointer rounded-none flex items-center gap-2.5 ${
                        inspectionProtocol === "doorstep_vip"
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                          : "bg-black border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-white font-mono uppercase">Nationwide Courier</span>
                        <span className="text-[10px] text-zinc-400">Douala, Yaoundé &amp; Other towns</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-3 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleWhatsAppDispatch}
                    className="w-full py-4 bg-[#0A1A10] hover:bg-[#0E2617] border border-[#25D366]/50 text-[#25D366] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 rounded-none transition-all cursor-pointer min-h-[48px]"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Claim This Swap Deal on WhatsApp</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-3 bg-white/5 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition rounded-none cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Phones</span>
                    </button>

                    {!submitted && (
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#181820] hover:bg-[#20202c] border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider transition rounded-none cursor-pointer"
                      >
                        Reserve Swap Voucher Code
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* 4. Guarantees Footnote (Straight Edges) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400 font-mono">
          <div className="p-3 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Free Data Transfer &amp; Safe Wipe</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Showroom Testing at Molyko, Buea</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-white/10 rounded-none flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>24h Nationwide Delivery</span>
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
        <div className="min-h-screen bg-[#09090D] flex items-center justify-center text-zinc-400 font-mono text-xs">
          Loading Phone Swap Calculator...
        </div>
      }
    >
      <TradeInWizardContent />
    </Suspense>
  );
}
