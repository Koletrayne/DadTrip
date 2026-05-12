"use client";

import { createContext, useContext } from "react";
import type { Trip } from "@/lib/types";

const TripContext = createContext<Trip | null>(null);

export function TripProvider({ trip, children }: { trip: Trip; children: React.ReactNode }) {
  return <TripContext.Provider value={trip}>{children}</TripContext.Provider>;
}

export function useTrip(): Trip {
  const trip = useContext(TripContext);
  if (!trip) throw new Error("useTrip must be used within TripProvider");
  return trip;
}
