"use client";

import React, { createContext, useContext, useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  recommendedPhoneIds?: string[];
  timestamp: string;
}

interface AiContextType {
  isAiOpen: boolean;
  setIsAiOpen: (open: boolean) => void;
  messages: ChatMessage[];
  sendMessage: (query: string) => Promise<void>;
  quickPrompts: string[];
  isTyping: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    text: "Hello! I am your AURA smartphone advisor.\n\nTell me your **budget in FCFA**, brand preference, or what you're looking for (e.g. best camera, long battery life).",
    recommendedPhoneIds: ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"],
    timestamp: "Just now",
  },
];

const QUICK_PROMPTS = [
  "Best camera phone under 300,000 FCFA?",
  "Compare S24 Ultra vs iPhone 16 Pro Max",
  "Phones with long battery life (5,000mAh+)",
  "How does Phone Swap / Trade-In work?",
];

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Build conversation history for API
      const history = updatedMessages.slice(-6).map((m) => ({
        role: m.sender,
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: data.text || "I apologize, could you please repeat that?",
        recommendedPhoneIds: Array.isArray(data.recommendedPhoneIds) ? data.recommendedPhoneIds : [],
        timestamp: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn("Client chat error, falling back:", err);
      // Fallback response if network issue
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: "We stock sealed flagships and pre-owned phones in Buea with 24h delivery nationwide.\n\nFor instant stock confirmation, you can also chat with us directly on WhatsApp (+237 699 44 21 00).",
        recommendedPhoneIds: ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"],
        timestamp: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AiContext.Provider
      value={{
        isAiOpen,
        setIsAiOpen,
        messages,
        sendMessage,
        quickPrompts: QUICK_PROMPTS,
        isTyping,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
}
