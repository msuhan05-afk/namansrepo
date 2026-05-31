"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { label: "About", href: "/about" },
  { label: "Journey", href: "/journey" },
  { label: "Work", href: "/projects" },
  { label: "Universe", href: "/universe" },
  { label: "Skills", href: "/skills" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      <Link
        href="/"
        className="font-mono text-xl font-bold tracking-tight text-[#F97316] hover:opacity-80 transition-opacity"
      >
        NM
      </Link>

      <nav className="flex items-center gap-8">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`text-sm font-medium transition-colors duration-200 tracking-wide ${
              pathname === link.href ? "text-white" : "text-white/50 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="rounded-full border border-[#F97316] px-4 py-1.5 text-sm font-medium text-[#F97316] hover:bg-[#F97316] hover:text-black transition-all duration-200"
        >
          Hire Me
        </Link>
      </nav>
    </motion.header>
  );
}
