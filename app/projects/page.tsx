"use client";

import { Badge, GlassCard, Progress, ScoreRing } from "@/components/ui";
import { projects } from "@/lib/data";
import type { ProjectStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, FolderKanban, Palette, PenTool, Video } from "lucide-react";

const statusTone: Record<ProjectStatus, "success" | "warning" | "danger" | "accent"> = {
  "On Track": "success",
  "At Risk": "warning",
  Blocked: "danger",
  Delivered: "accent",
};

const typeIcon = { UX: PenTool, Branding: Palette, Video: Video };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130, damping: 18 } },
};

export default function ProjectsPage() {
  const avgHealth = Math.round(projects.reduce((s, p) => s + p.health, 0) / projects.length);

  return (
    <div className="mx-auto max-w-5xl px-2 pb-24">
      <div className="mb-5 flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Projects</h1>
          <p className="mt-0.5 text-sm text-white/45">
            {projects.length} active · portfolio health {avgHealth}
          </p>
        </div>
        <Badge tone={avgHealth >= 75 ? "success" : "warning"}>
          <FolderKanban className="h-3 w-3" /> {avgHealth} health
        </Badge>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2"
      >
        {projects.map((p) => {
          const Icon = typeIcon[p.type];
          return (
            <motion.div key={p.id} variants={item}>
              <GlassCard interactive className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6">
                      <Icon className="h-5 w-5 text-white/70" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white">{p.name}</div>
                      <div className="text-[12px] text-white/45">
                        {p.client} · {p.type}
                      </div>
                    </div>
                  </div>
                  <ScoreRing value={p.health} label="health" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                  <span className="text-[12px] text-white/45">Due {timeAgo(p.deadline)}</span>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 flex justify-between text-[11px] text-white/45">
                    <span>Progress</span>
                    <span className="font-medium text-white/70">{p.progress}%</span>
                  </div>
                  <Progress
                    value={p.progress}
                    tone={p.health >= 75 ? "success" : p.health >= 50 ? "warning" : "danger"}
                  />
                </div>

                {/* Deliverables */}
                <div className="mt-4 space-y-1.5">
                  {p.deliverables.map((d) => (
                    <div key={d.label} className="flex items-center gap-2 text-[13px]">
                      {d.done ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Circle className="h-4 w-4 text-white/25" />
                      )}
                      <span className={d.done ? "text-white/45 line-through" : "text-white/80"}>
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-[12px] leading-relaxed text-white/55">
                  {p.notes}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
