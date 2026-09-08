"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface SiteSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  whatsappPhone: string;
  whatsappCleanNumber: string;
  secondaryPhone: string;
  supportEmail: string;
  bueaAddress: string;
  doualaAddress: string;
  yaoundeAddress: string;
  deliveryFeeBuea: number;
  deliveryFeeDoualaYaounde: number;
  deliveryFeeNationwide: number;
  freeDeliveryThreshold: number;
  openingHours: string;
  mtnMomoNumber: string;
  orangeMoneyNumber: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "AURA LUXE MOBILE",
  tagline: "Premier Luxury Smartphone Boutique — Buea, Molyko (Delivers Nationwide)",
  announcementText: "Showroom in Buea, Molyko • Delivers Nationwide Across Cameroon • 100% Sealed Hardware",
  whatsappPhone: "+237 699 44 21 00",
  whatsappCleanNumber: "237699442100",
  secondaryPhone: "+237 677 88 99 00",
  supportEmail: "concierge@auraluxe.cm",
  bueaAddress: "Check Point, Molyko, Buea",
  doualaAddress: "Check Point, Molyko, Buea (Delivers Nationwide)",
  yaoundeAddress: "Express Nationwide Courier (24h Transit)",
  deliveryFeeBuea: 1500,
  deliveryFeeDoualaYaounde: 3500,
  deliveryFeeNationwide: 3500,
  freeDeliveryThreshold: 500000,
  openingHours: "Mon - Sat: 08:30 – 19:30",
  mtnMomoNumber: "*126# / 677 88 99 00",
  orangeMoneyNumber: "#150# / 699 44 21 00",
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      // 1. Try localStorage
      try {
        const saved = localStorage.getItem("aura_site_settings_v1");
        if (saved) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
        }
      } catch {}

      // 2. Try Supabase
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("site_settings")
            .select("settings")
            .eq("id", "default_settings")
            .maybeSingle();

          if (!error && data?.settings) {
            const merged = { ...DEFAULT_SETTINGS, ...data.settings };
            setSettings(merged);
            localStorage.setItem("aura_site_settings_v1", JSON.stringify(merged));
          }
        } catch {}
      }

      setIsLoading(false);
    }

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const updated: SiteSettings = {
      ...settings,
      ...newSettings,
      // Auto-compute clean numbers
      whatsappCleanNumber: newSettings.whatsappPhone
        ? newSettings.whatsappPhone.replace(/[^0-9]/g, "")
        : settings.whatsappCleanNumber,
    };

    setSettings(updated);

    // Save locally
    try {
      localStorage.setItem("aura_site_settings_v1", JSON.stringify(updated));
    } catch {}

    // Save to Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from("site_settings").upsert({
          id: "default_settings",
          settings: updated,
          updated_at: new Date().toISOString(),
        });
        return !error;
      } catch {
        return false;
      }
    }

    return true;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
