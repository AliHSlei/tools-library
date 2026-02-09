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

    const sourceLang = source && source !== "auto" ? source : "autodetect";
    const langpair = `${sourceLang}|${target}`;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`MyMemory API returned ${res.status}`);
    }

    const data = await res.json();

    if (data.responseStatus !== 200 && data.responseStatus !== "200") {
      throw new Error(
        data.responseDetails || "Translation failed"
      );
    }

    return Response.json({
      translatedText: data.responseData.translatedText,
      detectedLanguage: data.responseData.match
        ? { language: sourceLang, confidence: data.responseData.match }
        : undefined,
    });
  } catch (error) {
    console.error("[TRANSLATE]", error);
    const message =
      error instanceof Error ? error.message : "Failed to translate text";
    return Response.json({ error: message }, { status: 500 });
  }
}
