"use client";

import { cn, formatShortDate } from "@/lib/utils";
import type { Member, Task } from "@/lib/types";
import { Avatar } from "../Avatar";
import { Badge } from "../ui/badge";
import { CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";
import { QUEST_XP_BY_PRIORITY } from "@/lib/game";

const statusIcon = {
  not_started: Circle,
  in_progress: Clock,
  done: CheckCircle2,
} as const;

const priorityChip: Record<Task["priority"], string> = {
  low:    "bg-sky-soft/30 text-bark-700 border-sky-soft/60",
  medium: "bg-gold-100 text-gold-800 border-gold-300",
  high:   "bg-sunset-100 text-sunset-800 border-sunset-300",
};

const priorityLabel: Record<Task["priority"], string> = {
  low: "Side quest",
  medium: "Quest",
  high: "Main quest",
};

export function QuestCard({
  quest,
  owner,
  onToggleStatus,
}: {
  quest: Task;
  owner?: Member;
  onToggleStatus?: () => void;
}) {
  const Icon = statusIcon[quest.status];
  const isOverdue =
    quest.status !== "done" &&
    quest.dueDate &&
    quest.dueDate < new Date().toISOString().slice(0, 10);
  const xp = QUEST_XP_BY_PRIORITY[quest.priority];
  const done = quest.status === "done";

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card p-4 flex items-center gap-3 shadow-card transition-all",
        done && "opacity-75",
        quest.priority === "high" && !done && "border-sunset-300 ring-1 ring-sunset-200/60",
        quest.priority === "medium" && !done && "border-gold-200",
        quest.priority === "low" && !done && "border-line"
      )}
    >
      <button
        onClick={onToggleStatus}
        className={cn(
          "shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
          done
            ? "bg-gradient-to-br from-forest-400 to-forest-600 border-forest-600 text-white shadow-card"
            : quest.status === "in_progress"
            ? "bg-gold-100 border-gold-300 text-gold-700"
            : "bg-parchment-50 border-bark-200 text-bark-500 hover:bg-gold-50"
        )}
        title="Toggle quest status"
      >
        <Icon className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "font-medium text-bark-800",
              done && "line-through text-bark-500"
            )}
          >
            {quest.title}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              priorityChip[quest.priority]
            )}
          >
            {priorityLabel[quest.priority]}
          </span>
          {done && (
            <Badge className="bg-forest-100 text-forest-800 border-forest-200" variant="default">
              Cleared
            </Badge>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-bark-500">
          {quest.dueDate && (
            <span className={cn("inline-flex items-center gap-1", isOverdue && "text-sunset-700 font-semibold")}>
              <Clock className="h-3 w-3" />
              Due {formatShortDate(quest.dueDate)}{isOverdue ? " · overdue" : ""}
            </span>
          )}
          <span className="inline-flex items-center gap-1 font-bold text-gold-700">
            <Sparkles className="h-3 w-3" /> +{xp} XP
          </span>
        </div>
      </div>

      {owner && (
        <div className="flex items-center gap-2 shrink-0">
          <Avatar member={owner} size={32} />
          <div className="hidden sm:block">
            <div className="text-xs font-medium text-bark-700">{owner.name}</div>
            {owner.partyRole && (
              <div className="text-[10px] text-bark-500">{owner.partyRole}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
