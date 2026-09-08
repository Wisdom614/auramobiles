"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatCFA } from "@/lib/formatters";
import { useSettings } from "@/lib/store/settings-context";

export function CartDrawer() {
  const router = useRouter();
  const { settings } = useSettings();
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    itemCount,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  // Pre-generate WhatsApp message for 1-tap ordering
  const generateWhatsAppMessage = () => {
    const itemList = items
      .map(
        (it) =>
          `• ${it.phone.name} (${it.selectedStorage.size}, ${it.selectedColor.name}) × ${it.quantity} = ${formatCFA(
            it.selectedStorage.price * it.quantity
          )}`
      )
      .join("\n");

    const message = `Hello ${settings.storeName}, I want to order the following from your boutique:\n\n${itemList}\n\n*Total: ${formatCFA(
      subtotal
    )}*\n\nPlease confirm availability and delivery to Buea or Nationwide.`;

    const waNum = settings.whatsappCleanNumber || "237699442100";
    return `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200 font-sans">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0E0E12] border-l border-white/10 shadow-2xl flex flex-col h-full text-white">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141419]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-xs font-bold tracking-widest uppercase font-mono">
                [ ACQUISITION BAG ]
              </h2>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[#D4AF37] text-xs font-mono font-bold">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 bg-black border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-6 h-6 text-[#D4AF37]/60" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    [ BAG IS EMPTY ]
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                    Explore our flagship devices with official boutique warranty and express delivery nationwide.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/phones");
                  }}
                  className="px-5 py-3 gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase hover:opacity-95 transition cursor-pointer"
                >
                  Browse Smartphones
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#121217] border border-white/10 flex gap-3 relative items-center"
                >
                  {/* Phone thumbnail */}
                  <div className="w-14 h-16 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.selectedColor.image || item.phone.images[0]}
                      alt={item.phone.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.phone.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      {item.selectedStorage.size} • {item.selectedColor.name}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/15 bg-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white transition cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-[11px] font-mono font-bold text-white border-x border-white/10 py-0.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-zinc-400 hover:text-white transition cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#D4AF37] font-mono">
                        {formatCFA(item.selectedStorage.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Total & Checkout CTAs */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121217] space-y-3">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-zinc-400 uppercase tracking-widest">
                  [ SUBTOTAL ({itemCount}) ]
                </span>
                <span className="text-lg font-black text-white">
                  {formatCFA(subtotal)}
                </span>
              </div>

              {/* Primary Action: Checkout */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-95 transition min-h-[48px] cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Secondary Action: Order via WhatsApp */}
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition min-h-[44px] font-mono"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>ORDER VIA WHATSAPP (1-TAP)</span>
              </a>

              {/* Continue Shopping button */}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white font-mono text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>← Continue Shopping</span>
              </button>

              <p className="text-[10px] font-mono text-zinc-500 text-center uppercase">
                [ 100% SEALED HARDWARE • INSPECT BEFORE PAYING ]
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
