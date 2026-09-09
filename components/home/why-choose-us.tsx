"use client";

import React from "react";
import {
  CheckCircle,
  Building2,
  Cpu,
  UserCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Pillar {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  metricLabel: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Cpu,
    title: "100% Tested & Verified",
    subtitle: "Hardware & Battery Audit",
    description: "Every phone undergoes full verification: battery health, vibrant display, Face ID/fingerprint sensors, and optical cameras work flawlessly.",
    metric: "100%",
    metricLabel: "Tested Units",
  },
  {
    icon: Building2,
    title: "Physical Showroom",
    subtitle: "Buea, Molyko Checkpoint",
    description: "Visit our physical store to test any phone in person, inspect sealed boxes, swap your current phone, or get expert advice on your next upgrade.",
    metric: "Buea",
    metricLabel: "Showroom Hub",
  },
  {
    icon: ShieldCheck,
    title: "Official Brand Warranty",
    subtitle: "Zero Counterfeit Risk",
    description: "Genuine Apple, Samsung, Google, and Tecno hardware with valid serial numbers. Inspect and check official warranty before paying.",
    metric: "15k+",
    metricLabel: "Phones Delivered",
  },
  {
    icon: UserCheck,
    title: "Free WhatsApp Transfer",
    subtitle: "Full Data Migration",
    description: "Our store team will help transfer all your WhatsApp chats, contacts, photos, and banking apps to your new phone for free.",
    metric: "4.9/5",
    metricLabel: "Customer Rating",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-[#09090B] border-b border-white/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
            THE AURA ADVANTAGE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-sans mt-1">
            Why Cameroonians Choose AURA
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Genuine sealed smartphones, honest prices in FCFA, official warranty, and reliable delivery across Cameroon.
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15 bg-[#0E0E12]">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 flex flex-col justify-between hover:bg-[#121217] transition-colors relative group"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-[10px]">
                    <span className="text-[#D4AF37] uppercase tracking-wider font-bold">
                      PROMISE 0{idx + 1}
                    </span>
                    <span className="text-emerald-400 font-bold">GUARANTEED</span>
                  </div>

                  <div className="w-9 h-9 bg-black border border-white/15 flex items-center justify-center mb-4 group-hover:border-[#D4AF37] transition-colors">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <h3 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
                    {pillar.title}
                  </h3>
                  <p className="text-[10.5px] text-[#D4AF37] font-mono mt-0.5 uppercase">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Metric Bottom Box */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-baseline justify-between font-mono">
                  <span className="text-xl sm:text-2xl font-black text-white group-hover:text-[#D4AF37] transition-colors">
                    {pillar.metric}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                    {pillar.metricLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
