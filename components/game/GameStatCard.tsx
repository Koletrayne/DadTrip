import { cn } from "@/lib/utils";

export function GameStatCard({
  icon,
  label,
  value,
  hint,
  tone = "cyan",
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "cyan" | "purple" | "pink" | "yellow" | "green" | "orange";
  className?: string;
}) {
  const tones: Record<string, string> = {
    cyan:   "border-cyan-400/45 shadow-[0_0_18px_rgba(34,211,238,0.22)]",
    purple: "border-purple-400/50 shadow-[0_0_18px_rgba(168,85,247,0.30)]",
    pink:   "border-pink-400/50 shadow-[0_0_18px_rgba(244,114,182,0.30)]",
    yellow: "border-yellow-400/55 shadow-[0_0_18px_rgba(250,204,21,0.30)]",
    green:  "border-emerald-400/50 shadow-[0_0_18px_rgba(74,222,128,0.30)]",
    orange: "border-orange-400/50 shadow-[0_0_18px_rgba(251,146,60,0.30)]",
  };
  const iconTones: Record<string, string> = {
    cyan:   "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
    purple: "bg-purple-500/15 text-purple-200 border-purple-400/40",
    pink:   "bg-pink-500/15 text-pink-200 border-pink-400/40",
    yellow: "bg-yellow-500/15 text-yellow-200 border-yellow-400/45",
    green:  "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
    orange: "bg-orange-500/15 text-orange-200 border-orange-400/40",
  };
  return (
    <div
      className={cn(
        "rounded-2xl border-2 bg-slate-900/70 backdrop-blur p-4",
        tones[tone],
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl border",
            iconTones[tone]
          )}
        >
          {icon}
        </span>
        <div className="arcade-font text-[10px] tracking-wider text-slate-300">
          {label.toUpperCase()}
        </div>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-white leading-none">{value}</div>
      {hint && <div className="text-[11px] text-slate-400 mt-1.5">{hint}</div>}
    </div>
  );
}
