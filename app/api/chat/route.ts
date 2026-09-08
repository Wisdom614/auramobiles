import { NextRequest, NextResponse } from "next/server";
import { PHONES, Phone } from "@/lib/data/phones";
import { getPhonesFromDB } from "@/lib/supabase/client";

export const runtime = "nodejs";

interface ChatRequestMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || "";
    const history: ChatRequestMessage[] = body.history || [];

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 1. Fetch live catalog to ground AI responses in actual inventory
    let catalog: Phone[] = PHONES;
    try {
      const dbPhones = await getPhonesFromDB();
      if (dbPhones && dbPhones.length > 0) {
        catalog = dbPhones;
      }
    } catch {
      catalog = PHONES;
    }

    // Prepare catalog summary for AI context
    const catalogSummary = catalog.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      priceFCFA: p.basePrice,
      originalPriceFCFA: p.originalPrice || null,
      condition: p.condition,
      warranty: p.warranty,
      storageOptions: p.storageVariants?.map((s) => `${s.size}: ${s.price.toLocaleString()} FCFA`).join(", ") || "Standard",
      specs: {
        screen: p.specs?.screen,
        processor: p.specs?.processor,
        ram: p.specs?.ram,
        camera: p.specs?.rearCamera,
        battery: p.specs?.battery,
        charging: p.specs?.charging,
        os: p.specs?.os,
      },
      highlights: p.highlights?.slice(0, 3) || [],
    }));

    const systemPrompt = `You are the AURA Luxe Mobile VIP Neural Concierge — an ultra-sophisticated, authoritative smartphone specialist for AURA Luxe Mobile, Cameroon's premier luxury smartphone & phone swap boutique.

STORE LOCATION & LOGISTICS:
- Physical Showroom & Inspection Vault: Buea, Molyko (Cameroon).
- Delivery: Express courier nationwide across Cameroon (Same-day in Buea, next-day express to Douala, Yaoundé, Bafoussam, Kribi, Bamenda, Garoua, etc.).
- Warranty: Official Boutique Warranty on all units (Factory sealed for Brand New, 65-point certified lab hardware guarantee for Certified Refurbished).
- Phone Swap / Trade-In: Clients can trade in existing phones for instant store credit or cash top-up towards any flagship.

YOUR PERSONALITY & TONE:
- Sophisticated, polite, precise, and tech-savvy.
- Speak in simple, elegant English. Format specs clearly using bold text, concise bullet points, and pricing strictly in FCFA (e.g. 245,000 FCFA).
- When asked for recommendations, always match user budget and lifestyle needs (photography, endurance, gaming, executive presence).
- Ground all recommendations directly in the live boutique inventory provided below.

LIVE BOUTIQUE INVENTORY DATA (Grounding Catalog):
${JSON.stringify(catalogSummary, null, 2)}

OUTPUT FORMAT RULES:
- Provide an insightful, beautifully formatted recommendation response in Markdown.
- At the very end of your response, on a new line, include this exact tag containing the IDs of 1 to 3 best matching phones from the inventory data above:
[RECOMMENDATIONS: id1, id2]
Example: [RECOMMENDATIONS: iphone-16-pro-max, samsung-galaxy-s24-ultra]`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(getFallbackResponse(query, catalog));
    }

    // Format Gemini contents payload
    const formattedContents = [
      ...history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      {
        role: "user",
        parts: [{ text: query }],
      },
    ];

    // Call Google Gemini API (gemini-2.5-flash or gemini-1.5-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    let geminiResponse;
    try {
      geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      // If gemini-2.5-flash is not available, try gemini-1.5-flash
      if (!geminiResponse.ok && geminiResponse.status === 404) {
        const fallbackModelUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        geminiResponse = await fetch(fallbackModelUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: formattedContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });
      }
    } catch (fetchError) {
      console.warn("Gemini API connection error, using curated fallback:", fetchError);
      return NextResponse.json(getFallbackResponse(query, catalog));
    }

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.warn(`Gemini API error (${geminiResponse.status}):`, errorText);
      return NextResponse.json(getFallbackResponse(query, catalog));
    }

    const geminiData = await geminiResponse.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText.trim()) {
      return NextResponse.json(getFallbackResponse(query, catalog));
    }

    // Extract [RECOMMENDATIONS: id1, id2] tag
    let cleanedText = rawText;
    let recommendedIds: string[] = [];
    const recTagMatch = rawText.match(/\[RECOMMENDATIONS:\s*([^\]]+)\]/i);

    if (recTagMatch && recTagMatch[1]) {
      recommendedIds = recTagMatch[1]
        .split(",")
        .map((s: string) => s.trim().toLowerCase())
        .filter((id: string) => catalog.some((p) => p.id.toLowerCase() === id));
      cleanedText = rawText.replace(recTagMatch[0], "").trim();
    }

    // If no explicit tag was found, extract phone IDs by matching names in text
    if (recommendedIds.length === 0) {
      const lower = rawText.toLowerCase();
      catalog.forEach((p) => {
        if (lower.includes(p.name.toLowerCase()) || lower.includes(p.id.toLowerCase())) {
          if (!recommendedIds.includes(p.id) && recommendedIds.length < 3) {
            recommendedIds.push(p.id);
          }
        }
      });
    }

    // If still empty, fall back to default featured items
    if (recommendedIds.length === 0) {
      recommendedIds = catalog.slice(0, 2).map((p) => p.id);
    }

    return NextResponse.json({
      text: cleanedText,
      recommendedPhoneIds: recommendedIds,
      source: "gemini",
      model: "gemini-flash",
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(getFallbackResponse(query, catalog));
  }
}

// Curated heuristic fallback if Gemini API is unreachable or unconfigured
function getFallbackResponse(query: string, catalog: Phone[]) {
  const lower = query.toLowerCase();
  let responseText = "";
  let recs: string[] = [];

  if (
    lower.includes("250") ||
    lower.includes("budget") ||
    lower.includes("cheap") ||
    lower.includes("affordable") ||
    lower.includes("under 300")
  ) {
    responseText =
      "For a budget under 300,000 FCFA, our top recommendation is the **Samsung Galaxy A55 5G** (245,000 FCFA). It features an aluminum frame, 50MP OIS camera, and a 5,000 mAh battery with official boutique warranty.\n\nIf you prefer iOS, the **Certified Refurbished iPhone 13 128GB** (320,000 FCFA) offers flagship A15 Bionic performance and cinematic 4K video capture.\n\nBoth are available at our Buea, Molyko showroom with express delivery nationwide across Cameroon.";
    recs = ["samsung-galaxy-a55", "iphone-13-128gb"];
  } else if (
    lower.includes("compare") ||
    (lower.includes("s24") && lower.includes("iphone"))
  ) {
    responseText =
      "### Flagship Comparison: Galaxy S24 Ultra vs. iPhone 16 Pro Max\n\n• **Samsung Galaxy S24 Ultra** (850,000 FCFA):\n  - 200MP Quad Telephoto Camera system with 100x Space Zoom\n  - Built-in S-Pen stylus and anti-reflective Gorilla Armor glass\n  - Snapdragon 8 Gen 3 for Galaxy with 7 years of Android updates\n\n• **Apple iPhone 16 Pro Max** (980,000 FCFA):\n  - Grade 5 Aerospace Titanium with tactile Camera Control button\n  - A18 Pro silicon with Apple Intelligence architecture\n  - 4K 120 fps Dolby Vision recording with Studio-quality mics\n\n**Verdict**: Select the S24 Ultra for productive multitasking and note-taking; select the iPhone 16 Pro Max for video creation and long-term resale value.";
    recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"];
  } else if (
    lower.includes("battery") ||
    lower.includes("endurance") ||
    lower.includes("charge")
  ) {
    responseText =
      "For class-leading battery endurance in Cameroon, we recommend:\n\n1. **OnePlus 12 5G** (5,400 mAh + 100W SUPERVOOC charging from 1% to 100% in 26 minutes).\n2. **Samsung Galaxy S24 Ultra** (5,000 mAh, easily yields 1.5 to 2 days of mixed usage).\n3. **iPhone 16 Pro Max** (Delivers up to 33 hours continuous video playback, the longest battery life in iPhone history).\n\nAll units come sealed with official boutique warranty.";
    recs = ["oneplus-12", "samsung-galaxy-s24-ultra", "iphone-16-pro-max"];
  } else if (
    lower.includes("camera") ||
    lower.includes("photo") ||
    lower.includes("video")
  ) {
    responseText =
      "For mobile photography, these flagships lead the industry:\n\n• **Xiaomi 14 Ultra** (680,000 FCFA): Co-engineered with Leica, featuring a true 1-inch variable aperture sensor and Quad 50MP cameras.\n• **Google Pixel 9 Pro** (690,000 FCFA): Unrivaled computational photography, Night Sight Video, and Tensor G4 Magic Editor.\n• **iPhone 16 Pro Max** (980,000 FCFA): The uncontested benchmark for 4K 120fps video capture.";
    recs = ["xiaomi-14-ultra", "google-pixel-9-pro", "iphone-16-pro-max"];
  } else if (
    lower.includes("swap") ||
    lower.includes("trade") ||
    lower.includes("exchange")
  ) {
    responseText =
      "AURA provides guaranteed **Phone Swap & Trade-In Services**:\n\n1. Use our online **Trade-In Appraiser** (`/trade-in`) to select your device and calculate instant valuation.\n2. Receive your unique Trade-In Voucher Code.\n3. Bring your phone to our Buea, Molyko showroom or dispatch it via our nationwide courier.\n4. Apply your credit immediately to upgrade to any sealed flagship!";
    recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"];
  } else {
    responseText =
      "Welcome to AURA Luxe Mobile. Our showroom in Buea, Molyko stocks sealed flagships and certified pre-owned smartphones with official boutique warranties and express delivery nationwide.\n\nTell me your desired budget in FCFA, preferred brand (Apple, Samsung, Google, Xiaomi, OnePlus), or primary usage focus (camera, gaming, battery endurance) to receive tailored luxury recommendations.";
    recs = catalog.slice(0, 3).map((p) => p.id);
  }

  return {
    text: responseText,
    recommendedPhoneIds: recs,
    source: "curated-heuristics",
  };
}
