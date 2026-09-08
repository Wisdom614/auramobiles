"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BrandItem {
  id: string;
  code: string;
  name: string;
  renderLogo: () => React.ReactNode;
}

const BRAND_ITEMS: BrandItem[] = [
  {
    id: "Apple",
    code: "01",
    name: "Apple",
    renderLogo: () => (
      <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.64-14.01-6.19-9.57-11.03-20.67-14.53-33.31-3.5-12.63-5.25-24.57-5.25-35.8 0-14.35 3.73-26.47 11.2-36.35 7.46-9.88 16.92-14.93 28.36-15.15 4.8 0 10.37 1.25 16.71 3.76 6.34 2.5 10.15 3.81 11.43 3.91 1.74-.22 5.92-1.63 12.54-4.24 6.62-2.61 12.38-3.75 17.29-3.43 14.13.87 25.13 6.09 33 15.65-12.4 7.5-18.49 17.61-18.28 30.33.22 9.79 3.96 18.05 11.22 24.79 7.26 6.74 16.03 10.55 26.31 11.42-2.18 6.53-4.89 13.27-8.15 20.21zm-28.78-109.11c0 7.18-2.61 13.91-7.83 20.21-5.66 6.74-12.51 10.76-20.55 12.06-.22-1.52-.33-2.83-.33-3.91 0-7.18 2.83-14.13 8.48-20.87 2.83-3.37 6.42-6.19 10.77-8.48 4.35-2.28 8.16-3.48 11.42-3.59.1 1.53.15 2.51.15 4.58z" />
      </svg>
    ),
  },
  {
    id: "Samsung",
    code: "02",
    name: "Samsung",
    renderLogo: () => (
      <span className="font-sans font-black tracking-widest text-base sm:text-lg text-white">
        SAMSUNG
      </span>
    ),
  },
  {
    id: "Xiaomi",
    code: "03",
    name: "Xiaomi",
    renderLogo: () => (
      <div className="w-7 h-7 bg-[#FF6900] flex items-center justify-center text-white font-black text-xs font-mono">
        mi
      </div>
    ),
  },
  {
    id: "Tecno",
    code: "04",
    name: "Tecno",
    renderLogo: () => (
      <span className="font-sans font-black tracking-wider text-base sm:text-lg text-[#00A3E0]">
        TECNO
      </span>
    ),
  },
  {
    id: "Infinix",
    code: "05",
    name: "Infinix",
    renderLogo: () => (
      <span className="font-sans font-black tracking-wider text-base sm:text-lg text-[#10B981]">
        Infinix
      </span>
    ),
  },
  {
    id: "Google",
    code: "06",
    name: "Google",
    renderLogo: () => (
      <div className="w-7 h-7 bg-white flex items-center justify-center font-bold text-sm text-black">
        <span className="bg-gradient-to-r from-blue-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
          G
        </span>
      </div>
    ),
  },
];

export function BrandGrid() {
  return (
    <section className="py-12 bg-[#09090B] border-b border-white/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
              [ DIRECT MANUFACTURER LINEAGE ]
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-0.5">
              Verified Brand Portfolios
            </h2>
          </div>
          <Link
            href="/phones"
            className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 hover:text-[#D4AF37] flex items-center gap-1 transition"
          >
            <span>[ ALL PORTFOLIOS → ]</span>
          </Link>
        </div>

        {/* 6 Brand Bays in a precision 1px grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BRAND_ITEMS.map((brand) => (
            <Link
              key={brand.id}
              href={`/phones?brand=${encodeURIComponent(brand.id)}`}
              className="bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37] p-5 flex flex-col justify-between h-32 transition-all relative group cursor-pointer"
            >
              {/* Top tag */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-500 group-hover:text-[#D4AF37] uppercase tracking-wider">
                  [ {brand.code} ]
                </span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
              </div>

              {/* Centered logo */}
              <div className="flex items-center justify-center my-auto">
                {brand.renderLogo()}
              </div>

              {/* Bottom brand name */}
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white uppercase tracking-wider text-center block transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
