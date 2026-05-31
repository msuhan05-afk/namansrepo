"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";

const roles = ["Designer.", "Builder.", "Storyteller."];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lampGlowRef = useRef<HTMLDivElement>(null);
  const doodleRef = useRef<SVGSVGElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [doodlesVisible, setDoodlesVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const deskY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // GSAP lamp → doodles → text entrance
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(lampGlowRef.current, { opacity: 1, duration: 1.8, ease: "power2.out" })
      .add(() => setDoodlesVisible(true), "+=0.3")
      .add(() => setTextVisible(true), "+=0.4");

    return () => { tl.kill(); };
  }, []);

  // Typewriter role cycle
  useEffect(() => {
    if (!textVisible) return;
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2000);
    return () => clearInterval(id);
  }, [textVisible]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: "#080808" }}
    >
      {/* Desk lamp radial glow */}
      <div
        ref={lampGlowRef}
        className="pointer-events-none absolute"
        style={{
          right: "18%",
          top: "15%",
          width: "60vw",
          height: "80vh",
          background: "radial-gradient(ellipse at 60% 20%, rgba(249,115,22,0.14) 0%, transparent 65%)",
          opacity: 0,
        }}
        aria-hidden
      />

      {/* Bottom center ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "80vw",
          height: "40vh",
          background: "radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* SVG Doodles — background wall decorations */}
      <svg
        ref={doodleRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Wavy line top-right */}
        <path
          className="doodle-path"
          d="M 900 80 Q 960 50 1020 80 Q 1080 110 1140 80 Q 1200 50 1260 80"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ animationDelay: doodlesVisible ? "0s" : "999s", animationPlayState: doodlesVisible ? "running" : "paused" }}
        />
        {/* Star top-left area */}
        <path
          className="doodle-path"
          d="M 180 140 L 190 120 L 200 140 L 220 150 L 200 160 L 190 180 L 180 160 L 160 150 Z"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1.5"
          style={{ animationDelay: doodlesVisible ? "0.3s" : "999s", animationPlayState: doodlesVisible ? "running" : "paused" }}
        />
        {/* Arrow right side */}
        <path
          className="doodle-path"
          d="M 1300 300 Q 1360 330 1380 360 M 1360 340 L 1380 360 L 1360 375"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: doodlesVisible ? "0.5s" : "999s", animationPlayState: doodlesVisible ? "running" : "paused" }}
        />
        {/* Circle doodle */}
        <circle
          className="doodle-path"
          cx="140"
          cy="420"
          r="28"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeDasharray="180"
          strokeDashoffset="180"
          style={{
            animationDelay: doodlesVisible ? "0.7s" : "999s",
            animationPlayState: doodlesVisible ? "running" : "paused",
          }}
        />
        {/* Small dots row */}
        <path
          className="doodle-path"
          d="M 700 820 L 720 820 M 730 820 L 750 820 M 760 820 L 780 820"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ animationDelay: doodlesVisible ? "0.9s" : "999s", animationPlayState: doodlesVisible ? "running" : "paused" }}
        />
      </svg>

      {/* Main layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center min-h-screen py-28">

        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={textVisible ? "visible" : "hidden"}
          style={{ y: textY }}
        >
          <motion.p
            variants={itemVariants}
            className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316]"
          >
            Hi, I&apos;m
          </motion.p>

          <motion.div variants={itemVariants} className="overflow-hidden">
            <h1
              className="font-black leading-none text-white"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)", letterSpacing: "-0.02em" }}
            >
              NAMAN
            </h1>
          </motion.div>
          <motion.div variants={itemVariants} className="overflow-hidden">
            <h1
              className="font-black leading-none text-white/90"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)", letterSpacing: "-0.02em" }}
            >
              MEHRA
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 h-12 overflow-hidden">
            <motion.p
              key={roleIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl font-bold text-[#F97316]"
            >
              {roles[roleIndex]}
            </motion.p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-md text-base text-white/50 leading-relaxed"
          >
            I turn ideas into experiences — through design, code, and storytelling.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8">
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-black hover:bg-[#ea6a0e] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              Explore My Journey
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Desk Scene */}
        <motion.div
          className="relative hidden lg:flex items-end justify-center"
          style={{ y: deskY }}
          aria-label="A top-down desk scene with MacBook, iPad, coffee mug, sketchbook, and desk lamp"
        >
          <div className="relative w-[500px] h-[420px]">

            {/* Desk surface */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[280px] rounded-2xl"
              style={{ background: "linear-gradient(145deg, #2a1f14 0%, #1e1509 100%)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
            />

            {/* Desk lamp */}
            <div className="absolute left-8 bottom-[260px] flex flex-col items-center z-20">
              {/* Lamp head */}
              <div
                className="w-14 h-5 rounded-full"
                style={{ background: "#1a1a1a", boxShadow: "0 0 20px 8px rgba(249,115,22,0.4), 0 0 40px 16px rgba(249,115,22,0.2)" }}
              />
              {/* Lamp arm */}
              <div className="w-1 h-16 bg-[#333] rounded-full" />
              {/* Lamp base */}
              <div className="w-8 h-2 rounded-full bg-[#2a2a2a]" />
            </div>

            {/* MacBook */}
            <div className="absolute bottom-[220px] left-[100px] z-10">
              {/* Screen */}
              <div
                className="w-48 h-32 rounded-t-lg"
                style={{ background: "#111", border: "2px solid #333", boxShadow: "inset 0 0 30px rgba(147,197,253,0.15), 0 0 20px rgba(147,197,253,0.1)" }}
              >
                {/* Screen content */}
                <div className="m-3 flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="h-1.5 w-16 rounded bg-[#93C5FD]/30 mt-1" />
                  <div className="h-1.5 w-full rounded bg-white/10" />
                  <div className="h-1.5 w-20 rounded bg-white/10" />
                  <div className="h-1.5 w-full rounded bg-white/10" />
                  <div className="h-1.5 w-28 rounded bg-[#F97316]/40" />
                  <div className="h-1.5 w-full rounded bg-white/10" />
                </div>
              </div>
              {/* Body */}
              <div className="w-48 h-3 rounded-b-sm" style={{ background: "#1a1a1a", border: "2px solid #333", borderTop: "none" }} />
            </div>

            {/* iPad */}
            <div
              className="absolute bottom-[225px] right-[60px] w-24 h-16 rounded-lg z-10"
              style={{ background: "#111", border: "2px solid #2a2a2a", transform: "rotate(5deg)" }}
            >
              <div className="m-1.5 flex flex-col gap-1">
                <div className="h-1 w-full rounded bg-[#F97316]/30" />
                <div className="h-4 w-full rounded bg-[#93C5FD]/10" />
                <div className="h-1 w-8 rounded bg-white/10" />
              </div>
            </div>

            {/* Sketchbook */}
            <div
              className="absolute bottom-[218px] right-[150px] w-28 h-20 rounded-sm z-[5]"
              style={{ background: "#f5f0e8", transform: "rotate(-3deg)" }}
            >
              {/* Ruled lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute left-3 right-3 h-px"
                  style={{ background: "rgba(0,0,0,0.12)", top: `${22 + i * 12}px` }}
                />
              ))}
              {/* Sketch squiggle */}
              <svg className="absolute bottom-3 left-3 w-16 h-8" viewBox="0 0 64 32" fill="none">
                <path d="M 4 20 Q 16 8 28 20 Q 40 32 52 16" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Coffee mug */}
            <div className="absolute bottom-[215px] left-[230px] z-20 flex flex-col items-center">
              {/* Steam */}
              <div className="relative flex gap-3 mb-1 h-8">
                <div className="w-1 h-6 rounded-full bg-white/40 animate-steam" style={{ animationDelay: "0s" }} />
                <div className="w-1 h-7 rounded-full bg-white/40 animate-steam" style={{ animationDelay: "0.5s" }} />
                <div className="w-1 h-5 rounded-full bg-white/40 animate-steam" style={{ animationDelay: "1s" }} />
              </div>
              {/* Cup body */}
              <div
                className="w-12 h-12 rounded-b-2xl rounded-t-sm relative"
                style={{ background: "#1a1a1a", border: "1.5px solid #333" }}
              >
                <div
                  className="absolute inset-1.5 rounded-b-xl rounded-t-sm"
                  style={{ background: "linear-gradient(to bottom, rgba(249,115,22,0.4), rgba(249,115,22,0.1))" }}
                />
                {/* Handle */}
                <div
                  className="absolute -right-3 top-2 w-3 h-6 rounded-full"
                  style={{ border: "1.5px solid #333", borderLeft: "none" }}
                />
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-white/30 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
