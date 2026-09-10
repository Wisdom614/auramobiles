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
  User,
  MapPin,
  Banknote,
  Store,
  Sparkles,
  Truck,
  FileCheck,
  Tag,
  Check,
  X,
  CreditCard,
  Lock,
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
  const [deliveryOption, setDeliveryOption] = useState<"buea" | "douala" | "yaounde" | "nationwide" | "pickup">("buea");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mtn" | "orange">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(1);

  // Voucher / Promo Code state
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState("");
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  // Auto-fill from authenticated profile
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
        if (c.includes("buea") || c.includes("molyko")) setDeliveryOption("buea");
        else if (c.includes("douala")) setDeliveryOption("douala");
        else if (c.includes("yaound")) setDeliveryOption("yaounde");
        else if (c.includes("other") || c.includes("bafoussam") || c.includes("kribi")) setDeliveryOption("nationwide");
      }
    }
  }, [profile]);

  // Delivery fee calculation
  const isEligibleFreeDelivery = subtotal >= (settings.freeDeliveryThreshold || 500000);
  const deliveryFee =
    deliveryOption === "pickup"
      ? 0
      : isEligibleFreeDelivery
      ? 0
      : deliveryOption === "buea"
      ? (settings.deliveryFeeBuea || 1500)
      : settings.deliveryFeeNationwide;

  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError("");
    const code = voucherCode.trim().toUpperCase();

    if (!code) {
      setVoucherError("Please enter a voucher code.");
      return;
    }

    if (code.startsWith("SWAP-") || code.includes("TRADE")) {
      setAppliedVoucher({ code, discount: 50000 });
      setVoucherError("");
    } else if (code === "AURALUXE" || code === "VIP10") {
      const disc = Math.round(subtotal * 0.05);
      setAppliedVoucher({ code, discount: disc });
      setVoucherError("");
    } else if (code === "FREESHIP") {
      setAppliedVoucher({ code, discount: deliveryFee || 3500 });
      setVoucherError("");
    } else {
      setVoucherError("Invalid or expired voucher code. Try SWAP-1234 or AURALUXE");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherError("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20 relative font-sans">
        <div className="max-w-md w-full border border-white/10 bg-[#0E0E12] p-8 sm:p-10 relative rounded-none">
          <div className="w-14 h-14 bg-black border border-white/15 flex items-center justify-center mx-auto mb-5 text-[#D4AF37]">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-white uppercase tracking-wider mb-2 font-sans">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            You haven&apos;t added any phones to your cart yet. Explore our authentic collection of brand new sealed &amp; certified pre-owned phones.
          </p>

          <Link
            href="/phones"
            className="w-full inline-block py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition font-mono rounded-none"
          >
            Browse All Phones
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
        ? "Showroom Pickup — Buea, Molyko Hub"
        : `${deliveryOption.toUpperCase()} - ${address || "Address to confirm via call"}`;

    const text = `Hello ${settings.storeName}, I want to place an order:\n\n*Customer:* ${fullName || "Client"}\n*Phone:* ${phoneNum || "Via WhatsApp"}\n*Delivery:* ${deliveryText}\n*Payment:* ${
      paymentMethod === "cod" ? "Pay on Delivery (Inspect First)" : paymentMethod === "mtn" ? "MTN MoMo" : "Orange Money"
    }\n\n*Items Ordered:*\n${itemList}\n${discountAmount > 0 ? `*Discount (${appliedVoucher?.code}):* -${formatCFA(discountAmount)}\n` : ""}*Total Amount:* ${formatCFA(total)}\n\nPlease confirm availability and dispatch.`;

    const waNum = settings.whatsappCleanNumber || "237699442100";
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNum.trim()) {
      alert("Please enter your Full Name and WhatsApp phone number.");
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
      deliveryOption === "buea"
        ? "express_buea"
        : deliveryOption === "pickup"
        ? "pickup_molyko"
        : deliveryOption === "douala"
        ? "express_douala"
        : deliveryOption === "yaounde"
        ? "express_yaounde"
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
        city:
          deliveryOption === "buea" || deliveryOption === "pickup"
            ? "Buea"
            : deliveryOption === "douala"
            ? "Douala"
            : deliveryOption === "yaounde"
            ? "Yaoundé"
            : "Cameroon",
        deliveryMethod: deliveryMethodMapped,
        paymentMethod: paymentMethodMapped,
      },
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total,
    });

    // Dispatch background email
    fetch("/api/email/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    }).catch((emailErr) => {
      console.warn("Background order email trigger warning:", emailErr);
    });

    setTimeout(() => setSubmissionStep(2), 500);
    setTimeout(() => setSubmissionStep(3), 1100);
    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?id=${newOrder.id}`);
    }, 1700);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Header Bar */}
        <div className="pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                SECURE CHECKOUT
              </span>
              <span className="w-1.5 h-1.5 rounded-none bg-emerald-400"></span>
              <span className="text-[10px] font-mono text-zinc-400">
                CAMEROON EXPRESS DISPATCH
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
              Complete Your Order
            </h1>
          </div>
          <Link
            href="/phones"
            className="text-xs font-mono text-zinc-400 hover:text-[#D4AF37] flex items-center gap-1 transition"
          >
            <span>← Back to All Phones</span>
          </Link>
        </div>

        {/* Free Delivery Unlock Banner */}
        {isEligibleFreeDelivery && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs font-mono text-emerald-300">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>VIP Privilege:</strong> Your order qualifies for <strong>FREE Express Delivery</strong> anywhere in Cameroon!
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 font-bold uppercase shrink-0">
              SAVED FCFA 3,500
            </span>
          </div>
        )}

        {/* VIP Profile Status Strip */}
        {profile ? (
          <div className="p-3.5 bg-[#121217] border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-zinc-200">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                Ordering as: <strong className="text-white">{profile.fullName || profile.email}</strong>
              </span>
            </div>
            <Link
              href="/account"
              className="text-[#D4AF37] hover:underline text-[11px] uppercase tracking-wider font-semibold"
            >
              Account Settings →
            </Link>
          </div>
        ) : (
          <div className="p-3.5 bg-[#121217] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-zinc-400 text-[11px]">
              Already an AURA client? Sign in for 1-tap auto-fill &amp; order history.
            </span>
            <Link
              href="/account/login?redirect=/checkout"
              className="text-[#D4AF37] hover:underline text-[11px] font-bold uppercase tracking-wider"
            >
              Client Sign In →
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* STEP 01: Contact Information */}
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 relative rounded-none shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-[#D4AF37] text-black text-xs font-mono font-bold flex items-center justify-center">
                    01
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Contact &amp; WhatsApp
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 1 of 3</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 mb-1.5 text-[11px] uppercase tracking-wider font-semibold font-mono">
                    Your Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Wisdom Besong"
                    className="w-full bg-black border border-white/15 px-3.5 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37] transition font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1.5 text-[11px] uppercase tracking-wider font-semibold font-mono">
                    WhatsApp &amp; Phone Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="flex">
                    <div className="bg-[#16161D] border border-white/15 border-r-0 px-3.5 py-3 text-xs font-mono text-[#D4AF37] flex items-center font-bold">
                      +237
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      placeholder="699 00 00 00"
                      className="w-full bg-black border border-white/15 px-3.5 py-3 text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-[#D4AF37] transition rounded-none"
                    />
                  </div>
                  <span className="text-[10.5px] text-zinc-400 mt-1.5 block font-mono">
                    Our store manager will message or call you to confirm before dispatch.
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 02: Delivery Location */}
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 relative rounded-none shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-[#D4AF37] text-black text-xs font-mono font-bold flex items-center justify-center">
                    02
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Delivery Logistics
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 2 of 3</span>
              </div>

              {/* Location Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {[
                  { id: "buea", label: "BUEA", sub: "Same-Day (1-2h)", fee: isEligibleFreeDelivery ? "FREE" : "1,500 FCFA" },
                  { id: "pickup", label: "MOLYKO HUB", sub: "Showroom Pick-Up", fee: "FREE" },
                  { id: "douala", label: "DOUALA", sub: "Express (24h)", fee: isEligibleFreeDelivery ? "FREE" : "3,500 FCFA" },
                  { id: "yaounde", label: "YAOUNDÉ", sub: "Express (24h)", fee: isEligibleFreeDelivery ? "FREE" : "3,500 FCFA" },
                  { id: "nationwide", label: "OTHER TOWNS", sub: "Agency (24-48h)", fee: isEligibleFreeDelivery ? "FREE" : "3,500 FCFA" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryOption(opt.id as any)}
                    className={`p-3 text-left border transition-all cursor-pointer relative rounded-none ${
                      deliveryOption === opt.id
                        ? "bg-[#16161D] border-[#D4AF37] text-white ring-1 ring-[#D4AF37]"
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
                  <label className="block text-zinc-300 text-[11px] uppercase tracking-wider mb-1.5 font-semibold font-mono">
                    Delivery Address / Quarter / Landmark
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Molyko Checkpoint, Buea or Akwa, Douala"
                    className="w-full bg-black border border-white/15 px-3.5 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37] transition font-sans rounded-none"
                  />
                  <span className="text-[10.5px] text-zinc-400 mt-1 block font-mono">
                    Our courier will call your phone number when approaching your address.
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-black border border-[#D4AF37]/30 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[#D4AF37] font-bold text-xs uppercase mb-1">
                    <Store className="w-3.5 h-3.5" />
                    <span>Free Showroom Pick-Up in Buea:</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    AURA Flagship Showroom: Checkpoint, Molyko, Buea. Your phone will be prepared for testing and pickup in 30 minutes.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 03: Payment Method */}
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 relative rounded-none shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-[#D4AF37] text-black text-xs font-mono font-bold flex items-center justify-center">
                    03
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Payment Method
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 3 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "cod",
                    title: "Pay on Delivery",
                    desc: "Inspect & test the phone first, then pay the courier.",
                    badge: "RECOMMENDED",
                    color: "text-[#D4AF37]",
                  },
                  {
                    id: "mtn",
                    title: "MTN MoMo",
                    desc: settings.mtnMomoNumber || "Pay via MTN Mobile Money (*126#)",
                    badge: "*126# MOMO",
                    color: "text-amber-400",
                  },
                  {
                    id: "orange",
                    title: "Orange Money",
                    desc: settings.orangeMoneyNumber || "Pay via Orange Money (#150#)",
                    badge: "#150# OM",
                    color: "text-orange-400",
                  },
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`p-3.5 text-left border transition-all cursor-pointer relative rounded-none ${
                      paymentMethod === pay.id
                        ? "bg-[#16161D] border-[#D4AF37] text-white ring-1 ring-[#D4AF37]"
                        : "bg-black border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-mono uppercase tracking-wider font-bold ${pay.color}`}>
                        {pay.badge}
                      </span>
                      {paymentMethod === pay.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white block font-sans">{pay.title}</span>
                    <span className="text-[10.5px] text-zinc-400 block mt-1 leading-snug font-mono">
                      {pay.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 bg-[#0E0E12] border border-white/10 lg:sticky lg:top-24 relative rounded-none shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Order Summary ({items.length} {items.length === 1 ? "phone" : "phones"})
                  </h3>
                </div>
                <Link
                  href="/phones"
                  className="text-[10px] text-[#D4AF37] hover:underline uppercase"
                >
                  Edit Cart
                </Link>
              </div>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-white/5">
                {items.map((it) => (
                  <div key={it.id} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                    <div className="w-12 h-14 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0 rounded-none">
                      <img
                        src={it.selectedColor.image || it.phone.images[0]}
                        alt={it.phone.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 font-sans">
                      <h4 className="font-bold text-white truncate text-xs">{it.phone.name}</h4>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                        {it.selectedStorage.size} • {it.selectedColor.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        Qty: {it.quantity}
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

              {/* Promo / Voucher Code Box */}
              <div className="pt-3 border-t border-white/10">
                {!appliedVoucher ? (
                  <div>
                    {!isVoucherOpen ? (
                      <button
                        type="button"
                        onClick={() => setIsVoucherOpen(true)}
                        className="text-[11px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer uppercase font-bold"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Have a Trade-In Voucher or Promo Code?</span>
                      </button>
                    ) : (
                      <div className="space-y-2 font-mono">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            placeholder="Enter Code (e.g. SWAP-1234)"
                            className="flex-1 bg-black border border-white/20 px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-[#D4AF37] rounded-none"
                          />
                          <button
                            type="button"
                            onClick={handleApplyVoucher}
                            className="px-3 py-1.5 gold-gradient-bg text-black font-extrabold text-[11px] uppercase cursor-pointer rounded-none"
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            onClick={() => { setIsVoucherOpen(false); setVoucherError(""); }}
                            className="p-1.5 text-zinc-500 hover:text-white cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {voucherError && (
                          <p className="text-[10px] text-rose-400">{voucherError}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Voucher: <strong>{appliedVoucher.code}</strong> (-{formatCFA(appliedVoucher.discount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-zinc-400 hover:text-rose-400 cursor-pointer"
                      title="Remove voucher"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">{formatCFA(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount / Voucher</span>
                    <span>-{formatCFA(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Fee</span>
                  <span className="text-zinc-200">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatCFA(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-white/15">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-[#D4AF37]">
                    {formatCFA(total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3">
                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-95 transition min-h-[48px] cursor-pointer disabled:opacity-50 font-mono shadow-lg shadow-amber-500/10 rounded-none"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order (Pay on Delivery)</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Secondary WhatsApp 1-Tap Trigger */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition min-h-[44px] cursor-pointer font-mono rounded-none"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order via WhatsApp (Instant Reply)</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-white/10 text-[10.5px] text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold uppercase">100% Authentic Devices • Official Warranty</span>
                </div>
                <p className="text-zinc-500 text-[10px] font-sans">
                  You can inspect and test the device before completing payment.
                </p>
              </div>

            </div>
          </div>

        </form>

      </div>

      {/* Order Processing Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0E0E12] border border-[#D4AF37] p-6 sm:p-8 relative shadow-2xl rounded-none">
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 bg-black border border-white/20 flex items-center justify-center mx-auto relative rounded-none">
                <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent animate-spin"></div>
                <span className="absolute text-[8px] font-mono font-bold text-[#D4AF37]">
                  {submissionStep * 33}%
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold block">
                  PROCESSING ORDER
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans mt-1">
                  Confirming Your Smartphone Order
                </h3>
              </div>

              {/* Progress gauge */}
              <div className="w-full h-1.5 bg-black border border-white/10 overflow-hidden rounded-none">
                <div
                  className="h-full bg-gradient-to-r from-[#B38F28] via-[#D4AF37] to-[#F3E5AB] transition-all duration-300 ease-out"
                  style={{ width: `${submissionStep * 33 + (submissionStep === 3 ? 1 : 0)}%` }}
                />
              </div>

              {/* Step progression ticker */}
              <div className="space-y-2 text-left pt-2 font-mono text-[11px]">
                <div
                  className={`p-2 border flex items-center gap-2 transition-colors rounded-none ${
                    submissionStep >= 1
                      ? "bg-[#141419] border-[#D4AF37]/50 text-white"
                      : "bg-black border-white/5 text-zinc-600"
                  }`}
                >
                  <span className="text-[#D4AF37] font-bold">01 •</span>
                  <span>Reserving device in Buea Showroom...</span>
                </div>

                <div
                  className={`p-2 border flex items-center gap-2 transition-colors rounded-none ${
                    submissionStep >= 2
                      ? "bg-[#141419] border-[#D4AF37]/50 text-white"
                      : "bg-black border-white/5 text-zinc-600"
                  }`}
                >
                  <span className="text-[#D4AF37] font-bold">02 •</span>
                  <span>Generating Order Receipt &amp; Warranty Code...</span>
                </div>

                <div
                  className={`p-2 border flex items-center gap-2 transition-colors rounded-none ${
                    submissionStep >= 3
                      ? "bg-[#141419] border-[#D4AF37]/50 text-white"
                      : "bg-black border-white/5 text-zinc-600"
                  }`}
                >
                  <span className="text-[#D4AF37] font-bold">03 •</span>
                  <span>Connecting to Courier Dispatch Network...</span>
                </div>
              </div>

              <p className="text-[10px] text-zinc-400 font-mono">
                Please do not refresh the page.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
