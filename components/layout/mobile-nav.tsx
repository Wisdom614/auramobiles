"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smartphone, RefreshCw, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useAuth } from "@/lib/store/auth-context";

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, profile } = useAuth();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Store", href: "/", icon: Home },
    { label: "Phones", href: "/phones", icon: Smartphone },
    { label: "Swap", href: "/trade-in", icon: RefreshCw, highlight: true },
    { label: user || profile ? "Account" : "Sign In", href: "/account", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl rounded-none font-sans"
    >
      <div className="grid grid-cols-5 items-center justify-around text-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center h-full transition-all ${
                isActive ? "text-[#D4AF37]" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-2 right-2 h-[2px] bg-[#D4AF37]" />
              )}
              <div className="relative">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-[#D4AF37]"
                      : item.highlight
                      ? "text-amber-400/80"
                      : "text-zinc-400"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 font-mono tracking-tight uppercase ${
                  isActive ? "font-bold text-[#D4AF37]" : "text-zinc-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Bag / Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center h-full text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] bg-[#D4AF37] text-black font-mono text-[9px] font-black flex items-center justify-center rounded-none leading-none">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-mono tracking-tight uppercase text-zinc-400">
            Bag
          </span>
        </button>
      </div>
    </nav>
  );
}
