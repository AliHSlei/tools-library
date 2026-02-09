"use client";

import { useState, useCallback } from "react";
import { Download, Sparkles, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/toast";
import { generateImage } from "@/lib/api/image-generate";

const MODELS = [
  { value: "black-forest-labs/FLUX.1-schnell", label: "FLUX.1 Schnell (Fast)" },
  { value: "black-forest-labs/FLUX.1-dev", label: "FLUX.1 Dev (Quality)" },
  {
    value: "stabilityai/stable-diffusion-xl-base-1.0",
    label: "Stable Diffusion XL",
  },
];

const RESOLUTIONS = [
  { value: "512x512", label: "512 x 512" },
  { value: "768x768", label: "768 x 768" },
  { value: "1024x1024", label: "1024 x 1024" },
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [resolution, setResolution] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showNegative, setShowNegative] = useState(false);
  const { toast } = useToast();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl(null);

    try {
      const [w, h] = resolution.split("x").map(Number);
      const url = await generateImage({
        prompt,
        model,
        negativePrompt: negativePrompt || undefined,
        width: w,
        height: h,
      });
      setImageUrl(url);
      toast("success", "Image generated!");
    } catch (err) {
      toast(
        "error",
        err instanceof Error ? err.message : "Generation failed"
      );
    } finally {
      setLoading(false);
    }
  }, [prompt, model, negativePrompt, resolution, toast]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `generated-${Date.now()}.png`;
    a.click();
  }, [imageUrl]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-50">Image Generator</h1>
        <p className="mt-2 text-gray-400">
          Generate images from text prompts using AI
        </p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Model"
          options={MODELS}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <Select
          label="Resolution"
          options={RESOLUTIONS}
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        />
      </div>

      {/* Prompt */}
      <div className="space-y-3">
        <Textarea
          label="Prompt"
          placeholder="Describe the image you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <button
          onClick={() => setShowNegative(!showNegative)}
          className="text-xs text-gray-500 transition-colors hover:text-gray-300"
        >
          {showNegative ? "Hide" : "Show"} negative prompt
        </button>

        {showNegative && (
          <Textarea
            label="Negative Prompt"
            placeholder="What to avoid in the image..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            rows={2}
          />
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim()}
        loading={loading}
        size="lg"
      >
        <Sparkles size={18} />
        {loading ? "Generating..." : "Generate Image"}
      </Button>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-surface-800 bg-surface-900 p-12">
          <LoadingSpinner size={40} />
          <p className="text-sm text-gray-400">
            Generating your image... This may take a moment.
          </p>
        </div>
      )}

      {/* Result */}
      {imageUrl && !loading && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-surface-800">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownload} variant="secondary">
              <Download size={16} />
              Download
            </Button>
            <Button onClick={handleGenerate} variant="ghost">
              <Sparkles size={16} />
              Generate Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!imageUrl && !loading && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-800 p-12 text-gray-600">
          <ImageIcon size={40} />
          <p className="text-sm">Your generated image will appear here</p>
        </div>
      )}
    </div>
  );
}
