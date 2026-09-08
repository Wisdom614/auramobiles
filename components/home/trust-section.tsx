"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  CreditCard,
  Truck,
  RotateCcw,
} from "lucide-react";

interface TrustItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  code: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    code: "01",
    title: "100% Genuine Devices",
    subtitle: "Sealed hardware. Zero grey market.",
  },
  {
    icon: Award,
    code: "02",
    title: "Boutique Warranty",
    subtitle: "Official guarantee enclosed.",
  },
  {
    icon: CreditCard,
    code: "03",
    title: "Cash on Inspection",
    subtitle: "Inspect device before paying.",
  },
  {
    icon: Truck,
    code: "04",
    title: "Delivers Nationwide",
    subtitle: "Buea, Molyko & nationwide.",
  },
  {
    icon: RotateCcw,
    code: "05",
    title: "7-Day Replacement",
    subtitle: "Instant direct unit swap.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-[#0B0B0E] border-b border-white/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-[#0B0B0E] hover:bg-[#101015] transition-colors group relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-black border border-white/15 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 group-hover:text-[#D4AF37] transition-colors">
                    [ {item.code} ]
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
