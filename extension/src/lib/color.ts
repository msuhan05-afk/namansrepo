// Color parsing and conversion helpers — framework-free so they can run
// inside the injected content script as well as in the popup.

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/**
 * Parse a CSS color string (rgb/rgba/hex/named via canvas fallback) into RGB.
 * Returns null for fully transparent colors or values we can't resolve.
 */
export function parseColor(input: string): { rgb: RGB; alpha: number } | null {
  if (!input) return null;
  const value = input.trim().toLowerCase();
  if (value === 'transparent' || value === 'none') return null;

  // rgb() / rgba()
  const rgbMatch = value.match(
    /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.%]+))?\s*\)/,
  );
  if (rgbMatch) {
    const r = clamp255(parseFloat(rgbMatch[1]));
    const g = clamp255(parseFloat(rgbMatch[2]));
    const b = clamp255(parseFloat(rgbMatch[3]));
    let alpha = 1;
    if (rgbMatch[4] != null) {
      alpha = rgbMatch[4].endsWith('%')
        ? parseFloat(rgbMatch[4]) / 100
        : parseFloat(rgbMatch[4]);
    }
    if (alpha <= 0.03) return null;
    return { rgb: { r, g, b }, alpha };
  }

  // #rgb / #rrggbb / #rrggbbaa
  const hex = value.startsWith('#') ? value.slice(1) : null;
  if (hex && (hex.length === 3 || hex.length === 6 || hex.length === 8)) {
    const expand = (h: string) =>
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const full = expand(hex.slice(0, hex.length === 3 ? 3 : 6));
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    let alpha = 1;
    if (hex.length === 8) alpha = parseInt(hex.slice(6, 8), 16) / 255;
    if (alpha <= 0.03) return null;
    return { rgb: { r, g, b }, alpha };
  }

  return null;
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function rgbToHex({ r, g, b }: RGB): string {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

/** Relative luminance (WCAG) for contrast / readable-text decisions. */
export function luminance({ r, g, b }: RGB): number {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** Pick black or white text for best contrast on the given background. */
export function readableText(rgb: RGB): string {
  return luminance(rgb) > 0.45 ? '#000000' : '#FFFFFF';
}

/** Euclidean distance in RGB space — cheap perceptual-ish grouping. */
export function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}
