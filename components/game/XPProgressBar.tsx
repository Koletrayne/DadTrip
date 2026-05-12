import { cn } from "@/lib/utils";
import type { LevelInfo } from "@/lib/game";

export function XPProgressBar({
  info,
  showLabel = true,
  className,
}: {
  info: LevelInfo;
  showLabel?: boolean;
  className?: string;
}) {
  const max = isFinite(info.xpForLevel);
  const pct = Math.round(info.progress * 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
          <span className="text-cyan-300">{info.totalXp} XP</span>
          <span className="text-slate-400">
            {max ? `${info.xpIntoLevel}/${info.xpForLevel} → ${info.nextName}` : "MAX LEVEL"}
          </span>
        </div>
      )}
      <div className="relative h-3 arcade-xp-track">
        <div className="arcade-xp-fill transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
