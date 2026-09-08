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
} from "lucide-react";
import { Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useSettings } from "@/lib/store/settings-context";
import { ProductCard } from "@/components/product/product-card";
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
        // 1. Fetch exact smartphone record from Supabase database
        const dbPhone = await getPhoneBySlugFromDB(resolvedParams.slug);

        if (isMounted && dbPhone) {
          setPhone(dbPhone);

          // 2. Fetch catalog from database to compute related models
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
          // Fallback: search all DB records for matching slug or name
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

  // Always reset scroll to the top upon route navigation or slug change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [resolvedParams.slug]);

  // Ensure scroll remains clean after data loading finishes
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

  // Compile exhaustive unique images list (from phone.images + any color variants)
  const imagesList = useMemo(() => {
    if (!phone) return [];
    const list: string[] = [];
    if (Array.isArray(phone.images)) {
      phone.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (Array.isArray(phone.colorVariants)) {
      phone.colorVariants.forEach((c) => {
        if (c.image && !list.includes(c.image)) list.push(c.image);
      });
    }
    if (list.length === 0) {
      list.push(currentColor.image || "/placeholder.png");
    }
    return list;
  }, [phone, currentColor.image]);

  // Ensure index stays valid if imagesList changes
  useEffect(() => {
    if (selectedImageIdx >= imagesList.length) {
      setSelectedImageIdx(0);
    }
  }, [imagesList.length, selectedImageIdx]);

  // Gallery Navigation Functions
  const goToNextImage = () => {
    if (imagesList.length <= 1) return;
    setSelectedImageIdx((prev) => (prev + 1) % imagesList.length);
  };

  const goToPrevImage = () => {
    if (imagesList.length <= 1) return;
    setSelectedImageIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  // Touch Swipe Handlers (mobile)
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
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;

    // Only drag horizontally if motion is mostly horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 40;
    if (dragOffset < -threshold) {
      goToNextImage();
    } else if (dragOffset > threshold) {
      goToPrevImage();
    }
    setDragOffset(0);
    setIsDragging(false);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Mouse Drag Handlers (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imagesList.length <= 1) return;
    setTouchStartX(e.clientX);
    setTouchStartY(e.clientY);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    const diffX = e.clientX - touchStartX;
    setDragOffset(diffX);
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    const threshold = 40;
    if (dragOffset < -threshold) {
      goToNextImage();
    } else if (dragOffset > threshold) {
      goToPrevImage();
    }
    setDragOffset(0);
    setIsDragging(false);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Keyboard navigation for image gallery
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

  // Loading Skeleton in Architectural Style
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
            [ ERROR // ITEM NOT IN ARCHIVE ]
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">Smartphone Not Found</h1>
          <p className="text-xs text-zinc-400 mb-6">
            The requested device was not found in our current boutique inventory.
          </p>
          <Link
            href="/phones"
            className="w-full inline-block py-3.5 gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider rounded-none hover:opacity-90 transition-all text-center"
          >
            Browse Smartphone Catalog
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = activeStorage.price || phone.basePrice;
  const inWish = isInWishlist(phone.id);

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

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. Breadcrumbs Navigation (Swiss Monospaced Style) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <nav className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono tracking-wider overflow-x-auto">
            <Link href="/" className="hover:text-white transition-colors">AURA</Link>
            <span>/</span>
            <Link href="/phones" className="hover:text-white transition-colors">ARCHIVE</Link>
            <span>/</span>
            <Link href={`/phones?brand=${phone.brand}`} className="hover:text-white transition-colors uppercase">
              {phone.brand}
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold truncate uppercase">{phone.name}</span>
          </nav>

          <button
            onClick={handleCopyShare}
            className="p-1.5 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 rounded-none transition-colors text-xs flex items-center gap-1.5 font-mono shrink-0 ml-2"
            title="Share device link"
          >
            {copiedLink ? (
              <span className="text-emerald-400 text-[10px]">LINK COPIED</span>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">SHARE</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Product Hero Grid (Strict Architectural 2-Column Structure) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Gallery with Straight Edges & Technical Crosshairs (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            
            {/* Main Showcase Canvas with Touch & Mouse Swipe Support */}
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

              {/* Technical Blueprint Micro-Label */}
              <div className="absolute top-3 left-4 flex items-center gap-2 z-10 pointer-events-none">
                <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold border border-[#D4AF37]/30 px-2 py-0.5 bg-black/60 backdrop-blur-sm">
                  {phone.condition === "Certified Refurbished" ? "CERTIFIED PRE-OWNED" : "SEALED HARDWARE"}
                </span>
                {phone.isNew && (
                  <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase font-bold border border-amber-400/30 px-2 py-0.5 bg-black/60 backdrop-blur-sm">
                    FLAGSHIP RELEASE
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

              {/* Navigation Chevrons (Previous / Next) */}
              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-black/70 hover:bg-[#D4AF37] hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 rounded-none shadow-lg"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-black/70 hover:bg-[#D4AF37] hover:text-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 rounded-none shadow-lg"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Pagination Dots Indicator */}
              {imagesList.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/70 px-2.5 py-1 border border-white/10 backdrop-blur-sm rounded-full">
                  {imagesList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIdx(idx);
                      }}
                      className={`h-1.5 transition-all duration-300 cursor-pointer rounded-full ${
                        selectedImageIdx === idx
                          ? "w-5 bg-[#D4AF37]"
                          : "w-1.5 bg-white/40 hover:bg-white/80"
                      }`}
                      aria-label={`Jump to photo ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Technical Frame Badge & Swipe Hint */}
              {imagesList.length > 1 && (
                <div className="absolute bottom-3 right-4 px-2 py-0.5 bg-black/80 border border-white/15 text-[9px] font-mono text-zinc-400 rounded-none z-10 flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[#D4AF37] hidden sm:inline">SWIPE ◄►</span>
                  <span>FRAME [ 0{selectedImageIdx + 1} / 0{imagesList.length} ]</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (Sharp Rectangular Tiles) */}
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

            {/* Guarantees Technical Strip (3 Equal Blocks) */}
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
                  <span className="text-white font-medium text-[11px]">Buea, Molyko • Nationwide Dispatch</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#0F0F13] flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">REPLACEMENT</span>
                  <span className="text-white font-medium text-[11px]">7-Day Hardware Exchange</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Technical Configuration & Acquisition (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header: Brand, Title, Rating */}
            <div className="border-b border-white/10 pb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  [ {phone.brand.toUpperCase()} // OFFICIAL SPECIFICATION ]
                </span>
                
                <div className="flex items-center gap-1 text-xs text-amber-300 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span className="font-bold">{phone.rating}</span>
                  <span className="text-zinc-500">({phone.reviewCount})</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {phone.name}
              </h1>

              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {phone.tagline}
              </p>
            </div>

            {/* Pricing Matrix Block (Straight-Edged Table Box) */}
            <div className="border border-white/15 bg-[#121217] p-5 rounded-none flex items-baseline justify-between">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest block font-bold">
                  BOUTIQUE SPECIFICATION PRICE
                </span>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-mono tracking-tight">
                    {formatCFA(currentPrice)}
                  </span>
                  {phone.originalPrice && phone.originalPrice > currentPrice && (
                    <span className="text-xs text-zinc-500 line-through font-mono">
                      {formatCFA(phone.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                  <span>{activeStorage.stock > 0 ? `${activeStorage.stock} UNITS READY` : "DEPLETED"}</span>
                </span>
                <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">
                  SHOWROOM DISPATCH READY
                </span>
              </div>
            </div>

            {/* Instant Hardware Specs Matrix (4 Pillars) */}
            {phone.specs && (
              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 text-xs">
                {phone.specs.processor && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Cpu className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold">PROCESSOR</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate font-mono">{phone.specs.processor}</p>
                  </div>
                )}
                {phone.specs.rearCamera && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Camera className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold">MAIN CAMERA</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate font-mono">{phone.specs.rearCamera.split("+")[0]}</p>
                  </div>
                )}
                {phone.specs.battery && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold">BATTERY CAPACITY</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate font-mono">{phone.specs.battery}</p>
                  </div>
                )}
                {phone.specs.screen && (
                  <div className="p-3 bg-[#0E0E12] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold">PANEL RESOLUTION</span>
                    </div>
                    <p className="text-[11px] font-bold text-white truncate font-mono">{phone.specs.screen.split(" ")[0]} OLED</p>
                  </div>
                )}
              </div>
            )}

            {/* Storage Capacity Selector (Sharp Modular Blocks) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  [ 01. SELECT STORAGE TIER ]
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
                          ? "bg-[#181820] border-[#D4AF37] ring-1 ring-[#D4AF37]"
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
                        {variant.stock > 0 ? `${variant.stock} UNITS` : "SOLD OUT"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Finish Selector (If available) */}
            {phone.colorVariants && phone.colorVariants.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    [ 02. FACTORY COLORWAY ]
                  </span>
                  <span className="text-xs text-zinc-300 font-mono font-semibold">
                    {currentColor.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {phone.colorVariants.map((color, idx) => {
                    const isSelected = selectedColorIdx === idx;
                    return (
                      <button
                        key={color.id || idx}
                        onClick={() => {
                          setSelectedColorIdx(idx);
                          // If color variant specifies an image, select it
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
                          className="w-4 h-4 rounded-none border border-white/20 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[11px] font-mono text-zinc-200">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Acquisition & Order CTAs (Strict Straight Edges) */}
            <div className="space-y-2.5 pt-2">
              
              {/* Primary Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 gold-gradient-bg text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 rounded-none shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all cursor-pointer min-h-[50px]"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3] text-black" />
                    <span>ADDED TO CART</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>ADD TO CART</span>
                  </>
                )}
              </button>

              {/* 1-Tap WhatsApp Fast Order */}
              <a
                href={`https://wa.me/${settings.whatsappCleanNumber || "237699442100"}?text=${encodeURIComponent(
                  `Hello ${settings.storeName}, I want to order the ${phone.name} (${activeStorage.size}, ${currentColor.name}) for ${formatCFA(
                    currentPrice
                  )}. Please confirm availability and delivery dispatch in Douala/Yaoundé.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#0A1A10] hover:bg-[#0E2617] border border-[#25D366]/40 text-[#25D366] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-none transition-all min-h-[46px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ORDER DIRECT VIA WHATSAPP (1-TAP)</span>
              </a>

              {/* Secondary Row: Buy Now / Direct Checkout + Wishlist */}
              <div className="flex gap-2">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>BUY NOW (CHECKOUT)</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => toggleWishlist(phone.id)}
                  aria-label="Wishlist"
                  className={`px-4 py-3 border rounded-none transition-colors ${
                    inWish
                      ? "bg-rose-950/40 border-rose-500 text-rose-400"
                      : "bg-[#121217] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWish ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>

              {/* Trade-In Hook (Sharp Blueprint Callout) */}
              <Link
                href={`/trade-in?target=${phone.slug}`}
                className="w-full py-3 px-4 bg-[#101016] hover:bg-[#161622] border border-[#D4AF37]/30 text-amber-200 text-xs font-mono flex items-center justify-between rounded-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>PHONE SWAP: Value your old phone toward this unit</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>

            </div>

            {/* Highlights Checklist */}
            {phone.highlights && phone.highlights.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                  [ ARCHITECTURAL HIGHLIGHTS ]
                </span>
                <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                  {phone.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold shrink-0">■</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 3. Technical Specifications Blueprint Grid (Swiss-Style Technical Table) */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-widest font-bold block mb-1">
                ENGINEERING SPECIFICATION ARCHIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Technical Specifications Sheet
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              SERIAL REF: {phone.slug.toUpperCase()}
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
                    .map(([key, val]) => (
                      <div key={key} className="p-3.5 flex items-baseline justify-between gap-4">
                        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider shrink-0 font-bold">
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
                    .map(([key, val]) => (
                      <div key={key} className="p-3.5 flex items-baseline justify-between gap-4">
                        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider shrink-0 font-bold">
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

          {/* Box Contents (Sharp Blueprint Checklist) */}
          {phone.boxContents && phone.boxContents.length > 0 && (
            <div className="p-5 border border-white/10 bg-[#0F0F14] rounded-none space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>OFFICIAL SEALED BOX CONTENTS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-zinc-300">
                {phone.boxContents.map((item, i) => (
                  <div key={i} className="p-2.5 bg-[#14141A] border border-white/5 flex items-center gap-2 rounded-none">
                    <span className="text-[#D4AF37] text-[10px]">✔</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 4. Related Phones Archive (Sharp Grid) */}
        {relatedPhones.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10 space-y-6">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-mono">
                [ YOU MAY ALSO CONSIDER // ALTERNATIVE HARDWARE ]
              </h2>
              <Link href="/phones" className="text-xs font-mono text-[#D4AF37] hover:underline">
                VIEW COMPLETE ARCHIVE →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedPhones.map((relPhone) => (
                <ProductCard key={relPhone.id} phone={relPhone} layout="grid" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
