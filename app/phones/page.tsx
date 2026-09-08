"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, Check } from "lucide-react";
import { PHONES } from "@/lib/data/phones";
import { BRANDS } from "@/lib/data/brands";
import { ProductCard } from "@/components/product/product-card";

function PhonesCatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") || "all";
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">("featured");

  // Filter phones
  const filteredPhones = useMemo(() => {
    return PHONES.filter((phone) => {
      // Brand filter
      if (selectedBrand !== "all" && phone.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Condition filter
      if (selectedCondition !== "all") {
        if (selectedCondition === "new" && phone.condition !== "Brand New") return false;
        if (selectedCondition === "refurbished" && phone.condition !== "Certified Refurbished") return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = phone.name.toLowerCase().includes(q);
        const matchesBrand = phone.brand.toLowerCase().includes(q);
        const matchesTagline = phone.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTagline) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.basePrice - b.basePrice;
      if (sortBy === "price_desc") return b.basePrice - a.basePrice;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedBrand, selectedCondition, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smartphones Catalog
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Select any brand to filter. Official warranty & pay on delivery in Cameroon.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            Showing <span className="text-[#D4AF37] font-bold">{filteredPhones.length}</span> devices
          </div>
        </div>

        {/* 1-Tap Brand Filter Pills (Scrollable horizontally on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            onClick={() => setSelectedBrand("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[38px] ${
              selectedBrand === "all"
                ? "gold-gradient-bg text-black shadow-md shadow-amber-500/15"
                : "bg-[#14141A] text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            All Brands
          </button>
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[38px] ${
                selectedBrand.toLowerCase() === brand.id.toLowerCase()
                  ? "gold-gradient-bg text-black shadow-md shadow-amber-500/15"
                  : "bg-[#14141A] text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* Second Row: Condition Pills + Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#121217] border border-white/8 mb-8">
          
          {/* Condition Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { label: "All Conditions", val: "all" },
              { label: "Brand New", val: "new" },
              { label: "Pre-Owned", val: "refurbished" },
            ].map((c) => (
              <button
                key={c.val}
                onClick={() => setSelectedCondition(c.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedCondition === c.val
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                    : "text-zinc-400 hover:text-white bg-transparent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone model..."
                className="w-full bg-[#181820] border border-white/10 rounded-xl py-1.5 pl-8 pr-7 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#181820] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        {filteredPhones.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-zinc-400 text-sm">No smartphones found matching your filter.</p>
            <button
              onClick={() => {
                setSelectedBrand("all");
                setSelectedCondition("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredPhones.map((phone) => (
              <ProductCard key={phone.id} phone={phone} layout="grid" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function PhonesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-400 text-xs">Loading Catalog...</div>}>
      <PhonesCatalogContent />
    </Suspense>
  );
}
