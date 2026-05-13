import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { memories as memoriesData, members as membersData } from "@/lib/mock-data";
import { loadTrip } from "@/lib/trip-loader";
import { Avatar } from "@/components/Avatar";
import { BookOpen, Camera, Quote, Sparkles, Upload } from "lucide-react";

const typeMeta = {
  photo: { label: "Photo", icon: Camera, variant: "default" as const },
  quote: { label: "Quote", icon: Quote, variant: "sunset" as const },
  story: { label: "Story", icon: Sparkles, variant: "sky" as const },
  favorite_moment: { label: "Favorite moment", icon: Sparkles, variant: "success" as const },
};

export default async function MemoriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await loadTrip(id);
  if (!trip) notFound();
  const peeps = membersData[id] ?? [];
  const memberById = Object.fromEntries(peeps.map((m) => [m.id, m]));
  const items = memoriesData[id] ?? [];

  return (
    <div className="space-y-6">
      <div className="arcade-panel relative overflow-hidden p-5 md:p-7">
        <div className="relative flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="arcade-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px]">
              <BookOpen className="h-3 w-3" /> ADVENTURE LOG
            </div>
            <h1 className="arcade-title mt-2 text-xl md:text-2xl">TALES OF THE TRAIL</h1>
            <p className="text-slate-300 text-sm mt-1.5">
              Photos, quotes, and favorite moments — saved together for the long winter nights.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Upload className="h-4 w-4" /> Upload photo</Button>
            <Button>Add memory</Button>
          </div>
        </div>
      </div>

      <Card className="border-purple-500/30">
        <CardContent className="p-6">
          <div className="arcade-font text-[9px] tracking-wider text-purple-300">PROMPT</div>
          <h3 className="mt-1 text-lg font-extrabold text-white">What was your favorite moment from this trip?</h3>
          <p className="text-sm text-slate-400 mt-1">A line, a story, or a photo — anything counts.</p>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-slate-400">No memories yet — they&apos;ll show up here after the trip.</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((m) => {
            const type = typeMeta[m.type];
            const Icon = type.icon;
            const author = memberById[m.submittedBy];
            return (
              <Card key={m.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={type.variant}><Icon className="h-3 w-3" /> {type.label}</Badge>
                    <div className="text-xs text-slate-500">{m.createdAt}</div>
                  </div>
                  <div className="text-base leading-relaxed text-slate-200">{m.content}</div>
                  {author && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <Avatar member={author} size={20} /> {author.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
