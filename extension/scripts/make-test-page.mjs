// Generates `frontend-test.html` — a single, self-contained page that runs the
// REAL built popup UI with a mocked `chrome` API and a realistic sample design
// system. Open it directly in any browser (file:// works) to click through the
// UI: Analyze, dark mode, one-click copy, copy/download Figma JSON.
//
//   npm run build && node scripts/make-test-page.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');

const jsPath = resolve(dist, 'popup.js');
const cssPath = resolve(dist, 'assets/index.css');
if (!existsSync(jsPath) || !existsSync(cssPath)) {
  console.error('Build output missing. Run `npm run build` first.');
  process.exit(1);
}

const css = readFileSync(cssPath, 'utf8');
// Escape any `</script` so inlining the bundle can never break out of the tag.
const js = readFileSync(jsPath, 'utf8').replace(/<\/(script)/gi, '<\\/$1');

// A realistic design system so the populated UI is worth looking at.
const SAMPLE = {
  source: {
    url: 'https://aurora.example.com/',
    title: 'Aurora — Project Management, Reimagined',
    extractedAt: new Date().toISOString(),
  },
  roles: {
    primary: { hex: '#4F46E5', rgb: { r: 79, g: 70, b: 229 }, weight: 18.4, count: 22 },
    secondary: { hex: '#0EA5E9', rgb: { r: 14, g: 165, b: 233 }, weight: 9.1, count: 11 },
    accent: { hex: '#EC4899', rgb: { r: 236, g: 72, b: 153 }, weight: 4.7, count: 6 },
    background: { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, weight: 31.2, count: 140 },
    text: { hex: '#0F172A', rgb: { r: 15, g: 23, b: 42 }, weight: 22.6, count: 96 },
  },
  palette: [
    { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, weight: 31.2, count: 140 },
    { hex: '#0F172A', rgb: { r: 15, g: 23, b: 42 }, weight: 22.6, count: 96 },
    { hex: '#4F46E5', rgb: { r: 79, g: 70, b: 229 }, weight: 18.4, count: 22 },
    { hex: '#334155', rgb: { r: 51, g: 65, b: 85 }, weight: 14.0, count: 60 },
    { hex: '#0EA5E9', rgb: { r: 14, g: 165, b: 233 }, weight: 9.1, count: 11 },
    { hex: '#1E293B', rgb: { r: 30, g: 41, b: 59 }, weight: 7.8, count: 18 },
    { hex: '#EC4899', rgb: { r: 236, g: 72, b: 153 }, weight: 4.7, count: 6 },
    { hex: '#C7D2FE', rgb: { r: 199, g: 210, b: 254 }, weight: 3.9, count: 9 },
    { hex: '#E2E8F0', rgb: { r: 226, g: 232, b: 240 }, weight: 3.1, count: 24 },
    { hex: '#10B981', rgb: { r: 16, g: 185, b: 129 }, weight: 2.4, count: 5 },
    { hex: '#F59E0B', rgb: { r: 245, g: 158, b: 11 }, weight: 1.8, count: 4 },
    { hex: '#94A3B8', rgb: { r: 148, g: 163, b: 184 }, weight: 1.5, count: 12 },
  ],
  fonts: [
    { family: 'Poppins', stack: '"Poppins", sans-serif', weight: 700, score: 12.3, sampleSizePx: 34 },
    { family: 'Inter', stack: '"Inter", system-ui, sans-serif', weight: 400, score: 28.9, sampleSizePx: 16 },
    { family: 'JetBrains Mono', stack: '"JetBrains Mono", monospace', weight: 500, score: 2.1, sampleSizePx: 13 },
  ],
  buttons: [
    { label: 'Primary', background: '#4F46E5', color: '#FFFFFF', borderRadius: '10px', border: 'none', paddingY: '12px', paddingX: '24px', fontSize: '16px', fontWeight: '600', boxShadow: '0 4px 14px rgba(79,70,229,0.4)', count: 8 },
    { label: 'Secondary', background: '#FFFFFF', color: '#4F46E5', borderRadius: '10px', border: '1px solid #C7D2FE', paddingY: '12px', paddingX: '24px', fontSize: '16px', fontWeight: '600', boxShadow: 'none', count: 5 },
    { label: 'Accent', background: '#EC4899', color: '#FFFFFF', borderRadius: '999px', border: 'none', paddingY: '10px', paddingX: '20px', fontSize: '14px', fontWeight: '700', boxShadow: 'none', count: 3 },
  ],
};

const mock = `
// --- Mock chrome.* API so the real popup runs outside the extension. ---
(function () {
  var SAMPLE = ${JSON.stringify(SAMPLE)};
  var lastError = undefined;
  // Polyfill matchMedia for headless/older runtimes (real browsers keep native).
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = function (q) {
      return { matches: false, media: q, onchange: null,
        addEventListener: function () {}, removeEventListener: function () {},
        addListener: function () {}, removeListener: function () {},
        dispatchEvent: function () { return false; } };
    };
  }
  window.chrome = {
    runtime: { get lastError() { return lastError; } },
    tabs: {
      query: function (_q, cb) { cb([{ id: 1, url: SAMPLE.source.url, title: SAMPLE.source.title }]); },
      sendMessage: function (_id, _msg, cb) {
        // Simulate a little extraction latency so the loading state is visible.
        setTimeout(function () { cb({ ok: true, data: SAMPLE }); }, 450);
      },
    },
    scripting: {
      executeScript: function (_opts, cb) { setTimeout(cb, 150); },
    },
  };
})();
`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Design DNA — Frontend Test Harness</title>
    <style>${css}</style>
    <style>
      /* Center the 380px popup on a neutral backdrop for previewing. */
      body { display: grid; place-items: center; min-height: 100vh; width: 100%;
        background: #ececef; padding: 24px 0; box-sizing: border-box; }
      #root { box-shadow: 0 20px 60px rgba(0,0,0,.18); border-radius: 18px; overflow: hidden; }
      .harness-note { position: fixed; top: 12px; left: 12px; font: 12px/1.4 -apple-system, system-ui, sans-serif;
        color: #6e6e73; max-width: 260px; }
      .harness-note code { background: rgba(0,0,0,.06); padding: 1px 5px; border-radius: 5px; }
    </style>
  </head>
  <body>
    <div class="harness-note">
      <strong>Design DNA — test harness.</strong> The real popup running on mocked
      sample data. Click <code>Analyze page</code>, toggle dark mode, copy swatches,
      or export the Figma JSON.
    </div>
    <div id="root"></div>
    <script>${mock}</script>
    <script>${js}</script>
  </body>
</html>
`;

const out = resolve(root, 'frontend-test.html');
writeFileSync(out, html);
console.log('Wrote', out, `(${(html.length / 1024).toFixed(0)} KB) — open it in any browser.`);
