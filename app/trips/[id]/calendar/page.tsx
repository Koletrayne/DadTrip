import { notFound } from "next/navigation";
import { CalendarBoard } from "@/components/CalendarBoard";
import { ExportTripButton } from "@/components/ExportTripButton";
import { Button } from "@/components/ui/button";
import { calendarEvents, members } from "@/lib/mock-data";
import { loadTrip } from "@/lib/trip-loader";
import { Plus } from "lucide-react";

export default async function CalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await loadTrip(id);
  if (!trip) notFound();
  const events = calendarEvents[id] ?? [];
  const peeps = members[id] ?? [];

  return (
    <div>
      <div className="arcade-panel p-5 md:p-6 mb-5">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="arcade-font text-[10px] tracking-wider text-cyan-300">CALENDAR BOARD</div>
            <h2 className="arcade-title mt-1 text-xl md:text-2xl">QUEST MAP</h2>
            <p className="text-slate-300 text-sm mt-1.5">
              Everyone&apos;s plans, day by day. Add any event straight to Google Calendar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportTripButton trip={trip} events={events} />
            <Button>
              <Plus className="h-4 w-4" /> Add event
            </Button>
          </div>
        </div>
      </div>
      <CalendarBoard
        startDate={trip.startDate}
        endDate={trip.endDate}
        events={events}
        members={peeps}
      />
    </div>
  );
}
