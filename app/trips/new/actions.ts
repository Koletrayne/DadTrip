"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Trip } from "@/lib/types";

export async function createTrip(trip: Trip) {
  const { error } = await supabase.from("trips").insert({
    id: trip.id,
    title: trip.title,
    destination: trip.destination,
    description: trip.description,
    start_date: trip.startDate,
    end_date: trip.endDate,
    trip_type: trip.tripType,
    estimated_budget: trip.estimatedBudget,
    cover_emoji: trip.coverEmoji,
    accent: trip.accent,
    status: trip.status,
  });

  if (error) {
    console.error("Error creating trip:", error);
    throw new Error(error.message);
  }

  redirect(`/trips/${trip.id}`);
}