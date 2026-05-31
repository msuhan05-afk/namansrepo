import type { LucideIcon } from "lucide-react";

export type SiteContent = {
  name: string;
  headline: string;
  cta: string;
};

// Legacy types kept for data/portfolio.ts compatibility
export type PathId = "designer" | "builder" | "filmmaker" | "explorer";

export type JourneyPath = {
  id: PathId;
  label: string;
  description: string;
  xp: number;
  icon: LucideIcon;
};

export type Project = {
  title: string;
  role: string;
  overview: string;
  outcome: string;
  badge: string;
};

export type Achievement = {
  title: string;
  xp: number;
  detail: string;
};

export type BuilderModuleContent = {
  title: string;
  detail: string;
};

export type TimelineItemContent = {
  title: string;
  detail: string;
};

export type PortfolioContent = {
  hero: {
    name: string;
    eyebrow: string;
    headline: string;
    cta: string;
  };
  designerProjects: Project[];
  builderModules: BuilderModuleContent[];
  filmProjects: string[];
  explorerItems: string[];
  achievements: Achievement[];
  timeline: TimelineItemContent[];
  aboutCards: Array<{
    title: string;
    body: string;
  }>;
  contact: {
    headline: string;
    subhead: string;
    email: string;
    linkedin: string;
    resume: string;
  };
};
