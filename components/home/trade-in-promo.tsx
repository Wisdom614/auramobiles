"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

export function TradeInPromo() {
  return (
    <section className="py-12 bg-[#09090B] border-b border-white/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Frame */}
        <div className="bg-[#0E0E12] border border-white/15 p-6 sm:p-8 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Info & Actions */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                  PHONE SWAP &amp; TRADE-IN
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                Got an Old Phone? Swap It for a New Flagship.
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed">
                Bring your current iPhone, Samsung, Tecno, or Google Pixel and deduct its value immediately toward any phone in our store. Top up the small difference and walk away with an upgraded authentic smartphone!
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/trade-in"
                  className="px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-95 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span>Calculate Trade-In Value</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>

                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Showroom in Buea, Molyko • Doorstep Swap Nationwide
                </span>
              </div>

            </div>

            {/* Right Visual Canvas */}
            <div className="lg:col-span-5 relative h-36 sm:h-44 bg-black border border-white/10 overflow-hidden">
              <img
                src="/trade-in-phones.jpg"
                alt="Trade in your old smartphone"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E12] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 border border-white/15 text-[9px] font-mono text-[#D4AF37] uppercase font-bold">
                Instant Online Valuation
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
