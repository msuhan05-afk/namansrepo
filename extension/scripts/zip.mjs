// Zips the built dist-chrome / dist-firefox folders for store submission.
// Uses the system `zip` if available; otherwise prints a hint.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
mkdirSync(resolve(root, 'artifacts'), { recursive: true });

for (const t of ['chrome', 'firefox']) {
  const dir = resolve(root, `dist-${t}`);
  if (!existsSync(dir)) continue;
  const out = resolve(root, `artifacts/design-dna-${t}.zip`);
  try {
    execSync(`cd "${dir}" && zip -r -q "${out}" .`, { stdio: 'inherit' });
    console.log(`✓ artifacts/design-dna-${t}.zip`);
  } catch {
    console.warn(`Could not zip dist-${t} (is the "zip" CLI installed?)`);
  }
}
