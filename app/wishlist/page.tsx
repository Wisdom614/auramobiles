"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { PHONES } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const savedPhones = PHONES.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#D4AF37]" />
              <span>Personal Collection</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              My Saved Smartphones
            </h1>
          </div>

          {savedPhones.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {/* List of Saved Phones */}
        {savedPhones.length > 0 ? (
          <div className="space-y-4">
            {savedPhones.map((phone) => (
              <div
                key={phone.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/8 hover:border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Link
                    href={`/phones/${phone.slug}`}
                    className="w-18 h-20 sm:w-20 sm:h-22 rounded-xl bg-[#09090C] border border-white/5 p-2 flex items-center justify-center shrink-0 block"
                  >
                    <img
                      src={phone.images[0]}
                      alt={phone.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] block font-semibold">
                      {phone.brand}
                    </span>
                    <Link href={`/phones/${phone.slug}`}>
                      <h3 className="text-sm sm:text-base font-bold text-white hover:text-amber-200 transition-colors">
                        {phone.name}
                      </h3>
                    </Link>
                    <span className="text-xs text-zinc-400 font-mono block">
                      {phone.storageVariants[0].size} • {phone.warranty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="sm:text-right">
                    <span className="text-base font-black text-[#D4AF37] block">
                      {formatCFA(phone.basePrice)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-medium">
                      ● Ready for Dispatch
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addItem(phone, phone.storageVariants[0], phone.colorVariants[0], 1);
                      }}
                      className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:opacity-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(phone.id)}
                      aria-label="Remove"
                      className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-[#121217] border border-white/5 p-8">
            <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-3 stroke-1" />
            <h3 className="text-lg font-bold text-white">Your wishlist is currently empty</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Save your favorite flagships by tapping the heart icon while browsing our smartphone collection.
            </p>
            <Link
              href="/phones"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider"
            >
              <span>Explore Flagship Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
