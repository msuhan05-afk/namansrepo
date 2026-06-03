"use client";

import { askChief, chiefSuggestions } from "@/lib/chief";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Msg {
  id: number;
  role: "assistant" | "user";
  text: string;
  actions?: string[];
}

let idSeq = 2;

export function ChiefOfStaff() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: "assistant",
      text: "Good morning, Naman. I've reviewed your inbox and calendar overnight. You have an interview invite from Ascendion waiting 26 hours, and the Kafi deck is due Friday. Ask me anything.",
      actions: ["Anything important?", "Plan my day"],
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setInput("");
    setMessages((m) => [...m, { id: idSeq++, role: "user", text: value }]);
    setThinking(true);
    setTimeout(() => {
      const reply = askChief(value);
      setThinking(false);
      setMessages((m) => [
        ...m,
        { id: idSeq++, role: "assistant", text: reply.text, actions: reply.actions },
      ]);
    }, 750);
  }

  return (
    <aside className="hidden w-[340px] shrink-0 flex-col p-4 pl-0 lg:flex">
      <div className="glass-strong flex h-full flex-col overflow-hidden rounded-2xl shadow-glass-lg">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="absolute inset-0 rounded-lg bg-accent/30 animate-pulse-ring" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Chief of Staff</div>
            <div className="flex items-center gap-1.5 text-[11px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · monitoring
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="scroll-area flex-1 space-y-4 px-4 py-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm text-white"
                    : "max-w-[90%] rounded-2xl rounded-bl-md glass px-4 py-3 text-sm leading-relaxed text-white/90"
                }
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.actions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button
                        key={a}
                        onClick={() => send(a)}
                        className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 text-[12px] font-medium text-white/80 transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-accent/70"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {chiefSuggestions.slice(0, 2).map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/55 transition-colors hover:border-white/25 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-white/8 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your chief of staff…"
            className="h-10 flex-1 rounded-xl bg-white/5 px-4 text-sm text-white placeholder-white/35 outline-none focus:bg-white/8"
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
