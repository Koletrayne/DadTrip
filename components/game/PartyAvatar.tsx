import { cn } from "@/lib/utils";
import type { Member, PartyRole } from "@/lib/types";

const ROLE_EMOJI: Record<PartyRole, string> = {
  Navigator:       "🧭",
  "Snack Captain": "🍪",
  Driver:          "🚗",
  Photographer:    "📷",
  Planner:         "📜",
  Scout:           "🔭",
  Storyteller:     "📚",
  Quartermaster:   "🎒",
};

export function PartyAvatar({
  member,
  size = 44,
  showRing = true,
  className,
}: {
  member: Pick<Member, "name" | "avatarColor" | "partyRole">;
  size?: number;
  showRing?: boolean;
  className?: string;
}) {
  const initials = member.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const ringSize = size + 8;
  const fontSize = Math.max(11, Math.round(size * 0.4));

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: ringSize, height: ringSize }}
      title={
        member.partyRole ? `${member.name} · ${member.partyRole}` : member.name
      }
    >
      {showRing && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-300 via-sunset-400 to-forest-400 p-[2px]"
        >
          <span className="block h-full w-full rounded-full bg-card" />
        </span>
      )}
      <div
        className="absolute inset-1 inline-flex items-center justify-center rounded-full text-white font-bold shadow-card"
        style={{
          backgroundColor: member.avatarColor || "#7DA797",
          fontSize,
        }}
      >
        {initials}
      </div>
      {member.partyRole && (
        <span
          aria-hidden
          className="absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full bg-card border border-gold-300 shadow-card"
          style={{
            width: Math.max(18, Math.round(size * 0.45)),
            height: Math.max(18, Math.round(size * 0.45)),
            fontSize: Math.max(10, Math.round(size * 0.32)),
          }}
        >
          {ROLE_EMOJI[member.partyRole]}
        </span>
      )}
    </div>
  );
}

export function PartyAvatarGroup({
  members,
  max = 4,
  size = 36,
}: {
  members: Pick<Member, "name" | "avatarColor" | "partyRole">[];
  max?: number;
  size?: number;
}) {
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  return (
    <div className="flex items-center -space-x-3">
      {shown.map((m, i) => (
        <PartyAvatar key={i} member={m} size={size} className="ring-2 ring-card rounded-full" />
      ))}
      {rest > 0 && (
        <div
          className="ring-2 ring-card inline-flex items-center justify-center rounded-full bg-bark-100 text-bark-700 font-bold"
          style={{
            width: size,
            height: size,
            fontSize: Math.max(10, Math.round(size * 0.32)),
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
