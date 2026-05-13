import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarGroup } from "@/components/Avatar";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPProgressBar } from "@/components/game/XPProgressBar";
import { GameStatCard } from "@/components/game/GameStatCard";
import { AchievementCard } from "@/components/game/AchievementCard";
import { NextAchievementCard } from "@/components/game/NextAchievementCard";
import { getTripState } from "@/lib/mock-data";
import { loadTrip } from "@/lib/trip-loader";
import { computeAchievements, computeXp, levelFromXp, nextAchievement } from "@/lib/game";
import { currency, daysUntil, formatLongDate, formatTime } from "@/lib/utils";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Flame,
  ListChecks,
  Scroll,
  Sparkles,
  Sword,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

export default async function TripOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await loadTrip(id);
  if (!trip) notFound();

  const state = getTripState(id);
  const xp = computeXp(state).total;
  const level = levelFromXp(xp);
  const achievements = computeAchievements(state);
  const unlocked = achievements.filter((a) => a.unlocked);
  const next = nextAchievement(state);

  const going = state.members.filter((m) => m.rsvp === "going").length;
  const openTasks = state.tasks.filter((t) => t.status !== "done").length;
  const totalEstimate = state.budget.reduce((s, b) => s + b.estimatedCost, 0);

  const topIdeas = [...state.ideas]
    .sort((a, b) => {
      const score = (votes: typeof a.votes) =>
        votes.reduce(
          (n, v) =>
            n +
            (v.type === "must_do" ? 2 :
             v.type === "dad_approved" ? 3 :
             v.type === "in" ? 1 :
             v.type === "maybe" ? 0 : -1),
          0
        );
      return score(b.votes) - score(a.votes);
    })
    .slice(0, 3);

  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const currentQuest = [...state.tasks]
    .filter((t) => t.status !== "done")
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])[0];
  const currentQuestOwner = currentQuest?.assignedTo
    ? state.members.find((m) => m.id === currentQuest.assignedTo)
    : undefined;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = state.events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.startTime ?? "").localeCompare(b.startTime ?? ""))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* World map / hero */}
      <div className="arcade-panel relative overflow-hidden p-5 md:p-7">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.18) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div aria-hidden className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-pink-500/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-cyan-500/25 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="arcade-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
                <Compass className="h-3 w-3" /> TRIP QUEST
              </div>
              <h2 className="arcade-title mt-2 text-xl md:text-2xl">{trip.title}</h2>
              <p className="text-slate-300 text-sm mt-1.5 max-w-xl">{trip.description}</p>
            </div>
            <div className="text-center min-w-[120px]">
              <div className="text-4xl font-extrabold bg-gradient-to-br from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {Math.max(0, daysUntil(trip.startDate))}
              </div>
              <div className="arcade-font text-[9px] text-slate-400 tracking-wider mt-1">
                DAYS TO EMBARK
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4 items-center">
            <LevelBadge info={level} size="lg" />
            <XPProgressBar info={level} />
          </div>
        </div>
      </div>

      {/* Game stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <GameStatCard tone="green"  icon={<Users className="h-4 w-4" />}      label="Party"        value={`${going}/${state.members.length}`} hint="going / invited" />
        <GameStatCard tone="orange" icon={<Scroll className="h-4 w-4" />}     label="Open Quests"  value={String(openTasks)} hint={`${state.tasks.length} total`} />
        <GameStatCard tone="yellow" icon={<Trophy className="h-4 w-4" />}     label="Achievements" value={`${unlocked.length}/${achievements.length}`} hint={`${unlocked.reduce((n, a) => n + a.xpReward, 0)} bonus XP`} />
        <GameStatCard tone="purple" icon={<Wallet className="h-4 w-4" />}     label="Treasury"     value={currency(totalEstimate)} hint={`${currency(totalEstimate / Math.max(1, state.members.length))} / hero`} />
      </div>

      {/* Current quest + Next achievement */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="arcade-panel-strong p-5 md:p-6">
          <div className="arcade-font text-[10px] tracking-wider text-orange-300 inline-flex items-center gap-1.5">
            <Sword className="h-3.5 w-3.5" /> CURRENT QUEST
          </div>
          {currentQuest ? (
            <div className="mt-2">
              <div className="font-extrabold text-white text-lg uppercase tracking-wide">{currentQuest.title}</div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <Badge variant="warning" className="capitalize">{currentQuest.priority} priority</Badge>
                {currentQuest.dueDate && <span className="text-slate-300">Due {currentQuest.dueDate}</span>}
                <span className="font-extrabold text-yellow-300 inline-flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> +{currentQuest.priority === "high" ? 30 : currentQuest.priority === "medium" ? 20 : 10} XP
                </span>
              </div>
              {currentQuestOwner && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 px-2.5 py-1.5">
                  <Avatar member={currentQuestOwner} size={24} />
                  <div className="text-xs">
                    <div className="font-extrabold text-white uppercase tracking-wide">{currentQuestOwner.name}</div>
                    {currentQuestOwner.partyRole && (
                      <div className="text-[10px] text-cyan-300">{currentQuestOwner.partyRole}</div>
                    )}
                  </div>
                </div>
              )}
              <Link
                href={`/trips/${id}/tasks`}
                className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-cyan-300 hover:text-cyan-100"
              >
                Open quest log <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-2 text-slate-300">
              No active quests.{" "}
              <Link href={`/trips/${id}/tasks`} className="text-cyan-300 underline">
                Add one?
              </Link>
            </div>
          )}
        </div>

        <NextAchievementCard ach={next} href={`/trips/${id}/achievements`} />
      </div>

      {/* Achievements preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
            <Trophy className="h-5 w-5 text-yellow-300" /> Unlocked Achievements
          </CardTitle>
          <Link href={`/trips/${id}/achievements`} className="text-xs text-cyan-300 hover:text-cyan-100 font-extrabold uppercase tracking-wider">
            See all
          </Link>
        </CardHeader>
        <CardContent>
          {unlocked.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-6 text-center text-slate-300">
              No achievements yet. Plan a quest, invite party members, vote on an idea — each action earns XP.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unlocked.slice(0, 3).map((a) => (
                <AchievementCard key={a.id} ach={a} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top voted ideas + Upcoming events */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
              <Flame className="h-5 w-5 text-orange-300" /> Top voted ideas
            </CardTitle>
            <Link href={`/trips/${id}/ideas`} className="text-xs text-cyan-300 hover:text-cyan-100 font-extrabold uppercase tracking-wider">
              See all
            </Link>
          </CardHeader>
          <CardContent>
            {topIdeas.length === 0 ? (
              <div className="text-slate-300 text-sm">No ideas yet.</div>
            ) : (
              <ul className="space-y-3">
                {topIdeas.map((idea) => {
                  const must = idea.votes.filter((v) => v.type === "must_do").length;
                  const dad = idea.votes.filter((v) => v.type === "dad_approved").length;
                  const in_ = idea.votes.filter((v) => v.type === "in").length;
                  return (
                    <li key={idea.id} className="rounded-xl border border-cyan-500/25 bg-slate-900/60 p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-extrabold text-white uppercase tracking-wide text-sm">{idea.title}</div>
                          <div className="text-xs text-slate-300 mt-0.5">{idea.description}</div>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {dad > 0 && <Badge variant="warning">⭐ Dad-Approved</Badge>}
                          <Badge variant="sunset">⚡ {must}</Badge>
                          <Badge variant="success">👍 {in_}</Badge>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
              <CalendarDays className="h-5 w-5 text-cyan-300" /> Upcoming on the calendar
            </CardTitle>
            <Link href={`/trips/${id}/calendar`} className="text-xs text-cyan-300 hover:text-cyan-100 font-extrabold uppercase tracking-wider">
              Open calendar
            </Link>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <div className="text-slate-300 text-sm">No events yet.</div>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((e) => (
                  <li key={e.id} className="rounded-xl border border-cyan-500/25 bg-slate-900/60 p-3.5">
                    <div className="arcade-font text-[9px] tracking-wider text-cyan-300">
                      {formatLongDate(e.date).toUpperCase()}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <div className="font-extrabold text-white uppercase tracking-wide text-sm">{e.title}</div>
                      <div className="text-xs text-slate-400">{formatTime(e.startTime)}</div>
                    </div>
                    {e.location && <div className="text-xs text-slate-400 mt-0.5">{e.location}</div>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Party status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 uppercase tracking-wide">
            <Users className="h-5 w-5 text-pink-300" /> Party Status
          </CardTitle>
          <Link href={`/trips/${id}/people`} className="text-xs text-cyan-300 hover:text-cyan-100 font-extrabold uppercase tracking-wider">
            Manage party
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <AvatarGroup members={state.members} max={8} />
            <div className="text-sm text-slate-300">
              {going} ready · {state.members.length} invited
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {state.members.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-cyan-500/25 bg-slate-900/60 p-3 flex items-center gap-3"
              >
                <Avatar member={m} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-white uppercase tracking-wide">{m.name}</div>
                  <div className="text-xs text-slate-400 truncate">{m.partyRole ?? m.role}</div>
                </div>
                <Badge
                  variant={
                    m.rsvp === "going" ? "success" :
                    m.rsvp === "maybe" ? "warning" :
                    m.rsvp === "not_going" ? "danger" :
                    "neutral"
                  }
                >
                  {m.rsvp === "going" ? "Going" : m.rsvp === "maybe" ? "Maybe" : m.rsvp === "not_going" ? "No" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
