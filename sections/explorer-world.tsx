"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Train } from "lucide-react";
import { SectionShell } from "@/components/section-shell";
import { ThroughMyLens } from "@/sections/through-my-lens";

export function ExplorerWorld({ items }: { items: string[] }) {
  const { scrollYProgress } = useScroll();
  const trainX = useTransform(scrollYProgress, [0.45, 0.78], ["-12%", "88%"]);

  return (
    <SectionShell id="explorer" eyebrow="Explorer world" title="A travel journal for references gathered in motion.">
      <div className="relative mt-10 overflow-hidden rounded-lg border bg-secondary/10 p-5">
        <div className="h-40 bg-primary/20 [clip-path:polygon(0_100%,13%_38%,22%_100%,38%_28%,54%_100%,70%_34%,83%_100%,100%_42%,100%_100%)]" aria-hidden />
        <div className="mt-6 h-1 rounded-full bg-foreground/20" aria-hidden />
        <motion.div style={{ x: trainX }} className="-mt-8 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background shadow-soft" aria-hidden>
          <Train className="h-5 w-5" />
          <span className="font-mono text-xs font-bold">reference express</span>
        </motion.div>
        <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
          {items.map((item, index) => (
            <article key={item} className="min-w-[240px] snap-start rounded-lg border bg-card p-5">
              <div className="mb-5 aspect-square rounded-md bg-gradient-to-br from-accent/80 via-white to-secondary/40" />
              <p className="font-mono text-xs font-bold text-primary">Journal {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl font-black">{item}</h3>
            </article>
          ))}
        </div>
      </div>
      <ThroughMyLens />
    </SectionShell>
  );
}
