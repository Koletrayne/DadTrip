import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "arcade-button",
        secondary: "arcade-button-orange",
        outline:
          "bg-slate-900/60 text-cyan-100 border-2 border-cyan-500/40 hover:bg-slate-800/70 hover:border-cyan-400/70",
        ghost: "bg-transparent hover:bg-cyan-500/10 hover:text-cyan-200 text-slate-200",
        link: "text-cyan-300 hover:text-cyan-100 hover:underline underline-offset-4 px-0",
        danger: "bg-pink-600 text-white hover:bg-pink-500 border border-pink-400/50 shadow-[0_0_18px_rgba(244,114,182,0.55)]",
      },
      size: {
        sm: "h-9 px-3 text-[11px]",
        md: "h-11 px-5 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
