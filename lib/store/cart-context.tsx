"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Phone, StorageVariant, ColorVariant } from "@/lib/data/phones";

export interface CartItem {
  id: string; // generated: `${phone.id}-${selectedStorage.id}-${selectedColor.id}`
  phone: Phone;
  selectedStorage: StorageVariant;
  selectedColor: ColorVariant;
  quantity: number;
}

export type DeliveryOption =
  | "express_douala"
  | "express_yaounde"
  | "pickup_bonapriso"
  | "pickup_bastos"
  | "nationwide";

export interface DeliveryMethodInfo {
  id: DeliveryOption;
  name: string;
  price: number;
  timeframe: string;
  badge?: string;
}

export const DELIVERY_OPTIONS: DeliveryMethodInfo[] = [
  {
    id: "express_douala",
    name: "Douala VIP Express (Same-Day)",
    price: 3000,
    timeframe: "Delivered in 2-4 hours",
    badge: "Popular",
  },
  {
    id: "express_yaounde",
    name: "Yaoundé VIP Express (Next-Day)",
    price: 5000,
    timeframe: "Delivered next morning",
  },
  {
    id: "pickup_bonapriso",
    name: "Store Pickup — Douala Bonapriso",
    price: 0,
    timeframe: "Ready in 30 mins",
    badge: "Free",
  },
  {
    id: "pickup_bastos",
    name: "Store Pickup — Yaoundé Bastos",
    price: 0,
    timeframe: "Ready in 30 mins",
    badge: "Free",
  },
  {
    id: "nationwide",
    name: "Nationwide Secure Courier (Cameroon)",
    price: 8000,
    timeframe: "24-48 hours",
  },
];

interface CartContextType {
  items: CartItem[];
  addItem: (phone: Phone, storage: StorageVariant, color: ColorVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  coupon: { code: string; discountPercent?: number; discountAmount?: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  deliveryMethod: DeliveryOption;
  setDeliveryMethod: (method: DeliveryOption) => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discountPercent?: number; discountAmount?: number } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryOption>("express_douala");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_cart_v1");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("aura_cart_v1", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isLoaded]);

  const addItem = (phone: Phone, storage: StorageVariant, color: ColorVariant, quantity: number = 1) => {
    const id = `${phone.id}-${storage.id}-${color.id}`;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id, phone, selectedStorage: storage, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "GOLD10") {
      setCoupon({ code: "GOLD10", discountPercent: 10 });
      return { success: true, message: "Coupon applied: 10% Gold VIP discount!" };
    }
    if (cleanCode === "AURA2026" || cleanCode === "WELCOME") {
      setCoupon({ code: cleanCode, discountAmount: 25000 });
      return { success: true, message: "Coupon applied: 25,000 FCFA welcome gift!" };
    }
    return { success: false, message: "Invalid promo code. Try 'GOLD10' or 'AURA2026'" };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.selectedStorage.price * item.quantity,
    0
  );

  let discount = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100;
    } else if (coupon.discountAmount) {
      discount = Math.min(coupon.discountAmount, subtotal);
    }
  }

  const selectedDeliveryOption =
    DELIVERY_OPTIONS.find((opt) => opt.id === deliveryMethod) || DELIVERY_OPTIONS[0];
  const deliveryFee = subtotal > 0 ? selectedDeliveryOption.price : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        coupon,
        applyCoupon,
        removeCoupon,
        deliveryMethod,
        setDeliveryMethod,
        subtotal,
        discount,
        deliveryFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
