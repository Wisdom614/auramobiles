import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import { AppProviders } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartToast } from "@/components/layout/cart-toast";
import { AiModal } from "@/components/ai-assistant/ai-modal";
import { FloatingConcierge } from "@/components/ai-assistant/floating-concierge";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { NavigationProgressBar } from "@/components/ui/navigation-progress-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA Luxe Mobile | Premium Smartphones & Phone Swap Boutique",
  description:
    "Official flagship smartphones, certified pre-owned devices, same-day delivery in Douala & Yaoundé, and instant trade-in valuations in Central Africa.",
  keywords: [
    "Smartphones Douala",
    "iPhone Cameroon",
    "Samsung Galaxy Yaounde",
    "Phone Swap Cameroon",
    "Buy Phone FCFA",
    "AURA Mobile",
  ],
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { StorefrontLayoutShell } from "@/components/layout/storefront-layout-shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://xvebczhhzydbpxmffydx.supabase.co" />
        <link rel="preconnect" href="https://xvebczhhzydbpxmffydx.supabase.co" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#F4F4F5] overflow-x-hidden w-full">
        <AppProviders>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <StorefrontLayoutShell>{children}</StorefrontLayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
