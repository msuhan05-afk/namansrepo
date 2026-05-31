"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { SectionShell } from "@/components/section-shell";

export function FilmmakerWorld({ projects }: { projects: string[] }) {
  return (
    <SectionShell id="filmmaker" eyebrow="Filmmaker world" title="Cinema street: pacing, posters, edits, and atmosphere." className="bg-[#222] text-white">
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project, index) => (
          <motion.article key={project} whileHover={{ y: -10, scale: 1.03 }} className="group min-h-96 overflow-hidden rounded-lg border border-white/15 bg-white/8 p-4 shadow-soft">
            <div className="flex h-full flex-col justify-between rounded-md bg-[#FFFDF7] p-4 text-foreground">
              <div className="aspect-[3/4] rounded-md bg-gradient-to-b from-secondary/80 via-accent/70 to-primary/80 p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white"><Play className="h-5 w-5 text-primary" aria-hidden /></span>
              </div>
              <div className="pt-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">Reel {index + 1}</p>
                <h3 className="mt-2 text-2xl font-black">{project}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm leading-6 text-muted-foreground transition-all duration-500 group-hover:max-h-24">
                  Storyboards, edits, transitions, motion studies, and images built to feel intentional.
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
