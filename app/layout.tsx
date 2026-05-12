import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DadTrip — Plan trips together",
  description:
    "Plan family trips together. Calendar, ideas, votes, tasks, packing, and memories — in one warm, simple board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
