"use client";

import React from "react";
import { CartProvider } from "@/lib/store/cart-context";
import { WishlistProvider } from "@/lib/store/wishlist-context";
import { CompareProvider } from "@/lib/store/compare-context";
import { OrdersProvider } from "@/lib/store/orders-context";
import { AiProvider } from "@/lib/store/ai-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <OrdersProvider>
      <WishlistProvider>
        <CompareProvider>
          <CartProvider>
            <AiProvider>{children}</AiProvider>
          </CartProvider>
        </CompareProvider>
      </WishlistProvider>
    </OrdersProvider>
  );
}
