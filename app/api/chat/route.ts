import { NextRequest, NextResponse } from "next/server";
import { PHONES, Phone } from "@/lib/data/phones";
import { getPhonesFromDB } from "@/lib/supabase/client";
import { generateAICompletion } from "@/lib/ai/client";

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

    // Prepare clean concise catalog summary
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
      keySpecs: `${p.specs?.processor || ""} | ${p.specs?.rearCamera || ""} | ${p.specs?.battery || ""} (${p.specs?.charging || ""})`,
    }));

    const systemPrompt = `You are the AURA Luxe Mobile Concierge — an expert, accurate smartphone shopping advisor for AURA Luxe Mobile in Cameroon (Showroom at Check Point, Molyko, Buea; 24h nationwide delivery).

STRICT ACCURACY & BEHAVIOR RULES:
1. STRICT BUDGET FILTERING: When the user specifies a budget (e.g. "under 300k", "250,000 FCFA", "budget 500k"), ONLY recommend phones from the inventory where priceFCFA <= budget. NEVER recommend a phone above their budget unless explicitly framed as a premium upgrade.
2. ACCURATE PRICING & INVENTORY: Quote only exact prices in FCFA (e.g. 245,000 FCFA) as listed in the LIVE INVENTORY below. Do NOT invent prices or phones not in the inventory.
3. CONCISE & CRISP: Keep your response concise (2-4 bullet points or 2-3 short sentences). Always use clean Markdown with bolding (**Phone Name**) and bullet points (•).
4. UNCLEAR / GIBBERISH / GREETINGS: If the user message is a greeting, unclear, typos, or gibberish (e.g. "hi", "hey", "Ybl;1;n"), greet politely, ask for their budget in FCFA or desired brand/features, and return an empty array for recommendedPhoneIds: []. DO NOT guess random budgets or recommend random phones for unclear messages.
5. PHONE COMPARISONS: When asked to compare two phones, compare their Camera, Processor, Battery, and Price side-by-side cleanly and include both phone IDs in recommendedPhoneIds.
6. TRADE-IN / SWAP: Explain that users can trade in their old device via the Trade-In page (/trade-in), get instant valuation, and pay only the difference.

LIVE INVENTORY DATABASE:
${JSON.stringify(catalogSummary, null, 2)}

YOU MUST RESPOND ONLY WITH VALID JSON matching this exact structure:
{
  "message": "Your formatted markdown response here",
  "recommendedPhoneIds": ["id1", "id2"]
}`;

    // Build unified messages array
    const aiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: query },
    ];

    const aiResult = await generateAICompletion({
      messages: aiMessages,
      temperature: 0.2,
      maxTokens: 1200,
      jsonMode: true,
    });

    if (!aiResult || !aiResult.text.trim()) {
      return NextResponse.json(getFallbackResponse(query, catalog));
    }

    let parsedResponse: { message?: string; recommendedPhoneIds?: string[] } | null = null;
    try {
      let rawJson = aiResult.text.trim();
      // Strip markdown codeblocks if present
      if (rawJson.startsWith("```json")) {
        rawJson = rawJson.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
      } else if (rawJson.startsWith("```")) {
        rawJson = rawJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      parsedResponse = JSON.parse(rawJson);
    } catch {
      // If direct JSON parse fails, try extracting JSON substring
      const match = aiResult.text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsedResponse = JSON.parse(match[0]);
        } catch {}
      }
    }

    if (!parsedResponse || !parsedResponse.message) {
      return NextResponse.json(getFallbackResponse(query, catalog));
    }

    // Sanitize and validate recommendedPhoneIds strictly against active catalog
    const validIds = Array.isArray(parsedResponse.recommendedPhoneIds)
      ? parsedResponse.recommendedPhoneIds
          .map((id) => id?.toLowerCase().trim())
          .filter((id) => catalog.some((p) => p.id.toLowerCase() === id || p.slug.toLowerCase() === id))
          .slice(0, 3)
      : [];

    return NextResponse.json({
      text: parsedResponse.message,
      recommendedPhoneIds: validIds,
      source: aiResult.provider,
      model: aiResult.model,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(getFallbackResponse(query, catalog));
  }
}

// Curated concise heuristic fallback
function getFallbackResponse(query: string, catalog: Phone[]) {
  const lower = query.toLowerCase().trim();
  let responseText = "";
  let recs: string[] = [];

  // Check if query is gibberish or very short/unclear
  const isGibberish =
    lower.length < 2 ||
    (!lower.includes(" ") && lower.length > 3 && !/[aeiouy]/.test(lower)) ||
    /^[^a-zA-Z0-9]+$/.test(lower);

  if (isGibberish) {
    return {
      text: "I didn't quite catch that! How can I assist you with your smartphone purchase today?\n\nTell me your **budget in FCFA** or which brand you prefer (Apple, Samsung, Google, Xiaomi, Tecno).",
      recommendedPhoneIds: [],
      source: "curated-heuristics",
    };
  }

  // Budget query parser
  const budgetMatch = lower.match(/(?:under|below|less than|budget of?|around)\s*(\d+)(?:k|\s*000)?/i);
  let parsedBudget: number | null = null;
  if (budgetMatch && budgetMatch[1]) {
    const rawVal = parseInt(budgetMatch[1], 10);
    parsedBudget = rawVal < 1000 ? rawVal * 1000 : rawVal;
  }

  if (parsedBudget) {
    const matchingPhones = catalog
      .filter((p) => p.basePrice <= parsedBudget!)
      .sort((a, b) => b.basePrice - a.basePrice);

    if (matchingPhones.length > 0) {
      const topPicks = matchingPhones.slice(0, 2);
      responseText = `Here are our best options under **${parsedBudget.toLocaleString()} FCFA**:\n\n` +
        topPicks
          .map((p) => `• **${p.name}** (${p.basePrice.toLocaleString()} FCFA) — ${p.specs?.rearCamera || "Pro Camera"}, ${p.specs?.battery || "Long Battery"}.`)
          .join("\n") +
        `\n\nAll available at our Buea showroom with nationwide 24h delivery.`;
      recs = topPicks.map((p) => p.id);
    } else {
      responseText = `We currently do not have smartphones under **${parsedBudget.toLocaleString()} FCFA**. Our lowest entry model starts at **${Math.min(...catalog.map((p) => p.basePrice)).toLocaleString()} FCFA**.\n\nWould you like to explore certified pre-owned options or swap an old phone?`;
      recs = [];
    }
  } else if (
    lower.includes("compare") ||
    (lower.includes("s24") && lower.includes("iphone"))
  ) {
    responseText =
      "• **Galaxy S24 Ultra** (850,000 FCFA): 200MP Quad camera, 100x zoom, built-in S-Pen, and 7 years of Android updates.\n• **iPhone 16 Pro Max** (980,000 FCFA): A18 Pro chip, 4K 120fps Dolby Vision, and industry-leading battery life.\n\n**Recommendation**: Choose S24 Ultra for zoom & multitasking; choose iPhone 16 Pro Max for video recording & resale value.";
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
      "You can easily swap your current phone:\n\n1. Select your phone on our **Swap Page** (`/trade-in`).\n2. Get an instant valuation.\n3. Pay only the difference to get your upgraded phone!\n\nAvailable in our Buea showroom or via courier nationwide.";
    recs = ["iphone-16-pro-max", "samsung-galaxy-s24-ultra"];
  } else {
    responseText =
      "Welcome to AURA Luxe Mobile! We stock 100% genuine sealed & certified pre-owned phones in Buea with nationwide delivery.\n\nTell me your **budget in FCFA**, preferred brand, or favorite feature (camera, gaming, battery) to get a quick recommendation.";
    recs = [];
  }

  return {
    text: responseText,
    recommendedPhoneIds: recs,
    source: "curated-heuristics",
  };
}
