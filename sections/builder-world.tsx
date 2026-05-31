"use client";

import { BadgeCheck, FlaskConical, Hammer, Sparkles } from "lucide-react";
import { SectionShell } from "@/components/section-shell";
import { Card } from "@/components/ui/card";
import type { BuilderModuleContent } from "@/types/portfolio";

const builderIcons = [Sparkles, FlaskConical, BadgeCheck, Hammer];

export function BuilderWorld({ modules }: { modules: BuilderModuleContent[] }) {
  return (
    <SectionShell id="builder" eyebrow="Builder world" title="An innovation lab where sketches become working prototypes.">
      <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.8fr_1fr]">
        {modules.map((module, index) => {
          const Icon = builderIcons[index % builderIcons.length];
          return (
            <Card key={module.title} data-assemble className={`relative min-h-48 p-5 ${index === 1 ? "lg:mt-20" : index === 2 ? "lg:mt-10" : ""}`}>
              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-2xl font-black">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.detail}</p>
              <svg className="absolute -right-14 top-1/2 hidden h-12 w-24 text-secondary lg:block" viewBox="0 0 96 48" fill="none" aria-hidden>
                <path d="M2 24 C28 2 52 46 86 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
                <path d="M78 12 L90 20 L78 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Card>
          );
        })}
      </div>
    </SectionShell>
  );
}
