import type { CalendarEvent, Trip } from "./types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toGoogleLocal(dateISO: string, time?: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  if (!time) return `${y}${pad(m)}${pad(d)}`;
  const [hh, mm] = time.split(":").map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function addOneDay(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title });

  if (event.startTime && event.endTime) {
    const start = toGoogleLocal(event.date, event.startTime);
    const end = toGoogleLocal(event.date, event.endTime);
    params.set("dates", `${start}/${end}`);
  } else {
    const start = toGoogleLocal(event.date);
    const end = toGoogleLocal(addOneDay(event.date));
    params.set("dates", `${start}/${end}`);
  }

  const detailParts: string[] = [];
  if (event.description) detailParts.push(event.description);
  if (event.confirmationNumber) detailParts.push(`Confirmation: ${event.confirmationNumber}`);
  if (event.link) detailParts.push(event.link);
  detailParts.push("Planned in DadTrip");
  if (detailParts.length) params.set("details", detailParts.join("\n\n"));

  if (event.location) params.set("location", event.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(s: string) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string) {
  if (line.length <= 75) return line;
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    out.push((i === 0 ? "" : " ") + line.slice(i, i + 73));
    i += 73;
  }
  return out.join("\r\n");
}

function nowStamp() {
  const now = new Date();
  return (
    now.getUTCFullYear() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    "T" +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes()) +
    pad(now.getUTCSeconds()) +
    "Z"
  );
}

export function tripToIcs(trip: Trip, events: CalendarEvent[]) {
  const stamp = nowStamp();
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DadTrip//Trip Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(trip.title)}`,
  ];

  for (const e of events) {
    const allDay = !(e.startTime && e.endTime);
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${e.id}@dadtrip.app`);
    lines.push(`DTSTAMP:${stamp}`);
    if (allDay) {
      lines.push(`DTSTART;VALUE=DATE:${toGoogleLocal(e.date)}`);
      lines.push(`DTEND;VALUE=DATE:${toGoogleLocal(addOneDay(e.date))}`);
    } else {
      lines.push(`DTSTART:${toGoogleLocal(e.date, e.startTime)}`);
      lines.push(`DTEND:${toGoogleLocal(e.date, e.endTime)}`);
    }
    lines.push(`SUMMARY:${escapeIcs(e.title)}`);
    const desc: string[] = [];
    if (e.description) desc.push(e.description);
    if (e.confirmationNumber) desc.push(`Confirmation: ${e.confirmationNumber}`);
    if (e.link) desc.push(e.link);
    desc.push(`Trip: ${trip.title}`);
    lines.push(foldLine(`DESCRIPTION:${escapeIcs(desc.join("\n"))}`));
    if (e.location) lines.push(foldLine(`LOCATION:${escapeIcs(e.location)}`));
    if (e.isOptional) lines.push("STATUS:TENTATIVE");
    else if (e.isConfirmed) lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
