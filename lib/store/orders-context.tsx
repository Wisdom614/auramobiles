"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Order, INITIAL_ORDERS, CustomerDetails, OrderItem } from "@/lib/data/mock-orders";
import { insertOrderToDB } from "@/lib/supabase/client";

interface OrdersContextType {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  createOrder: (data: {
    items: OrderItem[];
    customer: CustomerDetails;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
  }) => Order;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_orders_v1");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("aura_orders_v1", JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders, isLoaded]);

  const getOrder = (id: string): Order | undefined => {
    return orders.find(
      (o) => o.id.toLowerCase() === id.toLowerCase() || o.trackingNumber.toLowerCase() === id.toLowerCase()
    );
  };

  const createOrder = ({
    items,
    customer,
    subtotal,
    discount,
    deliveryFee,
    total,
  }: {
    items: OrderItem[];
    customer: CustomerDetails;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
  }): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `AUR-${randomNum}`;
    const trackingNumber = `AUR-CM-${randomNum + 45000}`;
    const now = new Date();

    const newOrder: Order = {
      id: orderId,
      createdAt: now.toISOString(),
      status: "placed",
      trackingNumber,
      estimatedDelivery: customer.city.toLowerCase().includes("buea")
        ? "Today (Same-Day Express in Buea)"
        : "Tomorrow (Nationwide Express Delivery)",
      subtotal,
      discount,
      deliveryFee,
      total,
      customer,
      items,
      timeline: [
        {
          status: "placed",
          title: "Order Placed",
          description: `Order received. Payment method: ${customer.paymentMethod.replace("_", " ").toUpperCase()}.`,
          timestamp: "Just now",
          completed: true,
        },
        {
          status: "confirmed",
          title: "Order Confirmed",
          description: "Inventory verified in VIP Boutique.",
          timestamp: "Pending",
          completed: false,
        },
        {
          status: "preparing",
          title: "Preparing & Packaging",
          description: "IMEI allocation and luxury packaging.",
          timestamp: "Pending",
          completed: false,
        },
        {
          status: "delivering",
          title: customer.deliveryMethod.startsWith("pickup") ? "Ready for Pickup" : "Out for Delivery",
          description: customer.deliveryMethod.startsWith("pickup")
            ? "Awaiting collection at boutique counter."
            : "Assigned to dedicated VIP courier.",
          timestamp: "Pending",
          completed: false,
        },
        {
          status: "completed",
          title: "Completed & Signed",
          description: "Handover with warranty certificate.",
          timestamp: "Pending",
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Asynchronously write to Supabase
    insertOrderToDB(newOrder).catch(() => {
      // Graceful fallback to local storage
    });
    return newOrder;
  };

  return (
    <OrdersContext.Provider value={{ orders, getOrder, createOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
