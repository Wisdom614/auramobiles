"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Check,
  Building2,
  Truck,
  Sparkles,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { PHONES } from "@/lib/data/phones";

interface DeviceModel {
  brand: string;
  name: string;
  baseValuation: number;
}

const TRADE_MODELS: DeviceModel[] = [
  // Apple
  { brand: "Apple", name: "iPhone 15 Pro Max", baseValuation: 550000 },
  { brand: "Apple", name: "iPhone 15 Pro", baseValuation: 460000 },
  { brand: "Apple", name: "iPhone 15", baseValuation: 350000 },
  { brand: "Apple", name: "iPhone 14 Pro Max", baseValuation: 420000 },
  { brand: "Apple", name: "iPhone 14 Pro", baseValuation: 360000 },
  { brand: "Apple", name: "iPhone 13 Pro", baseValuation: 280000 },
  { brand: "Apple", name: "iPhone 13", baseValuation: 220000 },
  { brand: "Apple", name: "iPhone 12 Pro", baseValuation: 190000 },
  // Samsung
  { brand: "Samsung", name: "Galaxy S23 Ultra", baseValuation: 420000 },
  { brand: "Samsung", name: "Galaxy S23+", baseValuation: 310000 },
  { brand: "Samsung", name: "Galaxy S22 Ultra", baseValuation: 300000 },
  { brand: "Samsung", name: "Galaxy Z Fold 4", baseValuation: 380000 },
  { brand: "Samsung", name: "Galaxy A54 5G", baseValuation: 140000 },
  // Tecno
  { brand: "Tecno", name: "Phantom V Fold", baseValuation: 320000 },
  { brand: "Tecno", name: "Camon 20 Premier", baseValuation: 150000 },
  // Google
  { brand: "Google", name: "Pixel 8 Pro", baseValuation: 330000 },
  { brand: "Google", name: "Pixel 7 Pro", baseValuation: 210000 },
];

const CONDITIONS = [
  {
    id: "flawless",
    title: "Flawless / Like New",
    desc: "Zero scratches, 100% functional, original screen and battery > 85%",
    factor: 1.0,
  },
  {
    id: "good",
    title: "Good Condition",
    desc: "Light microscopic pocket marks, perfectly functioning, all features working",
    factor: 0.85,
  },
  {
    id: "fair",
    title: "Fair / Used",
    desc: "Visible scuffs or minor scratches, fully functioning touch and cameras",
    factor: 0.7,
  },
  {
    id: "damaged",
    title: "Minor Damage",
    desc: "Cracked back glass or weak battery, phone boots and operates normally",
    factor: 0.5,
  },
];

export default function TradeInPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("Apple");
  const [selectedModel, setSelectedModel] = useState<string>("iPhone 13 Pro");
  const [selectedCondition, setSelectedCondition] = useState<string>("flawless");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Douala");
  const [submitted, setSubmitted] = useState(false);

  const modelData =
    TRADE_MODELS.find((m) => m.name === selectedModel) ||
    TRADE_MODELS.find((m) => m.brand === selectedBrand) ||
    TRADE_MODELS[0];

  const conditionObj = CONDITIONS.find((c) => c.id === selectedCondition) || CONDITIONS[0];
  const estimatedValue = Math.round((modelData.baseValuation * conditionObj.factor) / 5000) * 5000;

  const filteredModels = TRADE_MODELS.filter((m) => m.brand === selectedBrand);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName && customerPhone) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-amber-300 text-xs font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="uppercase tracking-widest font-mono text-[10px]">
              AURA Certified Phone Swap
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Your old phone still has value.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-2">
            Trade it in and deduct its value immediately from your next flagship smartphone.
          </p>
        </div>

        {/* Trade-in Wizard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Valuation Wizard (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Brand */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-white/8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                Step 1: Select Current Device Brand
              </span>
              <div className="grid grid-cols-4 gap-2">
                {["Apple", "Samsung", "Tecno", "Google"].map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      const first = TRADE_MODELS.find((m) => m.brand === brand);
                      if (first) setSelectedModel(first.name);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedBrand === brand
                        ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-md shadow-amber-500/15"
                        : "bg-[#16161D] border-white/10 text-zinc-300 hover:text-white"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Model */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-white/8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                Step 2: Select Specific Model
              </span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#181820] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                {filteredModels.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Condition */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-white/8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
                Step 3: Physical & Battery Condition
              </span>
              <div className="space-y-2">
                {CONDITIONS.map((cond) => (
                  <button
                    key={cond.id}
                    onClick={() => setSelectedCondition(cond.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      selectedCondition === cond.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]"
                        : "bg-[#16161D] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {cond.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {cond.desc}
                      </span>
                    </div>
                    {selectedCondition === cond.id && (
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Instant Valuation Card & Submission (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            <div className="rounded-3xl bg-gradient-to-b from-[#181820] to-[#101014] border border-[#D4AF37]/40 p-6 sm:p-7 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                  Instant Appraisal Certificate
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Guaranteed Offer
                </span>
              </div>

              <div>
                <span className="text-xs text-zinc-400 font-mono block">
                  {selectedBrand} • {selectedModel}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  Condition: <strong className="text-white">{conditionObj.title}</strong>
                </span>

                <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-white/8 text-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
                    Estimated Trade-In Credit
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#D4AF37] block mt-1">
                    {formatCFA(estimatedValue)}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    Directly deductible at checkout
                  </span>
                </div>
              </div>

              {/* Form or Submitted State */}
              {submitted ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Appraisal Voucher Issued</h4>
                  <p className="text-xs text-zinc-300">
                    Thank you, {customerName}. Our concierge has logged your valuation of {formatCFA(estimatedValue)}. An agent will contact {customerPhone} within 30 minutes to arrange doorstep pick-up in {customerCity} or reserve your in-store appointment.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-white block">
                    Confirm Your Valuation & Lock Price:
                  </span>
                  
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />

                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Phone (+237 6XX XX XX XX)"
                    className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerCity("Douala")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold ${
                        customerCity === "Douala"
                          ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white"
                          : "bg-[#16161D] border-white/10 text-zinc-400"
                      }`}
                    >
                      Douala (Akwa / Bonapriso)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerCity("Yaoundé")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold ${
                        customerCity === "Yaoundé"
                          ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white"
                          : "bg-[#16161D] border-white/10 text-zinc-400"
                      }`}
                    >
                      Yaoundé (Bastos)
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/15 hover:opacity-95 transition-all"
                  >
                    Lock Trade-In Offer
                  </button>
                </form>
              )}

              {/* Guarantees */}
              <div className="pt-2 text-[10px] text-zinc-400 space-y-1.5 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Certified military-grade data wipe guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Redeemable at Bonapriso or Bastos lounges</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
