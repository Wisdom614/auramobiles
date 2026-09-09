"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Lock,
} from "lucide-react";
import { useSettings } from "@/lib/store/settings-context";

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#09090B] border-t border-white/10 text-zinc-400 text-xs mt-auto font-sans">
      {/* MINIMAL TABLE MATRIX */}
      <div className="max-w-7xl mx-auto border-x border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Table Cell 1: Brand & Authentication */}
          <div className="p-6 sm:p-7 space-y-3 bg-[#0C0C10]/40 flex flex-col justify-between">
            <div className="space-y-2.5">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-sm">
                  A
                </div>
                <div>
                  <span className="text-sm font-black tracking-widest text-white uppercase block leading-none">
                    {settings.storeName}
                  </span>
                  <span className="text-[9px] tracking-widest text-[#D4AF37] font-mono block mt-0.5">
                    LUXE MOBILE
                  </span>
                </div>
              </Link>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {settings.tagline}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100% Original Sealed Phones</span>
            </div>
          </div>

          {/* Table Cell 2: Physical Showroom & Nationwide Delivery */}
          <div className="p-6 sm:p-7 space-y-3 bg-[#0C0C10]/20">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Showroom & Delivery</span>
            </h4>
            <div className="space-y-3 text-[11px]">
              <div>
                <strong className="text-zinc-200 block">Buea Showroom:</strong>
                <span className="text-zinc-400 block mt-0.5">{settings.bueaAddress || "Check Point, Molyko, Buea"}</span>
              </div>
              <div>
                <strong className="text-zinc-200 block">Nationwide Delivery:</strong>
                <span className="text-zinc-400 block mt-0.5">Same-day in Buea • 24h Express to Douala, Yaoundé & All Cities</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-mono pt-1">
                <Clock className="w-3 h-3" />
                <span>{settings.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Table Cell 3: Direct Contacts */}
          <div className="p-6 sm:p-7 space-y-3 bg-[#0C0C10]/40">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Customer Support</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              <a
                href={`https://wa.me/${settings.whatsappCleanNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>WhatsApp: {settings.whatsappPhone}</span>
              </a>

              <a
                href={`tel:${settings.secondaryPhone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Call Us: {settings.secondaryPhone}</span>
              </a>

              <a
                href={`mailto:${settings.supportEmail}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Email: {settings.supportEmail}</span>
              </a>
            </div>
          </div>

          {/* Table Cell 4: Navigation */}
          <div className="p-6 sm:p-7 space-y-3 bg-[#0C0C10]/20">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Link href="/phones" className="text-zinc-400 hover:text-[#D4AF37] transition-colors">
                • All Phones
              </Link>
              <Link href="/trade-in" className="text-zinc-400 hover:text-[#D4AF37] transition-colors">
                • Phone Swap
              </Link>
              <Link href="/orders" className="text-zinc-400 hover:text-[#D4AF37] transition-colors">
                • Track Order
              </Link>
              <Link href="/wishlist" className="text-zinc-400 hover:text-[#D4AF37] transition-colors">
                • Wishlist
              </Link>
              <Link href="/support" className="text-zinc-400 hover:text-[#D4AF37] transition-colors">
                • Showroom Info
              </Link>
              <Link href="/admin" className="text-zinc-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM TABLE ROW: COPYRIGHT & LOCAL PAYMENTS */}
        <div className="border-t border-white/10 px-6 py-4 bg-[#08080A] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} {settings.storeName} Ltd. Molyko, Buea, Cameroon.
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-amber-300">
              MTN MoMo
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-orange-300">
              Orange Money
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
              Pay on Delivery
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-blue-300">
              VISA / Mastercard
            </span>
          </div>

          <Link
            href="/admin"
            className="text-zinc-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 text-[10px] font-mono"
          >
            <span>Staff Portal</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
