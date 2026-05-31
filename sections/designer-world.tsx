"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reveal, stagger } from "@/animations/variants";
import type { Project } from "@/types/portfolio";

export function DesignerWorld({ projects }: { projects: Project[] }) {
  return (
    <SectionShell id="designer" eyebrow="Designer world" title="A desk for turning human messiness into kind systems." className="bg-white">
      <motion.div className="mt-10 grid gap-5 md:grid-cols-2" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        {projects.map((project) => (
          <motion.div key={project.title} variants={reveal} whileHover={{ y: -8 }}>
            <Card className="group h-full overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge>{project.badge}</Badge>
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Completed" />
                </div>
                <CardTitle className="mt-4">{project.title}</CardTitle>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-secondary">{project.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{project.overview}</p>
                <p className="mt-4 rounded-md bg-muted p-3 text-sm font-semibold leading-6 opacity-90 transition group-hover:bg-accent/30">{project.outcome}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
