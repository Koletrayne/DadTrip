import { cn } from "@/lib/utils";
import type { AchievementState } from "@/lib/game";
import { Lock, Sparkles } from "lucide-react";

export function AchievementCard({
  ach,
  className,
}: {
  ach: AchievementState;
  className?: string;
}) {
  const pct = Math.round(ach.progress * 100);
  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 p-5 transition-all backdrop-blur",
        ach.unlocked
          ? "arcade-panel-strong"
          : "border-cyan-500/25 bg-slate-900/50 opacity-90",
        className
      )}
    >
      {ach.unlocked ? (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-yellow-400/60 bg-yellow-400/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.45)]">
          <Sparkles className="h-3 w-3" /> Unlocked
        </span>
      ) : (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          <Lock className="h-3 w-3" /> Locked
        </span>
      )}

      <div
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl border-2",
          ach.unlocked
            ? "bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 border-yellow-300/80 animate-arcade-pulse"
            : "bg-slate-800/80 border-slate-600 grayscale opacity-70"
        )}
      >
        <span aria-hidden>{ach.icon}</span>
      </div>

      <div className="mt-3 font-extrabold text-white leading-tight uppercase tracking-wide text-sm">
        {ach.title}
      </div>
      <p className="text-sm text-slate-300 mt-1">{ach.description}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
          <span className="text-slate-300">{ach.current}/{ach.target}</span>
          <span className="text-yellow-300">+{ach.xpReward} XP</span>
        </div>
        <div className="h-2 arcade-xp-track">
          <div
            className={cn(
              "arcade-xp-fill",
              !ach.unlocked && "opacity-80"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
