"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CalendarDays,
  LayoutDashboard,
  Mail,
  Radar,
  Settings,
  Sparkles,
  Users,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/email", label: "Email", icon: Mail, badge: 5 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/opportunities", label: "Opportunities", icon: Radar, badge: 5 },
  { href: "/people", label: "People", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col gap-2 p-4">
      {/* Brand */}
      <div className="mb-4 flex items-center gap-3 px-2 pt-1">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent shadow-glow">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-white">Naman S PA</div>
          <div className="text-[11px] text-white/40">Chief of Staff</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "text-white" : "text-white/55 hover:text-white"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="glass-strong absolute inset-0 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative z-10 h-[18px] w-[18px]" />
                <span className="relative z-10 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent/20 px-1.5 text-[11px] font-semibold text-accent">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="mt-auto">
        <div className="glass flex items-center gap-3 rounded-2xl p-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#4F8CFF,#9B78FF)" }}
          >
            N
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium text-white">Naman S</div>
            <div className="truncate text-[11px] text-white/40">London · Designer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
