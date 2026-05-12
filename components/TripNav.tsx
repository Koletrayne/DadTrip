"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Map,
  CalendarDays,
  ListChecks,
  Lightbulb,
  Users,
  Scroll,
  Wallet,
  Backpack,
  BookHeart,
  Trophy,
} from "lucide-react";

const tabs = [
  { href: "",             label: "Overview",      icon: Map,          color: "text-cyan-300" },
  { href: "/calendar",    label: "Calendar",      icon: CalendarDays, color: "text-purple-300" },
  { href: "/itinerary",   label: "Itinerary",     icon: ListChecks,   color: "text-emerald-300" },
  { href: "/ideas",       label: "Ideas",         icon: Lightbulb,    color: "text-yellow-300" },
  { href: "/people",      label: "Party",         icon: Users,        color: "text-pink-300" },
  { href: "/tasks",       label: "Quests",        icon: Scroll,       color: "text-orange-300" },
  { href: "/budget",      label: "Treasury",      icon: Wallet,       color: "text-yellow-200" },
  { href: "/packing",     label: "Pack",          icon: Backpack,     color: "text-emerald-200" },
  { href: "/memories",    label: "Adventure Log", icon: BookHeart,    color: "text-pink-200" },
  { href: "/achievements",label: "Achievements",  icon: Trophy,       color: "text-yellow-300" },
];

const mobileTabs = [
  { href: "",             label: "Overview",     icon: Map },
  { href: "/calendar",    label: "Calendar",     icon: CalendarDays },
  { href: "/tasks",       label: "Quests",       icon: Scroll },
  { href: "/people",      label: "Party",        icon: Users },
  { href: "/achievements",label: "Awards",       icon: Trophy },
];

export function TripSidebar({ tripId }: { tripId: string }) {
  const pathname = usePathname() || "";
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <div className="sticky top-20 arcade-panel p-2">
        <div className="px-3 pt-1.5 pb-2 arcade-font text-[10px] tracking-wider text-cyan-300/90">
          QUEST BOARD
        </div>
        <nav className="space-y-0.5">
          {tabs.map(({ href, label, icon: Icon, color }) => {
            const fullHref = `/trips/${tripId}${href}`;
            const active =
              href === ""
                ? pathname === fullHref
                : pathname === fullHref || pathname.startsWith(fullHref + "/");
            return (
              <Link
                key={label}
                href={fullHref}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all",
                  active
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.55)] border border-white/20"
                    : "text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-100"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-white" : color)} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function TripBottomNav({ tripId }: { tripId: string }) {
  const pathname = usePathname() || "";
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t-2 border-cyan-500/30 bg-slate-950/95 backdrop-blur shadow-[0_-2px_24px_rgba(34,211,238,0.18)]">
      <div className="grid grid-cols-5">
        {mobileTabs.map(({ href, label, icon: Icon }) => {
          const fullHref = `/trips/${tripId}${href}`;
          const active =
            href === ""
              ? pathname === fullHref
              : pathname === fullHref || pathname.startsWith(fullHref + "/");
          return (
            <Link
              key={label}
              href={fullHref}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 text-[10px] gap-0.5 font-bold uppercase tracking-wider",
                active ? "text-cyan-200" : "text-slate-400"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-cyan-200")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
