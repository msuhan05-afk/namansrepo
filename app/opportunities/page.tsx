"use client";

import { Badge, Button, GlassCard, ScoreRing } from "@/components/ui";
import { opportunities } from "@/lib/data";
import { timeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bookmark, MapPin, Radar, Send } from "lucide-react";
import { useState } from "react";

const filters = ["All", "Remote", "London", "US", "Freelance"] as const;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
};

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const list = opportunities
    .filter((o) => {
      switch (filter) {
        case "Remote":
          return o.remote;
        case "London":
          return o.location.includes("London");
        case "US":
          return /US|New York|NY/.test(o.location);
        case "Freelance":
          return o.type === "Freelance" || o.type === "Contract";
        default:
          return true;
      }
    })
    .sort((a, b) => b.match - a.match);

  return (
    <div className="mx-auto max-w-5xl px-2 pb-24">
      <div className="mb-4 flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Opportunity Radar</h1>
          <p className="mt-0.5 text-sm text-white/45">
            Scanning LinkedIn, job boards & startup lists · prioritizing London, Remote, US
          </p>
        </div>
        <Badge tone="accent">
          <Radar className="h-3 w-3" /> {opportunities.length} new
        </Badge>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              filter === f
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {list.map((o) => (
          <motion.div key={o.id} variants={item}>
            <GlassCard interactive className="flex items-center gap-4 p-4">
              <ScoreRing value={o.match} size={52} label="match" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white">{o.role}</span>
                  {o.remote && <Badge tone="success">Remote</Badge>}
                </div>
                <div className="mt-0.5 text-sm text-white/60">{o.company}</div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-white/45">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {o.location}
                  </span>
                  <span>·</span>
                  <span>{o.type}</span>
                  {o.salary && (
                    <>
                      <span>·</span>
                      <span className="text-white/65">{o.salary}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{o.source}</span>
                  <span>·</span>
                  <span>{timeAgo(o.postedAt)}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Button variant="primary" size="sm">
                  <Send className="h-3.5 w-3.5" /> Apply
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-3.5 w-3.5" /> Save
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
