"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(dotX, { stiffness: 120, damping: 22, mass: 0.6 });
  const ringY = useSpring(dotY, { stiffness: 120, damping: 22, mass: 0.6 });

  const ringScale = useMotionValue(1);
  const scaledRing = useSpring(ringScale, { stiffness: 200, damping: 20 });

  const isVisible = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisible.current) {
        isVisible.current = true;
        document.body.classList.add("custom-cursor");
      }
    };

    const onEnterHoverable = () => ringScale.set(1.8);
    const onLeaveHoverable = () => ringScale.set(1);

    window.addEventListener("mousemove", onMove);

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-grow]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterHoverable);
        el.addEventListener("mouseleave", onLeaveHoverable);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, [dotX, dotY, ringScale]);

  return (
    <>
      {/* Small dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-[#F97316]"
        style={{
          width: 8,
          height: 8,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Trailing ring */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border border-[#F97316]"
        style={{
          width: 40,
          height: 40,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: scaledRing,
          opacity: 0.7,
        }}
      />
    </>
  );
}
