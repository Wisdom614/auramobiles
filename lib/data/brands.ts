export interface Brand {
  id: string;
  name: string;
  count: number;
  featured: boolean;
  description: string;
}

export const BRANDS: Brand[] = [
  { id: "Apple", name: "Apple", count: 6, featured: true, description: "iPhone 16 Pro, 15 Pro, and Certified Pre-Owned" },
  { id: "Samsung", name: "Samsung", count: 5, featured: true, description: "Galaxy S24 Ultra, Z Fold 5, and A Series" },
  { id: "Xiaomi", name: "Xiaomi", count: 3, featured: true, description: "Xiaomi 14 Ultra Co-engineered with Leica" },
  { id: "Tecno", name: "Tecno", count: 4, featured: true, description: "Phantom V Fold 2, Camon 30 Premier 5G" },
  { id: "Infinix", name: "Infinix", count: 3, featured: true, description: "Zero 40 5G, GT 20 Pro Gaming Master" },
  { id: "Google", name: "Google Pixel", count: 2, featured: true, description: "Pixel 9 Pro with Gemini Intelligence" },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  tag: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "flagships",
    name: "Elite Flagships",
    slug: "flagship",
    description: "Top-tier titanium and glass engineering with peak performance.",
    iconName: "Crown",
    tag: "Pro Level",
  },
  {
    id: "cameras",
    name: "Studio Optics",
    slug: "camera",
    description: "Periscope zooms, 1-inch sensors, and computational image mastery.",
    iconName: "Camera",
    tag: "4K/8K Video",
  },
  {
    id: "battery",
    name: "Battery Champions",
    slug: "battery",
    description: "5000+ mAh dual-cells engineered for 2-day multi-tasking endurance.",
    iconName: "Zap",
    tag: "All Day",
  },
  {
    id: "refurbished",
    name: "Certified Pre-Owned",
    slug: "refurbished",
    description: "65-point laboratory inspected with genuine battery health guaranteed.",
    iconName: "ShieldCheck",
    tag: "Save up to 40%",
  },
];
