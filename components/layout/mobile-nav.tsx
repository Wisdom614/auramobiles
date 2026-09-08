"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smartphone, RefreshCw, Tag, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();

  const navItems: NavItem[] = [
    { label: "Store", href: "/", icon: Home },
    { label: "Phones", href: "/phones", icon: Smartphone },
    { label: "Swap", href: "/trade-in", icon: RefreshCw },
    { label: "Deals", href: "/phones?deal=true", icon: Tag },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0C0E]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 rounded-lg transition-all ${
                isActive ? "text-[#D4AF37]" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-[#D4AF37]" : ""}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? "font-semibold text-amber-300" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-zinc-400 hover:text-zinc-200"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium text-zinc-300">
            Cart
          </span>
        </button>
      </div>
    </div>
  );
}
