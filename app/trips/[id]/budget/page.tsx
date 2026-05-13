import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { budget, members as membersData } from "@/lib/mock-data";
import { loadTrip } from "@/lib/trip-loader";
import { currency } from "@/lib/utils";
import { Coins, Plus, Sparkles, Wallet } from "lucide-react";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await loadTrip(id);
  if (!trip) notFound();
  const items = budget[id] ?? [];
  const peeps = membersData[id] ?? [];
  const memberById = Object.fromEntries(peeps.map((m) => [m.id, m]));

  const totalEstimate = items.reduce((s, b) => s + b.estimatedCost, 0);
  const totalActual = items.reduce((s, b) => s + (b.actualCost ?? 0), 0);
  const goingCount = peeps.filter((m) => m.rsvp === "going").length || peeps.length || 1;
  const perPerson = totalEstimate / goingCount;

  // Group by category
  const byCat: Record<string, typeof items> = {};
  for (const it of items) (byCat[it.category] ??= []).push(it);

  return (
    <div className="space-y-6">
      <div className="arcade-panel relative overflow-hidden p-5 md:p-7">
        <div className="relative flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="arcade-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
              <Wallet className="h-3 w-3" /> TREASURY
            </div>
            <h1 className="arcade-title mt-2 text-xl md:text-2xl">GOLD LEDGER</h1>
            <p className="text-slate-300 text-sm mt-1.5">Estimate, track, split. Every coin accounted for.</p>
          </div>
          <Button><Plus className="h-4 w-4" /> Add item</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Estimated total" value={currency(totalEstimate)} accent="cyan" />
        <Stat label="Spent so far" value={currency(totalActual)} accent="orange" />
        <Stat label="Per person" value={currency(perPerson)} hint={`${goingCount} going`} accent="yellow" />
      </div>

      {trip.estimatedBudget && (
        <Card>
          <CardContent className="p-5 md:p-6">
            <div className="arcade-font text-[10px] tracking-wider text-slate-400 mb-2">
              Against trip target ({currency(trip.estimatedBudget)})
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                style={{ width: `${Math.min(100, (totalEstimate / trip.estimatedBudget) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(byCat).map(([cat, list]) => {
        const subtotal = list.reduce((s, b) => s + b.estimatedCost, 0);
        return (
          <Card key={cat}>
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="arcade-font text-xs tracking-wider text-cyan-300 flex items-center gap-2">
                  <Coins className="h-4 w-4" /> {cat.toUpperCase()}
                </h3>
                <div className="text-sm font-semibold text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]">
                  {currency(subtotal)}
                </div>
              </div>
              <div className="divide-y divide-slate-700/50 border border-slate-700/50 rounded-xl bg-slate-800/40">
                {list.map((it) => {
                  const payer = it.paidBy ? memberById[it.paidBy] : undefined;
                  return (
                    <div key={it.id} className="p-3.5 flex items-center gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200">{it.description}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Split between {it.splitBetween.length} people
                          {payer && <> · paid by <span className="text-cyan-300">{payer.name}</span></>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{currency(it.estimatedCost)}</div>
                        {it.actualCost != null && (
                          <Badge variant={it.actualCost > it.estimatedCost ? "warning" : "success"}>
                            actual {currency(it.actualCost)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardContent className="p-5 md:p-6">
          <h3 className="arcade-font text-xs tracking-wider text-cyan-300 flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4" /> QUICK SPLIT CALCULATOR
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3.5">
              <div className="arcade-font text-[9px] tracking-wider text-slate-400">TOTAL</div>
              <div className="mt-1 text-lg font-bold text-white">{currency(totalEstimate)}</div>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3.5">
              <div className="arcade-font text-[9px] tracking-wider text-slate-400">PEOPLE SPLITTING</div>
              <div className="mt-1 text-lg font-bold text-white">{goingCount}</div>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-slate-800/60 p-3.5">
              <div className="arcade-font text-[9px] tracking-wider text-cyan-300">EACH PERSON</div>
              <div className="mt-1 text-lg font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{currency(perPerson)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent: "cyan" | "orange" | "yellow" }) {
  const styles = {
    cyan:   { border: "border-cyan-400/45",   text: "text-cyan-300",   glow: "shadow-[0_0_12px_rgba(34,211,238,0.22)]" },
    orange: { border: "border-orange-400/45",  text: "text-orange-300", glow: "shadow-[0_0_12px_rgba(251,146,60,0.22)]" },
    yellow: { border: "border-yellow-400/55",  text: "text-yellow-300", glow: "shadow-[0_0_12px_rgba(250,204,21,0.22)]" },
  };
  const s = styles[accent];
  return (
    <div className={`rounded-xl border-2 ${s.border} bg-slate-900/60 p-3.5 ${s.glow}`}>
      <div className={`arcade-font text-[9px] tracking-wider ${s.text}`}>{label.toUpperCase()}</div>
      <div className="mt-1 text-xl font-extrabold text-white">{value}</div>
      {hint && <div className="text-[11px] text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}
