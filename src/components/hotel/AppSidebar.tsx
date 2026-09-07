import {
  BarChart3,
  Bell,
  Building2,
  CalendarRange,
  CreditCard,
  FileText,
  Gauge,
  Home,
  LineChart,
  MessageSquare,
  ScrollText,
  Settings2,
  ShieldCheck,
  Upload,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Item = { label: string; icon: React.ComponentType<{ className?: string }> };

const groups: { title: string; items: Item[] }[] = [
  { title: "", items: [{ label: "Home", icon: Home }] },
  {
    title: "Reports",
    items: [
      { label: "Return on investment", icon: LineChart },
      { label: "Messaging performance", icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Billing and payments", icon: CreditCard },
      { label: "User management", icon: Users },
      { label: "Compliance", icon: ShieldCheck },
      { label: "Hotel details", icon: Building2 },
      { label: "Configure notifications", icon: Bell },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Add guest data", icon: Upload },
      { label: "Hotel setup", icon: Settings2 },
      { label: "Usage stats", icon: Gauge },
      { label: "Occupancy", icon: CalendarRange },
      { label: "Monthly revenue", icon: FileText },
      { label: "Monthly OTA conversions", icon: MessageSquare },
      { label: "Contracts", icon: ScrollText },
    ],
  },
];

export function AppSidebar({ active = "Hotel details" }: { active?: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:block",
        collapsed ? "w-[68px]" : "w-[220px]",
      )}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div className={cn("flex h-[58px] items-center border-b border-sidebar-border", collapsed ? "justify-center px-3" : "px-4")}>
          <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground shadow-sm">
              M
            </span>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold text-sidebar-foreground">MarinaView</div>
              </div>
            ) : null}
          </div>
          {!collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse navigation"
              title="Collapse navigation"
            >
              <PanelLeftClose className="size-4" />
            </Button>
          ) : null}
        </div>
        {collapsed ? (
          <div className="flex justify-center py-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => setCollapsed(false)}
              aria-label="Expand navigation"
              title="Expand navigation"
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          </div>
        ) : null}
        <nav className={cn("flex-1 overflow-y-auto pb-8", collapsed ? "px-2" : "px-2.5 pt-3")}>
          {groups.map((g) => (
             <div key={g.title || "main"} className={cn("mb-4", !g.title && "border-b border-sidebar-border pb-3")}>
               {!collapsed && g.title ? (
                <div className="px-2.5 pb-1.5 text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {g.title}
                </div>
              ) : null}
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const isActive = it.label === active;
                  return (
                    <li key={it.label}>
                      <button
                        type="button"
                        aria-current={isActive ? "page" : undefined}
                        aria-label={collapsed ? it.label : undefined}
                        title={collapsed ? it.label : undefined}
                        className={cn(
                          "group relative flex w-full items-center rounded-md text-left text-[12px] transition-colors",
                          collapsed ? "h-9 justify-center px-0" : "gap-2.5 px-2.5 py-[7px]",
                          isActive
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <it.icon className="size-4 shrink-0" />
                        {!collapsed ? <span className="truncate">{it.label}</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className={cn("border-t border-sidebar-border p-3", collapsed ? "flex justify-center" : "")}> 
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2 py-1")}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">LT</span>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-foreground">Lakshay Tyagi</div>
                <div className="truncate text-[11px] text-muted-foreground">Customer success</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
