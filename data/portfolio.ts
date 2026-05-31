import { BadgeCheck, Brush, Camera, Compass, FlaskConical, Hammer, HeartHandshake, Map, Mountain, PenTool, Sparkles, Trophy } from "lucide-react";
import type { Achievement, JourneyPath, Project } from "@/types/portfolio";

export const paths: JourneyPath[] = [
  { id: "designer", label: "Designer", description: "Systems, research, journeys, interfaces.", xp: 50, icon: PenTool },
  { id: "builder", label: "Builder", description: "AI tools, prototypes, experiments.", xp: 100, icon: Hammer },
  { id: "filmmaker", label: "Filmmaker", description: "Stories with pacing, light, and feeling.", xp: 75, icon: Camera },
  { id: "explorer", label: "Explorer", description: "Travel, music, photography, coffee notes.", xp: 60, icon: Compass },
];

export const designerProjects: Project[] = [
  {
    title: "MAI Health",
    role: "HCI + Product Design",
    overview: "A warmer digital care journey that turns medical complexity into calm decision points.",
    outcome: "Mapped service flows, patient tasks, and a responsive interface for better handoffs.",
    badge: "Care Quest",
  },
  {
    title: "Design System",
    role: "UX/UI Designer",
    overview: "A modular token-led system for faster product iteration across web surfaces.",
    outcome: "Reduced design drift and made interaction states predictable for engineers.",
    badge: "System Keeper",
  },
  {
    title: "Fintech Dashboard",
    role: "Product Designer",
    overview: "A dense but readable dashboard for monitoring money movement and risk.",
    outcome: "Improved scan speed through clearer hierarchy, filters, and alert language.",
    badge: "Signal Finder",
  },
  {
    title: "UX Research",
    role: "Research Facilitator",
    overview: "Interview, workshop, and synthesis work around human needs and product bets.",
    outcome: "Converted messy field notes into testable opportunity areas and prototypes.",
    badge: "Insight Badge",
  },
];

export const builderModules = [
  { title: "AI Concepts", detail: "Small agents, prompt tools, and interface probes.", icon: Sparkles },
  { title: "HCI Experiments", detail: "Input, feedback, attention, and embodied interaction.", icon: FlaskConical },
  { title: "Web Applications", detail: "Next.js, Vite, motion systems, and product prototypes.", icon: BadgeCheck },
  { title: "Startup Tools", detail: "Fast experiments that make an idea tangible enough to test.", icon: Trophy },
];

export const filmProjects = [
  "Documentaries",
  "Commercials",
  "Product Films",
  "Motion Graphics",
];

export const explorerItems = [
  "Kashmir light studies",
  "Coffee counter notes",
  "Train-window sketches",
  "Book margin systems",
  "Music for edits",
  "Street photography",
];

export const lensImages = [
  "/assets/lens/kashmir-valley.svg",
  "/assets/lens/coffee-window.svg",
  "/assets/lens/train-notes.svg",
  "/assets/lens/street-corner.svg",
  "/assets/lens/book-margin.svg",
  "/assets/lens/music-room.svg",
  "/assets/lens/mountain-road.svg",
  "/assets/lens/film-light.svg",
  "/assets/lens/market-walk.svg",
  "/assets/lens/night-camp.svg",
  "/assets/lens/sketch-desk.svg",
  "/assets/lens/rain-glass.svg",
];

export const trailVariants = [
  { id: 1, name: "Classic Lerp" },
  { id: 2, name: "Luminous Bloom" },
  { id: 3, name: "Ethereal Ascent" },
  { id: 4, name: "Motion Drift" },
  { id: 5, name: "Angular Flow" },
  { id: 6, name: "Kinetic Blur" },
  { id: 7, name: "Depth Stack" },
  { id: 8, name: "3D Perspective" },
];

export const achievements: Achievement[] = [
  { title: "Problem Solver", xp: 120, detail: "Turns ambiguity into clear next moves." },
  { title: "Story Teller", xp: 90, detail: "Shapes product work with rhythm and emotion." },
  { title: "Builder", xp: 140, detail: "Makes prototypes real enough to learn from." },
  { title: "Photographer", xp: 80, detail: "Notices framing, light, and quiet moments." },
  { title: "Explorer", xp: 110, detail: "Collects references from places and people." },
  { title: "Workshop Facilitator", xp: 95, detail: "Creates rooms where ideas can move." },
  { title: "Product Designer", xp: 150, detail: "Balances systems, craft, and usefulness." },
  { title: "Human-Centered Thinker", xp: 200, detail: "Starts with people, ends with better tools." },
];

export const timeline = [
  { title: "Camera", detail: "Learning to see scenes, timing, and emotion.", icon: Camera },
  { title: "Design", detail: "Turning observation into usable interfaces.", icon: Brush },
  { title: "Engineering", detail: "Building enough to test the feeling.", icon: Hammer },
  { title: "HCI", detail: "Studying people, systems, and interaction.", icon: HeartHandshake },
  { title: "Product", detail: "Shipping decisions that respect context.", icon: Map },
  { title: "Worlds", detail: "Making portfolios, tools, and stories feel alive.", icon: Mountain },
];
