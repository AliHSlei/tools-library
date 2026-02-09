export interface Language {
  code: string;
  name: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: { confidence: number; language: string };
}

export async function fetchLanguages(): Promise<Language[]> {
  const res = await fetch("/api/translate/languages");
  if (!res.ok) throw new Error("Failed to fetch languages");
  return res.json();
}

export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<TranslationResult> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Translation failed");
  }

  return res.json();
}
