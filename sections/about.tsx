"use client";

import { motion } from "framer-motion";

const roles = [
  { label: "UX/UI Designer", color: "border-[#F97316] text-[#F97316]", delay: 0 },
  { label: "Product Designer", color: "border-[#93C5FD] text-[#93C5FD]", delay: 0.1 },
  { label: "Video Editor", color: "border-purple-400 text-purple-400", delay: 0.2 },
  { label: "Motion Designer", color: "border-pink-400 text-pink-400", delay: 0.3 },
  { label: "Creative Technologist", color: "border-[#F97316] text-[#F97316]", delay: 0.4 },
  { label: "Storyteller", color: "border-amber-400 text-amber-400", delay: 0.5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function AboutSection() {
  return (
    <section id="about" data-world className="relative py-32 px-6 lg:px-12 overflow-hidden" style={{ background: "#080808" }}>

      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
      >
        01 — About
      </motion.p>

      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-start">

        {/* Left: Text */}
        <div>
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-black text-white leading-tight mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            Hey, I&apos;m{" "}
            <span className="text-[#F97316]">Naman.</span>
          </motion.h2>

          {[
            "I design digital experiences that combine creativity, storytelling, and functionality.",
            "I believe design is not about screens — it's about the emotions behind them.",
            "It's about creating moments people remember long after the screen goes dark.",
          ].map((text, i) => (
            <motion.p
              key={i}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-white/60 text-lg leading-relaxed mb-5"
            >
              {text}
            </motion.p>
          ))}

          {/* Handwritten doodle decorations */}
          <div className="relative mt-8 h-8">
            <svg className="absolute left-0 top-0 w-40 h-8 opacity-50" viewBox="0 0 160 32" fill="none" aria-hidden>
              <path
                d="M 4 20 Q 40 4 80 20 Q 120 36 156 20"
                stroke="#93C5FD"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Right: Profile card with floating roles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ boxShadow: "0 0 60px rgba(249,115,22,0.15)" }}
          className="relative rounded-2xl p-8 transition-shadow duration-500"
          style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black"
              style={{ background: "linear-gradient(135deg, #F97316, #ea580c)", color: "#000" }}
            >
              NM
            </div>
            <div>
              <p className="font-bold text-white">Naman Mehra</p>
              <p className="text-sm text-white/40">HCI Designer & Creative Technologist</p>
            </div>
          </div>

          {/* Floating role pills */}
          <div className="flex flex-wrap gap-3">
            {roles.map((role, i) => (
              <motion.span
                key={role.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + role.delay, duration: 0.5, ease: "backOut" }}
                className={`animate-float rounded-full border px-3 py-1.5 text-xs font-medium ${role.color}`}
                style={{
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${3 + i * 0.3}s`,
                }}
              >
                {role.label}
              </motion.span>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-sm text-white/40 italic leading-relaxed">
              &ldquo;Design is the bridge between imagination and reality.&rdquo;
            </p>
          </div>

          {/* Decorative doodle */}
          <svg
            className="absolute bottom-4 right-4 w-20 h-12 opacity-20"
            viewBox="0 0 80 48"
            fill="none"
            aria-hidden
          >
            <path
              d="M 4 44 L 20 8 L 40 36 L 56 12 L 76 44"
              stroke="#93C5FD"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
