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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0E0E12] border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Viewfinder crosshairs */}
        <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>
        <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141419] relative z-10">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-widest block font-mono">
                [ OFFICIAL INVOICE & RECEIPT ]
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
              className="px-3 py-1.5 gold-gradient-bg text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer font-mono"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DOWNLOADED</span>
                </>
              ) : isDownloading ? (
                <>
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>GENERATING...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          
          {/* Header Details Table */}
          <div className="border border-white/15 bg-black text-white text-xs">
            
            {/* Top Bar with Boutique Title */}
            <div className="bg-[#141419] text-white p-4 border-b border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm tracking-widest text-white uppercase font-mono">
                  {settings.storeName || "AURA LUXE MOBILE"}
                </h3>
                <p className="text-[10px] font-mono text-zinc-400">
                  DOUALA (BONAPRISO) • YAOUNDÉ (BASTOS) • REPUBLIC OF CAMEROON
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">
                  {invoiceNumber}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{formattedDate}</span>
              </div>
            </div>

            {/* Client & Order Particulars Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
              {/* Left Cell */}
              <div className="p-4 space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] block font-mono">
                  [ CLIENT / DESTINATION ]
                </span>
                <p className="font-bold text-white text-sm">
                  {order.customer?.fullName || "Valued VIP Client"}
                </p>
                <p className="text-zinc-400 text-[11px] font-mono flex items-center gap-1.5">
                  <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                  <span>{order.customer?.phone || "WhatsApp Verified"}</span>
                </p>
                <p className="text-zinc-400 text-[11px] font-mono flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {order.customer?.address || "Showroom Collection"},{" "}
                    {order.customer?.city || "Douala"}
                  </span>
                </p>
              </div>

              {/* Right Cell */}
              <div className="p-4 space-y-1.5 bg-[#121217]/50 font-mono">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                  [ ORDER PARTICULARS ]
                </span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">ORDER ID:</span>
                  <span className="text-white font-bold">#{order.id}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">TRACKING CODE:</span>
                  <span className="text-white font-bold">{order.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">SETTLEMENT:</span>
                  <span className="text-white uppercase">
                    {order.customer?.paymentMethod?.replace(/_/g, " ") || "Cash on Inspection"}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">STATUS:</span>
                  <span className="text-emerald-400 font-bold uppercase">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Device Items Table */}
            <div className="border-t border-white/15 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#141419] border-b border-white/15 text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
                    <th className="py-2.5 px-3.5">DEVICE / HARDWARE</th>
                    <th className="py-2.5 px-3.5 text-center">SPECS</th>
                    <th className="py-2.5 px-3.5 text-center">QTY</th>
                    <th className="py-2.5 px-3.5 text-right">UNIT PRICE</th>
                    <th className="py-2.5 px-3.5 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-zinc-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-3 px-3.5">
                        <p className="font-bold text-white text-xs">{item.name}</p>
                        <p className="text-[10px] font-mono text-zinc-400">
                          {item.brand} • 100% Sealed Hardware
                        </p>
                      </td>
                      <td className="py-3 px-3.5 text-center text-zinc-300 whitespace-nowrap text-[11px] font-mono">
                        {item.storage} • {item.color}
                      </td>
                      <td className="py-3 px-3.5 text-center font-bold text-white font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-zinc-300 whitespace-nowrap text-[11px]">
                        {formatCFA(item.price)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-[#D4AF37] whitespace-nowrap text-[11px]">
                        {formatCFA(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Row */}
            <div className="border-t border-white/15 p-4 bg-[#121217] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-[10px] font-mono text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>12-MONTH OFFICIAL BOUTIQUE WARRANTY ENCLOSED</span>
                </div>
                <p className="text-zinc-500">Free 7-day technical replacement at Bonapriso or Bastos lounges.</p>
              </div>

              <div className="w-full sm:w-60 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>SUBTOTAL:</span>
                  <span className="text-zinc-200">{formatCFA(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 text-[11px]">
                    <span>DISCOUNT:</span>
                    <span>- {formatCFA(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>DELIVERY:</span>
                  <span className="text-zinc-200">
                    {order.deliveryFee === 0 ? "FREE" : formatCFA(order.deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/15 flex justify-between font-bold text-sm text-white">
                  <span>TOTAL DUE:</span>
                  <span className="text-[#D4AF37] text-base">{formatCFA(order.total)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#141419] flex items-center justify-between gap-3 font-mono">
          <span className="text-[10px] text-zinc-400 uppercase">
            CLICK &quot;DOWNLOAD PDF&quot; TO GENERATE PORTABLE FISCAL SLIP.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 border border-white/15 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
            >
              CLOSE
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
