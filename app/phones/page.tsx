"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Camera,
  BatteryCharging,
  Gamepad2,
  Tag,
  Crown,
  Filter,
  Check,
  ArrowRight,
} from "lucide-react";
import { PHONES, Phone } from "@/lib/data/phones";
import { BRANDS } from "@/lib/data/brands";
import { ProductCard } from "@/components/product/product-card";
import { getPhonesFromDB } from "@/lib/supabase/client";
import { formatCFA } from "@/lib/formatters";

const CATEGORIES = [
  { id: "all", label: "All Devices", icon: Sparkles },
  { id: "flagship", label: "Ultra Flagships", icon: Crown },
  { id: "camera", label: "Camera Kings", icon: Camera },
  { id: "battery", label: "Battery Champions", icon: BatteryCharging },
  { id: "gaming", label: "Gaming Beasts", icon: Gamepad2 },
  { id: "deals", label: "Boutique Deals", icon: Tag },
];

const STORAGE_OPTIONS = ["all", "128GB", "256GB", "512GB", "1TB"];

const DEFAULT_MIN_PRICE = 50000;
const DEFAULT_MAX_PRICE = 1000000;

function PhonesCatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") || "all";
  const initialCategory =
    searchParams.get("category") ||
    (searchParams.get("deal") === "true" ? "deals" : "all");
  const initialSearch = searchParams.get("search") || "";

  const [phonesList, setPhonesList] = useState<Phone[]>(PHONES);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");

  // Price range states (Default 50,000 to 1,000,000 FCFA)
  const [minPrice, setMinPrice] = useState<number>(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [inputMin, setInputMin] = useState<string>("50000");
  const [inputMax, setInputMax] = useState<string>("1000000");

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");

  useEffect(() => {
    async function loadCatalog() {
      setIsLoadingCatalog(true);
      try {
        const dbPhones = await getPhonesFromDB();
        if (dbPhones && dbPhones.length > 0) {
          setPhonesList(dbPhones);
        }
      } catch (err) {
        console.error("Failed to load phones from DB:", err);
      } finally {
        setIsLoadingCatalog(false);
      }
    }
    loadCatalog();
  }, []);

  // Update category from URL if query changes
  useEffect(() => {
    const urlDeal = searchParams.get("deal") === "true";
    const urlCategory = searchParams.get("category");
    const urlBrand = searchParams.get("brand");
    const urlSearch = searchParams.get("search");

    if (urlDeal) setSelectedCategory("deals");
    else if (urlCategory) setSelectedCategory(urlCategory);
    if (urlBrand) setSelectedBrand(urlBrand);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Compute live brand inventory counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    phonesList.forEach((p) => {
      const b = p.brand.toLowerCase();
      counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [phonesList]);

  // Count active non-default filters
  const isPriceFiltered =
    minPrice > DEFAULT_MIN_PRICE || maxPrice < 2500000;

  const activeFiltersCount = [
    selectedBrand !== "all",
    selectedCategory !== "all",
    selectedCondition !== "all",
    selectedStorage !== "all",
    isPriceFiltered,
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  const handleApplyCustomPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawMin = parseInt(inputMin.replace(/\D/g, "") || "0", 10);
    const rawMax = parseInt(inputMax.replace(/\D/g, "") || "0", 10);

    const validMin = Math.max(0, rawMin);
    const validMax = Math.max(validMin, rawMax || 1000000);

    setMinPrice(validMin);
    setMaxPrice(validMax);
    setInputMin(String(validMin));
    setInputMax(String(validMax));
  };

  const resetAllFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedStorage("all");
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(2500000);
    setInputMin("50000");
    setInputMax("2500000");
    setSearchQuery("");
    setSortBy("featured");
  };

  // Multi-dimensional filter logic
  const filteredPhones = useMemo(() => {
    return phonesList
      .filter((phone) => {
        // 1. Brand Filter
        if (
          selectedBrand !== "all" &&
          phone.brand.toLowerCase() !== selectedBrand.toLowerCase()
        ) {
          return false;
        }

        // 2. Category Filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "deals") {
            if (
              !phone.isDeal &&
              (!phone.originalPrice || phone.originalPrice <= phone.basePrice)
            ) {
              return false;
            }
          } else if (phone.category !== selectedCategory) {
            return false;
          }
        }

        // 3. Condition Filter
        if (selectedCondition !== "all") {
          if (selectedCondition === "new" && phone.condition !== "Brand New")
            return false;
          if (
            selectedCondition === "refurbished" &&
            phone.condition !== "Certified Refurbished"
          ) {
            return false;
          }
        }

        // 4. Storage Variant Filter
        if (selectedStorage !== "all") {
          const hasMatchingStorage = phone.storageVariants?.some(
            (s) => s.size.toUpperCase() === selectedStorage.toUpperCase()
          );
          if (!hasMatchingStorage) return false;
        }

        // 5. Price Range Filter (50,000 to 1,000,000 FCFA & custom ranges)
        if (phone.basePrice < minPrice || phone.basePrice > maxPrice) {
          return false;
        }

        // 6. Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = phone.name.toLowerCase().includes(q);
          const matchesBrand = phone.brand.toLowerCase().includes(q);
          const matchesTagline = (phone.tagline || "").toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesTagline) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.basePrice - b.basePrice;
        if (sortBy === "price_desc") return b.basePrice - a.basePrice;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    phonesList,
    selectedBrand,
    selectedCategory,
    selectedCondition,
    selectedStorage,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. ARCHITECTURAL SYSTEM TELEMETRY & HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
              <span className="text-[#D4AF37] font-bold">[ INVENTORY // SMARTPHONES_CATALOG ]</span>
              <span>•</span>
              <span>CAMEROON DISPATCH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Smartphones Catalog
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Official 12-month warranty, sealed units, and pay-on-delivery in Douala and Yaoundé.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 bg-[#0E0E12] border border-white/10 text-zinc-300">
              MATCHED: <strong className="text-[#D4AF37]">{filteredPhones.length}</strong> UNITS
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#D4AF37] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-bold transition-all shrink-0 flex items-center gap-2 rounded-none cursor-pointer border ${
                  isSelected
                    ? "gold-gradient-bg text-black border-[#D4AF37]"
                    : "bg-[#0E0E12] text-zinc-400 hover:text-white border-white/10 hover:border-white/25"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-black" : "text-[#D4AF37]"}`} />
                <span className="uppercase tracking-wider">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. PROMINENT FILTER CONTROL CENTER (CLEARLY VISIBLE BRAND & PRICE FILTERING) */}
        <div className="bg-[#0E0E12] border border-white/10 p-4 sm:p-6 shadow-2xl relative rounded-none space-y-6">
          {/* Architectural corner crosshairs */}
          <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>
          <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>
          <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>
          <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>

          {/* PART A: PROMINENT BRAND FILTERING */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-[#D4AF37]" />
                <span>FILTER BY BRAND</span>
              </span>
              <span className="text-[10px] text-zinc-500 uppercase">
                [ {selectedBrand === "all" ? "SHOWING ALL BRANDS" : `SELECTED: ${selectedBrand.toUpperCase()}`} ]
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
              {/* All Brands Button */}
              <button
                onClick={() => setSelectedBrand("all")}
                className={`px-3.5 py-2 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 rounded-none border cursor-pointer ${
                  selectedBrand === "all"
                    ? "bg-white text-black border-white shadow-sm"
                    : "bg-[#121217] text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
                }`}
              >
                <span>ALL BRANDS</span>
                <span className={`text-[10px] px-1.5 py-0.2 ${selectedBrand === "all" ? "bg-black/10 text-black font-bold" : "bg-white/5 text-zinc-500"}`}>
                  {phonesList.length}
                </span>
              </button>

              {/* Dynamic Brand Buttons with live count */}
              {BRANDS.map((brand) => {
                const isSelected = selectedBrand.toLowerCase() === brand.id.toLowerCase();
                const count = brandCounts[brand.id.toLowerCase()] || 0;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={`px-3 py-2 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 rounded-none border cursor-pointer ${
                      isSelected
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                        : "bg-[#121217] text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="uppercase">{brand.name}</span>
                    <span className={`text-[10px] px-1 py-0.2 ${isSelected ? "bg-[#D4AF37] text-black font-black" : "bg-white/5 text-zinc-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PART B: PROMINENT PRICE FILTERING (50,000 FCFA TO 1,000,000 FCFA + CUSTOM RANGE INPUTS) */}
          {/* PART B: SIMPLE, PROMINENT PRICE RANGE FILTER (50,000 – 1,000,000 FCFA) */}
          <div className="pt-4 border-t border-white/10 space-y-2.5 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                <span>PRICE FILTER (50,000 FCFA – 1,000,000 FCFA)</span>
              </span>
              <span className="text-[11px] text-zinc-400">
                ACTIVE RANGE: <strong className="text-white">{formatCFA(minPrice)}</strong> – <strong className="text-white">{maxPrice >= 2500000 ? "Any (2.5M+)" : formatCFA(maxPrice)}</strong>
              </span>
            </div>

            {/* Clean Custom Range Input Row */}
            <form onSubmit={handleApplyCustomPrice} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 font-bold uppercase pointer-events-none">
                    MIN
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={inputMin}
                    onChange={(e) => setInputMin(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-[#121217] border border-white/15 pl-11 pr-12 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 pointer-events-none">
                    FCFA
                  </span>
                </div>

                <span className="text-zinc-500 font-bold select-none">—</span>

                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 font-bold uppercase pointer-events-none">
                    MAX
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={25000}
                    value={inputMax}
                    onChange={(e) => setInputMax(e.target.value)}
                    placeholder="1000000"
                    className="w-full bg-[#121217] border border-white/15 pl-11 pr-12 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 pointer-events-none">
                    FCFA
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="py-2 px-4 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all rounded-none cursor-pointer h-[38px] shrink-0"
              >
                Apply Range
              </button>

              {(minPrice !== DEFAULT_MIN_PRICE || maxPrice !== DEFAULT_MAX_PRICE) && (
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice(DEFAULT_MIN_PRICE);
                    setMaxPrice(DEFAULT_MAX_PRICE);
                    setInputMin("50000");
                    setInputMax("1000000");
                  }}
                  className="py-2 px-3 bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs uppercase font-mono transition-all rounded-none cursor-pointer h-[38px] shrink-0"
                  title="Reset to 50,000 - 1,000,000 FCFA"
                >
                  Reset Price
                </button>
              )}
            </form>
          </div>

          {/* PART C: REFINEMENTS (STORAGE, CONDITION & SORT) */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center font-mono text-xs">
            {/* Storage Filter */}
            <div className="md:col-span-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">
                [ STORAGE TIER ]
              </span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {STORAGE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedStorage(size)}
                    className={`px-2.5 py-1 text-[11px] font-bold border transition-colors shrink-0 rounded-none cursor-pointer ${
                      selectedStorage === size
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                        : "bg-[#121217] text-zinc-400 hover:text-white border-white/10"
                    }`}
                  >
                    {size === "all" ? "ALL" : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="md:col-span-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">
                [ HARDWARE CONDITION ]
              </span>
              <div className="flex items-center gap-1">
                {[
                  { label: "ALL", val: "all" },
                  { label: "BRAND NEW", val: "new" },
                  { label: "PRE-OWNED", val: "refurbished" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setSelectedCondition(c.val)}
                    className={`px-2.5 py-1 text-[11px] font-bold border transition-colors rounded-none cursor-pointer ${
                      selectedCondition === c.val
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]"
                        : "bg-[#121217] text-zinc-400 hover:text-white border-white/10"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="md:col-span-4 space-y-1">
              <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">
                [ SORT CATALOG ]
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#121217] border border-white/15 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
              >
                <option value="featured">Featured & Curated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>

          {/* Search Input Bar inside Filter Box */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="relative flex-1 max-w-lg">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smartphone model, camera specs..."
                className="w-full bg-[#121217] border border-white/15 py-2 pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Active filters status indicator */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span>ACTIVE:</span>
              <span className="text-white font-bold">
                {selectedBrand !== "all" ? selectedBrand : "All Brands"}
              </span>
              <span>•</span>
              <span className="text-[#D4AF37] font-bold">
                {formatCFA(minPrice)} – {maxPrice >= 2500000 ? "Any" : formatCFA(maxPrice)}
              </span>
            </div>
          </div>

        </div>

        {/* 4. PRODUCT CARDS GRID */}
        {isLoadingCatalog ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-[#0E0E12] border border-white/10 p-4 space-y-3 rounded-none"
              >
                <div className="flex justify-between">
                  <div className="h-2.5 w-16 bg-[#D4AF37]/20"></div>
                  <div className="h-2.5 w-12 bg-white/10"></div>
                </div>
                <div className="w-full h-44 bg-black border border-white/10 flex items-center justify-center">
                  <div className="w-16 h-28 bg-white/5"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 w-3/4 bg-white/10"></div>
                  <div className="h-2.5 w-1/2 bg-white/5"></div>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <div className="h-4 w-20 bg-[#D4AF37]/30"></div>
                  <div className="h-2.5 w-12 bg-white/5"></div>
                </div>
                <div className="h-9 w-full bg-white/10"></div>
              </div>
            ))}
          </div>
        ) : filteredPhones.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-none bg-[#0E0E12] border border-white/10 p-8 relative">
            <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>

            <p className="text-zinc-300 font-bold text-base font-mono uppercase tracking-wide">
              [ NO DEVICES MATCHED CURRENT FILTERS ]
            </p>
            <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed">
              No smartphones found for {selectedBrand !== "all" ? selectedBrand : "current selection"} within{" "}
              {formatCFA(minPrice)} to {formatCFA(maxPrice)}. Try broadening your price range or clearing the brand filter.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-widest cursor-pointer rounded-none"
            >
              Reset All Filters
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-400 text-xs font-mono">
          [ LOADING INVENTORY CATALOG... ]
        </div>
      }
    >
      <PhonesCatalogContent />
    </Suspense>
  );
}
