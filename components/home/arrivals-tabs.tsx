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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
              Curated Flagships • Douala, Yaoundé &amp; Nationwide
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
              Latest Arrivals &amp; Best Sellers
            </h2>
          </div>

          {/* Luxury Tab Switchers (Straight Edges) */}
          <div className="flex items-center gap-1 border border-white/10 bg-black p-1 shrink-0 rounded-none">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === "new"
                  ? "gold-gradient-bg text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === "bestsellers"
                  ? "gold-gradient-bg text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab("certified")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === "certified"
                  ? "gold-gradient-bg text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pre-Owned (UK Used)</span>
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
