"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, X } from "lucide-react";
import { useEffect, useState } from "react";

type OrbState = "idle" | "listening" | "thinking" | "speaking";

const prompts = [
  "Check my emails",
  "Any interviews?",
  "What should I work on today?",
  "Draft a reply to Ascendion",
  "Schedule a meeting",
];

const responses: Record<string, string> = {
  default:
    "You have 5 unread high-priority emails and 2 client meetings today. Your top focus is the Kafi branding presentation.",
};

export function VoiceOrb() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<OrbState>("idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");

  // Simulated voice flow: listening -> thinking -> speaking -> idle
  function startSession() {
    setOpen(true);
    setReply("");
    setTranscript("");
    setState("listening");
    const phrase = prompts[Math.floor(Math.random() * prompts.length)];
    let i = 0;
    const typer = setInterval(() => {
      setTranscript(phrase.slice(0, ++i));
      if (i >= phrase.length) {
        clearInterval(typer);
        setState("thinking");
        setTimeout(() => {
          setState("speaking");
          setReply(responses.default);
          setTimeout(() => setState("idle"), 3800);
        }, 1100);
      }
    }, 55);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ringColor =
    state === "listening" ? "#4F8CFF" : state === "speaking" ? "#3DDC97" : "#9B78FF";

  return (
    <>
      {/* Floating orb trigger */}
      <motion.button
        onClick={() => (open ? setOpen(false) : startSession())}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #6FA0FF, #4F8CFF 60%, #2E5BD0)",
          boxShadow: "0 8px 40px rgba(79,140,255,0.5)",
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Voice assistant"
      >
        <span className="absolute inset-0 rounded-full bg-accent/40 animate-pulse-ring" />
        <Mic className="relative z-10 h-6 w-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative flex w-[440px] max-w-[90vw] flex-col items-center rounded-3xl px-8 py-10 shadow-glass-lg"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* The orb */}
              <div className="relative flex h-44 w-44 items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-full"
                    style={{ border: `1px solid ${ringColor}44` }}
                    animate={{
                      width: [120, 176],
                      height: [120, 176],
                      opacity: [0.5, 0],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                  />
                ))}
                <motion.div
                  className="h-28 w-28 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 32% 30%, #8FB6FF, ${ringColor} 55%, #2E5BD0)`,
                    boxShadow: `0 0 60px ${ringColor}80`,
                  }}
                  animate={
                    state === "thinking"
                      ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }
                      : state === "speaking"
                      ? { scale: [1, 1.18, 0.96, 1.1, 1] }
                      : { scale: [1, 1.06, 1] }
                  }
                  transition={{
                    duration: state === "speaking" ? 0.7 : state === "thinking" ? 1.1 : 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="mt-6 text-center">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/40">
                  {state === "listening"
                    ? "Listening"
                    : state === "thinking"
                    ? "Thinking"
                    : state === "speaking"
                    ? "Speaking"
                    : "Tap the orb to speak"}
                </div>
                <p className="mt-3 min-h-[24px] text-lg font-medium text-white">
                  {transcript || "…"}
                </p>
                <AnimatePresence>
                  {reply && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm leading-relaxed text-white/65"
                    >
                      {reply}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {state === "idle" && (
                <button
                  onClick={startSession}
                  className="mt-7 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-glow"
                >
                  Ask again
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
