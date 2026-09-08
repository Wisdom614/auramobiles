"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  PhoneCall,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useSettings } from "@/lib/store/settings-context";

// Common prefilled customer inquiries for instant 1-tap engagement
const PRESET_INQUIRIES = [
  {
    label: "📱 Check Phone Stock & Prices",
    text: "Hello AURA Luxe Mobile, I am visiting your online boutique and would like to check current stock and pricing for your flagships.",
  },
  {
    label: "🚚 Same-Day Delivery Inquiry",
    text: "Hello AURA, I would like to know about your same-day express delivery in Douala & Yaoundé.",
  },
  {
    label: "🔄 Trade-In / Swap Appraisal",
    text: "Hello! I want to trade in my old smartphone for a new flagship. How does the showroom appraisal work?",
  },
  {
    label: "💳 Cash on Delivery Confirmation",
    text: "Hello, can I inspect my smartphone and pay cash on delivery at my address?",
  },
];

export function FloatingWhatsApp() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  const cleanWaNumber = settings.whatsappCleanNumber || "237699442100";
  const displayPhone = settings.whatsappPhone || "+237 699 44 21 00";

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
    const finalMessage = messageText.trim() || `Hello ${settings.storeName}, I am visiting your online store and need assistance.`;
    const url = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, "_blank");
    setIsOpen(false);
    setHasPrompted(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 transition-all duration-300">
      
      {/* 1. First-Visit Slide-In Greeting Bubble (When collapsed) */}
      {!isOpen && hasPrompted && !isDismissed && (
        <div className="mb-3 max-w-[280px] sm:max-w-xs p-3.5 rounded-2xl bg-[#121217]/95 backdrop-blur-xl border border-[#25D366]/40 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-3 duration-300 relative">
          <button
            onClick={handleDismissPrompt}
            aria-label="Dismiss greeting"
            className="absolute top-2 right-2 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </div>

            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Showroom Advisor Online
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-tight">
                Need phone advice or checking stock?
              </p>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Chat with our boutique concierge directly on WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">Fast Cameroon reply</span>
            <button
              onClick={() => {
                setHasPrompted(false);
                setIsOpen(true);
              }}
              className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <span>Quick Chat</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Expanded WhatsApp Concierge Card */}
      {isOpen ? (
        <div className="w-[320px] sm:w-[350px] rounded-3xl bg-[#121217]/95 backdrop-blur-2xl border border-[#25D366]/30 shadow-2xl shadow-black/90 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Card Header */}
          <div className="p-4 bg-gradient-to-r from-[#0E1E14] via-[#122A1C] to-[#121217] border-b border-white/10 relative">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              {/* WhatsApp Medallion */}
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black">
                  <MessageCircle className="w-6 h-6 fill-current text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#121217] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{settings.storeName || "AURA"} Concierge</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    LIVE
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>Douala & Yaoundé Hubs</span>
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  <span>Typically replies in under 3 minutes</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto no-scrollbar">
            
            {/* Friendly Greeting Note */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-white">
                👋 Hello! Welcome to AURA Luxe Mobile.
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Click any topic below to send an instant pre-filled inquiry, or type a custom question:
              </p>
            </div>

            {/* Quick Inquiries List */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-zinc-400 block">
                Popular Inquiries:
              </span>
              {PRESET_INQUIRIES.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleOpenWhatsApp(item.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#181820] hover:bg-[#20202C] border border-white/5 hover:border-[#25D366]/40 text-xs text-zinc-200 transition-all flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-white line-clamp-1">
                    {item.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#25D366] shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-zinc-400 block">
                Or Type a Custom Question:
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
                  placeholder="e.g. Do you have iPhone 16 Pro 256GB in Desert Titanium?"
                  className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#25D366] transition-colors pr-9"
                />
                <button
                  onClick={() => handleOpenWhatsApp(customMessage)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#25D366] text-black hover:opacity-90 transition-opacity"
                  title="Send via WhatsApp"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Card Footer: Call & Direct WhatsApp CTA */}
          <div className="p-3.5 bg-[#16161D] border-t border-white/10 flex items-center justify-between gap-2">
            <a
              href={`tel:${cleanWaNumber}`}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Call Us</span>
            </a>

            <button
              onClick={() => handleOpenWhatsApp(customMessage || PRESET_INQUIRIES[0].text)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Open WhatsApp</span>
            </button>
          </div>

        </div>
      ) : (
        /* 3. Floating Trigger Button with Pulsing Wave */
        <button
          onClick={() => {
            setIsOpen(true);
            setHasPrompted(false);
          }}
          className="relative group p-3.5 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-white/20"
          title="Chat with AURA on WhatsApp"
        >
          {/* Animated Wave Ping */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

          <MessageCircle className="w-6 h-6 fill-white text-white relative z-10" />

          {/* Desktop Text Expansion */}
          <div className="hidden sm:flex flex-col text-left pr-1 relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-black/80 font-mono leading-none">
              Need Help?
            </span>
            <span className="text-xs font-black text-black leading-tight">
              WhatsApp Us
            </span>
          </div>

          {/* Active Online Indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-[#121217] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
          </span>
        </button>
      )}

    </div>
  );
}
