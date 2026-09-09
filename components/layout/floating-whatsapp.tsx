"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  PhoneCall,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useSettings } from "@/lib/store/settings-context";

// Common prefilled customer inquiries for instant 1-tap engagement
const PRESET_INQUIRIES = [
  {
    label: "Check Phone Stock & Prices",
    text: "Hello AURA Luxe Mobile, I am looking to check current stock and pricing for your phones.",
  },
  {
    label: "Same-Day Express Delivery",
    text: "Hello AURA, I would like to know how fast delivery is to my location in Buea / Douala / Yaoundé.",
  },
  {
    label: "Swap / Trade-In My Old Phone",
    text: "Hello! I want to trade in / swap my old smartphone for an upgrade. How do I proceed?",
  },
  {
    label: "Pay on Delivery Information",
    text: "Hello, can I inspect the phone and pay upon delivery at my address?",
  },
];

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";

  // If on admin routes, do not render floating WhatsApp
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Gentle greeting popup 2.5s after user visits the boutique
  useEffect(() => {
    // Check if previously dismissed in this session
    const dismissed = sessionStorage.getItem("aura_wa_prompt_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasPrompted(false);
    setIsDismissed(true);
    sessionStorage.setItem("aura_wa_prompt_dismissed", "true");
  };

  const handleOpenWhatsApp = (messageText: string) => {
    const finalMessage =
      messageText.trim() ||
      `Hello ${settings.storeName}, I am visiting your website and need some assistance with phones.`;
    const url = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
      finalMessage
    )}`;
    window.open(url, "_blank");
    setIsOpen(false);
    setHasPrompted(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 transition-all duration-300">
      {/* 1. First-Visit Slide-In Greeting Bubble (When collapsed) */}
      {!isOpen && hasPrompted && !isDismissed && (
        <div className="mb-3 max-w-[290px] sm:max-w-xs p-4 rounded-none bg-[#09090D]/95 backdrop-blur-xl border border-[#25D366]/40 shadow-2xl shadow-black/90 animate-in fade-in slide-in-from-bottom-3 duration-300 relative font-sans">
          <button
            onClick={handleDismissPrompt}
            aria-label="Dismiss greeting"
            className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-white p-1 rounded-none border border-white/10 hover:border-white/30 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-none bg-black border border-[#25D366]/50 flex items-center justify-center shrink-0 text-[#25D366]">
              <MessageCircle className="w-4 h-4" />
            </div>

            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Store Online
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-tight font-sans">
                Need phone advice or stock check?
              </h4>
              <p className="text-[11px] text-zinc-400 leading-snug font-sans">
                Chat directly with our Buea showroom managers.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[9.5px] font-mono text-zinc-400">
              Buea • Douala • Yaoundé
            </span>
            <button
              onClick={() => {
                setHasPrompted(false);
                setIsOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-none bg-[#25D366] hover:bg-[#20bd5a] text-black font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all border border-[#25D366]"
            >
              <span>Chat Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Expanded WhatsApp Concierge Card */}
      {isOpen ? (
        <div className="w-[320px] sm:w-[350px] rounded-none bg-[#09090D]/98 backdrop-blur-2xl border border-[#25D366]/40 shadow-2xl shadow-black/95 overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans relative">
          {/* Card Header */}
          <div className="p-3.5 bg-black/90 border-b border-white/10 relative">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-none border border-white/10 hover:border-white/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-3">
              {/* WhatsApp Medallion */}
              <div className="w-9 h-9 rounded-none bg-black border border-[#25D366]/60 flex items-center justify-center text-[#25D366]">
                <MessageCircle className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {settings.storeName || "AURA Luxe Mobile"}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-none text-[8px] bg-[#25D366]/15 text-[#25D366] font-mono border border-[#25D366]/30 uppercase font-bold">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                    Buea Showroom
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-2.5 h-2.5" />
                    Replies in &lt; 3 mins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto no-scrollbar font-sans">
            {/* Friendly Greeting Note */}
            <div className="p-3 rounded-none bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-white text-[11px] uppercase tracking-wider">
                How can we help you today?
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Tap a topic below or type your question to chat directly on WhatsApp:
              </p>
            </div>

            {/* Quick Inquiries List */}
            <div className="space-y-1.5">
              <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-zinc-400 block">
                Common Questions:
              </span>
              {PRESET_INQUIRIES.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleOpenWhatsApp(item.text)}
                  className="w-full text-left p-2.5 rounded-none bg-black hover:bg-zinc-900 border border-white/10 hover:border-[#25D366] text-xs text-zinc-200 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="font-medium line-clamp-1 text-[11px]">
                    {item.label}
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-[#25D366] shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-zinc-400 block">
                Or type your question:
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleOpenWhatsApp(customMessage);
                    }
                  }}
                  placeholder="e.g. Do you have iPhone 15 Pro Max in stock in Buea?"
                  className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#25D366] transition-colors pr-9 font-sans"
                />
                <button
                  onClick={() => handleOpenWhatsApp(customMessage)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-none bg-[#25D366] text-black hover:bg-[#20bd5a] transition-colors"
                  title="Send via WhatsApp"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Card Footer: Call & Direct WhatsApp CTA */}
          <div className="p-3 bg-black border-t border-white/10 flex items-center justify-between gap-2">
            <a
              href={`tel:${cleanWaNumber}`}
              className="px-3 py-2 rounded-none bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
              <span>Call Us</span>
            </a>

            <button
              onClick={() =>
                handleOpenWhatsApp(customMessage || PRESET_INQUIRIES[0].text)
              }
              className="flex-1 py-2 px-3 rounded-none bg-[#25D366] hover:bg-[#20bd5a] text-black font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#25D366] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Open in WhatsApp</span>
            </button>
          </div>
        </div>
      ) : (
        /* 3. Floating Trigger Button */
        <button
          onClick={() => {
            setIsOpen(true);
            setHasPrompted(false);
          }}
          className="relative group p-3 rounded-none bg-black/90 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all shadow-2xl flex items-center gap-2.5 font-sans"
          title="Chat with AURA Showroom on WhatsApp"
        >
          <div className="w-5 h-5 rounded-none bg-black border border-current flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
            Chat on WhatsApp
          </span>

          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}
    </div>
  );
}
