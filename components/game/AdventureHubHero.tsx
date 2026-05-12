import Link from "next/link";
import { LevelBadge } from "./LevelBadge";
import { XPProgressBar } from "./XPProgressBar";
import type { LevelInfo, AchievementState } from "@/lib/game";
import type { Trip } from "@/lib/types";
import { cn, daysUntil, formatDateRange } from "@/lib/utils";
import { ArrowRight, MapPin, Plus, Sparkles, Target } from "lucide-react";

export function AdventureHubHero({
  greetingName = "Adventurer",
  level,
  totalXp,
  next,
  focusTrip,
}: {
  greetingName?: string;
  level: LevelInfo;
  totalXp: number;
  next: AchievementState | undefined;
  focusTrip: Trip | undefined;
}) {
  return (
    <section className="arcade-panel relative overflow-hidden p-5 md:p-8">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div aria-hidden className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-purple-500/35 blur-3xl" />
      <div aria-hidden className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl" />

      <svg
        aria-hidden
        viewBox="0 0 800 320"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <path
          d="M 70 250 C 200 220, 240 90, 380 110 S 580 240, 740 80"
          fill="none"
          stroke="rgba(34,211,238,0.55)"
          strokeWidth="2.5"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />
      </svg>

      <span className="absolute top-6 left-[8%] text-2xl select-none animate-twinkle" aria-hidden>🌲</span>
      <span className="absolute top-[28%] left-[26%] text-xl select-none animate-twinkle" style={{ animationDelay: "0.6s" }} aria-hidden>🗻</span>
      <span className="absolute bottom-[18%] left-[42%] text-2xl select-none" aria-hidden>🏕️</span>
      <span className="absolute top-[18%] right-[28%] text-xl select-none animate-twinkle" style={{ animationDelay: "1.1s" }} aria-hidden>🚗</span>
      <span className="absolute bottom-8 right-[8%] text-2xl select-none animate-twinkle" style={{ animationDelay: "0.3s" }} aria-hidden>⭐</span>

      <div className="relative grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col">
          <div className="inline-flex items-center gap-1.5 self-start arcade-badge px-2.5 py-1 text-[10px]">
            ⚡ ADVENTURE HUB
          </div>
          <h1 className="arcade-title mt-3 text-2xl md:text-4xl leading-tight animate-flicker">
            WELCOME BACK,<br className="hidden md:block" />
            <span className="text-cyan-300">{greetingName.toUpperCase()}</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Your next journey is waiting. Plan, vote, pack — every action earns XP.
          </p>

          <div className="mt-5 rounded-2xl border-2 border-cyan-400/45 bg-slate-950/60 backdrop-blur p-4 shadow-[0_0_18px_rgba(34,211,238,0.22)]">
            <div className="flex items-center gap-4 flex-wrap">
              <LevelBadge info={level} size="lg" />
              <div className="flex-1 min-w-[180px]">
                <XPProgressBar info={level} />
              </div>
              <div className="rounded-xl border-2 border-yellow-400/55 bg-yellow-400/10 px-3 py-2 text-center shadow-[0_0_12px_rgba(250,204,21,0.28)]">
                <div className="arcade-font text-[9px] tracking-wider text-yellow-300">TOTAL</div>
                <div className="font-extrabold text-white text-lg inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> {totalXp}
                </div>
              </div>
            </div>
          </div>

          {next && (
            <div className="mt-3 arcade-panel-strong p-3 flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 border-2 border-yellow-300/80 text-2xl shadow-[0_0_18px_rgba(250,204,21,0.55)]">
                {next.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="arcade-font text-[9px] tracking-wider text-yellow-300 inline-flex items-center gap-1">
                  <Target className="h-3 w-3" /> NEXT ACHIEVEMENT
                </div>
                <div className="font-extrabold text-white truncate uppercase tracking-wide text-sm">{next.title}</div>
                <div className="text-xs text-slate-300 truncate">{next.description}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="arcade-font text-[9px] tracking-wider text-slate-400">PROGRESS</div>
                <div className="text-sm font-extrabold text-white">{next.current}/{next.target}</div>
                <div className="text-[10px] text-yellow-300 font-extrabold uppercase tracking-wider">
                  +{next.xpReward} XP
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {focusTrip ? (
            <Link
              href={`/trips/${focusTrip.id}`}
              className="group block relative overflow-hidden rounded-2xl border-2 border-pink-400/70 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white shadow-[0_0_28px_rgba(244,114,182,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_0_38px_rgba(244,114,182,0.7)]"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div aria-hidden className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
              <div className="relative p-5 md:p-6">
                <div className="arcade-font text-[10px] tracking-wider text-white/90 inline-flex items-center gap-1">
                  ⚡ ACTIVE QUEST
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-2xl shadow-card border border-white/60">
                    {focusTrip.coverEmoji ?? "✈️"}
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-lg leading-tight truncate uppercase tracking-wide">
                      {focusTrip.title}
                    </div>
                    <div className="text-xs text-white/85 inline-flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {focusTrip.destination}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-black/20 backdrop-blur p-2.5 border border-white/15">
                    <div className="arcade-font text-[9px] tracking-wider text-white/80">DAYS LEFT</div>
                    <div className="text-2xl font-extrabold leading-none mt-0.5">
                      {Math.max(0, daysUntil(focusTrip.startDate))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/20 backdrop-blur p-2.5 border border-white/15">
                    <div className="arcade-font text-[9px] tracking-wider text-white/80">DATES</div>
                    <div className="text-sm font-extrabold leading-tight mt-0.5">
                      {formatDateRange(focusTrip.startDate, focusTrip.endDate)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white text-pink-700 px-4 py-2.5 font-extrabold text-xs shadow-card uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                  ▶ Continue Quest <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-6 text-center h-full flex flex-col items-center justify-center">
              <div className="text-4xl">🗺️</div>
              <div className="mt-2 font-extrabold text-white uppercase tracking-wider">No active quest</div>
              <p className="text-sm text-slate-300 mt-1 max-w-xs">
                Start your first adventure — a road trip, beach weekend, or just a campfire night.
              </p>
            </div>
          )}

          <Link
            href="/trips/new"
            className="mt-3 group flex items-center justify-center gap-1.5 rounded-2xl border-2 border-cyan-400/55 bg-slate-900/60 hover:bg-cyan-500/10 text-cyan-200 px-4 py-3 font-extrabold text-xs uppercase tracking-wider transition-all"
          >
            <Plus className="h-4 w-4" /> Start New Adventure
          </Link>
        </div>
      </div>
    </section>
  );
}
