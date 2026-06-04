/**
 * Assembles a UXP-loadable plugin folder and (optionally) a `.ccx` archive.
 *
 * Steps:
 *   1. Ensure the Vite build output exists in `dist/`.
 *   2. Copy `uxp/manifest.json` to `dist/manifest.json`.
 *   3. Generate icons into `dist/icons/`.
 *   4. If the system `zip` tool is available, zip `dist/` into
 *      `release/webdock.ccx` (a .ccx is just a renamed zip).
 *
 * Run via: `npm run build && npm run ccx`
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const release = resolve(root, 'release');

if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('[ccx] dist/index.html missing — run `npm run build` first.');
  process.exit(1);
}

// 2. manifest
copyFileSync(resolve(root, 'uxp/manifest.json'), resolve(dist, 'manifest.json'));
console.log('[ccx] copied manifest.json');

// 3. icons
execFileSync(process.execPath, [resolve(root, 'scripts/make-icons.mjs'), resolve(dist, 'icons')], {
  stdio: 'inherit',
});

// 4. zip → .ccx (best-effort; UDT can load the folder directly otherwise)
mkdirSync(release, { recursive: true });
const ccxPath = resolve(release, 'webdock.ccx');
try {
  execFileSync('zip', ['-r', '-X', ccxPath, '.'], { cwd: dist, stdio: 'inherit' });
  console.log(`[ccx] created ${ccxPath}`);
} catch {
  console.warn(
    '[ccx] `zip` not found — skipping archive. Load the `dist/` folder directly via UXP Developer Tool.',
  );
}
