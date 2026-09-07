import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Card shell with an icon chip header                                 */
/* ------------------------------------------------------------------ */

export function IconChip({
  icon: Icon,
  tone = "primary",
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    neutral: "bg-muted text-muted-foreground",
  } as const;
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-[11px]",
        tones[tone],
        className,
      )}
    >
      <Icon className="size-[18px]" />
    </span>
  );
}

export function CardShell({
  icon,
  tone,
  title,
  subtitle,
  action,
  footer,
  children,
  className,
  bodyClassName,
}: {
  icon?: ComponentType<{ className?: string }>;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-surface",
        "shadow-[0_1px_2px_oklch(0.25_0.03_255/0.03)]",
        "transition-colors duration-200 hover:border-primary/20",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          {icon ? <IconChip icon={icon} tone={tone ?? "primary"} /> : null}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            {subtitle ? (
              <p className="truncate text-[12px] text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-1">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn("min-h-0 flex-1 px-5 pb-5", bodyClassName)}>{children}</div>
      {footer ? (
        <div className="mt-auto border-t border-border px-5 py-3">{footer}</div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Health donut                                                        */
/* ------------------------------------------------------------------ */

type Segment = { value: number; color: string };

export function Donut({
  segments,
  total,
  centerValue,
  centerLabel,
  size = 176,
  thickness = 28,
}: {
  segments: Segment[];
  total: number;
  centerValue: ReactNode;
  centerLabel?: string;
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2 - 1;
  const c = 2 * Math.PI * r;
  const live = segments.filter((s) => s.value > 0);
  // Clean square edges with a small symmetric gap between slices —
  // rounded caps on thick rings bleed over neighbours and look sloppy.
  const gap = live.length > 1 ? Math.min(6, c * 0.02) : 0;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          className="stroke-muted/60"
        />
        {live.map((s, i) => {
          const len = total > 0 ? (s.value / total) * c : 0;
          const start = offset + gap / 2;
          const drawn = Math.max(len - gap, 0.5);
          const dash = `${drawn} ${c - drawn}`;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              strokeWidth={thickness}
              strokeLinecap="butt"
              stroke={s.color}
              strokeDasharray={dash}
              strokeDashoffset={-start}
              style={{ transition: "stroke-dasharray 700ms ease, stroke-dashoffset 700ms ease" }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-[28px] leading-none font-bold tracking-tight text-foreground">
            {centerValue}
          </div>
          {centerLabel ? (
            <div className="mt-1.5 text-[10.5px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              {centerLabel}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60">
      <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="min-w-0 flex-1 truncate text-[12.5px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quick action tile                                                   */
/* ------------------------------------------------------------------ */

export function ActionTile({
  icon: Icon,
  title,
  description,
  onClick,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left",
        "transition-colors duration-200",
        "hover:border-primary/25 hover:bg-surface-muted",
        className,
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold text-foreground">{title}</span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Grouped panel — soft background block used to separate sub-groups    */
/* ------------------------------------------------------------------ */

export function Panel({
  icon: Icon,
  title,
  hint,
  action,
  children,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/70 bg-surface-muted/70 p-4 transition-colors hover:border-border",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        {Icon ? (
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface text-muted-foreground">
            <Icon className="size-3.5" />
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-semibold text-foreground">
            {title}
          </span>
          {hint ? (
            <span className="block truncate text-[11px] text-muted-foreground">{hint}</span>
          ) : null}
        </span>
        {action ? <span className="shrink-0">{action}</span> : null}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Initials avatar                                                     */
/* ------------------------------------------------------------------ */

const avatarTones = [
  "bg-primary/12 text-primary",
  "bg-success-soft text-success",
  "bg-warning-soft text-warning",
  "bg-muted text-muted-foreground",
] as const;

export function InitialsAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const tone =
    avatarTones[
      Math.abs([...name].reduce((a, ch) => a + ch.charCodeAt(0), 0)) % avatarTones.length
    ] ?? avatarTones[0];
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        size === "sm" ? "size-7 text-[10.5px]" : "size-9 text-[12px]",
        tone,
        className,
      )}
    >
      {initials || "–"}
    </span>
  );
}
