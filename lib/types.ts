export type EmailCategory =
  | "Urgent"
  | "Requires Reply"
  | "Interview"
  | "Client"
  | "Finance"
  | "Newsletter"
  | "Ignore";

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  avatarColor: string;
  subject: string;
  preview: string;
  summary: string;
  category: EmailCategory;
  importance: number; // 0-100
  receivedAt: string; // ISO
  unread: boolean;
  suggestedReply: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  type: "meeting" | "interview" | "focus" | "personal";
  location?: string;
  attendees?: string[];
  conflict?: boolean;
}

export interface Task {
  id: string;
  title: string;
  project?: string;
  priority: "high" | "medium" | "low";
  due?: string; // ISO
  done: boolean;
}

export type ProjectStatus = "On Track" | "At Risk" | "Blocked" | "Delivered";

export interface Project {
  id: string;
  name: string;
  client: string;
  type: "UX" | "Branding" | "Video";
  status: ProjectStatus;
  health: number; // 0-100
  progress: number; // 0-100
  deadline: string; // ISO
  deliverables: { label: string; done: boolean }[];
  notes: string;
}

export interface Opportunity {
  id: string;
  role: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Freelance";
  remote: boolean;
  postedAt: string; // ISO
  match: number; // 0-100
  salary?: string;
  source: "LinkedIn" | "Job Board" | "Startup List";
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  relationship: "Client" | "Recruiter" | "Founder" | "Friend";
  avatarColor: string;
  lastInteraction: string; // ISO
  followUpDue: boolean;
  warmth: number; // 0-100
}

export interface BriefStat {
  label: string;
  value: string;
  tone: "accent" | "success" | "warning" | "danger";
}

export interface ChiefMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: { label: string; tone?: "accent" | "ghost" }[];
}
