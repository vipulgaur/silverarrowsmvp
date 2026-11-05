import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        danger: "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400",
        warning: "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Semantic "tone" aliases used by status call sites (operations, CBTA, etc.).
 * These map onto the canonical variants so call sites can express intent
 * (ok/warn/bad/info/neutral) without inventing per-element styles.
 */
export type BadgeTone = "ok" | "warn" | "bad" | "info" | "neutral";

const TONE_TO_VARIANT: Record<BadgeTone, NonNullable<BadgeProps["variant"]>> = {
  ok: "success",
  warn: "warning",
  bad: "danger",
  info: "secondary",
  neutral: "outline",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Semantic alias that resolves to a canonical `variant`. */
  tone?: BadgeTone;
}

function Badge({ className, variant, tone, ...props }: BadgeProps) {
  const resolvedVariant = variant ?? (tone ? TONE_TO_VARIANT[tone] : undefined);
  return <div className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props} />;
}

export { Badge, badgeVariants };
