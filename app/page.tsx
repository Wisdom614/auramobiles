import React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { TrustSection } from "@/components/home/trust-section";
import { BrandGrid } from "@/components/home/brand-grid";
import { FeaturedSection } from "@/components/home/featured-section";
import { TradeInPromo } from "@/components/home/trade-in-promo";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export const metadata = {
  title: "AURA Luxe Mobile | Official Flagship Smartphones & Phone Swap",
  description:
    "Official luxury smartphone boutique serving Cameroon. Sealed iPhones, Samsung Galaxy, Xiaomi, Tecno, Infinix & Google Pixel. Same-day express delivery in Douala & Yaoundé.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-[#F4F4F5] w-full max-w-full overflow-x-hidden">
      {/* 3. Hero Section (Matching Reference Design) */}
      <HeroSection />

      {/* 4. Trust / Benefits Strip (5 Guarantees) */}
      <TrustSection />

      {/* 5. Shop by Brand (Apple, Samsung, Xiaomi, Tecno, Infinix, Google) */}
      <BrandGrid />

      {/* 6. Best Sellers / Featured Phones with Brand Filters */}
      <FeaturedSection />

      {/* 7. Trade-In Promotional Section */}
      <TradeInPromo />

      {/* 8. Why Customers Choose Us (Concise Pillars) */}
      <WhyChooseUs />
    </div>
  );
}
