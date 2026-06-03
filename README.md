# Naman S PA — AI-Powered Personal Chief of Staff

A premium AI personal assistance system that feels like Apple designed an
executive assistant for creatives. Naman PA continuously monitors your email,
calendar, projects, opportunities and relationships, then proactively tells you
what matters — important emails, upcoming meetings, interview invitations,
client opportunities, pending invoices, approaching deadlines and follow-ups.

It thinks like a world-class executive assistant rather than a chatbot.

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 1 | **Executive Dashboard** | Morning Brief with date, weather, meetings, priority emails, tasks & a suggested focus |
| 2 | **Smart Email Center** | AI summarizes & categorizes the inbox (Urgent / Reply / Interview / Client / Finance…), scores importance and drafts one-click replies |
| 3 | **AI Chief of Staff** | Always-visible right panel that answers "Anything important?" with proactive, recommended actions |
| 4 | **Voice Assistant** | Apple-like floating orb that breathes when idle, pulses when thinking and reacts when speaking |
| 5 | **Opportunity Radar** | Scans LinkedIn / job boards / startup lists, ranks matches, prioritizes London · Remote · US |
| 6 | **Calendar Intelligence** | Visual timeline that detects conflicts, predicts busy days and suggests focus blocks |
| 7 | **Personal CRM** | Tracks clients, recruiters & founders with last-interaction and follow-up nudges |
| 8 | **Project Hub** | UX / Branding / Video projects with deliverables, deadlines and a health score |
| 9 | **AI Command Center** | Natural-language commands like "Show unpaid invoices" |

## 🎨 Design

Apple + Linear + Arc + Notion Calendar. Glassmorphism, soft blur, spacious,
minimal, high-contrast dark UI with smooth 60fps spring animations.

- Background `#0A0A0A` · Surface `rgba(255,255,255,0.06)`
- Accent `#4F8CFF` · Success `#3DDC97` · Warning `#FFB547` · Danger `#FF5A5A`
- Three-panel layout: left navigation · center content · right Chief of Staff

## 🧱 Tech Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** design tokens · **Framer Motion** spring animations
- **lucide-react** icons
- Designed to connect to: Gmail, Google Calendar, Notion, Slack, LinkedIn,
  OpenAI GPT-5 + Realtime API, ElevenLabs & Deepgram (Supabase backend)

The current build ships a fully interactive **front-end prototype** driven by a
realistic mock-data layer (`lib/data.ts`) so the entire experience is navigable
without API keys. Swap the mock layer for live integrations to go to production.

## 🚀 Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

## 📁 Structure

```
app/
  layout.tsx          three-panel shell + aurora background
  page.tsx            Executive Dashboard / Morning Brief
  email/              Smart Email Center
  calendar/           Calendar Intelligence
  projects/           Project Hub
  opportunities/      Opportunity Radar
  people/             Personal CRM
  settings/           Integrations + AI Command Center
components/
  Sidebar · ChiefOfStaff · VoiceOrb · PageTransition · ui (design system)
lib/
  data.ts · types.ts · chief.ts (intent engine) · utils.ts
```
