"use client";

import { use, useState } from "react";
import { itinerary as itineraryData } from "@/lib/mock-data";
import { eachDay, formatLongDate, currency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrip } from "../TripContext";
import type { ItineraryItem } from "@/lib/types";
import { CheckCircle2, Clock, MapPin, Plus, Sun, Sunset, Moon, NotebookPen, X } from "lucide-react";

const slotMeta = {
  morning:   { label: "Morning",   icon: Sun,         bg: "bg-amber-500/10",   border: "border-amber-500/30",   accent: "text-amber-400",   chip: "bg-amber-500/20" },
  afternoon: { label: "Afternoon", icon: Sunset,      bg: "bg-orange-500/10",  border: "border-orange-500/30",  accent: "text-orange-400",  chip: "bg-orange-500/20" },
  evening:   { label: "Evening",   icon: Moon,        bg: "bg-indigo-500/10",  border: "border-indigo-500/30",  accent: "text-indigo-400",  chip: "bg-indigo-500/20" },
  notes:     { label: "Notes",     icon: NotebookPen, bg: "bg-slate-500/10",   border: "border-slate-500/30",   accent: "text-slate-400",   chip: "bg-slate-500/20" },
} as const;

type SlotKey = keyof typeof slotMeta;

const dayBands = [
  "bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-amber-500/20",
  "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20",
  "bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20",
  "bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-yellow-500/20",
  "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20",
];

function SlotAddForm({
  slot,
  date,
  onAdd,
  onCancel,
}: {
  slot: SlotKey;
  date: string;
  onAdd: (item: ItineraryItem) => void;
  onCancel: () => void;
}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string).trim();
    if (!title) return;

    onAdd({
      id: `itin-${Date.now()}`,
      date,
      slot,
      title,
      time: (form.get("time") as string) || undefined,
      details: (form.get("details") as string).trim() || undefined,
      location: (form.get("location") as string).trim() || undefined,
      cost: form.get("cost") ? Number(form.get("cost")) : undefined,
      isFlexible: true,
    });
  }

  const meta = slotMeta[slot];

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-slate-800/80 border border-cyan-500/30 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className={`arcade-font text-[9px] tracking-widest ${meta.accent}`}>
          ADD TO {meta.label.toUpperCase()}
        </span>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-300">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Input name="title" required placeholder="What's happening?" className="text-sm" />
        <Input name="time" type="time" className="text-sm w-[7.5rem]" />
      </div>
      <Input name="details" placeholder="Details (optional)" className="text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <Input name="location" placeholder="Location" className="text-sm" />
        <Input name="cost" type="number" placeholder="Cost ($)" className="text-sm" />
      </div>
      <Button type="submit" size="sm" className="w-full">
        <Plus className="h-3.5 w-3.5" /> Add
      </Button>
    </form>
  );
}

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip();
  const days = eachDay(trip.startDate, trip.endDate);
  const [items, setItems] = useState<ItineraryItem[]>(itineraryData[id] ?? []);
  const [addingSlot, setAddingSlot] = useState<{ date: string; slot: SlotKey } | null>(null);

  function handleAdd(item: ItineraryItem) {
    setItems((prev) => [...prev, item]);
    if (!itineraryData[id]) itineraryData[id] = [];
    itineraryData[id].push(item);
    setAddingSlot(null);
  }

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="arcade-title text-lg text-cyan-300">Itinerary</h2>
          <p className="text-slate-400 text-sm mt-1">A day-by-day plan everyone can read.</p>
        </div>
      </div>

      <div className="space-y-5">
        {days.map((d, i) => {
          const dayItems = items.filter((it) => it.date === d);
          return (
            <Card key={d} className="overflow-hidden">
              <div className={`${dayBands[i % dayBands.length]} px-5 md:px-6 py-3 border-b border-slate-700/50 flex items-baseline justify-between gap-3 flex-wrap`}>
                <div>
                  <div className="text-xs uppercase tracking-wide text-cyan-400/80 font-semibold arcade-font">Day {i + 1}</div>
                  <h3 className="mt-0.5 text-cyan-100">{formatLongDate(d)}</h3>
                </div>
              </div>
              <CardContent className="p-5 md:p-6 pt-5">
                <div className="grid md:grid-cols-2 gap-3">
                  {(["morning", "afternoon", "evening", "notes"] as const).map((slot) => {
                    const Slot = slotMeta[slot];
                    const Icon = Slot.icon;
                    const slotItems = dayItems
                      .filter((it) => it.slot === slot)
                      .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
                    const isAdding = addingSlot?.date === d && addingSlot?.slot === slot;
                    return (
                      <div key={slot} className={`rounded-xl border ${Slot.border} ${Slot.bg} p-3.5`}>
                        <div className={`flex items-center justify-between`}>
                          <div className={`flex items-center gap-2 text-sm font-semibold ${Slot.accent}`}>
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${Slot.chip}`}>
                              <Icon className={`h-4 w-4 ${Slot.accent}`} />
                            </span>
                            {Slot.label}
                          </div>
                          {!isAdding && (
                            <button
                              onClick={() => setAddingSlot({ date: d, slot })}
                              className={`text-[10px] font-bold uppercase tracking-wider ${Slot.accent} opacity-60 hover:opacity-100 transition-opacity`}
                            >
                              + Add
                            </button>
                          )}
                        </div>
                        <div className="mt-2 space-y-2">
                          {slotItems.length === 0 && !isAdding && (
                            <div className="text-xs text-slate-500">Nothing planned.</div>
                          )}
                          {slotItems.map((it) => (
                            <div key={it.id} className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-2.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {it.time && (
                                    <span className="inline-flex items-center gap-1 text-orange-400 font-semibold text-xs drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]">
                                      <Clock className="h-3 w-3" />
                                      {it.time}
                                    </span>
                                  )}
                                  <span className="font-medium text-sm text-slate-200">{it.title}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {it.isConfirmed && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Confirmed</Badge>}
                                  {it.isFlexible && <Badge variant="neutral">Flexible</Badge>}
                                </div>
                              </div>
                              {it.details && <div className="text-xs text-slate-400 mt-0.5">{it.details}</div>}
                              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                {it.location && (
                                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {it.location}</span>
                                )}
                                {it.cost != null && <span>{currency(it.cost)}</span>}
                              </div>
                            </div>
                          ))}
                          {isAdding && (
                            <SlotAddForm
                              slot={slot}
                              date={d}
                              onAdd={handleAdd}
                              onCancel={() => setAddingSlot(null)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
