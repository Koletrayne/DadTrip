import Link from "next/link";
import { trips, members, getTripState, itinerary as itineraryData } from "@/lib/mock-data";
import { computeAchievements, computeXp, levelFromXp, nextAchievement } from "@/lib/game";
import { CurrentQuestPanel } from "./CurrentQuestPanel";
import { MapDestinationCard, type MapStatus, type MapDestinationProps } from "./MapDestinationCard";
import { MapPath } from "./MapPath";
import { ArcadeButton } from "./ArcadeButton";
import { Plus } from "lucide-react";

type Section = {
  key: string;
  emoji: string;
  name: string;
  description: string;
  /** Path under /trips/[id] (e.g. "/calendar"); empty string = trip overview. */
  pathSuffix: string;
  /** Achievement id whose progress should highlight this destination as recommended. */
  matchAchievement?: string[];
  /** Grid position in 12x6 layout */
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
};

const SECTIONS: Section[] = [
  { key: "overview",     emoji: "🏠", name: "Adventure Hub",    description: "Mission overview & XP", pathSuffix: "",            col: 5,  row: 3, colSpan: 4, rowSpan: 2, matchAchievement: ["legendary-trip"] },
  { key: "itinerary",    emoji: "🧭", name: "Itinerary Road",   description: "The day-by-day journey",pathSuffix: "/itinerary",  col: 5,  row: 1, colSpan: 4, rowSpan: 2 },
  { key: "calendar",     emoji: "🗓️", name: "Calendar Castle",  description: "Plan each day of the quest", pathSuffix: "/calendar", col: 1,  row: 1, colSpan: 3, rowSpan: 2, matchAchievement: ["route-master","feast-planner","trailblazer"] },
  { key: "ideas",        emoji: "💡", name: "Idea Cave",        description: "Suggest & vote on activities", pathSuffix: "/ideas",   col: 9,  row: 1, colSpan: 3, rowSpan: 2, matchAchievement: ["dads-favorite"] },
  { key: "budget",       emoji: "💰", name: "Budget Bank",      description: "Track the trip treasury", pathSuffix: "/budget",     col: 1,  row: 3, colSpan: 3, rowSpan: 2, matchAchievement: ["budget-guardian"] },
  { key: "packing",      emoji: "🎒", name: "Packing Forest",   description: "Gear, snacks, supplies",  pathSuffix: "/packing",    col: 9,  row: 3, colSpan: 3, rowSpan: 2, matchAchievement: ["pack-mule"] },
  { key: "tasks",        emoji: "📜", name: "Quest Village",    description: "The list of things to do",pathSuffix: "/tasks",      col: 1,  row: 5, colSpan: 3, rowSpan: 2, matchAchievement: ["first-quest-created"] },
  { key: "people",       emoji: "👥", name: "Party Camp",       description: "Your traveling band",     pathSuffix: "/people",     col: 5,  row: 5, colSpan: 4, rowSpan: 2, matchAchievement: ["party-assembled"] },
  { key: "memories",     emoji: "📸", name: "Memory Lake",      description: "Photos & stories",        pathSuffix: "/memories",   col: 9,  row: 5, colSpan: 3, rowSpan: 2, matchAchievement: ["memory-keeper"] },
  { key: "achievements", emoji: "🏆", name: "Achievement Tower",description: "Earned badges & trophies",pathSuffix: "/achievements", col: 9, row: 0, colSpan: 0, rowSpan: 0 }, // overlaid separately
];

function deriveStatus(
  key: string,
  state: ReturnType<typeof getTripState> & { itinerary: { id: string }[] }
): { status: MapStatus; progress?: number } {
  switch (key) {
    case "calendar": {
      const n = state.events.length;
      return { status: n === 0 ? "new" : "in_progress", progress: Math.min(1, n / 8) };
    }
    case "itinerary": {
      const n = state.itinerary?.length ?? 0;
      return { status: n === 0 ? "new" : "in_progress", progress: Math.min(1, n / 12) };
    }
    case "tasks": {
      const total = state.tasks.length;
      const done = state.tasks.filter((t) => t.status === "done").length;
      if (total === 0) return { status: "new" };
      if (done === total) return { status: "complete", progress: 1 };
      return { status: "in_progress", progress: done / total };
    }
    case "ideas": {
      const n = state.ideas.length;
      return { status: n === 0 ? "new" : "in_progress", progress: Math.min(1, n / 8) };
    }
    case "people": {
      const n = state.members.length;
      return { status: n === 0 ? "new" : "in_progress", progress: Math.min(1, n / 6) };
    }
    case "budget": {
      const n = state.budget.length;
      return { status: n === 0 ? "new" : "in_progress", progress: Math.min(1, n / 6) };
    }
    case "packing": {
      const total = state.packing.length;
      const done = state.packing.filter((p) => p.isPacked).length;
      if (total === 0) return { status: "new" };
      if (done === total) return { status: "complete", progress: 1 };
      return { status: "in_progress", progress: done / total };
    }
    case "memories": {
      const n = state.memories.length;
      return { status: n === 0 ? "new" : "in_progress", progress: n > 0 ? 1 : 0 };
    }
    case "achievements": {
      const all = computeAchievements(state);
      const u = all.filter((a) => a.unlocked).length;
      if (u === all.length) return { status: "complete", progress: 1 };
      return { status: "in_progress", progress: u / all.length };
    }
    default:
      return { status: "unlocked" };
  }
}

/**
 * `getTripState` doesn't include itinerary; patch it locally so the status
 * helper has what it needs.
 */
function fullState(tripId: string) {
  return { ...getTripState(tripId), itinerary: itineraryData[tripId] ?? [] };
}

export function PixelMapDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = trips
    .filter((t) => t.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const focusTrip = upcoming[0] ?? trips[0];
  const focusState = fullState(focusTrip.id);
  const focusMembers = members[focusTrip.id] ?? [];

  const totalXp = trips.reduce((s, t) => s + computeXp(getTripState(t.id)).total, 0);
  const heroLevel = levelFromXp(totalXp);

  // Recommended destination = the one matching the closest-to-done locked achievement
  const next = nextAchievement(focusState);
  const recommendedKey = next
    ? SECTIONS.find((s) => s.matchAchievement?.includes(next.id))?.key
    : undefined;

  function destFor(section: Section): MapDestinationProps {
    const { status, progress } = deriveStatus(section.key, focusState);
    const matched = next && section.matchAchievement?.includes(next.id);
    return {
      href: `/trips/${focusTrip.id}${section.pathSuffix}`,
      emoji: section.emoji,
      name: section.name,
      description: section.description,
      status,
      progress,
      recommended: section.key === recommendedKey,
      xpReward: matched ? next!.xpReward : undefined,
      col: section.col,
      row: section.row,
      colSpan: section.colSpan,
      rowSpan: section.rowSpan,
    };
  }

  // Achievements lives outside the 12x6 grid as a banner-style entry below the map
  const desktopSections = SECTIONS.filter((s) => s.key !== "achievements");
  const achievementsSection = SECTIONS.find((s) => s.key === "achievements")!;

  return (
    <main className="arcade-page animate-screen-in container-page py-6 md:py-10 pb-20">
      {/* HUD bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="arcade-font text-[10px] tracking-widest text-cyan-300">
          ▰ STAGE {heroLevel.level} · WORLD MAP
        </div>
        <div className="flex flex-wrap gap-2">
          <ArcadeButton href={`/trips/${focusTrip.id}`} tone="orange" size="sm">
            ▶ CONTINUE
          </ArcadeButton>
          <ArcadeButton href="/trips/new" tone="primary" size="sm">
            <Plus className="h-3 w-3" /> NEW ADVENTURE
          </ArcadeButton>
        </div>
      </div>

      <CurrentQuestPanel trip={focusTrip} level={heroLevel} totalXp={totalXp} />

      {/* The pixel map */}
      <section className="mt-6 pixel-map p-4 md:p-6 relative">
        {/* Decorative landmarks scattered behind */}
        <span aria-hidden className="absolute top-6 left-[10%] text-2xl select-none animate-twinkle" style={{ animationDelay: "0.3s" }}>🌲</span>
        <span aria-hidden className="absolute bottom-10 right-[12%] text-2xl select-none animate-twinkle" style={{ animationDelay: "0.9s" }}>⭐</span>
        <span aria-hidden className="absolute top-[40%] left-[50%] text-xl select-none">🏕️</span>
        <span aria-hidden className="absolute top-[15%] right-[40%] text-xl select-none animate-twinkle" style={{ animationDelay: "1.4s" }}>🗻</span>

        {/* Desktop: absolute-grid map with paths */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0">
            <MapPath />
          </div>
          <div
            className="relative grid gap-3"
            style={{
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gridTemplateRows: "repeat(6, minmax(80px, auto))",
            }}
          >
            {desktopSections.map((s) => (
              <MapDestinationCard key={s.key} {...destFor(s)} />
            ))}
          </div>

          {/* Achievement Tower hovers in the corner */}
          <div className="mt-3">
            <MapDestinationCard {...destFor(achievementsSection)} col={undefined} row={undefined} />
          </div>
        </div>

        {/* Mobile: simple stacked list, same destinations */}
        <div className="md:hidden grid gap-3">
          {SECTIONS.map((s) => {
            const dest = destFor(s);
            return (
              <MapDestinationCard
                key={s.key}
                {...dest}
                col={undefined}
                row={undefined}
              />
            );
          })}
        </div>
      </section>

      {/* Footer hint */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-2 arcade-font text-[9px] tracking-widest text-slate-400">
        <span>★ TIP: PICK A DESTINATION OR PRESS CONTINUE</span>
        <Link href={`/trips/${focusTrip.id}/achievements`} className="text-yellow-300 hover:text-yellow-100">
          ▶ VIEW ACHIEVEMENTS
        </Link>
      </div>
      {/* Members peek at bottom for color */}
      {focusMembers.length > 0 && (
        <div className="mt-3 text-[10px] text-slate-500 arcade-font tracking-widest">
          PARTY: {focusMembers.slice(0, 6).map((m) => m.name).join(" · ")}
        </div>
      )}
    </main>
  );
}
