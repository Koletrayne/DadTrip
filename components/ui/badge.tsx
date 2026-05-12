import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500/15 text-cyan-200 border border-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]",
        sunset:
          "bg-orange-500/15 text-orange-200 border border-orange-400/45 shadow-[0_0_10px_rgba(251,146,60,0.35)]",
        sky: "bg-cyan-500/15 text-cyan-200 border border-cyan-400/40",
        neutral: "bg-slate-700/60 text-slate-200 border border-slate-500/40",
        outline: "bg-transparent border border-cyan-400/40 text-cyan-200",
        success:
          "bg-emerald-500/15 text-emerald-200 border border-emerald-400/45 shadow-[0_0_10px_rgba(74,222,128,0.32)]",
        warning:
          "bg-yellow-500/15 text-yellow-200 border border-yellow-400/45 shadow-[0_0_10px_rgba(250,204,21,0.32)]",
        danger:
          "bg-pink-500/15 text-pink-200 border border-pink-400/45 shadow-[0_0_10px_rgba(244,114,182,0.32)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
