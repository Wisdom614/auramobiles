import React from "react";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12 select-none font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="pb-4 border-b border-white/10 space-y-2">
          <div className="h-3 w-40 bg-[#D4AF37]/20"></div>
          <div className="h-8 w-64 bg-white/10"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form Skeleton (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1 */}
            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-4">
              <div className="h-4 w-44 bg-white/10"></div>
              <div className="h-11 w-full bg-black border border-white/10"></div>
              <div className="h-11 w-full bg-black border border-white/10"></div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-4">
              <div className="h-4 w-48 bg-white/10"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-black border border-white/10"></div>
                ))}
              </div>
              <div className="h-11 w-full bg-black border border-white/10"></div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-4">
              <div className="h-4 w-40 bg-white/10"></div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-black border border-white/10"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Order Review Skeleton (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-[#0E0E12] border border-white/10 space-y-4">
              <div className="h-4 w-32 bg-white/10"></div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-black border border-white/10"></div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="h-3 w-full bg-white/5"></div>
                <div className="h-3 w-full bg-white/5"></div>
                <div className="h-6 w-full bg-[#D4AF37]/20"></div>
              </div>
              <div className="h-12 w-full bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37]/60"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
