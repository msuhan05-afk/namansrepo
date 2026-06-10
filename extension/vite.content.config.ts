import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Builds the content script as a single self-contained IIFE so it can be
// injected on demand in both Chrome and Firefox (no ES module loading needed).
export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content/index.ts'),
      name: 'DesignDNAContent',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
