import { cn } from "@/lib/utils";
import type { Member, PartyRole, RSVP } from "@/lib/types";
import { Avatar } from "../Avatar";
import { Badge } from "../ui/badge";

const rsvpToVariant: Record<RSVP, React.ComponentProps<typeof Badge>["variant"]> = {
  going: "success",
  maybe: "warning",
  not_going: "danger",
  no_response: "neutral",
};

const rsvpLabel: Record<RSVP, string> = {
  going: "Going",
  maybe: "Maybe",
  not_going: "Not going",
  no_response: "Pending",
};

const partyRoleEmoji: Record<PartyRole, string> = {
  Navigator:    "🧭",
  "Snack Captain": "🍪",
  Driver:       "🚗",
  Photographer: "📷",
  Planner:      "🗒️",
  Scout:        "🔭",
  Storyteller:  "📚",
  Quartermaster: "🎒",
};

const ROLE_DESCRIPTIONS: Record<PartyRole, string> = {
  Navigator: "Reads the map. Calls the turns.",
  "Snack Captain": "Stocks the cooler. Defends the trail mix.",
  Driver: "Behind the wheel, fueled by coffee.",
  Photographer: "Captures the moments worth keeping.",
  Planner: "Knows where, when, and what's next.",
  Scout: "Goes ahead. Reports back.",
  Storyteller: "Has a tale for every detour.",
  Quartermaster: "Packs the bags. Forgets nothing.",
};

export function PartyMemberCard({ member, className }: { member: Member; className?: string }) {
  const role = member.partyRole;
  return (
    <div className={cn("arcade-card overflow-hidden", className)}>
      <div className="h-12 bg-gradient-to-r from-purple-500/60 via-cyan-500/40 to-pink-500/50" />
      <div className="px-5 pb-5 -mt-7">
        <div className="flex items-end justify-between gap-2">
          <div className="rounded-2xl p-1 bg-slate-950/80 border border-cyan-400/40">
            <Avatar member={member} size={56} />
          </div>
          <Badge variant={rsvpToVariant[member.rsvp]}>
            {rsvpLabel[member.rsvp]}
          </Badge>
        </div>

        <div className="mt-2 font-extrabold text-white text-base leading-tight uppercase tracking-wide">
          {member.name}
        </div>
        {role && (
          <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-extrabold text-yellow-300 uppercase tracking-wider">
            <span>{partyRoleEmoji[role]}</span> {role}
          </div>
        )}
        <div className="text-[11px] text-slate-400 capitalize mt-0.5">{member.role}</div>

        {(member.favoriteStyle || member.notes || role) && (
          <div className="mt-3 rounded-xl bg-slate-900/60 border border-cyan-500/25 p-3 text-sm text-slate-200">
            {member.favoriteStyle && (
              <div>
                <span className="arcade-font text-[9px] tracking-wider text-cyan-300">FAVORITE STYLE</span>
                <div className="text-sm mt-0.5">{member.favoriteStyle}</div>
              </div>
            )}
            {role && (
              <div className="mt-2 text-xs italic text-slate-400">
                {ROLE_DESCRIPTIONS[role]}
              </div>
            )}
            {member.notes && (
              <div className="mt-2 text-xs text-slate-300">{member.notes}</div>
            )}
            {member.dietary && (
              <div className="mt-1.5 text-[11px] text-slate-400">Dietary: {member.dietary}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
