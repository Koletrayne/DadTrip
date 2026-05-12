import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function TripNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="arcade-page min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">🗺️</div>
          <h1 className="arcade-title text-2xl text-cyan-300">QUEST NOT FOUND</h1>
          <p className="text-slate-400 max-w-sm mx-auto">
            This trip may have been lost when the server restarted.
            In-memory trips don&apos;t survive restarts yet.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold uppercase tracking-wider text-sm shadow-[0_0_14px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
          >
            Back to Hub
          </Link>
        </div>
      </main>
    </>
  );
}
