"use server";

import { revalidatePath } from "next/cache";
import { updateTrip } from "@/lib/mock-data";
import type { Trip } from "@/lib/types";

export async function updateTripAction(
  id: string,
  updates: Partial<Omit<Trip, "id">>
) {
  updateTrip(id, updates);
  revalidatePath(`/trips/${id}`);
  revalidatePath("/dashboard");
}
