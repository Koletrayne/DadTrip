import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export type MapStatus = "new" | "in_progress" | "complete" | "unlocked";

const statusChip: Record<MapStatus, { label: string; cls: string }> = {
  new:         { label: "NEW",         cls: "bg-cyan-500/15 text-cyan-200 border-cyan-400/55" },
  in_progress: { label: "IN PROGRESS", cls: "bg-yellow-500/15 text-yellow-200 border-yellow-400/55" },
  complete:    { label: "COMPLETE",    cls: "bg-emerald-500/15 text-emerald-200 border-emerald-400/55" },
  unlocked:    { label: "UNLOCKED",    cls: "bg-slate-700/60 text-slate-200 border-slate-500/45" },
};

export type MapDestinationProps = {
  href: string;
  emoji: string;
  name: string;
  description?: string;
  status?: MapStatus;
  recommended?: boolean;
  progress?: number; // 0..1
  xpReward?: number;
  /** Map placement in a 12-column 6-row grid. Optional — when absent, the card flows in normal layout. */
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
};

export function MapDestinationCard({
  href,
  emoji,
  name,
  description,
  status = "unlocked",
  recommended,
  progress,
  xpReward,
  col,
  row,
  colSpan = 3,
  rowSpan = 2,
  className,
}: MapDestinationProps) {
  const chip = statusChip[status];
  const gridStyle =
    col !== undefined && row !== undefined
      ? {
          gridColumn: `${col} / span ${colSpan}`,
          gridRow: `${row} / span ${rowSpan}`,
        }
      : undefined;

  return (
    <Link
      href={href}
      style={gridStyle}
      className={cn(
        "map-destination",
        status === "complete" && "destination-complete",
        recommended && "destination-recommended",
        "block p-3.5 md:p-4 group",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950/80 border border-cyan-400/40 text-2xl shadow-[0_0_10px_rgba(34,211,238,0.25)]">
          {emoji}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-extrabold tracking-widest",
            chip.cls
          )}
        >
          {chip.label}
        </span>
      </div>
      <div className="mt-2.5">
        <div className="arcade-font text-[10px] tracking-wider text-cyan-200 leading-tight">
          {name.toUpperCase()}
        </div>
        {description && (
          <div className="mt-1 text-[11px] md:text-xs text-slate-300 leading-snug">
            {description}
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 arcade-xp-track">
            <div
              className="arcade-xp-fill"
              style={{ width: `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[10px]">
        {xpReward != null ? (
          <span className="font-extrabold tracking-widest text-yellow-300">+{xpReward} XP</span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 font-extrabold tracking-widest text-pink-300 group-hover:translate-x-0.5 transition-transform">
          ENTER <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      {recommended && (
        <span
          aria-hidden
          className="absolute -top-2 -left-2 inline-flex items-center gap-1 rounded-full border border-yellow-400 bg-yellow-300 text-slate-950 text-[9px] font-extrabold tracking-widest px-2 py-0.5 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
        >
          ★ NEXT
        </span>
      )}
    </Link>
  );
}
