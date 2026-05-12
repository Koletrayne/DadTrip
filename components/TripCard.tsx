import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { CountdownBadge } from "./CountdownBadge";
import { AvatarGroup } from "./Avatar";
import { cn, formatDateRange } from "@/lib/utils";
import type { Member, Trip, TripStatus } from "@/lib/types";
import { ArrowRight, MapPin, UserPlus, CalendarDays } from "lucide-react";

const headerGradient: Record<TripStatus, string> = {
  idea:      "bg-gradient-to-br from-violet-200 via-sky-200 to-emerald-200",
  planning:  "bg-gradient-to-br from-amber-200 via-orange-200 to-pink-200",
  booked:    "bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200",
  completed: "bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200",
};

export function TripCard({ trip, members }: { trip: Trip; members: Member[] }) {
  return (
    <Card className="group hover:shadow-cardHover transition-shadow overflow-hidden">
      <div className={cn("h-20 relative", headerGradient[trip.status])}>
        <div className="absolute -bottom-7 left-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-card border border-line">
          {trip.coverEmoji ?? "✈️"}
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={trip.status} />
        </div>
      </div>
      <div className="p-5 md:p-6 pt-9">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/trips/${trip.id}`}
              className="font-semibold text-base md:text-lg hover:underline underline-offset-4 truncate block"
            >
              {trip.title}
            </Link>
            <div className="text-sm text-muted flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          {trip.status !== "completed" && (
            <>
              <span className="text-line">·</span>
              <CountdownBadge startDate={trip.startDate} />
            </>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarGroup members={members} />
            <div className="text-xs text-muted">{members.length} invited</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/trips/${trip.id}/people`}
              className="inline-flex items-center gap-1 text-sm text-forest hover:underline"
            >
              <UserPlus className="h-4 w-4" /> Invite
            </Link>
            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-forest"
            >
              Open <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
