export type OrderStatus = "placed" | "confirmed" | "preparing" | "delivering" | "completed";

export interface OrderItem {
  phoneId: string;
  name: string;
  brand: string;
  image: string;
  storage: string;
  color: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryMethod: "express_douala" | "express_yaounde" | "pickup_bonapriso" | "pickup_bastos" | "nationwide";
  paymentMethod: "mtn_momo" | "orange_money" | "cash_on_delivery" | "card";
  paymentPhone?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customer: CustomerDetails;
  trackingNumber: string;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: "AUR-89412",
    createdAt: "2026-03-05T14:32:00Z",
    status: "delivering",
    trackingNumber: "AUR-CM-994182",
    estimatedDelivery: "Today by 18:00 (Douala)",
    subtotal: 980000,
    discount: 50000,
    deliveryFee: 5000,
    total: 935000,
    customer: {
      fullName: "Michel Mbarga",
      email: "michel.mbarga@gmail.com",
      phone: "+237 699 44 21 00",
      address: "Rue Tokoto, Bonapriso",
      city: "Douala",
      deliveryMethod: "express_douala",
      paymentMethod: "mtn_momo",
      paymentPhone: "+237 675 11 22 33",
    },
    items: [
      {
        phoneId: "iphone-16-pro-max",
        name: "iPhone 16 Pro Max",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
        storage: "256GB",
        color: "Desert Titanium",
        price: 980000,
        quantity: 1,
      },
    ],
    timeline: [
      {
        status: "placed",
        title: "Order Received",
        description: "Payment verified via MTN MoMo.",
        timestamp: "05 Mar, 14:32",
        completed: true,
      },
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Reserved in Bonapriso Flagship Boutique.",
        timestamp: "05 Mar, 15:00",
        completed: true,
      },
      {
        status: "preparing",
        title: "Quality Check & Packaged",
        description: "IMEI registered, protective seal applied.",
        timestamp: "05 Mar, 16:15",
        completed: true,
      },
      {
        status: "delivering",
        title: "Out for Express Delivery",
        description: "Courier Paul (AURA VIP Fleet) is on the way.",
        timestamp: "05 Mar, 17:10",
        completed: true,
      },
      {
        status: "completed",
        title: "Delivered & Signed",
        description: "Handed over with 12 months warranty certificate.",
        timestamp: "Estimated 18:00",
        completed: false,
      },
    ],
  },
  {
    id: "AUR-78234",
    createdAt: "2026-02-28T10:15:00Z",
    status: "completed",
    trackingNumber: "AUR-CM-881230",
    estimatedDelivery: "Delivered on 28 Feb",
    subtotal: 850000,
    discount: 0,
    deliveryFee: 0,
    total: 850000,
    customer: {
      fullName: "Serge Ndongo",
      email: "serge.n@outlook.com",
      phone: "+237 677 88 99 00",
      address: "Bastos, Rue 1.452",
      city: "Yaoundé",
      deliveryMethod: "pickup_bastos",
      paymentMethod: "orange_money",
    },
    items: [
      {
        phoneId: "samsung-galaxy-s24-ultra",
        name: "Galaxy S24 Ultra 5G",
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
        storage: "256GB",
        color: "Titanium Gold",
        price: 850000,
        quantity: 1,
      },
    ],
    timeline: [
      {
        status: "placed",
        title: "Order Placed",
        description: "Payment confirmed via Orange Money.",
        timestamp: "28 Feb, 10:15",
        completed: true,
      },
      {
        status: "confirmed",
        title: "Confirmed",
        description: "Stock allocated at Bastos Boutique.",
        timestamp: "28 Feb, 10:30",
        completed: true,
      },
      {
        status: "preparing",
        title: "Prepared",
        description: "Boxed and labeled with VIP care package.",
        timestamp: "28 Feb, 11:00",
        completed: true,
      },
      {
        status: "delivering",
        title: "Ready for Pickup",
        description: "Stored at Bastos concierge desk.",
        timestamp: "28 Feb, 11:30",
        completed: true,
      },
      {
        status: "completed",
        title: "Completed",
        description: "Collected and verified by customer.",
        timestamp: "28 Feb, 14:20",
        completed: true,
      },
    ],
  },
];
