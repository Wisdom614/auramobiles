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
    description: "Every device undergoes stringent automated checks: battery cycle telemetry, display sampling, Face ID/Fingerprint sensors, and optical stabilization.",
    metric: "100%",
    metricLabel: "Audit Passed",
  },
  {
    icon: Building2,
    title: "Local Flagship Showrooms",
    subtitle: "Douala & Yaoundé Lounges",
    description: "Visit our dedicated physical boutiques to test devices in person, transfer your data securely, or consult with our hardware technicians.",
    metric: "2",
    metricLabel: "Central Lounges",
  },
  {
    icon: ShieldCheck,
    title: "Official Serial & IMEI Lineage",
    subtitle: "Zero Grey Market Risk",
    description: "No bypasses or counterfeit clones. Live verification on official Apple and Samsung manufacturer portals before completing acquisition.",
    metric: "15k+",
    metricLabel: "Verified Releases",
  },
  {
    icon: UserCheck,
    title: "VIP White-Glove Setup",
    subtitle: "Complete Data Migration",
    description: "Our concierge team migrates WhatsApp databases, banking applications, media libraries, and eSIMs with zero downtime and strict confidentiality.",
    metric: "4.9/5",
    metricLabel: "Client Rating",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-[#09090B] border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
            [ OPERATIONAL INTEGRITY // APEX QUALITY STANDARDS ]
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-sans mt-1">
            Why Discerning Clients Choose AURA
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Bridging international consumer electronics excellence with local Cameroon reliability and warranty security.
          </p>
        </div>

        {/* 4-Pillar Architectural Table with 1px Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15 bg-[#0E0E12]">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 flex flex-col justify-between hover:bg-[#121217] transition-colors relative group"
              >
                <div>
                  {/* Chamber index */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-[10px]">
                    <span className="text-[#D4AF37] uppercase tracking-wider">
                      [ STANDARD 0{idx + 1} ]
                    </span>
                    <span className="text-zinc-600">VERIFIED</span>
                  </div>

                  <div className="w-9 h-9 bg-black border border-white/15 flex items-center justify-center mb-4 group-hover:border-[#D4AF37] transition-colors">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <h3 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
                    {pillar.title}
                  </h3>
                  <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5 uppercase">
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
