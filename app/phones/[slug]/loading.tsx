import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12 select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-600">
          <div className="h-3 w-16 bg-white/10"></div>
          <span>/</span>
          <div className="h-3 w-20 bg-white/10"></div>
          <span>/</span>
          <div className="h-3 w-32 bg-[#D4AF37]/30"></div>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Gallery Showcase Skeleton (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Viewfinder Main Frame */}
            <div className="w-full aspect-[4/3] bg-[#0E0E12] border border-white/15 relative flex items-center justify-center p-8">
              <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
              <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

              <div className="w-40 h-64 bg-white/5 border border-white/10"></div>

              <div className="absolute top-3 left-3 text-[9px] font-mono text-zinc-600">
                [ LOADING SPECIFICATION CANVAS... ]
              </div>
            </div>

            {/* Thumbnail Strip Skeleton */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-[#0E0E12] border border-white/10"></div>
              ))}
            </div>

            {/* Guarantees 3-Bay Skeleton */}
            <div className="h-16 bg-[#0E0E12] border border-white/10"></div>
          </div>

          {/* Right: Configurator & Price Skeleton (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Title & Tag */}
            <div className="space-y-2">
              <div className="h-3 w-28 bg-[#D4AF37]/20"></div>
              <div className="h-8 w-3/4 bg-white/10"></div>
              <div className="h-3.5 w-full bg-white/5"></div>
            </div>

            {/* Price Matrix Skeleton */}
            <div className="p-4 bg-[#0E0E12] border border-white/10 space-y-2">
              <div className="h-3 w-24 bg-white/10"></div>
              <div className="h-7 w-40 bg-[#D4AF37]/30"></div>
            </div>

            {/* 4 Pillars Grid Skeleton */}
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-[#0E0E12] border border-white/10 p-2 space-y-1">
                  <div className="h-2 w-16 bg-white/10"></div>
                  <div className="h-3 w-24 bg-white/20"></div>
                </div>
              ))}
            </div>

            {/* Storage Selector Skeleton */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/10"></div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-[#0E0E12] border border-white/10"></div>
                ))}
              </div>
            </div>

            {/* Tactical Action Buttons Skeleton */}
            <div className="space-y-2.5 pt-2">
              <div className="h-12 w-full bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/50"></div>
              <div className="h-11 w-full bg-emerald-950/40 border border-emerald-500/20"></div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
