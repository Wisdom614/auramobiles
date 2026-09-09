"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";
import { useAi } from "@/lib/store/ai-context";
import { useSettings } from "@/lib/store/settings-context";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How do I verify that my device is 100% original and genuine?",
    a: "Every smartphone sold at AURA Luxe Mobile comes factory-sealed with an official manufacturer IMEI. You can verify the serial number live on the official Apple Coverage portal (checkcoverage.apple.com) or Samsung warranty verification database prior to unboxing.",
  },
  {
    q: "What payment methods are supported across Cameroon?",
    a: "We accept MTN Mobile Money, Orange Money, Visa, Mastercard, and Cash on Delivery upon physical inspection of your sealed phone.",
  },
  {
    q: "How fast is delivery?",
    a: "For orders in Buea (Molyko, Mile 17, Clerks Quarters), our dedicated courier delivers same-day within 1–2 hours. For Douala, Yaoundé, Bafoussam, Bamenda, and all other regions of Cameroon, our secure express courier delivers within 24 hours.",
  },
  {
    q: "How does the Phone Swap / Trade-In service work?",
    a: "You submit your device details on our Trade-In page or bring it to our showroom. Our technicians conduct an automated 65-point hardware diagnostic test in under 5 minutes, after which the appraised value is deducted immediately from your new purchase.",
  },
  {
    q: "What is covered under the 7-Day Replacement Policy?",
    a: "If your device exhibits any hardware anomaly, sensor fault, or screen defect within 7 days of purchase, we offer an immediate, hassle-free replacement with a brand new sealed unit.",
  },
];

export default function SupportPage() {
  const { setIsAiOpen } = useAi();
  const { settings } = useSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="uppercase tracking-widest font-mono text-[10px]">
              Customer Support &amp; Showroom
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed font-sans">
            Visit our Buea showroom in Molyko, get help with phone orders, or chat directly with our team on WhatsApp for fast response.
          </p>
        </div>

        {/* Physical Showrooms Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">
            Our Showroom &amp; Delivery Hub
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Buea Showroom */}
            <div className="p-6 rounded-3xl bg-[#121217] border border-white/8 hover:border-[#D4AF37]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/15 text-amber-300 border border-[#D4AF37]/30">
                  Buea Showroom
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Open Today
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {settings.storeName} Molyko
                </h3>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{settings.bueaAddress || "Check Point, Molyko, Buea"}</span>
                </p>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/5 font-sans">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-mono">{settings.whatsappPhone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.openingHours}</span>
                </p>
              </div>

              <a
                href={`https://wa.me/${settings.whatsappCleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#181820] hover:bg-[#202028] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat with Buea Showroom on WhatsApp</span>
              </a>
            </div>

            {/* Nationwide Dispatch */}
            <div className="p-6 rounded-3xl bg-[#121217] border border-white/8 hover:border-[#D4AF37]/40 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#D4AF37]/15 text-amber-300 border border-[#D4AF37]/30">
                  Nationwide Delivery
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  24h Express Dispatch
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Nationwide Delivery Hub
                </h3>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Direct Express Delivery to Douala, Yaoundé &amp; All Regions</span>
                </p>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/5 font-sans">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-mono">{settings.secondaryPhone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.openingHours}</span>
                </p>
              </div>

              <a
                href={`https://wa.me/${settings.secondaryPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#181820] hover:bg-[#202028] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Contact Nationwide Delivery on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

        {/* AI Concierge Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#141419] via-[#1A1A24] to-[#121217] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs uppercase font-mono tracking-wider text-[#D4AF37] font-semibold">
              Instant AI Assistant
            </span>
            <h3 className="text-xl font-bold text-white">
              Need recommendations based on your budget?
            </h3>
            <p className="text-xs text-zinc-400 max-w-md font-sans">
              Our AI Assistant helps you find phones by FCFA budget, compares camera specs, and suggests the best smartphone for your needs.
            </p>
          </div>

          <button
            onClick={() => setIsAiOpen(true)}
            className="px-6 py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/15 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Ask AI Assistant</span>
          </button>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#121217] border border-white/8 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-bold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D4AF37] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
