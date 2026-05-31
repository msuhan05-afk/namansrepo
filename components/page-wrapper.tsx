"use client";

import { motion } from "framer-motion";
import { useLenis } from "@/hooks/use-lenis";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  useLenis();
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-x-hidden pt-20 min-h-screen"
      style={{ background: "#080808" }}
    >
      {children}
    </motion.main>
  );
}
