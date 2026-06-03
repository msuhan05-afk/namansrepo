"use client";

import { Avatar, Badge, Button, GlassCard } from "@/components/ui";
import { emails as allEmails } from "@/lib/data";
import type { Email, EmailCategory } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Clock,
  Inbox,
  Send,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

const categories: (EmailCategory | "All")[] = [
  "All",
  "Urgent",
  "Requires Reply",
  "Interview",
  "Client",
  "Finance",
  "Newsletter",
];

const catTone: Record<string, "accent" | "success" | "warning" | "danger" | "neutral"> = {
  Urgent: "danger",
  "Requires Reply": "warning",
  Interview: "accent",
  Client: "success",
  Finance: "warning",
  Newsletter: "neutral",
  Ignore: "neutral",
};

export default function EmailCenter() {
  const [filter, setFilter] = useState<EmailCategory | "All">("All");
  const [selectedId, setSelectedId] = useState<string>(allEmails[0].id);
  const [reply, setReply] = useState("");
  const [archived, setArchived] = useState<Set<string>>(new Set());

  const list = useMemo(
    () =>
      allEmails
        .filter((e) => !archived.has(e.id))
        .filter((e) => filter === "All" || e.category === filter)
        .sort((a, b) => b.importance - a.importance),
    [filter, archived]
  );

  const selected: Email | undefined =
    list.find((e) => e.id === selectedId) ?? list[0];

  function archive(id: string) {
    setArchived((s) => new Set(s).add(id));
  }

  return (
    <div className="mx-auto max-w-5xl px-2 pb-24">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Smart Email</h1>
          <p className="mt-0.5 text-sm text-white/45">
            AI summarized & categorized your inbox · {allEmails.filter((e) => e.unread).length} unread
          </p>
        </div>
        <Button variant="glass" size="sm">
          <Wand2 className="h-4 w-4" /> Summarize inbox
        </Button>
      </div>

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              filter === c
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* List */}
        <div className="space-y-2">
          {list.length === 0 && (
            <GlassCard className="flex flex-col items-center gap-2 py-12 text-center">
              <Inbox className="h-8 w-8 text-white/25" />
              <p className="text-sm text-white/40">Nothing here. Inbox zero.</p>
            </GlassCard>
          )}
          {list.map((e) => (
            <GlassCard
              key={e.id}
              interactive
              onClick={() => {
                setSelectedId(e.id);
                setReply("");
              }}
              className={`p-3.5 ${selected?.id === e.id ? "ring-1 ring-accent/40" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Avatar name={e.from} color={e.avatarColor} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 truncate text-sm font-medium text-white">
                      {e.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                      {e.from}
                    </span>
                    <span className="shrink-0 text-[11px] text-white/35">{timeAgo(e.receivedAt)}</span>
                  </div>
                  <div className="truncate text-[13px] text-white/75">{e.subject}</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge tone={catTone[e.category]}>{e.category}</Badge>
                    <span className="text-[11px] text-white/35">·</span>
                    <span className="text-[11px] font-medium text-white/45">
                      Importance {e.importance}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
              >
                <GlassCard className="overflow-hidden">
                  <div className="border-b border-white/8 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={selected.from} color={selected.avatarColor} size={42} />
                        <div>
                          <div className="text-sm font-semibold text-white">{selected.from}</div>
                          <div className="text-[12px] text-white/40">{selected.fromEmail}</div>
                        </div>
                      </div>
                      <Badge tone={catTone[selected.category]}>{selected.category}</Badge>
                    </div>
                    <h2 className="mt-4 text-lg font-medium text-white">{selected.subject}</h2>
                  </div>

                  {/* AI summary */}
                  <div className="space-y-4 p-5">
                    <div className="rounded-xl border border-accent/20 bg-accent/8 p-4">
                      <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent">
                        <Sparkles className="h-3.5 w-3.5" /> AI Summary
                      </div>
                      <p className="text-sm leading-relaxed text-white/85">{selected.summary}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-[11px] text-white/45">
                          <span>Importance score</span>
                          <span className="font-semibold text-white/70">{selected.importance}/100</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${selected.importance}%`,
                              background:
                                selected.importance >= 80
                                  ? "#FF5A5A"
                                  : selected.importance >= 55
                                  ? "#FFB547"
                                  : "#3DDC97",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Suggested reply */}
                    {selected.suggestedReply && (
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-white/70">
                          <Wand2 className="h-3.5 w-3.5 text-accent" /> Suggested reply
                        </div>
                        <textarea
                          value={reply || selected.suggestedReply}
                          onChange={(e) => setReply(e.target.value)}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-white/85 outline-none focus:border-accent/40"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {selected.suggestedReply && (
                        <Button variant="primary" size="sm" onClick={() => archive(selected.id)}>
                          <Send className="h-4 w-4" /> Reply
                        </Button>
                      )}
                      <Button variant="glass" size="sm" onClick={() => archive(selected.id)}>
                        <Archive className="h-4 w-4" /> Archive
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Clock className="h-4 w-4" /> Snooze
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
