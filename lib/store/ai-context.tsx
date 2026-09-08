"use client";

import React, { createContext, useContext, useState } from "react";
import { PHONES, Phone } from "@/lib/data/phones";

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
  sendMessage: (query: string) => void;
  quickPrompts: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    text: "Welcome to AURA Luxe Mobile Concierge. I am your personal smartphone advisor. How can I assist your selection today?",
    recommendedPhoneIds: ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"],
    timestamp: "Just now",
  },
];

const QUICK_PROMPTS = [
  "I have 250,000 FCFA. Which phone has the best camera?",
  "Compare the Galaxy S24 Ultra and iPhone 16 Pro Max.",
  "Show me phones with 2-day battery life.",
  "What is the best certified refurbished phone?",
];

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const sendMessage = (query: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulated AI response logic based on query
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = "";
      let recs: string[] = [];

      if (lower.includes("250") || lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable")) {
        responseText =
          "For a budget around 250,000 FCFA, the Samsung Galaxy A55 5G (245,000 FCFA) is unmatched. It features a triple 50MP camera with OIS, premium metal frame, and a massive 5000 mAh battery. If you can stretch slightly, the Certified Refurbished iPhone 13 (320,000 FCFA) offers superior cinematic video.";
        recs = ["samsung-galaxy-a55", "iphone-13-128gb"];
      } else if (lower.includes("compare") || (lower.includes("s24") && lower.includes("iphone"))) {
        responseText =
          "Between the Galaxy S24 Ultra and iPhone 16 Pro Max: Choose the S24 Ultra (850,000 FCFA) if you need the integrated S-Pen, 200MP sensor, and anti-reflective display. Choose the iPhone 16 Pro Max (980,000 FCFA) for Apple Intelligence, titanium finish, tactile Camera Control, and 4K 120fps Dolby Vision.";
        recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"];
      } else if (lower.includes("battery") || lower.includes("endurance") || lower.includes("charge")) {
        responseText =
          "For maximum battery endurance, the OnePlus 12 5G (5400 mAh + 100W charging in 26 minutes) and Galaxy S24 Ultra (5000 mAh) are class leaders. On iOS, the iPhone 16 Pro Max yields up to 33 hours of continuous video playback.";
        recs = ["oneplus-12", "samsung-galaxy-s24-ultra", "iphone-16-pro-max"];
      } else if (lower.includes("refurbished") || lower.includes("pre-owned") || lower.includes("swap")) {
        responseText =
          "Our certified refurbished models undergo a rigorous 65-point lab inspection with 90%+ battery health guarantee and 6 months official AURA Gold warranty. The iPhone 13 (128GB) at 320,000 FCFA offers phenomenal reliability.";
        recs = ["iphone-13-128gb"];
      } else if (lower.includes("camera") || lower.includes("photo") || lower.includes("video")) {
        responseText =
          "For pure photography, the Xiaomi 14 Ultra (1-inch Leica sensor) and Pixel 9 Pro (Tensor G4 computational photography) stand at the absolute pinnacle of mobile imaging.";
        recs = ["xiaomi-14-ultra", "google-pixel-9-pro", "iphone-16-pro-max"];
      } else {
        responseText =
          "Here are our flagship recommendations crafted for performance, durability, and luxury aesthetics in Central Africa. All models are available in our Douala Bonapriso and Yaoundé Bastos boutiques.";
        recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra", "google-pixel-9-pro"];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: responseText,
        recommendedPhoneIds: recs,
        timestamp: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <AiContext.Provider
      value={{
        isAiOpen,
        setIsAiOpen,
        messages,
        sendMessage,
        quickPrompts: QUICK_PROMPTS,
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
