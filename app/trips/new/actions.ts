"use server";

import { redirect } from "next/navigation";
import { addTrip } from "@/lib/mock-data";
import type { Trip } from "@/lib/types";

export async function createTrip(trip: Trip) {
  addTrip(trip);
  redirect(`/trips/${trip.id}`);
}
