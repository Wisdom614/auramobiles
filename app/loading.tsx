import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] bg-[#09090B] flex flex-col items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-md bg-[#0E0E12] border border-white/15 p-8 relative">
        {/* Viewfinder crosshairs */}
        <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
        <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
        <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none">+</span>
        <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none">+</span>

        <div className="space-y-4 text-center">
          {/* Pulsing indicator */}
          <div className="w-12 h-12 bg-black border border-white/15 flex items-center justify-center mx-auto relative">
            <div className="w-4 h-4 bg-[#D4AF37] animate-ping opacity-40"></div>
            <div className="w-3 h-3 bg-[#D4AF37] absolute"></div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
              [ VAULT TELEMETRY // LOADING COMPONENT ]
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">
              Synchronizing Boutique Inventory
            </h2>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="w-full h-1 bg-white/10 overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-1/2 animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
          </div>

          <p className="text-[11px] font-mono text-zinc-500">
            Fetching verified hardware specifications & live pricing...
          </p>
        </div>
      </div>
    </div>
  );
}
