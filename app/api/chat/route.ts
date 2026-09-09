import { NextRequest, NextResponse } from "next/server";
import { PHONES, Phone } from "@/lib/data/phones";
import { getPhonesFromDB } from "@/lib/supabase/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const systemPrompt = `You are the AURA Luxe Mobile Assistant — a friendly, expert smartphone advisor for AURA Luxe Mobile in Cameroon (Showroom at Check Point, Molyko, Buea; nationwide 24h delivery).

CRITICAL RESPONSE LENGTH & FORMATTING RULES:
1. BE SHORT, CRISP, AND BRIEF: Keep your response under 2–4 short bullet points or 2–3 concise sentences. Never write long essays or large walls of text.
2. Direct to the point: Answer the user's question immediately with clear recommendations and key specs (Camera, Battery, Processor).
3. Prices strictly in FCFA (e.g., 245,000 FCFA).
4. Use clean Markdown formatting with bolding (**Phone Name**) and bullet points (•).
5. At the very end of your response, on a new line, include this exact tag with 1 to 3 matching phone IDs from the inventory:
[RECOMMENDATIONS: id1, id2]

LIVE STORE INVENTORY:
${JSON.stringify(catalogSummary, null, 2)}`;

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
            maxOutputTokens: 350,
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
              maxOutputTokens: 350,
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

// Curated concise heuristic fallback
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
      "Here are our best options under 300,000 FCFA:\n\n• **Samsung Galaxy A55 5G** (245,000 FCFA) — 50MP OIS camera, AMOLED 120Hz display & 5,000mAh battery.\n• **iPhone 13 128GB** (320,000 FCFA, Pre-Owned) — A15 Bionic chip & 4K cinematic video.\n\nBoth available in Buea with nationwide 24h delivery.";
    recs = ["samsung-galaxy-a55", "iphone-13-128gb"];
  } else if (
    lower.includes("compare") ||
    (lower.includes("s24") && lower.includes("iphone"))
  ) {
    responseText =
      "• **Galaxy S24 Ultra** (850,000 FCFA): 200MP camera, 100x zoom, built-in S-Pen, and 7 years of Android updates.\n• **iPhone 16 Pro Max** (980,000 FCFA): A18 Pro chip, 4K 120fps Dolby Vision, and industry-leading battery life.\n\n**Tip**: Choose S24 Ultra for productivity & zoom; choose iPhone 16 Pro Max for video recording & resale value.";
    recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"];
  } else if (
    lower.includes("battery") ||
    lower.includes("endurance") ||
    lower.includes("charge")
  ) {
    responseText =
      "Top battery champions in our store:\n\n• **OnePlus 12 5G** (5,400mAh + 100W charging in 26 mins)\n• **Galaxy S24 Ultra** (5,000mAh, solid 2-day battery)\n• **iPhone 16 Pro Max** (Up to 33h video playback)\n\nAll backed by official boutique warranty.";
    recs = ["oneplus-12", "samsung-galaxy-s24-ultra", "iphone-16-pro-max"];
  } else if (
    lower.includes("camera") ||
    lower.includes("photo") ||
    lower.includes("video")
  ) {
    responseText =
      "Best camera smartphones right now:\n\n• **Xiaomi 14 Ultra** (680,000 FCFA) — Leica 1-inch sensor, 50MP Quad.\n• **Google Pixel 9 Pro** (690,000 FCFA) — Best computational photo & Night Sight.\n• **iPhone 16 Pro Max** (980,000 FCFA) — Benchmark 4K 120fps video.";
    recs = ["xiaomi-14-ultra", "google-pixel-9-pro", "iphone-16-pro-max"];
  } else if (
    lower.includes("swap") ||
    lower.includes("trade") ||
    lower.includes("exchange")
  ) {
    responseText =
      "You can easily swap your current phone:\n\n1. Select your phone on our **Swap Page** (`/trade-in`).\n2. Get an instant valuation.\n3. Pay only the difference to get your upgraded phone!\n\nAvailable in our Buea showroom or via courier.";
    recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"];
  } else {
    responseText =
      "Welcome to AURA Luxe Mobile! We stock 100% genuine sealed & certified pre-owned phones in Buea with nationwide delivery.\n\nTell me your **budget in FCFA**, preferred brand, or favorite feature (camera, gaming, battery) to get a quick recommendation.";
    recs = catalog.slice(0, 2).map((p) => p.id);
  }

  return {
    text: responseText,
    recommendedPhoneIds: recs,
    source: "curated-heuristics",
  };
}
