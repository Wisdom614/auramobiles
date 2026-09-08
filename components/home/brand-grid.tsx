"use client";

import React from "react";
import Link from "next/link";

interface BrandItem {
  id: string;
  name: string;
  renderLogo: () => React.ReactNode;
}

const BRAND_ITEMS: BrandItem[] = [
  {
    id: "Apple",
    name: "Apple",
    renderLogo: () => (
      <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.64-14.01-6.19-9.57-11.03-20.67-14.53-33.31-3.5-12.63-5.25-24.57-5.25-35.8 0-14.35 3.73-26.47 11.2-36.35 7.46-9.88 16.92-14.93 28.36-15.15 4.8 0 10.37 1.25 16.71 3.76 6.34 2.5 10.15 3.81 11.43 3.91 1.74-.22 5.92-1.63 12.54-4.24 6.62-2.61 12.38-3.75 17.29-3.43 14.13.87 25.13 6.09 33 15.65-12.4 7.5-18.49 17.61-18.28 30.33.22 9.79 3.96 18.05 11.22 24.79 7.26 6.74 16.03 10.55 26.31 11.42-2.18 6.53-4.89 13.27-8.15 20.21zm-28.78-109.11c0 7.18-2.61 13.91-7.83 20.21-5.66 6.74-12.51 10.76-20.55 12.06-.22-1.52-.33-2.83-.33-3.91 0-7.18 2.83-14.13 8.48-20.87 2.83-3.37 6.42-6.19 10.77-8.48 4.35-2.28 8.16-3.48 11.42-3.59.1 1.53.15 2.51.15 4.58z" />
      </svg>
    ),
  },
  {
    id: "Samsung",
    name: "Samsung",
    renderLogo: () => (
      <span className="font-sans font-black tracking-widest text-lg sm:text-xl text-white">
        SAMSUNG
      </span>
    ),
  },
  {
    id: "Xiaomi",
    name: "Xiaomi",
    renderLogo: () => (
      <div className="w-8 h-8 rounded-lg bg-[#FF6900] flex items-center justify-center text-white font-black text-sm">
        mi
      </div>
    ),
  },
  {
    id: "Tecno",
    name: "Tecno",
    renderLogo: () => (
      <span className="font-sans font-black tracking-wider text-lg sm:text-xl text-[#00A3E0]">
        TECNO
      </span>
    ),
  },
  {
    id: "Infinix",
    name: "Infinix",
    renderLogo: () => (
      <span className="font-sans font-black tracking-wider text-lg sm:text-xl text-[#10B981]">
        Infinix
      </span>
    ),
  },
  {
    id: "Google",
    name: "Google",
    renderLogo: () => (
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
        <span className="font-bold text-base bg-gradient-to-r from-blue-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
          G
        </span>
      </div>
    ),
  },
];

export function BrandGrid() {
  return (
    <section className="py-12 bg-[#09090B] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Shop by Brand
          </h2>
          <Link
            href="/phones"
            className="text-xs font-semibold text-[#D4AF37] hover:text-amber-200 transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* 6 Brand Cards in a responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {BRAND_ITEMS.map((brand) => (
            <Link
              key={brand.id}
              href={`/phones?brand=${encodeURIComponent(brand.id)}`}
              className="group rounded-2xl bg-[#121217] border border-white/8 hover:border-[#D4AF37]/50 p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50"
            >
              <div className="h-9 flex items-center justify-center">
                {brand.renderLogo()}
              </div>
              <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
