import { Badge } from "@/components/ui/badge";
import { daysUntil } from "@/lib/utils";

export function CountdownBadge({ startDate }: { startDate: string }) {
  const d = daysUntil(startDate);
  if (d > 0)
    return (
      <Badge className="bg-gradient-to-r from-sunset to-pink-500 text-white border-transparent">
        🎉 {d} days to go
      </Badge>
    );
  if (d === 0)
    return (
      <Badge className="bg-gradient-to-r from-sunset to-amber-500 text-white border-transparent">
        🚀 Today!
      </Badge>
    );
  return <Badge variant="neutral">{Math.abs(d)} days ago</Badge>;
}
