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
    title: "Grade A — Flawless / Mint",
    desc: "0 visible scratches, 100% genuine factory parts, battery health ≥ 85%",
    factor: 1.0,
  },
  {
    id: "excellent",
    title: "Grade B — Excellent Condition",
    desc: "Microscopic pocket hairline marks, flawless screen glass, battery ≥ 80%",
    factor: 0.88,
  },
  {
    id: "good",
    title: "Grade C — Moderate Cosmetic Wear",
    desc: "Minor bezel scuffs or casing marks, fully responsive touch and cameras",
    factor: 0.74,
  },
  {
    id: "damaged",
    title: "Grade D — Screen / Back Glass Crack",
    desc: "Cracked outer glass or battery service alert, mainboard operates normally",
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
  const [proposedWorth, setProposedWorth] = useState<string>("");
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

  // Automated Algorithmic Trade-in Credit Calculation
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

    const notesSummary = `SWAP: ${sourceBrand} ${sourceModel} (${sourceStorage}, ${currentCondition.title}) → Target: ${targetFlagship.name} (${formatCFA(targetRetailPrice)}) | Algorithmic Credit: ${formatCFA(algorithmicValuation)} | Client Proposed: ${formatCFA(parsedProposedWorth)} (Delta: ${valuationDelta >= 0 ? "+" : ""}${formatCFA(valuationDelta)}) | Net Balance Due: ${formatCFA(clientProposedNetBalance)} | Protocol: ${inspectionProtocol.replace("_", " ").toUpperCase()}`;

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
    const message = `*AURA LUXE MOBILE — CERTIFIED HARDWARE SWAP MANIFEST*
Voucher Code: *${generatedVoucher}*
Client: *${customerName}*
Phone: *${customerPhone}*

*SOURCE DEVICE (GIVING UP):*
• Device: ${sourceBrand} ${sourceModel}
• Storage: ${sourceStorage}
• Condition: ${currentCondition.title}
• Certified Algorithmic Credit: ${formatCFA(algorithmicValuation)}
• Client Proposed Valuation: ${formatCFA(parsedProposedWorth)}

*TARGET FLAGSHIP (RECEIVING):*
• Upgrade Target: ${targetFlagship.name}
• Retail Value: ${formatCFA(targetRetailPrice)}
• Estimated Balance Due: ${formatCFA(clientProposedNetBalance)}

*INSPECTION PROTOCOL:*
• Location/Method: ${inspectionProtocol.replace("_", " ").toUpperCase()}

Hello AURA Concierge, I have locked my hardware exchange voucher online. Please confirm showroom appointment and stock allocation.`;

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

        {/* 1. Protocol Hero Strip */}
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
                  [ PROTOCOL // CERTIFIED HARDWARE SWAP &amp; RESIDUAL APPRAISAL ]
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                Exchange Hardware. Elevate Your Standard.
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                Trade your current iPhone or Samsung flagship directly for any factory-sealed unit in our vault. State your proposed phone valuation, compute the upgrade delta in real-time, and lock your appraisal voucher with our Douala &amp; Yaoundé showrooms.
              </p>
            </div>

            {/* Fast Telemetry Badges */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 font-mono text-[10px]">
              <div className="p-2.5 bg-black border border-white/10 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-zinc-300">MILITARY DATA WIPE ON PREMISES</span>
              </div>
              <div className="p-2.5 bg-black border border-white/10 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#25D366]" />
                <span className="text-zinc-300">BONAPRISO &amp; BASTOS LOUNGES</span>
              </div>
            </div>
          </div>

          {/* 2. Fast Swap Mode Switcher (Tactile Hardware Keys) */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                [ RAPID SWAP ARCHITECTURE ]:
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
                  <span>[ ⇄ IPHONE TO SAMSUNG ]</span>
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
                  <span>[ ⇄ SAMSUNG TO IPHONE ]</span>
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
                  <span>[ ⇄ CUSTOM SELECTION ]</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The 2-Column Architectural Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================== */}
          {/* LEFT 7 COLS: THE HARDWARE VALUATION & SELECTION ENGINE */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 space-y-8">

            {/* BAY 01: SOURCE DEVICE (What You Are Giving Up) */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  [ BAY 01 // SOURCE DEVICE YOU ARE TRADING IN ]
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  ORIGIN: {sourceBrand.toUpperCase()}
                </span>
              </div>

              {/* Brand Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  1. Current Device Manufacturer:
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
                    2. Specific Model:
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
                    3. Storage Tier:
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

            {/* BAY 02: TARGET FLAGSHIP UPGRADE (What You Want to Receive) */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  [ BAY 02 // TARGET FLAGSHIP UPGRADE YOU WISH TO RECEIVE ]
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  FACTORY-SEALED VAULT UNITS
                </span>
              </div>

              {/* Target Flagship Picker */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Select Desired Upgrade Flagship:
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

            {/* BAY 03: 65-POINT DIAGNOSTIC & PHYSICAL CONDITION MATRIX */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  [ BAY 03 // HARDWARE INTEGRITY &amp; DIAGNOSTIC MATRIX ]
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  STANDARD AURA SPEC
                </span>
              </div>

              {/* Physical Grade Selection */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Select Physical Grade:
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
                            {Math.round(cond.factor * 100)}% VALUATION FACTOR
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
                  Hardware Integrity Confirmation:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={displayFunctional}
                      onChange={(e) => setDisplayFunctional(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-zinc-200 text-[11px]">Display &amp; Touch 100% Intact</span>
                  </label>

                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={biometricsFunctional}
                      onChange={(e) => setBiometricsFunctional(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-zinc-200 text-[11px]">Biometrics / Face ID Active</span>
                  </label>

                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={camerasFunctional}
                      onChange={(e) => setCamerasFunctional(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-zinc-200 text-[11px]">All Camera Lenses Pristine</span>
                  </label>

                  <label className="p-3 bg-black border border-white/10 flex items-center gap-2.5 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasOriginalBox}
                      onChange={(e) => setHasOriginalBox(e.target.checked)}
                      className="rounded-none accent-[#D4AF37] w-4 h-4"
                    />
                    <span className="text-[#D4AF37] text-[11px]">Original Box Included (+10,000 F)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* BAY 04: CLIENT PROPOSED WORTH & VALUATION DELTA ENGINE */}
            <div className="bg-[#0E0E12] border border-white/10 p-6 relative">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/50 select-none">+</span>

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  [ BAY 04 // CLIENT PROPOSED WORTH &amp; VALUATION DELTA ]
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  BIDIRECTIONAL PRICING
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black border border-white/10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-mono uppercase font-bold text-white block">
                      Enter Your Proposed Phone Worth (FCFA):
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      AURA BASELINE: {formatCFA(algorithmicValuation)}
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
                      State your personal valuation for showroom appraisal review.
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
                        [ RESET TO ALGORITHMIC ESTIMATE ]
                      </button>
                    )}
                  </div>
                </div>

                {/* Real-time Valuation Delta Analysis Card */}
                <div className="p-4 rounded-none bg-black border border-white/15 space-y-3 font-mono">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 pb-2 border-b border-white/10 flex items-center justify-between">
                    <span>VALUATION COMPARATIVE MATRIX</span>
                    <span>DELTA: {valuationDelta >= 0 ? `+${formatCFA(valuationDelta)}` : formatCFA(valuationDelta)} ({valuationDeltaPercent}%)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-zinc-950 border border-white/10">
                      <span className="text-[9px] text-zinc-500 uppercase block">AURA Algorithmic Base:</span>
                      <span className="text-sm font-black text-white block mt-0.5">{formatCFA(algorithmicValuation)}</span>
                    </div>

                    <div className="p-2.5 bg-zinc-950 border border-white/10">
                      <span className="text-[9px] text-[#D4AF37] uppercase block">Client Proposed Valuation:</span>
                      <span className="text-sm font-black text-[#D4AF37] block mt-0.5">{formatCFA(parsedProposedWorth)}</span>
                    </div>
                  </div>

                  {/* Dynamic Status Indicator */}
                  {valuationDelta <= 0 ? (
                    <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>[ GUARANTEED MATCH ]: Your valuation aligns with our matrix. Eligible for immediate instant boutique payout.</span>
                    </div>
                  ) : valuationDeltaPercent <= 15 ? (
                    <div className="p-2.5 bg-amber-950/30 border border-amber-500/40 text-amber-200 text-[11px] flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>[ REASONABLE NEGOTIATION MARGIN ]: Within acceptable showroom tolerance (+{valuationDeltaPercent}%). Subject to physical technician inspection.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>[ CUSTOM VALUATION CLAIM ]: Proposed valuation exceeds algorithmic matrix by +{valuationDeltaPercent}%. Senior hardware inspector review required.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================== */}
          {/* RIGHT 5 COLS: LIVE FINANCIAL LEDGER & VOUCHER LOCK */}
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
                  [ EXCHANGE LEDGER // CERTIFICATE ]
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 uppercase">
                  7-DAY PRICE LOCK
                </span>
              </div>

              {/* Hardware Summary */}
              <div className="mt-4 space-y-3 text-xs">
                {/* Source device */}
                <div className="p-3 bg-black border border-white/10 space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase block tracking-wider">SOURCE DEVICE (TRADING IN):</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sourceBrand} {sourceModel}</span>
                    <span className="text-zinc-400">{sourceStorage}</span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] block">{currentCondition.title}</span>
                </div>

                {/* Target flagship */}
                <div className="p-3 bg-black border border-white/10 space-y-1">
                  <span className="text-[9px] text-zinc-500 uppercase block tracking-wider">TARGET FLAGSHIP (RECEIVING):</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{targetFlagship.name}</span>
                    <span className="text-emerald-400 font-bold">{formatCFA(targetRetailPrice)}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block">{targetFlagship.warranty}</span>
                </div>

                {/* The Exchange Math */}
                <div className="p-4 bg-zinc-950 border border-white/15 space-y-2 font-mono">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Target Retail Value:</span>
                    <span>{formatCFA(targetRetailPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#25D366] text-[11px]">
                    <span>Estimated Trade-in Credit:</span>
                    <span>- {formatCFA(algorithmicValuation)}</span>
                  </div>
                  {hasOriginalBox && (
                    <div className="flex justify-between text-[#D4AF37] text-[10px]">
                      <span>Original Box Incentive:</span>
                      <span>- 10,000 FCFA</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/15 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-black text-white block uppercase">
                        Net Balance Payable:
                      </span>
                      <span className="text-[9px] text-zinc-400 font-sans">
                        At boutique collection / delivery
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#D4AF37]">
                      {formatCFA(algorithmicNetBalance)}
                    </span>
                  </div>

                  {isProposedCustom && valuationDelta !== 0 && (
                    <div className="pt-1 text-[10px] text-zinc-400 flex justify-between border-t border-white/5">
                      <span>If client proposed worth accepted:</span>
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
                      Appraisal Voucher Issued
                    </h4>
                    <p className="text-xs text-zinc-300 font-sans">
                      Thank you, <strong className="text-white">{customerName}</strong>. Your hardware swap certificate has been registered under voucher code:
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
                      <span>[ DISPATCH TO SHOWROOM ON WHATSAPP ]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="w-full py-2.5 px-4 bg-black hover:bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors"
                    >
                      [ CONFIGURE ANOTHER SWAP ]
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-3 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                    [ LOCK APPRAISAL &amp; RESERVE FLAGSHIP ]:
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
                      Inspection Location &amp; Handover:
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
                        <span>Douala Showroom (Bonapriso Lounge)</span>
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
                        <span>Yaoundé Flagship (Bastos Lounge)</span>
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
                        <span>VIP Doorstep Courier Inspection (DLA / YDE)</span>
                        {inspectionProtocol === "doorstep_vip" && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all border border-[#D4AF37] shadow-lg shadow-amber-500/10 mt-2"
                  >
                    [ LOCK TRADE-IN OFFER &amp; RESERVE ]
                  </button>
                </form>
              )}

              {/* Official Boutique Guarantees */}
              <div className="mt-5 pt-3 border-t border-white/10 text-[10px] text-zinc-400 space-y-1.5 font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Military-grade Department of Defense data sanitization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Immediate cash deduction applied directly at checkout</span>
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
          [ LOADING AURA TRADE-IN TERMINAL... ]
        </div>
      }
    >
      <TradeInContent />
    </Suspense>
  );
}
