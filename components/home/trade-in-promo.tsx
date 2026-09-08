"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, ArrowRight } from "lucide-react";

export function TradeInPromo() {
  return (
    <section className="py-12 bg-[#09090B] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#121217] via-[#14141A] to-[#0D0D12] border border-white/10 hover:border-[#D4AF37]/30 transition-all p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Info & Action */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6 text-[#D4AF37]" />
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Your old phone still has value.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Trade it in and put its value toward your next device.
                </p>
              </div>

              {/* Button */}
              <div className="sm:ml-auto pt-2 sm:pt-0 shrink-0">
                <Link
                  href="/trade-in"
                  className="px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-md shadow-amber-500/15"
                >
                  <span>Start a Trade-In</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Link>
              </div>
            </div>

            {/* Right Product Graphic */}
            <div className="lg:col-span-5 relative h-32 sm:h-40 overflow-hidden rounded-xl border border-white/5">
              <img
                src="/trade-in-phones.jpg"
                alt="Trade in your old smartphone"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121217] via-transparent to-transparent pointer-events-none" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
