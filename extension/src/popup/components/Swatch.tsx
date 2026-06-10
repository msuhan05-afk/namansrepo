import type { SwatchColor } from '../../lib/types';
import { readableText } from '../../lib/color';
import { useCopy } from './useCopy';
import { CopyIcon, CheckIcon } from './Icons';

interface RoleSwatchProps {
  label: string;
  swatch: SwatchColor | null;
}

/** Large labeled swatch used for the semantic color roles. */
export function RoleSwatch({ label, swatch }: RoleSwatchProps) {
  const { copied, copy } = useCopy();
  if (!swatch) return null;
  const fg = readableText(swatch.rgb);

  return (
    <button
      type="button"
      onClick={() => copy(swatch.hex)}
      title={`Copy ${swatch.hex}`}
      className="group relative flex h-20 flex-col justify-between rounded-xl p-2.5 text-left
        shadow-sm ring-1 ring-black/5 transition active:scale-[0.98]"
      style={{ backgroundColor: swatch.hex, color: fg }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </span>
      <span className="flex items-center justify-between">
        <span className="font-mono text-xs font-medium">{swatch.hex}</span>
        <span className="opacity-0 transition group-hover:opacity-90">
          {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
        </span>
      </span>
    </button>
  );
}

/** Compact swatch used for the full palette grid. */
export function MiniSwatch({ swatch }: { swatch: SwatchColor }) {
  const { copied, copy } = useCopy();
  const fg = readableText(swatch.rgb);
  return (
    <button
      type="button"
      onClick={() => copy(swatch.hex)}
      title={`Copy ${swatch.hex}`}
      className="group relative aspect-square w-full rounded-lg shadow-sm ring-1 ring-black/5
        transition active:scale-95"
      style={{ backgroundColor: swatch.hex }}
    >
      <span
        className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-b-lg
          py-0.5 font-mono text-[9px] font-medium opacity-0 transition group-hover:opacity-100"
        style={{ color: fg, backgroundColor: 'rgba(0,0,0,0.06)' }}
      >
        {copied ? 'Copied' : swatch.hex}
      </span>
    </button>
  );
}
