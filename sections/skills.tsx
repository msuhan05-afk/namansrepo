"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const skills = [
  { label: "UX/UI Design", icon: "✦", color: "#F97316", delay: 0, x: 0, y: 0 },
  { label: "Research", icon: "◎", color: "#93C5FD", delay: 0.1, x: 0, y: 0 },
  { label: "Prototyping", icon: "⬡", color: "#A78BFA", delay: 0.2, x: 0, y: 0 },
  { label: "Branding", icon: "◈", color: "#FBBF24", delay: 0.3, x: 0, y: 0 },
  { label: "Video Editing", icon: "▷", color: "#F472B6", delay: 0.4, x: 0, y: 0 },
  { label: "Motion Graphics", icon: "◉", color: "#22D3EE", delay: 0.5, x: 0, y: 0 },
  { label: "Photography", icon: "◑", color: "#4ADE80", delay: 0.6, x: 0, y: 0 },
  { label: "AI Tools", icon: "⬢", color: "#FB7185", delay: 0.7, x: 0, y: 0 },
];

function SkillCard({
  skill,
  index,
  cursorX,
  cursorY,
  parentRect,
}: {
  skill: typeof skills[0];
  index: number;
  cursorX: import("framer-motion").MotionValue<number>;
  cursorY: import("framer-motion").MotionValue<number>;
  parentRect: React.MutableRefObject<DOMRect | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const offsetMultiplier = (index % 4) * 0.015 + 0.01;
  const dx = useTransform(cursorX, (v) => {
    if (!parentRect.current || !cardRef.current) return 0;
    const cardRect = cardRef.current.getBoundingClientRect();
    const cx = cardRect.left + cardRect.width / 2 - parentRect.current.left;
    return (v - cx) * offsetMultiplier;
  });
  const dy = useTransform(cursorY, (v) => {
    if (!parentRect.current || !cardRef.current) return 0;
    const cardRect = cardRef.current.getBoundingClientRect();
    const cy = cardRect.top + cardRect.height / 2 - parentRect.current.top;
    return (v - cy) * offsetMultiplier;
  });

  const springX = useSpring(dx, { stiffness: 80, damping: 20 });
  const springY = useSpring(dy, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: skill.delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        x: springX,
        y: springY,
        animationDelay: `${index * 0.5}s`,
        animationDuration: `${3.5 + index * 0.2}s`,
      }}
      className="animate-float"
    >
      <motion.div
        whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${skill.color}30` }}
        transition={{ duration: 0.2 }}
        className="rounded-xl p-5 flex flex-col gap-2 cursor-default"
        style={{
          background: "#0d0d0d",
          border: `1px solid ${skill.color}25`,
        }}
      >
        <span className="text-2xl" style={{ color: skill.color }}>{skill.icon}</span>
        <span className="text-sm font-semibold text-white/80">{skill.label}</span>
        <div className="h-0.5 w-8 rounded" style={{ background: skill.color + "60" }} />
      </motion.div>
    </motion.div>
  );
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parentRect = useRef<DOMRect | null>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    parentRect.current = rect;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="skills"
      data-world
      className="py-32 px-6 lg:px-12"
      style={{ background: "#080808" }}
    >
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
      >
        05 — Skills
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl lg:text-5xl font-black text-white mb-16"
        style={{ letterSpacing: "-0.02em" }}
      >
        What I <span className="text-[#F97316]">Do</span>
      </motion.h2>

      <div
        ref={sectionRef}
        className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        onMouseMove={handleMouseMove}
      >
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.label}
            skill={skill}
            index={i}
            cursorX={cursorX}
            cursorY={cursorY}
            parentRect={parentRect}
          />
        ))}
      </div>
    </section>
  );
}
