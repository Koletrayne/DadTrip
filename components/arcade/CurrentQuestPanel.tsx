import Link from "next/link";
import type { Trip } from "@/lib/types";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPProgressBar } from "@/components/game/XPProgressBar";
import type { LevelInfo } from "@/lib/game";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { daysUntil, formatDateRange } from "@/lib/utils";

export function CurrentQuestPanel({
  trip,
  level,
  totalXp,
}: {
  trip?: Trip;
  level: LevelInfo;
  totalXp: number;
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-3 md:gap-4">
      {/* HUD: level + xp + total */}
      <div className="arcade-panel p-4 lg:col-span-1 flex items-center gap-4">
        <LevelBadge info={level} size="md" />
        <div className="flex-1 min-w-0">
          <XPProgressBar info={level} />
        </div>
        <div className="rounded-lg border-2 border-yellow-400/55 bg-yellow-400/10 px-2.5 py-1.5 text-center shadow-[0_0_10px_rgba(250,204,21,0.25)]">
          <div className="arcade-font text-[8px] tracking-widest text-yellow-300">XP</div>
          <div className="font-extrabold text-white text-sm leading-none mt-0.5">{totalXp}</div>
        </div>
      </div>

      {/* Continue current quest CTA */}
      {trip ? (
        <Link
          href={`/trips/${trip.id}`}
          className="group lg:col-span-2 arcade-panel-strong p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 border-2 border-yellow-300/60 text-2xl shadow-[0_0_18px_rgba(244,114,182,0.5)]">
            {trip.coverEmoji ?? "✈️"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="arcade-font text-[9px] tracking-widest text-yellow-300">CONTINUE QUEST</div>
            <div className="font-extrabold text-white uppercase tracking-wide truncate">
              {trip.title}
            </div>
            <div className="text-[11px] text-slate-300 inline-flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-cyan-300" /> {trip.destination}
              <span className="text-slate-600">·</span>
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="arcade-font text-[8px] tracking-widest text-cyan-300">DAYS LEFT</div>
            <div className="text-2xl font-extrabold text-white leading-none">
              {Math.max(0, daysUntil(trip.startDate))}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-yellow-300 group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      ) : (
        <Link
          href="/trips/new"
          className="lg:col-span-2 arcade-panel p-4 flex items-center gap-3 text-cyan-100 hover:bg-cyan-500/10 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <div className="font-extrabold uppercase tracking-wider">Start a new quest</div>
        </Link>
      )}
    </div>
  );
}
