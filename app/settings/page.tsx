"use client";

import { Badge, GlassCard, SectionTitle } from "@/components/ui";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  FileText,
  Linkedin,
  Mail,
  MessageSquare,
  Mic,
  Slack,
  Terminal,
} from "lucide-react";
import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  soon?: boolean;
}

const initial: Integration[] = [
  { id: "gmail", name: "Gmail", desc: "Inbox monitoring & smart replies", icon: Mail, color: "#FF5A5A", connected: true },
  { id: "gcal", name: "Google Calendar", desc: "Events, conflicts & focus blocks", icon: Calendar, color: "#4F8CFF", connected: true },
  { id: "linkedin", name: "LinkedIn", desc: "Opportunity radar & network", icon: Linkedin, color: "#4F8CFF", connected: true },
  { id: "notion", name: "Notion", desc: "Projects, notes & deliverables", icon: FileText, color: "#9B78FF", connected: true },
  { id: "slack", name: "Slack", desc: "Team messages & mentions", icon: Slack, color: "#3DDC97", connected: false },
  { id: "whatsapp", name: "WhatsApp", desc: "Personal messages", icon: MessageSquare, color: "#3DDC97", connected: false, soon: true },
];

const commandExamples = [
  "Reply to all interview emails",
  "Show unpaid invoices",
  "Schedule a meeting with my client",
  "Find urgent tasks",
  "Draft a follow-up to Akash",
  "What should I work on today?",
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 18 } },
};

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState(initial);

  function toggle(id: string) {
    setIntegrations((list) =>
      list.map((i) => (i.id === id && !i.soon ? { ...i, connected: !i.connected } : i))
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-2 pb-24">
      <div className="mb-5 px-1 pt-1">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="mt-0.5 text-sm text-white/45">Connections, voice & command center</p>
      </div>

      {/* Integrations */}
      <SectionTitle title="Integrations" subtitle="What your chief of staff watches" />
      <motion.div variants={container} initial="hidden" animate="show" className="mb-8 grid gap-3 md:grid-cols-2">
        {integrations.map((i) => {
          const Icon = i.icon;
          return (
            <motion.div key={i.id} variants={item}>
              <GlassCard interactive className="flex items-center gap-4 p-4" onClick={() => toggle(i.id)}>
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${i.color}1F` }}
                >
                  <Icon className="h-5 w-5" style={{ color: i.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    {i.name}
                    {i.soon && <Badge tone="neutral">Soon</Badge>}
                  </div>
                  <div className="truncate text-[12px] text-white/45">{i.desc}</div>
                </div>
                {/* Toggle */}
                <div
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    i.connected ? "bg-accent" : "bg-white/12"
                  }`}
                >
                  <motion.span
                    layout
                    className="absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white"
                    style={{ left: i.connected ? 22 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {i.connected && <Check className="h-3 w-3 text-accent" />}
                  </motion.span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Command Center */}
      <SectionTitle title="AI Command Center" subtitle="Natural language commands" />
      <GlassCard className="mb-8 p-5">
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Terminal className="h-4 w-4 text-accent" />
          <input
            placeholder="Type a command…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/35 outline-none"
          />
          <kbd className="rounded-md border border-white/12 px-1.5 py-0.5 text-[10px] text-white/40">⏎</kbd>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {commandExamples.map((c) => (
            <button
              key={c}
              className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-left text-[13px] text-white/65 transition-colors hover:border-accent/30 hover:text-white"
            >
              <span className="text-accent">›</span> {c}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Voice */}
      <SectionTitle title="Voice Assistant" subtitle="Floating orb · always a tap away" />
      <GlassCard className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
          <Mic className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">Realtime voice</div>
          <p className="text-[12px] text-white/45">
            Natural conversation powered by OpenAI Realtime, ElevenLabs & Deepgram. Tap the orb anywhere to talk.
          </p>
        </div>
        <Badge tone="success">Enabled</Badge>
      </GlassCard>
    </div>
  );
}
