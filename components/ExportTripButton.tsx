"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadIcs, tripToIcs } from "@/lib/google-calendar";
import type { CalendarEvent, Trip } from "@/lib/types";

export function ExportTripButton({ trip, events }: { trip: Trip; events: CalendarEvent[] }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const ics = tripToIcs(trip, events);
        const safe = trip.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        downloadIcs(`${safe}.ics`, ics);
      }}
      disabled={events.length === 0}
    >
      <Download className="h-4 w-4" /> Export to Google Calendar
    </Button>
  );
}
