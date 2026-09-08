"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatCFA } from "@/lib/formatters";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput("");
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101014] border-l border-[#D4AF37]/20 shadow-2xl flex flex-col h-full text-white">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141419]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-base font-bold tracking-wider uppercase">
                Shopping Cart
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]/50" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your bag is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Discover our collection of official flagship phones and certified pre-owned devices.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/phones");
                  }}
                  className="px-5 py-2.5 rounded-xl gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-lg shadow-amber-500/10"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-all flex gap-3.5 relative"
                >
                  {/* Phone thumbnail */}
                  <img
                    src={item.selectedColor.image || item.phone.images[0]}
                    alt={item.phone.name}
                    className="w-18 h-20 object-cover rounded-lg bg-black border border-white/5 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.phone.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                          {item.selectedStorage.size}
                        </span>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full inline-block border border-white/20"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      <div className="flex items-center border border-white/10 rounded-lg bg-zinc-950">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#D4AF37]">
                        {formatCFA(item.selectedStorage.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer calculation & CTAs */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#121216] space-y-4">
              {/* Coupon code */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (e.g. GOLD10)"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  Apply
                </button>
              </form>

              {coupon && (
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-amber-500/10 border border-[#D4AF37]/30 text-amber-300">
                  <span>Coupon {coupon.code} active</span>
                  <button onClick={removeCoupon} className="hover:underline text-zinc-400 text-[10px]">
                    Remove
                  </button>
                </div>
              )}
              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.error ? "text-red-400" : "text-emerald-400"}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCFA(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>VIP Discount</span>
                    <span>-{formatCFA(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-white font-medium">
                    {deliveryFee === 0 ? "Free Pickup" : formatCFA(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-base text-[#D4AF37]">{formatCFA(total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 rounded-xl gold-gradient-bg text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-amber-500/15 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-center px-1">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push("/cart");
                    }}
                    className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    View detailed bag
                  </button>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Inspected & Guaranteed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
