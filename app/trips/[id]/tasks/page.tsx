"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { QuestCard } from "@/components/game/QuestCard";
import { members as membersData, tasks as tasksData } from "@/lib/mock-data";
import type { Task, TaskStatus, Priority } from "@/lib/types";
import { QUEST_XP_BY_PRIORITY } from "@/lib/game";
import { useTrip } from "../TripContext";
import { Plus, Scroll, Sparkles, X } from "lucide-react";

function loadTasks(tripId: string): Task[] {
  try {
    const stored = localStorage.getItem(`tasks-${tripId}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return tasksData[tripId] ?? [];
}

function saveTasks(tripId: string, items: Task[]) {
  try { localStorage.setItem(`tasks-${tripId}`, JSON.stringify(items)); } catch {}
}

export default function QuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trip = useTrip();
  const peeps = membersData[id] ?? [];
  const memberById = Object.fromEntries(peeps.map((m) => [m.id, m]));

  const [tasks, setTasks] = useState<Task[]>(() => tasksData[id] ?? []);
  const [filterPerson, setFilterPerson] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setTasks(loadTasks(id)); }, [id]);

  const persist = useCallback((next: Task[]) => {
    setTasks(next);
    saveTasks(id, next);
  }, [id]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterPerson !== "all" && t.assignedTo !== filterPerson) return false;
      if (filterStatus === "open" && t.status === "done") return false;
      if (filterStatus === "done" && t.status !== "done") return false;
      if (filterStatus === "overdue") {
        if (!t.dueDate || t.status === "done") return false;
        if (t.dueDate >= new Date().toISOString().slice(0, 10)) return false;
      }
      return true;
    });
  }, [tasks, filterPerson, filterStatus]);

  const totalXp = tasks.reduce((s, t) => s + QUEST_XP_BY_PRIORITY[t.priority], 0);
  const earnedXp = tasks
    .filter((t) => t.status === "done")
    .reduce((s, t) => s + QUEST_XP_BY_PRIORITY[t.priority], 0);
  const cleared = tasks.filter((t) => t.status === "done").length;

  function cycleStatus(taskId: string) {
    const next = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const s: TaskStatus =
        t.status === "not_started" ? "in_progress" : t.status === "in_progress" ? "done" : "not_started";
      return { ...t, status: s };
    });
    persist(next);
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string).trim();
    if (!title) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description: (form.get("description") as string).trim() || undefined,
      assignedTo: (form.get("assignedTo") as string) || undefined,
      dueDate: (form.get("dueDate") as string) || undefined,
      priority: (form.get("priority") as Priority) || "medium",
      status: "not_started",
    };

    persist([...tasks, newTask]);
    setShowForm(false);
  }

  // Group by status to make the board feel like a real quest log
  const byStatus = {
    in_progress: filtered.filter((t) => t.status === "in_progress"),
    not_started: filtered.filter((t) => t.status === "not_started"),
    done: filtered.filter((t) => t.status === "done"),
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="arcade-panel relative overflow-hidden p-5 md:p-7">
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="arcade-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
              <Scroll className="h-3 w-3" /> QUEST LOG
            </div>
            <h1 className="arcade-title mt-2 text-xl md:text-2xl">QUESTS</h1>
            <p className="text-slate-300 text-sm mt-1.5">
              Who&apos;s booking what, who&apos;s bringing the cooler. Done.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="rounded-xl border-2 border-cyan-400/45 bg-slate-900/60 px-3 py-2 text-center">
              <div className="arcade-font text-[9px] tracking-wider text-cyan-300">CLEARED</div>
              <div className="font-extrabold text-white">{cleared} / {tasks.length}</div>
            </div>
            <div className="rounded-xl border-2 border-yellow-400/55 bg-slate-900/60 px-3 py-2 text-center shadow-[0_0_12px_rgba(250,204,21,0.22)]">
              <div className="arcade-font text-[9px] tracking-wider text-yellow-300">XP EARNED</div>
              <div className="font-extrabold text-white inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> {earnedXp} / {totalXp}
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add quest</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Add quest form */}
      {showForm && (
        <Card className="border-cyan-500/30">
          <CardContent className="p-5">
            <h3 className="arcade-title text-sm text-cyan-300 mb-4">New Quest</h3>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div>
                <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Quest Title</label>
                <Input name="title" required placeholder="e.g. Book campsite for night 2" />
              </div>
              <div>
                <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Description</label>
                <Textarea name="description" placeholder="Any extra details?" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Assign to</label>
                  <Select name="assignedTo">
                    <option value="">Unassigned</option>
                    {peeps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Priority</label>
                  <Select name="priority">
                    <option value="low">Low (10 XP)</option>
                    <option value="medium" selected>Medium (20 XP)</option>
                    <option value="high">High (30 XP)</option>
                  </Select>
                </div>
                <div>
                  <label className="arcade-font text-[10px] tracking-widest text-slate-400 mb-1.5 block">Due date</label>
                  <Input name="dueDate" type="date" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit"><Plus className="h-4 w-4" /> Create quest</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} className="w-44">
          <option value="all">Whole party</option>
          {peeps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </Select>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-36">
          <option value="all">All</option>
          <option value="open">Active</option>
          <option value="done">Cleared</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-bark-600">No quests match.</CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {byStatus.in_progress.length > 0 && (
            <Section title="In progress" subtitle="Picked up by a hero, not yet cleared.">
              {byStatus.in_progress.map((t) => (
                <QuestCard
                  key={t.id}
                  quest={t}
                  owner={t.assignedTo ? memberById[t.assignedTo] : undefined}
                  onToggleStatus={() => cycleStatus(t.id)}
                />
              ))}
            </Section>
          )}
          {byStatus.not_started.length > 0 && (
            <Section title="On the board" subtitle="Available for a hero to claim.">
              {byStatus.not_started.map((t) => (
                <QuestCard
                  key={t.id}
                  quest={t}
                  owner={t.assignedTo ? memberById[t.assignedTo] : undefined}
                  onToggleStatus={() => cycleStatus(t.id)}
                />
              ))}
            </Section>
          )}
          {byStatus.done.length > 0 && (
            <Section title="Cleared" subtitle="XP earned. Glory acquired.">
              {byStatus.done.map((t) => (
                <QuestCard
                  key={t.id}
                  quest={t}
                  owner={t.assignedTo ? memberById[t.assignedTo] : undefined}
                  onToggleStatus={() => cycleStatus(t.id)}
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2">
        <h3 className="arcade-font text-xs tracking-wider text-cyan-300">{title.toUpperCase()}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
