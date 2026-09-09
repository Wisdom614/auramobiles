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
    code: "AUTHENTIC",
    title: "100% Authentic Devices",
    subtitle: "Brand new sealed & certified tested pre-owned with verification.",
  },
  {
    icon: Award,
    code: "WARRANTY",
    title: "6–12 Month Warranty",
    subtitle: "Official boutique warranty certificate enclosed.",
  },
  {
    icon: CreditCard,
    code: "SAFETY",
    title: "Pay on Delivery",
    subtitle: "Inspect & test your phone thoroughly before paying.",
  },
  {
    icon: Truck,
    code: "EXPRESS",
    title: "Fast Delivery",
    subtitle: "Same-day in Buea, 24h express to Douala & Yaoundé.",
  },
  {
    icon: RotateCcw,
    code: "SUPPORT",
    title: "7-Day Replacement",
    subtitle: "Direct replacement if there is any manufacturer defect.",
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
                  <span className="text-[9px] font-mono font-bold text-zinc-500 group-hover:text-[#D4AF37] transition-colors">
                    {item.code}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white tracking-wide uppercase font-sans">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-snug font-sans">
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
