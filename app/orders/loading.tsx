import React from "react";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-10 sm:py-14 select-none font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="h-3 w-48 bg-[#D4AF37]/20 mx-auto"></div>
          <div className="h-9 w-72 bg-white/10 mx-auto"></div>
          <div className="h-3.5 w-80 bg-white/5 mx-auto"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-xl mx-auto h-14 bg-[#0E0E12] border border-white/15"></div>

        {/* Order Details Wireframe */}
        <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-8 space-y-6 relative">
          <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
          <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

          <div className="flex justify-between pb-4 border-b border-white/10">
            <div className="h-4 w-40 bg-white/10"></div>
            <div className="h-4 w-28 bg-[#D4AF37]/30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-black border border-white/10"></div>
            ))}
          </div>

          <div className="h-32 bg-black border border-white/10"></div>
        </div>

      </div>
    </div>
  );
}
