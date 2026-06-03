"use client";

import { Avatar, Badge, GlassCard, Progress, SectionTitle } from "@/components/ui";
import {
  emails,
  events,
  highPriorityEmails,
  interviewEmails,
  openTasks,
  projects,
  tasks,
  todayMeetings,
  unreadCount,
  user,
  weather,
} from "@/lib/data";
import { formatTime, greeting } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Cloud,
  Mail,
  Sparkles,
  Target,
  CheckCircle2,
  Circle,
} from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
};

export default function Dashboard() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const briefStats = [
    { label: "Client meetings", value: String(todayMeetings.filter((e) => e.type === "meeting").length), tone: "accent" as const },
    { label: "Interview request", value: String(interviewEmails.length), tone: "success" as const },
    { label: "High-priority emails", value: String(highPriorityEmails.length), tone: "warning" as const },
    { label: "Open tasks", value: String(openTasks.length), tone: "danger" as const },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-5xl space-y-5 px-2 pb-24"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between px-1 pt-1">
        <div>
          <p className="text-sm text-white/40">{dateStr}</p>
          <h1 className="mt-0.5 text-3xl font-semibold tracking-tight gradient-text">
            {greeting()}, {user.firstName}.
          </h1>
        </div>
        <div className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5">
          <Cloud className="h-5 w-5 text-white/60" />
          <div className="leading-tight">
            <div className="text-sm font-medium text-white">{weather.temp}°C · {weather.condition}</div>
            <div className="text-[11px] text-white/40">{weather.city} · H{weather.high}° L{weather.low}°</div>
          </div>
        </div>
      </motion.div>

      {/* Morning Brief hero */}
      <motion.div variants={item}>
        <GlassCard className="relative overflow-hidden p-6">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.2em] text-accent">Morning Brief</div>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed text-white/90 text-balance">
                {greeting()}, {user.firstName}. You have{" "}
                <strong className="text-white">{todayMeetings.filter((e) => e.type === "meeting").length} client meetings</strong>,{" "}
                <strong className="text-white">{interviewEmails.length} interview request</strong>, and{" "}
                <strong className="text-white">{highPriorityEmails.length} unread high-priority emails</strong>.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
                <Target className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm text-white/85">
                  <span className="text-white/50">Recommended focus —</span>{" "}
                  <strong className="text-white">Finish the Kafi branding presentation.</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {briefStats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                <div
                  className="text-2xl font-semibold"
                  style={{
                    color: {
                      accent: "#4F8CFF",
                      success: "#3DDC97",
                      warning: "#FFB547",
                      danger: "#FF5A5A",
                    }[s.tone],
                  }}
                >
                  {s.value}
                </div>
                <div className="mt-0.5 text-[11px] text-white/45">{s.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Three columns: schedule / priority emails / focus tasks */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Today's schedule */}
        <motion.div variants={item}>
          <SectionTitle
            title="Today"
            subtitle={`${todayMeetings.length} meetings`}
            action={<Calendar className="h-4 w-4 text-white/30" />}
          />
          <div className="space-y-2">
            {events.slice(0, 5).map((e) => {
              const tone =
                e.type === "interview" ? "accent" : e.type === "focus" ? "success" : "neutral";
              return (
                <GlassCard key={e.id} interactive className="flex items-center gap-3 p-3.5">
                  <div className="w-14 shrink-0 text-right text-[12px] font-medium text-white/60">
                    {formatTime(e.start)}
                  </div>
                  <div
                    className="h-9 w-1 rounded-full"
                    style={{
                      background:
                        e.type === "interview"
                          ? "#4F8CFF"
                          : e.type === "focus"
                          ? "#3DDC97"
                          : e.type === "personal"
                          ? "#9B78FF"
                          : "rgba(255,255,255,0.3)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{e.title}</div>
                    {e.location && <div className="text-[11px] text-white/40">{e.location}</div>}
                  </div>
                  {e.conflict && <Badge tone="danger">Conflict</Badge>}
                  {e.type === "interview" && !e.conflict && <Badge tone="accent">Interview</Badge>}
                </GlassCard>
              );
            })}
          </div>
        </motion.div>

        {/* Priority emails */}
        <motion.div variants={item}>
          <SectionTitle
            title="Needs your attention"
            subtitle={`${unreadCount} unread`}
            action={<Mail className="h-4 w-4 text-white/30" />}
          />
          <div className="space-y-2">
            {highPriorityEmails.map((e) => (
              <GlassCard key={e.id} interactive className="flex items-start gap-3 p-3.5">
                <Avatar name={e.from} color={e.avatarColor} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-white">{e.from}</span>
                    <Badge
                      tone={
                        e.category === "Urgent"
                          ? "danger"
                          : e.category === "Interview"
                          ? "accent"
                          : e.category === "Finance"
                          ? "warning"
                          : "success"
                      }
                    >
                      {e.category}
                    </Badge>
                  </div>
                  <div className="truncate text-[13px] text-white/70">{e.subject}</div>
                  <div className="mt-1 line-clamp-1 text-[12px] text-white/40">{e.summary}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Focus tasks + project health */}
      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div variants={item}>
          <SectionTitle title="Priority tasks" subtitle="Suggested order" />
          <GlassCard className="divide-y divide-white/6 p-1">
            {openTasks.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-3">
                {t.done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-white/25" />
                )}
                <span className="flex-1 text-sm text-white/85">{t.title}</span>
                <Badge tone={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "neutral"}>
                  {t.priority}
                </Badge>
              </div>
            ))}
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <SectionTitle title="Project health" subtitle={`${projects.length} active`} />
          <div className="space-y-2">
            {projects.map((p) => (
              <GlassCard key={p.id} interactive className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{p.name}</span>
                  <span className="text-[12px] text-white/40">{p.client}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <Progress
                    value={p.health}
                    tone={p.health >= 75 ? "success" : p.health >= 50 ? "warning" : "danger"}
                  />
                  <span className="w-8 text-right text-[12px] font-semibold text-white/70">{p.health}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="flex justify-center pt-2">
        <a href="/email" className="group flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white">
          Open Smart Email Center
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </motion.div>
    </motion.div>
  );
}
