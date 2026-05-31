"use client";

import { useLenis } from "@/hooks/use-lenis";
import { HeroSection } from "@/sections/hero";

export function PortfolioWorld() {
  useLenis();

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
    </main>
  );
}
