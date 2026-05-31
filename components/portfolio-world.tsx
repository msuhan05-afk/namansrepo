"use client";

import { useLenis } from "@/hooks/use-lenis";
import { HeroSection } from "@/sections/hero";
import { HomeExtras } from "@/sections/home-extras";

export function PortfolioWorld() {
  useLenis();

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <HomeExtras />
    </main>
  );
}
