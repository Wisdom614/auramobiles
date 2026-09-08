"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
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

const DEFAULT_MIN_PRICE = 50000;
const DEFAULT_MAX_PRICE = 1000000;

const PRICE_PRESETS = [
  { id: "all", label: "Default (50K – 1M)", min: DEFAULT_MIN_PRICE, max: DEFAULT_MAX_PRICE },
  { id: "under-300", label: "Under 300,000 FCFA", min: 50000, max: 300000 },
  { id: "300-600", label: "300,000 – 600,000 FCFA", min: 300000, max: 600000 },
  { id: "600-1m", label: "600,000 – 1,000,000 FCFA", min: 600000, max: 1000000 },
  { id: "above-1m", label: "1,000,000+ FCFA (Ultra)", min: 1000000, max: 2500000 },
];

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

  // Compact Price Dropdown state & ref
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const priceDropdownRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
        setIsPriceDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPriceDropdownOpen(false);
      }
    }
    if (isPriceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPriceDropdownOpen]);

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

  // Compute live preset matches
  const presetCounts = useMemo(() => {
    return PRICE_PRESETS.reduce((acc, preset) => {
      acc[preset.id] = phonesList.filter((p) => {
        const brandMatch = selectedBrand === "all" || p.brand.toLowerCase() === selectedBrand.toLowerCase();
        const priceMatch = p.basePrice >= preset.min && p.basePrice <= preset.max;
        return brandMatch && priceMatch;
      }).length;
      return acc;
    }, {} as Record<string, number>);
  }, [phonesList, selectedBrand]);

  // Count active non-default filters
  const isPriceFiltered =
    minPrice !== DEFAULT_MIN_PRICE || maxPrice !== DEFAULT_MAX_PRICE;

  const priceButtonLabel = useMemo(() => {
    if (!isPriceFiltered) return "50,000 – 1,000,000 FCFA";
    if (minPrice === 50000 && maxPrice === 300000) return "Under 300K";
    if (minPrice === 300000 && maxPrice === 600000) return "300K – 600K";
    if (minPrice === 600000 && maxPrice === 1000000) return "600K – 1M";
    if (minPrice === 1000000 && maxPrice >= 2500000) return "1M+ FCFA";
    return `${(minPrice / 1000).toLocaleString()}K – ${(maxPrice / 1000).toLocaleString()}K`;
  }, [isPriceFiltered, minPrice, maxPrice]);

  const handleSelectPreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setInputMin(String(min));
    setInputMax(String(max));
  };

  const handleResetPrice = () => {
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setInputMin("50000");
    setInputMax("1000000");
  };

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
    handleResetPrice();
    setSearchQuery("");
    setSortBy("featured");
    setIsPriceDropdownOpen(false);
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
              Official boutique warranty, sealed units, and express delivery nationwide across Cameroon.
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

        {/* 3. PROMINENT FILTER CONTROL CENTER (BRAND SELECTION + COMPACT PRICE DROPDOWN) */}
        <div className="bg-[#0E0E12] border border-white/10 p-4 sm:p-5 shadow-2xl relative rounded-none space-y-4">
          {/* Architectural corner crosshairs */}
          <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>
          <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>
          <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>
          <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px] select-none">+</span>

          {/* Control Bar: Brand Label + Compact Price Dropdown Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] text-white uppercase tracking-widest font-bold">
                BROWSE BY BRAND
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-[10px] text-zinc-400 uppercase hidden sm:inline">
                {selectedBrand === "all" ? "ALL BRANDS" : selectedBrand.toUpperCase()}
              </span>
            </div>

            {/* COMPACT PRICE DROPDOWN FILTER BUTTON */}
            <div className="relative" ref={priceDropdownRef}>
              <button
                type="button"
                onClick={() => setIsPriceDropdownOpen((prev) => !prev)}
                className={`px-3 py-1.5 sm:py-2 text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer rounded-none ${
                  isPriceFiltered
                    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] shadow-sm shadow-amber-500/10"
                    : "bg-[#141419] border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
                }`}
                title="Click to filter by price range"
              >
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="uppercase">
                  Price: <strong className={isPriceFiltered ? "text-white" : "text-[#D4AF37]"}>{priceButtonLabel}</strong>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isPriceDropdownOpen ? "rotate-180 text-[#D4AF37]" : "text-zinc-400"
                  }`}
                />
              </button>

              {/* FLOATING LUXURY DROPDOWN POPOVER */}
              {isPriceDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[340px] sm:w-[410px] max-w-[92vw] bg-[#0E0E12] border border-[#D4AF37]/60 shadow-2xl z-50 p-4 sm:p-5 text-white font-mono space-y-4 animate-in fade-in zoom-in-95 duration-150">
                  {/* Viewfinder crosshairs */}
                  <span className="absolute top-1 left-1 text-[8px] text-[#D4AF37] select-none">+</span>
                  <span className="absolute top-1 right-1 text-[8px] text-[#D4AF37] select-none">+</span>
                  <span className="absolute bottom-1 left-1 text-[8px] text-[#D4AF37] select-none">+</span>
                  <span className="absolute bottom-1 right-1 text-[8px] text-[#D4AF37] select-none">+</span>

                  {/* Popover Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">
                        [ PRICE RANGE FILTER ]
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {formatCFA(minPrice)} – {maxPrice >= 2500000 ? "Any (2.5M+)" : formatCFA(maxPrice)}
                      </span>
                    </div>

                    {isPriceFiltered && (
                      <button
                        type="button"
                        onClick={handleResetPrice}
                        className="text-[10px] text-zinc-400 hover:text-white hover:underline uppercase transition cursor-pointer"
                      >
                        [ Reset ]
                      </button>
                    )}
                  </div>

                  {/* Fast Selection Brackets */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
                      CURATED PRICE BRACKETS:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {PRICE_PRESETS.map((preset) => {
                        const isActive = minPrice === preset.min && maxPrice === preset.max;
                        const count = presetCounts[preset.id] || 0;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset.min, preset.max)}
                            className={`px-2.5 py-2 text-left text-xs border transition-colors flex items-center justify-between cursor-pointer rounded-none ${
                              isActive
                                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold"
                                : "bg-black/60 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                            }`}
                          >
                            <span className="truncate text-[11px]">{preset.label}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 shrink-0 ${
                                isActive ? "bg-[#D4AF37] text-black font-bold" : "bg-white/5 text-zinc-500"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Range Form */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">
                      OR ENTER CUSTOM RANGE (FCFA):
                    </span>
                    <form onSubmit={(e) => { handleApplyCustomPrice(e); setIsPriceDropdownOpen(false); }} className="space-y-3">
                      <div className="flex items-center gap-2">
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
                            className="w-full bg-black border border-white/20 pl-10 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                          />
                        </div>

                        <span className="text-zinc-500 select-none font-bold">—</span>

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
                            className="w-full bg-black border border-white/20 pl-10 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[10px] text-zinc-400">
                          {filteredPhones.length} matching units
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 gold-gradient-bg text-black font-extrabold text-[11px] uppercase tracking-wider hover:opacity-95 transition cursor-pointer"
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsPriceDropdownOpen(false)}
                            className="px-3 py-1.5 bg-white/5 border border-white/15 hover:border-white/30 text-white text-[11px] uppercase transition cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Brand Buttons Row */}
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
