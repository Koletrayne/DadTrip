import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AchievementState } from "@/lib/game";
import { Lock } from "lucide-react";

export function AchievementBadge({
  ach,
  href,
  size = "md",
}: {
  ach: AchievementState;
  href?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? 64 : 80;
  const pct = Math.round(ach.progress * 100);
  const Wrapper: React.ElementType = href ? Link : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn("group relative shrink-0 select-none focus:outline-none", href && "cursor-pointer")}
      style={{ width: dim + 24 }}
      title={`${ach.title} — ${ach.description}`}
    >
      <div className="flex flex-col items-center gap-1.5">
        <div
          className={cn(
            "relative inline-flex items-center justify-center rounded-2xl border-2 transition-all",
            ach.unlocked
              ? "bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 border-yellow-300/80 animate-arcade-pulse group-hover:scale-105"
              : "bg-slate-900/60 border-slate-600/60 grayscale opacity-70 group-hover:opacity-90"
          )}
          style={{ width: dim, height: dim }}
        >
          <span className={cn("text-3xl", !ach.unlocked && "saturate-0")}>{ach.icon}</span>
          {!ach.unlocked && (
            <span className="absolute bottom-1 right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-950/85 text-slate-300 border border-slate-700">
              <Lock className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
        <div className="text-center w-full">
          <div className="text-[10px] font-extrabold leading-tight text-white truncate uppercase tracking-wider">
            {ach.title}
          </div>
          <div className={cn(
            "text-[10px] font-bold",
            ach.unlocked ? "text-yellow-300" : "text-slate-400"
          )}>
            {ach.unlocked ? `+${ach.xpReward} XP` : `${pct}%`}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
