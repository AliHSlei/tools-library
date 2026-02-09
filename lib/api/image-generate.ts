export interface GenerateImageParams {
  prompt: string;
  model?: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
}

export async function generateImage(
  params: GenerateImageParams
): Promise<string> {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Image generation failed");
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
