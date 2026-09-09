"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useAi } from "@/lib/store/ai-context";
import { useCart } from "@/lib/store/cart-context";
import { PHONES, Phone } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";
import { getPhonesFromDB } from "@/lib/supabase/client";

function FormattedMessageContent({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) {
    return <p className="text-[13px] text-zinc-100 leading-relaxed font-sans">{text}</p>;
  }

  // Parse lines for assistant
  const lines = text.split("\n");

  const formatInline = (str: string) => {
    // Split by **bold** markers
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const content = part.slice(2, -2);
        const isPrice = content.toLowerCase().includes("fcfa");
        return (
          <strong
            key={i}
            className={`font-bold ${isPrice ? "text-[#D4AF37]" : "text-white"}`}
          >
            {content}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5 text-[13px] text-zinc-200 font-sans leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Check if line is a bullet point (starts with •, -, or *)
        const isBullet = /^[•\-\*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);

        if (isBullet) {
          const bulletContent = trimmed.replace(/^[•\-\*]\s+/, "").replace(/^\d+\.\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 text-zinc-200">
              <span className="text-[#D4AF37] font-bold shrink-0 mt-0.5 select-none">•</span>
              <span className="flex-1">{formatInline(bulletContent)}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-zinc-200">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export function AiModal() {
  const { isAiOpen, setIsAiOpen, messages, sendMessage, quickPrompts, isTyping } = useAi();
  const { addItem } = useCart();
  const [inputValue, setInputValue] = useState("");
  const [catalogPhones, setCatalogPhones] = useState<Phone[]>(PHONES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPhonesFromDB()
      .then((dbPhones) => {
        if (dbPhones && dbPhones.length > 0) {
          setCatalogPhones(dbPhones);
        }
      })
      .catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiOpen) {
      scrollToBottom();
    }
  }, [messages, isAiOpen, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handlePromptClick = (prompt: string) => {
    if (isTyping) return;
    sendMessage(prompt);
  };

  // Dedicated trigger is rendered by FloatingConcierge component in layout.
  // Avoid duplicate floating buttons by returning null when closed.
  if (!isAiOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-end sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsAiOpen(false)}
      />

      {/* Terminal Container */}
      <div className="relative w-full sm:max-w-md h-[88vh] sm:h-[640px] bg-[#0A0A0D] border border-[#D4AF37]/40 rounded-none shadow-2xl flex flex-col overflow-hidden text-white z-10 font-mono">
        {/* Viewfinder Crosshair Corners */}
        <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none pointer-events-none">+</span>
        <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none pointer-events-none">+</span>
        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none pointer-events-none">+</span>
        <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none pointer-events-none">+</span>

        {/* Header */}
        <div className="p-3.5 border-b border-white/10 bg-black/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-black border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  AURA AI Assistant
                </span>
                <span className="px-1.5 py-0.2 rounded-none text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] font-mono border border-[#D4AF37]/30 uppercase font-semibold">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-sans tracking-tight">
                Smartphone Recommendations &amp; FCFA Budget Advisor
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiOpen(false)}
            aria-label="Close Concierge"
            className="p-1 text-zinc-400 hover:text-white rounded-none border border-white/10 hover:border-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-zinc-900 border-white/20 text-zinc-300"
                    : "bg-black border-[#D4AF37]/50 text-[#D4AF37]"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Message Memo Box */}
              <div
                className={`max-w-[85%] rounded-none p-3.5 space-y-2 border ${
                  msg.sender === "user"
                    ? "bg-white/5 border-white/20 text-zinc-100"
                    : "bg-black/90 border-[#D4AF37]/30 text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between pb-1 border-b border-white/5 font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                  <span>{msg.sender === "user" ? "You" : "AURA Assistant"}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <FormattedMessageContent text={msg.text} isUser={msg.sender === "user"} />

                {/* Embedded Phone Cards */}
                {msg.recommendedPhoneIds && msg.recommendedPhoneIds.length > 0 && (
                  <div className="pt-2 space-y-2 border-t border-white/10">
                    <p className="text-[10px] text-[#D4AF37] uppercase font-mono tracking-widest font-bold">
                      Recommended Phones:
                    </p>
                    <div className="space-y-2">
                      {msg.recommendedPhoneIds.map((phoneId) => {
                        const phone =
                          catalogPhones.find(
                            (p) =>
                              p.id.toLowerCase() === phoneId.toLowerCase() ||
                              p.slug.toLowerCase() === phoneId.toLowerCase()
                          ) ||
                          PHONES.find(
                            (p) =>
                              p.id.toLowerCase() === phoneId.toLowerCase() ||
                              p.slug.toLowerCase() === phoneId.toLowerCase()
                          );
                        if (!phone) return null;
                        return (
                          <div
                            key={phone.id}
                            className="flex items-center gap-2.5 p-2 rounded-none bg-zinc-950 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                          >
                            <img
                              src={phone.images[0]}
                              alt={phone.name}
                              className="w-10 h-10 object-cover rounded-none bg-black shrink-0 border border-white/10"
                            />
                            <div className="flex-1 min-w-0 font-mono">
                              <h5 className="font-bold text-white truncate text-[11px] uppercase tracking-wide">
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
                                className="p-1.5 rounded-none border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors"
                                title="View details"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <button
                                onClick={() =>
                                  addItem(
                                    phone,
                                    phone.storageVariants[0],
                                    phone.colorVariants[0]
                                  )
                                }
                                className="p-1.5 rounded-none border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                                title="Add to Cart"
                              >
                                <ShoppingBag className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5 flex-row animate-in fade-in duration-150">
              <div className="w-7 h-7 rounded-none flex items-center justify-center shrink-0 border bg-black border-[#D4AF37]/50 text-[#D4AF37]">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-none p-3 border bg-black/90 border-[#D4AF37]/30 text-zinc-300 font-mono text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D4AF37] animate-pulse"></span>
                <span className="text-[#D4AF37] font-semibold">Finding the best phones for you...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-3.5 py-2.5 border-t border-white/10 bg-black/60">
          <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1.5 font-mono font-semibold">
            Suggested Questions:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-none bg-black hover:bg-[#D4AF37] text-[10px] text-zinc-300 hover:text-black border border-white/15 hover:border-[#D4AF37] transition-all shrink-0 font-mono uppercase tracking-wider disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-zinc-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-white/10 bg-black flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? "Consulting AI Concierge..." : "Ask specs, cameras, battery or price..."}
            className="flex-1 bg-zinc-950 border border-white/15 rounded-none px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] font-sans transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black disabled:opacity-30 transition-all shrink-0 border border-[#D4AF37]"
            title="Send Query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
