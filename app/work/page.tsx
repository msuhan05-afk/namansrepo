import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WorkPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style={{ background: "#080808", color: "#f2f2f2" }}>
      <div className="mx-auto max-w-7xl">
        <Link
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
        <section className="py-14">
          <h1 className="mt-3 max-w-3xl text-5xl font-black">Selected Work</h1>
          <p className="mt-4 text-white/50">Projects coming soon.</p>
        </section>
      </div>
    </main>
  );
}
