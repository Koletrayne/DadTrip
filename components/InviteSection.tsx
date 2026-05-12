"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Mail } from "lucide-react";

export function InviteSection({ tripId }: { tripId: string }) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${origin}/join/${tripId}`;

  function handleCopy() {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardContent className="p-5 md:p-6">
        <div className="grid md:grid-cols-2 gap-3 items-end">
          <div>
            <div className="arcade-font text-[10px] tracking-wider mb-1.5 text-cyan-300">RECRUIT A HERO BY EMAIL</div>
            <div className="flex gap-2">
              <Input placeholder="grandma@example.com" />
              <Button>
                <Mail className="h-4 w-4" /> Invite
              </Button>
            </div>
          </div>
          <div>
            <div className="arcade-font text-[10px] tracking-wider mb-1.5 text-cyan-300">OR SEND A QUEST SCROLL</div>
            <div className="flex gap-2">
              <Input readOnly value={joinUrl} className="font-mono text-xs" />
              <Button variant="outline" onClick={handleCopy}>
                {copied
                  ? <><Check className="h-4 w-4 text-emerald-400" /> Copied</>
                  : <><Copy className="h-4 w-4" /> Copy</>
                }
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
