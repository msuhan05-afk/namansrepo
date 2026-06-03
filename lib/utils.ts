import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "26 hours ago" style relative time from an ISO string or Date. */
export function timeAgo(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const abs = Math.abs(seconds);
  const future = seconds < 0;

  const units: [number, string][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];

  let divisor = 1;
  let unit = "second";
  for (let i = 0; i < units.length; i++) {
    if (abs < units[i][0]) {
      unit = units[i][1];
      divisor = i === 0 ? 1 : units[i - 1][0];
      break;
    }
  }
  const value = Math.max(1, Math.floor(abs / divisor));
  const label = `${value} ${unit}${value === 1 ? "" : "s"}`;
  return future ? `in ${label}` : `${label} ago`;
}

export function formatTime(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
