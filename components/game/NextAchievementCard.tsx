import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AchievementState } from "@/lib/game";
import { ArrowRight, Target } from "lucide-react";

export function NextAchievementCard({
  ach,
  href,
  className,
}: {
  ach: AchievementState | undefined;
  href?: string;
  className?: string;
}) {
  if (!ach) {
    return (
      <div className={cn("arcade-panel-strong p-5", className)}>
        <div className="arcade-font text-[10px] tracking-wider text-yellow-300 flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" /> NEXT QUEST GOAL
        </div>
        <div className="mt-2 font-extrabold text-white text-lg">All achievements unlocked! 🏆</div>
        <p className="text-sm text-slate-300 mt-1">
          You&apos;re a Legendary Planner. Time to actually go on the trip.
        </p>
      </div>
    );
  }
  const pct = Math.round(ach.progress * 100);
  return (
    <div className={cn("arcade-panel-strong p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="arcade-font text-[10px] tracking-wider text-yellow-300 inline-flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" /> NEXT ACHIEVEMENT
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-300">
          +{ach.xpReward} XP
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 border-2 border-yellow-300/80 text-2xl shadow-[0_0_18px_rgba(250,204,21,0.55)]">
          {ach.icon}
        </span>
        <div className="min-w-0">
          <div className="font-extrabold text-white truncate uppercase tracking-wide">{ach.title}</div>
          <div className="text-xs text-slate-300">{ach.description}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
          <span className="text-slate-300">{ach.current}/{ach.target}</span>
          <span className="text-slate-400">{pct}%</span>
        </div>
        <div className="h-2 arcade-xp-track">
          <div className="arcade-xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-cyan-200 hover:text-cyan-100"
        >
          View achievements <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
