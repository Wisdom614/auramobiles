import React from "react";

export default function PhonesCatalogLoading() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12 select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-white/10 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-44 bg-[#D4AF37]/20"></div>
            <div className="h-8 w-64 bg-white/10"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-white/5 border border-white/10"></div>
            <div className="h-9 w-32 bg-white/5 border border-white/10"></div>
          </div>
        </div>

        {/* Filter Strip Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-24 bg-[#121217] border border-white/10 shrink-0"></div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pb-2">
          <span>[ RETRIEVING VERIFIED INVENTORY... ]</span>
          <span className="animate-pulse text-[#D4AF37]">● LOADING</span>
        </div>

        {/* 8-Card Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-[#0E0E12] border border-white/10 p-4 space-y-4 relative animate-pulse"
            >
              {/* Telemetry row */}
              <div className="flex justify-between">
                <div className="h-2.5 w-16 bg-[#D4AF37]/20"></div>
                <div className="h-2.5 w-12 bg-white/10"></div>
              </div>

              {/* Image box */}
              <div className="w-full h-44 bg-black border border-white/10 flex items-center justify-center">
                <div className="w-16 h-28 bg-white/5"></div>
              </div>

              {/* Text lines */}
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-white/10"></div>
                <div className="h-2.5 w-1/2 bg-white/5"></div>
              </div>

              {/* Price row */}
              <div className="flex justify-between items-baseline pt-1">
                <div className="h-4 w-20 bg-[#D4AF37]/30"></div>
                <div className="h-2.5 w-14 bg-white/5"></div>
              </div>

              {/* Button */}
              <div className="h-9 w-full bg-white/10"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
