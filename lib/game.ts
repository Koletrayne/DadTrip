import type {
  BudgetItem,
  CalendarEvent,
  Idea,
  Member,
  Memory,
  PackingItem,
  Task,
} from "./types";

// ---------------------------------------------------------------------------
// XP awards
// ---------------------------------------------------------------------------
export const XP = {
  ADD_IDEA: 10,
  VOTE: 5,
  ADD_EVENT: 15,
  COMPLETE_TASK: 20,
  ADD_BUDGET: 10,
  PACK_ITEM: 5,
  ADD_MEMORY: 25,
} as const;

export const QUEST_XP_BY_PRIORITY: Record<Task["priority"], number> = {
  low: 10,
  medium: 20,
  high: 30,
};

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------
export type Level = {
  level: number;
  name: string;
  threshold: number;
  emoji: string;
};

export const LEVELS: Level[] = [
  { level: 1, name: "Daydreamer",        threshold: 0,    emoji: "💭" },
  { level: 2, name: "Weekend Wanderer",  threshold: 100,  emoji: "🥾" },
  { level: 3, name: "Road Trip Rookie",  threshold: 250,  emoji: "🚗" },
  { level: 4, name: "Trail Scout",       threshold: 450,  emoji: "🧭" },
  { level: 5, name: "Route Master",      threshold: 700,  emoji: "🗺️" },
  { level: 6, name: "Adventure Captain", threshold: 1000, emoji: "🎖️" },
  { level: 7, name: "Legendary Planner", threshold: 1500, emoji: "🏆" },
];

export type LevelInfo = {
  level: number;
  name: string;
  emoji: string;
  threshold: number;
  nextThreshold?: number;
  nextName?: string;
  xpIntoLevel: number;
  xpForLevel: number; // can be Infinity at max
  progress: number; // 0..1
  totalXp: number;
};

export function levelFromXp(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const L of LEVELS) if (xp >= L.threshold) current = L;
  const idx = LEVELS.indexOf(current);
  const next = LEVELS[idx + 1];
  const xpIntoLevel = xp - current.threshold;
  const xpForLevel = next ? next.threshold - current.threshold : Infinity;
  const progress = next ? Math.min(1, xpIntoLevel / xpForLevel) : 1;
  return {
    level: current.level,
    name: current.name,
    emoji: current.emoji,
    threshold: current.threshold,
    nextThreshold: next?.threshold,
    nextName: next?.name,
    xpIntoLevel,
    xpForLevel,
    progress,
    totalXp: xp,
  };
}

// ---------------------------------------------------------------------------
// Trip state shape
// ---------------------------------------------------------------------------
export type TripState = {
  members: Member[];
  ideas: Idea[];
  events: CalendarEvent[];
  tasks: Task[];
  budget: BudgetItem[];
  packing: PackingItem[];
  memories: Memory[];
};

export function computeXp(s: TripState): {
  total: number;
  breakdown: { label: string; xp: number; count: number }[];
} {
  const ideaVotes = s.ideas.reduce((n, i) => n + i.votes.length, 0);
  const completedTasks = s.tasks.filter((t) => t.status === "done").length;
  const packed = s.packing.filter((p) => p.isPacked).length;

  const breakdown = [
    { label: "Ideas added",      xp: s.ideas.length * XP.ADD_IDEA,    count: s.ideas.length },
    { label: "Idea votes",       xp: ideaVotes * XP.VOTE,             count: ideaVotes },
    { label: "Calendar events",  xp: s.events.length * XP.ADD_EVENT,  count: s.events.length },
    { label: "Quests completed", xp: completedTasks * XP.COMPLETE_TASK, count: completedTasks },
    { label: "Budget items",     xp: s.budget.length * XP.ADD_BUDGET, count: s.budget.length },
    { label: "Items packed",     xp: packed * XP.PACK_ITEM,           count: packed },
    { label: "Memories logged",  xp: s.memories.length * XP.ADD_MEMORY, count: s.memories.length },
  ];

  return { total: breakdown.reduce((n, b) => n + b.xp, 0), breakdown };
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  measure: (s: TripState) => { current: number; target: number };
};

export type AchievementState = AchievementDef & {
  current: number;
  target: number;
  progress: number;
  unlocked: boolean;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-quest-created",
    title: "First Quest Created",
    description: "Create your very first quest. Every adventure starts with a list.",
    icon: "📜",
    xpReward: 25,
    measure: (s) => ({ current: Math.min(s.tasks.length, 1), target: 1 }),
  },
  {
    id: "party-assembled",
    title: "Party Assembled",
    description: "Invite at least 3 family members to the party.",
    icon: "🛡️",
    xpReward: 50,
    measure: (s) => ({ current: Math.min(s.members.length, 3), target: 3 }),
  },
  {
    id: "route-master",
    title: "Route Master",
    description: "Map out at least 5 events on the calendar.",
    icon: "🗺️",
    xpReward: 75,
    measure: (s) => ({ current: Math.min(s.events.length, 5), target: 5 }),
  },
  {
    id: "feast-planner",
    title: "Feast Planner",
    description: "Plan a meal — no adventure runs on snacks alone.",
    icon: "🍽️",
    xpReward: 30,
    measure: (s) => {
      const meals = s.events.filter((e) => e.category === "meal").length;
      return { current: Math.min(meals, 1), target: 1 };
    },
  },
  {
    id: "trailblazer",
    title: "Trailblazer",
    description: "Add a hike or outdoor activity to the calendar.",
    icon: "🥾",
    xpReward: 30,
    measure: (s) => {
      const outdoor = s.events.filter((e) => e.category === "activity").length;
      return { current: Math.min(outdoor, 1), target: 1 };
    },
  },
  {
    id: "budget-guardian",
    title: "Budget Guardian",
    description: "Track at least one budget item — no surprises at the till.",
    icon: "💰",
    xpReward: 30,
    measure: (s) => ({ current: Math.min(s.budget.length, 1), target: 1 }),
  },
  {
    id: "pack-mule",
    title: "Pack Mule",
    description: "Pack 10 items. Forgotten chargers, beware.",
    icon: "🎒",
    xpReward: 50,
    measure: (s) => {
      const packed = s.packing.filter((p) => p.isPacked).length;
      return { current: Math.min(packed, 10), target: 10 };
    },
  },
  {
    id: "memory-keeper",
    title: "Memory Keeper",
    description: "Record your first memory in the Adventure Log.",
    icon: "📷",
    xpReward: 50,
    measure: (s) => ({ current: Math.min(s.memories.length, 1), target: 1 }),
  },
  {
    id: "dads-favorite",
    title: "Dad’s Favorite",
    description: "Get an idea Dad-Approved. The seal of paternal endorsement.",
    icon: "⭐",
    xpReward: 40,
    measure: (s) => {
      const has = s.ideas.some((i) => i.votes.some((v) => v.type === "dad_approved"));
      return { current: has ? 1 : 0, target: 1 };
    },
  },
  {
    id: "legendary-trip",
    title: "Legendary Trip",
    description: "Plan all major sections — events, quests, budget, packing, memory, party.",
    icon: "🏆",
    xpReward: 200,
    measure: (s) => {
      const checks = [
        s.events.length > 0,
        s.tasks.length > 0,
        s.budget.length > 0,
        s.packing.length > 0,
        s.memories.length > 0,
        s.members.length >= 3,
      ];
      const done = checks.filter(Boolean).length;
      return { current: done, target: checks.length };
    },
  },
];

export function computeAchievements(s: TripState): AchievementState[] {
  return ACHIEVEMENTS.map((a) => {
    const { current, target } = a.measure(s);
    return {
      ...a,
      current,
      target,
      progress: target === 0 ? 0 : Math.min(1, current / target),
      unlocked: current >= target,
    };
  });
}

// Suggested "Next Achievement" — the closest-to-done locked achievement.
export function nextAchievement(s: TripState): AchievementState | undefined {
  const all = computeAchievements(s);
  return all
    .filter((a) => !a.unlocked)
    .sort((a, b) => b.progress - a.progress)[0];
}
