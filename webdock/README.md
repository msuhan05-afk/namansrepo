# WebDock

**The web, docked inside Adobe Premiere Pro.**

WebDock is a dockable web workspace for Premiere Pro. It gives video editors a
beautiful, native-feeling browser and AI tools right next to the timeline —
ChatGPT, Claude, Gemini, Perplexity, YouTube, Pexels, Unsplash, Google, and
Frame.io — so they never have to leave the edit to find B-roll, write hooks, or
review a cut.

Built with **Adobe UXP · React · TypeScript · Vite**, designed in the spirit of
Arc, Linear, Raycast, and Apple's Human Interface Guidelines.

```
┌─────────────────────────────────────────────┐
│  🔍  Search anything…                  arc.io │  ← Smart search bar
├──────────┬──────────────────────────────────┤
│ ◐ WebDock │  ← back fwd ↻ home      ⤴ external │  ← Browser toolbar
│          │ ┌──────────────────────────────┐  │
│ ChatGPT  │ │                              │  │
│ Claude   │ │                              │  │
│ Gemini   │ │        Web / WebView         │  │
│ …        │ │                              │  │
│ Frame.io │ │                              │  │
│ Custom   │ └──────────────────────────────┘  │
│ ✦ Assist │                                   │
└──────────┴──────────────────────────────────┘
```

---

## Features

- **Icon sidebar** for every service, with animated active states and a brand
  accent glow (Arc-style rail + Raycast hover labels).
- **Full web browser** in the main area: URL loading, back / forward / reload /
  home, open-in-external-browser, non-blocking loading bar, and a recoverable
  error state.
- **Smart search bar** — type a query and get ranked quick-search suggestions
  (Google, YouTube, ChatGPT, Pexels…); type a URL and get a direct "Go to".
  Fully keyboard-driven (↑ ↓ Enter Esc).
- **AI Assistant (preview)** — a slide-in "Ask WebDock…" panel that routes
  natural-language requests to the right service. Offline and honest: it does
  not fabricate AI output. A model-backed planner is stubbed for the future.
- **Asset import architecture** — a typed service layer for download → import
  into Premiere. Clearly marked as placeholder; no fake functionality.

## Project structure

```
webdock/
├── uxp/manifest.json          # UXP plugin manifest (manifestVersion 5)
├── index.html                 # Panel entry (bundled by Vite)
├── vite.config.ts             # Bundles a single classic-script IIFE for UXP
├── scripts/
│   ├── make-icons.mjs         # Generates manifest PNG icons (zlib only)
│   └── package-ccx.mjs        # Assembles dist/ + builds a .ccx archive
└── src/
    ├── main.tsx               # React mount + root error boundary
    ├── App.tsx                # Shell: sidebar | (search + browser + assistant)
    ├── types/                 # Shared domain types
    ├── data/services.ts       # Canonical service catalog
    ├── styles/                # Design tokens + global CSS
    ├── hooks/                 # useBrowserState, useDebouncedValue
    ├── features/
    │   ├── search/            # Suggestion engine + URL building
    │   ├── ai/                # Intent router (offline) + future planner stub
    │   └── assets/            # Download + Premiere import service layer
    ├── services/uxp/          # UXP runtime bridge (host-agnostic)
    └── components/
        ├── common/            # Icon, IconButton, ErrorBoundary
        ├── layout/            # Sidebar
        ├── search/            # SmartSearchBar
        ├── browser/           # BrowserPanel, Toolbar, WebView, states
        └── ai/                # AIAssistantPanel
```

The code is feature-based and host-agnostic: anything touching Adobe UXP is
funneled through `src/services/uxp/`, so the React UI runs in a plain browser
during development and inside Premiere unchanged.

---

## Setup

Requires **Node 18+**.

```bash
cd webdock
npm install
```

## Develop (in a normal browser)

```bash
npm run dev          # http://localhost:5173
```

In dev mode the web surface falls back to an `<iframe>` so you can iterate on
the UI fast. Note: many sites refuse to be framed (X-Frame-Options / CSP), so
some pages will appear blank — this is a browser-only limitation and does **not**
affect the real plugin, which uses the UXP `<webview>`.

## Type-check

```bash
npm run typecheck
```

## Build

```bash
npm run build        # → dist/ (index.html + index.js + index.css)
```

`vite.config.ts` emits a single self-contained IIFE bundle and rewrites the
entry `<script>` to a classic deferred script, which is what UXP expects.

## Package as a `.ccx`

```bash
npm run build
npm run ccx          # → release/webdock.ccx  (+ copies manifest & icons into dist/)
```

`package-ccx.mjs` copies `uxp/manifest.json` into `dist/`, generates the PNG
icons, and zips `dist/` into `release/webdock.ccx` (a `.ccx` is just a renamed
zip). If the system `zip` tool isn't present it skips the archive — you can
still load the `dist/` folder directly (see below).

---

## Install in Adobe Premiere Pro (UXP)

You need Premiere Pro **24.0+** and the **Adobe UXP Developer Tool (UDT)**,
available via the Creative Cloud Desktop app.

### Option A — Load for development (recommended while iterating)

1. `npm run build && npm run ccx` (this places `manifest.json` and `icons/` into
   `dist/`).
2. Open **UXP Developer Tool**.
3. Click **Add Plugin** and select `webdock/dist/manifest.json`.
4. With Premiere Pro running, click **••• → Load** next to WebDock.
5. In Premiere: **Window → Extensions (or Plugins) → WebDock** to open the panel.
6. Dock it anywhere — WebDock fills its panel and resizes responsively.

Use **••• → Reload** in UDT after each `npm run build` to pick up changes.

### Option B — Install the packaged plugin

1. `npm run build && npm run ccx` to produce `release/webdock.ccx`.
2. Double-click `webdock.ccx` (it opens in the UXP/Creative Cloud installer), or
   distribute it for installation.

### Permissions

`uxp/manifest.json` requests:

- `webview` (with `domains: all`) — the in-panel browser surface.
- `network` — outbound requests for the loaded sites.
- `launchProcess` (https/http) — "open in external browser".
- `localFileSystem: request` + `clipboard` — reserved for the asset-import
  pipeline.

---

## Roadmap (architected, intentionally not faked)

These have a stable, typed service layer in place and are clearly marked
`PLACEHOLDER` / `FUTURE IMPLEMENTATION` in code:

- **Asset import** — `src/features/assets/`: download image/video/audio and
  import into the active Premiere project / sequence (`premiereImport.ts`).
- **AI planner** — `src/features/ai/aiService.ts`: swap the offline keyword
  router for a model-backed planner (e.g. the Claude API).

---

## License

MIT.
