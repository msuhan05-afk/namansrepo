"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/hooks/use-lenis";
import { Nav } from "@/components/nav";
import { HeroSection } from "@/sections/hero";
import { AboutSection } from "@/sections/about";
import { JourneySection } from "@/sections/journey";
import { ProjectsSection } from "@/sections/projects";
import { CreativeUniverse } from "@/sections/creative-universe";
import { SkillsSection } from "@/sections/skills";
import { PhilosophySection } from "@/sections/philosophy";
import { ContactSection } from "@/sections/contact";

export function PortfolioWorld() {
  useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-world]").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 40, opacity: 0.85 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%", end: "top 40%", scrub: 0.5 },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[#F97316] focus:px-3 focus:py-2 focus:text-black focus:text-sm"
      >
        Skip to content
      </a>
      <Nav />
      <main id="hero" className="overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <JourneySection />
        <ProjectsSection />
        <CreativeUniverse />
        <SkillsSection />
        <PhilosophySection />
        <ContactSection />
      </main>
    </>
  );
}
