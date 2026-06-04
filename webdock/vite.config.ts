import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Rewrites the emitted index.html so the entry `<script>` is a classic script
 * (no `type="module"`, no `crossorigin`). UXP loads a plain IIFE bundle; ESM
 * module scripts are not required and can trip up older host builds.
 */
function uxpClassicScript(): Plugin {
  return {
    name: 'uxp-classic-script',
    transformIndexHtml(html) {
      return (
        html
          // Module scripts are deferred by default; preserve that with `defer`
          // so the bundle runs after #root exists.
          .replace(/<script type="module"/g, '<script defer')
          .replace(/\stype="module"/g, '')
          .replace(/\scrossorigin/g, '')
      );
    },
  };
}

/**
 * Vite is used purely as a bundler/dev-server for the React UI.
 *
 * Adobe UXP loads the plugin from a static `dist/` folder referenced by
 * `uxp/manifest.json`. UXP does not support ES module `import` at runtime for
 * the panel entry, so we emit a single self-contained IIFE bundle with inlined
 * assets. This keeps the output to a predictable `index.js` + `index.css` that
 * the manifest can point at.
 */
export default defineConfig({
  plugins: [react(), uxpClassicScript()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // UXP serves the plugin from a relative path, never a web root.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    // Inline everything so UXP only has to load index.html + one js/css pair.
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        format: 'iife',
        entryFileNames: 'index.js',
        assetFileNames: 'index.[ext]',
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
