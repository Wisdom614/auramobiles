"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatCFA } from "@/lib/formatters";

export function CartToast() {
  const router = useRouter();
  const { notification, dismissNotification, setIsCartOpen } = useCart();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) return;

    setProgress(100);
    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissNotification();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification?.id]);

  if (!notification) return null;

  const { phone, storage, color, quantity } = notification;
  const image = color.image || phone.images?.[0] || "/placeholder.png";

  const handleViewBag = () => {
    dismissNotification();
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    dismissNotification();
    router.push("/checkout");
  };

  return (
    <aside
      aria-label="Item added to shopping bag"
      className="fixed bottom-20 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 font-sans"
    >
      <div className="bg-[#0E0E12] border border-[#D4AF37]/50 shadow-2xl shadow-black/90 p-3 sm:p-3.5 relative text-white rounded-none">
        {/* Architectural corner crosshairs */}
        <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px] leading-none select-none">
          +
        </span>
        <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px] leading-none select-none">
          +
        </span>
        <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px] leading-none select-none">
          +
        </span>
        <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px] leading-none select-none">
          +
        </span>

        {/* Header Status & Dismiss */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
            <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
            <span>Added to shopping bag</span>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Info Body */}
        <div className="flex items-center gap-3 py-2.5">
          <div className="w-12 h-14 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
            <img
              src={image}
              alt={phone.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">
              {phone.name}
            </h4>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
              {storage.size} • {color.name} {quantity > 1 && `• Qty: ${quantity}`}
            </p>
            <p className="text-xs font-bold text-[#D4AF37] font-mono mt-1">
              {formatCFA(storage.price * quantity)}
            </p>
          </div>
        </div>

        {/* Action Buttons: View Bag vs Checkout */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-[11px]">
          <button
            onClick={handleViewBag}
            className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 hover:text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
            <span>View Bag</span>
          </button>

          <button
            onClick={handleCheckout}
            className="py-2 px-3 gold-gradient-bg text-black font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 transition cursor-pointer"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Subtle Timer Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
          <div
            className="h-full bg-[#D4AF37]/80 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
