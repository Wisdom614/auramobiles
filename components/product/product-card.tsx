"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { useCart } from "@/lib/store/cart-context";

interface ProductCardProps {
  phone: Phone;
  layout?: "grid" | "list";
}

export function ProductCard({ phone, layout = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAddedToast, setIsAddedToast] = useState(false);

  const defaultColor = phone.colorVariants?.[0] || { id: "c1", name: "Standard", hex: "#888", image: phone.images?.[0] || "" };
  const defaultStorage = phone.storageVariants?.[0] || { id: "s1", size: "Standard", price: phone.basePrice, stock: 1 };
  const displayPrice = defaultStorage?.price && defaultStorage.price > 0 ? defaultStorage.price : phone.basePrice;
  const activeImage = defaultColor?.image || phone.images?.[0] || "/placeholder.png";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(phone, defaultStorage, defaultColor, 1);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 1400);
  };

  // List Layout
  if (layout === "list") {
    return (
      <div className="group rounded-none bg-[#121217] border border-white/8 hover:border-[#D4AF37]/50 transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
        {/* Thumbnail */}
        <Link
          href={`/phones/${phone.slug}`}
          className="w-full sm:w-40 h-40 rounded-none bg-black overflow-hidden relative shrink-0 flex items-center justify-center p-3 border border-white/5"
        >
          <img
            src={activeImage}
            alt={phone.name}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-none text-[9.5px] font-bold uppercase tracking-wider font-mono ${
              phone.condition === "Certified Refurbished"
                ? "bg-amber-950/90 text-amber-300 border border-amber-500/30"
                : "bg-emerald-950/90 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {phone.condition === "Certified Refurbished" ? "Clean Pre-Owned" : "Brand New Sealed"}
          </span>
        </Link>

        {/* Info */}
        <div className="flex-1 w-full space-y-1.5 text-center sm:text-left">
          <span className="text-[11px] uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">
            {phone.brand}
          </span>
          <Link href={`/phones/${phone.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
              {phone.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-400 line-clamp-1">{phone.tagline}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium font-mono">In Stock • Official Warranty</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="w-full sm:w-48 sm:border-l sm:border-white/10 sm:pl-6 flex flex-col items-center sm:items-end gap-3 shrink-0">
          <div className="text-center sm:text-right">
            <span className="text-xs text-zinc-400 block font-mono">Official Price</span>
            <span className="text-lg font-black text-[#D4AF37] font-mono">
              {formatCFA(displayPrice)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer ${
              isAddedToast
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                : "gold-gradient-bg text-black hover:opacity-95 shadow-md shadow-amber-500/10"
            }`}
          >
            {isAddedToast ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Grid Layout (Default: Mobile-First, Clean & Compact, Straight Edges)
  return (
    <div className="group rounded-none bg-[#121217] border border-white/10 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-black/50 transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      {/* Condition Badge */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span
          className={`px-2 py-0.5 rounded-none text-[9.5px] font-bold uppercase tracking-wider font-mono ${
            phone.condition === "Certified Refurbished"
              ? "bg-amber-950/90 text-amber-300 border border-amber-500/30"
              : "bg-emerald-950/90 text-emerald-300 border border-emerald-500/30"
          }`}
        >
          {phone.condition === "Certified Refurbished" ? "Pre-Owned" : "Brand New"}
        </span>
      </div>

      {/* Product Image Link */}
      <Link
        href={`/phones/${phone.slug}`}
        className="relative h-44 sm:h-52 w-full bg-[#0D0D10] flex items-center justify-center p-4 overflow-hidden block border-b border-white/5"
      >
        <img
          src={activeImage}
          alt={phone.name}
          className="h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
        />
      </Link>

      {/* Details & Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand */}
          <span className="font-mono uppercase tracking-wider text-[#D4AF37] font-bold text-[10px] block mb-0.5">
            {phone.brand}
          </span>

          {/* Title */}
          <Link href={`/phones/${phone.slug}`}>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate uppercase">
              {phone.name}
            </h3>
          </Link>

          {/* Price & In Stock */}
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm sm:text-base font-black text-white font-mono">
              {formatCFA(displayPrice)}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium font-mono">In Stock</span>
          </div>
        </div>

        {/* Primary "Add to Cart" Button */}
        <button
          onClick={handleQuickAdd}
          aria-label={`Add ${phone.name} to cart`}
          className={`w-full py-2.5 px-3 rounded-none font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer ${
            isAddedToast
              ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
              : "gold-gradient-bg text-black hover:opacity-95 shadow-md shadow-amber-500/10 active:scale-[0.98]"
          }`}
        >
          {isAddedToast ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
