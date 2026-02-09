# Tools Library

A modern web-based utility dashboard built with Next.js. Browse and use a growing collection of everyday tools — all in one clean interface with dark and light mode support.

## Tools

| Tool | Description | API / Engine |
|------|-------------|--------------|
| **PDF Converter** | Convert between PDF and Word documents (both directions) | `pdf-parse`, `docx`, `mammoth`, `puppeteer` |
| **Unit Calculator** | Convert between units across 8 categories (length, weight, temperature, volume, area, speed, time, data) | Custom `toBase`/`fromBase` engine — no external deps |
| **Currency Converter** | Real-time exchange rates for 150+ currencies with auto-refresh | [ExchangeRate-API](https://open.er-api.com) (free, no key) |
| **Translator** | Translate text between 28 languages with auto-detect | [MyMemory API](https://mymemory.translated.net) (free, no key) |
| **Image Generator** | Generate images from text prompts using FLUX.1 and SDXL models | [Hugging Face Inference API](https://huggingface.co/docs/api-inference) |

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-native `@theme` config)
- **Icons:** lucide-react
- **Dark/Light Mode:** Class-based toggle with `localStorage` persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm)
- A [Hugging Face](https://huggingface.co/settings/tokens) API token (free — needed for the Image Generator only)

### Installation

```bash
git clone https://github.com/AliHSlei/tools-library.git
cd tools-library
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Required for Image Generator
HF_TOKEN=hf_your_token_here

# Exchange rate endpoint (default works out of the box)
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest
```

> **Note:** The PDF Converter, Unit Calculator, Currency Converter, and Translator all work without any API keys. Only the Image Generator requires a Hugging Face token.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  page.tsx                     # Dashboard with tool grid
  tools/
    page.tsx                   # All tools index
    pdf-converter/page.tsx
    unit-calculator/page.tsx
    currency-converter/page.tsx
    translator/page.tsx
    image-generator/page.tsx
  api/
    convert/                   # PDF <-> Word conversion endpoints
    currency/                  # Exchange rate proxy with 1h cache
    translate/                 # MyMemory translation proxy
    generate-image/            # Hugging Face image generation

components/
  ui/                          # Button, Input, Select, Textarea, Card, etc.
  layout/                      # Navbar, Breadcrumb, ThemeToggle
  dashboard/                   # ToolCard, ToolGrid

lib/
  constants.ts                 # Tool registry — add entries here to extend
  conversions/                 # Custom unit conversion engine
  api/                         # Client-side fetch wrappers
  theme-provider.tsx           # Dark/light theme context
```

## Adding a New Tool

1. Add an entry to the `TOOLS` array in `lib/constants.ts`
2. Create a page at `app/tools/<tool-id>/page.tsx`
3. (Optional) Add an API route at `app/api/<endpoint>/route.ts`
4. The dashboard and navigation update automatically

## Deployment

The app is deployable to any Node.js hosting platform. For Vercel:

```bash
npx vercel
```

> **Note:** The PDF Converter uses Puppeteer which downloads Chromium (~170 MB). For serverless deployments, swap `puppeteer` for `puppeteer-core` + `@sparticuz/chromium`.

## License

MIT
