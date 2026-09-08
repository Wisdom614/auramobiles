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
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const inWish = isInWishlist(phone.id);
  const activeImage = phone.colorVariants[0]?.image || phone.images[0];
  const storage = phone.storageVariants[0]?.size || "128GB";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(phone, phone.storageVariants[0], phone.colorVariants[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative rounded-2xl bg-[#121217] border border-white/8 hover:border-[#D4AF37]/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 flex items-center gap-4 shrink-0 w-[270px] sm:w-[290px] lg:w-auto">
      {/* Top right wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(phone.id);
        }}
        aria-label="Toggle Wishlist"
        className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white transition-colors z-10"
      >
        <Heart className={`w-4 h-4 ${inWish ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>

      {/* Left: Product Thumbnail */}
      <Link
        href={`/phones/${phone.slug}`}
        className="w-20 h-24 sm:w-22 sm:h-26 rounded-xl bg-[#09090C] border border-white/5 p-2 flex items-center justify-center shrink-0 overflow-hidden block"
      >
        <img
          src={activeImage}
          alt={phone.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Right: Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block font-semibold">
          {phone.brand}
        </span>

        <Link href={`/phones/${phone.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
            {phone.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-[11px] text-amber-300">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span className="font-semibold text-zinc-200">{phone.rating}</span>
          <span className="text-zinc-500 text-[10px]">({phone.reviewCount})</span>
        </div>

        {/* Storage Badge */}
        <div className="inline-block px-1.5 py-0.5 rounded bg-[#1A1A22] border border-white/5 text-[10px] font-mono text-zinc-300">
          {storage}
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#D4AF37] block leading-tight">
              {formatCFA(phone.basePrice)}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">In Stock</span>
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-black text-zinc-300 transition-colors"
          >
            {added ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
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
