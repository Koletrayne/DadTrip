import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PartyMemberCard } from "@/components/game/PartyMemberCard";
import { getTrip, members as membersData } from "@/lib/mock-data";
import { Copy, Mail, Shield, UserPlus } from "lucide-react";

export default async function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();
  const peeps = membersData[id] ?? [];

  const going = peeps.filter((m) => m.rsvp === "going").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="arcade-panel relative overflow-hidden p-5 md:p-7">
        <div className="relative flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="arcade-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
              <Shield className="h-3 w-3" /> THE PARTY
            </div>
            <h1 className="arcade-title mt-2 text-xl md:text-2xl">YOUR TRAVELING BAND</h1>
            <p className="text-slate-300 text-sm mt-1.5">
              {going} ready · {peeps.length} invited. Every adventure needs a Navigator and a Snack Captain.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 md:p-6">
          <div className="grid md:grid-cols-2 gap-3 items-end">
            <div>
              <div className="arcade-font text-[10px] tracking-wider mb-1.5 text-cyan-300">RECRUIT A HERO BY EMAIL</div>
              <div className="flex gap-2">
                <Input placeholder="grandma@example.com" />
                <Button>
                  <Mail className="h-4 w-4" /> Invite
                </Button>
              </div>
            </div>
            <div>
              <div className="arcade-font text-[10px] tracking-wider mb-1.5 text-cyan-300">OR SEND A QUEST SCROLL</div>
              <div className="flex gap-2">
                <Input readOnly value={`https://dadtrip.app/join/${id}`} className="font-mono text-xs" />
                <Button variant="outline">
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {peeps.map((m) => (
          <PartyMemberCard key={m.id} member={m} />
        ))}
        <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 backdrop-blur p-5 flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/80 border-2 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.35)]">
            <UserPlus className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-3 text-sm font-extrabold text-white uppercase tracking-wide">Recruit a new hero</div>
          <div className="text-xs text-slate-400 mt-1">Email or share the quest scroll</div>
        </div>
      </div>
    </div>
  );
}
