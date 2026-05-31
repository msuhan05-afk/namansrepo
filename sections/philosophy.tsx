"use client";

import { motion } from "framer-motion";

const words = [
  { text: "Good", delay: 0 },
  { text: "design", delay: 0.08 },
  { text: "isn't", delay: 0.16 },
  { text: "decoration.", delay: 0.24 },
  { text: "It's", delay: 0.4 },
  { text: "clarity,", delay: 0.48 },
  { text: "emotion,", delay: 0.64 },
  { text: "and", delay: 0.8 },
  { text: "impact.", delay: 0.88 },
];

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      data-world
      className="relative min-h-[80vh] flex flex-col items-center justify-center py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: "#040404" }}
    >
      {/* SVG doodle backgrounds */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Large circle */}
        <motion.circle
          cx="200"
          cy="400"
          r="120"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        {/* Underline squiggle */}
        <motion.path
          d="M 400 600 Q 520 570 640 600 Q 760 630 880 600"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        {/* Star top right */}
        <motion.path
          d="M 1300 150 L 1310 120 L 1320 150 L 1340 160 L 1320 170 L 1310 200 L 1300 170 L 1280 160 Z"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
        />
      </svg>

      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
      >
        06 — Philosophy
      </motion.p>

      {/* Quote */}
      <div className="relative max-w-4xl text-center">
        <p
          className="font-black text-white leading-tight"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
        >
          {words.map((word) => (
            <motion.span
              key={word.text + word.delay}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: word.delay, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.25em]"
              style={
                word.text === "clarity," || word.text === "emotion," || word.text === "impact."
                  ? { color: "#F97316" }
                  : {}
              }
            >
              {word.text}
            </motion.span>
          ))}
        </p>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 text-right text-sm italic text-[#F97316] font-medium"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          — Naman Mehra
        </motion.p>
      </div>
    </section>
  );
}
