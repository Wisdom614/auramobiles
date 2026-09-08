"use client";

import React, { useState } from "react";
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
  Smartphone,
  Store,
} from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatCFA } from "@/lib/formatters";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Low-effort, minimum typing form state
  const [fullName, setFullName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"douala" | "yaounde" | "nationwide" | "pickup">("douala");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mtn" | "orange">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery fee calculation
  const deliveryFee =
    deliveryOption === "pickup"
      ? 0
      : deliveryOption === "nationwide"
      ? 5000
      : 2500; // Flat 2,500 FCFA for Douala/Yaoundé express

  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#141419] border border-white/10 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Your Bag is Empty</h1>
        <p className="text-xs text-zinc-400 mb-6 max-w-xs">
          Select a smartphone from our curated collection before checking out.
        </p>
        <Link
          href="/phones"
          className="px-6 py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider"
        >
          Browse Smartphones
        </Link>
      </div>
    );
  }

  // Preformatted WhatsApp message for instant 1-tap ordering
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
        ? "Showroom Pickup (Bonapriso/Bastos)"
        : `${deliveryOption.toUpperCase()} - ${address || "Address to specify"}`;

    const text = `Hello AURA Mobile, I want to confirm my order:\n\n*Customer:* ${fullName || "Customer"}\n*Phone:* ${phoneNum || "Via WhatsApp"}\n*Delivery:* ${deliveryText}\n*Payment:* ${
      paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "mtn" ? "MTN MoMo" : "Orange Money"
    }\n\n*Items:*\n${itemList}\n\n*Total:* ${formatCFA(total)}\n\nPlease proceed with order dispatch.`;

    window.open(`https://wa.me/237699442100?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNum.trim()) {
      alert("Please provide your Name and WhatsApp phone number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      router.push(`/orders?id=${orderId}&placed=true`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Simple Top Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">
              Fast Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Confirm Your Purchase
            </h1>
          </div>
          <Link
            href="/phones"
            className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 hidden sm:block"
          >
            ← Continue Shopping
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Single-Screen Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. Contact Information */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/8 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>1. Your Contact</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">
                    Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jean-Paul Mbarga"
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">
                    WhatsApp / Phone Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">
                      +237
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      placeholder="699 00 00 00"
                      className="w-full bg-[#181820] border border-white/10 rounded-xl pl-16 pr-3.5 py-3 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    We will send delivery tracking updates to this number via WhatsApp or SMS.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Delivery Option */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/8 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>2. Delivery Location</span>
              </h2>

              {/* City Choice Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "douala", label: "Douala", sub: "Same Day", fee: "2,500 F" },
                  { id: "yaounde", label: "Yaoundé", sub: "Same Day", fee: "2,500 F" },
                  { id: "nationwide", label: "Other Towns", sub: "24-48h", fee: "5,000 F" },
                  { id: "pickup", label: "Boutique", sub: "Showroom", fee: "FREE" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryOption(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      deliveryOption === opt.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                        : "bg-[#181820] border-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className="text-[10px] text-zinc-400 block">{opt.sub}</span>
                    <span className={`text-[10px] font-mono font-bold block mt-1 ${deliveryOption === opt.id ? "text-[#D4AF37]" : "text-zinc-500"}`}>
                      {opt.fee}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quarter / Street Address */}
              {deliveryOption !== "pickup" ? (
                <div>
                  <label className="block text-zinc-400 text-xs mb-1 font-medium">
                    Quarter / Street / Landmark
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Bonapriso, Rue Tokoto or Bastos, face ambassade"
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 text-xs text-amber-200">
                  <div className="flex items-center gap-2 font-bold mb-0.5">
                    <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Showroom Pick-up Available:</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    AURA Bonapriso (Douala) or AURA Bastos (Yaoundé). Ready in 30 minutes after confirmation.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Payment Option */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/8 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Banknote className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>3. Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: "cod",
                    title: "Cash on Delivery",
                    desc: "Pay when you receive & inspect phone",
                  },
                  {
                    id: "mtn",
                    title: "MTN MoMo",
                    desc: "Dial *126# upon order arrival",
                  },
                  {
                    id: "orange",
                    title: "Orange Money",
                    desc: "Dial *150# upon order arrival",
                  },
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === pay.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white"
                        : "bg-[#181820] border-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white block">{pay.title}</span>
                      {paymentMethod === pay.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-1 leading-snug">
                      {pay.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Instant Confirm (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#121217] border border-white/8 space-y-4 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Order Summary ({items.length} {items.length === 1 ? "device" : "devices"})
                </h3>
                <Link
                  href="/phones"
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Edit
                </Link>
              </div>

              {/* Items Mini List */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={it.selectedColor.image || it.phone.images[0]}
                      alt={it.phone.name}
                      className="w-10 h-12 object-contain rounded-lg bg-black border border-white/5 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{it.phone.name}</h4>
                      <span className="text-[10px] text-zinc-400 block">
                        {it.selectedStorage.size} • {it.selectedColor.name} × {it.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#D4AF37] text-xs">
                      {formatCFA(it.selectedStorage.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculation */}
              <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-zinc-200">
                    {deliveryFee === 0 ? "FREE" : formatCFA(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                  <span className="font-bold text-white text-sm">Total Due</span>
                  <span className="text-xl font-black text-[#D4AF37] font-mono">
                    {formatCFA(total)}
                  </span>
                </div>
              </div>

              {/* High-Impact Actions */}
              <div className="space-y-2.5 pt-2">
                {/* Primary Confirm Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl gold-gradient-bg text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:opacity-95 transition-all min-h-[48px] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* 1-Tap WhatsApp Direct Option */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order Directly via WhatsApp</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-2 text-center text-[10px] text-zinc-500 space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Guaranteed Genuine • Official Warranty</span>
                </div>
                <p>Inspection allowed before payment upon delivery.</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
