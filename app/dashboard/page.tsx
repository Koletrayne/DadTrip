import { getTripState } from "@/lib/mock-data";
import { loadAllTrips } from "@/lib/trip-loader";
import { computeXp, levelFromXp } from "@/lib/game";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allTrips = await loadAllTrips();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = allTrips
    .filter((t) => t.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const highScoreTrip = upcoming[0] ?? allTrips[0];

  const sorted = [
    ...allTrips
      .filter((t) => t.status !== "completed")
      .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    ...allTrips.filter((t) => t.status === "completed"),
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
