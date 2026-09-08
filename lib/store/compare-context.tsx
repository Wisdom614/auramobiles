"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CompareContextType {
  compareList: string[]; // phone IDs (max 4)
  addToCompare: (phoneId: string) => boolean;
  removeFromCompare: (phoneId: string) => void;
  isInCompare: (phoneId: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>(["iphone-16-pro-max", "samsung-galaxy-s24-ultra"]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_compare_v1");
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("aura_compare_v1", JSON.stringify(compareList));
    } catch {
      // ignore
    }
  }, [compareList, isLoaded]);

  const addToCompare = (phoneId: string): boolean => {
    if (compareList.includes(phoneId)) return true;
    if (compareList.length >= 4) {
      return false; // limit reached
    }
    setCompareList((prev) => [...prev, phoneId]);
    return true;
  };

  const removeFromCompare = (phoneId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== phoneId));
  };

  const isInCompare = (phoneId: string) => compareList.includes(phoneId);

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareList.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
