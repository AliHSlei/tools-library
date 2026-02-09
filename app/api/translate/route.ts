import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, source, target } = await request.json();

    if (!text || !target) {
      return Response.json(
        { error: "Missing required fields: text, target" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.LIBRETRANSLATE_URL || "https://libretranslate.com";

    const res = await fetch(`${apiUrl}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: source || "auto",
        target,
        format: "text",
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[TRANSLATE] API error:", errBody);
      throw new Error(`LibreTranslate returned ${res.status}`);
    }

    const data = await res.json();

    return Response.json({
      translatedText: data.translatedText,
      detectedLanguage: data.detectedLanguage,
    });
  } catch (error) {
    console.error("[TRANSLATE]", error);
    return Response.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
