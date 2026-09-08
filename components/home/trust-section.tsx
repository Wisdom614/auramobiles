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
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Devices",
    subtitle: "No fakes. No worries.",
  },
  {
    icon: Award,
    title: "Official Warranty",
    subtitle: "Peace of mind.",
  },
  {
    icon: CreditCard,
    title: "Secure & Flexible Payment",
    subtitle: "Multiple payment options.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Across Cameroon.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Replacement",
    subtitle: "Hassle-free returns.",
  },
];

export function TrustSection() {
  return (
    <section className="py-6 sm:py-7 bg-[#09090C] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 group transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] transition-colors">
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
