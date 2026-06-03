"use client";

import { Avatar, Badge, Button, GlassCard, Progress } from "@/components/ui";
import { contacts } from "@/lib/data";
import { timeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bell, MessageCircle, Users } from "lucide-react";

const relTone: Record<string, "accent" | "success" | "warning" | "danger" | "neutral"> = {
  Client: "success",
  Recruiter: "accent",
  Founder: "warning",
  Friend: "neutral",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
};

export default function PeoplePage() {
  const needFollowUp = contacts.filter((c) => c.followUpDue);

  return (
    <div className="mx-auto max-w-5xl px-2 pb-24">
      <div className="mb-5 flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">People</h1>
          <p className="mt-0.5 text-sm text-white/45">
            Personal CRM · {contacts.length} relationships · {needFollowUp.length} need a follow-up
          </p>
        </div>
        <Badge tone="warning">
          <Users className="h-3 w-3" /> {needFollowUp.length} follow-ups
        </Badge>
      </div>

      {/* Follow-up nudges */}
      {needFollowUp.length > 0 && (
        <GlassCard className="mb-5 p-4">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-medium text-warning">
            <Bell className="h-4 w-4" /> Suggested follow-ups
          </div>
          <div className="space-y-2">
            {needFollowUp.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl bg-white/4 px-3 py-2.5">
                <Avatar name={c.name} color={c.avatarColor} size={32} />
                <span className="flex-1 text-sm text-white/80">
                  You haven&apos;t followed up with <strong className="text-white">{c.name}</strong> from{" "}
                  {c.company} in {timeAgo(c.lastInteraction).replace(" ago", "")}.
                </span>
                <Button variant="glass" size="sm">
                  <MessageCircle className="h-3.5 w-3.5" /> Draft
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2">
        {contacts.map((c) => (
          <motion.div key={c.id} variants={item}>
            <GlassCard interactive className="p-4">
              <div className="flex items-start gap-3">
                <Avatar name={c.name} color={c.avatarColor} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{c.name}</span>
                    <Badge tone={relTone[c.relationship]}>{c.relationship}</Badge>
                  </div>
                  <div className="text-[12px] text-white/45">
                    {c.role} · {c.company}
                  </div>
                  <div className="mt-2.5">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-white/40">
                      <span>Relationship warmth</span>
                      <span>Last contact {timeAgo(c.lastInteraction)}</span>
                    </div>
                    <Progress
                      value={c.warmth}
                      tone={c.warmth >= 75 ? "success" : c.warmth >= 50 ? "warning" : "danger"}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
