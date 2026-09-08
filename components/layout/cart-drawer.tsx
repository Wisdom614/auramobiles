"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from "lucide-react";
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

    const message = `Hello AURA Mobile, I want to order the following from your boutique:\n\n${itemList}\n\n*Total: ${formatCFA(
      subtotal
    )}*\n\nPlease confirm availability and delivery to Douala/Yaoundé.`;

    return `https://wa.me/237699442100?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#101014] border-l border-white/10 shadow-2xl flex flex-col h-full text-white">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141419]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-base font-bold tracking-wider uppercase">
                Your Bag
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]/50" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Explore our smartphones with official warranty and same-day delivery.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/phones");
                  }}
                  className="px-5 py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs tracking-wider uppercase hover:opacity-95 shadow-lg shadow-amber-500/10"
                >
                  Browse Smartphones
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#16161D] border border-white/8 flex gap-3 relative items-center"
                >
                  {/* Phone thumbnail */}
                  <img
                    src={item.selectedColor.image || item.phone.images[0]}
                    alt={item.phone.name}
                    className="w-16 h-18 object-contain rounded-lg bg-black border border-white/5 p-1 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-bold text-white truncate">
                        {item.phone.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {item.selectedStorage.size} • {item.selectedColor.name}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/10 rounded-lg bg-[#0C0C10]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-[#D4AF37] font-mono">
                        {formatCFA(item.selectedStorage.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Prominent Total & Clear Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121217] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="text-xl font-black text-white font-mono">
                  {formatCFA(subtotal)}
                </span>
              </div>

              {/* Primary Action: Checkout */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-amber-500/15 transition-all min-h-[48px] cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Secondary Cameroon-Optimized Action: Order via WhatsApp */}
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Order via WhatsApp</span>
              </a>

              <p className="text-[11px] text-zinc-500 text-center">
                100% Genuine Sealed • Pay on Delivery in Douala & Yaoundé
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
