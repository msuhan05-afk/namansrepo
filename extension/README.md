# Design DNA 🧬

A Chrome & Firefox extension (Manifest V3) that extracts a complete **design
system** from any website — colors, fonts, and button styles — and exports it as
**Figma-friendly JSON**. Built with TypeScript, React, and Tailwind, wrapped in a
clean, Apple-inspired UI with dark mode and one-click copy.

## Features

- 🎨 **Color extraction** — scans every visible element's computed styles
  (background, text, border, SVG fill/stroke) and merges near-duplicate colors.
- 🧠 **Smart roles** — derives **primary**, **secondary**, **accent**,
  **background**, and **text** colors using saturation/luminance heuristics.
- 🔤 **Font detection** — finds the real typefaces in use with representative
  weights and sizes (heading vs. body).
- 🔘 **Button styles** — groups buttons by appearance and previews each style
  (fill, radius, padding, border, shadow).
- 📦 **Mini design system** — a tidy, scannable summary of the whole page.
- ⬇️ **Figma export** — download or copy a design-tokens JSON
  (`{ value, type }` shape) that Figma token plugins understand.
- 📋 **One-click copy** — click any swatch to copy its hex, or "Copy all".
- 🌗 **Dark mode** — follows the system theme and remembers your choice.

## Tech

Manifest V3 · TypeScript · React 18 · Tailwind CSS · Vite · Firefox-compatible.

## Build

```bash
cd extension
npm install
npm run build            # builds dist-chrome/ and dist-firefox/
npm run build:chrome     # Chrome only
npm run build:firefox    # Firefox only
npm run zip              # build + zip store-ready packages into artifacts/
```

The build:

1. Generates the PNG icons procedurally (`scripts/make-icons.mjs`).
2. Bundles the React popup and the content script (as a self-contained IIFE).
3. Assembles a per-browser package with the correct `manifest.json`.

## Load it

**Chrome / Edge**

1. Visit `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select `extension/dist-chrome`

**Firefox**

1. Visit `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on** → select `extension/dist-firefox/manifest.json`

Then open any website, click the **Design DNA** toolbar icon, and hit
**Analyze page**.

## How it works

The popup injects `content.js` into the active tab on demand (`activeTab` +
`scripting` permissions — no broad always-on content script). The content script
walks the live DOM, reads computed styles, and returns a serializable
`DesignSystem` object. The popup renders it and can convert it to Figma tokens.
No data ever leaves the browser.

## Project layout

```
extension/
├── manifest.chrome.json      # Chrome MV3 manifest
├── manifest.firefox.json     # Firefox MV3 manifest (gecko settings)
├── src/
│   ├── lib/                  # framework-free core
│   │   ├── color.ts          # color parsing / conversion
│   │   ├── analyze.ts        # DOM → DesignSystem extraction engine
│   │   ├── figma.ts          # DesignSystem → Figma tokens
│   │   └── types.ts
│   ├── content/index.ts      # injected extractor + message listener
│   └── popup/                # React + Tailwind UI
└── scripts/                  # icon generation + build orchestration
```
