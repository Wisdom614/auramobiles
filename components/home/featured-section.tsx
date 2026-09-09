"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { PHONES, Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { getPhonesFromDB } from "@/lib/supabase/client";

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
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/60 p-3 sm:p-4 transition-all flex flex-col justify-between w-full h-full relative group">
      
      {/* Top Telemetry */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 font-mono text-[9px]">
        <span className="text-[#D4AF37] uppercase tracking-wider font-semibold">
          [ {phone.brand} ]
        </span>
        <span className="text-emerald-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400"></span>
          SEALED
        </span>
      </div>

      {/* Product Image Canvas */}
      <Link
        href={`/phones/${phone.slug}`}
        className="w-full h-40 sm:h-44 bg-black border border-white/10 p-3 flex items-center justify-center overflow-hidden block relative group"
      >
        <img
          src={activeImage}
          alt={phone.name}
          className="h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info */}
      <div className="pt-3 pb-3 space-y-1">
        <Link href={`/phones/${phone.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate uppercase font-sans">
            {phone.name}
          </h3>
        </Link>
        <p className="text-[10px] font-mono text-zinc-500 truncate">
          {phone.storageVariants[0]?.size} • {phone.warranty || "Boutique Warranty"}
        </p>

        {/* Price */}
        <div className="flex items-baseline justify-between pt-1 font-mono">
          <span className="text-xs sm:text-sm font-black text-white">
            {formatCFA((phone.storageVariants && phone.storageVariants.length > 0 && phone.storageVariants[0].price > 0) ? phone.storageVariants[0].price : phone.basePrice)}
          </span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
            STOCK READY
          </span>
        </div>
      </div>

      {/* Tactile Add to Bag Button */}
      <button
        onClick={handleQuickAdd}
        aria-label={`Add ${phone.name} to bag`}
        className={`w-full py-2.5 px-3 font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer border ${
          added
            ? "bg-emerald-500 text-black border-emerald-500 font-bold"
            : "gold-gradient-bg text-black border-transparent hover:opacity-95"
        }`}
      >
        {added ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>UNIT ADDED!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ACQUIRE UNIT</span>
          </>
        )}
      </button>
    </div>
  );
}

export function FeaturedSection() {
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [phonesList, setPhonesList] = useState<Phone[]>(PHONES);

  useEffect(() => {
    getPhonesFromDB().then((dbList) => {
      if (dbList && dbList.length > 0) {
        setPhonesList(dbList);
      }
    });
  }, []);

  const filterTabs = [
    { label: "ALL HARDWARE", value: "all" },
    { label: "APPLE", value: "apple" },
    { label: "SAMSUNG", value: "samsung" },
    { label: "XIAOMI", value: "xiaomi" },
    { label: "TECNO", value: "tecno" },
    { label: "INFINIX", value: "infinix" },
  ];

  const filteredPhones =
    activeBrand === "all"
      ? [
          phonesList.find((p) => p.brand === "Apple") || phonesList[0],
          phonesList.find((p) => p.brand === "Samsung") || phonesList[1],
          phonesList.find((p) => p.brand === "Xiaomi") || phonesList[2],
          phonesList.find((p) => p.brand === "Tecno") || phonesList[3],
          phonesList.find((p) => p.brand === "Infinix") || phonesList[4],
        ].filter(Boolean)
      : phonesList.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase()).slice(0, 5);

  return (
    <section className="py-14 sm:py-16 bg-[#09090B] border-b border-white/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
              [ CURATED SELECTION // HIGH VELOCITY HARDWARE ]
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-0.5">
              Verified Flagship Best Sellers
            </h2>
          </div>

          {/* Segmented Filter Switches (Teenage Engineering Style) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveBrand(tab.value)}
                className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer border ${
                  activeBrand === tab.value
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "bg-[#121217] text-zinc-400 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Devices */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredPhones.map((phone) => (
            <BestSellerCard key={phone.id} phone={phone} />
          ))}
        </div>

        {/* View full collection trigger */}
        <div className="mt-8 text-center">
          <Link
            href="/phones"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#121217] hover:bg-[#181820] text-white border border-white/15 hover:border-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest transition"
          >
            <span>[ EXPLORE ENTIRE HARDWARE VAULT ]</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
