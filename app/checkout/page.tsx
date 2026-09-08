"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { formatCFA } from "@/lib/formatters";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Douala");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("express_douala");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash_on_delivery");
  const [momoNumber, setMomoNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery fee calculation
  const deliveryFee =
    deliveryMethod === "pickup_bonapriso" || deliveryMethod === "pickup_bastos"
      ? 0
      : deliveryMethod === "nationwide"
      ? 7500
      : 5000;

  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20">
        <ShoppingBag className="w-12 h-12 text-zinc-600 mb-3 stroke-1" />
        <h1 className="text-2xl font-bold text-white mb-1">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-zinc-400 mb-6 max-w-sm">
          Please add a smartphone from our official flagship boutique before proceeding to checkout.
        </p>
        <Link
          href="/phones"
          className="px-6 py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider"
        >
          Browse Smartphones Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      router.push(`/orders?id=${orderId}&placed=true`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
            Secure Retail Checkout
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Customer Details, Delivery & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Recipient Details */}
            <div className="p-6 rounded-3xl bg-[#121217] border border-white/8 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>1. Client Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Eto'o"
                    className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For official warranty registration"
                    className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Destination */}
            <div className="p-6 rounded-3xl bg-[#121217] border border-white/8 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Fulfillment Method
              </h2>

              <div className="space-y-2 text-xs">
                {[
                  {
                    id: "express_douala",
                    title: "Same-Day Express Courier — Douala",
                    desc: "Delivered to your door in Bonapriso, Akwa, Deido, or Bonamoussadi (5,000 FCFA)",
                    fee: 5000,
                  },
                  {
                    id: "express_yaounde",
                    title: "Same-Day Express Courier — Yaoundé",
                    desc: "Delivered to your door in Bastos, Omnisports, Melen, or Odza (5,000 FCFA)",
                    fee: 5000,
                  },
                  {
                    id: "pickup_bonapriso",
                    title: "Showroom Collection — Douala Bonapriso Lounge",
                    desc: "Free physical pickup & complimentary data migration at Rue Tokoto (FREE)",
                    fee: 0,
                  },
                  {
                    id: "pickup_bastos",
                    title: "Showroom Collection — Yaoundé Bastos Lounge",
                    desc: "Free physical pickup & complimentary data migration at Avenue Bastos (FREE)",
                    fee: 0,
                  },
                  {
                    id: "nationwide",
                    title: "Secured Nationwide Transit (Bafoussam, Bamenda, Garoua...)",
                    desc: "Dispatched via secured VIP agency transit within 24–48 hours (7,500 FCFA)",
                    fee: 7500,
                  },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`p-3.5 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                      deliveryMethod === option.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]"
                        : "bg-[#16161D] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === option.id}
                        onChange={() => setDeliveryMethod(option.id)}
                        className="mt-1 text-[#D4AF37] focus:ring-0"
                      />
                      <div>
                        <strong className="text-white block font-semibold">
                          {option.title}
                        </strong>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">
                          {option.desc}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D4AF37] shrink-0 ml-2">
                      {option.fee === 0 ? "FREE" : formatCFA(option.fee)}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Street / Quarter Address (if home delivery)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Rue Tokoto, derrière la clinique"
                  className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 rounded-3xl bg-[#121217] border border-white/8 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Payment Method
              </h2>

              <div className="space-y-2 text-xs">
                {[
                  {
                    id: "cash_on_delivery",
                    title: "Cash on Delivery / Physical Handover",
                    desc: "Inspect your sealed phone, verify the official IMEI, and pay the courier directly.",
                  },
                  {
                    id: "mtn_momo",
                    title: "MTN Mobile Money",
                    desc: "Direct push prompt to your MTN Cameroon MoMo account (*126#).",
                  },
                  {
                    id: "orange_money",
                    title: "Orange Money Cameroon",
                    desc: "Direct OTP authorization via Orange Money Cameroon (#150#).",
                  },
                  {
                    id: "card",
                    title: "Credit / Debit Card (Visa, Mastercard)",
                    desc: "Secured encrypted international checkout.",
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? "bg-[#D4AF37]/15 border-[#D4AF37]"
                        : "bg-[#16161D] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="mt-1 text-[#D4AF37] focus:ring-0"
                    />
                    <div>
                      <strong className="text-white block font-semibold">
                        {pm.title}
                      </strong>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {pm.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {(paymentMethod === "mtn_momo" || paymentMethod === "orange_money") && (
                <div className="pt-2">
                  <label className="block text-xs text-zinc-400 mb-1">
                    {paymentMethod === "mtn_momo" ? "MTN MoMo" : "Orange Money"} Account Number:
                  </label>
                  <input
                    type="tel"
                    required
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full p-3 rounded-xl bg-[#16161D] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Placement (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
                Order Summary ({items.length} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={it.selectedColor.image || it.phone.images[0]}
                      alt={it.phone.name}
                      className="w-12 h-12 rounded-lg bg-black object-contain p-1 border border-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{it.phone.name}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {it.selectedStorage.size} • {it.selectedColor.name} × {it.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-[#D4AF37]">
                      {formatCFA(it.selectedStorage.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">{formatCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-mono text-white">
                    {deliveryFee === 0 ? "FREE" : formatCFA(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 text-sm font-bold">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-xl font-black text-[#D4AF37] font-mono">
                    {formatCFA(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 hover:opacity-95 disabled:opacity-50 transition-all"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>{isSubmitting ? "Securing Order..." : "Place Official Order"}</span>
              </button>

              <div className="pt-2 text-[11px] text-zinc-400 space-y-1.5 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>100% Genuine Sealed IMEI guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Same-day dispatch for Douala & Yaoundé</span>
                </div>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
