import { ToolDefinition } from "./types";

export const APP_NAME = "Tools Library";

export const TOOLS: ToolDefinition[] = [
  {
    id: "pdf-converter",
    name: "PDF Converter",
    description: "Convert between PDF and Word documents instantly",
    href: "/tools/pdf-converter",
    icon: "FileText",
    color: "text-red-400",
    status: "active",
  },
  {
    id: "unit-calculator",
    name: "Unit Calculator",
    description: "Convert between units of measurement with ease",
    href: "/tools/unit-calculator",
    icon: "Ruler",
    color: "text-blue-400",
    status: "active",
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Real-time currency exchange rates and conversion",
    href: "/tools/currency-converter",
    icon: "DollarSign",
    color: "text-green-400",
    status: "active",
  },
  {
    id: "translator",
    name: "Translator",
    description: "Translate text between multiple languages",
    href: "/tools/translator",
    icon: "Languages",
    color: "text-purple-400",
    status: "active",
  },
  {
    id: "image-generator",
    name: "Image Generator",
    description: "Generate images from text prompts using AI",
    href: "/tools/image-generator",
    icon: "ImagePlus",
    color: "text-orange-400",
    status: "active",
  },
];
