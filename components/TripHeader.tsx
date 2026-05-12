import Link from "next/link";
import { CountdownBadge } from "./CountdownBadge";
import { StatusBadge } from "./StatusBadge";
import { LevelBadge } from "./game/LevelBadge";
import type { Trip } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";
import { ArrowLeft, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTripState } from "@/lib/mock-data";
import { computeXp, levelFromXp } from "@/lib/game";

export function TripHeader({ trip }: { trip: Trip }) {
  const state = getTripState(trip.id);
  const xp = computeXp(state).total;
  const level = levelFromXp(xp);

  return (
    <div className="relative overflow-hidden border-b-2 border-cyan-500/30 bg-slate-950/40 backdrop-blur">
      <div aria-hidden className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-purple-500/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="container-page py-5 md:py-7 relative">
        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-cyan-300/80">
          <Link href="/dashboard" className="inline-flex items-center gap-1 hover:text-cyan-100">
            <ArrowLeft className="h-3.5 w-3.5" /> All quests
          </Link>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900/80 text-3xl border-2 border-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.45)]">
              {trip.coverEmoji ?? "✈️"}
            </div>
            <div className="min-w-0">
              <h1 className="arcade-title text-xl md:text-2xl truncate">
                {trip.title}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-cyan-300" /> {trip.destination}
                </span>
                <span className="text-slate-600">·</span>
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                <span className="text-slate-600">·</span>
                <span>{trip.tripType}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="rounded-2xl border-2 border-yellow-500/50 bg-slate-900/80 backdrop-blur px-3 py-1.5 shadow-[0_0_18px_rgba(250,204,21,0.25)]">
              <LevelBadge info={level} size="sm" />
              <div className="mt-0.5 text-[10px] uppercase tracking-wider font-bold text-yellow-200">
                {xp} XP · {level.name}
              </div>
            </div>
            {trip.status !== "completed" && <CountdownBadge startDate={trip.startDate} />}
            <StatusBadge status={trip.status} />
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" /> Invite
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
