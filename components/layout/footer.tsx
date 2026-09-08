"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-[#0A0A0D] border-t border-white/10 text-zinc-400 text-sm mt-auto">
      {/* 4 Pillars Trust Bar */}
      <div className="border-b border-white/5 bg-[#0E0E12] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Official Origin</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  IMEI registered with direct 12-month manufacturer guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">VIP Express Logistics</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Same-day delivery in Douala & Yaoundé before 14:00.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">7-Day Replacement</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  No questions asked hardware exchange for peace of mind.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Certified Phone Swap</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Instant trade-in credit against your new flagship purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-[#D4AF37]/40 shadow-md">
                <img
                  src="/aura-monogram.jpg"
                  alt="AURA"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-[0.22em] text-white uppercase block leading-none">
                  AURA
                </span>
                <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-mono font-semibold block mt-0.5">
                  LUXE MOBILE BOUTIQUE
                </span>
              </div>
            </Link>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Central Africa’s premier technology boutique for luxury flagship smartphones, verified phone trade-ins, and bespoke concierge device servicing.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">
                Join the VIP Circle for Private Releases & Price Drops
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome to the VIP roster. Check your inbox for your 25,000 FCFA welcome voucher.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-[#141419] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Boutiques in Cameroon */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Boutiques & Lounges
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Douala Flagship
                </p>
                <p className="text-zinc-500 mt-0.5">Rue Tokoto, Bonapriso</p>
                <p className="text-zinc-400 mt-0.5 font-mono text-[11px]">+237 699 44 21 00</p>
                <p className="text-amber-300/70 text-[10px] mt-0.5">Mon - Sat: 08:30 – 19:30</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Yaoundé Bastos Lounge
                </p>
                <p className="text-zinc-500 mt-0.5">Avenue Bastos, Face Ambassade</p>
                <p className="text-zinc-400 mt-0.5 font-mono text-[11px]">+237 677 88 99 00</p>
                <p className="text-amber-300/70 text-[10px] mt-0.5">Mon - Sat: 09:00 – 19:00</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Collection
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/phones?brand=Apple" className="hover:text-[#D4AF37] transition-colors">
                  Apple iPhone Series
                </Link>
              </li>
              <li>
                <Link href="/phones?brand=Samsung" className="hover:text-[#D4AF37] transition-colors">
                  Samsung Galaxy Flagships
                </Link>
              </li>
              <li>
                <Link href="/phones?category=camera" className="hover:text-[#D4AF37] transition-colors">
                  Studio Optics & Zoom
                </Link>
              </li>
              <li>
                <Link href="/phones?category=refurbished" className="hover:text-[#D4AF37] transition-colors">
                  Certified Pre-Owned (Pre-tested)
                </Link>
              </li>
              <li>
                <Link href="/trade-in" className="hover:text-[#D4AF37] transition-colors">
                  Instant Phone Swap Estimator
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#D4AF37] transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Concierge Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:text-[#D4AF37] transition-colors">
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#D4AF37] transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#D4AF37] transition-colors">
                  My Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#D4AF37] transition-colors">
                  WhatsApp VIP Direct Support
                </Link>
              </li>
              <li>
                <Link href="/support#faq" className="hover:text-[#D4AF37] transition-colors">
                  Warranty & Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom payment bar & copyright */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AURA Luxe Mobile Boutique Ltd. All rights reserved.</p>

          {/* Local Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-400 mr-1">Secured payments:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-amber-400 font-mono text-[10px] font-bold">
              MTN MoMo
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-orange-400 font-mono text-[10px] font-bold">
              Orange Money
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-200 font-mono text-[10px]">
              Cash on Delivery
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-blue-400 font-mono text-[10px] font-bold">
              VISA / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
