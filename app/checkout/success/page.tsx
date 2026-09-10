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
  Download,
  Receipt,
  Eye,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { useOrders } from "@/lib/store/orders-context";
import { useSettings } from "@/lib/store/settings-context";
import { Order } from "@/lib/data/mock-orders";
import { getOrdersFromDB } from "@/lib/supabase/client";
import { OrderReceiptModal } from "@/components/orders/order-receipt-modal";
import { downloadOrderPdf } from "@/lib/utils/receipt-pdf";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { getOrder, orders } = useOrders();
  const { settings } = useSettings();

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

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

  const handleDownloadPdf = () => {
    if (!activeOrder) return;
    setIsDownloadingPdf(true);
    try {
      downloadOrderPdf(activeOrder, settings);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const displayId = activeOrder?.id || orderId || "AUR-32900";
  const customerName = activeOrder?.customer?.fullName || "Valued Customer";
  const customerPhone = activeOrder?.customer?.phone || "+237 6XX XX XX XX";
  const city = activeOrder?.customer?.city || "Buea / Douala / Yaoundé";
  const totalFCFA = activeOrder?.total || 980000;

  // Pre-filled WhatsApp direct link for expediting
  const waMessage = `Hello ${settings.storeName || "AURA Luxe Mobile"}, I just placed order *${displayId}* for *${customerName}*. Please confirm my order and arrange delivery to ${city}.`;
  const waNum = settings.whatsappCleanNumber || "237699442100";
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#070709] text-white py-8 sm:py-14 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* DISTINCTIVE EMERALD GREEN SUCCESS HERO CARD */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#062013] via-[#08170F] to-[#0D1110] border-2 border-emerald-500/70 p-6 sm:p-10 shadow-[0_0_60px_rgba(16,185,129,0.22)]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-5">
            
            {/* Pulsing Green Verification Beacon */}
            <div className="relative inline-flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-emerald-500/20 opacity-75" />
              <div className="w-20 h-20 bg-black/70 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)] relative">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-in zoom-in-50 duration-300" />
              </div>
            </div>

            {/* Confirmation Title & Subtitle */}
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10.5px] font-mono uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ORDER CONFIRMED &amp; ALLOCATED IN SHOWROOM VAULT</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
                Order Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Thank you, <strong className="text-white font-semibold">{customerName}</strong>! Your device has been securely reserved at our Buea showroom and queued for pre-dispatch inspection.
              </p>
            </div>

            {/* Order Reference Card */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 bg-black/80 border border-emerald-500/40 text-xs">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                OFFICIAL ORDER ID:
              </span>
              <span className="font-mono font-bold text-sm text-emerald-400 tracking-widest">
                {displayId}
              </span>
              <button
                onClick={copyOrderId}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition font-mono text-[10.5px] flex items-center gap-1.5 cursor-pointer border border-white/10"
                title="Copy Order ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            {/* Fast Action Buttons: PDF Receipt & WhatsApp Confirmation */}
            <div className="w-full pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-sans">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="py-3 px-4 bg-[#121217] hover:bg-[#1A1A22] text-white border border-[#D4AF37]/50 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span>View Official Receipt</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="py-3 px-4 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/70 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isDownloadingPdf ? "Generating PDF..." : "Download PDF Invoice"}</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="sm:col-span-2 lg:col-span-1 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Fast WhatsApp Dispatch</span>
              </a>
            </div>

          </div>
        </div>

        {/* WHAT HAPPENS NEXT */}
        <div className="bg-[#0E0E12] border border-white/15 p-6 sm:p-8 relative">
          <div className="space-y-6 relative z-10">
            
            {/* Attention Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500 text-black flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-sans">
                    What Happens Next?
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Our concierge will contact you via WhatsApp or phone call to confirm dispatch details.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono uppercase tracking-wider font-bold">
                Fast Response (&lt; 15 Mins)
              </span>
            </div>

            {/* Direct Explanation */}
            <div className="p-4 bg-black border border-white/10 space-y-2.5">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                We always confirm phone specifications and your address before courier departure. Our store manager will reach you at:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#16161D] border border-white/20 text-[#D4AF37] font-mono font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{customerPhone}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300 font-sans font-normal text-[11px]">{city}</span>
              </div>
            </div>

            {/* 3 Step Protocol Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-black border border-white/10 space-y-2">
                <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  01
                </div>
                <h3 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                  Model &amp; Address Verification
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We double-check your chosen phone storage, color condition, and exact delivery spot.
                </p>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-2">
                <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  02
                </div>
                <h3 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                  Hardware Test &amp; Warranty Seal
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Device battery health, display, and camera pass physical bench tests with warranty tags.
                </p>
              </div>

              <div className="p-4 bg-black border border-white/10 space-y-2">
                <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  03
                </div>
                <h3 className="font-bold text-white text-xs uppercase font-sans tracking-wider">
                  Inspect First, Pay on Delivery
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Our dispatch rider delivers to your doorstep. You thoroughly inspect the phone before payment.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ORDER SUMMARY */}
        {activeOrder && (
          <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-7 space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Order Details ({activeOrder.items?.length || 1} {activeOrder.items?.length === 1 ? "phone" : "phones"})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                Destination: <strong className="text-white">{city}</strong>
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
                    <span className="text-[9px] font-mono text-emerald-400 uppercase block mt-0.5 font-semibold">
                      Official Warranty Included
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white">{formatCFA(activeOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery</span>
                <span className="text-emerald-400">
                  {activeOrder.deliveryFee === 0 ? "FREE" : formatCFA(activeOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-white/15 text-sm">
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-xl font-black font-mono text-[#D4AF37]">
                  {formatCFA(activeOrder.total)}
                </span>
              </div>
              <div className="text-[10.5px] font-mono text-zinc-400 uppercase pt-1">
                Payment Method:{" "}
                <strong className="text-white">{activeOrder.customer?.paymentMethod?.replace("_", " ") || "Pay on Delivery"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href={`/orders?id=${displayId}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#121217] hover:bg-[#16161D] border border-white/15 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition"
          >
            <span>Track Live Order Status</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto px-5 py-3.5 bg-black hover:bg-white/5 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <Link
              href="/phones"
              className="w-full sm:w-auto px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition hover:opacity-95"
            >
              <span>Browse Showroom</span>
            </Link>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-[10.5px] text-zinc-400">
          <div className="p-3 bg-[#0E0E12] border border-white/10 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Authentic • Sealed &amp; Bench Tested</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-white/10 flex items-center justify-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Same-Day Buea • 24h Nationwide Delivery</span>
          </div>
          <div className="p-3 bg-[#0E0E12] border border-white/10 flex items-center justify-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Showroom: Molyko, Buea</span>
          </div>
        </div>

      </div>

      {/* Official Receipt Modal */}
      {activeOrder && (
        <OrderReceiptModal
          order={activeOrder}
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white text-xs font-mono">
          Loading Order Confirmation...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

