"use client";

import React, { useState } from "react";
import { Bot, ArrowRight, X } from "lucide-react";
import { useAi } from "@/lib/store/ai-context";

export function FloatingConcierge() {
  const { isAiOpen, setIsAiOpen } = useAi();
  const [minimized, setMinimized] = useState(false);

  if (isAiOpen) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 transition-all duration-300">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="relative p-3 rounded-none bg-black/90 border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl flex items-center gap-2 group font-mono"
          title="Open AI Concierge Terminal"
        >
          <span className="absolute top-1 left-1 text-[8px] select-none font-mono opacity-50">+</span>
          <span className="absolute top-1 right-1 text-[8px] select-none font-mono opacity-50">+</span>
          <span className="absolute bottom-1 left-1 text-[8px] select-none font-mono opacity-50">+</span>
          <span className="absolute bottom-1 right-1 text-[8px] select-none font-mono opacity-50">+</span>

          <div className="w-5 h-5 rounded-none bg-black border border-current flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">
            [ AI // CONCIERGE ]
          </span>
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
        </button>
      ) : (
        <div className="w-[300px] sm:w-[320px] rounded-none bg-[#09090D]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl shadow-black/90 p-4 relative animate-in fade-in slide-in-from-bottom-3 duration-200 font-mono">
          <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none">+</span>
          <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none">+</span>
          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none">+</span>
          <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none">+</span>

          {/* Minimize button */}
          <button
            onClick={() => setMinimized(true)}
            aria-label="Minimize"
            className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-white p-1 rounded-none border border-white/10 hover:border-white/30 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-3">
            {/* Robot Avatar */}
            <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-inner text-[#D4AF37]">
              <Bot className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
                  [ AI // ADVISOR ONLINE ]
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-tight">
                Undecided on your next flagship?
              </h4>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Ask our neural concierge for specs comparisons and tailored luxury picks.
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              INSTANT RECOMMENDATIONS
            </span>
            <button
              onClick={() => setIsAiOpen(true)}
              className="px-3.5 py-1.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all border border-[#D4AF37]"
            >
              <span>[ CHAT NOW ]</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
