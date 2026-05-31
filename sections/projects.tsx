"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const projects = [
  {
    title: "MAI Health",
    desc: "AI-powered healthcare assistant that guides patients through symptoms with empathy-first design.",
    accent: "#F97316",
    tags: ["AI", "Healthcare", "UX Design"],
    gradient: "from-orange-900/30 to-orange-950/10",
  },
  {
    title: "Wedding.Design",
    desc: "A digital invitation platform turning one of life's most meaningful moments into a shareable, animated experience.",
    accent: "#93C5FD",
    tags: ["Web App", "Branding", "Motion"],
    gradient: "from-blue-900/30 to-blue-950/10",
  },
  {
    title: "Kafi",
    desc: "Coffee branding and packaging system crafted to evoke the warmth of a slow morning.",
    accent: "#FBBF24",
    tags: ["Branding", "Packaging", "Identity"],
    gradient: "from-amber-900/30 to-amber-950/10",
  },
  {
    title: "AutoPod Alternative",
    desc: "AI-assisted video editing workflow that removes 80% of manual cutting work for podcasters.",
    accent: "#A78BFA",
    tags: ["AI Tools", "Video", "Workflow"],
    gradient: "from-purple-900/30 to-purple-950/10",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-80, 80], [8, -8]);
  const rotateY = useTransform(x, [-80, 80], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      className="group rounded-2xl overflow-hidden cursor-pointer"
    >
      <div
        className="h-full flex flex-col"
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Accent bar */}
        <div className="h-[5px] w-full" style={{ background: project.accent }} />

        {/* Image placeholder */}
        <div className={`aspect-video w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black opacity-10 text-white">{project.title[0]}</span>
          </div>
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${project.accent}22 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed flex-1">{project.desc}</p>

          {/* Tags */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  background: `${project.accent}18`,
                  color: project.accent,
                  border: `1px solid ${project.accent}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href="#"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: project.accent }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            View Project <span aria-hidden>→</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" data-world className="py-32 px-6 lg:px-12" style={{ background: "#080808" }}>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
      >
        03 — Work
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl lg:text-5xl font-black text-white mb-16"
        style={{ letterSpacing: "-0.02em" }}
      >
        Selected <span className="text-[#F97316]">Work</span>
      </motion.h2>

      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
