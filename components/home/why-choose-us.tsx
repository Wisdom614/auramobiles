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
    title: "65-Point Diagnostic Audit",
    subtitle: "Hardware & Biometrics Tested",
    description: "Every unit undergoes stringent automated diagnostic checks: battery cycles, display touch sampling, Face ID/Fingerprint, cameras, and thermal curves.",
    metric: "100%",
    metricLabel: "Audit Passed",
  },
  {
    icon: Building2,
    title: "Local Flagship Showrooms",
    subtitle: "Douala (Akwa) & Yaoundé (Bastos)",
    description: "Visit our dedicated physical boutiques to test devices in person, transfer your contacts seamlessly, or get immediate hands-on technical guidance.",
    metric: "2",
    metricLabel: "Showroom Locations",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Serial & IMEI Verification",
    subtitle: "Direct Brand Lineage",
    description: "No grey-market clones or bypass devices. Verify your serial number live on the official Apple or Samsung coverage portal before completing purchase.",
    metric: "15k+",
    metricLabel: "Verified Devices",
  },
  {
    icon: UserCheck,
    title: "VIP White-Glove Concierge",
    subtitle: "Free Full Device Setup",
    description: "Our technicians transfer your WhatsApp, banking apps, photos, and eSIM on the spot with zero downtime and guaranteed complete privacy.",
    metric: "4.9/5",
    metricLabel: "Customer Satisfaction",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#0B0B0E] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Uncompromising Standards
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1.5">
            Why Customers Choose AURA
          </h2>
          <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
            We bridge international flagship technology and premier local reliability across Cameroon.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#121216] border border-white/8 hover:border-[#D4AF37]/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-[#D4AF37]/25 flex items-center justify-center group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-colors">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400">0{idx + 1}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-mono mt-0.5 font-medium">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Metric Bottom Box */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white group-hover:text-[#D4AF37] transition-colors">
                    {pillar.metric}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">
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
