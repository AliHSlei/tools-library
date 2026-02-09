import { NextRequest } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, negativePrompt, width, height } =
      await request.json();

    if (!prompt) {
      return Response.json(
        { error: "Missing required field: prompt" },
        { status: 400 }
      );
    }

    const token = process.env.HF_TOKEN;
    if (!token) {
      return Response.json(
        { error: "HF_TOKEN not configured" },
        { status: 500 }
      );
    }

    const hf = new HfInference(token);

    const response = await hf.textToImage({
      model: model || "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt || "",
        width: width || 1024,
        height: height || 1024,
      },
    });

    const blob = response as unknown as Blob;
    const arrayBuffer = await blob.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("[GENERATE_IMAGE]", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return Response.json({ error: message }, { status: 500 });
  }
}
