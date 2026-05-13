"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { IdeaCard } from "@/components/IdeaCard";
import { ideas as ideasData, members as membersData } from "@/lib/mock-data";
import { useTrip } from "../TripContext";
import type { Idea, IdeaCategory, VoteType } from "@/lib/types";
import { Plus, X, BarChart3, Lightbulb, Trophy, TrendingUp, ThumbsDown } from "lucide-react";

const CATEGORIES: { value: IdeaCategory; label: string }[] = [
  { value: "food", label: "Food" },
  { value: "hike", label: "Hike" },
  { value: "museum", label: "Museum" },
  { value: "scenic", label: "Scenic" },
  { value: "relaxing", label: "Relaxing" },
  { value: "adventure", label: "Adventure" },
  { value: "concert", label: "Concert / Set" },
  { value: "kid_friendly", label: "Kid-friendly" },
  { value: "senior_friendly", label: "Senior-friendly" },
  { value: "rainy_day", label: "Rainy day" },
  { value: "other", label: "Other" },
];

function loadIdeas(tripId: string): Idea[] {
  try {
    const stored = localStorage.getItem(`ideas-${tripId}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return ideasData[tripId] ?? [];
}

function saveIdeas(tripId: string, items: Idea[]) {
  try { localStorage.setItem(`ideas-${tripId}`, JSON.stringify(items)); } catch {}
}

function scoreIdea(votes: Idea["votes"]): number {
  return votes.reduce(
    (n, v) =>
      n + (v.type === "must_do" ? 2 : v.type === "in" ? 1 : v.type === "dad_approved" ? 3 : v.type === "maybe" ? 0 : -1),
    0
  );
}

function VotingBoard({ ideas }: { ideas: Idea[] }) {
  if (ideas.length === 0) return null;

  const ranked = [...ideas].sort((a, b) => scoreIdea(b.votes) - scoreIdea(a.votes));
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes.length, 0);
  const mostVoted = ranked[0];
  const mostControversial = [...ideas].sort((a, b) => {
    const aNeg = a.votes.filter((v) => v.type === "not_for_me").length;
    const bNeg = b.votes.filter((v) => v.type === "not_for_me").length;
    return bNeg - aNeg;
  })[0];
  const mustDos = ideas.filter((i) => i.votes.some((v) => v.type === "must_do"));

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-purple-400" />
        <h3 className="arcade-title text-sm text-purple-300">Voting Board</h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
          <div className="arcade-font text-[9px] tracking-widest text-cyan-400/70 mb-1">TOTAL IDEAS</div>
          <div className="arcade-title text-xl text-cyan-300">{ideas.length}</div>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3">
          <div className="arcade-font text-[9px] tracking-widest text-purple-400/70 mb-1">TOTAL VOTES</div>
          <div className="arcade-title text-xl text-purple-300">{totalVotes}</div>
        </div>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
          <div className="arcade-font text-[9px] tracking-widest text-yellow-400/70 mb-1">MUST-DO&apos;S</div>
          <div className="arcade-title text-xl text-yellow-300">{mustDos.length}</div>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="arcade-font text-[9px] tracking-widest text-emerald-400/70 mb-1">AVG SCORE</div>
          <div className="arcade-title text-xl text-emerald-300">
            {ideas.length > 0 ? (ideas.reduce((s, i) => s + scoreIdea(i.votes), 0) / ideas.length).toFixed(1) : "—"}
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-700/50">
          <span className="arcade-font text-[9px] tracking-widest text-slate-400">RANKINGS</span>
        </div>
        <div className="divide-y divide-slate-700/30">
          {ranked.map((idea, i) => {
            const score = scoreIdea(idea.votes);
            const voteCounts = {
              must_do: idea.votes.filter((v) => v.type === "must_do").length,
              in: idea.votes.filter((v) => v.type === "in").length,
              maybe: idea.votes.filter((v) => v.type === "maybe").length,
              not_for_me: idea.votes.filter((v) => v.type === "not_for_me").length,
              dad_approved: idea.votes.filter((v) => v.type === "dad_approved").length,
            };
            const maxScore = Math.max(1, scoreIdea(ranked[0].votes));
            const barWidth = Math.max(5, (score / maxScore) * 100);

            return (
              <div key={idea.id} className="px-4 py-3 flex items-center gap-3">
                <span className={`arcade-title text-sm w-6 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-500"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm text-slate-200 font-medium truncate">{idea.title}</span>
                    <span className="arcade-font text-[10px] tracking-wider text-cyan-400 whitespace-nowrap">
                      {score > 0 ? "+" : ""}{score} pts
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    {voteCounts.must_do > 0 && <span className="text-yellow-400">⚡{voteCounts.must_do}</span>}
                    {voteCounts.dad_approved > 0 && <span className="text-yellow-300">⭐{voteCounts.dad_approved}</span>}
                    {voteCounts.in > 0 && <span className="text-emerald-400">👍{voteCounts.in}</span>}
                    {voteCounts.maybe > 0 && <span className="text-slate-400">🤔{voteCounts.maybe}</span>}
                    {voteCounts.not_for_me > 0 && <span className="text-red-400">👎{voteCounts.not_for_me}</span>}
                    {idea.votes.length === 0 && <span className="text-slate-600">No votes yet</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      {ideas.length >= 2 && (
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {mostVoted && mostVoted.votes.length > 0 && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3 flex items-center gap-3">
              <Trophy className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="arcade-font text-[9px] tracking-widest text-yellow-400/70">TOP PICK</div>
                <div className="text-sm text-yellow-200 font-medium truncate">{mostVoted.title}</div>
              </div>
            </div>
          )}
          {mostControversial && mostControversial.votes.filter((v) => v.type === "not_for_me").length > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 flex items-center gap-3">
              <ThumbsDown className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div>
                <div className="arcade-font text-[9px] tracking-widest text-red-400/70">MOST DIVISIVE</div>
                <div className="text-sm text-red-200 font-medium truncate">{mostControversial.title}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function IdeasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip();
  const members = membersData[id] ?? [];

  const [ideas, setIdeas] = useState<Idea[]>(() => ideasData[id] ?? []);

  useEffect(() => { setIdeas(loadIdeas(id)); }, [id]);

  const persist = useCallback((next: Idea[]) => {
    setIdeas(next);
    saveIdeas(id, next);
  }, [id]);

  const [sort, setSort] = useState("most_votes");
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<IdeaCategory>("food");
  const [view, setView] = useState<"cards" | "board">("cards");

  const sorted = useMemo(() => {
    const arr = [...ideas];
    switch (sort) {
      case "most_votes":
        return arr.sort((a, b) => scoreIdea(b.votes) - scoreIdea(a.votes));
      case "cheapest":
        return arr.sort((a, b) => (a.estimatedCost ?? Infinity) - (b.estimatedCost ?? Infinity));
      case "shortest":
        return arr.sort((a, b) => (a.estimatedTime ?? "").localeCompare(b.estimatedTime ?? ""));
      case "senior":
        return arr.filter((i) => i.category === "senior_friendly" || i.category === "relaxing" || i.category === "scenic" || i.category === "food");
      case "kid":
        return arr.filter((i) => i.category === "kid_friendly" || i.category === "adventure" || i.category === "scenic");
      default:
        return arr;
    }
  }, [ideas, sort]);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string).trim();
    if (!title) return;

    const otherLabel = (form.get("otherCategory") as string)?.trim();
    const desc = (form.get("description") as string).trim();
    const fullDesc = category === "other" && otherLabel
      ? (desc ? `[${otherLabel}] ${desc}` : `[${otherLabel}]`)
      : desc || undefined;

    const date = form.get("date") as string;
    const time = form.get("time") as string;
    const estimatedTime = date
      ? (time ? `${date} ${time}` : date)
      : (time || undefined);

    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      title,
      description: fullDesc,
      category,
      estimatedCost: form.get("cost") ? Number(form.get("cost")) : undefined,
      estimatedTime,
      location: (form.get("location") as string).trim() || undefined,
      submittedBy: "m-me",
      votes: [],
    };

    persist([...ideas, newIdea]);
    setShowForm(false);
    setCategory("food");
  }

  function handleVoteChange(ideaId: string, votes: Idea["votes"]) {
    persist(ideas.map((i) => (i.id === ideaId ? { ...i, votes } : i)));
  }

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="arcade-title text-lg text-cyan-300">Ideas & Voting</h2>
          <p className="text-slate-400 text-sm mt-1">Suggest things. Vote. Promote favorites to the itinerary.</p>
        </div>
        <div className="flex items-center gap-2">
          {ideas.length > 0 && (
            <div className="flex rounded-lg border border-slate-700/50 overflow-hidden">
              <button
                onClick={() => setView("cards")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${view === "cards" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-500 hover:text-slate-300"}`}
              >
                <Lightbulb className="h-3.5 w-3.5 inline mr-1" />Ideas
              </button>
              <button
                onClick={() => setView("board")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${view === "board" ? "bg-purple-500/20 text-purple-300" : "text-slate-500 hover:text-slate-300"}`}
              >
                <BarChart3 className="h-3.5 w-3.5 inline mr-1" />Board
              </button>
            </div>
          )}
          {view === "cards" && (
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-44">
              <option value="most_votes">Most votes</option>
              <option value="cheapest">Cheapest</option>
              <option value="shortest">Shortest</option>
              <option value="senior">Senior-friendly</option>
              <option value="kid">Kid-friendly</option>
            </Select>
          )}
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add idea</>}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-5 border-cyan-500/30">
          <CardContent className="p-5">
            <h3 className="arcade-title text-sm text-cyan-300 mb-4">New Idea</h3>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Title</label>
                  <Input name="title" required placeholder="e.g. Sunset hike at Angel's Landing" />
                </div>
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Category</label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value as IdeaCategory)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </Select>
                  {category === "other" && (
                    <Input name="otherCategory" placeholder="Describe the category" className="mt-2" required />
                  )}
                </div>
              </div>
              <div>
                <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Description</label>
                <Textarea name="description" placeholder="Why is this a great idea?" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Date</label>
                  <Input name="date" type="date" />
                </div>
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Time</label>
                  <Input name="time" type="time" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Estimated cost ($)</label>
                  <Input name="cost" type="number" placeholder="0" />
                </div>
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Location</label>
                  <Input name="location" placeholder="e.g. Zion National Park" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit"><Plus className="h-4 w-4" /> Add idea</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {view === "board" && <VotingBoard ideas={ideas} />}

      {view === "cards" && (
        sorted.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-slate-500">
              No ideas yet. Be the first to suggest one.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sorted.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} members={members} tripId={id} onVoteChange={handleVoteChange} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
