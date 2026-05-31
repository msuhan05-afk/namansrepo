"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Planet {
  name: string;
  color: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  inclination: number;
  skill: string;
}

const planets: Planet[] = [
  { name: "UX Design", color: "#F97316", radius: 14, orbitRadius: 120, speed: 0.4, inclination: 0, skill: "Research, Wireframes, Prototyping" },
  { name: "Product", color: "#93C5FD", radius: 12, orbitRadius: 170, speed: 0.3, inclination: 0.2, skill: "Strategy, Roadmapping, Metrics" },
  { name: "Photography", color: "#FBBF24", radius: 10, orbitRadius: 220, speed: 0.25, inclination: -0.15, skill: "Composition, Light, Storytelling" },
  { name: "Video Editing", color: "#A78BFA", radius: 11, orbitRadius: 270, speed: 0.2, inclination: 0.3, skill: "Premiere Pro, After Effects, DaVinci" },
  { name: "Motion", color: "#F472B6", radius: 9, orbitRadius: 200, speed: 0.35, inclination: -0.25, skill: "GSAP, Framer Motion, Lottie" },
  { name: "AI", color: "#22D3EE", radius: 13, orbitRadius: 150, speed: 0.28, inclination: 0.4, skill: "Prompt Design, AI Integration" },
  { name: "Branding", color: "#4ADE80", radius: 10, orbitRadius: 240, speed: 0.22, inclination: -0.1, skill: "Identity, Typography, Systems" },
  { name: "Storytelling", color: "#FB7185", radius: 11, orbitRadius: 190, speed: 0.32, inclination: 0.35, skill: "Narrative, Scripting, Directing" },
];

export function CreativeUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [tooltip, setTooltip] = useState<{ name: string; skill: string; x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const planetPositions: Array<{ x: number; y: number; planet: Planet }> = [];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Starfield
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, w, h);

      // Draw stars once (use seeded positions)
      for (let i = 0; i < 120; i++) {
        const sx = ((i * 137.508 * w) % w);
        const sy = ((i * 53.831 * h) % h);
        const sr = 0.5 + (i % 3) * 0.4;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.1 + (i % 5) * 0.08})`;
        ctx.fill();
      }

      // Center: glowing core sphere
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      coreGrad.addColorStop(0, "rgba(255,255,255,0.95)");
      coreGrad.addColorStop(0.4, "rgba(249,115,22,0.6)");
      coreGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core glow ring
      const glowGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 60);
      glowGrad.addColorStop(0, "rgba(249,115,22,0.25)");
      glowGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Center label
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("NAMAN", cx, cy - 4);
      ctx.fillText("MEHRA", cx, cy + 10);

      planetPositions.length = 0;

      // Draw orbits and planets
      planets.forEach((planet) => {
        const angle = time * planet.speed + (planets.indexOf(planet) * Math.PI * 2) / planets.length;
        const px = cx + Math.cos(angle) * planet.orbitRadius;
        const py = cy + Math.sin(angle) * planet.orbitRadius * (1 - Math.abs(planet.inclination) * 0.3);

        // Orbit ring
        ctx.beginPath();
        ctx.ellipse(cx, cy, planet.orbitRadius, planet.orbitRadius * (1 - Math.abs(planet.inclination) * 0.3), planet.inclination, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Planet glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, planet.radius * 2.5);
        grad.addColorStop(0, planet.color + "ff");
        grad.addColorStop(0.4, planet.color + "88");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(px, py, planet.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Planet body
        ctx.beginPath();
        ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();

        // Label
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(planet.name, px, py + planet.radius + 14);

        planetPositions.push({ x: px, y: py, planet });
      });

      time += 0.008;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Tooltip on hover
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = false;
      for (const pos of planetPositions) {
        const dist = Math.hypot(mx - pos.x, my - pos.y);
        if (dist < pos.planet.radius + 12) {
          setTooltip({ name: pos.planet.name, skill: pos.planet.skill, x: e.clientX, y: e.clientY });
          found = true;
          break;
        }
      }
      if (!found) setTooltip(null);
    };

    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [isVisible]);

  return (
    <section
      id="universe"
      data-world
      className="py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: "#040404" }}
    >
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
      >
        04 — Universe
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl lg:text-5xl font-black text-white mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        My Creative <span className="text-[#F97316]">Universe</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-white/40 text-sm mb-12 max-w-md"
      >
        Every orbit is a discipline. Hover over a planet to explore.
      </motion.p>

      <div ref={sectionRef} className="relative w-full" style={{ height: "600px" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-2xl"
          style={{ background: "#040404" }}
        />

        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed z-50 pointer-events-none rounded-xl px-4 py-3 text-sm"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 30,
              background: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="font-bold text-white">{tooltip.name}</p>
            <p className="text-white/50 text-xs mt-0.5">{tooltip.skill}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
