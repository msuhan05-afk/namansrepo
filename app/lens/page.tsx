import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThroughMyLens } from "@/sections/through-my-lens";

export default function LensPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-bold shadow-soft transition hover:-translate-y-0.5" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to world
        </Link>
        <section className="py-14">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Photography system</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-normal">Through My Lens as a standalone interactive page.</h1>
          <ThroughMyLens />
        </section>
      </div>
    </main>
  );
}
