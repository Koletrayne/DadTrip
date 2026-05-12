import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { TripHeader } from "@/components/TripHeader";
import { TripSidebar, TripBottomNav } from "@/components/TripNav";
import { getTrip } from "@/lib/mock-data";
import { TripProvider } from "./TripContext";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();

  return (
    <>
      <SiteHeader />
      <TripHeader trip={trip} />
      <TripProvider trip={trip}>
        <main className="arcade-page container-page py-6 md:py-8 pb-24 md:pb-8">
          <div className="md:flex md:gap-8">
            <TripSidebar tripId={trip.id} />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </main>
      </TripProvider>
      <TripBottomNav tripId={trip.id} />
    </>
  );
}
