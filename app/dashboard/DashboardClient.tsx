"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { InsertCoinScreen } from "@/components/arcade/InsertCoinScreen";
import { ArcadeButton } from "@/components/arcade/ArcadeButton";
import { formatDateRange } from "@/lib/utils";
import { MapPin, CalendarDays, Plus, Play, Trash2, X } from "lucide-react";
import type { Trip, TripStatus } from "@/lib/types";
import { deleteTripAction } from "./actions";

const STATUS_BORDER: Record<TripStatus, string> = {
  idea:      "border-violet-500/50 hover:border-violet-400",
  planning:  "border-amber-500/50  hover:border-amber-400",
  booked:    "border-emerald-500/50 hover:border-emerald-400",
  completed: "border-slate-500/40  hover:border-slate-400",
};

const STATUS_LABEL: Record<TripStatus, string> = {
  idea:      "💭 IDEA",
  planning:  "⚙️ PLANNING",
  booked:    "✅ BOOKED",
  completed: "🏆 COMPLETE",
};

const STATUS_LABEL_COLOR: Record<TripStatus, string> = {
  idea:      "text-violet-400 border-violet-500/40",
  planning:  "text-amber-400  border-amber-500/40",
  booked:    "text-emerald-400 border-emerald-500/40",
  completed: "text-slate-400  border-slate-500/30",
};

const XP_BAR_COLOR: Record<TripStatus, string> = {
  idea:      "from-violet-400 to-purple-500",
  planning:  "from-amber-400  to-orange-500",
  booked:    "from-emerald-400 to-teal-500",
  completed: "from-slate-400  to-slate-500",
};

export type TripSlotData = {
  trip: Trip;
  xpTotal: number;
  levelNum: number;
  levelName: string;
  levelProgress: number;
};

function SaveSlot({
  data,
  slot,
  onDelete,
  isDeleting,
}: {
  data: TripSlotData;
  slot: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { trip, xpTotal, levelNum, levelName, levelProgress } = data;
  const today = new Date().toISOString().slice(0, 10);
  const daysLeft =
    trip.startDate > today
      ? Math.ceil(
          (new Date(trip.startDate).getTime() - Date.now()) / 86_400_000
        )
      : null;

  if (confirmingDelete) {
    return (
      <div
        className="relative block rounded-2xl border-2 border-red-500/60 bg-slate-900/80 p-5 transition-all"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-3xl leading-none">
              {trip.coverEmoji ?? "✈️"}
            </div>
            <div>
              <div className="arcade-title text-sm text-red-400">DELETE SAVE FILE?</div>
              <div className="arcade-font text-[10px] tracking-wide text-slate-400 mt-1">
                {trip.title} — this cannot be undone
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmingDelete(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 transition-colors"
            >
              <X className="h-3 w-3" /> CANCEL
            </button>
            <button
              onClick={() => onDelete(trip.id)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white border border-red-500 hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" /> {isDeleting ? "DELETING..." : "DELETE"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-2xl border-2 bg-slate-900/60 p-5 transition-all duration-200 hover:scale-[1.005] hover:bg-slate-900/80 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)] ${STATUS_BORDER[trip.status]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="arcade-font text-[9px] tracking-widest text-slate-600">
          SAVE FILE {String(slot).padStart(2, "0")}
        </div>
        <button
          onClick={() => setConfirmingDelete(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10"
          title="Delete trip"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <Link href={`/trips/${trip.id}`} className="flex items-center gap-4">
        <div className="flex-shrink-0 text-4xl leading-none">
          {trip.coverEmoji ?? "✈️"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="arcade-title text-sm leading-tight truncate">
              {trip.title}
            </h3>
            <span
              className={`flex-shrink-0 arcade-font text-[8px] tracking-widest px-2 py-1 rounded-md border ${STATUS_LABEL_COLOR[trip.status]}`}
            >
              {STATUS_LABEL[trip.status]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 arcade-font tracking-wide mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            {daysLeft !== null && daysLeft > 0 && (
              <span className="text-orange-400">
                {daysLeft}D LEFT
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="arcade-font text-[8px] tracking-widest text-cyan-400">
                  LV {levelNum} · {levelName.toUpperCase()}
                </span>
                <span className="arcade-font text-[8px] text-slate-500">
                  {xpTotal} XP
                </span>
              </div>
              <div className="h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${XP_BAR_COLOR[trip.status]} rounded-full transition-all`}
                  style={{ width: `${Math.min(100, levelProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all">
          <Play className="h-4 w-4 fill-current" />
        </div>
      </Link>
    </div>
  );
}

export function DashboardClient({
  slots,
  highScoreLabel,
}: {
  slots: TripSlotData[];
  highScoreLabel?: string;
}) {
  const [hasInsertedCoin, setHasInsertedCoin] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTripAction(id);
      router.refresh();
    });
  }

  if (!hasInsertedCoin) {
    return (
      <InsertCoinScreen
        onInsert={() => setHasInsertedCoin(true)}
        highScoreLabel={highScoreLabel}
      />
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="arcade-page animate-screen-in container-page py-6 md:py-10 pb-20 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="arcade-font text-[10px] tracking-widest text-cyan-300 mb-1">
            ▰ ADVENTURE HUB · SAVE FILES
          </div>
          <h1 className="arcade-title text-2xl md:text-3xl">LOAD GAME</h1>
        </div>

        <div className="flex flex-col gap-3">
          {slots.map((data, i) => (
            <SaveSlot
              key={data.trip.id}
              data={data}
              slot={i + 1}
              onDelete={handleDelete}
              isDeleting={isPending}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <ArcadeButton href="/trips/new" tone="primary" size="lg">
            <Plus className="h-4 w-4" />
            START NEW GAME
          </ArcadeButton>
        </div>

        <div className="mt-6 text-center arcade-font text-[9px] tracking-widest text-slate-600">
          ★ SELECT A SAVE FILE TO CONTINUE YOUR ADVENTURE
        </div>
      </main>
    </>
  );
}
