"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { CalendarEvent, EventCategory, Member } from "@/lib/types";
import { Avatar } from "./Avatar";

const categoryStyle: Record<
  EventCategory,
  { dot: string; chip: string; emoji: string; label: string; barBg: string }
> = {
  travel:       { dot: "bg-sky-400",     chip: "bg-sky-500/20 text-sky-300 border-sky-500/30",          emoji: "🚗", label: "Travel",       barBg: "bg-sky-400/40" },
  lodging:      { dot: "bg-purple-400",  chip: "bg-purple-500/20 text-purple-300 border-purple-500/30", emoji: "🏡", label: "Lodging",      barBg: "bg-purple-400/40" },
  meal:         { dot: "bg-amber-400",   chip: "bg-amber-500/20 text-amber-300 border-amber-500/30",    emoji: "🍽️", label: "Meal",         barBg: "bg-amber-400/40" },
  activity:     { dot: "bg-emerald-400", chip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", emoji: "🥾", label: "Activity",  barBg: "bg-emerald-400/40" },
  reservation:  { dot: "bg-orange-400",  chip: "bg-orange-500/20 text-orange-300 border-orange-500/30", emoji: "📌", label: "Reservation",  barBg: "bg-orange-400/40" },
  free_time:    { dot: "bg-teal-400",    chip: "bg-teal-500/20 text-teal-300 border-teal-500/30",       emoji: "🌿", label: "Free time",    barBg: "bg-teal-400/40" },
  family_event: { dot: "bg-pink-400",    chip: "bg-pink-500/20 text-pink-300 border-pink-500/30",       emoji: "💛", label: "Family event", barBg: "bg-pink-400/40" },
  reminder:     { dot: "bg-yellow-400",  chip: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", emoji: "🔔", label: "Reminder",     barBg: "bg-yellow-400/40" },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(d: Date) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function MonthCalendar({
  initialMonth,
  events,
  members,
  tripStartDate,
  tripEndDate,
}: {
  initialMonth: Date;
  events: CalendarEvent[];
  members: Member[];
  tripStartDate: string;
  tripEndDate: string;
}) {
  const [year, setYear] = useState(initialMonth.getFullYear());
  const [month, setMonth] = useState(initialMonth.getMonth()); // 0-indexed
  const [hoveredEvent, setHoveredEvent] = useState<{
    eventId: string;
    cellIndex: number;
  } | null>(null);

  const memberById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members]
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) (map[e.date] ??= []).push(e);
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
    }
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: { date: Date; iso: string; inMonth: boolean }[] = [];

    // Leading days from prev month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      out.push({ date: d, iso: ymd(d), inMonth: false });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      out.push({ date: d, iso: ymd(d), inMonth: true });
    }
    // Trailing to fill 6 weeks (42 cells)
    while (out.length < 42) {
      const last = out[out.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      out.push({ date: next, iso: ymd(next), inMonth: false });
    }
    return out;
  }, [year, month]);

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setHoveredEvent(null);
  }

  const todayISO = ymd(new Date());

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 border-b border-slate-700/50">
        <button
          onClick={() => shift(-1)}
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 text-cyan-300"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {MONTH_NAMES[month]} {year}
          </div>
          <div className="arcade-font text-[9px] uppercase tracking-wider text-cyan-300">
            Hover an event to preview
          </div>
        </div>
        <button
          onClick={() => shift(1)}
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/50 text-cyan-300"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 bg-slate-800/60 border-b border-slate-700/50">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 arcade-font text-[9px] font-semibold uppercase tracking-wider text-cyan-300 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 grid-rows-6 relative">
        {cells.map((cell, idx) => {
          const dayEvents = eventsByDate[cell.iso] ?? [];
          const inTripRange = cell.iso >= tripStartDate && cell.iso <= tripEndDate;
          const isToday = cell.iso === todayISO;
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;

          return (
            <div
              key={idx}
              className={cn(
                "relative border-r border-b border-slate-700/30 min-h-[110px] md:min-h-[128px] p-1.5",
                !cell.inMonth && "bg-slate-900/40 text-slate-600",
                cell.inMonth && isWeekend && "bg-slate-800/30",
                cell.inMonth && !isWeekend && "bg-slate-800/20",
                inTripRange && cell.inMonth && "bg-cyan-500/5",
                idx % 7 === 6 && "border-r-0",
                idx >= 35 && "border-b-0"
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isToday
                      ? "bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      : cell.inMonth
                      ? "text-slate-300"
                      : "text-slate-600"
                  )}
                >
                  {cell.date.getDate()}
                </div>
                {inTripRange && cell.inMonth && (
                  <span className="arcade-font text-[8px] uppercase tracking-wider font-bold text-cyan-400">
                    Trip
                  </span>
                )}
              </div>

              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 3).map((e) => {
                  const s = categoryStyle[e.category];
                  const isHovered =
                    hoveredEvent?.eventId === e.id &&
                    hoveredEvent.cellIndex === idx;
                  return (
                    <div key={e.id} className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredEvent({ eventId: e.id, cellIndex: idx })}
                        onMouseLeave={() => setHoveredEvent(null)}
                        onFocus={() => setHoveredEvent({ eventId: e.id, cellIndex: idx })}
                        onBlur={() => setHoveredEvent(null)}
                        className={cn(
                          "w-full text-left rounded-md border px-1.5 py-0.5 truncate text-[11px] font-medium transition-all",
                          s.chip,
                          "hover:brightness-110 hover:shadow-sm"
                        )}
                      >
                        <span className="mr-1">{s.emoji}</span>
                        {e.startTime && (
                          <span className="opacity-70 mr-1">{formatTime(e.startTime).replace(":00", "")}</span>
                        )}
                        <span className="truncate">{e.title}</span>
                      </button>

                      {isHovered && (
                        <EventTooltip
                          event={e}
                          memberById={memberById}
                          cellIndex={idx}
                        />
                      )}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-slate-500 px-1.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventTooltip({
  event,
  memberById,
  cellIndex,
}: {
  event: CalendarEvent;
  memberById: Record<string, Member>;
  cellIndex: number;
}) {
  const s = categoryStyle[event.category];
  // Position the tooltip on the side away from edges
  const col = cellIndex % 7;
  const row = Math.floor(cellIndex / 7);
  const horizontal = col >= 5 ? "right-0" : "left-0";
  const vertical = row >= 4 ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div
      role="tooltip"
      className={cn(
        "absolute z-30 w-72 rounded-xl border border-slate-600/50 bg-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] p-3 text-left",
        horizontal,
        vertical
      )}
      style={{ pointerEvents: "none" }}
    >
      <div className={cn("h-1 w-10 rounded-full mb-2", s.barBg)} />
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
            s.chip
          )}
        >
          <span>{s.emoji}</span> {s.label}
        </span>
      </div>
      <div className="mt-2 font-semibold text-white">{event.title}</div>
      <div className="mt-1 space-y-1 text-xs text-slate-400">
        {event.startTime && (
          <div className="inline-flex items-center gap-1 text-orange-400">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(event.startTime)}
            {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {event.location}
          </div>
        )}
        {event.description && (
          <div className="text-slate-400 italic">{event.description}</div>
        )}
        {event.assignedPeople.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <div className="flex -space-x-1.5">
              {event.assignedPeople.slice(0, 4).map((id) => {
                const m = memberById[id];
                if (!m) return null;
                return (
                  <div key={id} className="ring-2 ring-slate-800 rounded-full">
                    <Avatar member={m} size={20} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
