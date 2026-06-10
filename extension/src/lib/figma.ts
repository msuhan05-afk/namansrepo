// Converts a DesignSystem into a Figma-friendly tokens JSON. The shape follows
// the common "design tokens" convention ({ value, type }) that Figma token
// plugins (Tokens Studio, Figma Variables importers) understand.

import type { DesignSystem } from './types';

interface ColorToken {
  value: string;
  type: 'color';
}
interface DimensionToken {
  value: string;
  type: 'dimension' | 'fontSizes' | 'borderRadius';
}
interface TypographyToken {
  value: {
    fontFamily: string;
    fontWeight: number;
    fontSize: string;
  };
  type: 'typography';
}

export interface FigmaTokens {
  $schema: string;
  meta: {
    name: string;
    source: string;
    generator: string;
    extractedAt: string;
  };
  color: Record<string, ColorToken>;
  palette: Record<string, ColorToken>;
  typography: Record<string, TypographyToken>;
  components: {
    button: Record<
      string,
      {
        fill: ColorToken;
        text: ColorToken;
        borderRadius: DimensionToken;
        paddingX: DimensionToken;
        paddingY: DimensionToken;
      }
    >;
  };
}

export function toFigmaTokens(ds: DesignSystem): FigmaTokens {
  const color: Record<string, ColorToken> = {};
  for (const [role, swatch] of Object.entries(ds.roles)) {
    if (swatch) color[role] = { value: swatch.hex, type: 'color' };
  }

  const palette: Record<string, ColorToken> = {};
  ds.palette.forEach((c, i) => {
    palette[`color-${String(i + 1).padStart(2, '0')}`] = {
      value: c.hex,
      type: 'color',
    };
  });

  const typography: Record<string, TypographyToken> = {};
  ds.fonts.forEach((f, i) => {
    const name = i === 0 ? 'heading' : i === 1 ? 'body' : `font-${i + 1}`;
    typography[name] = {
      value: {
        fontFamily: f.family,
        fontWeight: f.weight,
        fontSize: `${f.sampleSizePx}px`,
      },
      type: 'typography',
    };
  });

  const button: FigmaTokens['components']['button'] = {};
  ds.buttons.forEach((b) => {
    button[b.label.toLowerCase()] = {
      fill: { value: b.background, type: 'color' },
      text: { value: b.color, type: 'color' },
      borderRadius: { value: b.borderRadius, type: 'borderRadius' },
      paddingX: { value: b.paddingX, type: 'dimension' },
      paddingY: { value: b.paddingY, type: 'dimension' },
    };
  });

  return {
    $schema: 'https://schemas.designtokens.org/0.0.1',
    meta: {
      name: ds.source.title || 'Design DNA',
      source: ds.source.url,
      generator: 'Design DNA',
      extractedAt: ds.source.extractedAt,
    },
    color,
    palette,
    typography,
    components: { button },
  };
}
