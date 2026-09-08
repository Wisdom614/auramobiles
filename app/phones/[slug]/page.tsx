"use client";

import React, { useState, useEffect, use } from "react";
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
  Zap,
  ArrowRight,
  Package,
  MessageCircle,
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
  const [isAdded, setIsAdded] = useState(false);

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

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="h-4 w-44 bg-white/10 rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-6 aspect-square rounded-3xl bg-[#121217] border border-white/5" />
            <div className="lg:col-span-6 space-y-6">
              <div className="h-4 w-28 bg-[#D4AF37]/20 rounded" />
              <div className="h-9 w-3/4 bg-white/10 rounded-xl" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-24 bg-[#121217] rounded-2xl border border-white/5" />
              <div className="h-12 bg-white/5 rounded-xl" />
              <div className="h-14 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-2xl font-bold text-white mb-2">Smartphone Not Found</h1>
        <p className="text-xs text-zinc-400 mb-6 max-w-sm">
          The requested device was not found in our database inventory.
        </p>
        <Link
          href="/phones"
          className="px-6 py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider"
        >
          Browse All Phones
        </Link>
      </div>
    );
  }

  const activeStorage = phone.storageVariants?.[selectedStorageIdx] || phone.storageVariants?.[0] || {
    id: "default",
    size: "Standard",
    price: phone.basePrice,
    stock: 5,
  };
  const activeColor = phone.colorVariants?.[selectedColorIdx] || phone.colorVariants?.[0] || {
    id: "default",
    name: "Standard",
    hex: "#8A8A8E",
    image: phone.images?.[0] || "",
  };
  const activeImage = activeColor?.image || phone.images?.[0] || "/placeholder.png";
  const currentPrice = activeStorage.price || phone.basePrice;
  const inWish = isInWishlist(phone.id);

  const handleAddToCart = () => {
    addItem(phone, activeStorage, activeColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(phone, activeStorage, activeColor, 1);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 font-mono overflow-x-auto">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/phones" className="hover:text-[#D4AF37] transition-colors">Phones</Link>
          <span>/</span>
          <Link href={`/phones?brand=${phone.brand}`} className="hover:text-[#D4AF37] transition-colors">
            {phone.brand}
          </Link>
          <span>/</span>
          <span className="text-[#D4AF37] truncate">{phone.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Interactive Product Gallery */}
          <div className="lg:col-span-6 space-y-4 sticky top-24">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-b from-[#141419] to-[#0A0A0D] border border-white/10 p-8 flex items-center justify-center overflow-hidden shadow-2xl group">
              <img
                src={activeImage}
                alt={phone.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {phone.isNew && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Official New Release
                  </span>
                )}
                {phone.condition === "Certified Refurbished" && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                    Certified Pre-Owned
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail color preview strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {phone.colorVariants.map((col, idx) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`relative w-18 h-18 rounded-2xl bg-[#121217] border p-2 flex flex-col items-center justify-center gap-1 transition-all shrink-0 ${
                    selectedColorIdx === idx
                      ? "border-[#D4AF37] ring-1 ring-[#D4AF37]"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-[10px] text-zinc-300 font-mono truncate max-w-full">
                    {col.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {phone.brand} Flagship
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span className="font-bold">{phone.rating}</span>
                  <span className="text-zinc-500">({phone.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {phone.name}
              </h1>
              <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                {phone.tagline}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#121217] border border-white/8 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
                  Official Retail Price
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#D4AF37]">
                  {formatCFA(currentPrice)}
                </span>
                {phone.originalPrice && phone.originalPrice > currentPrice && (
                  <span className="text-xs text-zinc-500 line-through ml-2">
                    {formatCFA(phone.originalPrice)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>In Stock ({activeStorage.stock} units)</span>
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  Douala & Yaoundé Express
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Color Finish:</span>
                <span className="text-[#D4AF37] font-mono">{activeColor.name}</span>
              </label>
              <div className="flex gap-2.5">
                {phone.colorVariants.map((col, idx) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                      selectedColorIdx === idx
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                        : "bg-[#141419] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Variants */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Storage Capacity:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {phone.storageVariants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedStorageIdx(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedStorageIdx === idx
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]"
                        : "bg-[#141419] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-sm font-bold text-white block">
                      {variant.size}
                    </span>
                    <span className="text-xs text-[#D4AF37] font-semibold block mt-0.5">
                      {formatCFA(variant.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-xl gold-gradient-bg text-black font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:opacity-95 transition-all min-h-[48px] cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3] text-black" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-black" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappCleanNumber || "237699442100"}?text=${encodeURIComponent(
                    `Hello ${settings.storeName}, I want to order the ${phone.name} (${activeStorage.size}, ${activeColor.name}) for ${formatCFA(
                      currentPrice
                    )}. Please confirm availability and delivery in Douala/Yaoundé.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 px-6 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  Direct Checkout
                </button>

                <button
                  onClick={() => toggleWishlist(phone.id)}
                  aria-label="Wishlist"
                  className={`px-4 py-3 rounded-xl border transition-colors ${
                    inWish
                      ? "bg-rose-950/40 border-rose-500 text-rose-400"
                      : "bg-[#141419] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWish ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              </div>

              {/* Trade-In Hook */}
              <Link
                href={`/trade-in?target=${phone.slug}`}
                className="w-full py-3 px-4 rounded-xl bg-[#141419] hover:bg-[#1A1A22] border border-[#D4AF37]/30 text-amber-200 text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                  <span>Have an old phone? Trade it in toward this {phone.name}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </Link>
            </div>

            {/* Device Highlights */}
            {phone.highlights && phone.highlights.length > 0 && (
              <div className="pt-4 border-t border-white/8 space-y-2.5">
                <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block font-semibold">
                  Device Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                  {phone.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/8 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{phone.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Same-day Douala/Ydé</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>7-Day Replacement</span>
              </div>
            </div>

          </div>

        </div>

        {/* Specifications & Box Contents Tabs/Section */}
        <div className="mt-16 pt-12 border-t border-white/10 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phone.specs &&
                Object.entries(phone.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-[#121217] border border-white/5 flex items-start justify-between gap-4 text-xs"
                  >
                    <span className="text-zinc-400 uppercase font-mono tracking-wider shrink-0">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-white font-medium text-right">
                      {val}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Box Contents */}
          {phone.boxContents && phone.boxContents.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#121217] border border-white/8">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>In The Box (Official Sealed Packaging)</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                {phone.boxContents.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-[#181820] border border-white/5">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Phones from Database */}
        {relatedPhones.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              You May Also Consider
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
