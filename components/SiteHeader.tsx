import Link from "next/link";
import { Compass } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/70 border-b-2 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.65)] border border-white/30">
            <Compass className="h-5 w-5" />
          </span>
          <span className="arcade-title text-base tracking-wider">DADTRIP</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-xs">
          <NavLink href="/dashboard" label="🗺️ Hub" />
          <Link
            className="px-3 py-2 rounded-lg text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100 transition-colors font-bold uppercase tracking-wider hidden sm:inline-block"
            href="/trips/yosemite-2026"
          >
            ⚡ Demo
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="px-3 py-2 rounded-lg text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100 transition-colors font-bold uppercase tracking-wider"
      href={href}
    >
      {label}
    </Link>
  );
}
