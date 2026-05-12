"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { Idea, IdeaCategory, ItineraryItem, Member, VoteType } from "@/lib/types";
import { currency, cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { itinerary as itineraryData } from "@/lib/mock-data";
import { ExternalLink, MapPin, Clock, CalendarPlus, Check, X } from "lucide-react";

const voteOptions: { type: VoteType; label: string; emoji: string; gold?: boolean }[] = [
  { type: "must_do", label: "Must do", emoji: "⚡" },
  { type: "in", label: "I'm in", emoji: "👍" },
  { type: "maybe", label: "Maybe", emoji: "🤔" },
  { type: "not_for_me", label: "Not for me", emoji: "👎" },
  { type: "dad_approved", label: "Dad-Approved", emoji: "⭐", gold: true },
];

const categoryStyle: Record<IdeaCategory, { label: string; chip: string; emoji: string }> = {
  food:             { label: "Food",            chip: "bg-amber-100 text-amber-900 border-amber-200",      emoji: "🍽️" },
  hike:             { label: "Hike",            chip: "bg-emerald-100 text-emerald-800 border-emerald-200", emoji: "🥾" },
  museum:           { label: "Museum",          chip: "bg-indigo-100 text-indigo-800 border-indigo-200",   emoji: "🏛️" },
  scenic:           { label: "Scenic",          chip: "bg-sky-100 text-sky-800 border-sky-200",            emoji: "🏞️" },
  relaxing:         { label: "Relaxing",        chip: "bg-teal-100 text-teal-800 border-teal-200",         emoji: "🌿" },
  adventure:        { label: "Adventure",       chip: "bg-orange-100 text-orange-800 border-orange-200",   emoji: "🧗" },
  kid_friendly:     { label: "Kid-friendly",    chip: "bg-pink-100 text-pink-800 border-pink-200",         emoji: "🧒" },
  senior_friendly:  { label: "Senior-friendly", chip: "bg-purple-100 text-purple-800 border-purple-200",   emoji: "💜" },
  rainy_day:        { label: "Rainy-day",       chip: "bg-slate-100 text-slate-700 border-slate-200",      emoji: "☔" },
  concert:          { label: "Concert / Set",   chip: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200", emoji: "🎵" },
  other:            { label: "Other",           chip: "bg-gray-100 text-gray-700 border-gray-200",          emoji: "📌" },
};

const SLOTS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export function IdeaCard({
  idea,
  members,
  tripId,
  currentUserId = "m-me",
  onVoteChange,
}: {
  idea: Idea;
  members: Member[];
  tripId?: string;
  currentUserId?: string;
  onVoteChange?: (ideaId: string, votes: Idea["votes"]) => void;
}) {
  const [votes, setVotes] = useState(idea.votes);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [addedToItinerary, setAddedToItinerary] = useState(false);
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const myVote = votes.find((v) => v.memberId === currentUserId)?.type;

  const counts: Record<VoteType, number> = {
    must_do: 0, in: 0, maybe: 0, not_for_me: 0, dad_approved: 0,
  };
  votes.forEach((v) => counts[v.type]++);

  const submitter = memberById[idea.submittedBy];

  function setVote(type: VoteType) {
    setVotes((prev) => {
      const without = prev.filter((v) => v.memberId !== currentUserId);
      const next = myVote === type ? without : [...without, { memberId: currentUserId, type }];
      onVoteChange?.(idea.id, next);
      return next;
    });
  }

  function handleAddToItinerary(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const date = form.get("date") as string;
    const slot = form.get("slot") as ItineraryItem["slot"];
    if (!date || !tripId) return;

    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      date,
      slot,
      title: idea.title,
      details: idea.description,
      location: idea.location,
      cost: idea.estimatedCost,
      isConfirmed: false,
      isFlexible: true,
    };

    if (!itineraryData[tripId]) itineraryData[tripId] = [];
    itineraryData[tripId].push(newItem);

    setAddedToItinerary(true);
    setShowItineraryForm(false);
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold">{idea.title}</div>
            {idea.description && (
              <div className="text-sm text-muted mt-0.5">{idea.description}</div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <Badge className={categoryStyle[idea.category].chip} variant="default">
                <span>{categoryStyle[idea.category].emoji}</span> {categoryStyle[idea.category].label}
              </Badge>
              {idea.estimatedTime && (
                <span className="inline-flex items-center gap-1 text-orange-400 font-semibold drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]">
                  <Clock className="h-3.5 w-3.5" /> {idea.estimatedTime}
                </span>
              )}
              {idea.location && (
                <span className="inline-flex items-center gap-1 text-orange-400 font-semibold drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]">
                  <MapPin className="h-3.5 w-3.5" /> {idea.location}
                </span>
              )}
              {idea.estimatedCost != null && <span>{currency(idea.estimatedCost)}</span>}
              {idea.link && (
                <a className="inline-flex items-center gap-1 text-forest hover:underline" href={idea.link}>
                  <ExternalLink className="h-3.5 w-3.5" /> Link
                </a>
              )}
            </div>
          </div>
          {addedToItinerary ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
              <Check className="h-4 w-4" /> Added
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowItineraryForm(!showItineraryForm)}
            >
              {showItineraryForm
                ? <><X className="h-4 w-4" /> Cancel</>
                : <><CalendarPlus className="h-4 w-4" /> Add to Itinerary</>
              }
            </Button>
          )}
        </div>

        {showItineraryForm && (
          <form onSubmit={handleAddToItinerary} className="mt-3 p-3 rounded-xl border border-cyan-500/30 bg-slate-800/50">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
              <div>
                <label className="arcade-font text-[9px] tracking-widest text-slate-400 mb-1 block">Date</label>
                <Input name="date" type="date" required />
              </div>
              <div>
                <label className="arcade-font text-[9px] tracking-widest text-slate-400 mb-1 block">Slot</label>
                <Select name="slot">
                  {SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </div>
              <Button type="submit" size="sm">
                <CalendarPlus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </form>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {voteOptions.map((opt) => {
            const active = myVote === opt.type;
            const goldStyle = opt.gold;
            return (
              <button
                key={opt.type}
                onClick={() => setVote(opt.type)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? goldStyle
                      ? "bg-gradient-to-br from-gold-400 to-sunset-500 text-white border-gold-500 shadow-glow"
                      : "bg-gradient-to-br from-forest-500 to-forest-700 text-white border-forest-700 shadow-card"
                    : goldStyle
                      ? "bg-gold-50 text-gold-800 border-gold-300 hover:bg-gold-100"
                      : "bg-card text-bark-700 border-line hover:bg-parchment-100"
                )}
              >
                <span>{opt.emoji}</span> {opt.label}
                <span className={cn(
                  "ml-0.5 rounded-full px-1.5 text-[10px] font-bold",
                  active ? "bg-white/25" : goldStyle ? "bg-gold-200 text-gold-800" : "bg-parchment-200 text-bark-700"
                )}>
                  {counts[opt.type]}
                </span>
              </button>
            );
          })}
        </div>

        {submitter && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <Avatar member={submitter} size={20} />
            Suggested by {submitter.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
