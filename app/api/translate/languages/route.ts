let languageCache: { data: unknown[]; timestamp: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  try {
    if (languageCache && Date.now() - languageCache.timestamp < CACHE_TTL) {
      return Response.json(languageCache.data);
    }

    const apiUrl = process.env.LIBRETRANSLATE_URL || "https://libretranslate.com";
    const res = await fetch(`${apiUrl}/languages`);

    if (!res.ok) {
      throw new Error(`LibreTranslate returned ${res.status}`);
    }

    const data = await res.json();
    languageCache = { data, timestamp: Date.now() };

    return Response.json(data);
  } catch (error) {
    console.error("[LANGUAGES]", error);

    if (languageCache) {
      return Response.json(languageCache.data);
    }

    // Fallback common languages if API fails
    return Response.json([
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ru", name: "Russian" },
      { code: "zh", name: "Chinese" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "ar", name: "Arabic" },
      { code: "hi", name: "Hindi" },
    ]);
  }
}
