"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Truck,
  FileCheck,
  Star,
  RefreshCw,
  Wrench,
  Check,
  ArrowRight,
  Copy,
  Layers,
  Store,
  CreditCard,
  Send,
  HelpCircle,
} from "lucide-react";

export default function SimpleProspectusPage() {
  const [copiedLink, setCopiedLink] = useState(false);

  const WHATSAPP_NUMBER = "237695349833";
  const WHATSAPP_DISPLAY = "+237 695 34 98 33";
  const DEVELOPER_NAME = "Wisdom Besong";

  const getWaUrl = (messageTopic: string) => {
    const text = `Hello Wisdom, I just read through the phone shop website summary (${messageTopic}). I would like us to discuss buying and setting it up for my business.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-zinc-100 py-6 sm:py-12 px-3 sm:px-6 font-sans">
      
      {/* DOCUMENT CONTAINER */}
      <div className="max-w-4xl mx-auto bg-[#101015] border border-white/15 p-6 sm:p-12 shadow-2xl space-y-10">
        
        {/* DOCUMENT HEADER / MEMO BAR */}
        <div className="border-b border-white/10 pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider">
              <span>PRODUCT SUMMARY &amp; SALE PROPOSAL</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                target="_blank"
                className="px-3 py-1.5 bg-[#D4AF37] text-black font-bold flex items-center gap-1.5 transition hover:opacity-90"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Complete Online Phone Shop &amp; Retail Management System
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              A ready-made, fully tested e-commerce website and admin management system built for phone shops, electronics retailers, and device sellers in Cameroon.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono text-zinc-300">
            <div className="p-2.5 bg-black/60 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Prepared By</span>
              <span className="font-bold text-white">{DEVELOPER_NAME}</span>
            </div>
            <div className="p-2.5 bg-black/60 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Direct WhatsApp</span>
              <span className="font-bold text-emerald-400">{WHATSAPP_DISPLAY}</span>
            </div>
            <div className="p-2.5 bg-black/60 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Status</span>
              <span className="font-bold text-emerald-400">100% Ready to Sell</span>
            </div>
            <div className="p-2.5 bg-black/60 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Setup Time</span>
              <span className="font-bold text-[#D4AF37]">24 to 48 Hours</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: WHAT IS THIS PRODUCT? */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[#D4AF37] font-mono text-sm">01.</span>
            <span>What is this product?</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            This is a complete, ready-to-use online shop. It comes with everything you need to sell brand new and refurbished smartphones (iPhones, Samsung, Google Pixel, Xiaomi, etc.) or any electronics online in Cameroon.
          </p>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Unlike website builders like Shopify that charge you monthly fees forever, with this you <strong>own the entire website 100%</strong>. Once you buy it, it is yours permanently.
          </p>
        </div>

        {/* SECTION 2: HOW YOUR CUSTOMERS USE THE SITE */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[#D4AF37] font-mono text-sm">02.</span>
            <span>How your customers use the site (Built for Cameroon)</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-xs uppercase">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>1. Easy Phone Browsing</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Customers can filter by brand (Apple, Samsung, etc.), select storage (128GB, 256GB, 512GB), choose their preferred color, and see the exact price and stock availability in FCFA immediately.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-xs uppercase">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>2. Simple Cameroon Checkout</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                No complicated sign-ups. The customer simply types their name, phone number, and city (Douala, Yaoundé, Buea, Limbe, etc.) and chooses how they want to pay.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-xs uppercase">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>3. Pay on Delivery &amp; Mobile Money</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Supports <strong>Cash on Delivery</strong> (customers inspect the phone before paying the rider), direct <strong>MTN Mobile Money</strong>, <strong>Orange Money</strong>, or in-person <strong>Showroom Pickup</strong>.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-xs uppercase">
                <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>4. Instant Official PDF Receipt</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                As soon as an order is placed, an Apple-style official receipt is generated with warranty details and order ID. Customers can view it or download it to their phone in 1 second.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: WHAT YOU GET AS THE SHOP OWNER */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[#D4AF37] font-mono text-sm">03.</span>
            <span>What you get as the shop owner (The Admin System)</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            You get a powerful, simple admin dashboard that works smoothly directly from your mobile phone or laptop:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 bg-black/50 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Add new phones in 1 minute using your phone camera:</strong>
                <span className="text-zinc-400">
                  Take a photo of a phone in your shop, type the name and price, and click Save. It appears on your live website immediately.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-black/50 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">AI Product Autofill:</strong>
                <span className="text-zinc-400">
                  Just type a phone name like &quot;iPhone 15 Pro Max 256GB&quot; and click AI Autofill. It will automatically fill in the full specifications, camera details, battery, and box contents for you.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-black/50 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Phone Swap / Trade-in Calculator:</strong>
                <span className="text-zinc-400">
                  Customers can enter their old phone details to get an instant valuation voucher in FCFA, bringing more swap clients to your shop.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-black/50 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Customer Reviews &amp; Replies:</strong>
                <span className="text-zinc-400">
                  Customers can rate phones and write reviews. You can moderate them and post official replies from your store.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-black/50 border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Order Management &amp; Direct WhatsApp Alerts:</strong>
                <span className="text-zinc-400">
                  See every order that comes in, customer phone numbers, delivery address, and call or message them on WhatsApp with 1 click.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: WHY THIS IS BETTER THAN SHOPIFY OR WORDPRESS */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[#D4AF37] font-mono text-sm">04.</span>
            <span>Why this is better than Shopify or WordPress</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-black/50 border border-white/10 space-y-1.5">
              <span className="font-mono text-emerald-400 font-bold block text-sm">ZERO MONTHLY FEES</span>
              <p className="text-zinc-400 leading-relaxed">
                Shopify costs $39 to $299 every single month plus transaction fees. This site has <strong>zero monthly subscription costs</strong>.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 space-y-1.5">
              <span className="font-mono text-[#D4AF37] font-bold block text-sm">SUPER FAST ON MOBILE</span>
              <p className="text-zinc-400 leading-relaxed">
                WordPress sites take 6 to 10 seconds to open on Cameroon 3G/4G. This website opens in <strong>less than 1 second</strong>, so customers don&apos;t leave.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 space-y-1.5">
              <span className="font-mono text-cyan-400 font-bold block text-sm">YOU OWN EVERYTHING</span>
              <p className="text-zinc-400 leading-relaxed">
                You get the full source code and database. It belongs completely to you. No one can block your shop.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: HOW WE CUSTOMIZE IT FOR YOUR SHOP */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[#D4AF37] font-mono text-sm">05.</span>
            <span>How we customize it for your shop (In 24–48 Hours)</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            When you purchase this, I will personally set it up completely for your business:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-black/50 border border-white/10 flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#D4AF37] text-black font-bold font-mono flex items-center justify-center text-[11px] shrink-0">1</span>
              <span className="text-zinc-200">Put your shop name, logo, brand colors, and phone numbers.</span>
            </div>
            <div className="p-3 bg-black/50 border border-white/10 flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#D4AF37] text-black font-bold font-mono flex items-center justify-center text-[11px] shrink-0">2</span>
              <span className="text-zinc-200">Connect your custom web domain (e.g. <em>yourshop.cm</em> or <em>yourshop.com</em>).</span>
            </div>
            <div className="p-3 bg-black/50 border border-white/10 flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#D4AF37] text-black font-bold font-mono flex items-center justify-center text-[11px] shrink-0">3</span>
              <span className="text-zinc-200">Import your initial phones, models, storage sizes, and real prices.</span>
            </div>
            <div className="p-3 bg-black/50 border border-white/10 flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#D4AF37] text-black font-bold font-mono flex items-center justify-center text-[11px] shrink-0">4</span>
              <span className="text-zinc-200">Give you and your staff a 20-minute training call on how to manage everything.</span>
            </div>
          </div>
        </div>

        {/* SECTION 6: EXTRA FEATURES WE CAN ADD LATER */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[#D4AF37] font-mono text-sm">06.</span>
            <span>Extra features we can add later if you want</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
            <div className="p-3 bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Mobile App:</strong> Turn this into an Android and iPhone app published on Play Store / App Store.</span>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Automatic SMS:</strong> Send SMS text messages to customers when their order is dispatched.</span>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Barcode Scanner:</strong> Connect physical barcode scanners and receipt printers for in-store walk-in sales.</span>
            </div>
            <div className="p-3 bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Other Products:</strong> Easily adapt the site to sell laptops, sneakers, fashion, or perfume.</span>
            </div>
          </div>
        </div>

        {/* SECTION 7: HOW TO CONTACT ME & BUY */}
        <div className="p-6 sm:p-8 bg-black border-2 border-[#D4AF37] space-y-6">
          <div className="space-y-2">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
              READY FOR HANDOVER
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white">
              Interested in Acquiring this Website for Your Business?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Contact me directly. We can discuss pricing, examine the live demo together, and have the entire platform set up under your shop&apos;s name within 48 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <a
              href={getWaUrl("Acquisition Inquiry")}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-xl"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Chat on WhatsApp ({WHATSAPP_DISPLAY})</span>
            </a>

            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/20 transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>Direct Phone Call</span>
            </a>

            <Link
              href="/"
              target="_blank"
              className="px-5 py-3.5 bg-black hover:bg-zinc-900 text-[#D4AF37] font-mono text-xs uppercase tracking-wider border border-[#D4AF37]/50 transition flex items-center justify-center gap-2 sm:ml-auto"
            >
              <span>Explore Live Store Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-2">
            <span>Developer: <strong className="text-white">{DEVELOPER_NAME}</strong> (Buea / Douala / Yaoundé, Cameroon)</span>
            <span>WhatsApp / Call: <strong className="text-white">{WHATSAPP_DISPLAY}</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}
