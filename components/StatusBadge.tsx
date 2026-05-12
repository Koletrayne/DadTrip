import { Badge } from "@/components/ui/badge";
import type { TripStatus } from "@/lib/types";

const map: Record<TripStatus, { label: string; className: string }> = {
  idea:      { label: "💭 Idea stage", className: "bg-violet-100 text-violet-800 border border-violet-200" },
  planning:  { label: "🗺️ Planning",   className: "bg-amber-100 text-amber-900 border border-amber-200" },
  booked:    { label: "✅ Booked",     className: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  completed: { label: "📸 Completed",  className: "bg-sky-100 text-sky-800 border border-sky-200" },
};

export function StatusBadge({ status }: { status: TripStatus }) {
  const { label, className } = map[status];
  return (
    <Badge className={className} variant="default">
      {label}
    </Badge>
  );
}
