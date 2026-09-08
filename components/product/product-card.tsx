"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Scale, ShoppingBag, Star, Check } from "lucide-react";
import { Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCompare } from "@/lib/store/compare-context";
import { useCart } from "@/lib/store/cart-context";

interface ProductCardProps {
  phone: Phone;
  layout?: "grid" | "list";
}

export function ProductCard({ phone, layout = "grid" }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { addItem } = useCart();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAddedToast, setIsAddedToast] = useState(false);

  const activeColor = phone.colorVariants[selectedColorIndex] || phone.colorVariants[0];
  const activeImage = activeColor?.image || phone.images[0];
  const inWish = isInWishlist(phone.id);
  const inComp = isInCompare(phone.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(phone, phone.storageVariants[0], activeColor, 1);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 1500);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComp) {
      removeFromCompare(phone.id);
    } else {
      addToCompare(phone.id);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(phone.id);
  };

  if (layout === "list") {
    return (
      <div className="group relative rounded-2xl bg-[#121216] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center">
        {/* Thumbnail */}
        <Link href={`/phones/${phone.slug}`} className="w-full sm:w-48 h-48 rounded-xl bg-black overflow-hidden relative shrink-0 block">
          <img
            src={activeImage}
            alt={phone.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {phone.condition === "Certified Refurbished" && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
              Certified Pre-Owned
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-mono text-[#D4AF37]">
              {phone.brand}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{phone.rating}</span>
              <span className="text-zinc-500">({phone.reviewCount})</span>
            </div>
          </div>

          <Link href={`/phones/${phone.slug}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
              {phone.name}
            </h3>
          </Link>

          <p className="text-xs text-zinc-400 line-clamp-2">{phone.tagline}</p>

          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-zinc-400">
            <span className="px-2 py-0.5 rounded bg-zinc-800/80">{phone.specs.screen.split(",")[0]}</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/80">{phone.specs.processor}</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/80">{phone.storageVariants[0].size} Base</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500">Colors:</span>
            <div className="flex gap-1.5">
              {phone.colorVariants.map((col, idx) => (
                <button
                  key={col.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColorIndex(idx);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColorIndex === idx ? "ring-2 ring-[#D4AF37] scale-110" : "border-white/20"
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="w-full sm:w-52 sm:border-l sm:border-white/10 sm:pl-5 flex flex-col justify-between items-start sm:items-end gap-3">
          <div className="sm:text-right">
            <p className="text-xs text-zinc-400">Starting from</p>
            <p className="text-xl font-black text-[#D4AF37]">{formatCFA(phone.basePrice)}</p>
            {phone.originalPrice && (
              <p className="text-xs text-zinc-500 line-through">{formatCFA(phone.originalPrice)}</p>
            )}
          </div>

          <div className="flex items-center gap-2 w-full">
            <button
              onClick={handleWishlistToggle}
              className={`p-2.5 rounded-xl border transition-colors ${
                inWish
                  ? "bg-rose-950/40 border-rose-500 text-rose-400"
                  : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white"
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWish ? "fill-rose-400" : ""}`} />
            </button>
            <button
              onClick={handleCompareToggle}
              className={`p-2.5 rounded-xl border transition-colors ${
                inComp
                  ? "bg-amber-950/40 border-[#D4AF37] text-amber-300"
                  : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white"
              }`}
              title="Compare"
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-2.5 px-3 rounded-xl gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow-md"
            >
              {isAddedToast ? (
                <>
                  <Check className="w-4 h-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="group relative rounded-2xl bg-[#121216] border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Badges & Actions */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-start justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {phone.isNew && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              New Arrival
            </span>
          )}
          {phone.condition === "Certified Refurbished" && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
              Certified Pre-Owned
            </span>
          )}
          {phone.isDeal && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/30">
              Flash Deal
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              inWish
                ? "bg-rose-950/80 text-rose-400 border border-rose-500/50"
                : "bg-black/60 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${inWish ? "fill-rose-400" : ""}`} />
          </button>
          <button
            onClick={handleCompareToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              inComp
                ? "bg-amber-950/80 text-amber-300 border border-[#D4AF37]/50"
                : "bg-black/60 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
            }`}
            title="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link
        href={`/phones/${phone.slug}`}
        className="relative h-64 w-full bg-gradient-to-b from-[#18181F] to-[#0D0D10] flex items-center justify-center p-6 overflow-hidden block"
      >
        <img
          src={activeImage}
          alt={phone.name}
          className="h-full w-auto max-w-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-2xl"
        />
      </Link>

      {/* Details & Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-[#D4AF37] font-semibold text-[11px]">
              {phone.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{phone.rating}</span>
              <span className="text-zinc-500">({phone.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/phones/${phone.slug}`}>
            <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors mt-1 truncate">
              {phone.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{phone.tagline}</p>
        </div>

        {/* Color swatches & specs */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            {phone.colorVariants.map((col, idx) => (
              <button
                key={col.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColorIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? "ring-2 ring-[#D4AF37] scale-115 border-transparent"
                    : "border-white/20 hover:scale-110"
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {phone.storageVariants[0].size}
            {phone.storageVariants.length > 1
              ? `–${phone.storageVariants[phone.storageVariants.length - 1].size}`
              : ""}
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium tracking-tight">
                {phone.storageVariants.reduce((acc, v) => acc + v.stock, 0) > 4
                  ? "In Stock (Douala / Ydé)"
                  : `Only ${phone.storageVariants.reduce((acc, v) => acc + v.stock, 0)} left`}
              </span>
            </div>
            <span className="text-base font-black text-[#D4AF37]">
              {formatCFA(phone.basePrice)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="p-2.5 rounded-xl gold-gradient-bg text-black hover:opacity-95 shadow-md shadow-amber-500/10 transition-all flex items-center justify-center group/btn"
            title="Add to cart"
          >
            {isAddedToast ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
