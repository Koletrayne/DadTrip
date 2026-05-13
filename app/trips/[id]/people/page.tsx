"use client";

import { use, useCallback, useEffect, useState } from "react";
import { PartyMemberCard } from "@/components/game/PartyMemberCard";
import { InviteSection } from "@/components/InviteSection";
import { members as membersData } from "@/lib/mock-data";
import { useTrip } from "../TripContext";
import type { Member, PartyRole, RSVP } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Shield, UserPlus, Plus, X, Pencil, Trash2 } from "lucide-react";

const PARTY_ROLES: { value: PartyRole; emoji: string; desc: string }[] = [
  { value: "Navigator", emoji: "🧭", desc: "Reads the map. Calls the turns." },
  { value: "Snack Captain", emoji: "🍪", desc: "Stocks the cooler. Defends the trail mix." },
  { value: "Driver", emoji: "🚗", desc: "Behind the wheel, fueled by coffee." },
  { value: "Photographer", emoji: "📷", desc: "Captures the moments worth keeping." },
  { value: "Planner", emoji: "🗒️", desc: "Knows where, when, and what's next." },
  { value: "Scout", emoji: "🔭", desc: "Goes ahead. Reports back." },
  { value: "Storyteller", emoji: "📚", desc: "Has a tale for every detour." },
  { value: "Quartermaster", emoji: "🎒", desc: "Packs the bags. Forgets nothing." },
];

const RSVP_OPTIONS: { value: RSVP; label: string }[] = [
  { value: "going", label: "Going" },
  { value: "maybe", label: "Maybe" },
  { value: "not_going", label: "Not going" },
  { value: "no_response", label: "No response yet" },
];

const AVATAR_COLORS = [
  "#2F5D50", "#C99A3D", "#9EC3D6", "#7DA797", "#E07A2F",
  "#558974", "#A57746", "#7A6A55", "#6B8E9B", "#B85C3A",
  "#4A7C6F", "#D4A843", "#8B6E4E", "#3D7A8A", "#9B5E3C",
  "#5C8A6E", "#C47A3B", "#6A9BB5", "#A6704D", "#4D8B7A",
];

function loadMembers(tripId: string): Member[] {
  try {
    const stored = localStorage.getItem(`members-${tripId}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return membersData[tripId] ?? [];
}

function saveMembers(tripId: string, items: Member[]) {
  try { localStorage.setItem(`members-${tripId}`, JSON.stringify(items)); } catch {}
}

export default function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip();

  const [peeps, setPeeps] = useState<Member[]>(() => membersData[id] ?? []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { setPeeps(loadMembers(id)); }, [id]);

  const persist = useCallback((next: Member[]) => {
    setPeeps(next);
    saveMembers(id, next);
  }, [id]);

  const going = peeps.filter((m) => m.rsvp === "going").length;

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    if (!name) return;

    const newMember: Member = {
      id: `m-${Date.now()}`,
      name,
      email: (form.get("email") as string).trim() || undefined,
      role: "guest",
      rsvp: (form.get("rsvp") as RSVP) || "no_response",
      partyRole: (form.get("partyRole") as PartyRole) || undefined,
      notes: (form.get("notes") as string).trim() || undefined,
      dietary: (form.get("dietary") as string).trim() || undefined,
      favoriteStyle: (form.get("favoriteStyle") as string).trim() || undefined,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };

    persist([...peeps, newMember]);
    setShowForm(false);
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    if (!name) return;

    persist(peeps.map((m) => {
      if (m.id !== editingId) return m;
      return {
        ...m,
        name,
        email: (form.get("email") as string).trim() || undefined,
        rsvp: (form.get("rsvp") as RSVP) || m.rsvp,
        partyRole: (form.get("partyRole") as PartyRole) || undefined,
        notes: (form.get("notes") as string).trim() || undefined,
        dietary: (form.get("dietary") as string).trim() || undefined,
        favoriteStyle: (form.get("favoriteStyle") as string).trim() || undefined,
      };
    }));
    setEditingId(null);
  }

  function handleRemove(memberId: string) {
    persist(peeps.filter((m) => m.id !== memberId));
  }

  const editingMember = editingId ? peeps.find((m) => m.id === editingId) : null;

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
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add hero</>}
          </Button>
        </div>
      </div>

      <InviteSection tripId={id} />

      {/* Add member form */}
      {showForm && (
        <Card className="border-cyan-500/30">
          <CardContent className="p-5">
            <h3 className="arcade-title text-sm text-cyan-300 mb-4">RECRUIT NEW HERO</h3>
            <MemberForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} submitLabel="Recruit" />
          </CardContent>
        </Card>
      )}

      {/* Edit member form */}
      {editingMember && (
        <Card className="border-purple-500/30">
          <CardContent className="p-5">
            <h3 className="arcade-title text-sm text-purple-300 mb-4">EDIT HERO — {editingMember.name.toUpperCase()}</h3>
            <MemberForm
              member={editingMember}
              onSubmit={handleUpdate}
              onCancel={() => setEditingId(null)}
              submitLabel="Save changes"
            />
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {peeps.map((m) => (
          <div key={m.id} className="group relative">
            <PartyMemberCard member={m} />
            <div className="absolute top-14 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditingId(m.id); setShowForm(false); }}
                className="h-7 w-7 rounded-lg bg-slate-900/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/20 transition-all"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleRemove(m.id)}
                className="h-7 w-7 rounded-lg bg-slate-900/80 border border-rose-500/40 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 backdrop-blur p-5 flex flex-col items-center justify-center text-center min-h-[200px] hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all cursor-pointer"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/80 border-2 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.35)]">
            <UserPlus className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-3 text-sm font-extrabold text-white uppercase tracking-wide">Recruit a new hero</div>
          <div className="text-xs text-slate-400 mt-1">Add someone to the party</div>
        </button>
      </div>
    </div>
  );
}

function MemberForm({
  member,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  member?: Member;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [selectedRole, setSelectedRole] = useState<string>(member?.partyRole ?? "");

  const roleInfo = PARTY_ROLES.find((r) => r.value === selectedRole);

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Name</label>
          <Input name="name" required defaultValue={member?.name ?? ""} placeholder="e.g. Uncle Ray" />
        </div>
        <div>
          <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Email</label>
          <Input name="email" type="email" defaultValue={member?.email ?? ""} placeholder="ray@example.com" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">RSVP</label>
          <Select name="rsvp" defaultValue={member?.rsvp ?? "no_response"}>
            {RSVP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Party Role</label>
          <Select name="partyRole" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">No role yet</option>
            {PARTY_ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.emoji} {r.value}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Role preview */}
      {roleInfo && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3 flex items-center gap-3">
          <span className="text-2xl">{roleInfo.emoji}</span>
          <div>
            <div className="arcade-font text-[10px] tracking-widest text-yellow-400">{roleInfo.value.toUpperCase()}</div>
            <div className="text-sm text-yellow-200/80 italic">{roleInfo.desc}</div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Favorite Style</label>
          <Input name="favoriteStyle" defaultValue={member?.favoriteStyle ?? ""} placeholder="e.g. Scenic drives & pancakes" />
        </div>
        <div>
          <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Dietary</label>
          <Input name="dietary" defaultValue={member?.dietary ?? ""} placeholder="e.g. Vegetarian, no shellfish" />
        </div>
      </div>

      <div>
        <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Notes</label>
        <Input name="notes" defaultValue={member?.notes ?? ""} placeholder="e.g. Bad knees — easy walks only" />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><Plus className="h-4 w-4" /> {submitLabel}</Button>
      </div>
    </form>
  );
}
