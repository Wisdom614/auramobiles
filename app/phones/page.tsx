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
  ChevronDown,
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

function PhonesCatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get("brand") || "all";
  const initialCategory = searchParams.get("category") || (searchParams.get("deal") === "true" ? "deals" : "all");
  const initialSearch = searchParams.get("search") || "";

  const [phonesList, setPhonesList] = useState<Phone[]>(PHONES);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1800000);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

  // Count active non-default filters
  const activeFiltersCount = [
    selectedBrand !== "all",
    selectedCategory !== "all",
    selectedCondition !== "all",
    selectedStorage !== "all",
    maxPrice < 1800000,
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedStorage("all");
    setMaxPrice(1800000);
    setSearchQuery("");
    setSortBy("featured");
  };

  // Multi-dimensional filter logic
  const filteredPhones = useMemo(() => {
    return phonesList
      .filter((phone) => {
        // 1. Brand Filter
        if (selectedBrand !== "all" && phone.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }

        // 2. Category Filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "deals") {
            if (!phone.isDeal && (!phone.originalPrice || phone.originalPrice <= phone.basePrice)) {
              return false;
            }
          } else if (phone.category !== selectedCategory) {
            return false;
          }
        }

        // 3. Condition Filter
        if (selectedCondition !== "all") {
          if (selectedCondition === "new" && phone.condition !== "Brand New") return false;
          if (selectedCondition === "refurbished" && phone.condition !== "Certified Refurbished") {
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

        // 5. Price Range Filter
        if (phone.basePrice > maxPrice) {
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
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Header & Live Counter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold block mb-1">
              AURA Official Inventory
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smartphones Catalog
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Official boutique warranty, sealed flagships, and pay-on-delivery across Cameroon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-mono">
              Found <strong className="text-[#D4AF37]">{filteredPhones.length}</strong> devices
            </span>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
              className="sm:hidden px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 hover:bg-zinc-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 2. Category Filter Tabs (Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? "gold-gradient-bg text-black shadow-md shadow-amber-500/15"
                    : "bg-[#14141A] text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-black" : "text-[#D4AF37]"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. 1-Tap Brand Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedBrand("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              selectedBrand === "all"
                ? "bg-white text-black font-bold shadow-sm"
                : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5"
            }`}
          >
            All Brands
          </button>
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedBrand.toLowerCase() === brand.id.toLowerCase()
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* 4. Advanced Filter Panel (Desktop always visible, Mobile collapsible) */}
        <div
          className={`rounded-2xl bg-[#121217] border border-white/10 p-4 sm:p-5 shadow-xl transition-all ${
            isFilterDrawerOpen ? "block" : "hidden sm:block"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* A. Price Range Slider (5 Cols) */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Max Budget:</span>
                <span className="font-black text-[#D4AF37] font-mono">
                  {maxPrice >= 1800000 ? "Any Price (1.8M+)" : formatCFA(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={1800000}
                step={25000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>200,000 F</span>
                <span>1,000,000 F</span>
                <span>1,800,000 F+</span>
              </div>
            </div>

            {/* B. Storage Filter (3 Cols) */}
            <div className="md:col-span-3 space-y-1.5">
              <span className="text-xs font-semibold text-zinc-300 block">Storage Tier:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {STORAGE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedStorage(size)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                      selectedStorage === size
                        ? "bg-[#D4AF37] text-black font-bold"
                        : "bg-[#181820] text-zinc-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {size === "all" ? "All" : size}
                  </button>
                ))}
              </div>
            </div>

            {/* C. Condition Filter (2 Cols) */}
            <div className="md:col-span-2 space-y-1.5">
              <span className="text-xs font-semibold text-zinc-300 block">Condition:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "All", val: "all" },
                  { label: "New", val: "new" },
                  { label: "Pre-Owned", val: "refurbished" },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setSelectedCondition(c.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      selectedCondition === c.val
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold"
                        : "bg-[#181820] text-zinc-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* D. Sort Dropdown (3 Cols) */}
            <div className="md:col-span-3 space-y-1.5">
              <span className="text-xs font-semibold text-zinc-300 block">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Featured & Curated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

          </div>

          {/* Bottom Bar inside Panel: Search + Active Filter Badges */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smartphone model, camera, specs..."
                className="w-full bg-[#181820] border border-white/10 rounded-xl py-2 pl-8 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Active Filters Reset Shortcut */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
                </span>
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] font-semibold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* 5. Product Cards Grid or Loading Skeletons */}
        {isLoadingCatalog ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-[#0E0E12] border border-white/10 p-4 space-y-3"
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
          <div className="py-20 text-center space-y-4 rounded-none bg-[#0E0E12] border border-white/10 p-8">
            <p className="text-zinc-300 font-bold text-base font-mono">[ NO SPECIFICATIONS MATCHED ]</p>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              Try adjusting your max price slider, clearing the storage variant, or searching for another brand.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest cursor-pointer"
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
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-400 text-xs">
          Loading Catalog...
        </div>
      }
    >
      <PhonesCatalogContent />
    </Suspense>
  );
}
