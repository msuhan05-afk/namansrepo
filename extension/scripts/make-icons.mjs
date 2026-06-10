// Generates the extension PNG icons procedurally so the repo needs no binary
// assets. Draws a rounded-square gradient badge (accent blue -> purple) with a
// white "spark" glyph, matching the popup's brand mark.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/icons');
mkdirSync(outDir, { recursive: true });

const SIZES = [16, 32, 48, 128];

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

// Brand gradient stops.
const C1 = { r: 0x0a, g: 0x84, b: 0xff }; // accent blue
const C2 = { r: 0xa1, g: 0x55, b: 0xf0 }; // purple

function buildPixels(size) {
  const px = new Uint8Array(size * size * 4);
  const radius = size * 0.22;
  const cx = size / 2;
  const cy = size / 2;
  // Spark = a 4-point star; approximate with two crossing tapered bars.
  const armLen = size * 0.34;
  const armW = Math.max(1, size * 0.06);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // Rounded-rect alpha mask.
      const inside = roundedRectAlpha(x + 0.5, y + 0.5, size, radius);
      if (inside <= 0) {
        px[i + 3] = 0;
        continue;
      }
      // Diagonal gradient.
      const t = (x + y) / (2 * size);
      let r = lerp(C1.r, C2.r, t);
      let g = lerp(C1.g, C2.g, t);
      let b = lerp(C1.b, C2.b, t);

      // White spark overlay near center.
      const dx = Math.abs(x + 0.5 - cx);
      const dy = Math.abs(y + 0.5 - cy);
      const vertical = dx < armW && dy < armLen;
      const horizontal = dy < armW && dx < armLen;
      const sparkDist = Math.min(
        vertical ? dx / armW : 1,
        horizontal ? dy / armW : 1,
      );
      if (vertical || horizontal) {
        const taper = 1 - Math.max(dx, dy) / armLen;
        const blend = Math.max(0, taper) * (1 - sparkDist * 0.4);
        r = lerp(r, 255, blend);
        g = lerp(g, 255, blend);
        b = lerp(b, 255, blend);
      }

      px[i] = r;
      px[i + 1] = g;
      px[i + 2] = b;
      px[i + 3] = Math.round(inside * 255);
    }
  }
  return px;
}

// Soft-edged rounded rectangle coverage in [0,1].
function roundedRectAlpha(x, y, size, radius) {
  const inset = size * 0.06;
  const min = inset;
  const max = size - inset;
  const rx = Math.min(x - min, max - x);
  const ry = Math.min(y - min, max - y);
  if (rx < 0 || ry < 0) return 0;
  // Corner rounding.
  const cornerX = radius - Math.min(rx, radius);
  const cornerY = radius - Math.min(ry, radius);
  const d = Math.sqrt(cornerX * cornerX + cornerY * cornerY);
  if (cornerX > 0 && cornerY > 0) {
    return Math.max(0, Math.min(1, radius - d));
  }
  return 1;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(size, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // raw image data with per-scanline filter byte (0)
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    pixels
      .subarray(y * stride, y * stride + stride)
      .forEach((v, x) => (raw[y * (stride + 1) + 1 + x] = v));
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const size of SIZES) {
  const png = encodePng(size, buildPixels(size));
  writeFileSync(resolve(outDir, `icon${size}.png`), png);
  console.log(`icon${size}.png (${png.length} bytes)`);
}
