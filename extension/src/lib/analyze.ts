// The core extraction engine. Runs inside the page (content script) where it
// has access to the live DOM and computed styles, and returns a serializable
// DesignSystem object.

import {
  parseColor,
  rgbToHex,
  rgbToHsl,
  readableText,
  colorDistance,
  type RGB,
} from './color';
import type {
  DesignSystem,
  SwatchColor,
  ColorRoles,
  FontUsage,
  ButtonStyle,
} from './types';

interface ColorAccumulator {
  rgb: RGB;
  weight: number;
  count: number;
}

interface FontAccumulator {
  family: string;
  stack: string;
  weight: number;
  score: number;
  sizeSum: number;
  sizeWeight: number;
}

const MAX_ELEMENTS = 6000; // safety cap for very large pages

export function analyzePage(): DesignSystem {
  const colorMap = new Map<string, ColorAccumulator>();
  const fontMap = new Map<string, FontAccumulator>();
  const buttonStyleMap = new Map<string, ButtonStyle>();

  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));
  const limit = Math.min(elements.length, MAX_ELEMENTS);

  for (let i = 0; i < limit; i++) {
    const el = elements[i];
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;

    const rect = el.getBoundingClientRect();
    const area = Math.max(0, rect.width) * Math.max(0, rect.height);
    // Use a log-scaled area so a single hero section doesn't drown out the
    // rest of the palette, but large regions still count for more.
    const areaWeight = 1 + Math.log10(1 + area);
    const hasText =
      el.childNodes.length > 0 &&
      Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
      );

    collectColor(colorMap, style.backgroundColor, areaWeight);
    // Text color is weighted by whether the element actually renders text.
    if (hasText) collectColor(colorMap, style.color, areaWeight * 1.5);
    collectColor(colorMap, style.borderTopColor, 0.4);
    collectColor(colorMap, style.fill, 0.6);
    collectColor(colorMap, style.stroke, 0.4);

    if (hasText) {
      collectFont(fontMap, style, areaWeight);
    }

    if (isButtonLike(el)) {
      collectButton(buttonStyleMap, el, style);
    }
  }

  const palette = buildPalette(colorMap);
  const roles = assignRoles(palette);
  const fonts = buildFonts(fontMap);
  const buttons = labelButtons(
    Array.from(buttonStyleMap.values()).sort((a, b) => b.count - a.count),
  );

  return {
    source: {
      url: location.href,
      title: document.title,
      extractedAt: new Date().toISOString(),
    },
    roles,
    palette,
    fonts,
    buttons,
  };
}

function collectColor(
  map: Map<string, ColorAccumulator>,
  raw: string,
  weight: number,
): void {
  const parsed = parseColor(raw);
  if (!parsed) return;
  const hex = rgbToHex(parsed.rgb);
  const existing = map.get(hex);
  const w = weight * parsed.alpha;
  if (existing) {
    existing.weight += w;
    existing.count += 1;
  } else {
    map.set(hex, { rgb: parsed.rgb, weight: w, count: 1 });
  }
}

function collectFont(
  map: Map<string, FontAccumulator>,
  style: CSSStyleDeclaration,
  weight: number,
): void {
  const stack = style.fontFamily;
  if (!stack) return;
  const family = cleanFamily(stack);
  if (!family) return;
  const numericWeight = parseInt(style.fontWeight, 10) || 400;
  const size = parseFloat(style.fontSize) || 16;
  const key = family.toLowerCase();
  const existing = map.get(key);
  if (existing) {
    existing.score += weight;
    existing.sizeSum += size * weight;
    existing.sizeWeight += weight;
    // Track the boldest commonly-used weight as representative.
    if (numericWeight > existing.weight && weight > 0.5) {
      existing.weight = numericWeight;
    }
  } else {
    map.set(key, {
      family,
      stack,
      weight: numericWeight,
      score: weight,
      sizeSum: size * weight,
      sizeWeight: weight,
    });
  }
}

function cleanFamily(stack: string): string {
  const first = stack.split(',')[0]?.trim().replace(/^["']|["']$/g, '');
  if (!first) return '';
  // Skip generic system keywords so we surface the real typeface.
  const generic = new Set([
    'inherit',
    'initial',
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    'ui-sans-serif',
    'ui-serif',
    'ui-monospace',
    '-apple-system',
    'blinkmacsystemfont',
  ]);
  return generic.has(first.toLowerCase()) ? '' : first;
}

function isButtonLike(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === 'button') return true;
  if (tag === 'input') {
    const type = (el as HTMLInputElement).type;
    return type === 'submit' || type === 'button' || type === 'reset';
  }
  if (el.getAttribute('role') === 'button') return true;
  const cls = el.className?.toString().toLowerCase() ?? '';
  return /\bbtn\b|\bbutton\b/.test(cls);
}

function collectButton(
  map: Map<string, ButtonStyle>,
  el: HTMLElement,
  style: CSSStyleDeclaration,
): void {
  const rect = el.getBoundingClientRect();
  // Ignore invisible / zero-size buttons.
  if (rect.width < 8 || rect.height < 8) return;

  const bg = parseColor(style.backgroundColor);
  const background = bg ? rgbToHex(bg.rgb) : 'transparent';
  const fg = parseColor(style.color);
  const color = fg ? rgbToHex(fg.rgb) : '#000000';
  const border =
    style.borderTopWidth !== '0px' && parseColor(style.borderTopColor)
      ? `${style.borderTopWidth} ${style.borderTopStyle} ${rgbToHex(
          parseColor(style.borderTopColor)!.rgb,
        )}`
      : 'none';

  const candidate: ButtonStyle = {
    label: '',
    background,
    color,
    borderRadius: style.borderTopLeftRadius || '0px',
    border,
    paddingY: style.paddingTop || '0px',
    paddingX: style.paddingLeft || '0px',
    fontSize: style.fontSize || '16px',
    fontWeight: style.fontWeight || '400',
    boxShadow: style.boxShadow && style.boxShadow !== 'none' ? style.boxShadow : 'none',
    count: 1,
  };

  const key = [
    candidate.background,
    candidate.color,
    candidate.borderRadius,
    candidate.border,
    candidate.fontWeight,
  ].join('|');

  const existing = map.get(key);
  if (existing) existing.count += 1;
  else map.set(key, candidate);
}

/** Merge near-identical colors and return the top swatches by weight. */
function buildPalette(map: Map<string, ColorAccumulator>): SwatchColor[] {
  const raw = Array.from(map.values()).sort((a, b) => b.weight - a.weight);

  const merged: ColorAccumulator[] = [];
  const MERGE_THRESHOLD = 24; // RGB distance below which colors are "the same"
  for (const c of raw) {
    const near = merged.find((m) => colorDistance(m.rgb, c.rgb) < MERGE_THRESHOLD);
    if (near) {
      near.weight += c.weight;
      near.count += c.count;
    } else {
      merged.push({ ...c });
    }
  }

  return merged
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 12)
    .map((c) => ({
      hex: rgbToHex(c.rgb),
      rgb: c.rgb,
      weight: Math.round(c.weight * 10) / 10,
      count: c.count,
    }));
}

/**
 * Heuristically assign semantic roles. Background = most-used near-neutral
 * light/dark color; text = its readable counterpart; primary/secondary/accent
 * are the most prominent saturated colors, accent being the most vivid.
 */
function assignRoles(palette: SwatchColor[]): ColorRoles {
  const withHsl = palette.map((c) => ({ swatch: c, hsl: rgbToHsl(c.rgb) }));

  // A color reads as "neutral" (background/text material, not a brand color)
  // when it has little saturation, or when it's so dark/light that it behaves
  // like ink or paper regardless of a faint hue (e.g. navy-ish body text).
  const isNeutral = (hsl: { s: number; l: number }) =>
    hsl.s < 14 || hsl.l < 13 || hsl.l > 93 || (hsl.s < 28 && (hsl.l < 22 || hsl.l > 88));

  const neutrals = withHsl.filter((c) => isNeutral(c.hsl));
  const chromatics = withHsl.filter((c) => !isNeutral(c.hsl));

  const background =
    neutrals.sort((a, b) => b.swatch.weight - a.swatch.weight)[0]?.swatch ??
    palette[0] ??
    null;

  // Text: a neutral that strongly contrasts the background, else compute one.
  let text: SwatchColor | null = null;
  if (background) {
    const bgLum = rgbToHsl(background.rgb).l;
    text =
      neutrals
        .filter((c) => Math.abs(c.hsl.l - bgLum) > 35)
        .sort((a, b) => b.swatch.weight - a.swatch.weight)[0]?.swatch ?? null;
    if (!text) {
      const tHex = readableText(background.rgb);
      const r = parseInt(tHex.slice(1, 3), 16);
      const g = parseInt(tHex.slice(3, 5), 16);
      const b = parseInt(tHex.slice(5, 7), 16);
      text = { hex: tHex, rgb: { r, g, b }, weight: 0, count: 0 };
    }
  }

  const byWeight = [...chromatics].sort((a, b) => b.swatch.weight - a.swatch.weight);
  const bySaturation = [...chromatics].sort(
    (a, b) => b.hsl.s + b.hsl.l * 0.2 - (a.hsl.s + a.hsl.l * 0.2),
  );

  const primary = byWeight[0]?.swatch ?? null;
  const secondary =
    byWeight.find((c) => c.swatch.hex !== primary?.hex)?.swatch ?? null;
  const accent =
    bySaturation.find(
      (c) => c.swatch.hex !== primary?.hex && c.swatch.hex !== secondary?.hex,
    )?.swatch ??
    bySaturation[0]?.swatch ??
    null;

  return { primary, secondary, accent, background, text };
}

function buildFonts(map: Map<string, FontAccumulator>): FontUsage[] {
  return Array.from(map.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((f) => ({
      family: f.family,
      stack: f.stack,
      weight: f.weight,
      score: Math.round(f.score * 10) / 10,
      sampleSizePx: Math.round(f.sizeWeight ? f.sizeSum / f.sizeWeight : 16),
    }));
}

/** Give the most-used button styles friendly role labels. */
function labelButtons(buttons: ButtonStyle[]): ButtonStyle[] {
  const labels = ['Primary', 'Secondary', 'Tertiary', 'Ghost', 'Link'];
  return buttons.slice(0, 5).map((b, i) => ({ ...b, label: labels[i] ?? `Style ${i + 1}` }));
}
