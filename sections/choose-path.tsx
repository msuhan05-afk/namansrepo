"use client";

import { motion } from "framer-motion";
import { paths } from "@/data/portfolio";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reveal, stagger } from "@/animations/variants";

export function ChoosePath() {
  return (
    <section id="choose" data-world className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-1/2 h-2 w-[78%] -translate-x-1/2 path-dash" aria-hidden />
      <motion.div className="relative mx-auto max-w-7xl" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary">Choose your path</p>
        <h2 className="max-w-2xl text-3xl font-black sm:text-5xl">Four doors into the same curious brain.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <motion.a key={path.id} href={`#${path.id}`} variants={reveal} whileHover={{ y: -8, scale: 1.025 }} whileTap={{ scale: 0.98 }} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Card className="relative min-h-56 overflow-hidden p-5 transition group-hover:shadow-lift">
                  <Icon className="h-10 w-10 text-primary transition group-hover:rotate-6 group-hover:scale-110" aria-hidden />
                  <h3 className="mt-8 text-2xl font-black">{path.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{path.description}</p>
                  <Badge className="mt-5">+{path.xp} XP</Badge>
                </Card>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
