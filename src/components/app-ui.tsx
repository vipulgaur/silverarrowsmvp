import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ChipTone = "ok" | "soon" | "expired" | "none";
export type ChipVariant = "default" | "success" | "warning" | "danger" | "info";

export function Chip({
  children,
  className,
  tone,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: ChipTone;
  variant?: ChipVariant;
}) {
  const resolvedVariant: ChipVariant =
    tone === "ok"
      ? "success"
      : tone === "soon"
        ? "warning"
        : tone === "expired"
          ? "danger"
          : tone === "none"
            ? "default"
            : variant;

  const styles: Record<ChipVariant, string> = {
    default: "bg-muted text-muted-foreground border-border",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    info: "bg-primary/15 text-primary border-primary/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[resolvedVariant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Empty({
  children,
  title,
  description,
  icon: Icon,
  className,
}: {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {Icon && <Icon className="mb-2 h-8 w-8 text-muted-foreground/60" />}
      {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

export function KV({
  k,
  v,
  label,
  value,
  className,
}: {
  k?: ReactNode;
  v?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
  className?: string;
}) {
  const keyNode = k ?? label;
  const valNode = v ?? value ?? "—";
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border/60 py-2 text-xs last:border-b-0",
        className,
      )}
    >
      <span className="text-muted-foreground">{keyNode}</span>
      <span className="text-right font-medium text-foreground">{valNode}</span>
    </div>
  );
}

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}) {
  const actions = children ?? action;
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-xs", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  subtext,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  subtext?: ReactNode;
}) {
  const sub = hint ?? subtext;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="num mt-1 text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
