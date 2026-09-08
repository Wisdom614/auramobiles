"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TradeInPromo() {
  return (
    <section className="py-12 bg-[#09090B] border-b border-white/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Architectural Frame */}
        <div className="bg-[#0E0E12] border border-white/15 p-6 sm:p-8 relative">
          
          {/* Viewfinder crosshairs */}
          <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Info & Actions */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                  [ PHONE SWAP &amp; TRADE-IN ]
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                Trade In Your Old Phone For A Brand New One.
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                Trade in your current iPhone or Samsung and deduct its value immediately toward any brand new phone in our store. Quick 5-minute check at our Douala and Yaoundé stores.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/trade-in"
                  className="px-6 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-95 transition cursor-pointer"
                >
                  <span>SWAP YOUR PHONE NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>

                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  AKWA • BONAPRISO • BASTOS
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
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 border border-white/15 text-[9px] font-mono text-[#D4AF37] uppercase">
                [ INSTANT SWAP CALCULATOR ]
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
