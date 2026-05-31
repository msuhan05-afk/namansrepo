"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.07] backdrop-blur-xl bg-[#080808]/80"
          : "bg-transparent"
      }`}
    >
      <a
        href="#"
        className="font-mono text-xl font-bold tracking-tight text-[#F97316] hover:opacity-80 transition-opacity"
      >
        NM
      </a>

      <nav className="flex items-center gap-8">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 tracking-wide"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full border border-[#F97316] px-4 py-1.5 text-sm font-medium text-[#F97316] hover:bg-[#F97316] hover:text-black transition-all duration-200"
        >
          Hire Me
        </a>
      </nav>
    </motion.header>
  );
}
