"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Banknote,
  Store,
  Sparkles,
  Lock,
  CornerDownRight,
  Truck,
  FileCheck,
} from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useOrders } from "@/lib/store/orders-context";
import { useSettings } from "@/lib/store/settings-context";
import { useAuth } from "@/lib/store/auth-context";
import { OrderItem, CustomerDetails } from "@/lib/data/mock-orders";
import { formatCFA } from "@/lib/formatters";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { settings } = useSettings();
  const { user, profile } = useAuth();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"douala" | "yaounde" | "nationwide" | "pickup">("douala");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mtn" | "orange">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(1);

  // Auto-fill from authenticated VIP Profile
  useEffect(() => {
    if (profile) {
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.phone) {
        const clean = profile.phone.replace(/^\+?237\s?/, "").trim();
        setPhoneNum(clean);
      }
      if (profile.address) setAddress(profile.address);
      if (profile.city) {
        const c = profile.city.toLowerCase();
        if (c.includes("douala")) setDeliveryOption("douala");
        else if (c.includes("yaound")) setDeliveryOption("yaounde");
        else if (c.includes("other") || c.includes("bafoussam") || c.includes("kribi")) setDeliveryOption("nationwide");
      }
    }
  }, [profile]);

  // Delivery fee calculation from admin site settings
  const deliveryFee =
    deliveryOption === "pickup"
      ? 0
      : subtotal >= settings.freeDeliveryThreshold
      ? 0
      : deliveryOption === "nationwide"
      ? settings.deliveryFeeNationwide
      : settings.deliveryFeeDoualaYaounde;

  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20 relative">
        <div className="max-w-md w-full border border-white/10 bg-[#0E0E12] p-8 sm:p-10 relative">
          {/* Viewfinder crosshairs */}
          <span className="absolute top-2 left-2 text-zinc-600 font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-zinc-600 font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 left-2 text-zinc-600 font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 right-2 text-zinc-600 font-mono text-xs select-none">+</span>

          <div className="w-14 h-14 bg-black border border-white/15 flex items-center justify-center mx-auto mb-5 text-[#D4AF37]">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <div className="inline-block px-2.5 py-0.5 bg-white/5 border border-white/10 text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-3">
            [ STATUS // MANIFEST EMPTY ]
          </div>

          <h1 className="text-xl font-bold text-white uppercase tracking-wider mb-2">
            Acquisition Bag is Empty
          </h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Select a verified flagship device from our curated vault collection before completing acquisition.
          </p>

          <Link
            href="/phones"
            className="w-full inline-block py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition"
          >
            Access Boutique Vault
          </Link>
        </div>
      </div>
    );
  }

  // WhatsApp payload generator
  const handleWhatsAppOrder = () => {
    const itemList = items
      .map(
        (it) =>
          `• ${it.phone.name} (${it.selectedStorage.size}, ${it.selectedColor.name}) × ${it.quantity} = ${formatCFA(
            it.selectedStorage.price * it.quantity
          )}`
      )
      .join("\n");

    const deliveryText =
      deliveryOption === "pickup"
        ? "Showroom Pickup (Bonapriso / Bastos)"
        : `${deliveryOption.toUpperCase()} - ${address || "Address to confirm via call"}`;

    const text = `Hello ${settings.storeName}, I want to confirm my order:\n\n*Customer:* ${fullName || "Client"}\n*Phone:* ${phoneNum || "Via WhatsApp"}\n*Delivery:* ${deliveryText}\n*Payment:* ${
      paymentMethod === "cod" ? "Cash on Delivery (Inspection First)" : paymentMethod === "mtn" ? "MTN MoMo" : "Orange Money"
    }\n\n*Items:*\n${itemList}\n\n*Total:* ${formatCFA(total)}\n\nPlease proceed with order dispatch.`;

    const waNum = settings.whatsappCleanNumber || "237699442100";
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNum.trim()) {
      alert("Please provide your Name and WhatsApp phone number.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep(1);

    const orderItems: OrderItem[] = items.map((it) => ({
      phoneId: it.phone.id,
      name: it.phone.name,
      brand: it.phone.brand,
      image: it.selectedColor.image || it.phone.images[0] || "/placeholder.png",
      storage: it.selectedStorage.size,
      color: it.selectedColor.name,
      price: it.selectedStorage.price,
      quantity: it.quantity,
    }));

    const deliveryMethodMapped: CustomerDetails["deliveryMethod"] =
      deliveryOption === "douala"
        ? "express_douala"
        : deliveryOption === "yaounde"
        ? "express_yaounde"
        : deliveryOption === "pickup"
        ? "pickup_bonapriso"
        : "nationwide";

    const paymentMethodMapped: CustomerDetails["paymentMethod"] =
      paymentMethod === "mtn"
        ? "mtn_momo"
        : paymentMethod === "orange"
        ? "orange_money"
        : "cash_on_delivery";

    const newOrder = createOrder({
      items: orderItems,
      customer: {
        fullName: fullName.trim(),
        email: profile?.email || user?.email || "client@auraluxe.cm",
        phone: phoneNum.trim(),
        address: address.trim() || (deliveryOption === "pickup" ? "Showroom Pick-Up" : "Address to confirm via call"),
        city: deliveryOption === "douala" ? "Douala" : deliveryOption === "yaounde" ? "Yaoundé" : "Cameroon",
        deliveryMethod: deliveryMethodMapped,
        paymentMethod: paymentMethodMapped,
      },
      subtotal,
      discount: 0,
      deliveryFee,
      total,
    });

    // Step progression provides clear visual feedback to reassure user
    setTimeout(() => setSubmissionStep(2), 500);
    setTimeout(() => setSubmissionStep(3), 1100);
    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?id=${newOrder.id}`);
    }, 1700);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Protocol Bar */}
        <div className="mb-6 pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                [ PROTOCOL // ACQUISITION CHECKOUT ]
              </span>
              <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                DISPATCH SECURE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-sans">
              Confirm Purchase & Delivery
            </h1>
          </div>
          <Link
            href="/phones"
            className="text-xs font-mono text-zinc-400 hover:text-[#D4AF37] flex items-center gap-1 transition"
          >
            <span>[ ← RETURN TO COLLECTION ]</span>
          </Link>
        </div>

        {/* VIP Account Notification Bar */}
        {profile ? (
          <div className="mb-6 p-3.5 bg-[#121217] border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-zinc-200 font-mono">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                AUTHENTICATED VIP CLIENT: <strong className="text-white">{profile.fullName || profile.email}</strong>
              </span>
            </div>
            <Link
              href="/account"
              className="text-[#D4AF37] hover:underline font-mono text-[11px] uppercase tracking-wider"
            >
              [ EDIT SAVED PROFILE → ]
            </Link>
          </div>
        ) : (
          <div className="mb-6 p-3.5 bg-[#121217] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-zinc-400 font-mono text-[11px]">
              HAVE AN AURA VIP ACCOUNT? SIGN IN FOR RAPID 1-TAP CHECKOUT & ORDER HISTORY.
            </span>
            <Link
              href="/account/login?redirect=/checkout"
              className="text-[#D4AF37] hover:underline font-mono text-[11px] font-bold uppercase tracking-wider"
            >
              [ SIGN IN / VIP LOGIN → ]
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* STEP 01: Contact & Identity */}
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 relative">
              <span className="absolute top-2 left-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
              <span className="absolute top-2 right-2 text-zinc-600 font-mono text-[10px] select-none">+</span>

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                    [ STEP 01 // IDENTITY & CONTACT ]
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">REQUIRED</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1.5 font-mono text-[11px] uppercase tracking-wider">
                    Full Legal Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jean-Paul Mbarga"
                    className="w-full bg-black border border-white/15 px-3.5 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37] transition font-sans"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5 font-mono text-[11px] uppercase tracking-wider">
                    WhatsApp & Phone Coordinate <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="flex">
                    <div className="bg-[#16161D] border border-white/15 border-r-0 px-3.5 py-3 text-xs font-mono text-[#D4AF37] flex items-center">
                      +237
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      placeholder="699 00 00 00"
                      className="w-full bg-black border border-white/15 px-3.5 py-3 text-sm text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-[#D4AF37] transition"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1.5 block">
                    Our concierge verifies this number prior to hardware vault release.
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 02: Logistics & Fulfillment */}
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 relative">
              <span className="absolute top-2 left-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
              <span className="absolute top-2 right-2 text-zinc-600 font-mono text-[10px] select-none">+</span>

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                    [ STEP 02 // LOGISTICS & FULFILLMENT ]
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">CAMEROON</span>
              </div>

              {/* Modular 4-Way Location Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { id: "douala", label: "DOUALA", sub: "SAME DAY EXPRESS", fee: "2,500 F" },
                  { id: "yaounde", label: "YAOUNDÉ", sub: "SAME DAY EXPRESS", fee: "2,500 F" },
                  { id: "nationwide", label: "OTHER TOWNS", sub: "24-48H DISPATCH", fee: "5,000 F" },
                  { id: "pickup", label: "SHOWROOM", sub: "BONAPRISO/BASTOS", fee: "FREE" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryOption(opt.id as any)}
                    className={`p-3 text-left border transition-all cursor-pointer relative ${
                      deliveryOption === opt.id
                        ? "bg-[#16161D] border-[#D4AF37] text-white"
                        : "bg-black border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {deliveryOption === opt.id && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D4AF37]"></span>
                    )}
                    <span className="text-xs font-bold block font-mono tracking-wider">{opt.label}</span>
                    <span className="text-[9px] text-zinc-500 block font-mono mt-0.5">{opt.sub}</span>
                    <span
                      className={`text-[10px] font-mono font-bold block mt-2 ${
                        deliveryOption === opt.id ? "text-[#D4AF37]" : "text-zinc-500"
                      }`}
                    >
                      {opt.fee}
                    </span>
                  </button>
                ))}
              </div>

              {/* Delivery Address or Showroom Pickup Notice */}
              {deliveryOption !== "pickup" ? (
                <div>
                  <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-1.5">
                    Delivery Landmark / Quarter / Residence
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Bonapriso, Rue Tokoto or Bastos, face Ambassade"
                    className="w-full bg-black border border-white/15 px-3.5 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37] transition font-sans"
                  />
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    Couriers call your phone coordinate upon departure from local hub.
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-black border border-[#D4AF37]/30 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[#D4AF37] font-bold text-xs uppercase mb-1">
                    <Store className="w-3.5 h-3.5" />
                    <span>SHOWROOM BOUTIQUE COLLECTION:</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    AURA Bonapriso (Douala) or AURA Bastos (Yaoundé). Unit prepared and sealed within 30 minutes after placement.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 03: Settlement Channel */}
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 relative">
              <span className="absolute top-2 left-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
              <span className="absolute top-2 right-2 text-zinc-600 font-mono text-[10px] select-none">+</span>

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-[#D4AF37]" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                    [ STEP 03 // SETTLEMENT CHANNEL ]
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">SAFE PAYMENT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "cod",
                    title: "Cash on Inspection",
                    desc: "Pay in cash after in-person unsealing & verification",
                    badge: "RECOMMENDED",
                  },
                  {
                    id: "mtn",
                    title: "MTN MoMo",
                    desc: settings.mtnMomoNumber || "Dial *126# upon arrival of courier",
                    badge: "MOBILE MONEY",
                  },
                  {
                    id: "orange",
                    title: "Orange Money",
                    desc: settings.orangeMoneyNumber || "Dial #150# upon arrival of courier",
                    badge: "MOBILE MONEY",
                  },
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`p-3.5 text-left border transition-all cursor-pointer relative ${
                      paymentMethod === pay.id
                        ? "bg-[#16161D] border-[#D4AF37] text-white"
                        : "bg-black border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider">
                        {pay.badge}
                      </span>
                      {paymentMethod === pay.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white block font-sans">{pay.title}</span>
                    <span className="text-[10px] text-zinc-500 block mt-1 leading-snug">
                      {pay.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Manifest & Confirmation (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 lg:sticky lg:top-24 relative">
              <span className="absolute top-2 left-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
              <span className="absolute top-2 right-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
              <span className="absolute bottom-2 left-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
              <span className="absolute bottom-2 right-2 text-zinc-600 font-mono text-[10px] select-none">+</span>

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                    [ MANIFEST // {items.length} {items.length === 1 ? "DEVICE" : "DEVICES"} ]
                  </h3>
                </div>
                <Link
                  href="/phones"
                  className="text-[10px] font-mono text-[#D4AF37] hover:underline uppercase"
                >
                  [ EDIT ]
                </Link>
              </div>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-white/5">
                {items.map((it) => (
                  <div key={it.id} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                    <div className="w-12 h-14 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={it.selectedColor.image || it.phone.images[0]}
                        alt={it.phone.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate text-xs">{it.phone.name}</h4>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                        {it.selectedStorage.size} • {it.selectedColor.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        QTY: {it.quantity}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#D4AF37] text-xs">
                        {formatCFA(it.selectedStorage.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Calculation Sheet */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>[ SUBTOTAL ]</span>
                  <span className="text-zinc-200">{formatCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>[ FULFILLMENT & LOGISTICS ]</span>
                  <span className="text-zinc-200">
                    {deliveryFee === 0 ? "FREE" : formatCFA(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-white/15">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    [ TOTAL DUE ]
                  </span>
                  <span className="text-xl font-black text-[#D4AF37]">
                    {formatCFA(total)}
                  </span>
                </div>
              </div>

              {/* High-Impact Architectural Command Triggers */}
              <div className="space-y-2.5 pt-5">
                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-95 transition min-h-[48px] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="font-mono">INITIALIZING ACQUISITION...</span>
                  ) : (
                    <>
                      <span>AUTHORIZE ORDER / DISPATCH REQUEST</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Secondary WhatsApp 1-Tap Direct Trigger */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition min-h-[44px] cursor-pointer font-mono"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>CONFIRM DIRECT VIA WHATSAPP (1-TAP)</span>
                </button>
              </div>

              {/* Guarantees Blueprint Strip */}
              <div className="pt-4 border-t border-white/10 mt-4 text-[10px] font-mono text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold uppercase">[ 100% GENUINE HARDWARE • 12M WARRANTY ]</span>
                </div>
                <p className="text-zinc-500 text-[10px]">
                  Physical inspection permitted prior to payment upon hand delivery.
                </p>
              </div>

            </div>
          </div>

        </form>

      </div>

      {/* Interactive Acquisition Processing Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E12] border border-[#D4AF37] p-6 sm:p-8 relative shadow-2xl">
            {/* Viewfinder crosshairs */}
            <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

            <div className="space-y-5 text-center">
              {/* Spinning gold radar indicator */}
              <div className="w-14 h-14 bg-black border border-white/20 flex items-center justify-center mx-auto relative">
                <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent animate-spin"></div>
                <span className="absolute text-[8px] font-mono font-bold text-[#D4AF37]">
                  {submissionStep * 33}%
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                  [ EXECUTING ACQUISITION PROTOCOL ]
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono mt-1">
                  Authorizing Order Placement
                </h3>
              </div>

              {/* Progress gauge */}
              <div className="w-full h-1.5 bg-black border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B38F28] via-[#D4AF37] to-[#F3E5AB] transition-all duration-300 ease-out"
                  style={{ width: `${submissionStep * 33 + (submissionStep === 3 ? 1 : 0)}%` }}
                />
              </div>

              {/* Step progression ticker */}
              <div className="space-y-2 text-left pt-2 font-mono text-[11px]">
                <div
                  className={`p-2 border flex items-center gap-2 transition-colors ${
                    submissionStep >= 1
                      ? "bg-[#141419] border-[#D4AF37]/50 text-white"
                      : "bg-black border-white/5 text-zinc-600"
                  }`}
                >
                  <span className="text-[#D4AF37] font-bold">01 //</span>
                  <span>Allocating Sealed Unit from Boutique Vault...</span>
                </div>

                <div
                  className={`p-2 border flex items-center gap-2 transition-colors ${
                    submissionStep >= 2
                      ? "bg-[#141419] border-[#D4AF37]/50 text-white"
                      : "bg-black border-white/5 text-zinc-600"
                  }`}
                >
                  <span className="text-[#D4AF37] font-bold">02 //</span>
                  <span>Generating Order Ref & Serial Registry...</span>
                </div>

                <div
                  className={`p-2 border flex items-center gap-2 transition-colors ${
                    submissionStep >= 3
                      ? "bg-[#141419] border-[#D4AF37]/50 text-white"
                      : "bg-black border-white/5 text-zinc-600"
                  }`}
                >
                  <span className="text-[#D4AF37] font-bold">03 //</span>
                  <span>Routing Dispatch to Regional Courier Hub...</span>
                </div>
              </div>

              <p className="text-[10px] font-mono text-zinc-500">
                Please hold. Preparing your order manifest & receipt...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
