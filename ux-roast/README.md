# UX Roast 🔥

A browser extension that audits any webpage's UX in seconds. It captures the
current tab, inspects the live DOM, and grades it on **layout structure**,
**accessibility**, **CTA hierarchy** and **colour contrast** — then hands you a
prioritised list of fixes and a print-ready PDF report.

Works on **Chrome / Edge / Brave / Arc** and **Firefox** (Manifest V3).

## What it checks

| Category | Examples of what it looks for |
| --- | --- |
| **Layout structure** | Missing landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`), heading outline & skipped levels, multiple `<h1>`s, div-heavy markup, missing responsive viewport meta, horizontal overflow. |
| **Accessibility** | Images without `alt`, form fields without labels, icon-only buttons with no accessible name, tap targets below 24×24 px, missing `<html lang>` / `<title>`, duplicate `id`s, positive `tabindex`. |
| **CTA hierarchy** | No visually dominant primary action, too many competing primary buttons, ambiguous primary CTA, no CTA above the fold, vague labels ("Click here", "Learn more"). |
| **Contrast** | WCAG AA contrast (4.5:1 body / 3:1 large text) computed from the *effective* background by walking ancestor backgrounds and blending. |

Each category is scored 0–100 and weighted into an overall **UX score**:

- Accessibility 30%
- Layout 25%
- Contrast 25%
- CTA 20%

## Install (developer mode)

### Chrome / Edge / Brave / Arc
1. Visit `chrome://extensions`
2. Toggle **Developer mode** (top right)
3. Click **Load unpacked** and pick the `ux-roast/` folder

### Firefox
1. Visit `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Pick `ux-roast/manifest.json`

A packaged zip is at `dist/ux-roast.zip` after running `./tools/package.sh`.

## Usage

1. Open any `http(s)` page.
2. Click the **UX Roast** toolbar icon.
3. Hit **Roast this page**.
4. Skim the score & top fixes in the popup, or click **Open full report**.
5. From the report toolbar, click **Export PDF** — the print dialog is pre-styled
   for a clean A4/Letter PDF.

> Internal pages (`chrome://`, `about:`, the web store, etc.) can't be audited
> because extensions aren't allowed to inject scripts there.

## Design language

Linear's restraint, Notion's calm typography, Apple's depth.

- System font stack (SF / Inter / Segoe UI) at tight tracking.
- Soft elevated cards on a near-white canvas; full dark-mode token set via
  `prefers-color-scheme`.
- Single indigo→violet brand gradient reserved for the primary action and the
  brandmark, so it stays meaningful.
- Subtle motion: a 1 s cubic-bezier sweep on the gauge and bars, instant focus
  responses, no bouncy easing.
- Print stylesheet rebuilds the report into edge-to-edge A4 with colour-exact
  bars and no toolbar chrome.

## File layout

```
ux-roast/
├── manifest.json          # MV3 manifest (Chrome + Firefox gecko block)
├── background.js          # Service worker — screenshot fallback, opens report
├── browser-api.js         # `chrome` / `browser` namespace shim
├── analyzer.js            # The page-injected audit engine (self-contained)
├── popup.html / .css / .js  # Toolbar popup with summary, gauge, top fixes
├── report.html / .css / .js # Full report page with PDF export
├── theme.css              # Shared design tokens (light + dark)
├── icons/                 # 16/32/48/128 px brand icons
└── tools/
    ├── make_icons.py      # Re-generate icons (pure stdlib, no Pillow)
    └── package.sh         # Bundle a distributable zip
```

## Privacy

UX Roast runs **100% locally**. It never sends the page, screenshot, or report
anywhere — analysis happens in your browser, screenshots are stored in the
extension's local storage only, and the PDF is produced by your browser's own
print engine.

## Rebuild the icons

```bash
python3 tools/make_icons.py
```

## Build a zip

```bash
./tools/package.sh
# → dist/ux-roast.zip
```
