import Link from "next/link";
import { CountdownBadge } from "@/components/CountdownBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { LevelBadge } from "./LevelBadge";
import { PartyAvatarGroup } from "./PartyAvatar";
import { cn, formatDateRange } from "@/lib/utils";
import { computeAchievements, computeXp, levelFromXp } from "@/lib/game";
import type { Member, Trip, TripStatus } from "@/lib/types";
import { ArrowRight, MapPin, CalendarDays, Trophy } from "lucide-react";
import { getTripState } from "@/lib/mock-data";

const headerGradient: Record<TripStatus, string> = {
  idea:      "bg-gradient-to-br from-purple-600/60 via-purple-500/40 to-cyan-500/40",
  planning:  "bg-gradient-to-br from-orange-500/60 via-pink-500/40 to-purple-500/40",
  booked:    "bg-gradient-to-br from-emerald-500/60 via-cyan-500/40 to-purple-500/40",
  completed: "bg-gradient-to-br from-pink-500/50 via-purple-500/40 to-cyan-500/40",
};

export function AdventureCard({
  trip,
  members,
  primary = false,
}: {
  trip: Trip;
  members: Member[];
  primary?: boolean;
}) {
  const state = getTripState(trip.id);
  const xp = computeXp(state).total;
  const level = levelFromXp(xp);
  const achievements = computeAchievements(state);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  const ctaLabel = trip.status === "completed" ? "Open Memories" : "Continue Quest";

  return (
    <div
      className={cn(
        "arcade-card overflow-hidden relative",
        primary && "border-yellow-400/70 shadow-[0_0_24px_rgba(250,204,21,0.4),0_0_42px_rgba(244,114,182,0.24)]"
      )}
    >
      {primary && (
        <span
          aria-hidden
          className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full border border-yellow-400/60 bg-yellow-400/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.45)]"
        >
          ⚡ Active Quest
        </span>
      )}

      <div className={cn("relative h-24", headerGradient[trip.status])}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -bottom-7 left-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/85 text-3xl border-2 border-cyan-300/60 shadow-[0_0_18px_rgba(34,211,238,0.45)]">
          {trip.coverEmoji ?? "✈️"}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <StatusBadge status={trip.status} />
        </div>
      </div>

      <div className="p-5 pt-9">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/trips/${trip.id}`}
              className="font-extrabold text-base md:text-lg hover:text-cyan-200 truncate block text-white uppercase tracking-wide"
            >
              {trip.title}
            </Link>
            <div className="text-sm text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-300" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-cyan-300" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          {trip.status !== "completed" && (
            <>
              <span className="text-slate-600">·</span>
              <CountdownBadge startDate={trip.startDate} />
            </>
          )}
        </div>

        {/* XP block */}
        <div className="mt-4 rounded-xl border-2 border-yellow-400/40 bg-slate-950/60 p-3 shadow-[0_0_14px_rgba(250,204,21,0.18)]">
          <div className="flex items-center justify-between gap-3">
            <LevelBadge info={level} size="sm" />
            <div className="text-right">
              <div className="arcade-font text-[9px] tracking-wider text-yellow-300">TRIP XP</div>
              <div className="font-extrabold text-white text-sm">{xp} XP</div>
            </div>
          </div>
          <div className="mt-2 h-2 arcade-xp-track">
            <div className="arcade-xp-fill" style={{ width: `${Math.round(level.progress * 100)}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-300">{level.name}</span>
            <span className="inline-flex items-center gap-1 text-yellow-300">
              <Trophy className="h-3 w-3" />
              {unlocked}/{achievements.length}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <PartyAvatarGroup members={members} max={4} size={32} />
            <div className="text-xs text-slate-300">
              <span className="font-extrabold text-white">{members.length}</span> in party
            </div>
          </div>
          <Link
            href={`/trips/${trip.id}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider transition-all shadow-card",
              primary ? "arcade-button-orange" : "arcade-button"
            )}
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
