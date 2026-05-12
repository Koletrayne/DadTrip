import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "primary" | "orange" | "outline";

const toneClass: Record<Tone, string> = {
  primary: "arcade-button",
  orange:  "arcade-button-orange",
  outline:
    "bg-slate-900/60 text-cyan-100 border-2 border-cyan-500/40 hover:bg-slate-800/70 hover:border-cyan-400/70 transition-colors uppercase tracking-wider font-extrabold",
};

const sizeClass = {
  sm: "px-3 py-2 text-[10px]",
  md: "px-5 py-3 text-xs",
  lg: "px-6 py-3.5 text-sm",
} as const;

type CommonProps = {
  tone?: Tone;
  size?: keyof typeof sizeClass;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

type LinkProps = CommonProps & {
  href: string;
};

export function ArcadeButton(props: ButtonProps | LinkProps) {
  const { tone = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl",
    toneClass[tone],
    sizeClass[size],
    className
  );
  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }
  const { href: _ignore, ...buttonRest } = rest as ButtonProps;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
