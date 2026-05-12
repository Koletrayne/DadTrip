"use client";

import { useEffect, useState } from "react";
import { ArcadeButton } from "./ArcadeButton";
import { Joystick, Map, Trophy } from "lucide-react";

export function InsertCoinScreen({
  onInsert,
  highScoreLabel,
}: {
  onInsert: () => void;
  highScoreLabel?: string;
}) {
  const [pressing, setPressing] = useState(false);

  // Allow Enter / Space to insert coin
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick() {
    if (pressing) return;
    setPressing(true);
    setTimeout(onInsert, 360);
  }

  return (
    <main className="coin-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Top marquee */}
      <div className="absolute top-6 inset-x-0 flex justify-center pointer-events-none">
        <div className="arcade-font text-[9px] tracking-[0.3em] text-cyan-300/80">
          ▰▰▰ DADTRIP ARCADE ▰▰▰
        </div>
      </div>

      {/* Title block */}
      <div className="relative z-10 text-center max-w-3xl">
        <div className="arcade-font text-[10px] tracking-widest text-cyan-300 mb-3">
          ★ A FAMILY ADVENTURE GAME ★
        </div>
        <h1 className="arcade-title text-3xl sm:text-5xl md:text-6xl leading-[1.1] animate-flicker">
          DADTRIP<br />ARCADE
        </h1>
        <p className="mt-5 arcade-font text-[10px] sm:text-[11px] tracking-widest text-pink-300">
          PLAN YOUR NEXT FAMILY QUEST
        </p>

        {/* Animated coin + button */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div
            aria-hidden
            className={
              "h-14 w-14 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-500 ring-4 ring-yellow-300/40 shadow-[0_0_24px_rgba(250,204,21,0.65)] " +
              (pressing ? "scale-50 opacity-0 transition-all duration-300" : "animate-coin-spin")
            }
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 50% 50%, #fde047, #f59e0b 70%)",
            }}
          />
          <div className="blink-text arcade-font text-base sm:text-lg tracking-widest text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.65)]">
            INSERT COIN TO START
          </div>
          <ArcadeButton
            tone="primary"
            size="lg"
            onClick={handleClick}
            disabled={pressing}
            aria-label="Insert coin and start"
            className={pressing ? "scale-95" : undefined}
          >
            🪙 INSERT COIN
          </ArcadeButton>
          <div className="arcade-font text-[10px] tracking-widest text-slate-400">
            1 PLAYER &nbsp;·&nbsp; FAMILY MODE
          </div>
        </div>

        {highScoreLabel && (
          <div className="mt-12 inline-flex items-center gap-2 rounded-xl border-2 border-yellow-400/55 bg-slate-900/80 px-4 py-2 shadow-[0_0_16px_rgba(250,204,21,0.28)]">
            <Trophy className="h-4 w-4 text-yellow-300" />
            <span className="arcade-font text-[10px] tracking-widest text-yellow-200">HIGH SCORE</span>
            <span className="text-sm font-extrabold text-white uppercase tracking-wide">
              {highScoreLabel}
            </span>
          </div>
        )}
      </div>

      {/* Bottom HUD icons */}
      <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-6 text-slate-500 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 arcade-font text-[9px] tracking-widest">
          <Joystick className="h-4 w-4 text-cyan-400/80" /> JOY
        </span>
        <span className="inline-flex items-center gap-1.5 arcade-font text-[9px] tracking-widest">
          <Map className="h-4 w-4 text-purple-400/80" /> MAP
        </span>
        <span className="inline-flex items-center gap-1.5 arcade-font text-[9px] tracking-widest">
          <Trophy className="h-4 w-4 text-yellow-400/80" /> WIN
        </span>
      </div>
    </main>
  );
}
