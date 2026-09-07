import { Check, AlertTriangle, X, Minus, Copy } from "lucide-react";
import { toast } from "sonner";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Health } from "@/lib/hotel-data";

export function StatusPill({
  status,
  label,
  className,
}: {
  status: Health;
  label: string;
  className?: string;
}) {
  const map = {
    healthy: { Icon: Check, cls: "bg-success-soft text-success" },
    warning: { Icon: AlertTriangle, cls: "bg-warning-soft text-warning" },
    failed: { Icon: X, cls: "bg-danger-soft text-danger" },
    neutral: { Icon: Minus, cls: "bg-neutral-soft text-muted-foreground" },
  } as const;
  const { Icon, cls } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        cls,
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      {label}
    </span>
  );
}

export function StatusDot({ status, label }: { status: Health; label: string }) {
  const map = {
    healthy: { Icon: Check, cls: "text-success" },
    warning: { Icon: AlertTriangle, cls: "text-warning" },
    failed: { Icon: X, cls: "text-danger" },
    neutral: { Icon: Minus, cls: "text-muted-foreground" },
  } as const;
  const { Icon, cls } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", cls)}>
      <Icon className="size-3.5 shrink-0" strokeWidth={2.75} aria-hidden />
      {label}
    </span>
  );
}

/** Bordered content surface with an optional compact header. */
export function Panel({
  id,
  title,
  eyebrow,
  action,
  footer,
  children,
  className,
  bodyClassName,
}: {
  id?: string;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex scroll-mt-32 flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        "shadow-[0_1px_2px_oklch(0.25_0.03_255/0.03)]",
        className,
      )}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? (
              <div className="text-[11px] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <h2 className="truncate text-[15px] font-semibold text-foreground">{title}</h2>
            ) : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
      {footer ? (
        <div className="border-t border-border bg-surface-muted px-5 py-3">{footer}</div>
      ) : null}
    </section>
  );
}

/** label / value row used inside metadata grids and lists. */
export function MetaRow({
  label,
  value,
  action,
  className,
}: {
  label: string;
  value: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-2 text-sm",
        className,
      )}
    >
      <dt className="shrink-0 text-[13px] text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1.5 text-right text-[14px] font-medium text-foreground">
        {value}
        {action}
      </dd>
    </div>
  );
}

export function Section({
  id,
  title,
  description,
  action,
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-32", className)}>
      <div className="mb-2.5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[13px] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="overflow-hidden rounded-[10px] border border-border bg-surface">
        {children}
      </div>
    </section>
  );
}


export function Field({
  label,
  value,
  mono,
  copyable,
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  copyable?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <div
          className={cn(
            "truncate text-sm font-semibold text-foreground",
            mono && "font-mono tracking-tight",
          )}
        >
          {value}
        </div>
        {copyable ? <CopyButton value={copyable} compact /> : null}
      </div>
    </div>
  );
}

export function CopyButton({
  value,
  label = "Copy",
  compact,
}: {
  value: string;
  label?: string;
  compact?: boolean;
}) {
  const copy = () => {
    void navigator.clipboard?.writeText(value);
    toast.success(label === "Copy" ? "Copied" : `${label}ied`, { description: value });
  };
  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${value}`}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Copy className="size-3.5" aria-hidden />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
    >
      <Copy className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-surface-muted px-4 py-3">
      <span className="text-sm text-muted-foreground">{title}</span>
      {action}
    </div>
  );
}

/** Selectable status control — pick one lifecycle status for the property. */
export function StatusSelector({
  options,
  value,
  onChange,
  className,
}: {
  options: { label: string; tone: Health }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const toneCls: Record<Health, string> = {
    healthy: "border-success/40 bg-success-soft text-success",
    warning: "border-warning/40 bg-warning-soft text-warning",
    failed: "border-danger/40 bg-danger-soft text-danger",
    neutral: "border-border bg-neutral-soft text-foreground",
  };
  const dotCls: Record<Health, string> = {
    healthy: "bg-success",
    warning: "bg-warning",
    failed: "bg-danger",
    neutral: "bg-muted-foreground/50",
  };
  return (
    <div
      role="radiogroup"
      aria-label="Hotel account status"
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {options.map((o) => {
        const selected = o.label === value;
        return (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.label)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              selected
                ? toneCls[o.tone]
                : "border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className={cn("size-2 rounded-full", selected ? dotCls[o.tone] : "bg-border")} />
            {o.label}
            {selected ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
          </button>
        );
      })}
    </div>
  );
}
