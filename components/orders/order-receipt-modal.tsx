"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Calendar,
  CreditCard,
  Crown,
  FileCheck,
} from "lucide-react";
import { Order } from "@/lib/data/mock-orders";
import { formatCFA } from "@/lib/formatters";
import { useSettings } from "@/lib/store/settings-context";

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderReceiptModal({ order, isOpen, onClose }: OrderReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#121217] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Modal Top Control Bar (Hidden during printing) */}
        <div className="print:hidden flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#16161D]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Official Boutique Receipt & Tax Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:opacity-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Area */}
        <div className="overflow-y-auto p-6 sm:p-10 flex-1">
          {/* Printable Invoice Sheet */}
          <div
            id="aura-printable-receipt"
            ref={receiptRef}
            className="bg-white text-zinc-900 rounded-xl p-6 sm:p-8 shadow-sm border border-zinc-200 print:border-none print:shadow-none print:p-0 print:m-0"
          >
            
            {/* 1. Header: Boutique Branding & Document Title */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-[#D4AF37] font-black text-xl tracking-wider shadow-sm flex-shrink-0">
                  A
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-wider text-black uppercase">
                    {settings.storeName || "AURA LUXE MOBILE"}
                  </h1>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    Premier Smartphone Boutique & Certified Flagship Dealer
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Douala (Bonapriso) • Yaoundé (Bastos) • Republic of Cameroon
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Official VIP Invoice
                </span>
                <p className="text-sm font-black font-mono text-zinc-900">{invoiceNumber}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Date: {formattedDate}</p>
              </div>
            </div>

            {/* 2. Customer and Order Particulars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-zinc-200 text-xs">
              {/* Client Info */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Billed & Dispatched To
                </span>
                <p className="text-sm font-bold text-zinc-900">
                  {order.customer?.fullName || "Valued VIP Client"}
                </p>
                <p className="text-zinc-600 flex items-center gap-1.5">
                  <PhoneCall className="w-3 h-3 text-zinc-400" />
                  <span>{order.customer?.phone || "WhatsApp Confirmed"}</span>
                </p>
                <p className="text-zinc-600 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>
                    {order.customer?.address || "Showroom Collection"},{" "}
                    {order.customer?.city || "Douala"}
                  </span>
                </p>
              </div>

              {/* Order Metadata */}
              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Order References
                </span>
                <p className="text-zinc-600">
                  Order ID: <strong className="text-zinc-900 font-mono">#{order.id}</strong>
                </p>
                <p className="text-zinc-600">
                  Tracking Code:{" "}
                  <strong className="text-zinc-900 font-mono">{order.trackingNumber}</strong>
                </p>
                <p className="text-zinc-600">
                  Payment Method:{" "}
                  <strong className="text-zinc-900 capitalize">
                    {order.customer?.paymentMethod?.replace(/_/g, " ") || "Cash on Delivery"}
                  </strong>
                </p>
                <p className="text-zinc-600">
                  Delivery Mode:{" "}
                  <strong className="text-zinc-900 capitalize">
                    {order.customer?.deliveryMethod?.replace(/_/g, " ") || "Express Courier"}
                  </strong>
                </p>
              </div>
            </div>

            {/* 3. Items Table */}
            <div className="py-6 border-b border-zinc-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    <th className="pb-2.5">Smartphone Description</th>
                    <th className="pb-2.5 text-center">Specs</th>
                    <th className="pb-2.5 text-center">Qty</th>
                    <th className="pb-2.5 text-right">Unit Price</th>
                    <th className="pb-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="py-3">
                      <td className="py-3 pr-2">
                        <p className="font-bold text-zinc-900">{item.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          Brand: {item.brand} • Condition: Sealed Brand New
                        </p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-zinc-100 text-[9px] font-mono text-zinc-600">
                          IMEI / Serial: Allocated Upon Dispatch
                        </span>
                      </td>
                      <td className="py-3 text-center text-zinc-600 font-medium whitespace-nowrap">
                        {item.storage} • {item.color}
                      </td>
                      <td className="py-3 text-center font-bold text-zinc-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-700 whitespace-nowrap">
                        {formatCFA(item.price)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-zinc-900 whitespace-nowrap">
                        {formatCFA(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Financial Calculation Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start pt-6 gap-6">
              {/* Guarantee & Authenticity Statement */}
              <div className="max-w-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>12-Month Boutique Warranty Included</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  All devices sold by AURA Luxe Mobile are genuine, factory unlocked, and accompanied by the original manufacturer accessories. Free 7-day replacement for technical defects.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center text-[8px] font-black text-amber-700 uppercase tracking-tighter">
                    SEAL
                  </div>
                  <span className="text-[9px] text-zinc-400 font-mono">
                    AUTH-ID: {order.id}-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">{formatCFA(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount / Trade-In Credit</span>
                    <span className="font-mono">- {formatCFA(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery Fee</span>
                  <span className="font-mono">
                    {order.deliveryFee === 0 ? "FREE (VIP)" : formatCFA(order.deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-zinc-900 flex justify-between items-baseline text-zinc-900">
                  <span className="text-sm font-black uppercase tracking-wider">Grand Total</span>
                  <span className="text-base font-black font-mono text-zinc-950">
                    {formatCFA(order.total)}
                  </span>
                </div>
                <div className="pt-1 text-[10px] text-zinc-400 text-right">
                  All taxes & customs clearances included
                </div>
              </div>
            </div>

            {/* 5. Footer Boutique Signature & Contact */}
            <div className="mt-8 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-400 gap-2">
              <span>Customer Support: {settings.whatsappPhone || settings.secondaryPhone || "+237 699 44 21 00"}</span>
              <span>Website: www.auraluxe.cm</span>
              <span>Thank you for choosing AURA Luxe Mobile Cameroon</span>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="print:hidden p-4 border-t border-white/10 bg-[#16161D] flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            Receipt formatted for standard A4 and Letter page printing or PDF export.
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-semibold text-xs hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:opacity-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
