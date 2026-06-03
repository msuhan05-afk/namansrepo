import type {
  CalendarEvent,
  Contact,
  Email,
  Opportunity,
  Project,
  Task,
} from "./types";

// Anchor "now" so relative times stay coherent across the demo.
const now = new Date();
function hoursAgo(h: number) {
  return new Date(now.getTime() - h * 3600 * 1000).toISOString();
}
function hoursFromNow(h: number) {
  return new Date(now.getTime() + h * 3600 * 1000).toISOString();
}
function atToday(hour: number, minute = 0) {
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const user = {
  name: "Naman",
  firstName: "Naman",
  role: "Senior Product & Brand Designer",
  location: "London, UK",
  avatarColor: "#4F8CFF",
};

export const weather = {
  temp: 17,
  condition: "Light cloud",
  high: 19,
  low: 11,
  city: "London",
};

export const emails: Email[] = [
  {
    id: "e1",
    from: "Talent — Ascendion",
    fromEmail: "talent@ascendion.com",
    avatarColor: "#4F8CFF",
    subject: "Interview Invitation — Senior Product Designer",
    preview:
      "Hi Naman, we loved your portfolio and would like to invite you to a first-round interview...",
    summary:
      "Ascendion invited you to a first-round interview for Senior Product Designer. They proposed 3 slots this week and are awaiting your confirmation.",
    category: "Interview",
    importance: 96,
    receivedAt: hoursAgo(26),
    unread: true,
    suggestedReply:
      "Hi team, thank you so much for the invitation — I'm very excited about the role. Thursday at 2:00 PM works perfectly for me. Looking forward to speaking with you.",
  },
  {
    id: "e2",
    from: "Priya — Kafi Studio",
    fromEmail: "priya@kafi.studio",
    avatarColor: "#3DDC97",
    subject: "Re: Kafi branding presentation — final review",
    preview:
      "The board is excited! Can we get the final deck before Friday's stakeholder meeting?",
    summary:
      "Kafi's stakeholders want the final branding deck before Friday. Priya is asking for a delivery commitment. This is your highest-value active client.",
    category: "Client",
    importance: 92,
    receivedAt: hoursAgo(5),
    unread: true,
    suggestedReply:
      "Hi Priya, thrilled the board is excited! I'll have the final presentation ready by Thursday EOD so you have buffer before Friday. I'll share a preview link tomorrow morning.",
  },
  {
    id: "e3",
    from: "Stripe",
    fromEmail: "no-reply@stripe.com",
    avatarColor: "#9B78FF",
    subject: "Invoice #INV-2041 is still unpaid",
    preview: "Kevson Cafe has not yet paid invoice INV-2041 for £1,800...",
    summary:
      "Invoice INV-2041 (£1,800) to Kevson Cafe is 12 days overdue. A polite follow-up to Akash is recommended.",
    category: "Finance",
    importance: 84,
    receivedAt: hoursAgo(9),
    unread: true,
    suggestedReply:
      "Hi Akash, hope you're well! Just a gentle nudge that invoice INV-2041 (£1,800) is now due. Let me know if you need it re-sent — happy to help.",
  },
  {
    id: "e4",
    from: "Daniel Ortega",
    fromEmail: "daniel@northwind.io",
    avatarColor: "#FFB547",
    subject: "Quick question on the onboarding flow",
    preview: "Hey Naman, had a thought about step 3 of the onboarding — do you have 10 mins?",
    summary:
      "Daniel (Northwind) has a question about onboarding step 3 and wants a quick 10-minute call.",
    category: "Requires Reply",
    importance: 61,
    receivedAt: hoursAgo(20),
    unread: true,
    suggestedReply:
      "Hi Daniel, of course — I have time tomorrow between 11 and 1. Send a slot that suits and I'll make it work.",
  },
  {
    id: "e5",
    from: "LinkedIn",
    fromEmail: "jobs-noreply@linkedin.com",
    avatarColor: "#4F8CFF",
    subject: "5 new jobs match 'Senior UX Designer · Remote'",
    preview: "Monzo, Revolut and 3 others are hiring designers you might be a fit for...",
    summary: "5 new remote UX roles matching your saved search, including Monzo and Revolut.",
    category: "Newsletter",
    importance: 38,
    receivedAt: hoursAgo(14),
    unread: false,
    suggestedReply: "",
  },
  {
    id: "e6",
    from: "Maya Chen",
    fromEmail: "maya@foundersclub.co",
    avatarColor: "#FF5A5A",
    subject: "URGENT: Pitch deck visuals needed tonight",
    preview: "Naman — investor meeting moved up to tomorrow 9am. Can you polish 4 slides tonight?",
    summary:
      "Maya's investor meeting moved to 9am tomorrow. She urgently needs 4 pitch slides polished tonight.",
    category: "Urgent",
    importance: 89,
    receivedAt: hoursAgo(2),
    unread: true,
    suggestedReply:
      "Hi Maya, no problem — send the 4 slides and brand assets now and I'll have polished versions back to you by 11pm tonight.",
  },
  {
    id: "e7",
    from: "Notion",
    fromEmail: "team@makenotion.com",
    avatarColor: "#9B78FF",
    subject: "Your weekly digest",
    preview: "3 pages were edited in 'Client Projects' this week...",
    summary: "Weekly Notion digest — low priority.",
    category: "Ignore",
    importance: 12,
    receivedAt: hoursAgo(30),
    unread: false,
    suggestedReply: "",
  },
];

export const events: CalendarEvent[] = [
  {
    id: "c1",
    title: "Standup — Kafi Studio",
    start: atToday(9, 30),
    end: atToday(9, 50),
    type: "meeting",
    attendees: ["Priya", "Leo"],
  },
  {
    id: "c2",
    title: "Deep work — Kafi branding deck",
    start: atToday(10, 30),
    end: atToday(12, 30),
    type: "focus",
  },
  {
    id: "c3",
    title: "Client call — Northwind onboarding",
    start: atToday(13, 0),
    end: atToday(13, 45),
    type: "meeting",
    location: "Google Meet",
    attendees: ["Daniel Ortega"],
  },
  {
    id: "c4",
    title: "Interview — Ascendion (Round 1)",
    start: atToday(14, 0),
    end: atToday(15, 0),
    type: "interview",
    location: "Zoom",
    attendees: ["Talent Team"],
    conflict: true,
  },
  {
    id: "c5",
    title: "Review — Maya pitch slides",
    start: atToday(14, 30),
    end: atToday(15, 0),
    type: "meeting",
    conflict: true,
  },
  {
    id: "c6",
    title: "Gym",
    start: atToday(18, 30),
    end: atToday(19, 30),
    type: "personal",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Finish Kafi branding presentation",
    project: "Kafi Rebrand",
    priority: "high",
    due: hoursFromNow(28),
    done: false,
  },
  {
    id: "t2",
    title: "Reply to Ascendion interview invite",
    priority: "high",
    due: hoursFromNow(6),
    done: false,
  },
  {
    id: "t3",
    title: "Polish 4 pitch slides for Maya",
    project: "Founders Club",
    priority: "high",
    due: hoursFromNow(9),
    done: false,
  },
  {
    id: "t4",
    title: "Send follow-up invoice to Kevson Cafe",
    project: "Kevson Cafe",
    priority: "medium",
    due: hoursFromNow(24),
    done: false,
  },
  {
    id: "t5",
    title: "Export onboarding screens for Northwind",
    project: "Northwind",
    priority: "medium",
    due: hoursFromNow(48),
    done: false,
  },
  {
    id: "t6",
    title: "Edit Kevson promo video v2",
    project: "Kevson Cafe",
    priority: "low",
    due: hoursFromNow(72),
    done: false,
  },
  {
    id: "t7",
    title: "Update portfolio with Kafi case study",
    priority: "low",
    done: true,
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Kafi Rebrand",
    client: "Kafi Studio",
    type: "Branding",
    status: "At Risk",
    health: 68,
    progress: 82,
    deadline: hoursFromNow(28),
    deliverables: [
      { label: "Logo system", done: true },
      { label: "Color & type", done: true },
      { label: "Brand guidelines", done: true },
      { label: "Final presentation", done: false },
    ],
    notes: "Stakeholder review Friday. Deck is the last blocker — board is enthusiastic.",
  },
  {
    id: "p2",
    name: "Northwind App",
    client: "Northwind",
    type: "UX",
    status: "On Track",
    health: 88,
    progress: 60,
    deadline: hoursFromNow(220),
    deliverables: [
      { label: "User flows", done: true },
      { label: "Wireframes", done: true },
      { label: "Hi-fi onboarding", done: false },
      { label: "Prototype", done: false },
    ],
    notes: "Daniel has a question on onboarding step 3. Otherwise healthy.",
  },
  {
    id: "p3",
    name: "Kevson Promo Film",
    client: "Kevson Cafe",
    type: "Video",
    status: "Blocked",
    health: 41,
    progress: 45,
    deadline: hoursFromNow(96),
    deliverables: [
      { label: "Script", done: true },
      { label: "Rough cut", done: true },
      { label: "Color grade", done: false },
      { label: "Final export", done: false },
    ],
    notes: "Blocked on unpaid invoice + waiting for Akash to approve the rough cut.",
  },
  {
    id: "p4",
    name: "Founders Club Deck",
    client: "Founders Club",
    type: "Branding",
    status: "On Track",
    health: 79,
    progress: 70,
    deadline: hoursFromNow(12),
    deliverables: [
      { label: "Template", done: true },
      { label: "Content slides", done: true },
      { label: "4 polish slides", done: false },
    ],
    notes: "Investor meeting moved to 9am tomorrow — 4 slides due tonight.",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    role: "Senior Product Designer",
    company: "Monzo",
    location: "London / Remote",
    type: "Full-time",
    remote: true,
    postedAt: hoursAgo(6),
    match: 94,
    salary: "£85k–£105k",
    source: "LinkedIn",
  },
  {
    id: "o2",
    role: "Lead UX Designer",
    company: "Revolut",
    location: "London",
    type: "Full-time",
    remote: false,
    postedAt: hoursAgo(20),
    match: 89,
    salary: "£90k–£115k",
    source: "LinkedIn",
  },
  {
    id: "o3",
    role: "Brand Designer (Contract)",
    company: "Linear",
    location: "Remote — US/EU",
    type: "Contract",
    remote: true,
    postedAt: hoursAgo(32),
    match: 86,
    salary: "$700/day",
    source: "Startup List",
  },
  {
    id: "o4",
    role: "Freelance Video Editor",
    company: "Arc Browser",
    location: "Remote",
    type: "Freelance",
    remote: true,
    postedAt: hoursAgo(40),
    match: 81,
    salary: "$60/hr",
    source: "Job Board",
  },
  {
    id: "o5",
    role: "Product Designer",
    company: "Ramp",
    location: "New York / Remote",
    type: "Full-time",
    remote: true,
    postedAt: hoursAgo(50),
    match: 77,
    salary: "$140k–$170k",
    source: "Startup List",
  },
];

export const contacts: Contact[] = [
  {
    id: "ct1",
    name: "Akash Mehta",
    role: "Owner",
    company: "Kevson Cafe",
    relationship: "Client",
    avatarColor: "#FFB547",
    lastInteraction: hoursAgo(24 * 21),
    followUpDue: true,
    warmth: 52,
  },
  {
    id: "ct2",
    name: "Priya Nair",
    role: "Creative Director",
    company: "Kafi Studio",
    relationship: "Client",
    avatarColor: "#3DDC97",
    lastInteraction: hoursAgo(5),
    followUpDue: false,
    warmth: 91,
  },
  {
    id: "ct3",
    name: "Sarah Lin",
    role: "Talent Partner",
    company: "Ascendion",
    relationship: "Recruiter",
    avatarColor: "#4F8CFF",
    lastInteraction: hoursAgo(26),
    followUpDue: true,
    warmth: 70,
  },
  {
    id: "ct4",
    name: "Maya Chen",
    role: "Founder",
    company: "Founders Club",
    relationship: "Founder",
    avatarColor: "#FF5A5A",
    lastInteraction: hoursAgo(2),
    followUpDue: false,
    warmth: 84,
  },
  {
    id: "ct5",
    name: "Daniel Ortega",
    role: "Head of Product",
    company: "Northwind",
    relationship: "Client",
    avatarColor: "#9B78FF",
    lastInteraction: hoursAgo(20),
    followUpDue: false,
    warmth: 76,
  },
];

// Derived helpers used across the dashboard / chief of staff.
export const highPriorityEmails = emails.filter((e) => e.importance >= 80);
export const unreadCount = emails.filter((e) => e.unread).length;
export const todayMeetings = events.filter(
  (e) => e.type === "meeting" || e.type === "interview"
);
export const openTasks = tasks.filter((t) => !t.done);
export const interviewEmails = emails.filter((e) => e.category === "Interview");
