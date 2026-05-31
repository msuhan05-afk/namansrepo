"use client";

import { motion } from "framer-motion";

const contactItems = [
  {
    icon: "✉",
    label: "msuhan05@gmail.com",
    href: "mailto:msuhan05@gmail.com",
    color: "#F97316",
  },
  {
    icon: "in",
    label: "LinkedIn",
    href: "https://linkedin.com",
    color: "#93C5FD",
  },
  {
    icon: "◎",
    label: "Instagram",
    href: "https://instagram.com",
    color: "#F472B6",
  },
  {
    icon: "◍",
    label: "London, UK",
    href: "#",
    color: "#4ADE80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function ContactSection() {
  return (
    <section
      id="contact"
      data-world
      className="py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "80vw",
          height: "50vh",
          background: "radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-white/30"
        >
          07 — Contact
        </motion.p>

        <motion.h2
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-black text-white mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
        >
          Have a project{" "}
          <span className="text-[#F97316]">in mind?</span>
        </motion.h2>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-white/50 text-lg mb-12 max-w-lg mx-auto"
        >
          I&apos;m always open to meaningful conversations about design, technology, and storytelling.
        </motion.p>

        {/* Contact items */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {contactItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 rounded-xl px-5 py-3"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: item.color + "20", color: item.color }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium text-white/70">{item.label}</span>
            </motion.a>
          ))}
        </div>

        {/* Big CTA */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.a
            href="mailto:msuhan05@gmail.com"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 40px rgba(249,115,22,0.5)",
            }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center justify-center gap-3 w-full max-w-md rounded-full bg-[#F97316] px-8 py-5 text-base font-bold text-black"
          >
            Let&apos;s Build Something Meaningful
            <span className="text-lg" aria-hidden>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
