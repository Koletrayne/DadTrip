"use server";

import { revalidatePath } from "next/cache";
import { deleteTrip } from "@/lib/mock-data";

export async function deleteTripAction(id: string) {
  deleteTrip(id);
  revalidatePath("/dashboard");
}
