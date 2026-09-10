"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  Package,
  MessageCircle,
  Cpu,
  Camera,
  BatteryCharging,
  Smartphone,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useSettings } from "@/lib/store/settings-context";
import { ProductCard } from "@/components/product/product-card";
import { StickyMobilePdpBar } from "@/components/product/sticky-mobile-pdp-bar";
import { ProductReviewsSection } from "@/components/reviews/product-reviews-section";
import { useReviews } from "@/lib/store/reviews-context";
import { getPhoneBySlugFromDB, getPhonesFromDB } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PhoneDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { settings } = useSettings();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getPhoneStats } = useReviews();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [relatedPhones, setRelatedPhones] = useState<Phone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedStorageIdx, setSelectedStorageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Swipe & Drag gesture state for gallery
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Load product and related items strictly from database
  useEffect(() => {
    let isMounted = true;

    async function loadPhoneFromDB() {
      setIsLoading(true);
      try {
        const dbPhone = await getPhoneBySlugFromDB(resolvedParams.slug);

        if (isMounted && dbPhone) {
          setPhone(dbPhone);

          const allDbPhones = await getPhonesFromDB();
          if (isMounted && allDbPhones) {
            const related = allDbPhones
              .filter(
                (p) =>
                  p.id !== dbPhone.id &&
                  (p.brand.toLowerCase() === dbPhone.brand.toLowerCase() ||
                    p.category === dbPhone.category)
              )
              .slice(0, 4);
            setRelatedPhones(related);
          }
        } else if (isMounted) {
          const allDbPhones = await getPhonesFromDB();
          if (isMounted && allDbPhones) {
            const match = allDbPhones.find(
              (p) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug
            );
            if (match) {
              setPhone(match);
              const related = allDbPhones
                .filter(
                  (p) =>
                    p.id !== match.id &&
                    (p.brand.toLowerCase() === match.brand.toLowerCase() ||
                      p.category === match.category)
                )
                .slice(0, 4);
              setRelatedPhones(related);
            } else {
              setPhone(null);
            }
          } else {
            setPhone(null);
          }
        }
      } catch {
        if (isMounted) setPhone(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPhoneFromDB();

    return () => {
      isMounted = false;
    };
  }, [resolvedParams.slug]);

  // Always reset scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (!isLoading && phone) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [isLoading, phone]);

  const activeStorage = phone?.storageVariants?.[selectedStorageIdx] || phone?.storageVariants?.[0] || {
    id: "default",
    size: "Standard",
    price: phone?.basePrice || 0,
    stock: 5,
  };

  const currentColor = phone?.colorVariants?.[selectedColorIdx] || phone?.colorVariants?.[0] || {
    id: "standard",
    name: "Factory Finish",
    hex: "#9A958E",
    image: phone?.images?.[0] || "/placeholder.png",
  };

  // Compile clean images list
  const imagesList = useMemo(() => {
    if (!phone) return [];
    const list: string[] = [];
    if (Array.isArray(phone.images) && phone.images.length > 0) {
      phone.images.forEach((img) => {
        if (img && img.trim() && !list.includes(img.trim())) list.push(img.trim());
      });
    }
    if (list.length === 0 && currentColor.image) {
      list.push(currentColor.image);
    }
    return list;
  }, [phone, currentColor]);

  const goToNextImage = () => {
    if (imagesList.length <= 1) return;
    setSelectedImageIdx((prev) => (prev + 1) % imagesList.length);
  };

  const goToPrevImage = () => {
    if (imagesList.length <= 1) return;
    setSelectedImageIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (imagesList.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartX === null || touchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (e.cancelable) e.preventDefault();
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 45;
    if (dragOffset > threshold) {
      goToPrevImage();
    } else if (dragOffset < -threshold) {
      goToNextImage();
    }
    setDragOffset(0);
    setIsDragging(false);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imagesList.length <= 1) return;
    setTouchStartX(e.clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    const deltaX = e.clientX - touchStartX;
    setDragOffset(deltaX);
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    const threshold = 50;
    if (dragOffset > threshold) {
      goToPrevImage();
    } else if (dragOffset < -threshold) {
      goToNextImage();
    }
    setDragOffset(0);
    setIsDragging(false);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (imagesList.length <= 1) return;
      if (e.key === "ArrowLeft") {
        goToPrevImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imagesList.length]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="h-4 w-48 bg-white/10 rounded-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7 aspect-square rounded-none bg-[#121217] border border-white/10" />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-4 w-32 bg-[#D4AF37]/20 rounded-none" />
              <div className="h-10 w-3/4 bg-white/10 rounded-none" />
              <div className="h-4 w-full bg-white/5 rounded-none" />
              <div className="h-28 bg-[#121217] rounded-none border border-white/10" />
              <div className="h-14 bg-white/5 rounded-none" />
              <div className="h-14 bg-white/10 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="p-8 border border-white/10 bg-[#121217] max-w-md w-full rounded-none">
          <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-bold block mb-2">
            Phone Not Available
          </span>
          <h1 className="text-2xl font-bold text-white mb-2 font-sans">Smartphone Not Found</h1>
          <p className="text-xs text-zinc-400 mb-6">
            The requested smartphone was not found in our current store inventory.
          </p>
          <Link
            href="/phones"
            className="w-full inline-block py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider rounded-none hover:opacity-90 transition-all text-center font-mono"
          >
            Browse All Phones
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = activeStorage.price || phone.basePrice;
  const inWish = isInWishlist(phone.id);
  const hasSavings = phone.originalPrice && phone.originalPrice > currentPrice && phone.originalPrice <= currentPrice * 2.5;
  const savingsAmount = hasSavings ? (phone.originalPrice! - currentPrice) : 0;
  const savingsPercent = hasSavings ? Math.round((savingsAmount / phone.originalPrice!) * 100) : 0;

  const handleAddToCart = () => {
    addItem(phone, activeStorage, currentColor, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(phone, activeStorage, currentColor, 1, false);
    router.push("/checkout");
  };

  const handleCopyShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Breadcrumbs Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <nav className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono tracking-wider overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/phones" className="hover:text-white transition-colors">All Phones</Link>
            <span>/</span>
            <Link href={`/phones?brand=${phone.brand}`} className="hover:text-white transition-colors uppercase">
              {phone.brand}
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold truncate uppercase">{phone.name}</span>
          </nav>

          <button
            onClick={handleCopyShare}
            className="p-1.5 px-2.5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 rounded-none transition-colors text-xs flex items-center gap-1.5 font-mono shrink-0 ml-2 cursor-pointer"
            title="Share device link"
          >
            {copiedLink ? (
              <span className="text-emerald-400 text-[10px] font-bold">LINK COPIED</span>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px] font-bold">SHARE</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Image Canvas & Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            
            {/* Main Showcase Canvas */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#0D0D10] border border-white/15 overflow-hidden rounded-none shadow-2xl group select-none touch-pan-y ${
                imagesList.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            >
              {/* Technical Viewfinder Corner Crosshairs */}
              <span className="absolute top-2 left-2 text-[10px] font-mono text-zinc-600 select-none pointer-events-none z-10">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-zinc-600 select-none pointer-events-none z-10">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-zinc-600 select-none pointer-events-none z-10">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-zinc-600 select-none pointer-events-none z-10">+</span>

              {/* Condition Tag */}
              <div className="absolute top-3 left-4 flex items-center gap-2 z-10 pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold bg-black/85 border border-[#D4AF37]/40 px-2.5 py-1">
                  {phone.condition === "Certified Refurbished" ? "Clean Pre-Owned (UK Used)" : "100% Brand New Sealed"}
                </span>
                {phone.isNew && (
                  <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold bg-[#D4AF37]/25 border border-white/20 px-2 py-1">
                    Flagship Release
                  </span>
                )}
              </div>

              {/* Sliding Image Track */}
              <div
                className={`flex w-full h-full ${
                  isDragging ? "transition-none" : "transition-transform duration-300 ease-out"
                }`}
                style={{
                  transform: `translateX(calc(-${selectedImageIdx * 100}% + ${dragOffset}px))`,
                }}
              >
                {imagesList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full shrink-0 flex items-center justify-center p-8 sm:p-12 relative select-none"
                  >
                    <img
                      src={imgUrl}
                      alt={`${phone.name} view ${idx + 1}`}
                      draggable={false}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_30px_40px_rgba(0,0,0,0.95)] pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Chevrons */}
              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-black/75 hover:bg-[#D4AF37] hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 rounded-none shadow-lg"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-black/75 hover:bg-[#D4AF37] hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 rounded-none shadow-lg"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Pagination Dots Indicator */}
              {imagesList.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/80 px-2.5 py-1 border border-white/10 backdrop-blur-sm rounded-none">
                  {imagesList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIdx(idx);
                      }}
                      className={`h-1.5 transition-all duration-300 cursor-pointer rounded-none ${
                        selectedImageIdx === idx
                          ? "w-5 bg-[#D4AF37]"
                          : "w-2 bg-white/40 hover:bg-white/80"
                      }`}
                      aria-label={`Jump to photo ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Frame Badge */}
              {imagesList.length > 1 && (
                <div className="absolute bottom-3 right-4 px-2 py-0.5 bg-black/85 border border-white/15 text-[9px] font-mono text-zinc-400 rounded-none z-10 flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[#D4AF37] hidden sm:inline">SWIPE ◄►</span>
                  <span>Photo {selectedImageIdx + 1} of {imagesList.length}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative aspect-square bg-[#121217] border p-2 flex items-center justify-center transition-all cursor-pointer rounded-none ${
                      selectedImageIdx === idx
                        ? "border-[#D4AF37] ring-1 ring-[#D4AF37] bg-white/5 opacity-100"
                        : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${phone.name} angle ${idx + 1}`}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Technical Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-xs">
              <div className="p-3.5 bg-[#0F0F13] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">WARRANTY</span>
                  <span className="text-white font-medium text-[11px]">{phone.warranty}</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#0F0F13] flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">EXPRESS DELIVERY</span>
                  <span className="text-white font-medium text-[11px]">Buea, Douala &amp; Nationwide</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#0F0F13] flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">EXCHANGE POLICY</span>
                  <span className="text-white font-medium text-[11px]">7-Day Defect Exchange</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Configuration & Purchasing (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Header: Brand, Title, Rating */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  {phone.brand.toUpperCase()} • Official Flagship
                </span>
                
                {(() => {
                  const stats = getPhoneStats(phone.id);
                  const displayRating = stats.totalReviews > 0 ? stats.averageRating : phone.rating;
                  const displayReviewCount = stats.totalReviews > 0 ? stats.totalReviews : phone.reviewCount;
                  return (
                    <a
                      href="#reviews-section"
                      className="flex items-center gap-1 text-xs text-amber-300 font-mono hover:text-[#D4AF37] transition cursor-pointer"
                      title="Jump to Customer Reviews"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span className="font-bold">{displayRating}</span>
                      <span className="text-zinc-500 font-sans">({displayReviewCount} reviews)</span>
                    </a>
                  );
                })()}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {phone.name}
              </h1>

              <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
                {phone.tagline}
              </p>
            </div>

            {/* Pricing Matrix Block */}
            <div className="border border-white/15 bg-[#121217] p-5 rounded-none flex items-baseline justify-between">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block font-bold">
                  STORE PRICE (FCFA)
                </span>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-mono tracking-tight">
                    {formatCFA(currentPrice)}
                  </span>
                  {hasSavings && (
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      {formatCFA(phone.originalPrice!)}
                    </span>
                  )}
                </div>
                {hasSavings && (
                  <div className="mt-1.5">
                    <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold uppercase inline-block">
                      SAVE {formatCFA(savingsAmount)} (-{savingsPercent}%)
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                {activeStorage.stock > 0 ? (
                  activeStorage.stock <= 3 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                      <span className="w-2 h-2 rounded-none bg-amber-400 animate-pulse" />
                      <span>Only {activeStorage.stock} Left</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase">
                      <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                      <span>{activeStorage.stock} In Stock</span>
                    </span>
                  )
                ) : (
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                    Sold Out
                  </span>
                )}
                <span className="text-[10px] text-zinc-400 block font-sans mt-0.5">
                  Buea Showroom Vault
                </span>
              </div>
            </div>

            {/* Instant Hardware Specs Matrix (4 Pillars) */}
            {phone.specs && (
              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 text-xs font-mono">
                {phone.specs.processor && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Cpu className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase tracking-wider font-bold">PROCESSOR</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate">{phone.specs.processor}</p>
                  </div>
                )}
                {phone.specs.rearCamera && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Camera className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase tracking-wider font-bold">MAIN CAMERA</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate">{phone.specs.rearCamera.split("+")[0]}</p>
                  </div>
                )}
                {phone.specs.battery && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase tracking-wider font-bold">BATTERY</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate">{phone.specs.battery}</p>
                  </div>
                )}
                {phone.specs.screen && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase tracking-wider font-bold">DISPLAY</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate">{phone.specs.screen.split(" ")[0]} OLED</p>
                  </div>
                )}
              </div>
            )}

            {/* Storage Capacity Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Select Storage:
                </span>
                <span className="text-xs text-[#D4AF37] font-mono font-bold">
                  {activeStorage.size}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {phone.storageVariants.map((variant, idx) => {
                  const isSelected = selectedStorageIdx === idx;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedStorageIdx(idx)}
                      className={`p-3 border text-left transition-all cursor-pointer rounded-none relative ${
                        isSelected
                          ? "bg-[#181820] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-sm shadow-[#D4AF37]/10"
                          : "bg-[#101015] border-white/10 hover:border-white/25 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black font-mono text-white block">
                          {variant.size}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-none" />
                        )}
                      </div>
                      <span className="text-[11px] text-[#D4AF37] font-mono font-bold block mt-1">
                        {formatCFA(variant.price)}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono block mt-0.5 uppercase">
                        {variant.stock > 0 ? `${variant.stock} in stock` : "Sold Out"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Finish Selector */}
            {phone.colorVariants && phone.colorVariants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Select Color Finish:
                  </span>
                  <span className="text-xs text-zinc-300 font-mono font-semibold">
                    {currentColor.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {phone.colorVariants.map((color, idx) => {
                    const isSelected = selectedColorIdx === idx;
                    return (
                      <button
                        key={color.id || idx}
                        onClick={() => {
                          setSelectedColorIdx(idx);
                          if (color.image) {
                            const imgIdx = imagesList.indexOf(color.image);
                            if (imgIdx !== -1) setSelectedImageIdx(imgIdx);
                          }
                        }}
                        className={`p-2 border text-left transition-all cursor-pointer rounded-none flex items-center gap-2 ${
                          isSelected
                            ? "bg-[#181820] border-[#D4AF37] ring-1 ring-[#D4AF37]"
                            : "bg-[#101015] border-white/10 hover:border-white/25 text-zinc-300"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-none border border-white/20 shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-200">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Acquisition & Order CTAs */}
            <div id="main-pdp-buy-box" className="space-y-2.5 pt-1">
              
              {/* Primary Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 gold-gradient-bg text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 rounded-none shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all cursor-pointer min-h-[50px] font-mono"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3] text-black" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* 1-Tap WhatsApp Fast Order */}
              <a
                href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                  `Hello ${settings.storeName}, I want to order the ${phone.name} (${activeStorage.size}, ${currentColor.name}) for ${formatCFA(
                    currentPrice
                  )}. Please confirm availability and delivery dispatch.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#0A1A10] hover:bg-[#0E2617] border border-[#25D366]/40 text-[#25D366] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-none transition-all min-h-[46px] font-mono"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp (Instant Reply &lt; 15 mins)</span>
              </a>

              {/* Secondary Row: Buy Now + Wishlist */}
              <div className="flex gap-2">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buy Now (Direct Checkout)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => toggleWishlist(phone.id)}
                  aria-label="Wishlist"
                  className={`px-4 py-3 border rounded-none transition-colors cursor-pointer ${
                    inWish
                      ? "bg-rose-950/40 border-rose-500 text-rose-400"
                      : "bg-[#121217] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWish ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>

              {/* Trade-In Hook */}
              <Link
                href={`/trade-in?target=${phone.slug}`}
                className="w-full py-3 px-4 bg-[#101016] hover:bg-[#161622] border border-[#D4AF37]/30 text-amber-200 text-xs font-mono flex items-center justify-between rounded-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Phone Swap: Trade in your old phone for this model</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>

              {/* Localized City Delivery Assurance Pill */}
              <div className="p-3 bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 flex items-start gap-2.5 rounded-none font-mono">
                <Truck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Fast Nationwide Delivery:</span>
                  <p className="text-zinc-400 text-[10px] mt-0.5 leading-normal font-sans">
                    Free pickup at Check Point Molyko, Buea • Same-day bike delivery in Buea/Limbe • 24h Express to Douala, Yaoundé &amp; all cities.
                  </p>
                </div>
              </div>

            </div>

            {/* Highlights Checklist */}
            {phone.highlights && phone.highlights.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] block font-bold">
                  Key Hardware Highlights
                </span>
                <div className="space-y-1.5 text-xs text-zinc-300 font-sans">
                  {phone.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 3. Technical Specifications Blueprint Grid */}
        <div className="mt-16 pt-10 border-t border-white/10 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest font-bold block mb-1">
                Full Specifications
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Technical Specifications Sheet
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              MODEL REF: {phone.slug.toUpperCase()}
            </span>
          </div>

          {/* Continuous Architectural Table with Exposed Gridlines */}
          <div className="border border-white/10 bg-[#0E0E12] rounded-none overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Left Spec Column */}
              <div className="divide-y divide-white/10 text-xs">
                {phone.specs &&
                  Object.entries(phone.specs)
                    .slice(0, Math.ceil(Object.keys(phone.specs).length / 2))
                    .map(([key, val], idx) => (
                      <div
                        key={key}
                        className={`p-3.5 flex items-baseline justify-between gap-4 ${
                          idx % 2 === 0 ? "bg-black/40" : "bg-[#0E0E12]"
                        }`}
                      >
                        <span className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-wider shrink-0 font-bold">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-white font-mono text-right text-xs">
                          {val}
                        </span>
                      </div>
                    ))}
              </div>

              {/* Right Spec Column */}
              <div className="divide-y divide-white/10 text-xs">
                {phone.specs &&
                  Object.entries(phone.specs)
                    .slice(Math.ceil(Object.keys(phone.specs).length / 2))
                    .map(([key, val], idx) => (
                      <div
                        key={key}
                        className={`p-3.5 flex items-baseline justify-between gap-4 ${
                          idx % 2 === 0 ? "bg-black/40" : "bg-[#0E0E12]"
                        }`}
                      >
                        <span className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-wider shrink-0 font-bold">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-white font-mono text-right text-xs">
                          {val}
                        </span>
                      </div>
                    ))}
              </div>

            </div>
          </div>

          {/* Box Contents */}
          {phone.boxContents && phone.boxContents.length > 0 && (
            <div className="p-5 border border-white/10 bg-[#0F0F14] rounded-none space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>What&apos;s Included in the Box</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-zinc-300">
                {phone.boxContents.map((item, i) => (
                  <div key={i} className="p-2.5 bg-[#14141A] border border-white/5 flex items-center gap-2 rounded-none">
                    <Check className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 4. Real Customer Reviews & Ratings Section */}
        <ProductReviewsSection phone={phone} />

        {/* 5. Related Phones Archive */}
        {relatedPhones.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10 space-y-5">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-mono">
                You May Also Like
              </h2>
              <Link href="/phones" className="text-xs font-mono text-[#D4AF37] hover:underline">
                View All Phones →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {relatedPhones.map((relPhone) => (
                <ProductCard key={relPhone.id} phone={relPhone} layout="grid" />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Persistent Mobile Action Bar on PDP Scroll */}
      <StickyMobilePdpBar
        phone={phone}
        selectedStorage={activeStorage}
        selectedColor={currentColor}
        triggerElementId="main-pdp-buy-box"
      />
    </div>
  );
}
