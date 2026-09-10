"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartToast } from "@/components/layout/cart-toast";
import { AiModal } from "@/components/ai-assistant/ai-modal";
import { FloatingConcierge } from "@/components/ai-assistant/floating-concierge";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

export function StorefrontLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProspectus = pathname?.startsWith("/prospectus");

  if (isProspectus) {
    return <main className="min-h-screen w-full bg-[#0E0E12]">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0 w-full overflow-x-hidden">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <CartToast />
      <AiModal />
      <FloatingConcierge />
      <FloatingWhatsApp />
    </div>
  );
}
