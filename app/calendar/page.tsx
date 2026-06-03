"use client";

import { Badge, GlassCard, SectionTitle } from "@/components/ui";
import { events } from "@/lib/data";
import { formatTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, CalendarClock, Sparkles, Zap } from "lucide-react";

const typeColor: Record<string, string> = {
  meeting: "#FFFFFF",
  interview: "#4F8CFF",
  focus: "#3DDC97",
  personal: "#9B78FF",
};

const START_HOUR = 8;
const END_HOUR = 20;
const PX_PER_HOUR = 64;

function toOffset(iso: string) {
  const d = new Date(iso);
  return (d.getHours() + d.getMinutes() / 60 - START_HOUR) * PX_PER_HOUR;
}
function durationPx(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(28, ((e - s) / 3600000) * PX_PER_HOUR);
}

export default function CalendarPage() {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const conflicts = events.filter((e) => e.conflict);

  const insights = [
    {
      icon: AlertTriangle,
      tone: "danger" as const,
      title: "Scheduling conflict at 2:00 PM",
      body: "Your Ascendion interview overlaps with Maya's slide review. Move the review to 3:00 PM?",
    },
    {
      icon: Brain,
      tone: "warning" as const,
      title: "Tomorrow looks heavy",
      body: "6 hours of meetings predicted. Consider protecting a morning focus block.",
    },
    {
      icon: Zap,
      tone: "success" as const,
      title: "Best deep-work window",
      body: "10:30 AM–12:30 PM is open and matches your peak focus hours.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-2 pb-24">
      <div className="mb-5 flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Calendar</h1>
          <p className="mt-0.5 text-sm text-white/45">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {conflicts.length > 0 && ` · ${conflicts.length} conflict detected`}
          </p>
        </div>
        <Badge tone="accent">
          <Sparkles className="h-3 w-3" /> Calendar Intelligence
        </Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Timeline */}
        <GlassCard className="p-4">
          <div className="relative" style={{ height: (END_HOUR - START_HOUR) * PX_PER_HOUR + 20 }}>
            {/* Hour grid */}
            {hours.map((h, i) => (
              <div
                key={h}
                className="absolute left-0 right-0 flex items-start gap-3"
                style={{ top: i * PX_PER_HOUR }}
              >
                <span className="w-12 shrink-0 text-right text-[11px] text-white/30">
                  {h > 12 ? h - 12 : h}{h >= 12 ? "p" : "a"}
                </span>
                <div className="mt-2 h-px flex-1 bg-white/6" />
              </div>
            ))}

            {/* Now line */}
            <NowLine />

            {/* Events */}
            <div className="absolute left-16 right-2 top-0">
              {events.map((e) => {
                const overlap = e.conflict;
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute rounded-xl border p-2.5"
                    style={{
                      top: toOffset(e.start),
                      height: durationPx(e.start, e.end) - 6,
                      left: overlap ? "50%" : 0,
                      right: 0,
                      borderColor: `${typeColor[e.type]}40`,
                      background: `linear-gradient(135deg, ${typeColor[e.type]}22, ${typeColor[e.type]}0C)`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: typeColor[e.type] }} />
                      <span className="truncate text-[12px] font-medium text-white">{e.title}</span>
                    </div>
                    <div className="mt-0.5 pl-3.5 text-[10px] text-white/45">
                      {formatTime(e.start)} – {formatTime(e.end)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* AI insights */}
        <div>
          <SectionTitle title="AI insights" subtitle="Conflicts & focus" />
          <div className="space-y-3">
            {insights.map((ins) => {
              const Icon = ins.icon;
              const color = { danger: "#FF5A5A", warning: "#FFB547", success: "#3DDC97" }[ins.tone];
              return (
                <GlassCard key={ins.title} interactive className="p-4">
                  <div className="flex gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${color}1F` }}
                    >
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{ins.title}</div>
                      <p className="mt-1 text-[12px] leading-relaxed text-white/55">{ins.body}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}

            <GlassCard className="p-4">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-white/70">
                <CalendarClock className="h-4 w-4 text-accent" /> Suggested focus block
              </div>
              <div className="rounded-xl border border-success/25 bg-success/8 px-4 py-3">
                <div className="text-sm font-medium text-white">Kafi branding deck</div>
                <div className="text-[12px] text-white/50">10:30 AM – 12:30 PM · Protected</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function NowLine() {
  const now = new Date();
  const top = (now.getHours() + now.getMinutes() / 60 - START_HOUR) * PX_PER_HOUR;
  if (now.getHours() < START_HOUR || now.getHours() > END_HOUR) return null;
  return (
    <div className="absolute left-12 right-2 z-20 flex items-center" style={{ top }}>
      <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
      <div className="h-px flex-1 bg-accent/60" />
    </div>
  );
}
