// Orchestrates a full extension build for one or both browsers.
//   node scripts/build.mjs            -> builds chrome + firefox
//   node scripts/build.mjs chrome     -> chrome only
//   node scripts/build.mjs firefox    -> firefox only
import { execSync } from 'node:child_process';
import {
  rmSync,
  mkdirSync,
  cpSync,
  copyFileSync,
  existsSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const target = process.argv[2];
const targets = target ? [target] : ['chrome', 'firefox'];

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

// 1. Icons (idempotent).
if (!existsSync(resolve(root, 'public/icons/icon128.png'))) {
  run('node scripts/make-icons.mjs');
} else {
  run('node scripts/make-icons.mjs');
}

// 2. Build popup + content script into a shared dist/.
rmSync(resolve(root, 'dist'), { recursive: true, force: true });
mkdirSync(resolve(root, 'dist'), { recursive: true });
run('vite build');
run('vite build --config vite.content.config.ts');

// 3. Assemble per-browser packages.
for (const t of targets) {
  if (t !== 'chrome' && t !== 'firefox') {
    throw new Error(`Unknown target "${t}". Use "chrome" or "firefox".`);
  }
  const outDir = resolve(root, `dist-${t}`);
  rmSync(outDir, { recursive: true, force: true });
  cpSync(resolve(root, 'dist'), outDir, { recursive: true });
  cpSync(resolve(root, 'public/icons'), resolve(outDir, 'icons'), {
    recursive: true,
  });
  copyFileSync(resolve(root, `manifest.${t}.json`), resolve(outDir, 'manifest.json'));
  console.log(`\n✓ Built dist-${t}/`);
}
