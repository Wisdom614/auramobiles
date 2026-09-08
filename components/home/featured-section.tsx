"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { PHONES, Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";

interface BestSellerCardProps {
  phone: Phone;
}

function BestSellerCard({ phone }: BestSellerCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const activeImage = phone.colorVariants[0]?.image || phone.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(phone, phone.storageVariants[0], phone.colorVariants[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group rounded-2xl bg-[#121217] border border-white/8 hover:border-[#D4AF37]/50 p-3.5 sm:p-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between shrink-0 w-[200px] sm:w-[220px] lg:w-auto h-full">
      {/* Product Image Link */}
      <Link
        href={`/phones/${phone.slug}`}
        className="w-full h-36 sm:h-40 rounded-xl bg-[#09090C] border border-white/5 p-3 flex items-center justify-center overflow-hidden block"
      >
        <img
          src={activeImage}
          alt={phone.name}
          className="h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Info */}
      <div className="pt-3 pb-2 space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] block font-semibold">
          {phone.brand}
        </span>

        <Link href={`/phones/${phone.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
            {phone.name}
          </h3>
        </Link>

        {/* Price & In Stock */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs sm:text-sm font-black text-white font-mono">
            {formatCFA(phone.basePrice)}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">In Stock</span>
        </div>
      </div>

      {/* Obvious Add to Cart Button */}
      <button
        onClick={handleQuickAdd}
        aria-label={`Add ${phone.name} to cart`}
        className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer ${
          added
            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
            : "gold-gradient-bg text-black hover:opacity-95 shadow-md shadow-amber-500/10 active:scale-[0.98]"
        }`}
      >
        {added ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}

export function FeaturedSection() {
  const [activeBrand, setActiveBrand] = useState<string>("all");

  const filterTabs = [
    { label: "All", value: "all" },
    { label: "Apple", value: "apple" },
    { label: "Samsung", value: "samsung" },
    { label: "Xiaomi", value: "xiaomi" },
    { label: "Tecno", value: "tecno" },
    { label: "Infinix", value: "infinix" },
  ];

  const filteredPhones =
    activeBrand === "all"
      ? [
          PHONES.find((p) => p.brand === "Apple") || PHONES[0],
          PHONES.find((p) => p.brand === "Samsung") || PHONES[1],
          PHONES.find((p) => p.brand === "Xiaomi") || PHONES[2],
          PHONES.find((p) => p.brand === "Tecno") || PHONES[3],
          PHONES.find((p) => p.brand === "Infinix") || PHONES[4],
        ]
      : PHONES.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase()).slice(0, 5);

  return (
    <section className="py-14 sm:py-16 bg-[#09090B] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Matching Reference Design) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37] tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              The most loved phones, chosen by thousands.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveBrand(tab.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  activeBrand === tab.value
                    ? "bg-[#D4AF37] text-black shadow-sm"
                    : "text-zinc-400 hover:text-white bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Cards Row: Mobile horizontal touch swipe track / Desktop 5-col grid */}
        <div className="flex lg:grid lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
          {filteredPhones.map((phone) => (
            <div key={phone.id} className="snap-start shrink-0">
              <BestSellerCard phone={phone} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
