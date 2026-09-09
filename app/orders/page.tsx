"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  ShieldCheck,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  PhoneCall,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  FileCheck,
  AlertCircle,
  Sparkles,
  Navigation,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { INITIAL_ORDERS, Order, OrderStatus } from "@/lib/data/mock-orders";
import { formatCFA } from "@/lib/formatters";
import { useSettings } from "@/lib/store/settings-context";
import { useOrders } from "@/lib/store/orders-context";
import { supabase } from "@/lib/supabase/client";
import { OrderReceiptModal } from "@/components/orders/order-receipt-modal";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const isJustPlaced = searchParams.get("placed") === "true";
  const { settings } = useSettings();
  const { orders: contextOrders } = useOrders();

  const [searchQuery, setSearchQuery] = useState(queryId || "AUR-89412");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [notFoundTerm, setNotFoundTerm] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const waNum = settings.whatsappCleanNumber || "237699442100";

  // Core lookup function supporting Supabase Database, context, and fallback presets
  const lookupOrder = async (searchTerm: string) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;
    setIsLoadingOrder(true);
    setNotFoundTerm(null);

    try {
      // 1. Check Supabase Remote Database
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .or(`id.ilike.%${cleanTerm}%,tracking_number.ilike.%${cleanTerm}%`)
            .limit(1)
            .maybeSingle();

          if (data && !error) {
            setActiveOrder({
              id: data.id,
              trackingNumber: data.tracking_number,
              createdAt: data.created_at,
              status: data.status as OrderStatus,
              estimatedDelivery: data.estimated_delivery || "Same-Day Priority Transit",
              subtotal: Number(data.subtotal),
              discount: Number(data.discount || 0),
              deliveryFee: Number(data.delivery_fee || 0),
              total: Number(data.total),
              customer: data.customer,
              items: data.items,
              timeline: data.timeline || [
                {
                  status: "placed",
                  title: "Order Received & Verified",
                  description: "Transaction authenticated via payment gateway.",
                  timestamp: new Date(data.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  completed: true,
                },
                {
                  status: "confirmed",
                  title: "IMEI Allocated & Reserved",
                  description: "Unit verified and recorded in AURA VIP Registry.",
                  timestamp: "15 mins later",
                  completed: data.status !== "placed",
                },
                {
                  status: "preparing",
                  title: "Quality Check & Holographic Sealing",
                  description: "Protective boutique seal & warranty card enclosed.",
                  timestamp: "In progress",
                  completed: data.status === "preparing" || data.status === "delivering" || data.status === "completed",
                },
                {
                  status: "delivering",
                  title: "VIP Express Courier En Route",
                  description: "Priority dispatch vehicle in transit to destination.",
                  timestamp: "Estimated today",
                  completed: data.status === "delivering" || data.status === "completed",
                },
                {
                  status: "completed",
                  title: "Handover & Signed",
                  description: "Client verification and unboxing signoff completed.",
                  timestamp: "Final milestone",
                  completed: data.status === "completed",
                },
              ],
            });
            return;
          }
        } catch (dbErr) {
          console.warn("Supabase query error, falling back:", dbErr);
        }
      }

      // 2. Check local React orders context
      const fromContext = contextOrders.find(
        (o) =>
          o.id.toUpperCase() === cleanTerm.toUpperCase() ||
          o.trackingNumber?.toUpperCase() === cleanTerm.toUpperCase()
      );
      if (fromContext) {
        setActiveOrder(fromContext);
        return;
      }

      // 3. Check INITIAL_ORDERS mock dataset
      const fromInitial = INITIAL_ORDERS.find(
        (o) =>
          o.id.toUpperCase() === cleanTerm.toUpperCase() ||
          o.trackingNumber?.toUpperCase() === cleanTerm.toUpperCase()
      );
      if (fromInitial) {
        setActiveOrder(fromInitial);
        return;
      }

      // 4. If query looks like an AUR- code but not found in mock/db, construct high-fidelity demo fallback
      if (cleanTerm.toUpperCase().startsWith("AUR-")) {
        setActiveOrder({
          id: cleanTerm.toUpperCase(),
          createdAt: new Date().toISOString(),
          status: "confirmed",
          trackingNumber: `AUR-CM-${Math.floor(100000 + Math.random() * 900000)}`,
          estimatedDelivery: "Today by 18:00 (Express Hub)",
          subtotal: 980000,
          discount: 0,
          deliveryFee: 1500,
          total: 981500,
          customer: {
            fullName: "Valued VIP Client",
            email: "client@auraluxe.cm",
            phone: "+237 699 44 21 00",
            address: "Check Point, Molyko",
            city: "Buea",
            deliveryMethod: "express_buea",
            paymentMethod: "mtn_momo",
          },
          items: [
            {
              phoneId: "iphone-16-pro-max",
              name: "iPhone 16 Pro Max",
              brand: "Apple",
              image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
              storage: "256GB",
              color: "Desert Titanium",
              price: 980000,
              quantity: 1,
            },
          ],
          timeline: [
            {
              status: "placed",
              title: "Order Placed & Payment Verified",
              description: "Transaction authenticated via Cameroon Mobile Money gateway.",
              timestamp: "Just now",
              completed: true,
            },
            {
              status: "confirmed",
              title: "IMEI Allocated & Reserved",
              description: "Unit serial recorded in AURA VIP registry.",
              timestamp: "10 mins ago",
              completed: true,
            },
            {
              status: "preparing",
              title: "Quality Check & Holographic Sealing",
              description: "Anti-tamper holographic sticker & boutique warranty document enclosed.",
              timestamp: "In progress",
              completed: false,
            },
            {
              status: "delivering",
              title: "VIP Express Courier En Route",
              description: "Direct priority dispatch to your specified address.",
              timestamp: "Estimated 17:30",
              completed: false,
            },
            {
              status: "completed",
              title: "Handover & Signature Sign-off",
              description: "Customer verification and digital unboxing seal signoff.",
              timestamp: "Estimated 18:00",
              completed: false,
            },
          ],
        });
        return;
      }

      // If search query is completely invalid
      setActiveOrder(null);
      setNotFoundTerm(cleanTerm);
    } finally {
      setIsLoadingOrder(false);
    }
  };

  // Initial load on mount or query param change
  useEffect(() => {
    const target = queryId || searchQuery || "AUR-89412";
    lookupOrder(target);
  }, [queryId, contextOrders]);

  // Real-time Supabase Database synchronization
  useEffect(() => {
    if (!activeOrder?.id || !supabase) return;

    const channel = supabase
      .channel(`live-order-${activeOrder.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload: any) => {
          if (payload.new) {
            const updatedRow = payload.new;
            if (
              updatedRow.id?.toUpperCase() === activeOrder.id.toUpperCase() ||
              updatedRow.tracking_number?.toUpperCase() === activeOrder.trackingNumber.toUpperCase()
            ) {
              setActiveOrder((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  status: updatedRow.status as OrderStatus,
                  estimatedDelivery: updatedRow.estimated_delivery || prev.estimatedDelivery,
                  timeline: updatedRow.timeline || prev.timeline,
                };
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeOrder?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    lookupOrder(searchQuery);
  };

  const copyOrderId = () => {
    if (!activeOrder) return;
    navigator.clipboard.writeText(activeOrder.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyTracking = () => {
    if (!activeOrder) return;
    navigator.clipboard.writeText(activeOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Get human-friendly status details
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return { label: "ORDER RECEIVED", desc: "Awaiting boutique allocation & payment confirmation", color: "text-amber-400", bg: "bg-amber-950/60 border-amber-500/30" };
      case "confirmed":
        return { label: "IMEI ALLOCATED & RESERVED", desc: "Smartphone unit verified & recorded in VIP database", color: "text-blue-400", bg: "bg-blue-950/60 border-blue-500/30" };
      case "preparing":
        return { label: "QUALITY CHECK & PACKAGING", desc: "Anti-tamper holographic security sealing in progress", color: "text-purple-400", bg: "bg-purple-950/60 border-purple-500/30" };
      case "delivering":
        return { label: "OUT FOR EXPRESS DELIVERY", desc: "Priority VIP courier en route to delivery address", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/15 border-[#D4AF37]/50" };
      case "completed":
        return { label: "DELIVERED & SIGNED", desc: "Package handed over & 1-Year warranty active", color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-500/30" };
      default:
        return { label: "PROCESSING", desc: "Order status active", color: "text-white", bg: "bg-black/60 border-white/20" };
    }
  };

  const currentStatusInfo = activeOrder ? getStatusLabel(activeOrder.status) : null;

  return (
    <div className="min-h-screen bg-[#070709] text-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Banner if redirected right after placing order */}
        {isJustPlaced && activeOrder && (
          <div className="relative bg-[#0A0A0D] border border-emerald-500/40 p-6 shadow-2xl">
            <span className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400/40 select-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400/40 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400/40 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-400/40 select-none">+</span>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                      ORDER CONFIRMED
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{activeOrder.id}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase mt-1">
                    Thank you, {activeOrder.customer.fullName}! Your device is reserved.
                  </h2>
                  <p className="text-xs font-mono text-white/60 mt-1 max-w-2xl leading-relaxed">
                    Our showroom dispatch manager will contact you on WhatsApp or telephone to confirm delivery logistics before sending the express courier.
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                  `Hello ${settings.storeName}, I just placed order ${activeOrder.id} (${activeOrder.customer.fullName}). Kindly update me on courier departure.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-none bg-[#25D366] hover:bg-[#20ba59] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition border border-[#25D366]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>EXPEDITE ON WHATSAPP</span>
              </a>
            </div>
          </div>
        )}

        {/* Top Header & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 bg-[#D4AF37] select-none" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                LOGISTICS &amp; DISPATCH CONCIERGE // TELEMETRY TERMINAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-tight">
              Order Status &amp; Live Tracking
            </h1>
            <p className="text-xs font-mono text-white/50 mt-1 max-w-xl">
              Real-time milestone tracking for luxury smartphone inspection, IMEI verification, and express courier transit.
            </p>
          </div>

          {/* Quick Lookup Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full lg:w-auto">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ORDER ID (E.G. AUR-89412)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-none bg-black border border-white/15 font-mono text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37] transition shrink-0"
            >
              TRACK ORDER
            </button>
          </form>
        </div>

        {/* Quick Demo Order Switchers */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-white/40 font-mono text-[11px] uppercase tracking-wider">Quick Demo Presets:</span>
          {INITIAL_ORDERS.map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setSearchQuery(ord.id);
                lookupOrder(ord.id);
              }}
              className={`px-3 py-1.5 rounded-none border font-mono text-[11px] uppercase tracking-wider transition ${
                activeOrder?.id === ord.id
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/60 text-white/60 hover:text-white border-white/10 hover:border-white/20"
              }`}
            >
              {ord.id} • {ord.status === "delivering" ? "Out for Delivery" : ord.status === "completed" ? "Delivered" : "Confirmed"}
            </button>
          ))}
        </div>

        {/* Loading Scanner State */}
        {isLoadingOrder ? (
          <div className="relative p-12 bg-[#0A0A0D] border border-white/15 text-center space-y-4">
            <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

            <div className="w-12 h-12 bg-black border border-[#D4AF37]/50 flex items-center justify-center mx-auto">
              <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent animate-spin" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block font-semibold">
                QUERYING DISPATCH TELEMETRY
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">
                Searching Record: {searchQuery}
              </h3>
            </div>
            <p className="text-xs font-mono text-white/40 max-w-sm mx-auto">
              Connecting to central logistics registry and retrieving verified fulfillment status...
            </p>
          </div>
        ) : notFoundTerm ? (
          /* Clean Order Not Found Diagnostic Card */
          <div className="relative p-8 sm:p-12 bg-[#0A0A0D] border border-amber-500/30 text-center space-y-6">
            <span className="absolute top-2 left-2 text-amber-400/40 font-mono text-xs select-none">+</span>
            <span className="absolute top-2 right-2 text-amber-400/40 font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 left-2 text-amber-400/40 font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 right-2 text-amber-400/40 font-mono text-xs select-none">+</span>

            <div className="w-12 h-12 bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                [ DIAGNOSTIC // DISPATCH RECORD NOT FOUND ]
              </span>
              <h3 className="text-lg font-mono font-bold text-white uppercase">
                No active order found for &ldquo;{notFoundTerm}&rdquo;
              </h3>
              <p className="text-xs font-mono text-white/50 leading-relaxed">
                Please double-check the Order ID received in your confirmation SMS or WhatsApp dispatch notice, or reach out to our concierge desk for instant manual lookup.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                  `Hello ${settings.storeName}, I am trying to track my order code "${notFoundTerm}". Could you please verify the status for me?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#25D366] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>INQUIRE VIA WHATSAPP</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("AUR-89412");
                  lookupOrder("AUR-89412");
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-xs uppercase tracking-wider transition"
              >
                LOAD DEMO DISPATCH
              </button>
            </div>
          </div>
        ) : activeOrder ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. Header Information & Live Status Banner */}
            <div className="relative bg-[#0A0A0D] border border-white/10 p-6 sm:p-8">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider">ORDER NUMBER:</span>
                    <span className="text-xl font-mono font-bold text-[#D4AF37] tracking-wider">
                      {activeOrder.id}
                    </span>
                    <button
                      onClick={copyOrderId}
                      className="px-2 py-1 bg-black border border-white/15 text-white/70 hover:text-white font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 transition"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D4AF37]" />}
                      <span>{copiedId ? "COPIED" : "COPY"}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Placed: {new Date(activeOrder.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Estimated Arrival: <strong className="text-white">{activeOrder.estimatedDelivery}</strong></span>
                    </span>
                    {activeOrder.trackingNumber && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Tracking: <strong className="text-white font-mono">{activeOrder.trackingNumber}</strong></span>
                          <button
                            onClick={copyTracking}
                            className="p-1 hover:text-[#D4AF37] transition"
                            title="Copy Tracking Number"
                          >
                            {copiedTracking ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Badge & PDF Invoice Action */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsReceiptOpen(true)}
                    className="px-4 py-2.5 rounded-none bg-white/5 border border-white/15 hover:bg-white/10 hover:border-[#D4AF37]/50 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>DOWNLOAD INVOICE (PDF)</span>
                  </button>

                  <div className={`px-4 py-2.5 rounded-none border flex items-center gap-2.5 font-mono ${currentStatusInfo?.bg}`}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${currentStatusInfo?.color}`}>
                      {currentStatusInfo?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive 5-Stage Milestone Progress Engine */}
              <div className="pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>[ DISPATCH TIMELINE &amp; TELEMETRY ]</span>
                  </h3>
                  <span className="text-[11px] font-mono text-white/40">
                    STATUS: {currentStatusInfo?.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                  {activeOrder.timeline.map((step, idx) => {
                    const isDone = step.completed;
                    const isCurrent =
                      !isDone &&
                      (idx === 0 || activeOrder.timeline[idx - 1]?.completed);

                    return (
                      <div key={idx} className="relative flex md:flex-col items-start gap-4 md:gap-3 group">
                        {/* Step Node Icon */}
                        <div
                          className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 border transition-all ${
                            isDone
                              ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20"
                              : isCurrent
                              ? "bg-black border-[#D4AF37] text-[#D4AF37] animate-pulse"
                              : "bg-[#0E0E12] border-white/10 text-white/30"
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-5 h-5 stroke-[3]" />
                          ) : idx === 3 ? (
                            <Truck className="w-4 h-4" />
                          ) : idx === 2 ? (
                            <PackageCheck className="w-4 h-4" />
                          ) : idx === 1 ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-[#D4AF37] block">
                            {step.timestamp}
                          </span>
                          <h4
                            className={`text-xs font-mono font-bold uppercase tracking-wider mt-0.5 ${
                              isDone || isCurrent ? "text-white" : "text-white/40"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-[11px] font-mono text-white/50 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Live Logistics & Transit Flight Deck Panel */}
            <div className="relative bg-[#0A0A0D] border border-white/10 p-6 sm:p-8">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  [ TRANSIT TELEMETRY // ROUTE &amp; DISPATCH FLEET ]
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Route Origin */}
                <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    01 // ORIGIN DISPATCH HUB
                  </span>
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>AURA LUXE CENTRAL HUB</span>
                  </div>
                  <p className="text-[11px] font-mono text-white/60">
                    Check Point, Molyko, Buea • SW Region
                  </p>
                </div>

                {/* Transit Vehicle & Mode */}
                <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    02 // DISPATCH COURIER FLEET
                  </span>
                  <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>
                      {activeOrder.status === "delivering"
                        ? "AURA VIP FLEET #04 (OFFICER PAUL M.)"
                        : activeOrder.status === "completed"
                        ? "DELIVERY SIGN-OFF COMPLETED"
                        : "ALLOCATED UPON DISPATCH"}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-white/60">
                    {activeOrder.customer.deliveryMethod.includes("buea") || activeOrder.customer.city.toLowerCase() === "buea"
                      ? "Direct Local Express (Same-Day Courier)"
                      : "Secured Sealed Inter-City Transit"}
                  </p>
                </div>

                {/* Destination */}
                <div className="p-4 bg-black/60 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    03 // DESTINATION HANDOVER
                  </span>
                  <div className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeOrder.customer.address}, {activeOrder.customer.city}</span>
                  </div>
                  <p className="text-[11px] font-mono text-white/60">
                    Recipient: {activeOrder.customer.fullName} ({activeOrder.customer.phone})
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Items Ledger & Financial Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (7/12): Ordered Devices & Specs */}
              <div className="lg:col-span-7 relative bg-[#0A0A0D] border border-white/10 p-6 sm:p-7 space-y-5">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    [ MANIFEST // ORDERED SMARTPHONES ({activeOrder.items.length}) ]
                  </h3>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">
                    100% GENUINE SEALED
                  </span>
                </div>

                <div className="space-y-4">
                  {activeOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black border border-white/10 p-2 shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-semibold">
                            {item.brand}
                          </span>
                          <h4 className="text-sm font-mono font-bold text-white uppercase">{item.name}</h4>
                          <p className="text-xs font-mono text-white/50 mt-0.5">
                            {item.storage} • {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                        <span className="text-sm font-mono font-bold text-[#D4AF37] block">
                          {formatCFA(item.price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center sm:justify-end gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> 1-Year Boutique Warranty
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recipient and Payment Details */}
                <div className="pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 bg-black/40 border border-white/5 space-y-1">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest block">
                      RECIPIENT &amp; DELIVERY ADDRESS
                    </span>
                    <strong className="text-white block">{activeOrder.customer.fullName}</strong>
                    <p className="text-white/60">{activeOrder.customer.address}</p>
                    <p className="text-[#D4AF37]">{activeOrder.customer.phone}</p>
                  </div>

                  <div className="p-3.5 bg-black/40 border border-white/5 space-y-1">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest block">
                      PAYMENT METHOD &amp; STATUS
                    </span>
                    <strong className="text-white block uppercase">
                      {activeOrder.customer.paymentMethod.replace(/_/g, " ")}
                    </strong>
                    <p className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                    </p>
                    <p className="text-[10px] text-white/40">Official invoice enclosed</p>
                  </div>
                </div>
              </div>

              {/* Right Column (5/12): Financial Ledger & Concierge Actions */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Cost Breakdown Card */}
                <div className="relative bg-[#0A0A0D] border border-white/10 p-6 space-y-4 text-xs font-mono">
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
                    [ FINANCIAL LEDGER // SUMMARY ]
                  </h3>

                  <div className="flex justify-between text-white/60">
                    <span>Phones Subtotal:</span>
                    <span className="font-mono text-white">{formatCFA(activeOrder.subtotal)}</span>
                  </div>

                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Trade-in Credit / Discount:</span>
                      <span className="font-mono">-{formatCFA(activeOrder.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/60">
                    <span>Express Delivery Fee:</span>
                    <span className="font-mono text-white">
                      {activeOrder.deliveryFee === 0 ? "FREE" : formatCFA(activeOrder.deliveryFee)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold">
                    <span className="text-white uppercase">Total Paid:</span>
                    <span className="text-lg font-mono font-bold text-[#D4AF37]">
                      {formatCFA(activeOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Concierge Hotline Card */}
                <div className="relative bg-[#0A0A0D] border border-[#D4AF37]/30 p-6 space-y-4">
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase">Direct Concierge Assistance</h4>
                      <p className="text-[11px] font-mono text-white/50">
                        Need to alter delivery address or schedule pickup?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      onClick={() => setIsReceiptOpen(true)}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-1.5 border border-white/15 transition col-span-1 sm:col-span-2 uppercase"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Download Invoice (PDF)</span>
                    </button>

                    <a
                      href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                        `Hello ${settings.storeName}, I'm inquiring about order ${activeOrder.id} (${activeOrder.customer.fullName}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/40 font-bold flex items-center justify-center gap-1.5 transition uppercase"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Desk</span>
                    </a>

                    <a
                      href={`tel:${settings.secondaryPhone.replace(/[^0-9+]/g, "") || "+237699442100"}`}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold flex items-center justify-center gap-1.5 transition uppercase"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Call Showroom</span>
                    </a>
                  </div>
                </div>

                {/* Additional Store Navigation Links */}
                <div className="flex items-center justify-between text-xs font-mono px-1">
                  <Link
                    href="/phones"
                    className="text-white/50 hover:text-[#D4AF37] flex items-center gap-1 transition"
                  >
                    <span>Browse Smartphones</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>

                  <Link
                    href="/trade-in"
                    className="text-white/50 hover:text-[#D4AF37] flex items-center gap-1 transition"
                  >
                    <span>Swap Device</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>

            </div>

          </div>
        ) : null}

        {/* Official Printable VIP Receipt Modal */}
        <OrderReceiptModal
          order={activeOrder}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
        />

      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] flex items-center justify-center font-mono text-xs text-white">
          <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent animate-spin mr-3" />
          <span>INITIALIZING DISPATCH TELEMETRY...</span>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
