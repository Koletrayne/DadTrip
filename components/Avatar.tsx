import { cn } from "@/lib/utils";
import type { Member } from "@/lib/types";

export function Avatar({ member, size = 32, className }: { member: Pick<Member, "name" | "avatarColor">; size?: number; className?: string }) {
  const initials = member.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn("inline-flex items-center justify-center rounded-full text-white font-semibold", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: member.avatarColor || "#7DA797",
        fontSize: Math.max(11, Math.round(size * 0.4)),
      }}
      title={member.name}
    >
      {initials}
    </div>
  );
}

export function AvatarGroup({ members, max = 5 }: { members: Pick<Member, "name" | "avatarColor">[]; max?: number }) {
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((m, i) => (
        <div key={i} className="ring-2 ring-card rounded-full">
          <Avatar member={m} size={28} />
        </div>
      ))}
      {rest > 0 && (
        <div className="ring-2 ring-card inline-flex h-7 w-7 items-center justify-center rounded-full bg-line text-xs font-semibold text-ink/70">
          +{rest}
        </div>
      )}
    </div>
  );
}
