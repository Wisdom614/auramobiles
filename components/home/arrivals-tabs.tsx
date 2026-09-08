"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, ShieldCheck } from "lucide-react";
import { PHONES, Phone } from "@/lib/data/phones";
import { ProductCard } from "@/components/product/product-card";
import { getPhonesFromDB } from "@/lib/supabase/client";

type TabType = "new" | "bestsellers" | "certified";

export function ArrivalsTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("new");
  const [phonesList, setPhonesList] = useState<Phone[]>(PHONES);

  React.useEffect(() => {
    getPhonesFromDB().then((data) => {
      if (data && data.length > 0) {
        setPhonesList(data);
      }
    });
  }, []);

  const getPhonesByTab = (): Phone[] => {
    switch (activeTab) {
      case "new":
        return phonesList.filter((p) => p.isNew).slice(0, 4);
      case "bestsellers":
        return phonesList.filter((p) => p.isBestSeller).slice(0, 4);
      case "certified":
        return phonesList.filter((p) => p.condition === "Certified Refurbished").slice(0, 4);
    }
  };

  const phones = getPhonesByTab();

  return (
    <section className="py-16 bg-[#09090B] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-amber-300 text-xs font-medium mb-3">
              <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase tracking-wider font-mono text-[11px]">Trending in Douala & Yaoundé</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Latest Arrivals & Best Sellers
            </h2>
          </div>

          {/* Luxury Tab Switchers */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14141A] border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "new"
                  ? "bg-[#D4AF37] text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "bestsellers"
                  ? "bg-[#D4AF37] text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab("certified")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "certified"
                  ? "bg-[#D4AF37] text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified Pre-Owned</span>
            </button>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {phones.map((phone) => (
            <ProductCard key={phone.id} phone={phone} layout="grid" />
          ))}
        </div>

        {/* Footnote with link */}
        <div className="mt-8 flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-white/5">
          <span className="font-mono">
            Showing {phones.length} active flagships with certified battery health &gt; 95%
          </span>
          <Link
            href="/phones"
            className="text-[#D4AF37] hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>View All Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
