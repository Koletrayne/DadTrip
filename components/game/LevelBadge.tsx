import { cn } from "@/lib/utils";
import type { LevelInfo } from "@/lib/game";

export function LevelBadge({
  info,
  size = "md",
  className,
}: {
  info: LevelInfo;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sz =
    size === "lg"
      ? "h-14 w-14 text-lg"
      : size === "sm"
      ? "h-8 w-8 text-xs"
      : "h-11 w-11 text-sm";

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-extrabold text-white border-2 border-white/30",
          "bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-500",
          "shadow-[0_0_18px_rgba(168,85,247,0.7),0_0_36px_rgba(34,211,238,0.5)]",
          sz
        )}
        title={`Level ${info.level} · ${info.name}`}
      >
        <span className="leading-none">{info.emoji}</span>
        <span
          className={cn(
            "absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full bg-yellow-400 text-slate-900 text-[10px] font-extrabold ring-2 ring-slate-950 shadow-[0_0_12px_rgba(250,204,21,0.7)]",
            size === "sm" && "h-4 w-4 text-[9px]",
            size === "lg" && "h-6 w-6 text-xs",
            size === "md" && "h-5 w-5 text-[10px]"
          )}
        >
          {info.level}
        </span>
      </span>
      {size !== "sm" && (
        <div className="leading-tight">
          <div className="arcade-font text-[9px] tracking-wider text-cyan-300">
            LV {info.level}
          </div>
          <div className="font-extrabold uppercase tracking-wider text-white text-sm">
            {info.name}
          </div>
        </div>
      )}
    </div>
  );
}
