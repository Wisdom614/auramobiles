"use client";

import React from "react";
import { Sparkles, MessageSquare, ArrowRight, Bot, Compass, CheckCircle2 } from "lucide-react";
import { useAi } from "@/lib/store/ai-context";

export function AiConciergeBanner() {
  const { setIsAiOpen, sendMessage, quickPrompts } = useAi();

  const handlePromptClick = (prompt: string) => {
    setIsAiOpen(true);
    sendMessage(prompt);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#09090B] via-[#0E0D14] to-[#09090B] relative overflow-hidden font-sans">
      {/* Soft atmospheric background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-amber-500/10 via-[#D4AF37]/15 to-amber-700/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-none bg-[#0E0E12] border border-white/10 p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          
          {/* Subtle gold accent corner shine */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                Instant Phone Advisor
              </span>

              <div className="space-y-2">
                <p className="text-xl sm:text-2xl text-amber-200/90 font-sans font-semibold">
                  Not sure which phone fits your budget?
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.1]">
                  Ask Our AI Assistant.
                </h2>
              </div>

              <p className="text-zinc-300 text-base leading-relaxed max-w-xl">
                Get instant phone recommendations tailored to your exact budget in FCFA, camera quality, battery life, and favourite brand.
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-zinc-300 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Real Cameroon stock & prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Clear FCFA price comparisons</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsAiOpen(true)}
                  className="px-8 py-4 rounded-none gold-gradient-bg text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/15 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Chat with AI Assistant</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Right Interactive Concierge Sample Card */}
            <div className="lg:col-span-5">
              <div className="rounded-none bg-[#09090C] border border-white/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Concierge Online
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Instant Answers
                  </span>
                </div>

                <div className="p-4 rounded-none bg-[#141419] border border-white/5 space-y-2">
                  <p className="text-xs text-zinc-300 italic">
                    &ldquo;Tell me your budget and what matters most (portrait camera, gaming, or battery), and I will pinpoint your ideal match with official warranty.&rdquo;
                  </p>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#D4AF37]">— AURA AI Advisor</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono block">
                    Tap to ask directly:
                  </span>
                  <div className="flex flex-col gap-2">
                    {quickPrompts.slice(0, 3).map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full text-left p-2.5 rounded-none bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/40 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                      >
                        <span className="truncate pr-2">{prompt}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
