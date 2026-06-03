"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import * as React from "react";

/* ---------------------------------- Card ---------------------------------- */
export function GlassCard({
  className,
  interactive = false,
  children,
  ...props
}: HTMLMotionProps<"div"> & { interactive?: boolean }) {
  return (
    <motion.div
      className={cn(
        "glass rounded-2xl shadow-glass",
        interactive && "glass-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------- Badge ---------------------------------- */
const toneMap: Record<string, string> = {
  accent: "bg-accent/15 text-accent border-accent/25",
  success: "bg-success/15 text-success border-success/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  danger: "bg-danger/15 text-danger border-danger/25",
  neutral: "bg-white/8 text-white/70 border-white/12",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof toneMap;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------- Button --------------------------------- */
const buttonVariants: Record<string, string> = {
  primary:
    "bg-accent text-white hover:bg-accent/90 shadow-glow border border-accent/40",
  glass:
    "glass glass-hover text-white border border-white/10",
  ghost: "text-white/70 hover:text-white hover:bg-white/6",
  danger: "bg-danger/15 text-danger hover:bg-danger/25 border border-danger/25",
};

export function Button({
  variant = "glass",
  size = "md",
  className,
  children,
  ...props
}: HTMLMotionProps<"button"> & {
  variant?: keyof typeof buttonVariants;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        buttonVariants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------- Progress bar ----------------------------- */
export function Progress({
  value,
  tone = "accent",
  className,
}: {
  value: number;
  tone?: "accent" | "success" | "warning" | "danger";
  className?: string;
}) {
  const colors = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/8", className)}>
      <motion.div
        className={cn("h-full rounded-full", colors[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      />
    </div>
  );
}

/* ---------------------------- Section heading ----------------------------- */
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------- Avatar --------------------------------- */
export function Avatar({
  name,
  color,
  size = 36,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        boxShadow: `0 4px 14px ${color}40`,
      }}
    >
      {initials}
    </div>
  );
}

/* ------------------------------ Score ring -------------------------------- */
export function ScoreRing({
  value,
  size = 44,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone =
    value >= 80 ? "#3DDC97" : value >= 55 ? "#FFB547" : "#FF5A5A";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ type: "spring", stiffness: 50, damping: 16 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[12px] font-semibold text-white">{value}</span>
        {label && <span className="text-[8px] text-white/40">{label}</span>}
      </div>
    </div>
  );
}
