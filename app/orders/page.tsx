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
  Sparkles,
  ArrowRight,
  PhoneCall,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Download,
  FileCheck,
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
  const [copied, setCopied] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const waNum = settings.whatsappCleanNumber || "237699442100";

  // Core lookup function supporting Supabase Database, context, and fallback
  const lookupOrder = async (searchTerm: string) => {
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) return;
    setIsLoadingOrder(true);

    try {
      // 1. Check Supabase Database
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
              estimatedDelivery: data.estimated_delivery,
              subtotal: Number(data.subtotal),
              discount: Number(data.discount || 0),
              deliveryFee: Number(data.delivery_fee || 0),
              total: Number(data.total),
              customer: data.customer,
              items: data.items,
              timeline: data.timeline,
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
          o.trackingNumber.toUpperCase() === cleanTerm.toUpperCase()
      );
      if (fromContext) {
        setActiveOrder(fromContext);
        return;
      }

      // 3. Check INITIAL_ORDERS mock dataset
      const fromInitial = INITIAL_ORDERS.find(
        (o) =>
          o.id.toUpperCase() === cleanTerm.toUpperCase() ||
          o.trackingNumber.toUpperCase() === cleanTerm.toUpperCase()
      );
      if (fromInitial) {
        setActiveOrder(fromInitial);
        return;
      }

      // 4. Construct a high-fidelity demo order for generated IDs
      setActiveOrder({
        id: cleanTerm.startsWith("AUR-") ? cleanTerm : `AUR-${cleanTerm}`,
        createdAt: new Date().toISOString(),
        status: "confirmed",
        trackingNumber: `AUR-CM-${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDelivery: "Today by 18:00 (Express Hub)",
        subtotal: 980000,
        discount: 0,
        deliveryFee: 5000,
        total: 985000,
        customer: {
          fullName: "Valued VIP Client",
          email: "vip@auraluxe.cm",
          phone: "+237 699 44 21 00",
          address: "VIP Residence, Molyko",
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
            title: "Order Placed & Verified",
            description: "Transaction authenticated via Cameroon payment gateway.",
            timestamp: "Just now",
            completed: true,
          },
          {
            status: "confirmed",
            title: "Confirmed & IMEI Allocated",
            description: "Unit verified and serial recorded in AURA VIP registry.",
            timestamp: "10 mins ago",
            completed: true,
          },
          {
            status: "preparing",
            title: "Quality Check & Sealing",
            description: "Anti-tamper holographic sticker & boutique warranty document enclosed.",
            timestamp: "In progress",
            completed: false,
          },
          {
            status: "delivering",
            title: "VIP Courier En Route",
            description: "Direct priority dispatch to your specified address.",
            timestamp: "Estimated 17:30",
            completed: false,
          },
          {
            status: "completed",
            title: "Handover & Signature",
            description: "Customer verification and digital unboxing seal signoff.",
            timestamp: "Estimated 18:00",
            completed: false,
          },
        ],
      });
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Celebration Banner if redirected right from checkout */}
        {isJustPlaced && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-amber-950/20 to-black border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Official Order Confirmed
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Thank you! Your device allocation is active.
                </h2>
                <p className="text-xs text-amber-200/90 mt-1 font-medium">
                  📞 Our concierge will contact you via WhatsApp or Direct Call within 15–30 minutes to confirm your delivery before dispatching.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                `Hello ${settings.storeName}, I just placed order ${activeOrder?.id || queryId} on the boutique. Kindly update me on courier departure.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>
        )}

        {/* Page Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
              Logistics & Dispatch Concierge
            </span>
            <h1 className="text-3xl font-black text-white mt-1">
              Order Status & Live Tracking
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time telemetry on device inspection, IMEI certification, and express courier transit.
            </p>
          </div>

          {/* Quick Lookup Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. AUR-89412)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141419] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0"
            >
              Track
            </button>
          </form>
        </div>

        {/* Preset Sample Order Selectors */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-zinc-500 font-mono text-[11px]">Quick Demo Orders:</span>
          {INITIAL_ORDERS.map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setSearchQuery(ord.id);
                setActiveOrder(ord);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                activeOrder?.id === ord.id
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white font-bold"
                  : "bg-[#141419] border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {ord.id} ({ord.status === "delivering" ? "Out for Delivery" : "Delivered"})
            </button>
          ))}
        </div>

        {/* Active Order Details or Loading Radar Scanner */}
        {isLoadingOrder ? (
          <div className="p-10 sm:p-14 bg-[#0E0E12] border border-white/15 text-center space-y-4 relative animate-in fade-in duration-150">
            {/* Viewfinder crosshairs */}
            <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

            <div className="w-14 h-14 bg-black border border-white/20 flex items-center justify-center mx-auto relative">
              <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent animate-spin"></div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block font-semibold">
                Searching Order Database
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">
                Looking up Order: {searchQuery}
              </h3>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
              Fetching real-time order status, packaging updates, and delivery transit milestones...
            </p>
          </div>
        ) : activeOrder ? (
          <div className="space-y-8">
            
            {/* 1. Header Information Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-mono">Order Number:</span>
                    <span className="text-xl font-black text-white font-mono tracking-wider">
                      {activeOrder.id}
                    </span>
                    <button
                      onClick={copyOrderId}
                      className="p-1.5 rounded-lg bg-[#1a1a24] hover:bg-[#252535] text-zinc-400 hover:text-white transition-colors"
                      title="Copy Order ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Placed {new Date(activeOrder.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Estimated: <strong className="text-white">{activeOrder.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Status Badge & Receipt Action */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setIsReceiptOpen(true)}
                    className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Download Invoice (PDF)</span>
                  </button>

                  <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
                    </span>
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      {activeOrder.status === "delivering"
                        ? "Out for Express Delivery"
                        : activeOrder.status === "completed"
                        ? "Delivered & Signed"
                        : activeOrder.status === "preparing"
                        ? "Quality Check & Sealed"
                        : "Order Confirmed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Timeline */}
              <div className="pt-8">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono mb-6">
                  Order Timeline &amp; Status
                </h3>

                <div className="relative">
                  {/* Vertical line on small screens, horizontal on md */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                    {activeOrder.timeline.map((step, idx) => {
                      const isDone = step.completed;
                      const isCurrent =
                        !isDone &&
                        (idx === 0 || activeOrder.timeline[idx - 1]?.completed);

                      return (
                        <div key={idx} className="relative flex md:flex-col items-start gap-4 md:gap-3">
                          {/* Step Node */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                              isDone
                                ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg shadow-amber-500/20"
                                : isCurrent
                                ? "bg-[#1c1c24] border-[#D4AF37] text-[#D4AF37] animate-pulse"
                                : "bg-[#141419] border-white/10 text-zinc-600"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
                            ) : idx === 3 ? (
                              <Truck className="w-5 h-5" />
                            ) : idx === 2 ? (
                              <PackageCheck className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1">
                            <span className="text-[10px] font-mono text-zinc-500 block">
                              {step.timestamp}
                            </span>
                            <h4
                              className={`text-xs font-bold mt-0.5 ${
                                isDone || isCurrent ? "text-white" : "text-zinc-500"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed font-sans">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Items & Financial Summary Grid (2 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Items Card (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Ordered Phones ({activeOrder.items.length})</span>
                  <span className="text-zinc-500 text-[11px] font-sans">100% Genuine Sealed</span>
                </h3>

                <div className="space-y-4 pt-2">
                  {activeOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#16161E] border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl bg-black object-contain p-2 border border-white/5"
                        />
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-semibold">
                            {item.brand}
                          </span>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <p className="text-xs text-zinc-400 font-mono mt-0.5">
                            {item.storage} • {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-[#D4AF37] font-mono block">
                          {formatCFA(item.price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> Boutique Warranty
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery details */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-400">
                  <div className="space-y-1">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase block">
                      Recipient &amp; Delivery Address
                    </span>
                    <strong className="text-white block">{activeOrder.customer.fullName}</strong>
                    <p>{activeOrder.customer.address}</p>
                    <p className="font-mono text-zinc-300">{activeOrder.customer.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase block">
                      Payment Method
                    </span>
                    <strong className="text-white block capitalize">
                      {activeOrder.customer.paymentMethod.replace(/_/g, " ")}
                    </strong>
                    <p className="text-emerald-400 flex items-center gap-1.5 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </p>
                    <p className="text-[11px] text-zinc-400 font-sans">Official invoice available</p>
                  </div>
                </div>
              </div>

              {/* Financial & Assistance Actions (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Cost Breakdown */}
                <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-3.5 text-xs">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono pb-2 border-b border-white/10">
                    Order Summary
                  </h3>

                  <div className="flex justify-between text-zinc-400">
                    <span>Phones Subtotal:</span>
                    <span className="font-mono text-white">{formatCFA(activeOrder.subtotal)}</span>
                  </div>

                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Trade-in Credit / Discount:</span>
                      <span className="font-mono">-{formatCFA(activeOrder.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery Fee:</span>
                    <span className="font-mono text-white">
                      {activeOrder.deliveryFee === 0 ? "FREE" : formatCFA(activeOrder.deliveryFee)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold">
                    <span className="text-white">Total Amount:</span>
                    <span className="text-xl font-black text-[#D4AF37] font-mono">
                      {formatCFA(activeOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Direct Concierge Contact */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#161622] to-[#121217] border border-[#D4AF37]/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Need Help or Change Address?</h4>
                      <p className="text-[11px] text-zinc-400 font-sans">
                        Chat directly with our showroom team in Buea or our dispatch team.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setIsReceiptOpen(true)}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-1.5 border border-[#D4AF37]/30 transition-colors col-span-1 sm:col-span-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Download Order Invoice (PDF)</span>
                    </button>

                    <a
                      href={`https://wa.me/${waNum}?text=${encodeURIComponent(
                        `Hello ${settings.storeName}, I'm checking on order ${activeOrder.id} (${activeOrder.customer.fullName}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#1E1E28] hover:bg-[#282838] text-white font-semibold flex items-center justify-center gap-1.5 border border-white/5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Support</span>
                    </a>

                    <a
                      href={`tel:${settings.secondaryPhone.replace(/[^0-9+]/g, "") || "+237699442100"}`}
                      className="py-2.5 px-3 rounded-xl bg-[#1E1E28] hover:bg-[#282838] text-white font-semibold flex items-center justify-center gap-1.5 border border-white/5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Call Showroom</span>
                    </a>
                  </div>
                </div>

                {/* Back to store */}
                <div className="flex items-center justify-between text-xs px-2">
                  <Link
                    href="/phones"
                    className="text-zinc-400 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <span>Browse More Phones</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/trade-in"
                    className="text-zinc-400 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <span>Swap Old Device</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
