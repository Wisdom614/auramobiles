"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, MessageCircle, Check } from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { Phone, StorageVariant, ColorVariant } from "@/lib/data/phones";
import { useCart } from "@/lib/store/cart-context";
import { useSettings } from "@/lib/store/settings-context";

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

  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";
  const formattedWhatsAppUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Hello ${settings.storeName}, I want to order the ${phone.name} (${selectedStorage.size}, ${selectedColor.name}) for ${formatCFA(selectedStorage.price)}. Please confirm availability and delivery dispatch.`
  )}`;

  const displayImage = selectedColor.image || phone.images?.[0] || "/placeholder.png";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0C0C10]/95 backdrop-blur-xl border-t border-[#D4AF37]/30 px-3.5 py-2.5 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 animate-in slide-in-from-bottom font-sans">
      <div className="flex items-center justify-between gap-3">
        {/* Thumbnail & Price info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-none bg-black border border-white/15 shrink-0 overflow-hidden p-1 flex items-center justify-center">
            <Image
              src={displayImage}
              alt={phone.name}
              fill
              className="object-contain"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate font-sans uppercase">
              {phone.name}
            </div>
            <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1 font-mono">
              <span>{selectedStorage.size}</span>
              <span>•</span>
              <span className="text-[#D4AF37] font-bold">
                {formatCFA(selectedStorage.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={formattedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-none bg-[#0A1A10] border border-[#25D366]/40 text-[#25D366] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Order on WhatsApp"
            title="Express WhatsApp Order"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>

          <button
            onClick={handleAddToCart}
            className="h-10 px-4 rounded-none gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95 transition-all font-mono"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3] text-black" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
