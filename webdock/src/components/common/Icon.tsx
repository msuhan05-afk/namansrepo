import type { CSSProperties } from 'react';
import type { IconName } from '@/types';

/**
 * Inline SVG icon registry.
 *
 * UXP's webview/asset loading is fussy about external files, so every glyph is
 * an inline path here — no network, no sprite sheet. Brand marks are simplified
 * monochrome silhouettes that inherit `currentColor`, keeping the UI cohesive
 * rather than a clutter of multicolor logos.
 */

interface IconProps {
  name: IconName;
  size?: number;
  /** Stroke width for line icons. */
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}

type PathSet = { paths: string[]; fill?: boolean };

const ICONS: Record<IconName, PathSet> = {
  // ---- Brand marks (simplified, monochrome) ----
  chatgpt: { fill: true, paths: ['M12 2a5 5 0 0 1 4.9 4 5 5 0 0 1 2.1 8.2A5 5 0 0 1 12 22a5 5 0 0 1-4.9-4A5 5 0 0 1 5 9.8 5 5 0 0 1 12 2Zm0 4.2L8 8.4v4.4l4 2.2 4-2.2V8.4l-4-2.2Z'] },
  claude: { fill: true, paths: ['M5 19 10.2 5h3.6L19 19h-3.3l-1-3h-5.4l-1 3H5Zm5.1-5.6h3.8L12 8l-1.9 5.4Z'] },
  gemini: { fill: true, paths: ['M12 2c.4 5.1 4.9 9.6 10 10-5.1.4-9.6 4.9-10 10-.4-5.1-4.9-9.6-10-10C7.1 11.6 11.6 7.1 12 2Z'] },
  perplexity: { paths: ['M12 3v18', 'M4 7v8l8 5 8-5V7l-8-5-8 5Z', 'M4 7l8 5 8-5'] },
  youtube: { fill: true, paths: ['M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z'] },
  pexels: { paths: ['M4 3h16v18H4z', 'M9 8h3.5a2.5 2.5 0 0 1 0 5H9v3', 'M9 8v8'] },
  unsplash: { fill: true, paths: ['M8 3h8v4H8zM3 9h18v12H3v-6h5v3h8v-3h5'] },
  google: { paths: ['M21 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7.1Z', 'M12 21c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.6-1.9 1-2.9 1a5 5 0 0 1-4.7-3.5H4.1v2.4A9 9 0 0 0 12 21Z', 'M7.3 13.9a5.4 5.4 0 0 1 0-3.4V8.1H4.1a9 9 0 0 0 0 8.1l3.2-2.3Z', 'M12 6.6c1.3 0 2.5.5 3.4 1.4l2.6-2.6A9 9 0 0 0 4.1 8.1l3.2 2.4A5 5 0 0 1 12 6.6Z'] },
  frameio: { paths: ['M4 5h16v14H4z', 'M4 9h16', 'M8 5v4', 'M16 5v4', 'M10 13l4 2-4 2v-4Z'] },
  custom: { paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M3.5 9h17M3.5 15h17', 'M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z'] },

  // ---- UI line icons ----
  back: { paths: ['M15 18l-6-6 6-6'] },
  forward: { paths: ['M9 6l6 6-6 6'] },
  refresh: { paths: ['M3 12a9 9 0 0 1 15.5-6.2L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15.5 6.2L3 16', 'M3 21v-5h5'] },
  home: { paths: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'] },
  external: { paths: ['M14 4h6v6', 'M20 4l-9 9', 'M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5'] },
  search: { paths: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'M21 21l-4.3-4.3'] },
  sparkles: { paths: ['M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z', 'M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z'] },
  close: { paths: ['M6 6l12 12M18 6L6 18'] },
  download: { paths: ['M12 3v12', 'M7 10l5 5 5-5', 'M5 21h14'] },
  image: { paths: ['M3 5h18v14H3z', 'M3 16l5-5 4 4 3-3 6 6', 'M9 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'] },
  video: { paths: ['M3 6h12v12H3z', 'M15 9l6-3v12l-6-3'] },
  audio: { paths: ['M9 18V6l10-2v12', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'] },
  plus: { paths: ['M12 5v14M5 12h14'] },
};

export function Icon({ name, size = 18, strokeWidth = 1.7, style, className }: IconProps) {
  const def = ICONS[name];
  const filled = def.fill ?? false;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {def.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
