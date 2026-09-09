"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, MessageCircle, RefreshCw, Check } from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { Phone, StorageVariant, ColorVariant } from "@/lib/data/phones";
import { useCart } from "@/lib/store/cart-context";
import { useSettings } from "@/lib/store/settings-context";
import Link from "next/link";

interface StickyMobilePdpBarProps {
  phone: Phone;
  selectedStorage: StorageVariant;
  selectedColor: ColorVariant;
  triggerElementId?: string;
}

export function StickyMobilePdpBar({
  phone,
  selectedStorage,
  selectedColor,
  triggerElementId = "main-pdp-buy-box",
}: StickyMobilePdpBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      const triggerEl = document.getElementById(triggerElementId);
      if (!triggerEl) {
        setIsVisible(window.scrollY > 450);
        return;
      }
      const rect = triggerEl.getBoundingClientRect();
      setIsVisible(rect.bottom < 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerElementId]);

  if (!isVisible) return null;

  const handleAddToCart = () => {
    addItem(phone, selectedStorage, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const formattedWhatsAppUrl = `https://wa.me/${(settings?.whatsappNumber || "237670000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello AURA Luxe Mobile, I would like to buy the ${phone.brand} ${phone.name} (${selectedStorage.size}, ${selectedColor.name}) priced at ${formatCFA(selectedStorage.price)}. Is it available for delivery?`
  )}`;

  const displayImage = selectedColor.image || phone.images?.[0] || "/placeholder.png";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0c0c0f]/95 backdrop-blur-xl border-t border-amber-500/20 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] transition-all duration-300 animate-in slide-in-from-bottom">
      <div className="flex items-center justify-between gap-3">
        {/* Thumbnail & Price info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden p-1">
            <Image
              src={displayImage}
              alt={phone.name}
              fill
              className="object-contain"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">
              {phone.name}
            </div>
            <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
              <span>{selectedStorage.size}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">
                {formatCFA(selectedStorage.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={formattedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Order on WhatsApp"
            title="Express Order on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>

          <button
            onClick={handleAddToCart}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
