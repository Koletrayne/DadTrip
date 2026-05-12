"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { Trip } from "@/lib/types";
import { updateTripAction } from "@/app/trips/[id]/actions";
import { Pencil, X } from "lucide-react";

const TRIP_TYPES = [
  "Road Trip",
  "National Park",
  "Beach",
  "City",
  "Camping",
  "Cabin",
  "Family Visit",
  "International",
  "Other",
];

const EMOJI_OPTIONS = ["🏞️", "🏖️", "🌲", "🏜️", "🏔️", "🚗", "🛶", "🏕️", "🍽️", "🎂", "✈️", "🎵", "🎪"];

const STATUS_OPTIONS: { value: Trip["status"]; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "planning", label: "Planning" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
];

export function EditTripButton({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" /> Edit
      </Button>
      {open && createPortal(
        <EditTripModal trip={trip} onClose={() => setOpen(false)} />,
        document.body
      )}
    </>
  );
}

function EditTripModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [emoji, setEmoji] = useState(trip.coverEmoji ?? "✈️");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const updates: Partial<Omit<Trip, "id">> = {
      title: (form.get("title") as string).trim(),
      destination: (form.get("destination") as string).trim(),
      startDate: form.get("startDate") as string,
      endDate: form.get("endDate") as string,
      tripType: form.get("tripType") as string,
      description: (form.get("description") as string).trim() || undefined,
      estimatedBudget: form.get("budget") ? Number(form.get("budget")) : undefined,
      coverEmoji: emoji,
      status: form.get("status") as Trip["status"],
    };

    startTransition(async () => {
      await updateTripAction(trip.id, updates);
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-cyan-500/40 bg-slate-900 shadow-[0_0_40px_rgba(34,211,238,0.15)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="arcade-title text-lg text-cyan-300">EDIT TRIP</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Trip name</Label>
            <Input name="title" required defaultValue={trip.title} />
          </div>

          <div className="grid gap-1.5">
            <Label>Destination</Label>
            <Input name="destination" required defaultValue={trip.destination} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Start date</Label>
              <Input name="startDate" type="date" required defaultValue={trip.startDate} />
            </div>
            <div className="grid gap-1.5">
              <Label>End date</Label>
              <Input name="endDate" type="date" required defaultValue={trip.endDate} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Trip type</Label>
              <Select name="tripType" defaultValue={trip.tripType}>
                {TRIP_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select name="status" defaultValue={trip.status}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea name="description" defaultValue={trip.description ?? ""} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Estimated budget</Label>
              <Input name="budget" type="number" defaultValue={trip.estimatedBudget ?? ""} placeholder="$" />
            </div>
            <div className="grid gap-1.5">
              <Label>Cover icon</Label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={
                      "h-9 w-9 text-lg rounded-lg border transition-all " +
                      (emoji === e
                        ? "bg-cyan-500/30 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                        : "bg-slate-800 border-slate-700 hover:border-cyan-500/50")
                    }
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
