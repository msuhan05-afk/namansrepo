import type { DesignSystem } from '../../lib/types';
import { RoleSwatch, MiniSwatch } from './Swatch';
import { useCopy } from './useCopy';
import { CopyIcon, CheckIcon } from './Icons';

export function Results({ data }: { data: DesignSystem }) {
  const allColors = useCopy();
  const paletteList = data.palette.map((c) => c.hex).join(', ');

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Semantic roles */}
      <section>
        <h2 className="section-title">Color Roles</h2>
        <div className="grid grid-cols-3 gap-2">
          <RoleSwatch label="Primary" swatch={data.roles.primary} />
          <RoleSwatch label="Secondary" swatch={data.roles.secondary} />
          <RoleSwatch label="Accent" swatch={data.roles.accent} />
          <RoleSwatch label="Background" swatch={data.roles.background} />
          <RoleSwatch label="Text" swatch={data.roles.text} />
        </div>
      </section>

      {/* Full palette */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="section-title mb-0">Palette · {data.palette.length}</h2>
          <button
            type="button"
            onClick={() => allColors.copy(paletteList)}
            className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
          >
            {allColors.copied ? (
              <>
                <CheckIcon width={12} height={12} /> Copied
              </>
            ) : (
              <>
                <CopyIcon width={12} height={12} /> Copy all
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {data.palette.map((c) => (
            <MiniSwatch key={c.hex} swatch={c} />
          ))}
        </div>
      </section>

      {/* Typography */}
      {data.fonts.length > 0 && (
        <section>
          <h2 className="section-title">Typography · {data.fonts.length}</h2>
          <div className="space-y-2">
            {data.fonts.map((f) => (
              <FontRow key={f.family} family={f.family} weight={f.weight} sizePx={f.sampleSizePx} stack={f.stack} />
            ))}
          </div>
        </section>
      )}

      {/* Buttons */}
      {data.buttons.length > 0 && (
        <section>
          <h2 className="section-title">Button Styles · {data.buttons.length}</h2>
          <div className="space-y-2">
            {data.buttons.map((b, i) => (
              <div key={i} className="dna-card flex items-center justify-between !p-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-700 dark:text-ink-100">{b.label}</p>
                  <p className="truncate font-mono text-[10px] text-ink-400">
                    r:{b.borderRadius} · {b.fontWeight} · ×{b.count}
                  </p>
                </div>
                <span
                  className="shrink-0 whitespace-nowrap text-xs font-semibold"
                  style={{
                    backgroundColor: b.background,
                    color: b.color,
                    borderRadius: b.borderRadius,
                    padding: `${b.paddingY} ${b.paddingX}`,
                    border: b.border === 'none' ? '1px solid rgba(0,0,0,0.06)' : b.border,
                    boxShadow: b.boxShadow === 'none' ? undefined : b.boxShadow,
                  }}
                >
                  Button
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FontRow({
  family,
  weight,
  sizePx,
  stack,
}: {
  family: string;
  weight: number;
  sizePx: number;
  stack: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(family)}
      title={`Copy "${family}"`}
      className="dna-card flex w-full items-center justify-between gap-3 !p-3 text-left
        transition hover:border-accent/40"
    >
      <div className="min-w-0">
        <p
          className="truncate text-base text-ink-800 dark:text-ink-50"
          style={{ fontFamily: stack, fontWeight: weight }}
        >
          {family}
        </p>
        <p className="font-mono text-[10px] text-ink-400">
          {weight} · {sizePx}px
        </p>
      </div>
      <span className="shrink-0 text-ink-300">
        {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
      </span>
    </button>
  );
}
