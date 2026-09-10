import { NextRequest, NextResponse } from "next/server";
import { generateAICompletion } from "@/lib/ai/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface AIPhoneAutofillResult {
  name: string;
  brand: string;
  tagline: string;
  condition: "Brand New" | "Certified Refurbished";
  warranty: string;
  basePrice: number;
  originalPrice: number;
  thumbnail: string;
  extraImages: string[];
  stockCount: number;
  storageTiers: {
    size: string;
    price: number;
    stock: number;
  }[];
  colorName: string;
  colorHex: string;
  screen: string;
  processor: string;
  ram: string;
  rearCamera: string;
  frontCamera: string;
  battery: string;
  charging: string;
  os: string;
  waterResistance: string;
  highlights: string[];
  boxContents: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phoneName = (body.phoneName || body.query || "").trim();
    const action = body.action || "autofill"; // "autofill" | "polish_copy"

    if (!phoneName) {
      return NextResponse.json(
        { error: "Phone name or description is required." },
        { status: 400 }
      );
    }

    if (action === "polish_copy") {
      const polishPrompt = `You are a luxury smartphone copywriter for AURA Luxe Mobile in Cameroon.
Transform this phone note/description into a captivating, high-end luxury marketing tagline (max 1 sentence) and 3 short luxury highlights bullet points tailored for VIP buyers in Central Africa.

Phone: ${phoneName}

Respond ONLY with valid JSON in this exact structure:
{
  "tagline": "Crafted with aerospace-grade titanium and powered by the revolutionary A18 Pro silicon.",
  "highlights": [
    "100% Authentic Device with Official AURA Boutique Guarantee",
    "Studio-grade 48MP Pro camera system with 5x optical telephoto zoom",
    "All-day battery endurance with 50% charge in 30 minutes"
  ]
}`;

      const aiResult = await generateAICompletion({
        messages: [{ role: "user", content: polishPrompt }],
        temperature: 0.3,
        jsonMode: true,
      });

      if (!aiResult || !aiResult.text) {
        return NextResponse.json({
          data: {
            tagline: `${phoneName} - Flagship Luxury Edition with Official AURA Warranty`,
            highlights: [
              "100% Authentic Device with Official Boutique Guarantee",
              "Flagship high-performance processor and pro-grade camera array",
              "Ultra-fast charging with all-day battery efficiency",
            ],
          },
          source: "fallback",
        });
      }

      try {
        const parsed = JSON.parse(aiResult.text);
        return NextResponse.json({ data: parsed, source: aiResult.provider });
      } catch {
        return NextResponse.json({
          data: {
            tagline: `${phoneName} - Flagship Luxury Edition with Official AURA Warranty`,
            highlights: [
              "100% Authentic Device with Official Boutique Guarantee",
              "Flagship high-performance processor and pro-grade camera array",
              "Ultra-fast charging with all-day battery efficiency",
            ],
          },
          source: "fallback",
        });
      }
    }

    // Default: Full Spec Autofill
    const autofillPrompt = `You are the master smartphone database cataloger for AURA Luxe Mobile, Central Africa's premier luxury phone boutique.
The admin is adding a new smartphone to the catalog: "${phoneName}".

Generate a complete, verified, accurate hardware specification, realistic pricing in Central African CFA Francs (FCFA), storage variants, and luxury copywriting for this smartphone.

Rules:
1. Brand: Must be one of ["Apple", "Samsung", "Google", "Xiaomi", "Tecno", "Infinix", "OnePlus"].
2. Prices strictly in Central African CFA Francs (FCFA) - e.g. 250000, 580000, 980000, 1250000 (rounded to 5,000 FCFA).
3. basePrice should be accurate market price in Cameroon for the entry storage tier. originalPrice should be slightly higher for discount display.
4. storageTiers: array of 2-3 realistic tiers (e.g. 128GB, 256GB, 512GB, 1TB) with ascending FCFA prices and default stock count 4-6.
5. specs: Accurate verified specs (Screen, SoC processor, RAM, Rear Camera, Front Camera, Battery mAh, Charging watts, OS, IP water resistance).
6. highlights: Exactly 3 crisp luxury selling points.
7. boxContents: 3-4 realistic items (e.g. "Smartphone Unit", "USB-C to USB-C Cable", "Boutique Authentication Card", "SIM Eject Tool").

Respond ONLY with valid JSON matching this schema:
{
  "name": "Official Phone Model Name",
  "brand": "Apple" | "Samsung" | "Google" | "Xiaomi" | "Tecno" | "Infinix" | "OnePlus",
  "tagline": "Concise luxury marketing tagline",
  "condition": "Brand New",
  "warranty": "Official 1-Year Boutique Warranty",
  "basePrice": 980000,
  "originalPrice": 1050000,
  "thumbnail": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
  "extraImages": [
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
  ],
  "stockCount": 6,
  "storageTiers": [
    { "size": "256GB", "price": 980000, "stock": 4 },
    { "size": "512GB", "price": 1100000, "stock": 3 },
    { "size": "1TB", "price": 1250000, "stock": 2 }
  ],
  "colorName": "Official flagship color name (e.g. Desert Titanium)",
  "colorHex": "#8A8A8E",
  "screen": "6.9\" Super Retina XDR OLED, 120Hz ProMotion",
  "processor": "Apple A18 Pro (3nm)",
  "ram": "8GB Unified Memory",
  "rearCamera": "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
  "frontCamera": "12MP TrueDepth Camera",
  "battery": "4685 mAh",
  "charging": "25W MagSafe Wireless + 30W Wired Fast Charge",
  "os": "iOS 18",
  "waterResistance": "IP68 (6m up to 30 mins)",
  "highlights": [
    "Grade 5 Titanium design with ultra-thin bezels and Action Button",
    "Next-generation 48MP camera system with 4K 120 fps Dolby Vision",
    "Supercharged by the A18 Pro chip with Apple Intelligence"
  ],
  "boxContents": [
    "Device with sealed screen protector",
    "USB-C to USB-C Woven Cable (1m)",
    "Boutique Warranty & Certificate of Authenticity",
    "Documentation & SIM Pin"
  ]
}`;

    const aiResult = await generateAICompletion({
      messages: [{ role: "user", content: autofillPrompt }],
      temperature: 0.2,
      maxTokens: 1200,
      jsonMode: true,
    });

    if (!aiResult || !aiResult.text) {
      return NextResponse.json({
        data: getFallbackAutofill(phoneName),
        source: "fallback",
      });
    }

    try {
      const parsed: AIPhoneAutofillResult = JSON.parse(aiResult.text);
      return NextResponse.json({ data: parsed, source: aiResult.provider });
    } catch {
      return NextResponse.json({
        data: getFallbackAutofill(phoneName),
        source: "fallback",
      });
    }
  } catch (error: any) {
    console.error("AI Admin Autofill Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI phone specifications." },
      { status: 500 }
    );
  }
}

// Fallback heuristic database for when API key is unavailable or offline
function getFallbackAutofill(query: string): AIPhoneAutofillResult {
  const q = query.toLowerCase();
  let brand = "Apple";
  let name = query;
  let price = 650000;
  let processor = "Flagship Octa-Core Processor";
  let screen = "6.7\" 120Hz AMOLED Display";
  let camera = "50MP Triple Pro Camera";
  let frontCamera = "32MP HDR Camera";
  let battery = "5000 mAh";
  let charging = "65W Fast Charging";
  let os = "Android 15 / Latest Flagship OS";
  let colorName = "Titanium Black";
  let colorHex = "#2C2C2E";
  let image = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80";

  if (q.includes("iphone") || q.includes("apple")) {
    brand = "Apple";
    if (q.includes("16 pro max")) {
      name = "iPhone 16 Pro Max";
      price = 980000;
      processor = "Apple A18 Pro (3nm)";
      screen = "6.9\" Super Retina XDR OLED, 120Hz";
      camera = "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto";
      frontCamera = "12MP TrueDepth Camera";
      battery = "4685 mAh";
      charging = "30W Fast Charging & 25W MagSafe";
      os = "iOS 18";
      colorName = "Desert Titanium";
      colorHex = "#C4A482";
      image = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80";
    } else if (q.includes("16 pro")) {
      name = "iPhone 16 Pro";
      price = 850000;
      processor = "Apple A18 Pro (3nm)";
      screen = "6.3\" Super Retina XDR OLED, 120Hz";
      camera = "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto";
      frontCamera = "12MP TrueDepth";
      battery = "3582 mAh";
      charging = "25W MagSafe & Wired Fast Charging";
      os = "iOS 18";
      colorName = "Natural Titanium";
      colorHex = "#8A8A8E";
      image = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80";
    } else if (q.includes("15 pro max")) {
      name = "iPhone 15 Pro Max";
      price = 780000;
      processor = "Apple A17 Pro (3nm)";
      screen = "6.7\" Super Retina XDR OLED, 120Hz";
      camera = "48MP + 12MP + 12MP 5x Optical";
      battery = "4441 mAh";
      os = "iOS 17";
      colorName = "Blue Titanium";
      colorHex = "#3B4D61";
    } else {
      name = query.startsWith("iPhone") ? query : `iPhone ${query}`;
      price = 620000;
      processor = "Apple Bionic Silicon";
      os = "iOS 18";
    }
  } else if (q.includes("samsung") || q.includes("galaxy") || q.includes("s25") || q.includes("s24")) {
    brand = "Samsung";
    if (q.includes("s25 ultra") || q.includes("s24 ultra")) {
      name = q.includes("s25") ? "Samsung Galaxy S25 Ultra" : "Samsung Galaxy S24 Ultra";
      price = 890000;
      processor = "Snapdragon 8 Elite / 8 Gen 3 for Galaxy";
      screen = "6.8\" Dynamic AMOLED 2X, 120Hz, 2600 nits";
      camera = "200MP Main + 50MP Periscope 5x + 10MP 3x + 12MP UW";
      frontCamera = "12MP Dual Pixel";
      battery = "5000 mAh";
      charging = "45W Fast Charging & 15W Wireless";
      os = "One UI 7 (Android 15)";
      colorName = "Titanium Black";
      colorHex = "#2B2B2B";
      image = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80";
    } else {
      name = query.startsWith("Samsung") ? query : `Samsung ${query}`;
      price = 540000;
      processor = "Snapdragon Flagship Processor";
      os = "One UI 7 (Android 15)";
    }
  } else if (q.includes("pixel") || q.includes("google")) {
    brand = "Google";
    name = query.startsWith("Google") ? query : `Google ${query}`;
    price = 680000;
    processor = "Google Tensor G4 (4nm)";
    screen = "6.8\" Super Actua LTPO OLED, 120Hz";
    camera = "50MP Main + 48MP 5x Telephoto + 48MP UW";
    frontCamera = "42MP Dual PD";
    battery = "5060 mAh";
    charging = "37W Fast Charging";
    os = "Android 15 with 7 Years OS Updates";
    colorName = "Obsidian Black";
    colorHex = "#1D1D1F";
    image = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80";
  } else if (q.includes("tecno") || q.includes("camon") || q.includes("phantom")) {
    brand = "Tecno";
    name = query.startsWith("Tecno") ? query : `Tecno ${query}`;
    price = 280000;
    processor = "MediaTek Dimensity 8200 Ultimate 5G";
    screen = "6.77\" 1.5K 120Hz LTPO AMOLED";
    camera = "50MP Sony IMX890 + 50MP Periscope + 50MP UW";
    frontCamera = "50MP Autofocus Selfie";
    battery = "5000 mAh";
    charging = "70W Ultra Fast Charge";
    os = "HiOS 14 (Android 14)";
    colorName = "Alps Snowy Silver";
    colorHex = "#E0E0E0";
  } else if (q.includes("infinix") || q.includes("zero") || q.includes("gt")) {
    brand = "Infinix";
    name = query.startsWith("Infinix") ? query : `Infinix ${query}`;
    price = 260000;
    processor = "MediaTek Dimensity 8020 5G";
    screen = "6.78\" 3D Curved 144Hz AMOLED";
    camera = "108MP OIS Main + 13MP UW";
    frontCamera = "50MP 4K 60fps Video";
    battery = "5000 mAh";
    charging = "68W Super Charge";
    os = "XOS 14";
    colorName = "Cyber Black";
    colorHex = "#1C1C1E";
  } else if (q.includes("xiaomi") || q.includes("redmi") || q.includes("poco")) {
    brand = "Xiaomi";
    name = query.startsWith("Xiaomi") ? query : `Xiaomi ${query}`;
    price = 450000;
    processor = "Snapdragon 8 Gen 3";
    screen = "6.73\" LTPO AMOLED, 120Hz, Dolby Vision";
    camera = "50MP Leica Quad Lens System";
    frontCamera = "32MP HDR";
    battery = "5000 mAh";
    charging = "90W HyperCharge";
    os = "Xiaomi HyperOS (Android 14)";
    colorName = "Black Titanium";
    colorHex = "#222222";
  } else if (q.includes("oneplus")) {
    brand = "OnePlus";
    name = query.startsWith("OnePlus") ? query : `OnePlus ${query}`;
    price = 590000;
    processor = "Snapdragon 8 Gen 3";
    screen = "6.82\" 2K ProXDR 120Hz LTPO AMOLED";
    camera = "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP UW";
    frontCamera = "32MP Sony IMX615";
    battery = "5400 mAh";
    charging = "100W SUPERVOOC Fast Charge";
    os = "OxygenOS 14 (Android 14)";
    colorName = "Silky Black";
    colorHex = "#1E1E1E";
  }

  return {
    name,
    brand,
    tagline: `Flagship Luxury Edition with Official 1-Year AURA Boutique Warranty`,
    condition: "Brand New",
    warranty: "Official 1-Year Boutique Warranty",
    basePrice: price,
    originalPrice: price + 40000,
    thumbnail: image,
    extraImages: [image],
    stockCount: 6,
    storageTiers: [
      { size: "256GB", price: price, stock: 4 },
      { size: "512GB", price: price + 90000, stock: 3 },
    ],
    colorName,
    colorHex,
    screen,
    processor,
    ram: "12GB / 16GB High-Speed LPDDR5X",
    rearCamera: camera,
    frontCamera,
    battery,
    charging,
    os,
    waterResistance: "IP68 Dust/Water Resistant",
    highlights: [
      "100% Authentic Hardware with Official Boutique Guarantee",
      "Pro-grade camera system with crystal-clear HDR photography",
      "Ultra-fast charging and high-efficiency all-day battery life",
    ],
    boxContents: [
      "Device with factory protective seal",
      "Fast Charging Cable & Adapter",
      "AURA Boutique Warranty Card",
      "SIM Ejector Pin & Manuals",
    ],
  };
}
