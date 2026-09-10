"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  ShieldCheck,
  PhoneCall,
  MapPin,
  FileText,
  Check,
  Sparkles,
  Truck,
  CheckCircle2,
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
      <div className="relative w-full max-w-3xl bg-[#0E0E12] border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col rounded-none">
        
        {/* Viewfinder crosshairs */}
        <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>
        <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>

        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#141419] relative z-10">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-widest block font-mono">
                Official Proof of Purchase &amp; Warranty
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {invoiceNumber} • Reference #{order.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3 py-1.5 gold-gradient-bg text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer font-mono rounded-none"
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
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10 rounded-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          
          {/* Document Container */}
          <div className="border border-white/15 bg-black text-white text-xs rounded-none">
            
            {/* Top Luxury Header with 24K Gold Bar */}
            <div className="bg-[#121217] text-white p-5 border-b border-white/15 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D4AF37]" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-black border border-[#D4AF37]/50 text-[#D4AF37] font-black text-xs flex items-center justify-center font-mono">
                      A
                    </span>
                    <h3 className="font-black text-base tracking-widest text-white uppercase font-sans">
                      {settings.storeName || "AURA LUXE MOBILE"}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
                    Official Luxury Smartphone Boutique &amp; Verification Hub
                  </span>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {settings.bueaAddress || "Check Point, Molyko, Buea"} • Nationwide Delivery • Republic of Cameroon
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                    OFFICIAL PROOF OF PURCHASE
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {invoiceNumber}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">{formattedDate}</span>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 mt-0.5">
                    ● VERIFIED AUTHENTIC
                  </span>
                </div>
              </div>
            </div>

            {/* Client & Logistics Dual Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/15 bg-[#0C0C10]">
              {/* Left Cell: Client Details */}
              <div className="p-4 space-y-1.5 font-mono">
                <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                  DELIVERED TO (CLIENT DETAILS):
                </span>
                <p className="font-bold text-white text-sm font-sans">
                  {order.customer?.fullName || "Valued Customer"}
                </p>
                <p className="text-zinc-300 text-[11px] flex items-center gap-1.5">
                  <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                  <span>WhatsApp: {order.customer?.phone || "Confirmed via order"}</span>
                </p>
                <p className="text-zinc-400 text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {order.customer?.address || "Showroom Collection"},{" "}
                    {order.customer?.city || "Buea"}
                  </span>
                </p>
              </div>

              {/* Right Cell: Order Particulars */}
              <div className="p-4 space-y-1.5 font-mono">
                <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                  LOGISTICS &amp; STATUS:
                </span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">ORDER REF:</span>
                  <span className="text-white font-bold">#{order.id}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">TRACKING:</span>
                  <span className="text-[#D4AF37] font-bold">{order.trackingNumber || order.id}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">PAYMENT:</span>
                  <span className="text-white uppercase">
                    {order.customer?.paymentMethod?.replace(/_/g, " ") || "Pay on Delivery"}
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
                    <th className="py-2.5 px-3.5">SMARTPHONE DESCRIPTION</th>
                    <th className="py-2.5 px-3.5 text-center">SPECS / COLOR</th>
                    <th className="py-2.5 px-3.5 text-center">QTY</th>
                    <th className="py-2.5 px-3.5 text-right">UNIT PRICE</th>
                    <th className="py-2.5 px-3.5 text-right">AMOUNT (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-zinc-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-3 px-3.5">
                        <p className="font-bold text-white text-xs">{item.name}</p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                          {item.brand} • 100% Authentic Device • QC Inspected
                        </p>
                      </td>
                      <td className="py-3 px-3.5 text-center text-zinc-300 whitespace-nowrap text-[11px] font-mono">
                        <span className="font-bold text-white block">{item.storage}</span>
                        <span className="text-zinc-400 text-[10px] block">{item.color}</span>
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

            {/* Warranty Certificate & Financial Totals Block */}
            <div className="border-t border-white/15 p-5 bg-[#0C0C10] grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Left Column (7 cols): Official Warranty Certificate */}
              <div className="md:col-span-7 space-y-2 p-3.5 bg-[#121217] border border-[#D4AF37]/30 text-[10.5px] font-mono text-zinc-300">
                <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold uppercase text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>OFFICIAL BOUTIQUE WARRANTY &amp; RETURN POLICY</span>
                </div>
                <ul className="space-y-1 text-zinc-400 text-[10px]">
                  <li>• Covered by 6 to 12-Month Official Boutique Hardware Guarantee.</li>
                  <li>• 7-Day Immediate Technical Defect Replacement Guarantee.</li>
                  <li>• Live Apple / Samsung IMEI database verification before unboxing.</li>
                  <li>• Quality Control Sign-off: AURA Quality Control Lab, Buea Hub.</li>
                </ul>
              </div>

              {/* Right Column (5 cols): Financial Ledger */}
              <div className="md:col-span-5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>HARDWARE SUBTOTAL:</span>
                  <span className="text-zinc-200">{formatCFA(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 text-[11px]">
                    <span>VOUCHER / DISCOUNT:</span>
                    <span>-{formatCFA(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>DELIVERY LOGISTICS:</span>
                  <span className="text-zinc-200">
                    {order.deliveryFee === 0 ? <strong className="text-emerald-400">FREE (VIP)</strong> : formatCFA(order.deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/15 flex justify-between items-baseline font-bold text-white bg-black/60 p-2 border border-white/10">
                  <span className="text-xs uppercase tracking-wider">TOTAL DUE:</span>
                  <span className="text-[#D4AF37] text-base">{formatCFA(order.total)}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#141419] flex items-center justify-between gap-3 font-mono">
          <span className="text-[10px] text-zinc-400 font-sans">
            Official verifiable proof of purchase. Click &quot;Download PDF&quot; to print or save.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 border border-white/15 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer rounded-none"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer rounded-none"
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
