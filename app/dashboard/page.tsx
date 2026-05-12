import { trips, getTripState } from "@/lib/mock-data";
import { computeXp, levelFromXp } from "@/lib/game";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = trips
    .filter((t) => t.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const highScoreTrip = upcoming[0] ?? trips[0];

  const sorted = [
    ...trips
      .filter((t) => t.status !== "completed")
      .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    ...trips.filter((t) => t.status === "completed"),
  ];

  const slots = sorted.map((trip) => {
    const state = getTripState(trip.id);
    const xpData = computeXp(state);
    const levelInfo = levelFromXp(xpData.total);
    return {
      trip,
      xpTotal: xpData.total,
      levelNum: levelInfo.level,
      levelName: levelInfo.name,
      levelProgress: levelInfo.progress,
    };
  });

  return (
    <DashboardClient
      slots={slots}
      highScoreLabel={highScoreTrip?.title}
    />
  );
}
