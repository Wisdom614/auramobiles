"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Truck,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  Package,
  Store,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { useOrders } from "@/lib/store/orders-context";
import { Order } from "@/lib/data/mock-orders";
import { getOrdersFromDB } from "@/lib/supabase/client";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { getOrder, orders } = useOrders();

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (orderId) {
        // 1. Try from context
        const local = getOrder(orderId);
        if (local) {
          setActiveOrder(local);
          return;
        }

        // 2. Try from Supabase
        const dbOrders = await getOrdersFromDB();
        const found = dbOrders?.find(
          (o) => o.id.toLowerCase() === orderId.toLowerCase()
        );
        if (found) {
          setActiveOrder(found);
          return;
        }
      }

      // 3. Fall back to the most recent order in context or default order
      if (orders && orders.length > 0) {
        setActiveOrder(orders[0]);
      }
    }

    loadOrder();
  }, [orderId, getOrder, orders]);

  const copyOrderId = () => {
    if (!activeOrder) return;
    navigator.clipboard.writeText(activeOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const displayId = activeOrder?.id || orderId || "AUR-32900";
  const customerName = activeOrder?.customer?.fullName || "Valued Client";
  const customerPhone = activeOrder?.customer?.phone || "+237 6XX XX XX XX";
  const city = activeOrder?.customer?.city || "Douala / Yaoundé";
  const totalFCFA = activeOrder?.total || 980000;

  // Pre-filled WhatsApp direct link for expediting
  const waMessage = `Hello AURA Luxe Mobile, I just placed order *${displayId}* for *${customerName}*. Please confirm my order and arrange delivery.`;
  const waUrl = `https://wa.me/237699442100?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#09090B] text-white py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* CELEBRATION HEADER */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#1F1B12] to-[#121217] border border-[#D4AF37]/50 flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20 mx-auto">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-black">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
              Order Confirmed & Logged
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Thank You, {customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto mt-1">
              Your flagship device has been reserved in our boutique vault.
            </p>
          </div>

          {/* Order ID Pill with Copy */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#121217] border border-white/10 shadow-lg">
            <span className="text-xs text-white/50">Order Reference:</span>
            <span className="font-mono font-bold text-sm text-[#D4AF37]">{displayId}</span>
            <button
              onClick={copyOrderId}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CRUCIAL NEXT STEP: WE WILL CONTACT YOU VIA WHATSAPP OR CALL FIRST */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-b from-[#1A1712] via-[#141419] to-[#121217] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Attention Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                    What Happens Next?
                  </h2>
                  <p className="text-xs text-[#F3E5AB]">
                    Important: Our boutique concierge will contact you before dispatch
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider animate-pulse">
                Within 15–30 Mins
              </span>
            </div>

            {/* Direct Explanation */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                We never dispatch unconfirmed parcels blindly. A dedicated <strong>AURA Luxe concierge manager</strong> will call you directly or message your WhatsApp at:
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#17171F] border border-[#D4AF37]/30 text-[#D4AF37] font-mono font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{customerPhone}</span>
              </div>
            </div>

            {/* 3 Step Protocol */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#17171F] border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-white text-sm">Order & Address Check</h3>
                <p className="text-white/60 leading-relaxed">
                  We confirm your device model, storage variant, and specific delivery landmark or showroom pick-up slot.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#17171F] border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-bold text-white text-sm">IMEI & Quality Sealing</h3>
                <p className="text-white/60 leading-relaxed">
                  Your device is taken from the vault, serial number recorded, and packaged with the official 12-month warranty certificate.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#17171F] border border-white/5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="font-bold text-white text-sm">Inspect Before Paying</h3>
                <p className="text-white/60 leading-relaxed">
                  Our VIP courier delivers to your hands. You open and inspect the sealed hardware in person before paying.
                </p>
              </div>
            </div>

            {/* 1-Tap WhatsApp Expedite & Call CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition shadow-xl shadow-[#25D366]/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Expedite via WhatsApp Now</span>
              </a>

              <a
                href="tel:+237699442100"
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/15 flex items-center justify-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>Call Douala Dispatch</span>
              </a>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY & RECEIPT */}
        {activeOrder && (
          <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>Order Summary ({activeOrder.items?.length || 1} Device)</span>
              </h3>
              <span className="text-xs text-white/50 capitalize">
                Destination: <strong className="text-white">{city}</strong>
              </span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-white/5">
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-white/50">
                        {item.storage} • {item.color} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-[#D4AF37]">
                      {formatCFA(item.price * item.quantity)}
                    </div>
                    <span className="text-[10px] text-emerald-400">12M Official Warranty</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-mono text-white">{formatCFA(activeOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Delivery & Insurance</span>
                <span className="font-mono text-emerald-400">
                  {activeOrder.deliveryFee === 0 ? "FREE" : formatCFA(activeOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm">
                <span className="font-bold text-white">Total Amount</span>
                <span className="text-xl font-black font-mono text-[#D4AF37]">
                  {formatCFA(activeOrder.total)}
                </span>
              </div>
              <div className="text-[11px] text-white/50 capitalize pt-1">
                Payment Channel:{" "}
                <strong className="text-white">{activeOrder.customer?.paymentMethod?.replace("_", " ") || "Cash on Delivery"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href={`/orders?id=${displayId}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition"
          >
            <span>Track Live Dispatch Status</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <Link
            href="/phones"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg"
          >
            <span>Return to Boutique Collection</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-[11px] text-white/40">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>100% Genuine Sealed Hardware</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            <span>Same-Day VIP Delivery (Douala & Yaoundé)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Store className="w-4 h-4 text-[#D4AF37]" />
            <span>Showroom Pick-Up in Bonapriso & Bastos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white text-xs">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
