import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Smartphone, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#09090B] font-sans">
      <div className="max-w-md w-full text-center space-y-6 p-8 border border-white/10 bg-[#0E0E12] relative">
        {/* Decorative corner crosshairs */}
        <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/50 select-none">+</span>
        <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/50 select-none">+</span>
        <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D4AF37]/50 select-none">+</span>
        <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#D4AF37]/50 select-none">+</span>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest">
          <span>Error 404</span>
          <span>•</span>
          <span>Page Not Found</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-mono">
            Requested Page Not Located
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The page or smartphone model you are looking for may have been moved, updated, or does not exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs uppercase tracking-wider font-bold">
          <Link
            href="/phones"
            className="w-full sm:w-auto px-5 py-3 gold-gradient-bg text-black flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
          >
            <Smartphone className="w-4 h-4 text-black" />
            <span>Browse Catalog</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 bg-[#181820] hover:bg-[#20202A] text-white border border-white/15 flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Help links */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] font-mono text-zinc-500">
          <Link href="/trade-in" className="hover:text-[#D4AF37] transition-colors">
            Trade-In / Swap
          </Link>
          <span>•</span>
          <Link href="/orders" className="hover:text-[#D4AF37] transition-colors">
            Track Order
          </Link>
          <span>•</span>
          <Link href="/support" className="hover:text-[#D4AF37] transition-colors">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
