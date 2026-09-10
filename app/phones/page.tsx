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
  ChevronDown,
  ArrowUpDown,
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
  { id: "all", label: "Any Price", min: DEFAULT_MIN_PRICE, max: DEFAULT_MAX_PRICE },
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

  // Price range states
  const [minPrice, setMinPrice] = useState<number>(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);
  const [inputMin, setInputMin] = useState<string>("50000");
  const [inputMax, setInputMax] = useState<string>("1000000");

  // Search and Sort
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");

  // Comprehensive Filter Drawer Modal state (Bottom sheet on mobile, drawer on desktop)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Close filter drawer on ESC key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFilterDrawerOpen(false);
      }
    }
    if (isFilterDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent background body scroll when drawer is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFilterDrawerOpen]);

  useEffect(() => {
    async function loadCatalog() {
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
    
    setIsLoadingCatalog(true);
    loadCatalog();

    const handleFocus = () => {
      loadCatalog();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  // Update category & brand from URL query changes
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

  // Check if price is actively filtered
  const isPriceFiltered =
    minPrice !== DEFAULT_MIN_PRICE || maxPrice !== DEFAULT_MAX_PRICE;

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

  const activeFiltersCount = [
    selectedBrand !== "all",
    selectedCategory !== "all",
    selectedCondition !== "all",
    selectedStorage !== "all",
    isPriceFiltered,
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedStorage("all");
    handleResetPrice();
    setSearchQuery("");
    setSortBy("featured");
    setIsFilterDrawerOpen(false);
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
          if (selectedCondition === "new" && phone.condition !== "Brand New") {
            return false;
          }
          if (
            selectedCondition === "preowned" &&
            phone.condition !== "Pre-Owned (UK / US Used)"
          ) {
            return false;
          }
          if (
            selectedCondition === "refurbished" &&
            phone.condition !== "Certified Refurbished"
          ) {
            return false;
          }
          if (
            selectedCondition === "openbox" &&
            phone.condition !== "Open Box"
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

        // 5. Price Range Filter
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

  // Readable category label
  const activeCategoryLabel = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategory)?.label || "All Devices";
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* 1. HEADER SECTION (Clean, spacious luxury typography) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
              Curated Collection • Nationwide Delivery
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              All Smartphones
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
              Brand new sealed &amp; certified pre-owned phones with warranty. Tested and delivered to your doorstep.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs self-start sm:self-auto">
            <span className="text-zinc-400 text-xs font-mono">
              <strong className="text-[#D4AF37] font-bold">{filteredPhones.length}</strong> Phones Available
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[#D4AF37] font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. STREAMLINED PRIMARY CONTROL BAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          
          {/* Instant Search Bar (Left) */}
          <div className="md:col-span-6 lg:col-span-7 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search smartphone model, camera specs..."
              className="w-full bg-[#0E0E12] border border-white/15 py-2.5 pl-10 pr-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] rounded-none font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Trigger & Sort Dropdown (Right) */}
          <div className="md:col-span-6 lg:col-span-5 flex items-center gap-2">
            
            {/* Filter & Refine Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`flex-1 py-2.5 px-3.5 text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer rounded-none select-none ${
                activeFiltersCount > 0
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                  : "bg-[#0E0E12] border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase tracking-wider">Filters &amp; Refine</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#D4AF37] text-black text-[10px] font-black rounded-none">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 w-36 sm:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-[#0E0E12] border border-white/15 py-2.5 pl-3 pr-8 text-xs text-zinc-200 focus:outline-none focus:border-[#D4AF37] rounded-none font-mono cursor-pointer transition-colors uppercase font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* 3. HORIZONTAL QUICK BRAND SELECTOR PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
          {/* All Brands Pill */}
          <button
            onClick={() => setSelectedBrand("all")}
            className={`px-3 py-1.5 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 rounded-none border cursor-pointer ${
              selectedBrand === "all"
                ? "bg-white text-black border-white shadow-sm"
                : "bg-[#0E0E12] text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
            }`}
          >
            <span>ALL BRANDS</span>
            <span className={`text-[10px] px-1.5 py-0.2 ${selectedBrand === "all" ? "bg-black/10 text-black font-bold" : "bg-white/5 text-zinc-500"}`}>
              {phonesList.length}
            </span>
          </button>

          {/* Individual Brand Pills */}
          {BRANDS.map((brand) => {
            const isSelected = selectedBrand.toLowerCase() === brand.id.toLowerCase();
            const count = brandCounts[brand.id.toLowerCase()] || 0;
            return (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.id)}
                className={`px-3 py-1.5 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 rounded-none border cursor-pointer ${
                  isSelected
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                    : "bg-[#0E0E12] text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
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

        {/* 4. DISMISSIBLE ACTIVE FILTER CHIPS (Progressive Disclosure) */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 font-mono text-xs animate-in fade-in duration-150">
            <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mr-1">
              Active Filters:
            </span>

            {/* Category Chip */}
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-2 py-1 bg-[#141419] border border-white/20 text-[#D4AF37] text-[11px] flex items-center gap-1.5 hover:bg-white/10 transition"
              >
                <span>Collection: {activeCategoryLabel}</span>
                <X className="w-3 h-3 text-zinc-400 hover:text-white" />
              </button>
            )}

            {/* Brand Chip */}
            {selectedBrand !== "all" && (
              <button
                onClick={() => setSelectedBrand("all")}
                className="px-2 py-1 bg-[#141419] border border-white/20 text-[#D4AF37] text-[11px] flex items-center gap-1.5 hover:bg-white/10 transition"
              >
                <span>Brand: {selectedBrand.toUpperCase()}</span>
                <X className="w-3 h-3 text-zinc-400 hover:text-white" />
              </button>
            )}

            {/* Condition Chip */}
            {selectedCondition !== "all" && (
              <button
                onClick={() => setSelectedCondition("all")}
                className="px-2 py-1 bg-[#141419] border border-white/20 text-[#D4AF37] text-[11px] flex items-center gap-1.5 hover:bg-white/10 transition"
              >
                <span>Condition: {selectedCondition === "new" ? "Brand New" : "Certified Pre-Owned"}</span>
                <X className="w-3 h-3 text-zinc-400 hover:text-white" />
              </button>
            )}

            {/* Storage Chip */}
            {selectedStorage !== "all" && (
              <button
                onClick={() => setSelectedStorage("all")}
                className="px-2 py-1 bg-[#141419] border border-white/20 text-[#D4AF37] text-[11px] flex items-center gap-1.5 hover:bg-white/10 transition"
              >
                <span>Storage: {selectedStorage}</span>
                <X className="w-3 h-3 text-zinc-400 hover:text-white" />
              </button>
            )}

            {/* Price Chip */}
            {isPriceFiltered && (
              <button
                onClick={handleResetPrice}
                className="px-2 py-1 bg-[#141419] border border-white/20 text-[#D4AF37] text-[11px] flex items-center gap-1.5 hover:bg-white/10 transition"
              >
                <span>Price: {formatCFA(minPrice)} – {maxPrice >= 2500000 ? "Any" : formatCFA(maxPrice)}</span>
                <X className="w-3 h-3 text-zinc-400 hover:text-white" />
              </button>
            )}

            {/* Search Query Chip */}
            {searchQuery.trim() !== "" && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-2 py-1 bg-[#141419] border border-white/20 text-[#D4AF37] text-[11px] flex items-center gap-1.5 hover:bg-white/10 transition"
              >
                <span>Search: &quot;{searchQuery}&quot;</span>
                <X className="w-3 h-3 text-zinc-400 hover:text-white" />
              </button>
            )}

            {/* Clear All Action */}
            <button
              onClick={resetAllFilters}
              className="text-[10px] text-zinc-400 hover:text-[#D4AF37] hover:underline uppercase font-bold tracking-wider ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 5. FILTER & REFINE DRAWER MODAL (Bottom Sheet on Mobile, Luxury Side Drawer on Desktop) */}
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsFilterDrawerOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Container (Mobile: Bottom Sheet; Desktop: Right Drawer) */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filter and Refine Catalog"
              className="relative z-50 w-full md:max-w-md bg-[#0E0E12] border-t-2 md:border-t-0 md:border-l border-[#D4AF37] shadow-2xl flex flex-col max-h-[88vh] md:max-h-screen md:h-full mt-auto md:mt-0 rounded-t-2xl md:rounded-none animate-in slide-in-from-bottom md:slide-in-from-right duration-250 font-sans"
            >
              {/* Mobile Drag Indicator */}
              <div className="md:hidden flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 bg-white/25 rounded-full" />
              </div>

              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                    Filter &amp; Refine
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-[11px] text-[#D4AF37] hover:underline uppercase transition cursor-pointer font-bold"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-7 h-7 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono text-xs">
                
                {/* Section 1: Curated Collections / Categories */}
                <div className="space-y-2.5">
                  <span className="text-[10.5px] uppercase text-[#D4AF37] tracking-wider font-bold block">
                    Curated Collections
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-2.5 text-left border transition-all flex items-center gap-2 rounded-none cursor-pointer ${
                            isSelected
                              ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold shadow-sm shadow-amber-500/10"
                              : "bg-black/60 border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#D4AF37]" : "text-zinc-500"}`} />
                          <span className="truncate text-[11px] uppercase tracking-wide">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Condition */}
                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  <span className="text-[10.5px] uppercase text-[#D4AF37] tracking-wider font-bold block">
                    Device Condition
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: "All Units", val: "all" },
                      { label: "Brand New Sealed", val: "new" },
                      { label: "Pre-Owned (UK Used)", val: "preowned" },
                      { label: "Refurbished", val: "refurbished" },
                      { label: "Open Box", val: "openbox" },
                    ].map((c) => {
                      const isSelected = selectedCondition === c.val;
                      return (
                        <button
                          key={c.val}
                          type="button"
                          onClick={() => setSelectedCondition(c.val)}
                          className={`py-2 px-2 text-center text-xs font-bold border transition-colors rounded-none cursor-pointer uppercase truncate ${
                            isSelected
                              ? "bg-[#D4AF37]/20 text-white border-[#D4AF37]"
                              : "bg-black/60 text-zinc-400 hover:text-white border-white/10 hover:border-white/25"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Storage Capacity */}
                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  <span className="text-[10.5px] uppercase text-[#D4AF37] tracking-wider font-bold block">
                    Storage Capacity
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {STORAGE_OPTIONS.map((size) => {
                      const isSelected = selectedStorage === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedStorage(size)}
                          className={`px-3 py-1.5 text-xs font-bold border transition-colors rounded-none cursor-pointer uppercase ${
                            isSelected
                              ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                              : "bg-black/60 text-zinc-400 hover:text-white border-white/10 hover:border-white/25"
                          }`}
                        >
                          {size === "all" ? "All Sizes" : size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Price Range Filter */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] uppercase text-[#D4AF37] tracking-wider font-bold block">
                      Price Range (FCFA)
                    </span>
                    {isPriceFiltered && (
                      <button
                        type="button"
                        onClick={handleResetPrice}
                        className="text-[10px] text-zinc-400 hover:text-white uppercase underline cursor-pointer"
                      >
                        Reset Price
                      </button>
                    )}
                  </div>

                  {/* Preset Price Brackets */}
                  <div className="grid grid-cols-1 gap-1.5">
                    {PRICE_PRESETS.map((preset) => {
                      const isActive = minPrice === preset.min && maxPrice === preset.max;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.min, preset.max)}
                          className={`px-3 py-2 text-left text-xs border transition-colors flex items-center justify-between cursor-pointer rounded-none ${
                            isActive
                              ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold"
                              : "bg-black/60 border-white/10 text-zinc-400 hover:text-white hover:border-white/25"
                          }`}
                        >
                          <span className="text-[11px]">{preset.label}</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Price Range Inputs */}
                  <form onSubmit={handleApplyCustomPrice} className="space-y-2 pt-2">
                    <span className="text-[9.5px] text-zinc-400 uppercase tracking-wider block">
                      Custom Range (FCFA):
                    </span>
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
                          className="w-full bg-black border border-white/20 pl-9 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
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
                          className="w-full bg-black border border-white/20 pl-9 pr-2 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] rounded-none font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>

              </div>

              {/* Sticky Footer Apply Button */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/90 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-3 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition cursor-pointer font-mono shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Show {filteredPhones.length} Phones</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 6. PRODUCT CARDS GRID */}
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

            <p className="text-zinc-200 font-bold text-base uppercase tracking-wide">
              No Phones Match Your Filters
            </p>
            <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed">
              No smartphones found for {selectedBrand !== "all" ? selectedBrand : "current selection"} within{" "}
              {formatCFA(minPrice)} to {formatCFA(maxPrice)}. Try broadening your price range or clearing active filters.
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
          Loading Phone Catalog...
        </div>
      }
    >
      <PhonesCatalogContent />
    </Suspense>
  );
}
