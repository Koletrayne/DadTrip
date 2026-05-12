"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createTrip } from "./actions";

const TRIP_TYPES = [
  "Road Trip",
  "National Park",
  "Beach",
  "City",
  "Camping",
  "Family Visit",
  "International",
  "Other",
];

const EMOJI_OPTIONS = ["🏞️", "🏖️", "🌲", "🏜️", "🏔️", "🚗", "🛶", "🏕️", "🍽️", "🎂", "✈️"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "new-trip";
}

export default function NewTripPage() {
  const [emoji, setEmoji] = useState("🏞️");
  const [privacy, setPrivacy] = useState("invite");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = (form.get("title") as string).trim();
    const destination = (form.get("destination") as string).trim();
    const startDate = form.get("startDate") as string;
    const endDate = form.get("endDate") as string;
    const tripType = form.get("tripType") as string;
    const description = (form.get("description") as string).trim();
    const budgetVal = form.get("budget") as string;

    const id = slugify(title) + "-" + Date.now().toString(36);

    await createTrip({
      id,
      title,
      destination,
      startDate,
      endDate,
      tripType,
      description: description || undefined,
      estimatedBudget: budgetVal ? Number(budgetVal) : undefined,
      coverEmoji: emoji,
      accent: "forest",
      status: "planning",
    });
  }

  return (
    <>
      <SiteHeader />
      <main className="container-page py-8 md:py-12 max-w-3xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to trips
        </Link>
        <h1 className="mt-3 arcade-title text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Create a new trip</h1>
        <p className="mt-1 text-cyan-300/70">A handful of details — you can fill in the rest later.</p>

        <Card className="mt-6">
          <CardContent className="p-5 md:p-6">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <Field label="Trip name">
                <Input name="title" required placeholder="e.g. Dad's Birthday Road Trip" />
              </Field>

              <Field label="Destination">
                <Input name="destination" required placeholder="e.g. Yosemite National Park" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Start date">
                  <Input name="startDate" type="date" required />
                </Field>
                <Field label="End date">
                  <Input name="endDate" type="date" required />
                </Field>
              </div>

              <Field label="Trip type">
                <Select name="tripType">
                  {TRIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>

              <Field label="Description">
                <Textarea name="description" placeholder="What's the trip about? Why does it matter?" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Estimated budget">
                  <Input name="budget" type="number" placeholder="$" />
                </Field>
                <Field label="Cover icon">
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        type="button"
                        key={e}
                        onClick={() => setEmoji(e)}
                        className={
                          "h-10 w-10 text-xl rounded-xl border " +
                          (emoji === e
                            ? "bg-forest text-white border-forest"
                            : "bg-card border-line hover:bg-line/60")
                        }
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <Field label="Privacy">
                <div className="grid sm:grid-cols-2 gap-2">
                  <RadioCard
                    title="Invite-only"
                    body="Only people you invite can see this trip."
                    checked={privacy === "invite"}
                    onChange={() => setPrivacy("invite")}
                  />
                  <RadioCard
                    title="Anyone with link"
                    body="Useful for big extended-family trips."
                    checked={privacy === "link"}
                    onChange={() => setPrivacy("link")}
                  />
                </div>
              </Field>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Link href="/dashboard">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Create trip</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function RadioCard({
  title,
  body,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={
        "text-left rounded-xl border p-3.5 transition-colors " +
        (checked
          ? "bg-forest text-white border-forest shadow-card"
          : "bg-card border-line hover:bg-line/60")
      }
    >
      <div className="font-medium">{title}</div>
      <div className={"text-xs mt-0.5 " + (checked ? "text-white/80" : "text-muted")}>{body}</div>
    </button>
  );
}
