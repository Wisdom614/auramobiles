"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  Search,
  RotateCcw,
  Check,
} from "lucide-react";
import { PHONES, Phone } from "@/lib/data/phones";
import { BRANDS } from "@/lib/data/brands";
import { ProductCard } from "@/components/product/product-card";
import { formatCFA } from "@/lib/formatters";

function PhonesCatalog() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") || "all";
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialDeal = searchParams.get("deal") === "true";

  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [onlyDeals, setOnlyDeals] = useState<boolean>(initialDeal);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter phones
  const filteredPhones = useMemo(() => {
    return PHONES.filter((phone) => {
      // Brand filter
      if (selectedBrand !== "all" && phone.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && phone.category !== selectedCategory) {
        return false;
      }
      // Condition filter
      if (selectedCondition !== "all") {
        if (selectedCondition === "new" && phone.condition !== "Brand New") return false;
        if (selectedCondition === "refurbished" && phone.condition !== "Certified Refurbished") return false;
      }
      // Deals filter
      if (onlyDeals && !phone.isDeal) {
        return false;
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
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedBrand, selectedCategory, selectedCondition, searchQuery, onlyDeals, sortBy]);

  const resetFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSearchQuery("");
    setOnlyDeals(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedBrand !== "all" ||
    selectedCategory !== "all" ||
    selectedCondition !== "all" ||
    searchQuery !== "" ||
    onlyDeals;

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-3 font-mono">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4AF37]">Smartphones Catalog</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                All Smartphones
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Official Apple, Samsung, Xiaomi, Tecno, Infinix, and Google flagships with Cameroon warranty.
              </p>
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-zinc-400 font-mono">
              Showing <span className="text-[#D4AF37] font-bold">{filteredPhones.length}</span> devices in stock
            </div>
          </div>
        </div>

        {/* Top Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#121217] border border-white/8 mb-8">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, chipset, storage..."
              className="w-full bg-[#181820] border border-white/8 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Mobile Filter Toggle & Sort Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Filters {hasActiveFilters && "●"}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar (Desktop) + Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 p-6 rounded-2xl bg-[#121217] border border-white/8 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
                Refine Selection
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5">
                Brand
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedBrand === "all"
                      ? "bg-[#D4AF37]/15 text-[#D4AF37] font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>All Brands</span>
                  <span className="font-mono text-[11px]">{PHONES.length}</span>
                </button>
                {BRANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedBrand.toLowerCase() === b.id.toLowerCase()
                        ? "bg-[#D4AF37]/15 text-[#D4AF37] font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="font-mono text-[11px]">
                      {PHONES.filter((p) => p.brand.toLowerCase() === b.id.toLowerCase()).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5">
                Condition
              </h4>
              <div className="space-y-1 text-xs">
                {[
                  { label: "All Conditions", val: "all" },
                  { label: "Brand New (Factory Sealed)", val: "new" },
                  { label: "Certified Pre-Owned", val: "refurbished" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setSelectedCondition(c.val)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      selectedCondition === c.val
                        ? "bg-[#D4AF37]/15 text-[#D4AF37] font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Deals Checkbox */}
            <div className="pt-4 border-t border-white/5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={onlyDeals}
                  onChange={(e) => setOnlyDeals(e.target.checked)}
                  className="rounded border-white/20 bg-zinc-800 text-[#D4AF37] focus:ring-0"
                />
                <span className="font-medium">Flash Deals Only</span>
              </label>
            </div>
          </div>

          {/* Product Grid (3 Cols on LG) */}
          <div className="lg:col-span-3">
            {filteredPhones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPhones.map((phone) => (
                  <ProductCard key={phone.id} phone={phone} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl bg-[#121217] border border-white/5 p-8">
                <p className="text-base font-semibold text-white">No smartphones found</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your filters, clearing your search query, or checking back soon for restocks.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2.5 rounded-xl gold-gradient-bg text-black text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#121217] border-l border-white/10 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Filters
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Brand
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedBrand === "all"
                        ? "bg-[#D4AF37] text-black font-bold"
                        : "bg-[#181820] text-zinc-300"
                    }`}
                  >
                    All
                  </button>
                  {BRANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBrand(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedBrand.toLowerCase() === b.id.toLowerCase()
                          ? "bg-[#D4AF37] text-black font-bold"
                          : "bg-[#181820] text-zinc-300"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Condition
                </h4>
                <div className="space-y-1.5">
                  {[
                    { label: "All Conditions", val: "all" },
                    { label: "Brand New Sealed", val: "new" },
                    { label: "Certified Pre-Owned", val: "refurbished" },
                  ].map((c) => (
                    <button
                      key={c.val}
                      onClick={() => setSelectedCondition(c.val)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        selectedCondition === c.val
                          ? "bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]"
                          : "bg-[#181820] text-zinc-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                View {filteredPhones.length} Results
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PhonesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-500">Loading catalog...</div>}>
      <PhonesCatalog />
    </Suspense>
  );
}
