// Local end-to-end run: loads a realistic sample page in jsdom, runs the REAL
// content-script extractor against it, then renders the REAL React popup with
// the extracted data — verifying the whole pipeline without a browser install.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { JSDOM } from 'jsdom';
import * as esbuild from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
// Temp dir inside the project so bundled output can resolve `react` from
// the local node_modules.
const cacheDir = mkdtempSync(join(root, '.localrun-'));
process.on('exit', () => rmSync(cacheDir, { recursive: true, force: true }));

let n = 0;
async function load(entry) {
  const outfile = join(cacheDir, `m${n++}.mjs`);
  await esbuild.build({
    entryPoints: [resolve(root, entry)],
    bundle: true,
    format: 'esm',
    outfile,
    platform: 'node',
    jsx: 'automatic',
    // Share the host React instance so hooks work under renderToString.
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    loader: { '.ts': 'ts', '.tsx': 'tsx' },
  });
  return import(pathToFileURL(outfile).href);
}

const html = readFileSync(resolve(here, 'sample-page.html'), 'utf8');
const dom = new JSDOM(html, { url: 'https://aurora.example.com/', pretendToBeVisual: true });

// jsdom does no layout, so getBoundingClientRect returns zeros. Shim it with
// plausible per-element sizes so area-weighting and the button size filter
// behave like they would in a real browser.
function estimateRect(el) {
  const tag = el.tagName?.toLowerCase();
  const cls = (el.className?.toString() || '').toLowerCase();
  if (tag === 'button' || /btn/.test(cls)) return { width: 140, height: 44 };
  if (tag === 'h1') return { width: 700, height: 56 };
  if (tag === 'h2') return { width: 500, height: 36 };
  if (tag === 'header' || tag === 'footer' || tag === 'section' || tag === 'main')
    return { width: 1200, height: 320 };
  if (tag === 'p') return { width: 600, height: 48 };
  if (/card/.test(cls)) return { width: 360, height: 180 };
  return { width: 200, height: 40 };
}
dom.window.Element.prototype.getBoundingClientRect = function () {
  const { width, height } = estimateRect(this);
  return { width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0 };
};

// Wire jsdom globals so the content script sees a real DOM.
global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.Node = dom.window.Node;
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);

const { analyzePage } = await load('src/lib/analyze.ts');
const { toFigmaTokens } = await load('src/lib/figma.ts');

const ds = analyzePage();

const c = (s) => s ?? '—';
console.log('\n=== Design DNA — local run against aurora.example.com ===\n');
console.log('Title :', ds.source.title);
console.log('\nColor roles');
console.log('  primary   ', c(ds.roles.primary?.hex));
console.log('  secondary ', c(ds.roles.secondary?.hex));
console.log('  accent    ', c(ds.roles.accent?.hex));
console.log('  background', c(ds.roles.background?.hex));
console.log('  text      ', c(ds.roles.text?.hex));
console.log('\nPalette   :', ds.palette.map((p) => p.hex).join(', '));
console.log('Fonts     :', ds.fonts.map((f) => `${f.family} (${f.weight}/${f.sampleSizePx}px)`).join(', ') || '—');
console.log('Buttons   :');
for (const b of ds.buttons) {
  console.log(`  ${b.label.padEnd(10)} bg ${b.background}  text ${b.color}  r:${b.borderRadius}  ×${b.count}`);
}

// Write the Figma-friendly JSON as a tangible local artifact.
const tokens = toFigmaTokens(ds);
const outPath = resolve(root, 'design-dna.sample.json');
writeFileSync(outPath, JSON.stringify(tokens, null, 2));
console.log('\nFigma tokens written ->', outPath);

// Now render the REAL React popup with this data to prove the UI mounts.
const React = (await import('react')).default;
const { renderToString } = await import('react-dom/server');
const { Results } = await load('src/popup/components/Results.tsx');

const markup = renderToString(React.createElement(Results, { data: ds }));
const checks = [
  ['renders roles', markup.includes('Color Roles')],
  ['renders palette', markup.includes('Palette')],
  ['renders typography', markup.includes('Typography')],
  ['renders buttons', markup.includes('Button Styles')],
  ['shows a hex', /#[0-9A-F]{6}/.test(markup)],
];
console.log('\nPopup render checks');
let allOk = true;
for (const [label, ok] of checks) {
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
  allOk = allOk && ok;
}
console.log(`\n${allOk ? '✓ Local run passed.' : '✗ Local run had failures.'}`);
process.exit(allOk ? 0 : 1);
