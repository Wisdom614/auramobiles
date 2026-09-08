"use client";

import React, { useState } from "react";
import { Sparkles, Bot, ArrowRight, X } from "lucide-react";
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
          className="p-3.5 rounded-full bg-[#141419] border border-[#D4AF37]/50 text-amber-300 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
          title="Open AI Concierge"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="text-xs font-semibold hidden sm:inline text-white">
            AI Concierge
          </span>
        </button>
      ) : (
        <div className="w-[300px] sm:w-[320px] rounded-2xl bg-[#0F0F14]/95 backdrop-blur-xl border border-[#D4AF37]/30 shadow-2xl shadow-black/90 p-4 relative animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Close / Minimize button */}
          <button
            onClick={() => setMinimized(true)}
            aria-label="Minimize"
            className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            {/* Robot Avatar */}
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-inner">
              <Bot className="w-5 h-5 text-[#D4AF37]" />
            </div>

            {/* Content */}
            <div className="space-y-1 pr-4">
              <h4 className="text-xs font-bold text-white leading-tight">
                Not sure which phone is right for you?
              </h4>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Ask our AI Concierge for personalized recommendations.
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-end">
            <button
              onClick={() => setIsAiOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-bold text-xs tracking-tight flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Chat Now</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
