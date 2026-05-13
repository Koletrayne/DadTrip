import "server-only";
import { cookies } from "next/headers";
import { getTrip, trips } from "./mock-data";
import type { Trip } from "./types";

const COOKIE_NAME = "dadtrip_user_trips";

async function readUserTrips(): Promise<Trip[]> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return [];
  try {
    return JSON.parse(value) as Trip[];
  } catch {
    return [];
  }
}

export async function loadTrip(id: string): Promise<Trip | undefined> {
  const mockTrip = getTrip(id);
  if (mockTrip) return mockTrip;
  const userTrips = await readUserTrips();
  return userTrips.find((t) => t.id === id);
}

export async function loadAllTrips(): Promise<Trip[]> {
  const userTrips = await readUserTrips();
  const userIds = new Set(userTrips.map((t) => t.id));
  return [...userTrips, ...trips.filter((t) => !userIds.has(t.id))];
}
