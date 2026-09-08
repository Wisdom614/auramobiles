export interface StorageVariant {
  id: string;
  size: string;
  price: number; // in FCFA
  stock: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export interface PhoneSpecs {
  screen: string;
  processor: string;
  ram: string;
  rearCamera: string;
  frontCamera: string;
  battery: string;
  charging: string;
  os: string;
  network: string;
  weight: string;
  waterResistance: string;
}

export interface Phone {
  id: string;
  slug: string;
  name: string;
  brand: "Apple" | "Samsung" | "Google" | "Xiaomi" | "OnePlus" | "Tecno" | "Infinix";
  tagline: string;
  category: "flagship" | "camera" | "battery" | "gaming" | "refurbished";
  basePrice: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isDeal?: boolean;
  dealEndsInHours?: number;
  condition: "Brand New" | "Certified Refurbished";
  warranty: string;
  storageVariants: StorageVariant[];
  colorVariants: ColorVariant[];
  images: string[];
  specs: PhoneSpecs;
  highlights: string[];
  boxContents: string[];
}

export const PHONES: Phone[] = [
  {
    id: "iphone-16-pro-max",
    slug: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    tagline: "Forged in titanium. Powered by A18 Pro.",
    category: "flagship",
    basePrice: 980000,
    originalPrice: 1050000,
    rating: 4.9,
    reviewCount: 168,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isDeal: true,
    dealEndsInHours: 18,
    condition: "Brand New",
    warranty: "12 Months Official Apple Warranty",
    storageVariants: [
      { id: "256gb", size: "256GB", price: 980000, stock: 9 },
      { id: "512gb", size: "512GB", price: 1150000, stock: 4 },
      { id: "1tb", size: "1TB", price: 1320000, stock: 2 },
    ],
    colorVariants: [
      {
        id: "desert-titanium",
        name: "Desert Titanium",
        hex: "#C4A68A",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "natural-titanium",
        name: "Natural Titanium",
        hex: "#9F9A95",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "black-titanium",
        name: "Black Titanium",
        hex: "#3C3B37",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.9-inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits peak",
      processor: "Apple A18 Pro (3nm)",
      ram: "8GB LPDDR5X",
      rearCamera: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto with 4K 120 fps Dolby Vision",
      frontCamera: "12MP TrueDepth with Autofocus",
      battery: "4685 mAh (Up to 33 hours video playback)",
      charging: "MagSafe wireless 25W, Qi2, USB-C 3.2 Gen 2",
      os: "iOS 18 with Apple Intelligence",
      network: "5G Ultra Wideband, Dual eSIM or Nano-SIM + eSIM",
      weight: "227g",
      waterResistance: "IP68 (6 meters up to 30 mins)",
    },
    highlights: [
      "New Camera Control button for instant tactile photo and video capture",
      "Next-generation 48MP Ultra Wide sensor captures immense macro detail",
      "Industry-leading battery life lasting up to 33 hours on a single charge",
      "Apple Intelligence integration for contextual on-device workflow acceleration",
    ],
    boxContents: ["iPhone 16 Pro Max", "USB-C to USB-C Braided Cable (1m)", "Documentation & SIM Ejector"],
  },
  {
    id: "samsung-galaxy-s24-ultra",
    slug: "samsung-galaxy-s24-ultra",
    name: "Galaxy S24 Ultra 5G",
    brand: "Samsung",
    tagline: "Galaxy AI is here. Titanium precision.",
    category: "flagship",
    basePrice: 850000,
    originalPrice: 920000,
    rating: 4.9,
    reviewCount: 142,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    isDeal: false,
    condition: "Brand New",
    warranty: "24 Months Official Samsung Warranty",
    storageVariants: [
      { id: "256gb", size: "256GB", price: 850000, stock: 12 },
      { id: "512gb", size: "512GB", price: 980000, stock: 6 },
      { id: "1tb", size: "1TB", price: 1180000, stock: 3 },
    ],
    colorVariants: [
      {
        id: "titanium-yellow",
        name: "Titanium Gold",
        hex: "#D9C179",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "titanium-black",
        name: "Titanium Black",
        hex: "#2B2B2B",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "titanium-gray",
        name: "Titanium Gray",
        hex: "#7A7A7B",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits, Gorilla Armor Anti-Reflective",
      processor: "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      ram: "12GB LPDDR5X",
      rearCamera: "200MP Main + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP Ultra-Wide",
      frontCamera: "12MP Dual Pixel AF",
      battery: "5000 mAh (45W wired, 15W wireless)",
      charging: "45W Fast Charging (65% in 30 mins)",
      os: "One UI 6.1 with 7 years of OS & Security upgrades",
      network: "5G SA/NSA, Dual SIM + eSIM",
      weight: "232g",
      waterResistance: "IP68 Water & Dust Resistant",
    },
    highlights: [
      "Built-in S Pen with lower latency and remote gesture commands",
      "Corning Gorilla Armor significantly cuts glare and reflections outdoors",
      "Circle to Search with Google and Live Two-way Call Translation",
      "Monster 200MP primary sensor with nightography AI image signal processor",
    ],
    boxContents: ["Galaxy S24 Ultra", "Integrated S-Pen", "USB-C to USB-C Cable", "Ejection Pin"],
  },
  {
    id: "iphone-16",
    slug: "iphone-16",
    name: "iPhone 16",
    brand: "Apple",
    tagline: "Total power. Vibrant color. A18 speed.",
    category: "flagship",
    basePrice: 650000,
    originalPrice: 710000,
    rating: 4.8,
    reviewCount: 94,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isDeal: false,
    condition: "Brand New",
    warranty: "12 Months Official Apple Warranty",
    storageVariants: [
      { id: "128gb", size: "128GB", price: 650000, stock: 15 },
      { id: "256gb", size: "256GB", price: 730000, stock: 8 },
      { id: "512gb", size: "512GB", price: 890000, stock: 4 },
    ],
    colorVariants: [
      {
        id: "ultramarine",
        name: "Ultramarine",
        hex: "#385292",
        image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "teal",
        name: "Teal Green",
        hex: "#4D807A",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "black",
        name: "Midnight Black",
        hex: "#1E2022",
        image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.1-inch Super Retina XDR OLED, 2000 nits peak outdoor",
      processor: "Apple A18 (3nm)",
      ram: "8GB LPDDR5X",
      rearCamera: "48MP Fusion 2-in-1 camera with 2x Telephoto + 12MP Ultra Wide with Macro",
      frontCamera: "12MP TrueDepth with Autofocus",
      battery: "3561 mAh (Up to 22 hours video playback)",
      charging: "USB-C, MagSafe wireless up to 25W",
      os: "iOS 18",
      network: "5G, Dual SIM",
      weight: "170g",
      waterResistance: "IP68 rating",
    },
    highlights: [
      "Camera Control button for immediate access to photographic tools",
      "Action button customizable to flashlight, voice memo, or shortcuts",
      "Color-infused glass back with aerospace-grade aluminum enclosure",
    ],
    boxContents: ["iPhone 16", "USB-C Charge Cable", "Documentation"],
  },
  {
    id: "google-pixel-9-pro",
    slug: "google-pixel-9-pro",
    name: "Pixel 9 Pro",
    brand: "Google",
    tagline: "Gemini built-in. Exceptional computational photography.",
    category: "camera",
    basePrice: 720000,
    originalPrice: 790000,
    rating: 4.8,
    reviewCount: 63,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isDeal: true,
    dealEndsInHours: 24,
    condition: "Brand New",
    warranty: "12 Months International Warranty",
    storageVariants: [
      { id: "128gb", size: "128GB", price: 720000, stock: 7 },
      { id: "256gb", size: "256GB", price: 810000, stock: 5 },
      { id: "512gb", size: "512GB", price: 950000, stock: 2 },
    ],
    colorVariants: [
      {
        id: "hazel",
        name: "Hazel Gold",
        hex: "#87887E",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "obsidian",
        name: "Obsidian",
        hex: "#202124",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "porcelain",
        name: "Porcelain",
        hex: "#F1EFEA",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.3-inch Super Actua LTPO OLED, 1-120Hz, 3000 nits peak",
      processor: "Google Tensor G4 with Titan M2",
      ram: "16GB RAM for on-device AI models",
      rearCamera: "50MP Main + 48MP Ultra-Wide with Macro + 48MP 5x Telephoto (up to 30x Super Res Zoom)",
      frontCamera: "42MP Dual PD with Autofocus",
      battery: "4700 mAh (Over 24h battery life, 100h Extreme Battery Saver)",
      charging: "Fast wired 27W, Fast Wireless Charging",
      os: "Android 15 with 7 years of OS upgrades and Feature Drops",
      network: "5G mmWave + Sub 6GHz, Dual SIM",
      weight: "199g",
      waterResistance: "IP68",
    },
    highlights: [
      "Full 16GB RAM allows Gemini Nano with Multimodality to run locally",
      "Add Me feature ensures the photographer is seamlessly included in group shots",
      "Pro camera controls with full manual ISO, shutter speed, and RAW output",
    ],
    boxContents: ["Pixel 9 Pro", "1m USB-C to USB-C cable (USB 2.0)", "Quick Switch Adapter", "SIM tool"],
  },
  {
    id: "iphone-15-pro",
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    tagline: "Pro power. Titanium chassis. A17 Pro.",
    category: "flagship",
    basePrice: 720000,
    originalPrice: 820000,
    rating: 4.9,
    reviewCount: 215,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isDeal: true,
    dealEndsInHours: 12,
    condition: "Brand New",
    warranty: "12 Months Official Apple Warranty",
    storageVariants: [
      { id: "128gb", size: "128GB", price: 720000, stock: 6 },
      { id: "256gb", size: "256GB", price: 790000, stock: 10 },
      { id: "512gb", size: "512GB", price: 920000, stock: 3 },
    ],
    colorVariants: [
      {
        id: "blue-titanium",
        name: "Blue Titanium",
        hex: "#2E3B4E",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "natural-titanium",
        name: "Natural Titanium",
        hex: "#8F8A83",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.1-inch Super Retina XDR OLED, 120Hz ProMotion, Always-On display",
      processor: "Apple A17 Pro (3nm)",
      ram: "8GB RAM",
      rearCamera: "48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto",
      frontCamera: "12MP TrueDepth",
      battery: "3274 mAh",
      charging: "USB-C 3.0 (up to 10Gbps transfer speed)",
      os: "iOS 18 compatible",
      network: "5G",
      weight: "187g",
      waterResistance: "IP68",
    },
    highlights: [
      "Action button replaces legacy mute switch",
      "Console gaming capability with hardware-accelerated Ray Tracing",
      "USB 3 transfer speeds for instant tethered 4K ProRes capture",
    ],
    boxContents: ["iPhone 15 Pro", "Braided USB-C Cable", "SIM tool"],
  },
  {
    id: "iphone-13-128gb",
    slug: "iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    tagline: "Unbeatable value. Incredible performance and dual cameras.",
    category: "refurbished",
    basePrice: 320000,
    originalPrice: 380000,
    rating: 4.7,
    reviewCount: 340,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    isDeal: false,
    condition: "Certified Refurbished",
    warranty: "6 Months AURA Gold Certified Warranty",
    storageVariants: [
      { id: "128gb", size: "128GB", price: 320000, stock: 24 },
      { id: "256gb", size: "256GB", price: 370000, stock: 11 },
      { id: "512gb", size: "512GB", price: 440000, stock: 4 },
    ],
    colorVariants: [
      {
        id: "midnight",
        name: "Midnight",
        hex: "#1A202C",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "starlight",
        name: "Starlight Gold",
        hex: "#F8F5EC",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "blue",
        name: "Deep Blue",
        hex: "#2B4C6F",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.1-inch Super Retina XDR OLED, 1200 nits peak HDR",
      processor: "Apple A15 Bionic (5nm)",
      ram: "4GB RAM",
      rearCamera: "12MP Wide with Sensor-Shift OIS + 12MP Ultra Wide with Cinematic Mode",
      frontCamera: "12MP TrueDepth",
      battery: "3240 mAh (Battery Health Guaranteed 90%+)",
      charging: "Lightning 20W, MagSafe 15W",
      os: "iOS 18 compatible",
      network: "5G",
      weight: "174g",
      waterResistance: "IP68 tested",
    },
    highlights: [
      "Inspected through our 65-point laboratory certified test process",
      "Cinematic mode in 1080p at 30 fps with automatic focus racking",
      "Battery health certified above 90% with 6-month free battery replacement",
    ],
    boxContents: ["iPhone 13", "Fast Charging Cable", "AURA Certification Certificate"],
  },
  {
    id: "samsung-galaxy-z-fold-5",
    slug: "samsung-galaxy-z-fold-5",
    name: "Galaxy Z Fold 5 5G",
    brand: "Samsung",
    tagline: "Unfold a massive workspace in the palm of your hand.",
    category: "flagship",
    basePrice: 950000,
    originalPrice: 1100000,
    rating: 4.8,
    reviewCount: 48,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    isDeal: true,
    dealEndsInHours: 36,
    condition: "Brand New",
    warranty: "24 Months Official Samsung Warranty",
    storageVariants: [
      { id: "256gb", size: "256GB", price: 950000, stock: 5 },
      { id: "512gb", size: "512GB", price: 1080000, stock: 3 },
    ],
    colorVariants: [
      {
        id: "phantom-black",
        name: "Phantom Black",
        hex: "#1E1E20",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "icy-blue",
        name: "Icy Blue",
        hex: "#B2C5D6",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "7.6-inch Dynamic AMOLED 2X 120Hz Internal + 6.2-inch External Display",
      processor: "Snapdragon 8 Gen 2 for Galaxy",
      ram: "12GB RAM",
      rearCamera: "50MP Main + 10MP 3x Telephoto + 12MP Ultra-Wide",
      frontCamera: "4MP Under-Display + 10MP Cover Camera",
      battery: "4400 mAh",
      charging: "25W Wired, 15W Wireless",
      os: "Android 14 / One UI 6",
      network: "5G, Dual SIM",
      weight: "253g",
      waterResistance: "IPX8 Water Resistant",
    },
    highlights: [
      "Zero-gap Flex Hinge folds completely flat",
      "Multi-window multitasking runs up to three applications simultaneously",
      "Taskbar navigation for desktop-level productivity on the go",
    ],
    boxContents: ["Galaxy Z Fold 5", "Data Cable (USB-C to C)", "Ejection pin"],
  },
  {
    id: "xiaomi-14-ultra",
    slug: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra 5G",
    brand: "Xiaomi",
    tagline: "Co-engineered with Leica. Quad 50MP optical system.",
    category: "camera",
    basePrice: 780000,
    originalPrice: 850000,
    rating: 4.9,
    reviewCount: 52,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isDeal: false,
    condition: "Brand New",
    warranty: "12 Months Official Warranty",
    storageVariants: [
      { id: "512gb", size: "512GB", price: 780000, stock: 7 },
      { id: "1tb", size: "1TB", price: 920000, stock: 2 },
    ],
    colorVariants: [
      {
        id: "white-leather",
        name: "Titanium Gold Vegan Leather",
        hex: "#D6C3A1",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "black",
        name: "Black Ceramic",
        hex: "#1A1A1A",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.73-inch WQHD+ AMOLED 120Hz LTPO, 3000 nits, Dolby Vision",
      processor: "Snapdragon 8 Gen 3 (4nm)",
      ram: "16GB LPDDR5X",
      rearCamera: "1-inch Sony LYT-900 50MP stepless aperture + 50MP 3.2x + 50MP 5x Periscope + 50MP Ultra-Wide",
      frontCamera: "32MP 4K Selfie",
      battery: "5000 mAh",
      charging: "90W HyperCharge (100% in 33 mins), 80W Wireless",
      os: "Xiaomi HyperOS",
      network: "5G, Dual SIM",
      weight: "220g",
      waterResistance: "IP68",
    },
    highlights: [
      "Continuous variable physical aperture from f/1.63 to f/4.0",
      "Leica Summilux optical lenses with extraordinary light gathering power",
      "Lightning-fast 90W HyperCharge wired and 80W wireless charger included",
    ],
    boxContents: ["Xiaomi 14 Ultra", "90W Fast Wall Adapter", "USB-C Cable", "Protective Case"],
  },
  {
    id: "oneplus-12",
    slug: "oneplus-12",
    name: "OnePlus 12 5G",
    brand: "OnePlus",
    tagline: "Smooth Beyond Belief. 4th Gen Hasselblad Camera.",
    category: "battery",
    basePrice: 590000,
    originalPrice: 650000,
    rating: 4.8,
    reviewCount: 77,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    isDeal: false,
    condition: "Brand New",
    warranty: "12 Months Official Warranty",
    storageVariants: [
      { id: "256gb", size: "256GB", price: 590000, stock: 10 },
      { id: "512gb", size: "512GB", price: 680000, stock: 5 },
    ],
    colorVariants: [
      {
        id: "flowy-emerald",
        name: "Emerald Green",
        hex: "#2F5244",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "silky-black",
        name: "Silky Black",
        hex: "#1E1E1E",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.82-inch 2K 120Hz ProXDR Display, 4500 nits peak brightness",
      processor: "Snapdragon 8 Gen 3",
      ram: "16GB RAM",
      rearCamera: "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultra-Wide",
      frontCamera: "32MP Selfie",
      battery: "5400 mAh Dual-cell (Up to 2 days)",
      charging: "100W SUPERVOOC (1-100% in 26 minutes), 50W AIRVOOC Wireless",
      os: "OxygenOS 14",
      network: "5G",
      weight: "220g",
      waterResistance: "IP65 with Aqua Touch technology",
    },
    highlights: [
      "Aqua Touch allows flawless touchscreen response even in heavy rain",
      "Massive 5400 mAh battery delivers best-in-class endurance",
      "Ultra-fast 100W SUPERVOOC charging gets you from 0 to 100% in under half an hour",
    ],
    boxContents: ["OnePlus 12", "100W SUPERVOOC Power Adapter", "Type-A to C Cable", "SIM Ejector"],
  },
  {
    id: "samsung-galaxy-a55",
    slug: "samsung-galaxy-a55-5g",
    name: "Galaxy A55 5G",
    brand: "Samsung",
    tagline: "Awesome metal frame, vibrant nightography, 2-day battery.",
    category: "battery",
    basePrice: 245000,
    originalPrice: 280000,
    rating: 4.7,
    reviewCount: 119,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    isDeal: false,
    condition: "Brand New",
    warranty: "24 Months Official Samsung Warranty",
    storageVariants: [
      { id: "128gb", size: "128GB", price: 245000, stock: 20 },
      { id: "256gb", size: "256GB", price: 285000, stock: 14 },
    ],
    colorVariants: [
      {
        id: "awesome-navy",
        name: "Awesome Navy",
        hex: "#1F2D3D",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "awesome-lemon",
        name: "Awesome Gold",
        hex: "#E0D59D",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.6-inch Super AMOLED 120Hz FHD+, 1000 nits HBM",
      processor: "Exynos 1480 (4nm) with AMD Xclipse 530 GPU",
      ram: "8GB RAM",
      rearCamera: "50MP OIS + 12MP Ultra-Wide + 5MP Macro",
      frontCamera: "32MP Selfie",
      battery: "5000 mAh (Up to 2 days)",
      charging: "25W Fast Charging",
      os: "One UI 6.1 with 4 OS upgrades",
      network: "5G",
      weight: "213g",
      waterResistance: "IP67 Water & Dust",
    },
    highlights: [
      "Premium metal side frame design reminiscent of flagship devices",
      "Samsung Knox Vault hardware security for peace of mind",
      "Superb battery stamina easily lasting through demanding workdays",
    ],
    boxContents: ["Galaxy A55 5G", "USB-C Cable", "SIM Ejector"],
  },
  {
    id: "tecno-camon-30-premier",
    slug: "tecno-camon-30-premier-5g",
    name: "Tecno Camon 30 Premier 5G",
    brand: "Tecno",
    tagline: "PolarAce AI Imaging. Sony dual 50MP periscope zoom.",
    category: "camera",
    basePrice: 385000,
    originalPrice: 420000,
    rating: 4.8,
    reviewCount: 94,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    isDeal: false,
    condition: "Brand New",
    warranty: "13 Months Carlcare Official Warranty",
    storageVariants: [
      { id: "512gb", size: "512GB", price: 385000, stock: 11 },
    ],
    colorVariants: [
      {
        id: "alps-snowy-silver",
        name: "Alps Snowy Silver",
        hex: "#D8D8D8",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "hawaii-black",
        name: "Hawaii Black",
        hex: "#222222",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.77-inch 1.5K LTPO AMOLED 120Hz, 1400 nits",
      processor: "MediaTek Dimensity 8200 Ultimate 5G + Sony CXD5622GG ISP",
      ram: "12GB + 12GB Extended RAM",
      rearCamera: "50MP Sony IMX890 OIS + 50MP 3x Periscope Telephoto + 50MP Ultra-Wide",
      frontCamera: "50MP Eye-Tracking AF",
      battery: "5000 mAh Dual-Cell",
      charging: "70W Ultra Charge (0 to 100% in 45 mins)",
      os: "HIOS 14 (Android 14)",
      network: "5G Dual SIM",
      weight: "210g",
      waterResistance: "IP54 Dust & Splash Resistant",
    },
    highlights: [
      "Dedicated Sony Imaging chip for crisp 4K Ultra Night HDR video",
      "Massive 512GB UFS 3.1 storage out of the box",
      "Luxury vintage rangefinder camera aesthetic with vegan leather back",
    ],
    boxContents: ["Camon 30 Premier 5G", "70W Charger", "Type-C Cable", "VIP Carlcare Card", "Protective Case"],
  },
  {
    id: "infinix-gt-20-pro",
    slug: "infinix-gt-20-pro-5g",
    name: "Infinix GT 20 Pro 5G",
    brand: "Infinix",
    tagline: "Mecha Loop LED. Dual-chip gaming master with 144Hz AMOLED.",
    category: "gaming",
    basePrice: 285000,
    originalPrice: 315000,
    rating: 4.7,
    reviewCount: 76,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    isDeal: true,
    dealEndsInHours: 24,
    condition: "Brand New",
    warranty: "12 Months Official Carlcare Warranty",
    storageVariants: [
      { id: "256gb", size: "256GB", price: 285000, stock: 15 },
    ],
    colorVariants: [
      {
        id: "mecha-silver",
        name: "Mecha Silver",
        hex: "#B0B3B8",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "mecha-blue",
        name: "Mecha Blue",
        hex: "#234166",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    ],
    specs: {
      screen: "6.78-inch FHD+ 144Hz Bezel-less AMOLED",
      processor: "Dimensity 8200 Ultimate + Pixelworks X5 Turbo Gaming Chip",
      ram: "12GB LPDDR5X RAM",
      rearCamera: "108MP OIS Samsung HM6 + 2MP Macro + 2MP Depth",
      frontCamera: "32MP Dual Flash Selfie",
      battery: "5000 mAh High-Density",
      charging: "45W Hyper Charge + Bypass Charging Mode",
      os: "Clean XOS 14 (Pure gaming OS, Zero bloatware)",
      network: "5G",
      weight: "194g",
      waterResistance: "IP54 Splash Resistant",
    },
    highlights: [
      "Pixelworks dedicated display chip rendering games up to 120 FPS",
      "Cyber Mecha design with interactive RGB mini-LED notification ring",
      "Bypass charging allows direct motherboard power during intense gaming",
    ],
    boxContents: ["Infinix GT 20 Pro", "45W Adapter", "Braided L-shape Cable", "Magnetic Cooling Case"],
  },
];

export function getPhoneBySlug(slug: string): Phone | undefined {
  return PHONES.find((p) => p.slug === slug || p.id === slug);
}

export function getRelatedPhones(phone: Phone, limit = 4): Phone[] {
  return PHONES.filter((p) => p.id !== phone.id && (p.brand === phone.brand || p.category === phone.category)).slice(0, limit);
}
