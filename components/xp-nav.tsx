"use client";

import { Award, Star } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useXp } from "@/hooks/use-xp";

const links = [
  { href: "/#designer", label: "World" },
  { href: "/work", label: "Work" },
  { href: "/lens", label: "Lens" },
  { href: "/admin", label: "Admin" },
];

export function XpNav() {
  const { progress, xp, level, unlocked } = useXp();

  return (
    <nav aria-label="Primary navigation" className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-lg border bg-background/94 p-3 shadow-soft backdrop-blur">
      <div className="grid items-center gap-3 lg:grid-cols-[auto_1fr_auto]">
        <Link href="/#hero" className="rounded-md px-2 text-sm font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Naman
        </Link>
        <div className="hidden items-center justify-center gap-1 lg:flex">
          {links.map((link) => (
            <Link className="rounded-md px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 lg:min-w-[320px]">
          <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-accent" aria-hidden /> Level {level}</span>
            <span>{xp} XP</span>
          </div>
          <Progress value={progress} />
          </div>
          <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-bold" aria-label={`${unlocked} achievements unlocked`}>
            <Award className="h-4 w-4 text-primary" aria-hidden />
            {unlocked}/8
          </div>
        </div>
      </div>
    </nav>
  );
}
