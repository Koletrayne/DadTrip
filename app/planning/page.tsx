"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  Shuffle,
  MapPin,
  Plane,
  Compass,
  PiggyBank,
  Calendar,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { HOME_HUBS, tripIdeas, type HomeHub, type TripIdeaSeed } from "@/lib/trip-ideas";
import { cn, currency } from "@/lib/utils";

const accentBg: Record<TripIdeaSeed["accent"], string> = {
  sunset:  "bg-gradient-to-br from-sunset-200 via-sunset-100 to-amber-100",
  amber:   "bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-100",
  emerald: "bg-gradient-to-br from-emerald-200 via-teal-100 to-sky-100",
  sky:     "bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-100",
  purple:  "bg-gradient-to-br from-purple-200 via-violet-100 to-pink-100",
  pink:    "bg-gradient-to-br from-pink-200 via-rose-100 to-orange-100",
  teal:    "bg-gradient-to-br from-teal-200 via-emerald-100 to-yellow-100",
  rose:    "bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100",
};

const accentBorder: Record<TripIdeaSeed["accent"], string> = {
  sunset: "border-sunset-200",
  amber: "border-amber-200",
  emerald: "border-emerald-200",
  sky: "border-sky-200",
  purple: "border-purple-200",
  pink: "border-pink-200",
  teal: "border-teal-200",
  rose: "border-rose-200",
};

export default function PlanningPage() {
  const [home, setHome] = useState<HomeHub>("Los Angeles, CA");
  const [budget, setBudget] = useState<number>(2000);
  const [maxDistance, setMaxDistance] = useState<number>(800);
  const [tripType, setTripType] = useState<string>("any");
  const [search, setSearch] = useState<string>("");
  const [generated, setGenerated] = useState<TripIdeaSeed | null>(null);
  const [generating, setGenerating] = useState(false);

  const allTypes = useMemo(() => {
    const set = new Set<string>(tripIdeas.map((i) => i.type));
    return Array.from(set).sort();
  }, []);

  const candidates = useMemo(() => {
    return tripIdeas.filter((i) => {
      const dist = i.distanceFromHub[home];
      if (dist > maxDistance) return false;
      if (i.estimatedCost > budget) return false;
      if (tripType !== "any" && i.type !== tripType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const blob =
          i.name + " " + i.region + " " + i.tags.join(" ") + " " + i.activities.join(" ");
        if (!blob.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [home, maxDistance, budget, tripType, search]);

  function generate() {
    if (!candidates.length) {
      setGenerated(null);
      return;
    }
    setGenerating(true);
    // Tiny delay for the dice-roll feel
    setTimeout(() => {
      // Don't pick the same one twice in a row when possible
      const pool = candidates.length > 1 && generated
        ? candidates.filter((c) => c.id !== generated.id)
        : candidates;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setGenerated(pick);
      setGenerating(false);
    }, 250);
  }

  return (
    <>
      <SiteHeader />
      <main className="container-page py-8 md:py-12 pb-20">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-sunset-200 bg-gradient-to-br from-sunset-100 via-amber-100 to-rose-100 p-5 md:p-7 shadow-card">
          <div aria-hidden className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-sunset-300/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="relative flex items-end justify-between flex-wrap gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sunset-200 bg-white/70 px-3 py-1 text-xs font-medium text-sunset-800">
                <Sparkles className="h-3.5 w-3.5 text-sunset-600" /> Planning
              </div>
              <h1 className="mt-2">Where to next? 🧭</h1>
              <p className="text-ink/70 mt-1">
                Browse trip ideas, or roll the dice with the random generator. Adjust budget and distance to taste.
              </p>
            </div>
            <Link href="/trips/new">
              <Button>
                <Plane className="h-4 w-4" /> Start a trip from scratch
              </Button>
            </Link>
          </div>
        </div>

        {/* Generator */}
        <div className="grid lg:grid-cols-5 gap-5 mt-6">
          {/* Controls */}
          <Card className="lg:col-span-2">
            <CardContent className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sunset-500 to-rose-500 text-white shadow-card">
                  <Wand2 className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-semibold">Random trip generator</div>
                  <div className="text-xs text-ink/60">Spin the dial — get a destination idea.</div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sunset-600" /> Starting from
                </Label>
                <Select value={home} onChange={(e) => setHome(e.target.value as HomeHub)}>
                  {HOME_HUBS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </Select>
                <p className="text-[11px] text-ink/60">Pick your home base. Distance is calculated from here.</p>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1.5">
                    <PiggyBank className="h-3.5 w-3.5 text-sunset-600" /> Max budget
                  </Label>
                  <span className="text-sm font-semibold text-sunset-700">
                    {currency(budget)}
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={5000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="accent-sunset-600 w-full"
                />
                <div className="flex justify-between text-[11px] text-ink/60">
                  <span>$200</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-sunset-600" /> Max distance
                  </Label>
                  <span className="text-sm font-semibold text-sunset-700">{maxDistance} mi</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={3500}
                  step={50}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="accent-sunset-600 w-full"
                />
                <div className="flex justify-between text-[11px] text-ink/60">
                  <span>50 mi</span>
                  <span>3,500 mi</span>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sunset-600" /> Trip type
                </Label>
                <Select value={tripType} onChange={(e) => setTripType(e.target.value)}>
                  <option value="any">Any type</option>
                  {allTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <Button onClick={generate} disabled={candidates.length === 0}>
                  <Shuffle className="h-4 w-4" /> Roll the dice
                </Button>
                <div className="text-xs text-ink/60 flex items-center">
                  {candidates.length} match{candidates.length === 1 ? "" : "es"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="lg:col-span-3 overflow-hidden">
            {generated ? (
              <div>
                <div className={cn("relative h-32 md:h-36", accentBg[generated.accent])}>
                  <div className="absolute -bottom-7 left-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-card border border-line">
                    {generated.emoji}
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-[11px] font-medium border border-white/60">
                    <Wand2 className={cn("h-3 w-3 text-sunset-600", generating && "animate-spin")} />
                    {generating ? "Rolling…" : "Generated for you"}
                  </div>
                </div>
                <CardContent className="p-5 md:p-6 pt-9">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wide text-ink/60 font-semibold">
                        {generated.region} · {generated.type}
                      </div>
                      <div className="text-2xl font-semibold mt-0.5">{generated.name}</div>
                      <p className="text-ink/70 mt-1.5">{generated.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <Stat
                      label="Distance"
                      value={`${generated.distanceFromHub[home]} mi`}
                      hint={`from ${home.split(",")[0]}`}
                      tone="sunset"
                    />
                    <Stat
                      label="Est. cost"
                      value={currency(generated.estimatedCost)}
                      hint="~4 people"
                      tone="amber"
                    />
                    <Stat
                      label="Best season"
                      value={generated.bestSeason}
                      tone="rose"
                    />
                  </div>

                  <div className="mt-5">
                    <div className="text-xs uppercase tracking-wide text-ink/60 font-semibold mb-2">
                      Things you might do
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {generated.activities.map((a) => (
                        <li
                          key={a}
                          className="rounded-lg border border-sunset-100 bg-sunset-50/50 px-3 py-2 text-sm flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-sunset-500" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {generated.tags.map((t) => (
                      <Badge key={t} className="bg-sunset-100 text-sunset-800 border-sunset-200" variant="default">
                        {t}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button onClick={generate}>
                      <Shuffle className="h-4 w-4" /> Roll again
                    </Button>
                    <Link href="/trips/new">
                      <Button variant="outline">
                        Plan this trip <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            ) : (
              <CardContent className="p-10 text-center min-h-[300px] flex flex-col items-center justify-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sunset-100 to-amber-100 text-3xl mb-3">
                  🎲
                </div>
                <div className="font-semibold text-lg">Ready when you are.</div>
                <p className="text-ink/60 text-sm mt-1 max-w-xs">
                  Adjust the sliders and roll the dice. We’ll pick a trip that fits your budget and how far you’re willing to drive.
                </p>
                <Button className="mt-4" onClick={generate} disabled={candidates.length === 0}>
                  <Shuffle className="h-4 w-4" /> Roll the dice
                </Button>
                {candidates.length === 0 && (
                  <p className="text-xs text-rose-700 mt-3">
                    No ideas match those filters. Try widening the budget or distance.
                  </p>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Browse all */}
        <div className="mt-10">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2>Or browse the ideas</h2>
              <p className="text-ink/70 text-sm mt-1">
                {candidates.length} of {tripIdeas.length} match your filters.
              </p>
            </div>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <Input
                placeholder="Search ideas, tags, activities…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-72"
              />
            </div>
          </div>

          {candidates.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-ink/70">
                Nothing matches those filters. Try a bigger budget or distance.
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((idea) => (
                <IdeaSeedCard key={idea.id} idea={idea} home={home} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function IdeaSeedCard({ idea, home }: { idea: TripIdeaSeed; home: HomeHub }) {
  return (
    <Card className={cn("overflow-hidden hover:shadow-cardHover transition-shadow border", accentBorder[idea.accent])}>
      <div className={cn("relative h-20", accentBg[idea.accent])}>
        <div className="absolute -bottom-6 left-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-card border border-line">
          {idea.emoji}
        </div>
        <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/80 backdrop-blur px-2 py-0.5 text-[11px] font-medium border border-white/60">
          {idea.distanceFromHub[home]} mi
        </div>
      </div>
      <CardContent className="p-5 pt-8">
        <div className="text-[11px] uppercase tracking-wide text-ink/60 font-semibold">
          {idea.region} · {idea.type}
        </div>
        <div className="font-semibold mt-0.5">{idea.name}</div>
        <p className="text-sm text-ink/70 mt-1 line-clamp-2">{idea.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {idea.tags.slice(0, 3).map((t) => (
            <Badge key={t} className="bg-sunset-50 text-sunset-700 border-sunset-200" variant="default">
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="font-semibold text-sunset-700">{currency(idea.estimatedCost)}</div>
          <div className="text-xs text-ink/60">{idea.bestSeason}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: "sunset" | "amber" | "rose";
}) {
  const tones: Record<string, string> = {
    sunset: "bg-sunset-50 border-sunset-200 text-sunset-700",
    amber:  "bg-amber-50 border-amber-200 text-amber-700",
    rose:   "bg-rose-50 border-rose-200 text-rose-700",
  };
  return (
    <div className={cn("rounded-xl border p-3", tones[tone])}>
      <div className="text-[10px] uppercase tracking-wide font-semibold">{label}</div>
      <div className="text-base font-semibold text-ink mt-0.5">{value}</div>
      {hint && <div className="text-[10px] text-ink/60 mt-0.5">{hint}</div>}
    </div>
  );
}
