/**
 * High-Performance Unified AI Client for AURA Luxe Mobile
 * Supports Groq API (Llama 3.3 70B / Llama 3.1 8B) & Google Gemini with Automatic Cascading Fallback
 */

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIGenerationOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AIGenerationResult {
  text: string;
  provider: "groq" | "gemini" | "fallback";
  model: string;
}

/**
 * Generate AI text completion with automatic Groq -> Gemini -> Fallback cascade
 */
export async function generateAICompletion(
  options: AIGenerationOptions
): Promise<AIGenerationResult | null> {
  const { messages, temperature = 0.2, maxTokens = 1200, jsonMode = false } = options;

  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. Try Groq API if key is available (Ultra-fast, generous token allowances)
  if (groqApiKey) {
    const groqResult = await callGroqAPI(messages, groqApiKey, {
      temperature,
      maxTokens,
      jsonMode,
    });
    if (groqResult) {
      return groqResult;
    }
  }

  // 2. Fallback to Gemini API if key is available
  if (geminiApiKey) {
    const geminiResult = await callGeminiAPI(messages, geminiApiKey, {
      temperature,
      maxTokens,
      jsonMode,
    });
    if (geminiResult) {
      return geminiResult;
    }
  }

  return null;
}

/**
 * Call Groq Cloud API using OpenAI-compatible format
 */
async function callGroqAPI(
  messages: AIMessage[],
  apiKey: string,
  options: { temperature: number; maxTokens: number; jsonMode: boolean }
): Promise<AIGenerationResult | null> {
  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

  for (const model of models) {
    try {
      const payload: any = {
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      };

      if (options.jsonMode) {
        payload.response_format = { type: "json_object" };
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content && typeof content === "string" && content.trim().length > 0) {
          return {
            text: content.trim(),
            provider: "groq",
            model,
          };
        }
      } else {
        const errText = await response.text();
        console.warn(`Groq API (${model}) failed with status ${response.status}:`, errText);
      }
    } catch (err) {
      console.warn(`Groq API (${model}) request error:`, err);
    }
  }

  return null;
}

/**
 * Call Google Gemini API
 */
async function callGeminiAPI(
  messages: AIMessage[],
  apiKey: string,
  options: { temperature: number; maxTokens: number; jsonMode: boolean }
): Promise<AIGenerationResult | null> {
  // Extract system prompt if present
  const systemMsg = messages.find((m) => m.role === "system");
  const nonSystemMsgs = messages.filter((m) => m.role !== "system");

  const formattedContents = nonSystemMsgs.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];

  for (const model of models) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload: any = {
        contents: formattedContents,
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
        },
      };

      if (systemMsg) {
        payload.systemInstruction = {
          parts: [{ text: systemMsg.content }],
        };
      }

      if (options.jsonMode) {
        payload.generationConfig.responseMimeType = "application/json";
      }

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === "string" && text.trim().length > 0) {
          return {
            text: text.trim(),
            provider: "gemini",
            model,
          };
        }
      } else {
        const errText = await response.text();
        console.warn(`Gemini API (${model}) failed with status ${response.status}:`, errText);
      }
    } catch (err) {
      console.warn(`Gemini API (${model}) request error:`, err);
    }
  }

  return null;
}
