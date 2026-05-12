import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  ThumbsUp,
  ListChecks,
  CheckSquare,
  Sparkles,
  MapPin,
  Camera,
  Wand2,
  Trophy,
} from "lucide-react";

const features = [
  { icon: CalendarDays, title: "SHARED CALENDAR",     body: "See every plan, day by day. Drag, edit, confirm.",                  tone: "cyan" },
  { icon: Users,        title: "INVITE PARTY",        body: "Send a link. Everyone RSVPs and gets a party role.",                tone: "pink" },
  { icon: ThumbsUp,     title: "VOTE ON IDEAS",       body: "Anyone can suggest. Everyone votes. Best ideas float up.",          tone: "yellow" },
  { icon: ListChecks,   title: "BUILD ITINERARY",     body: "Morning, afternoon, evening — together, not in a group chat.",      tone: "green" },
  { icon: CheckSquare,  title: "CLEAR QUESTS",        body: "Who’s booking what, who’s bringing the cooler. +XP per clear.",     tone: "orange" },
  { icon: Trophy,       title: "EARN ACHIEVEMENTS",   body: "Plan smart, unlock badges, level up your trip.",                    tone: "purple" },
];

const toneCard: Record<string, string> = {
  cyan:   "border-cyan-400/45 shadow-[0_0_18px_rgba(34,211,238,0.22)]",
  pink:   "border-pink-400/50 shadow-[0_0_18px_rgba(244,114,182,0.30)]",
  yellow: "border-yellow-400/55 shadow-[0_0_18px_rgba(250,204,21,0.30)]",
  green:  "border-emerald-400/50 shadow-[0_0_18px_rgba(74,222,128,0.30)]",
  orange: "border-orange-400/50 shadow-[0_0_18px_rgba(251,146,60,0.30)]",
  purple: "border-purple-400/50 shadow-[0_0_18px_rgba(168,85,247,0.30)]",
};
const toneIcon: Record<string, string> = {
  cyan:   "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
  pink:   "bg-pink-500/15 text-pink-200 border-pink-400/40",
  yellow: "bg-yellow-500/15 text-yellow-200 border-yellow-400/45",
  green:  "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
  orange: "bg-orange-500/15 text-orange-200 border-orange-400/40",
  purple: "bg-purple-500/15 text-purple-200 border-purple-400/40",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="arcade-page">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute -top-20 right-0 -z-10 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl" />
          <div aria-hidden className="absolute top-20 -left-10 -z-10 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
          <div aria-hidden className="absolute top-10 left-1/3 -z-10 h-56 w-56 rounded-full bg-pink-500/25 blur-3xl" />

          <div className="container-page relative pt-12 md:pt-20 pb-16 md:pb-24">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="arcade-badge inline-flex items-center gap-2 px-3 py-1 text-[10px]">
                  <Sparkles className="h-3.5 w-3.5" /> A FAMILY ADVENTURE SYSTEM
                </div>
                <h1 className="arcade-title mt-4 text-3xl md:text-5xl lg:text-6xl leading-[1.1] animate-flicker">
                  PLAN THE TRIPS<br />
                  YOU&apos;LL{" "}
                  <span style={{ color: "#fde68a", textShadow: "0 0 12px rgba(250,204,21,0.9), 0 0 26px rgba(251,146,60,0.7)" }}>
                    REMEMBER FOREVER
                  </span>
                  .
                </h1>
                <p className="mt-5 text-lg text-slate-300 max-w-xl">
                  DadTrip is a cozy adventure board for the family. Plan, vote, pack, and earn
                  XP together — every quest counts.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/trips/new">
                    <Button size="lg">▶ START A TRIP</Button>
                  </Link>
                  <Link href="/trips/yosemite-2026">
                    <Button size="lg" variant="outline">View Demo Trip</Button>
                  </Link>
                  <Link href="/planning">
                    <Button size="lg" variant="ghost">
                      <Wand2 className="h-4 w-4" /> GET TRIP IDEAS
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 text-xs text-slate-400 flex items-center gap-2 uppercase tracking-wider font-bold">
                  <MapPin className="h-4 w-4 text-cyan-300" /> NO ACCOUNT NEEDED FOR THE DEMO
                </div>
              </div>

              {/* Hero card preview */}
              <div className="relative">
                <div aria-hidden className="absolute -top-6 -left-6 h-24 w-24 rounded-3xl bg-cyan-500/30 blur-xl" />
                <div aria-hidden className="absolute -bottom-8 -right-8 h-28 w-28 rounded-3xl bg-pink-500/30 blur-xl" />
                <div className="relative arcade-card">
                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-2xl">🏞️</span>
                        <div>
                          <div className="text-base font-extrabold text-white uppercase tracking-wide">Dad&apos;s Birthday Road Trip</div>
                          <div className="text-xs text-slate-400">Yosemite · June 12–16, 2026</div>
                        </div>
                      </div>
                      <span className="arcade-badge text-[9px] px-2.5 py-1">PLANNING</span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                      <Stat label="Going" value="5/8" />
                      <Stat label="Quests" value="9" />
                      <Stat label="Top idea" value="Mist Trail" />
                    </div>

                    <div className="mt-5 rounded-xl border-2 border-yellow-400/40 bg-slate-900/60 p-3.5 shadow-[0_0_14px_rgba(250,204,21,0.18)]">
                      <div className="arcade-font text-[9px] tracking-wider text-yellow-300">SAT JUN 13</div>
                      <ul className="mt-2 text-sm space-y-1.5 text-slate-200">
                        <li>🥾 Mist Trail hike — 8:00 AM</li>
                        <li>🥪 Picnic at Sentinel Beach — 1:30 PM</li>
                        <li>🌅 Sunset at Glacier Point — 7:30 PM</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="arcade-divider mx-auto max-w-7xl" />

        {/* Features */}
        <section>
          <div className="container-page py-16">
            <div className="max-w-2xl">
              <h2 className="arcade-title text-2xl md:text-3xl">EVERYTHING A FAMILY TRIP NEEDS.</h2>
              <p className="mt-3 text-slate-300">
                Big buttons, clear labels, no fuss. Easy enough for grandma, polished enough for your cousin who lives on her phone.
              </p>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, body, tone }) => (
                <div
                  key={title}
                  className={`rounded-2xl border-2 bg-slate-900/70 backdrop-blur p-5 transition-transform hover:-translate-y-1 ${toneCard[tone]}`}
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${toneIcon[tone]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3 font-extrabold text-white uppercase tracking-wide text-sm">{title}</div>
                  <div className="text-sm text-slate-300 mt-1">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="arcade-divider mx-auto max-w-7xl" />

        {/* Why */}
        <section className="container-page py-16">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="arcade-panel-strong p-6 md:p-8">
              <div className="flex items-center gap-2 text-yellow-300">
                <Trophy className="h-5 w-5" />
                <span className="arcade-font text-[10px] tracking-wider">QUEST DESIGN</span>
              </div>
              <h3 className="mt-3 text-xl text-white uppercase tracking-wide">No more &ldquo;did anyone book the cabin?&rdquo;</h3>
              <p className="mt-3 text-slate-300">
                Every trip is one shared board: ideas, dates, RSVPs, quests, reservations, packing.
                Dad sees the calendar. Mom sees the budget. The kids vote. Grandma actually finds it.
              </p>
            </div>

            <div className="arcade-panel p-6 md:p-8">
              <div className="font-extrabold text-white uppercase tracking-wide text-lg">Try the demo trip</div>
              <p className="mt-1 text-sm text-slate-300">
                A planned-out Yosemite trip, fully populated. Click around — nothing breaks.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/trips/yosemite-2026">
                  <Button>▶ Open demo</Button>
                </Link>
                <Link href="/trips/yosemite-2026/calendar">
                  <Button variant="outline">Jump to Calendar</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-cyan-500/20">
          <div className="container-page py-8 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 uppercase tracking-wider font-bold">
            <div>© {new Date().getFullYear()} DADTRIP — MADE FOR THE PEOPLE YOU TRAVEL WITH.</div>
            <div className="flex gap-4">
              <Link href="/dashboard" className="hover:text-cyan-200">HUB</Link>
              <Link href="/planning" className="hover:text-cyan-200">PLAN</Link>
              <Link href="/trips/new" className="hover:text-cyan-200">NEW GAME</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-900/60 border-2 border-cyan-500/30 py-3">
      <div className="text-base font-extrabold text-white">{value}</div>
      <div className="arcade-font text-[9px] tracking-wider text-cyan-300 mt-0.5">{label.toUpperCase()}</div>
    </div>
  );
}
