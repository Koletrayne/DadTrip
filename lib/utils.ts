import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();
  const monthFmt = (d: Date) => d.toLocaleString("en-US", { month: "short" });
  if (sameMonth) {
    return `${monthFmt(s)} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}`;
  }
  if (sameYear) {
    return `${monthFmt(s)} ${s.getDate()} – ${monthFmt(e)} ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${monthFmt(s)} ${s.getDate()}, ${s.getFullYear()} – ${monthFmt(e)} ${e.getDate()}, ${e.getFullYear()}`;
}

export function daysUntil(dateISO: string) {
  const target = new Date(dateISO);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function eachDay(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  const s = new Date(startISO);
  const e = new Date(endISO);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function formatLongDate(iso: string) {
  return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(iso: string) {
  return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function currency(n?: number) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
