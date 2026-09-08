"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useAi } from "@/lib/store/ai-context";
import { useCart } from "@/lib/store/cart-context";
import { PHONES, Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";

export function AiModal() {
  const { isAiOpen, setIsAiOpen, messages, sendMessage, quickPrompts } = useAi();
  const { addItem } = useCart();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiOpen) {
      scrollToBottom();
    }
  }, [messages, isAiOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  if (!isAiOpen) {
    return (
      <button
        onClick={() => setIsAiOpen(true)}
        aria-label="Open AI Advisor"
        className="fixed bottom-20 md:bottom-8 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#141419] border border-[#D4AF37]/50 text-white shadow-2xl shadow-amber-500/20 hover:border-[#D4AF37] hover:scale-105 transition-all group"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-black animate-spin-slow" />
        </div>
        <span className="text-xs font-semibold tracking-wider group-hover:text-amber-300 transition-colors">
          AI Concierge
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-end sm:justify-end sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsAiOpen(false)}
      />

      {/* Chat Container */}
      <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[620px] bg-[#101014] border border-[#D4AF37]/30 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white z-10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-[#15151B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 p-[1px]">
              <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  AURA AI Advisor
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                  Concierge
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Live smartphone recommendations & spec advisor
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-zinc-800 text-zinc-300"
                    : "bg-amber-500/10 border border-[#D4AF37]/30 text-[#D4AF37]"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 space-y-2 ${
                  msg.sender === "user"
                    ? "bg-zinc-800 text-zinc-100 rounded-tr-none"
                    : "bg-[#1A1A22] border border-white/5 text-zinc-200 rounded-tl-none"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Embedded Phone Cards */}
                {msg.recommendedPhoneIds && msg.recommendedPhoneIds.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <p className="text-[10px] text-amber-400 uppercase font-mono tracking-wider">
                      Recommended Matches:
                    </p>
                    <div className="space-y-1.5">
                      {msg.recommendedPhoneIds.map((phoneId) => {
                        const phone = PHONES.find((p) => p.id === phoneId);
                        if (!phone) return null;
                        return (
                          <div
                            key={phone.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/90 border border-white/5 hover:border-[#D4AF37]/40 transition-colors"
                          >
                            <img
                              src={phone.images[0]}
                              alt={phone.name}
                              className="w-10 h-10 object-cover rounded-lg bg-black shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-white truncate text-[11px]">
                                {phone.name}
                              </h5>
                              <p className="text-[11px] font-bold text-[#D4AF37]">
                                {formatCFA(phone.basePrice)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/phones/${phone.slug}`}
                                onClick={() => setIsAiOpen(false)}
                                className="p-1 text-zinc-400 hover:text-white"
                                title="View details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() =>
                                  addItem(
                                    phone,
                                    phone.storageVariants[0],
                                    phone.colorVariants[0]
                                  )
                                }
                                className="p-1 text-[#D4AF37] hover:text-amber-300"
                                title="Quick Add"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-zinc-500 block text-right pt-0.5">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#121217]">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
            Suggested questions:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-[11px] text-zinc-300 hover:text-white border border-white/5 hover:border-[#D4AF37]/30 transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-white/10 bg-[#15151C] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything (e.g., best camera under 400,000 FCFA)..."
            className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-xl gold-gradient-bg text-black disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
