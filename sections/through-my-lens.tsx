"use client";

import { useState } from "react";
import { Camera, RotateCcw } from "lucide-react";
import { ImageTrail } from "@/components/image-trail";
import { Button } from "@/components/ui/button";
import { lensImages, trailVariants } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function ThroughMyLens() {
  const [variant, setVariant] = useState(2);
  const [replayKey, setReplayKey] = useState(0);
  const activeVariant = trailVariants.find((item) => item.id === variant) ?? trailVariants[0];

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="flex flex-col justify-between rounded-lg border bg-card p-5 shadow-soft">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Through my lens</p>
          <h3 className="mt-3 text-3xl font-black tracking-normal">{activeVariant.name}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A tactile photo trail for the way Naman collects light, places, coffee counters, streets, and tiny references while moving through the world.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-4 gap-2" aria-label="Image trail animation variants">
          {trailVariants.map((item) => (
            <button
              className={cn(
                "h-10 rounded-md border text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                item.id === variant ? "bg-foreground text-background shadow-soft" : "bg-background text-foreground hover:-translate-y-0.5 hover:border-primary",
              )}
              key={item.id}
              onClick={() => {
                setVariant(item.id);
                setReplayKey((current) => current + 1);
              }}
              type="button"
              aria-pressed={item.id === variant}
              title={item.name}
            >
              {item.id}
            </button>
          ))}
        </div>
        <Button
          className="mt-4 w-full"
          onClick={() => setReplayKey((current) => current + 1)}
          type="button"
          variant="secondary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Replay Trail
        </Button>
      </div>

      <div className="group relative min-h-[420px] overflow-hidden rounded-lg border bg-white shadow-soft sm:min-h-[520px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,183,77,0.24),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(74,144,226,0.18),transparent_30%),linear-gradient(135deg,#fffdf7,#ffffff)]" />
        <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/40">
          <span>Move cursor across frame</span>
          <span>Lens roll 01</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center pointer-events-none">
          <div>
            <Camera className="mx-auto h-12 w-12 text-primary/70" aria-hidden />
            <p className="mt-4 max-w-sm text-4xl font-black leading-none text-foreground/90 sm:text-6xl">Light, places, memory.</p>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">The photographs appear where your hand wanders.</p>
          </div>
        </div>
        <ImageTrail key={`${variant}-${replayKey}`} items={lensImages} variant={variant} threshold={72} className="absolute inset-0 z-10" />
        <div className="absolute bottom-8 left-8 rounded-md bg-background/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
          Interactive motion study
        </div>
      </div>
    </div>
  );
}
