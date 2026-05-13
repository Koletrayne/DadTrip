import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Trip } from "@/lib/types";

const COOKIE_NAME = "dadtrip_user_trips";

export async function POST(req: NextRequest) {
  const trip: Trip = await req.json();

  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  let userTrips: Trip[] = [];
  if (existing) {
    try {
      userTrips = JSON.parse(existing);
    } catch {
      userTrips = [];
    }
  }
  userTrips = userTrips.filter((t) => t.id !== trip.id);
  userTrips.push(trip);

  const response = NextResponse.json({ id: trip.id });
  response.cookies.set(COOKIE_NAME, JSON.stringify(userTrips), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
