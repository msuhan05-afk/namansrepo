"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const milestones = [
  {
    year: "2019",
    title: "Curiosity",
    desc: "Started exploring design and creativity — sketching interfaces, watching YouTube tutorials, falling in love with visual communication.",
    side: "left",
  },
  {
    year: "2020",
    title: "Learning",
    desc: "Deep-diving into UX, UI, motion design, and storytelling. Built my first real projects and discovered the power of human-centered thinking.",
    side: "right",
  },
  {
    year: "2021",
    title: "Experimentation",
    desc: "Trying bold ideas, failing fast, and improving even faster. Every mistake became a design principle.",
    side: "left",
  },
  {
    year: "2023",
    title: "Building",
    desc: "Creating products and experiences that people actually use — from healthcare apps to coffee brands to AI tools.",
    side: "right",
  },
  {
    year: "2024",
    title: "Impact",
    desc: "Designing meaningful solutions for real people. Pursuing MSc HCI at UCA London, bridging craft and science.",
    side: "left",
  },
];

export function JourneySection() {
  const lineRef = useRef<SVGLineElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const line = lineRef.current;
    if (!line) return;

    const length = 800;
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(line, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      data-world
      className="relative py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: "#040404" }}
    >
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
      >
        02 — Journey
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-4xl lg:text-5xl font-black text-white mb-20"
        style={{ letterSpacing: "-0.02em" }}
      >
        The Path So Far
      </motion.h2>

      <div className="relative mx-auto max-w-4xl">
        {/* Animated vertical SVG line */}
        <svg
          className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px overflow-visible"
          viewBox="0 0 1 800"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line
            ref={lineRef}
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="800"
            stroke="rgba(249,115,22,0.4)"
            strokeWidth="2"
          />
        </svg>

        <div className="flex flex-col gap-16">
          {milestones.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: m.side === "left" ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex ${m.side === "left" ? "justify-start" : "justify-end"}`}
            >
              {/* Node on the line */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                className="absolute left-1/2 top-6 -translate-x-1/2 z-10"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: "#F97316",
                    boxShadow: "0 0 16px rgba(249,115,22,0.7), 0 0 32px rgba(249,115,22,0.3)",
                  }}
                />
              </motion.div>

              {/* Content card */}
              <div
                className={`w-[42%] rounded-xl p-6 relative`}
                style={{
                  background: "#0d0d0d",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Year badge */}
                <span className="font-mono text-xs text-[#F97316] tracking-widest">{m.year}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">{m.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{m.desc}</p>

                {/* Blue doodle squiggle */}
                <svg
                  className="absolute -bottom-3 right-4 w-16 h-4 opacity-40"
                  viewBox="0 0 64 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M 2 8 Q 12 2 22 8 Q 32 14 42 8 Q 52 2 62 8"
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Connector line to center */}
                <div
                  className={`absolute top-8 h-px w-[calc(var(--connector-w))] bg-[#F97316]/20 ${
                    m.side === "left" ? "right-0 translate-x-full" : "left-0 -translate-x-full"
                  }`}
                  style={{ "--connector-w": "calc(100% + 2rem)" } as React.CSSProperties}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
