// Shared types for the extracted design system. Used by both the content
// script (producer) and the popup UI (consumer).

export interface SwatchColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  /** Frequency-weighted score across the page (by element area). */
  weight: number;
  /** How many distinct elements referenced this color. */
  count: number;
}

export interface ColorRoles {
  primary: SwatchColor | null;
  secondary: SwatchColor | null;
  accent: SwatchColor | null;
  background: SwatchColor | null;
  text: SwatchColor | null;
}

export interface FontUsage {
  /** Cleaned family name, e.g. "Inter". */
  family: string;
  /** Full font-family stack as authored, for reference. */
  stack: string;
  weight: number;
  /** Frequency-weighted score across the page. */
  score: number;
  /** Representative font size in px. */
  sampleSizePx: number;
}

export interface ButtonStyle {
  /** A human label, e.g. "Primary" / "Secondary". */
  label: string;
  background: string;
  color: string;
  borderRadius: string;
  border: string;
  paddingY: string;
  paddingX: string;
  fontSize: string;
  fontWeight: string;
  boxShadow: string;
  /** How many buttons shared this style. */
  count: number;
}

export interface DesignSystem {
  source: {
    url: string;
    title: string;
    extractedAt: string;
  };
  roles: ColorRoles;
  palette: SwatchColor[];
  fonts: FontUsage[];
  buttons: ButtonStyle[];
}

export type ExtractMessage = { type: 'DESIGN_DNA_EXTRACT' };

export type ExtractResponse =
  | { ok: true; data: DesignSystem }
  | { ok: false; error: string };
