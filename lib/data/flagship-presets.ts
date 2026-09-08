import { Phone } from "./phones";

export interface FlagshipPreset {
  id: string;
  name: string;
  brand: Phone["brand"];
  condition: Phone["condition"];
  tagline: string;
  basePrice: number;
  originalPrice: number;
  thumbnail: string;
  images: string[];
  storageVariants: { size: string; price: number; stock: number }[];
  colorVariants: { name: string; hex: string }[];
  specs: {
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
  };
  highlights: string[];
  boxContents: string[];
}

export const FLAGSHIP_PRESETS: FlagshipPreset[] = [
  {
    id: "preset-iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    condition: "Brand New",
    tagline: "Apple's Ultimate Flagship with Grade 5 Titanium & A18 Pro Chip",
    basePrice: 1150000,
    originalPrice: 1250000,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "256GB", price: 1150000, stock: 6 },
      { size: "512GB", price: 1320000, stock: 4 },
      { size: "1TB", price: 1520000, stock: 2 },
    ],
    colorVariants: [
      { name: "Desert Titanium", hex: "#C5A98A" },
      { name: "Natural Titanium", hex: "#9A958E" },
      { name: "White Titanium", hex: "#F2F1ED" },
      { name: "Black Titanium", hex: "#2E2E30" },
    ],
    specs: {
      screen: "6.9\" Super Retina XDR OLED 120Hz ProMotion",
      processor: "Apple A18 Pro (3nm)",
      ram: "8GB Unified High-Speed RAM",
      rearCamera: "48MP Fusion + 48MP Ultrawide + 12MP 5x Telephoto",
      frontCamera: "12MP TrueDepth HDR Camera",
      battery: "4,685 mAh (Up to 33 hrs Video Playback)",
      charging: "MagSafe Wireless & 27W USB-C Fast Charge",
      os: "iOS 18 with Apple Intelligence",
      network: "5G Ultra Wideband / Dual eSIM / Nano-SIM",
      weight: "227g",
      waterResistance: "IP68 (6m depth up to 30 mins)",
    },
    highlights: [
      "Grade 5 Titanium frame with refined micro-blasted finish",
      "New Camera Control tactile sapphire crystal button",
      "Apple Intelligence with on-device AI privacy",
      "Official Boutique Concierge Warranty",
    ],
    boxContents: [
      "iPhone 16 Pro Max",
      "Braided USB-C Charge Cable (1m)",
      "AURA Luxe Certification & Authenticity Card",
    ],
  },
  {
    id: "preset-iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "Apple",
    condition: "Brand New",
    tagline: "Pro Power in a Compact 6.3-inch Titanium Chassis",
    basePrice: 980000,
    originalPrice: 1080000,
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "128GB", price: 980000, stock: 5 },
      { size: "256GB", price: 1080000, stock: 6 },
      { size: "512GB", price: 1250000, stock: 3 },
    ],
    colorVariants: [
      { name: "Natural Titanium", hex: "#9A958E" },
      { name: "Desert Titanium", hex: "#C5A98A" },
      { name: "Black Titanium", hex: "#2E2E30" },
    ],
    specs: {
      screen: "6.3\" Super Retina XDR OLED 120Hz ProMotion",
      processor: "Apple A18 Pro (3nm)",
      ram: "8GB Unified Memory",
      rearCamera: "48MP Fusion + 48MP Ultrawide + 12MP 5x Telephoto",
      frontCamera: "12MP TrueDepth Camera",
      battery: "3,582 mAh (Up to 27 hrs Video)",
      charging: "27W USB-C & MagSafe Wireless",
      os: "iOS 18 with Apple Intelligence",
      network: "5G Ultra Wideband",
      weight: "199g",
      waterResistance: "IP68 Certified",
    },
    highlights: [
      "Compact 6.3\" titanium form-factor with 5x optical zoom",
      "All-new Camera Control sapphire surface",
      "A18 Pro Next-gen Ray Tracing Gaming Chip",
      "Official Boutique Hardware Warranty",
    ],
    boxContents: [
      "iPhone 16 Pro",
      "Braided USB-C Charge Cable",
      "AURA Luxe Official Guarantee Card",
    ],
  },
  {
    id: "preset-iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    condition: "Certified Refurbished",
    tagline: "First Titanium iPhone with A17 Pro & 5x Tetraprism Zoom",
    basePrice: 780000,
    originalPrice: 890000,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "256GB", price: 780000, stock: 7 },
      { size: "512GB", price: 890000, stock: 4 },
      { size: "1TB", price: 990000, stock: 2 },
    ],
    colorVariants: [
      { name: "Blue Titanium", hex: "#3B444C" },
      { name: "Natural Titanium", hex: "#9A958E" },
      { name: "White Titanium", hex: "#F2F1ED" },
    ],
    specs: {
      screen: "6.7\" Super Retina XDR OLED 120Hz",
      processor: "Apple A17 Pro (3nm)",
      ram: "8GB RAM",
      rearCamera: "48MP Main + 12MP 5x Telephoto + 12MP Ultrawide",
      frontCamera: "12MP TrueDepth Camera",
      battery: "4,441 mAh (Certified 98%+ Battery Health)",
      charging: "20W Fast Charge & MagSafe",
      os: "iOS 18 Supported",
      network: "5G Sub-6 & mmWave",
      weight: "221g",
      waterResistance: "IP68 Certified",
    },
    highlights: [
      "Grade A+ Certified Pre-Owned with 98%+ Battery Health",
      "Lightweight aerospace-grade Titanium enclosure",
      "Customizable Action Button",
      "6-Month Direct Replacement Guarantee",
    ],
    boxContents: [
      "iPhone 15 Pro Max (Certified Tested)",
      "Premium Fast Charging Cable",
      "AURA 50-Point Inspection Certificate",
    ],
  },
  {
    id: "preset-samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    condition: "Brand New",
    tagline: "The Zenith of Android Luxury with Galaxy AI & Embedded S-Pen",
    basePrice: 920000,
    originalPrice: 1050000,
    thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "256GB", price: 920000, stock: 5 },
      { size: "512GB", price: 1050000, stock: 4 },
      { size: "1TB", price: 1220000, stock: 2 },
    ],
    colorVariants: [
      { name: "Titanium Gray", hex: "#7E7E7A" },
      { name: "Titanium Black", hex: "#292929" },
      { name: "Titanium Violet", hex: "#5C526A" },
      { name: "Titanium Yellow", hex: "#E8D898" },
    ],
    specs: {
      screen: "6.8\" Dynamic AMOLED 2X 120Hz (2,600 nits) Anti-Reflective",
      processor: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)",
      ram: "12GB LPDDR5X",
      rearCamera: "200MP Main + 50MP 5x + 10MP 3x + 12MP Ultrawide",
      frontCamera: "12MP Dual Pixel AF",
      battery: "5,000 mAh (Intelligent Battery Management)",
      charging: "45W Wired Fast Charging (65% in 30 mins) & 15W Wireless",
      os: "Android 14 with One UI 6.1 (7 Years OS Updates)",
      network: "5G Dual SIM + eSIM",
      weight: "232g",
      waterResistance: "IP68 Dust & Water Resistant",
    },
    highlights: [
      "Titanium shield with flat Corning Gorilla Armor anti-glare display",
      "Galaxy AI Live Translate, Circle to Search & Photo Assist",
      "Integrated S-Pen stylus for precision handwriting & notes",
      "Quad Tele Zoom system up to 100x Space Zoom",
    ],
    boxContents: [
      "Galaxy S24 Ultra with Embedded S-Pen",
      "Type-C to Type-C 5A Cable",
      "Ejection Pin & AURA Boutique Warranty Card",
    ],
  },
  {
    id: "preset-samsung-z-fold-6",
    name: "Samsung Galaxy Z Fold 6",
    brand: "Samsung",
    condition: "Brand New",
    tagline: "Next-Era Ultra-Slim Foldable Powerhouse with Dual Displays",
    basePrice: 1280000,
    originalPrice: 1400000,
    thumbnail: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "256GB", price: 1280000, stock: 3 },
      { size: "512GB", price: 1420000, stock: 2 },
    ],
    colorVariants: [
      { name: "Silver Shadow", hex: "#C7C8CC" },
      { name: "Navy Blue", hex: "#1D2B44" },
      { name: "Pink Gold", hex: "#E9C0B8" },
    ],
    specs: {
      screen: "7.6\" Foldable AMOLED 120Hz + 6.3\" Cover Screen (2,600 nits)",
      processor: "Qualcomm Snapdragon 8 Gen 3 (4nm)",
      ram: "12GB RAM",
      rearCamera: "50MP Dual Pixel OIS + 10MP 3x Telephoto + 12MP Ultrawide",
      frontCamera: "10MP Cover + 4MP Under-Display",
      battery: "4,400 mAh Dual-Cell Battery",
      charging: "25W Fast Charge & Fast Wireless 2.0",
      os: "Android 14 with One UI 6.1.1 Fold Edition",
      network: "5G Sub-6 / Dual SIM",
      weight: "239g (Slimmest Fold ever)",
      waterResistance: "IP48 Water Resistant",
    },
    highlights: [
      "Symmetrical Dual-Rail FlexHinge for extreme durability",
      "Galaxy AI split-screen interpreter & note assist",
      "Armor Aluminum enhanced frame",
      "Official Boutique Screen Protection Guarantee",
    ],
    boxContents: [
      "Galaxy Z Fold 6",
      "Type-C Fast Data Cable",
      "VIP Concierge Handover Card",
    ],
  },
  {
    id: "preset-pixel-9-pro-xl",
    name: "Google Pixel 9 Pro XL",
    brand: "Google",
    condition: "Brand New",
    tagline: "Gemini Nano GenAI Engine with Industry-Leading Computational Optics",
    basePrice: 850000,
    originalPrice: 950000,
    thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "128GB", price: 850000, stock: 4 },
      { size: "256GB", price: 930000, stock: 4 },
      { size: "512GB", price: 1080000, stock: 2 },
    ],
    colorVariants: [
      { name: "Obsidian", hex: "#1C1C1E" },
      { name: "Porcelain", hex: "#F2EFE9" },
      { name: "Hazel", hex: "#636862" },
      { name: "Rose Quartz", hex: "#E9C4BC" },
    ],
    specs: {
      screen: "6.8\" Super Actua LTPO OLED 1-120Hz (3,000 nits Peak)",
      processor: "Google Tensor G4 with Titan M2 Co-processor",
      ram: "16GB RAM for Local Gemini Models",
      rearCamera: "50MP Main + 48MP 5x Quad PD Telephoto + 48MP Ultrawide",
      frontCamera: "42MP Dual PD Selfie Camera with AF",
      battery: "5,060 mAh (Up to 100 hrs with Extreme Battery Saver)",
      charging: "37W Fast USB-C (70% in 30 mins) & Qi Certified",
      os: "Android 15 (7 Years Feature Drops & Security)",
      network: "5G Ultra Wideband",
      weight: "221g",
      waterResistance: "IP68 Certified",
    },
    highlights: [
      "Built for Gemini Nano AI: Add Me, Pixel Studio & Magic Editor",
      "Pro Triple Camera with Super Res Zoom up to 30x",
      "Stunning 3,000 nits Super Actua sunlight display",
      "Official Boutique Concierge Warranty",
    ],
    boxContents: [
      "Pixel 9 Pro XL",
      "1m USB-C to USB-C Cable (USB 2.0)",
      "SIM Tool & Quick Switch Adapter",
    ],
  },
  {
    id: "preset-xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    condition: "Brand New",
    tagline: "Leica Quad-Camera Legendary Photography Monster",
    basePrice: 790000,
    originalPrice: 880000,
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "512GB", price: 790000, stock: 4 },
      { size: "1TB", price: 920000, stock: 2 },
    ],
    colorVariants: [
      { name: "Black Vegan Leather", hex: "#1C1B19" },
      { name: "White Ceramic", hex: "#F2F2F2" },
    ],
    specs: {
      screen: "6.73\" WQHD+ AMOLED 120Hz LTPO (3,000 nits)",
      processor: "Qualcomm Snapdragon 8 Gen 3",
      ram: "16GB LPDDR5X",
      rearCamera: "50MP 1-inch LYT-900 Variable Aperture + 50MP 3.2x + 50MP 5x + 50MP Ultrawide",
      frontCamera: "32MP 4K Camera",
      battery: "5,000 mAh High-Density",
      charging: "90W HyperCharge (100% in 33 mins) + 80W Wireless",
      os: "Xiaomi HyperOS",
      network: "5G Dual SIM",
      weight: "220g",
      waterResistance: "IP68 Certified",
    },
    highlights: [
      "Leica Summilux Optical lenses with 1-inch Sony LYT-900 sensor",
      "Stepless variable aperture f/1.63 - f/4.0",
      "Xiaomi Guardian Structure with vegan nano-tech leather",
      "Blazing 90W fast charging in the box",
    ],
    boxContents: [
      "Xiaomi 14 Ultra",
      "90W Fast Charger Included",
      "USB-C Cable & Boutique Warranty Slip",
    ],
  },
  {
    id: "preset-tecno-phantom-v-fold-2",
    name: "Tecno Phantom V Fold 2 5G",
    brand: "Tecno",
    condition: "Brand New",
    tagline: "Africa's Premier Luxury Foldable Flagship with Dual 120Hz Screens",
    basePrice: 650000,
    originalPrice: 720000,
    thumbnail: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "512GB", price: 650000, stock: 5 },
    ],
    colorVariants: [
      { name: "Karst Green", hex: "#234135" },
      { name: "Rippling Blue", hex: "#1C3550" },
    ],
    specs: {
      screen: "7.85\" 2K+ Foldable AMOLED 120Hz + 6.42\" FHD+ Sub-Screen",
      processor: "MediaTek Dimensity 9000+ 5G (4nm)",
      ram: "12GB RAM (+ 12GB Extended)",
      rearCamera: "50MP Ultra Clear + 50MP Portrait Telephoto + 50MP Ultrawide",
      frontCamera: "32MP Inner + 32MP Outer",
      battery: "5,750 mAh Monster Battery",
      charging: "70W Ultra Charge (50% in 20 mins) & 15W Wireless",
      os: "HiOS 14 Fold Edition",
      network: "5G Dual SIM",
      weight: "249g",
      waterResistance: "IP54 Splash Resistant",
    },
    highlights: [
      "Massive 5,750 mAh battery — largest on any foldable phone",
      "70W fast charging power adapter included in box",
      "Aerospace-grade drop-shaped hinge with zero gap fold",
      "Official Carlcare Boutique Guarantee",
    ],
    boxContents: [
      "Phantom V Fold 2 5G",
      "70W Super Charger & Cable",
      "Exclusive Protective Aramid Case & VIP Card",
    ],
  },
  {
    id: "preset-infinix-zero-40",
    name: "Infinix Zero 40 5G",
    brand: "Infinix",
    condition: "Brand New",
    tagline: "4K 60fps Pro Vlogging Flagship with 108MP OIS Optics",
    basePrice: 285000,
    originalPrice: 320000,
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    ],
    storageVariants: [
      { size: "256GB", price: 285000, stock: 8 },
      { size: "512GB", price: 320000, stock: 5 },
    ],
    colorVariants: [
      { name: "Violet Garden", hex: "#7E5B7E" },
      { name: "Moving Titanium", hex: "#7A7A78" },
      { name: "Rock Black", hex: "#222222" },
    ],
    specs: {
      screen: "6.78\" 3D Curved AMOLED 144Hz (1,300 nits)",
      processor: "MediaTek Dimensity 8200 Ultimate 5G (4nm)",
      ram: "12GB RAM (+ 12GB Extended)",
      rearCamera: "108MP OIS Main + 50MP Ultrawide 120° + 2MP Depth",
      frontCamera: "50MP 4K 60fps Ultra AF Vlog Camera",
      battery: "5,000 mAh All-Day Power",
      charging: "45W FastCharge (60% in 25 mins) & 20W Wireless",
      os: "XOS 14.5 based on Android 14",
      network: "5G Dual SIM",
      weight: "195g",
      waterResistance: "IP54 Splash Resistant",
    },
    highlights: [
      "World-first GoPro mode integration & 4K 60fps front & rear video",
      "Smooth 144Hz 3D curved borderless display",
      "Both 45W wired and 20W wireless charging supported",
      "Official Warranty with VIP replacement",
    ],
    boxContents: [
      "Infinix Zero 40 5G",
      "45W Fast Charger & USB-C Cable",
      "Premium Protective Case & Earphones",
    ],
  },
];
