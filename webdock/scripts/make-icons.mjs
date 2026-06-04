/**
 * Generates the PNG icons referenced by uxp/manifest.json.
 *
 * UXP requires real PNG files for panel/plugin icons. Rather than commit
 * binary blobs, we synthesize small rounded-square glyphs at build time using
 * only Node's built-in `zlib` (no third-party image deps). The result is a
 * clean, on-brand WebDock mark in dark and light variants.
 *
 * Run via: `node scripts/make-icons.mjs <outDir>`
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

/** Encode raw RGBA pixels (Uint8Array, w*h*4) into a PNG buffer. */
function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Add a 0 filter byte at the start of each scanline.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy
      ? rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
      : Buffer.from(rgba.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }

  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function hexToRgb(hex) {
  const v = hex.replace('#', '');
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

/** Draws a rounded square with a diagonal gradient and a small inner notch. */
function drawIcon(size, { from, to, glyph }) {
  const rgba = Buffer.alloc(size * size * 4);
  const [fr, fg, fb] = hexToRgb(from);
  const [tr, tg, tb] = hexToRgb(to);
  const [gr, gg, gb] = hexToRgb(glyph);
  const radius = size * 0.26;

  const inside = (x, y) => {
    // rounded-rect coverage
    const rx = Math.min(x, size - 1 - x);
    const ry = Math.min(y, size - 1 - y);
    if (rx >= radius || ry >= radius) return true;
    const dx = radius - rx;
    const dy = radius - ry;
    return dx * dx + dy * dy <= radius * radius;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (!inside(x, y)) {
        rgba[i + 3] = 0;
        continue;
      }
      const t = (x + y) / (2 * size);
      let r = Math.round(fr + (tr - fr) * t);
      let g = Math.round(fg + (tg - fg) * t);
      let b = Math.round(fb + (tb - fb) * t);

      // Glyph: a centered "dock" bar to read as WebDock at small sizes.
      const cx = size / 2;
      const barW = size * 0.4;
      const barH = size * 0.12;
      const inBar =
        Math.abs(x - cx) < barW / 2 &&
        y > size * 0.58 &&
        y < size * 0.58 + barH;
      const dotR = size * 0.12;
      const inDot = Math.hypot(x - cx, y - size * 0.4) < dotR;
      if (inBar || inDot) {
        r = gr;
        g = gg;
        b = gb;
      }

      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

const outDir = resolve(process.argv[2] ?? 'dist/icons');
mkdirSync(outDir, { recursive: true });

const variants = [
  { file: 'dark.png', size: 46, from: '#5b8cff', to: '#9b6bff', glyph: '#ffffff' },
  { file: 'light.png', size: 46, from: '#3366ff', to: '#7a4fff', glyph: '#ffffff' },
  { file: 'plugin.png', size: 96, from: '#5b8cff', to: '#9b6bff', glyph: '#ffffff' },
];

for (const v of variants) {
  writeFileSync(resolve(outDir, v.file), drawIcon(v.size, v));
  console.log(`[icons] wrote ${v.file} (${v.size}px)`);
}
