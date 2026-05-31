"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const featured = [
  { title: "MAI Health", tag: "AI · Healthcare", color: "#F97316" },
  { title: "Wedding.Design", tag: "Product · Platform", color: "#93C5FD" },
  { title: "Kafi", tag: "Branding · Packaging", color: "#FBBF24" },
  { title: "AutoPod Alt.", tag: "Video · AI Workflow", color: "#C084FC" },
];

const resumeLines = [
  { section: "Experience", items: [
    { title: "HCI Designer & Creative Technologist", sub: "Freelance · 2023–Present" },
    { title: "Motion Designer & Video Editor", sub: "Various Studios · 2022–2023" },
  ]},
  { section: "Education", items: [
    { title: "MSc Human-Computer Interaction", sub: "UCA London · 2023–2024" },
    { title: "Bachelor of Design", sub: "Design Institute · 2020–2023" },
  ]},
  { section: "Skills", items: [
    { title: "UX/UI · Figma · Framer · Prototyping", sub: "" },
    { title: "Next.js · React · GSAP · Three.js", sub: "" },
    { title: "Premiere Pro · After Effects · DaVinci", sub: "" },
    { title: "AI Tools · Midjourney · Runway · Claude", sub: "" },
  ]},
];

export function HomeExtras() {
  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Naman Mehra — Resume</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111;padding:48px 56px;max-width:800px;margin:0 auto}
  h1{font-size:32px;font-weight:700;letter-spacing:-0.5px;margin-bottom:4px}
  .sub{font-size:13px;color:#666;margin-bottom:32px}
  .section-title{font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#F97316;font-weight:600;margin-bottom:12px;margin-top:28px;border-bottom:1px solid #eee;padding-bottom:6px}
  .item{margin-bottom:10px}
  .item-title{font-size:14px;font-weight:500;color:#111}
  .item-sub{font-size:12px;color:#888;margin-top:1px}
  @media print{body{padding:32px 40px}@page{margin:0.5in}}
</style></head><body>
<h1>Naman Mehra</h1>
<p class="sub">HCI Designer · Creative Technologist · Storyteller · London, UK · msuhan05@gmail.com</p>
${resumeLines.map(s=>`<div class="section-title">${s.section}</div>${s.items.map(i=>`<div class="item"><div class="item-title">${i.title}</div>${i.sub?`<div class="item-sub">${i.sub}</div>`:''}</div>`).join('')}`).join('')}
</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <>
      {/* ── Featured Work teaser ─────────────────────────────── */}
      <section className="px-6 md:px-10 py-24" style={{ background: "#080808" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#F97316] mb-2 font-mono">Selected Work</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Things I've Built</h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#F97316] transition-colors"
            >
              View all <span>→</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-1 w-full"
                  style={{ background: p.color }}
                />
                <div
                  className="aspect-video w-full"
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)` }}
                />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: p.color }}>
                    {p.tag}
                  </p>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#F97316] transition-colors">
                    {p.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/projects" className="text-sm text-[#F97316]">View all projects →</Link>
          </div>
        </div>
      </section>

      {/* ── Resume Printer ───────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 border-t" style={{ background: "#080808", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-10"
          >
            {/* Left: resume preview */}
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#F97316] mb-3 font-mono">Resume</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Naman Mehra</h2>

              {resumeLines.map((s, si) => (
                <motion.div
                  key={s.section}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: si * 0.15 }}
                  className="mb-8"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#F97316] mb-3 font-mono">{s.section}</p>
                  {s.items.map((item, ii) => (
                    <div key={ii} className="mb-3 pl-4 border-l border-white/10">
                      <p className="text-sm font-medium text-white/80">{item.title}</p>
                      {item.sub && <p className="text-xs text-white/35 mt-0.5">{item.sub}</p>}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Right: actions */}
            <div className="md:w-56 flex flex-col gap-3 md:sticky md:top-28">
              <motion.button
                onClick={handlePrint}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full text-sm font-semibold text-black transition-all"
                style={{ background: "#F97316" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print Resume
              </motion.button>

              <motion.a
                href="/resume.pdf"
                download
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full text-sm font-semibold text-[#F97316] transition-all"
                style={{ border: "1px solid rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.05)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </motion.a>

              <p className="text-[10px] text-center text-white/20 mt-1">
                Opens print dialog — save as PDF from there
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
