"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Calendar,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import { Order } from "@/lib/data/mock-orders";
import { formatCFA } from "@/lib/formatters";
import { useSettings } from "@/lib/store/settings-context";
import { downloadOrderPdf } from "@/lib/utils/receipt-pdf";

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderReceiptModal({ order, isOpen, onClose }: OrderReceiptModalProps) {
  const { settings } = useSettings();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      downloadOrderPdf(order, settings);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const invoiceNumber = `INV-${order.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#121217] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#16161D]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Order Invoice & Receipt
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {invoiceNumber} • {order.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Downloaded!</span>
                </>
              ) : isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
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

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1 space-y-5">
          
          {/* 1. Header Details Table */}
          <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white text-zinc-900 text-xs">
            
            {/* Top Bar with Boutique Title */}
            <div className="bg-[#121217] text-white p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-sm tracking-wider text-white uppercase">
                  {settings.storeName || "AURA LUXE MOBILE"}
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Douala (Bonapriso) • Yaoundé (Bastos) • Republic of Cameroon
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">
                  {invoiceNumber}
                </span>
                <span className="text-[10px] text-zinc-400">{formattedDate}</span>
              </div>
            </div>

            {/* Client & Order Particulars Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
              {/* Left Cell */}
              <div className="p-3.5 space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                  Client / Delivery To
                </span>
                <p className="font-bold text-zinc-950 text-sm">
                  {order.customer?.fullName || "Valued VIP Client"}
                </p>
                <p className="text-zinc-600 text-[11px] flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-zinc-400" />
                  <span>{order.customer?.phone || "WhatsApp Confirmed"}</span>
                </p>
                <p className="text-zinc-600 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>
                    {order.customer?.address || "Showroom Collection"},{" "}
                    {order.customer?.city || "Douala"}
                  </span>
                </p>
              </div>

              {/* Right Cell */}
              <div className="p-3.5 space-y-1.5 bg-zinc-50/70">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                  Order References
                </span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Order ID:</span>
                  <span className="font-mono font-bold text-zinc-900">#{order.id}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Tracking Code:</span>
                  <span className="font-mono font-bold text-zinc-900">{order.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Payment:</span>
                  <span className="font-medium text-zinc-800 capitalize">
                    {order.customer?.paymentMethod?.replace(/_/g, " ") || "Cash on Delivery"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Dispatch Status:</span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Device Items Table */}
            <div className="border-t border-zinc-200 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100/80 border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-600 font-mono">
                    <th className="py-2 px-3">Device / Item</th>
                    <th className="py-2 px-3 text-center">Specs</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-zinc-950">{item.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          {item.brand} • 100% Sealed Genuine Hardware
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-center text-zinc-600 whitespace-nowrap text-[11px]">
                        {item.storage} • {item.color}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-zinc-900">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-700 whitespace-nowrap text-[11px]">
                        {formatCFA(item.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950 whitespace-nowrap text-[11px]">
                        {formatCFA(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. Totals Table Row */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-[10px] text-zinc-500 space-y-1">
                <div className="flex items-center gap-1 text-amber-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>12-Month Official Boutique Warranty Enclosed</span>
                </div>
                <p>Free 7-day technical replacement at Akwa/Bonapriso or Bastos lounges.</p>
              </div>

              <div className="w-full sm:w-56 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600 text-[11px]">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCFA(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 text-[11px]">
                    <span>Discount:</span>
                    <span className="font-mono">- {formatCFA(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 text-[11px]">
                  <span>Delivery:</span>
                  <span className="font-mono">
                    {order.deliveryFee === 0 ? "FREE" : formatCFA(order.deliveryFee)}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-zinc-300 flex justify-between font-black text-sm text-zinc-950">
                  <span>Grand Total:</span>
                  <span className="font-mono text-black">{formatCFA(order.total)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#16161D] flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400">
            Click &quot;Download PDF&quot; to save this invoice directly to your device.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-semibold text-xs hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl gold-gradient-bg text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:opacity-95 transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
