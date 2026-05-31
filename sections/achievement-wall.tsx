"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";
import { reveal, stagger } from "@/animations/variants";
import type { Achievement } from "@/types/portfolio";

export function AchievementWall({ achievements }: { achievements: Achievement[] }) {
  return (
    <SectionShell id="achievements" eyebrow="Achievement wall" title="Duolingo energy, but for craft, systems, and curiosity." className="bg-white">
      <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        {achievements.map((achievement) => (
          <motion.article key={achievement.title} variants={reveal} whileInView={{ scale: [0.94, 1.05, 1] }} className="rounded-lg border bg-background p-5 shadow-soft">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Award className="h-7 w-7" aria-hidden />
            </div>
            <h3 className="text-xl font-black">{achievement.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{achievement.detail}</p>
            <Badge className="mt-5">+{achievement.xp} XP</Badge>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}
