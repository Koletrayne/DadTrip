"use client";

import { useMemo, useState } from "react";
import { cn, eachDay, formatLongDate, formatShortDate, formatTime } from "@/lib/utils";
import { googleCalendarUrl } from "@/lib/google-calendar";
import type { CalendarEvent, EventCategory, Member } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Badge } from "./ui/badge";
import { MonthCalendar } from "./MonthCalendar";
import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Plus,
} from "lucide-react";

type View = "month" | "trip" | "week" | "day";

const categoryStyle: Record<
  EventCategory,
  { dot: string; label: string; emoji: string; chip: string; bg: string; border: string; bar: string }
> = {
  travel: {
    dot: "bg-sky-400",
    label: "Travel",
    emoji: "🚗",
    chip: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    bar: "bg-sky-400",
  },
  lodging: {
    dot: "bg-purple-400",
    label: "Lodging",
    emoji: "🏡",
    chip: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    bar: "bg-purple-400",
  },
  meal: {
    dot: "bg-amber-400",
    label: "Meal",
    emoji: "🍽️",
    chip: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    bar: "bg-amber-400",
  },
  activity: {
    dot: "bg-emerald-400",
    label: "Activity",
    emoji: "🥾",
    chip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    bar: "bg-emerald-400",
  },
  reservation: {
    dot: "bg-orange-400",
    label: "Reservation",
    emoji: "📌",
    chip: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    bar: "bg-orange-400",
  },
  free_time: {
    dot: "bg-teal-400",
    label: "Free time",
    emoji: "🌿",
    chip: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    bg: "bg-teal-500/10",
    border: "border-teal-500/25",
    bar: "bg-teal-400",
  },
  family_event: {
    dot: "bg-pink-400",
    label: "Family event",
    emoji: "💛",
    chip: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    bg: "bg-pink-500/10",
    border: "border-pink-500/25",
    bar: "bg-pink-400",
  },
  reminder: {
    dot: "bg-yellow-400",
    label: "Reminder",
    emoji: "🔔",
    chip: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/25",
    bar: "bg-yellow-400",
  },
};

const dayHeaderGradients = [
  "bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-amber-500/20",
  "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20",
  "bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20",
  "bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-yellow-500/20",
  "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20",
  "bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-emerald-500/20",
  "bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-teal-500/20",
];

function detectConflicts(events: CalendarEvent[]) {
  const map = new Map<string, Set<string>>();
  const byDate: Record<string, CalendarEvent[]> = {};
  for (const e of events) (byDate[e.date] ??= []).push(e);
  for (const list of Object.values(byDate)) {
    const sorted = [...list].sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i];
        const b = sorted[j];
        if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) continue;
        if (a.startTime < b.endTime && b.startTime < a.endTime) {
          (map.get(a.id) ?? map.set(a.id, new Set()).get(a.id))!.add(b.id);
          (map.get(b.id) ?? map.set(b.id, new Set()).get(b.id))!.add(a.id);
        }
      }
    }
  }
  return map;
}

export function CalendarBoard({
  startDate,
  endDate,
  events,
  members,
}: {
  startDate: string;
  endDate: string;
  events: CalendarEvent[];
  members: Member[];
}) {
  const [view, setView] = useState<View>("month");
  const days = useMemo(() => eachDay(startDate, endDate), [startDate, endDate]);
  const [activeDay, setActiveDay] = useState<string>(days[0]);
  const conflicts = useMemo(() => detectConflicts(events), [events]);

  const memberById = useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) (map[e.date] ??= []).push(e);
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
    }
    return map;
  }, [events]);

  return (
    <div>
      {/* View switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex rounded-xl border border-slate-700/50 bg-slate-800/60 p-1 text-sm">
          {(["month", "trip", "week", "day"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 rounded-lg capitalize transition-all font-medium",
                view === v
                  ? "bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              {v === "month" ? "Month" : v === "trip" ? "Trip board" : v === "week" ? "Week" : "Day"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> Click any day to add
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.entries(categoryStyle).map(([k, v]) => (
          <span
            key={k}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              v.chip
            )}
          >
            <span>{v.emoji}</span>
            {v.label}
          </span>
        ))}
      </div>

      {view === "month" && (
        <MonthCalendar
          initialMonth={new Date(startDate + "T00:00:00")}
          events={events}
          members={members}
          tripStartDate={startDate}
          tripEndDate={endDate}
        />
      )}

      {view === "trip" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {days.map((d, i) => (
            <DayColumn
              key={d}
              date={d}
              gradient={dayHeaderGradients[i % dayHeaderGradients.length]}
              events={eventsByDay[d] ?? []}
              memberById={memberById}
              conflicts={conflicts}
            />
          ))}
        </div>
      )}

      {view === "week" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {days.map((d, i) => (
            <div key={d} className="rounded-2xl border border-slate-700/50 bg-slate-800/40 overflow-hidden">
              <div className={cn("px-3 py-2 border-b border-slate-700/50", dayHeaderGradients[i % dayHeaderGradients.length])}>
                <div className="text-[11px] uppercase tracking-wide text-cyan-300 font-semibold arcade-font">
                  {formatShortDate(d)}
                </div>
              </div>
              <div className="p-2 space-y-1.5 min-h-[160px]">
                {(eventsByDay[d] ?? []).map((e) => (
                  <MiniEvent key={e.id} event={e} />
                ))}
                {(eventsByDay[d] ?? []).length === 0 && (
                  <div className="text-xs text-slate-500 text-center py-6">Nothing planned</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "day" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-sm border transition-all font-medium",
                  activeDay === d
                    ? "bg-gradient-to-br from-cyan-500 to-purple-600 text-white border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
                )}
              >
                {formatShortDate(d)}
              </button>
            ))}
          </div>
          <DayColumn
            date={activeDay}
            gradient={dayHeaderGradients[days.indexOf(activeDay) % dayHeaderGradients.length]}
            events={eventsByDay[activeDay] ?? []}
            memberById={memberById}
            conflicts={conflicts}
            wide
          />
        </div>
      )}
    </div>
  );
}

function DayColumn({
  date,
  gradient,
  events,
  memberById,
  conflicts,
  wide,
}: {
  date: string;
  gradient: string;
  events: CalendarEvent[];
  memberById: Record<string, Member>;
  conflicts: Map<string, Set<string>>;
  wide?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border border-slate-700/50 bg-slate-800/40 overflow-hidden", wide && "min-h-[300px]")}>
      <div className={cn("flex items-center justify-between px-4 py-3 border-b border-slate-700/50", gradient)}>
        <div>
          <div className="arcade-font text-[9px] uppercase tracking-wider text-cyan-300">{date}</div>
          <div className="font-semibold text-white">{formatLongDate(date)}</div>
        </div>
        <button className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 opacity-60 hover:opacity-100 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> Add event
        </button>
      </div>
      <div className="p-3 space-y-2">
        {events.length === 0 && (
          <div className="text-sm text-slate-500 text-center py-8">No events yet — a free day so far.</div>
        )}
        {events.map((e) => (
          <EventRow
            key={e.id}
            event={e}
            memberById={memberById}
            conflict={!!conflicts.get(e.id)?.size}
          />
        ))}
      </div>
    </div>
  );
}

function MiniEvent({ event }: { event: CalendarEvent }) {
  const s = categoryStyle[event.category];
  return (
    <div
      className={cn(
        "rounded-lg border p-2 cursor-pointer transition-colors hover:brightness-110",
        s.bg,
        s.border
      )}
    >
      <div className="flex items-start gap-2">
        <span className={cn("mt-1 h-2 w-2 rounded-full shrink-0", s.dot)} />
        <div className="min-w-0">
          <div className="text-[11px] text-slate-400">{formatTime(event.startTime)}</div>
          <div className="text-sm font-medium truncate text-slate-200">{event.title}</div>
        </div>
      </div>
    </div>
  );
}

function EventRow({
  event,
  memberById,
  conflict,
}: {
  event: CalendarEvent;
  memberById: Record<string, Member>;
  conflict: boolean;
}) {
  const s = categoryStyle[event.category];
  const gcalUrl = googleCalendarUrl(event);
  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors flex gap-3",
        s.bg,
        s.border,
        "hover:brightness-[1.02]"
      )}
    >
      <div className={cn("w-1 rounded-full self-stretch shrink-0", s.bar)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <div className="font-medium flex items-center gap-2">
              <span className="truncate text-slate-200">{event.title}</span>
              {event.isConfirmed && (
                <Badge variant="success" className="shrink-0">
                  <CheckCircle2 className="h-3 w-3" /> Confirmed
                </Badge>
              )}
              {event.isOptional && <Badge variant="neutral">Optional</Badge>}
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 text-[10px] font-bold">
                ⚡ +15 XP
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  s.chip
                )}
              >
                <span>{s.emoji}</span> {s.label}
              </span>
              {event.startTime && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(event.startTime)}
                  {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {event.location}
                </span>
              )}
              {event.confirmationNumber && <span>Conf #{event.confirmationNumber}</span>}
              {event.link && (
                <a
                  href={event.link}
                  className="inline-flex items-center gap-1 text-cyan-300 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Link
                </a>
              )}
              <a
                href={gcalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 hover:bg-slate-600/60 border border-slate-600/50 px-2 py-0.5 font-medium text-cyan-300 transition-colors"
                title="Add to Google Calendar"
              >
                <CalendarPlus className="h-3.5 w-3.5" /> Add to Google
              </a>
            </div>
          </div>
          {event.assignedPeople.length > 0 && (
            <div className="flex -space-x-2">
              {event.assignedPeople.slice(0, 4).map((id) => {
                const m = memberById[id];
                if (!m) return null;
                return (
                  <div key={id} className="ring-2 ring-slate-800 rounded-full">
                    <Avatar member={m} size={24} />
                  </div>
                );
              })}
              {event.assignedPeople.length > 4 && (
                <div className="ring-2 ring-slate-800 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px] font-semibold text-slate-300">
                  +{event.assignedPeople.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {event.description && <div className="text-xs text-slate-400 mt-2">{event.description}</div>}

        {conflict && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2 py-1 text-xs font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            This overlaps with another event.
          </div>
        )}
      </div>
    </div>
  );
}
