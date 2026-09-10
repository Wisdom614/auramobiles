export interface AspectRatings {
  batteryHealth?: number; // 1 to 5
  deliverySpeed?: number; // 1 to 5
  conditionAccuracy?: number; // 1 to 5
}

export interface ConciergeResponse {
  response: string;
  respondedAt: string;
  responderName: string;
}

export interface CustomerReview {
  id: string;
  phoneId: string; // e.g. "iphone-16-pro-max"
  phoneName: string; // e.g. "iPhone 16 Pro Max"
  clientName: string;
  city: string; // e.g. "Molyko, Buea"
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerified: boolean;
  orderId?: string;
  variantPurchased?: string; // e.g. "256GB • Desert Titanium"
  condition?: string; // "Brand New Sealed" | "Certified Refurbished"
  helpfulCount: number;
  aspectRatings?: AspectRatings;
  conciergeResponse?: ConciergeResponse;
  createdAt: string; // ISO date string
  status: "published" | "hidden";
}

export const INITIAL_REVIEWS: CustomerReview[] = [
  // iPhone 16 Pro Max
  {
    id: "rev-iph16pm-01",
    phoneId: "iphone-16-pro-max",
    phoneName: "iPhone 16 Pro Max",
    clientName: "Dr. Brenda M.",
    city: "Bastos, Yaoundé",
    rating: 5,
    title: "100% Genuine Desert Titanium — Prompt Yaoundé Express Delivery!",
    comment: "I was initially skeptical ordering a flagship online in Cameroon, but AURA Luxe delivered within 24 hours to Bastos. The courier allowed me to check the Apple Serial Number on checkcoverage.apple.com and test the 4K 120fps video before I paid. Truly pristine brand new sealed packaging.",
    isVerified: true,
    orderId: "AUR-92810",
    variantPurchased: "256GB • Desert Titanium",
    condition: "Brand New Sealed",
    helpfulCount: 19,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    conciergeResponse: {
      response: "Thank you Dr. Brenda! We take immense pride in our authentic Apple sourcing and white-glove Yaoundé delivery service. Enjoy your exceptional 16 Pro Max camera system!",
      respondedAt: "2026-09-02T14:30:00Z",
      responderName: "Wisdom (AURA Concierge)",
    },
    createdAt: "2026-09-01T11:20:00Z",
    status: "published",
  },
  {
    id: "rev-iph16pm-02",
    phoneId: "iphone-16-pro-max",
    phoneName: "iPhone 16 Pro Max",
    clientName: "Collins Neba",
    city: "Molyko, Buea",
    rating: 5,
    title: "Picked up at Buea Showroom — Camera Button is incredible",
    comment: "Walked right into their Molyko showroom. The staff transferred all my data from my old 13 Pro Max for free while I had a cup of coffee. The official warranty card and receipt are well-documented. Best phone boutique in SW.",
    isVerified: true,
    orderId: "AUR-91040",
    variantPurchased: "512GB • Natural Titanium",
    condition: "Brand New Sealed",
    helpfulCount: 14,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    createdAt: "2026-09-03T16:45:00Z",
    status: "published",
  },
  {
    id: "rev-iph16pm-03",
    phoneId: "iphone-16-pro-max",
    phoneName: "iPhone 16 Pro Max",
    clientName: "Marcelle Tchakounte",
    city: "Bonapriso, Douala",
    rating: 5,
    title: "Fast dispatch to Douala — Battery life is outstanding",
    comment: "Received same evening in Douala via direct VIP courier. Device came sealed with original Apple factory pull tabs intact. Easily lasts almost 2 full days of heavy business WhatsApp calls and emails.",
    isVerified: true,
    orderId: "AUR-88421",
    variantPurchased: "256GB • Black Titanium",
    condition: "Brand New Sealed",
    helpfulCount: 9,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    createdAt: "2026-09-05T09:15:00Z",
    status: "published",
  },

  // iPhone 15 Pro Max
  {
    id: "rev-iph15pm-01",
    phoneId: "iphone-15-pro-max",
    phoneName: "iPhone 15 Pro Max",
    clientName: "Arrey Divine N.",
    city: "Check Point, Buea",
    rating: 5,
    title: "Certified Refurbished looks completely brand new (100% Battery)",
    comment: "I opted for the Certified Refurbished 256GB Natural Titanium to save some FCFA. When the rider brought it, the screen and frame had zero micro-scratches and battery health showed 100% with original cycle count. Came with 6-month warranty stamped.",
    isVerified: true,
    orderId: "AUR-78291",
    variantPurchased: "256GB • Natural Titanium",
    condition: "Certified Refurbished",
    helpfulCount: 27,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    conciergeResponse: {
      response: "Thank you Arrey! Every refurbished flagship in our vault undergoes a 42-point hardware bench inspection and strict battery quality assurance before tagging.",
      respondedAt: "2026-08-28T10:00:00Z",
      responderName: "AURA Technical Team",
    },
    createdAt: "2026-08-27T18:40:00Z",
    status: "published",
  },
  {
    id: "rev-iph15pm-02",
    phoneId: "iphone-15-pro-max",
    phoneName: "iPhone 15 Pro Max",
    clientName: "Sandra Ebot",
    city: "Limbe, South West",
    rating: 5,
    title: "Delivered to Limbe in under 2 hours!",
    comment: "Called their phone line from Limbe, confirmed the Blue Titanium stock, and had the dispatch rider at my door within 2 hours. Very professional receipt with official QR code tracking.",
    isVerified: true,
    orderId: "AUR-80122",
    variantPurchased: "256GB • Blue Titanium",
    condition: "Brand New Sealed",
    helpfulCount: 11,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    createdAt: "2026-08-30T13:10:00Z",
    status: "published",
  },

  // Samsung Galaxy S24 Ultra
  {
    id: "rev-s24u-01",
    phoneId: "samsung-s24-ultra",
    phoneName: "Samsung Galaxy S24 Ultra",
    clientName: "Engr. Patrick Fongang",
    city: "Akwa, Douala",
    rating: 5,
    title: "Galaxy AI features & Titanium Gray finish are phenomenal",
    comment: "Upgraded from Note 20 Ultra. The flat anti-reflective screen on the S24 Ultra is a game changer in bright Cameroon sunlight. The S-Pen latency is non-existent. AURA Luxe's pay-on-delivery in Douala gave me total peace of mind.",
    isVerified: true,
    orderId: "AUR-84729",
    variantPurchased: "512GB • Titanium Gray",
    condition: "Brand New Sealed",
    helpfulCount: 22,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    conciergeResponse: {
      response: "Engr. Patrick, thank you for your patronage! The S24 Ultra Titanium chassis and flat Corning Gorilla Armor glass are truly pinnacle engineering. Glad you are loving the Galaxy AI tools.",
      respondedAt: "2026-08-20T11:00:00Z",
      responderName: "Wisdom (AURA Concierge)",
    },
    createdAt: "2026-08-19T15:25:00Z",
    status: "published",
  },
  {
    id: "rev-s24u-02",
    phoneId: "samsung-s24-ultra",
    phoneName: "Samsung Galaxy S24 Ultra",
    clientName: "Nji Kingsley",
    city: "Commercial Avenue, Bamenda",
    rating: 5,
    title: "Express delivery to Bamenda with zero stress",
    comment: "Order arrived in Bamenda via regional express agency securely wrapped in bubble vault protection. Tested the 100x zoom and registered Samsung Members warranty without issue.",
    isVerified: true,
    orderId: "AUR-81309",
    variantPurchased: "256GB • Titanium Black",
    condition: "Brand New Sealed",
    helpfulCount: 8,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 4,
      conditionAccuracy: 5,
    },
    createdAt: "2026-08-22T08:50:00Z",
    status: "published",
  },

  // Google Pixel 9 Pro XL
  {
    id: "rev-px9p-01",
    phoneId: "google-pixel-9-pro-xl",
    phoneName: "Google Pixel 9 Pro XL",
    clientName: "Kelly Ashu",
    city: "Molyko, Buea",
    rating: 5,
    title: "The Camera is unbeatable — Clean pure Android 15",
    comment: "Night sight and skin tones on Pixel 9 Pro are unmatched by any other smartphone. Got mine directly at AURA store in Buea. Zero bloatware, silky 120Hz LTPO display. 10/10 recommendation.",
    isVerified: true,
    orderId: "AUR-89012",
    variantPurchased: "256GB • Hazel",
    condition: "Brand New Sealed",
    helpfulCount: 16,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    createdAt: "2026-09-04T12:00:00Z",
    status: "published",
  },

  // Xiaomi 14 Ultra
  {
    id: "rev-mi14u-01",
    phoneId: "xiaomi-14-ultra",
    phoneName: "Xiaomi 14 Ultra",
    clientName: "Jean-Pierre N.",
    city: "Bonamoussadi, Douala",
    rating: 5,
    title: "Leica 1-inch sensor photography beast",
    comment: "If you take photos, nothing touches this 1-inch sensor and variable aperture. AURA Luxe had stock when no other shop in Cameroon could source it. Premium vegan leather back feels exceptional.",
    isVerified: true,
    orderId: "AUR-86711",
    variantPurchased: "512GB • Black Leather",
    condition: "Brand New Sealed",
    helpfulCount: 12,
    aspectRatings: {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    createdAt: "2026-08-25T17:30:00Z",
    status: "published",
  },
];
