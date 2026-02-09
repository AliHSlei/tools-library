# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.1] - 2025-02-09

### Fixed
- **Translator:** Switched from LibreTranslate (now requires paid API key) to MyMemory Translation API — free, no key needed, supports 28 languages with auto-detect
- **Breadcrumb navigation:** Clicking "Tools" in the breadcrumb no longer returns a 404 — added a `/tools` index page that displays the full tool grid
- **Light mode:** Added proper light/dark mode support across all 22 components — headings, cards, inputs, selects, buttons, tool pages, and layout elements now render correctly in both themes

## [0.1.0] - 2025-02-09

### Added
- **Dashboard:** Tool grid with animated cards, responsive layout (1/2/3 columns), and staggered entrance animations
- **PDF Converter:** Bidirectional PDF-to-Word and Word-to-PDF conversion using pdf-parse, docx, mammoth, and puppeteer
- **Unit Calculator:** Real-time conversion across 8 categories (Length, Weight, Temperature, Volume, Area, Speed, Time, Data) with a custom zero-dependency conversion engine
- **Currency Converter:** Live exchange rates for 150+ currencies via ExchangeRate-API with 1-hour server-side caching and stale-data fallback
- **Translator:** Text translation between 28 languages with auto-detect and debounced input via MyMemory API
- **Image Generator:** AI image generation using FLUX.1-schnell, FLUX.1-dev, and Stable Diffusion XL via Hugging Face Inference API
- **Dark/Light theme:** Class-based toggle with localStorage persistence and FOUC prevention
- **Shared UI components:** Button (4 variants, 3 sizes, loading state), Input, Select, Textarea, Card, FileDropzone, LoadingSpinner, Toast notifications
- **Layout:** Sticky navbar with backdrop blur, path-based breadcrumbs, responsive design (320px to 1440px+)
- **Tool registry pattern:** All tools defined in a single `TOOLS` array — dashboard and navigation auto-update when new tools are added
