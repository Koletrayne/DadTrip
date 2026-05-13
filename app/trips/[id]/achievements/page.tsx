import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPProgressBar } from "@/components/game/XPProgressBar";
import { AchievementCard } from "@/components/game/AchievementCard";
import { getTripState } from "@/lib/mock-data";
import { loadTrip } from "@/lib/trip-loader";
import { computeAchievements, computeXp, levelFromXp } from "@/lib/game";
import { Sparkles, Trophy } from "lucide-react";

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await loadTrip(id);
  if (!trip) notFound();

  const state = getTripState(id);
  const xpResult = computeXp(state);
  const level = levelFromXp(xpResult.total);
  const all = computeAchievements(state);
  const unlocked = all.filter((a) => a.unlocked);
  const locked = all.filter((a) => !a.unlocked);
  const bonusXp = unlocked.reduce((n, a) => n + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Hero / Trophy banner */}
      <div className="arcade-panel-strong relative overflow-hidden p-5 md:p-7">
        <div aria-hidden className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-yellow-400/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-pink-500/30 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="arcade-badge-gold inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
                <Trophy className="h-3 w-3" /> ACHIEVEMENTS
              </div>
              <h1 className="arcade-title mt-2 text-xl md:text-2xl">HALL OF QUESTS</h1>
              <p className="text-slate-300 text-sm mt-1.5">
                Every action you take while planning earns XP. Hit milestones, unlock badges.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <LevelBadge info={level} size="lg" />
              <div className="text-center rounded-xl border-2 border-yellow-400/55 bg-slate-900/70 px-4 py-3 min-w-[120px] shadow-[0_0_14px_rgba(250,204,21,0.25)]">
                <div className="arcade-font text-[9px] tracking-wider text-yellow-300">UNLOCKED</div>
                <div className="font-extrabold text-2xl text-white">
                  {unlocked.length}
                  <span className="text-slate-400 text-base font-normal">/{all.length}</span>
                </div>
              </div>
              <div className="text-center rounded-xl border-2 border-yellow-400/55 bg-slate-900/70 px-4 py-3 min-w-[120px] shadow-[0_0_14px_rgba(250,204,21,0.25)]">
                <div className="arcade-font text-[9px] tracking-wider text-yellow-300">BONUS XP</div>
                <div className="font-extrabold text-2xl text-white inline-flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-300" /> {bonusXp}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <XPProgressBar info={level} />
          </div>
        </div>
      </div>

      {/* XP breakdown */}
      <Card>
        <CardContent className="p-5 md:p-6">
          <h3 className="mb-3 flex items-center gap-2 arcade-font text-xs tracking-wider text-yellow-300">
            <Sparkles className="h-5 w-5 text-yellow-300" /> XP EARNED THIS TRIP
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {xpResult.breakdown.map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3"
              >
                <div className="arcade-font text-[9px] uppercase tracking-wider text-slate-400">
                  {b.label}
                </div>
                <div className="mt-1 font-bold text-white">
                  +{b.xp} XP{" "}
                  <span className="text-slate-500 text-xs font-normal">
                    ({b.count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 arcade-font text-sm tracking-wider text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
            <Trophy className="h-5 w-5 text-yellow-300" /> UNLOCKED
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((a) => (
              <AchievementCard key={a.id} ach={a} />
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section>
          <h2 className="mb-3 arcade-font text-sm tracking-wider text-slate-400">STILL TO EARN</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map((a) => (
              <AchievementCard key={a.id} ach={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
