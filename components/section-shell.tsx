import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionShell({ id, eyebrow, title, children, className }: { id: string; eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
        <h2 className="max-w-3xl text-3xl font-black tracking-normal text-foreground sm:text-5xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}
