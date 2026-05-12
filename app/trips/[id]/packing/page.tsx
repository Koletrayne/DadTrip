"use client";

import { use, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { members as membersData, packing as packingData } from "@/lib/mock-data";
import type { PackingItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTrip } from "../TripContext";
import { Backpack, Check, Plus, Trash2 } from "lucide-react";

const suggestedTemplates: Record<string, string[]> = {
  "National Park": ["Hiking shoes", "Sunscreen", "Water bottle", "Hat", "Backpack", "Trail snacks", "Park pass"],
  "Camping":       ["Tent", "Sleeping bag", "Headlamp", "Camp stove", "Lighter", "Bug spray"],
  "Road Trip":     ["Phone charger", "Cooler", "Snacks", "Sunglasses", "Jumper cables", "Blanket", "First-aid kit"],
};

export default function PackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip();
  const peeps = membersData[id] ?? [];
  const memberById = Object.fromEntries(peeps.map((m) => [m.id, m]));
  const [items, setItems] = useState<PackingItem[]>(packingData[id] ?? []);

  const grouped = useMemo(() => {
    const map: Record<string, PackingItem[]> = {};
    for (const it of items) (map[it.category] ??= []).push(it);
    return map;
  }, [items]);

  const packedCount = items.filter((i) => i.isPacked).length;

  function toggle(itemId: string) {
    setItems((prev) => prev.map((p) => (p.id === itemId ? { ...p, isPacked: !p.isPacked } : p)));
  }

  function remove(itemId: string) {
    setItems((prev) => prev.filter((p) => p.id !== itemId));
    if (packingData[id]) {
      const idx = packingData[id].findIndex((p) => p.id === itemId);
      if (idx !== -1) packingData[id].splice(idx, 1);
    }
  }

  const suggestions = suggestedTemplates[trip.tripType] ?? suggestedTemplates["Road Trip"];

  return (
    <div className="space-y-6">
      <div className="arcade-panel relative overflow-hidden p-5 md:p-7">
        <div className="relative flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="arcade-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
              <Backpack className="h-3 w-3" /> INVENTORY
            </div>
            <h1 className="arcade-title mt-2 text-xl md:text-2xl">PACKING LIST</h1>
            <p className="text-slate-300 text-sm mt-1.5">
              {packedCount} of {items.length} packed
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border-2 border-emerald-400/45 bg-slate-900/60 px-3 py-2 text-center shadow-[0_0_12px_rgba(52,211,153,0.22)]">
              <div className="arcade-font text-[9px] tracking-wider text-emerald-300">PACKED</div>
              <div className="font-extrabold text-white">{packedCount} / {items.length}</div>
            </div>
            <Button><Plus className="h-4 w-4" /> Add item</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([cat, list]) => (
          <Card key={cat}>
            <CardContent className="p-5">
              <h3 className="arcade-font text-xs tracking-wider text-cyan-300 mb-3">{cat.toUpperCase()}</h3>
              <ul className="space-y-2">
                {list.map((p) => {
                  const owner = p.assignedTo ? memberById[p.assignedTo] : undefined;
                  return (
                    <li key={p.id} className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/40 p-2.5">
                      <button
                        onClick={() => toggle(p.id)}
                        className={cn(
                          "h-6 w-6 rounded-md border flex items-center justify-center transition-all",
                          p.isPacked
                            ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                            : "bg-slate-800 border-slate-600 hover:border-cyan-500/50"
                        )}
                      >
                        {p.isPacked && <Check className="h-4 w-4" />}
                      </button>
                      <div className={cn("flex-1 text-sm", p.isPacked ? "line-through text-slate-500" : "text-slate-200")}>{p.title}</div>
                      {owner && <Avatar member={owner} size={22} />}
                      <button
                        onClick={() => remove(p.id)}
                        className="h-6 w-6 rounded-md flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 md:p-6">
          <h3 className="arcade-font text-xs tracking-wider text-cyan-300">SUGGESTED FOR {trip.tripType.toUpperCase()} TRIPS</h3>
          <p className="text-sm text-slate-400 mt-1">Tap to add.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() =>
                  setItems((prev) => [
                    ...prev,
                    { id: `p-${Date.now()}-${s}`, title: s, category: "Miscellaneous", isPacked: false },
                  ])
                }
                className="rounded-full border border-slate-600/50 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-700/60 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
