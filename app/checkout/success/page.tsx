"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  FileCheck,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { useOrders } from "@/lib/store/orders-context";
import { useSettings } from "@/lib/store/settings-context";
import { Order } from "@/lib/data/mock-orders";
import { getOrdersFromDB } from "@/lib/supabase/client";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { getOrder, orders } = useOrders();
  const { settings } = useSettings();

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
  const waMessage = `Hello ${settings.storeName || "AURA Luxe Mobile"}, I just placed order *${displayId}* for *${customerName}*. Please confirm my order and arrange delivery.`;
  const waNum = settings.whatsappCleanNumber || "237699442100";
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#09090B] text-white py-10 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* CELEBRATION & MANIFEST HEADER */}
        <div className="text-center space-y-4 border-b border-white/10 pb-8 relative">
          <div className="inline-flex items-center justify-center mb-1">
            <div className="w-16 h-16 bg-[#121217] border border-[#D4AF37] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/10 relative">
              <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D4AF37]"></span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest mb-3">
              [ STATUS // ORDER RECORD CONFIRMED & VAULT RESERVED ]
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              Order Confirmed — Thank You, {customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto mt-2 leading-relaxed">
              Your sealed flagship hardware has been logged and queued in our central boutique dispatch vault.
            </p>
          </div>

          {/* Viewfinder Framed Order Reference with Copy */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#0E0E12] border border-white/15 relative">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ORDER REF:</span>
            <span className="font-mono font-bold text-sm text-[#D4AF37] tracking-wider">{displayId}</span>
            <button
              onClick={copyOrderId}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition font-mono text-[10px] flex items-center gap-1 cursor-pointer border border-white/10"
              title="Copy Order ID"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#D4AF37]" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CRUCIAL NEXT STEP: CONCIERGE PROTOCOL (NOTHING & LEICA STYLING)   */}
        {/* ================================================================= */}
        <div className="bg-[#0E0E12] border border-[#D4AF37] p-6 sm:p-8 relative">
          {/* Viewfinder crosshairs */}
          <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

          <div className="space-y-6 relative z-10">
            
            {/* Attention Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
                    [ CONCIERGE PROTOCOL // WHAT HAPPENS NEXT ]
                  </h2>
                  <p className="text-xs text-[#F3E5AB]">
                    Our concierge manager will contact you to verify before courier dispatch
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-mono uppercase tracking-widest">
                [ DISPATCH WINDOW: 15–30 MINS ]
              </span>
            </div>

            {/* Direct Explanation */}
            <div className="p-4 bg-black border border-white/10 space-y-2.5">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                We never dispatch unconfirmed packages blindly. An <strong>AURA Concierge Manager</strong> will call or message your WhatsApp at:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#16161D] border border-white/20 text-[#D4AF37] font-mono font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{customerPhone}</span>
              </div>
            </div>

            {/* 3 Step Protocol Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-black border border-white/10 space-y-2">
                <div className="w-6 h-6 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-mono font-bold text-[10px]">
                  01
                </div>
                <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                  [ SPEC & ADDRESS CHECK ]
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We confirm your storage choice, color finish, and delivery address or showroom pickup slot.
                </p>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-2">
                <div className="w-6 h-6 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-mono font-bold text-[10px]">
                  02
                </div>
                <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                  [ IMEI & VAULT SEALING ]
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Device is drawn from the vault, serial number recorded, and bundled with the official boutique warranty certificate.
                </p>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-2">
                <div className="w-6 h-6 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-mono font-bold text-[10px]">
                  03
                </div>
                <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                  [ INSPECT BEFORE PAYING ]
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Our private VIP courier delivers directly to you. You inspect and unseal the hardware before paying.
                </p>
              </div>
            </div>

            {/* 1-Tap WhatsApp Expedite & Call CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3.5 px-5 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/50 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition cursor-pointer font-mono"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>EXPEDITE DISPATCH VIA WHATSAPP (1-TAP)</span>
              </a>

              <a
                href={`tel:${settings.secondaryPhone.replace(/[^0-9+]/g, "") || "+237699442100"}`}
                className="w-full sm:w-auto py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/15 flex items-center justify-center gap-2 transition font-mono"
              >
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                <span>CALL DISPATCH DESK</span>
              </a>
            </div>

          </div>
        </div>

        {/* ORDER SUMMARY & ARCHITECTURAL MANIFEST */}
        {activeOrder && (
          <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-7 space-y-6 relative">
            <span className="absolute top-2 left-2 text-zinc-600 font-mono text-[10px] select-none">+</span>
            <span className="absolute top-2 right-2 text-zinc-600 font-mono text-[10px] select-none">+</span>

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                  [ ORDER MANIFEST // {activeOrder.items?.length || 1} DEVICE ]
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                DESTINATION: <strong className="text-white">{city}</strong>
              </span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-white/5">
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        {item.storage} • {item.color} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-[#D4AF37]">
                      {formatCFA(item.price * item.quantity)}
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase block mt-0.5">
                      OFFICIAL BOUTIQUE WARRANTY
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>[ SUBTOTAL ]</span>
                <span className="text-white">{formatCFA(activeOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>[ LOGISTICS & INSURANCE ]</span>
                <span className="text-emerald-400">
                  {activeOrder.deliveryFee === 0 ? "FREE" : formatCFA(activeOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-white/15 text-sm">
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  [ TOTAL AMOUNT ]
                </span>
                <span className="text-xl font-black font-mono text-[#D4AF37]">
                  {formatCFA(activeOrder.total)}
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase pt-1">
                SETTLEMENT CHANNEL:{" "}
                <strong className="text-white">{activeOrder.customer?.paymentMethod?.replace("_", " ") || "Cash on Inspection"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href={`/orders?id=${displayId}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#121217] hover:bg-[#16161D] border border-white/15 text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 transition"
          >
            <span>[ TRACK LIVE DISPATCH STATUS ]</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <Link
            href="/phones"
            className="w-full sm:w-auto px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:opacity-95"
          >
            <span>RETURN TO BOUTIQUE COLLECTION</span>
          </Link>
        </div>

        {/* Trust Badges 3-Column Strip */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-[10px] font-mono text-zinc-400">
          <div className="p-3 bg-[#0E0E12] border border-white/10 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>100% GENUINE SEALED HARDWARE</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-white/10 flex items-center justify-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>SAME-DAY BUEA • 24H NATIONWIDE</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-white/10 flex items-center justify-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>SHOWROOM IN BUEA, MOLYKO</span>
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
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white text-xs font-mono">
          [ LOADING ACQUISITION MANIFEST... ]
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
