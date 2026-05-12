import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TripState } from "@/lib/game";
import { computeAchievements } from "@/lib/game";
import { ArrowRight, Compass, Scroll } from "lucide-react";

export type Suggestion = {
  icon: string;
  text: string;
  href: string;
  reward?: string;
};

export function suggestionsForTrip(tripId: string, state: TripState): Suggestion[] {
  const out: Suggestion[] = [];
  const today = new Date().toISOString().slice(0, 10);

  const locked = computeAchievements(state)
    .filter((a) => !a.unlocked)
    .sort((a, b) => b.progress - a.progress);

  for (const a of locked.slice(0, 2)) {
    const remaining = Math.max(1, a.target - a.current);
    const hrefByAchievement: Record<string, string> = {
      "first-quest-created":  `/trips/${tripId}/tasks`,
      "party-assembled":      `/trips/${tripId}/people`,
      "route-master":         `/trips/${tripId}/calendar`,
      "feast-planner":        `/trips/${tripId}/calendar`,
      "trailblazer":          `/trips/${tripId}/calendar`,
      "budget-guardian":      `/trips/${tripId}/budget`,
      "pack-mule":            `/trips/${tripId}/packing`,
      "memory-keeper":        `/trips/${tripId}/memories`,
      "dads-favorite":        `/trips/${tripId}/ideas`,
      "legendary-trip":       `/trips/${tripId}`,
    };
    out.push({
      icon: a.icon,
      text:
        a.target === 1
          ? `${a.title} — ${a.description}`
          : `${remaining} more to unlock ${a.title}`,
      href: hrefByAchievement[a.id] ?? `/trips/${tripId}`,
      reward: `+${a.xpReward} XP`,
    });
  }

  const overdue = state.tasks.filter(
    (t) => t.status !== "done" && t.dueDate && t.dueDate < today
  );
  if (overdue.length > 0) {
    out.push({
      icon: "⚠️",
      text: `Clear ${overdue.length} overdue quest${overdue.length === 1 ? "" : "s"}`,
      href: `/trips/${tripId}/tasks`,
    });
  }

  const pendingRsvps = state.members.filter((m) => m.rsvp === "no_response").length;
  if (pendingRsvps > 0) {
    out.push({
      icon: "📜",
      text: `Confirm ${pendingRsvps} party RSVP${pendingRsvps === 1 ? "" : "s"}`,
      href: `/trips/${tripId}/people`,
    });
  }

  const unvoted = state.ideas.filter(
    (i) => !i.votes.some((v) => v.memberId === "m-me")
  );
  if (unvoted.length > 0) {
    out.push({
      icon: "🗳️",
      text: `Vote on ${unvoted.length} idea${unvoted.length === 1 ? "" : "s"}`,
      href: `/trips/${tripId}/ideas`,
      reward: `+${unvoted.length * 5} XP`,
    });
  }

  const seen = new Set<string>();
  return out
    .filter((s) => {
      if (seen.has(s.text)) return false;
      seen.add(s.text);
      return true;
    })
    .slice(0, 5);
}

export function QuestLogPanel({
  suggestions,
  className,
  title = "Your Next Moves",
}: {
  suggestions: Suggestion[];
  className?: string;
  title?: string;
}) {
  return (
    <div className={cn("arcade-panel p-5 md:p-6", className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 border border-white/30 shadow-[0_0_18px_rgba(168,85,247,0.55)]">
          <Compass className="h-4 w-4 text-white" />
        </span>
        <div>
          <div className="arcade-font text-[10px] tracking-wider text-cyan-300">QUEST LOG</div>
          <div className="font-extrabold text-white uppercase tracking-wide text-sm">{title}</div>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 p-5 text-center">
          <div className="text-2xl mb-1">🌟</div>
          <div className="font-extrabold text-white uppercase tracking-wider text-sm">All quests in hand.</div>
          <p className="text-xs mt-1 text-slate-400">Time to embark.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i}>
              <Link
                href={s.href}
                className="group flex items-center gap-3 rounded-xl border-2 border-cyan-500/25 bg-slate-900/60 hover:bg-slate-900/80 hover:border-cyan-400/60 transition-all px-3 py-2.5"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 border border-cyan-500/30 text-lg">
                  {s.icon}
                </span>
                <span className="flex-1 min-w-0 text-sm text-slate-200">{s.text}</span>
                {s.reward && (
                  <span className="inline-flex items-center rounded-full border border-yellow-400/55 bg-yellow-400/15 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-yellow-200">
                    {s.reward}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-1.5 arcade-font text-[9px] tracking-wider text-slate-400">
        <Scroll className="h-3 w-3" /> EACH MOVE EARNS XP
      </div>
    </div>
  );
}
