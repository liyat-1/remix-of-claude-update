import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  Eye,
  MonitorPlay,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Stethoscope,
  Bell,
  Search,
  Building,
  Building2,
  BedDouble,
  MapPin,
  Clock3,
  Activity,
  Cable,
  Server,
  Globe,
  RefreshCw,
  PhoneCall,
  Workflow,
  AlertTriangle,
  ListChecks,
  TrendingUp,
  Users,
  Scale,
  BadgeCheck,
  Gauge,
  Link as LinkIcon,
  LogIn,
  LogOut,
  Hash,
  CalendarDays,
  Landmark,
  Receipt,
  UserRound,
  Images,
  Layers,
} from "lucide-react";
import {
  CardShell,
  Donut,
  LegendItem,
  ActionTile,
  Panel,
  InitialsAvatar,
} from "@/components/hotel/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  scenarios,
  scenarioLabels,
  type Scenario,
  type Health,
  type Hotel,
} from "@/lib/hotel-data";
import { brandNames, chainsByBrand, ownerGroups } from "@/lib/brands";

const checkTimes = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "10:00 AM",
  "11:00 AM",
];
import { StatusDot, StatusPill, CopyButton, StatusSelector } from "@/components/hotel/primitives";
import {
  EditDialog,
  type EditTarget,
  type EditField,
  type GalleryImage,
} from "@/components/hotel/EditDialog";
import { SetupDialog } from "@/components/hotel/SetupDialog";
import { RegistryDialog } from "@/components/hotel/RegistryDialog";
import { AppSidebar } from "@/components/hotel/AppSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import propertyImage from "@/assets/hotel-property.jpg";
import lobbyImage from "@/assets/hotel-lobby.jpg";
import roomImage from "@/assets/hotel-room.jpg";
import poolImage from "@/assets/hotel-pool.jpg";
import brandChainLogo from "@/assets/brand-chain.png";
import brandGroupLogo from "@/assets/brand-group.png";
import miniMapImage from "@/assets/mini-map.jpg";

function LiveClock({ timezone, fallback }: { timezone: string; fallback: string }) {
  const offsetMatch = timezone.match(/UTC\s*([+-]?\d+)/);
  const offset = offsetMatch ? Number(offsetMatch[1]) : null;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  let time = fallback;
  let date = "";
  if (now && offset !== null) {
    const shifted = new Date(now.getTime() + (offset * 60 + now.getTimezoneOffset()) * 60000);
    time = shifted.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    date = shifted.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-2 backdrop-blur-sm">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary-foreground/25">
        <Clock3 className="size-5 text-primary-foreground/85" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] tracking-[0.11em] text-primary-foreground/60 uppercase">Local time</span>
        <span className="block font-mono text-[18px] leading-tight font-semibold tabular-nums text-primary-foreground">
          {time} <span className="text-[12px] font-medium text-primary-foreground/60">/ {timezone}</span>
        </span>
        <span className="block text-[10px] text-primary-foreground/60">{date}</span>
      </span>
    </div>
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maritime Hotel #921 · Hotel Workspace" },
      {
        name: "description",
        content:
          "Internal hotel workspace: property identity, operational health, PMS and booking engine connections, people, legal and billing, service status and references.",
      },
      { property: "og:title", content: "Maritime Hotel #921 · Hotel Workspace" },
      {
        property: "og:description",
        content:
          "One coherent workspace for a single hotel: identity, health, connections, people, legal & billing, service and links.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotelWorkspace,
});

/* ---------------------------------------------------------------- */
/* small building blocks                                             */
/* ---------------------------------------------------------------- */

const healthWord: Record<Health, string> = {
  healthy: "Healthy",
  warning: "Attention",
  failed: "Error",
  neutral: "Not configured",
};

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-semibold tracking-[0.11em] text-muted-foreground uppercase">
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  action,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  action?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-6 rounded-lg px-1 py-[7px] transition-colors hover:bg-surface/70">
      <span className="flex shrink-0 items-center gap-2 pt-px text-[12.5px] text-muted-foreground">
        {Icon ? <Icon className="size-3.5 shrink-0 text-muted-foreground/60" /> : null}
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-1.5 text-right text-[13.5px] font-medium text-foreground">
        {value}
        {action}
      </span>
    </div>
  );
}

function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_3px_oklch(0.25_0.03_255/0.03),0_8px_24px_-14px_oklch(0.25_0.03_255/0.15)] transition-all duration-200 hover:border-primary/15 hover:shadow-[0_2px_6px_oklch(0.25_0.03_255/0.04),0_16px_36px_-18px_oklch(0.25_0.03_255/0.2)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ConnRow({
  icon: Icon,
  label,
  sub,
  status,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  status: Health;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60">
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-semibold text-foreground">{label}</span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{sub}</span>
      </span>
      {value ? (
        <StatusPill status={status} label={value} className="shrink-0" />
      ) : (
        <StatusDot status={status} label="" />
      )}
    </div>
  );
}

function Muted({ children }: { children: ReactNode }) {
  return <span className="text-[13px] text-muted-foreground">{children}</span>;
}

/* ---------------------------------------------------------------- */
/* page                                                              */
/* ---------------------------------------------------------------- */

const sectionNav = [
  { id: "snapshot", label: "Health" },
  { id: "identity", label: "Identity" },
  { id: "people", label: "People" },
  { id: "legal", label: "Legal & billing" },
  { id: "service", label: "Service" },
  { id: "links", label: "Links" },
];

const tagLibrary = ["Priority", "Enterprise", "Marriott", "VIP", "Cruiseport", "Churn risk"];

const propertyStatuses = [
  "Active",
  "Onboarding",
  "Attention required",
  "Mixed health",
  "Sparse data",
  "Paused",
  "Churned",
] as const;

const statusTone: Record<string, Health> = {
  Active: "healthy",
  Onboarding: "warning",
  "Attention required": "failed",
  "Mixed health": "warning",
  "Sparse data": "neutral",
  Paused: "neutral",
  Churned: "neutral",
};

/** The account status drives the whole record: health, connections and onboarding. */
const statusScenario: Record<string, Scenario> = {
  Active: "live",
  Onboarding: "onboarding",
  "Attention required": "unhealthy",
  "Mixed health": "unhealthy",
  "Sparse data": "sparse",
  Paused: "sparse",
  Churned: "churned",
};

const statusMeaning: Record<string, string> = {
  Active: "Live and fully configured — every feature and connection is expected to be healthy.",
  Onboarding: "Setup in progress — onboarding steps are still open and connections are not live yet.",
  "Attention required": "Something is failing — features and syncs need to be checked.",
  "Mixed health": "Partly live — some features are healthy while others are failing or unconfigured.",
  "Sparse data": "Very little is filled in — most details, features and connections are still empty.",
  Paused: "Service paused — nothing is configured or syncing right now.",
  Churned: "Service ended — connections are switched off and the record is read-only history.",
};


/** Setting rows that should be a picker instead of a free text box. */
const settingOptions: Record<string, string[]> = {
  "Payment cycle": ["Monthly Payment", "Quarterly Payment", "Annual Payment"],
  "Auto payments": ["Enabled", "Disabled"],
  "Reconciliation period": ["0 days", "15 days", "30 days", "45 days"],
  "Payment period": ["0 days", "15 days", "30 days", "45 days"],
  Status: ["NotStarted", "In progress", "Live", "Paused"],
  Provider: ["Bandwidth", "Twilio", "Telnyx"],
  Domain: ["Default domain", "Custom domain"],
  "Use chatbot": ["Enabled", "Disabled"],
  "Chatbot help messages": ["Configured", "Not configured"],
  "Loyalty program outreach": [
    "Only sends to non-members · Disabled",
    "Only sends to non-members · Enabled",
    "Sends to all guests · Enabled",
  ],
  "Property exclusions": ["No exclusions", "Some exclusions"],
  "Configured rate codes": ["Managed in rate code editor", "Managed by the hotel"],
};

const initialGallery: GalleryImage[] = [
  { id: "exterior", src: propertyImage, label: "Exterior" },
  { id: "lobby", src: lobbyImage, label: "Lobby" },
  { id: "room", src: roomImage, label: "Guest room" },
  { id: "pool", src: poolImage, label: "Rooftop pool" },
];


function HotelWorkspace() {
  const [accountStatus, setAccountStatus] = useState<string>("Active");
  const [store, setStore] = useState<Record<Scenario, Hotel>>(scenarios);
  const [edit, setEdit] = useState<EditTarget>(null);
  const [detail, setDetail] = useState<
    null | "features" | "jobs" | "onboarding" | "settings"
  >(null);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [connChecking, setConnChecking] = useState(false);
  const [connResult, setConnResult] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [setupStep, setSetupStep] = useState<string | null>(null);
  const [registryOpen, setRegistryOpen] = useState(false);
  const [doneSteps, setDoneSteps] = useState<string[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("snapshot");
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
  const [coverId, setCoverId] = useState("exterior");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [healthExpanded, setHealthExpanded] = useState(false);


  const scenario: Scenario = statusScenario[accountStatus] ?? "live";

  const coverImage = gallery.find((g) => g.id === coverId)?.src ?? gallery[0]?.src ?? propertyImage;

  const deleteImage = (id: string) => {
    setGallery((g) => {
      const next = g.filter((i) => i.id !== id);
      if (id === coverId && next[0]) setCoverId(next[0].id);
      return next;
    });
    toast.success("Photo removed");
  };

  const makeCover = (id: string) => {
    setCoverId(id);
    toast.success("Cover photo updated");
  };

  const restoreGallery = () => {
    setGallery(initialGallery);
    toast.success("Photos restored");
  };


  const hotel = store[scenario];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 220);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const patch = (fn: (h: Hotel) => Hotel) =>
    setStore((s) => ({ ...s, [scenario]: fn(s[scenario]) }));

  const goTo = (id: string) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const openEdit = (
    title: string,
    fields: EditField[],
    onSave?: (values: Record<string, string>) => void,
  ) => setEdit(onSave ? { title, fields, onSave } : { title, fields });

  /* ---------------- derived ---------------- */

  const attention = hotel.health.total - hotel.health.healthy;
  const otpUnavailable = scenario === "churned" || scenario === "sparse";
  const statusCheckUnavailable = scenario === "churned";


  const lifecycle = useMemo(() => {
    if (hotel.service.status === "Churned")
      return {
        status: "neutral" as Health,
        label: "Service ended",
        sub: `Churned ${hotel.service.churnDate ?? "—"}`,
      };
    if (hotel.onboarding)
      return {
        status: "warning" as Health,
        label: "Onboarding",
        sub: hotel.onboarding.stage,
      };
    if (hotel.service.status === "Not started")
      return { status: "warning" as Health, label: "Onboarding", sub: "Not started" };
    if (attention > 0)
      return {
        status: (attention > hotel.health.total / 2 ? "failed" : "warning") as Health,
        label: "Attention required",
        sub: `${attention} item${attention > 1 ? "s" : ""} need attention`,
      };
    return {
      status: "healthy" as Health,
      label: "Active",
      sub: `Service started ${hotel.service.startedOn}`,
    };
  }, [hotel, attention]);

  const propertyStatus = accountStatus;
  const propertyStatusTone = statusTone[accountStatus] ?? "neutral";


  const location = useMemo(() => {
    const addr = hotel.legal?.billingAddress;
    if (!addr) return null;
    const parts = addr.split(",").map((p) => p.trim());
    const city = parts[1];
    const state = parts[2]?.split(" ")[0];
    return city && state ? `${city}, ${state}` : null;
  }, [hotel.legal]);

  const counts = useMemo(() => {
    const c = { healthy: 0, warning: 0, failed: 0, neutral: 0 };
    for (const g of hotel.health.groups)
      for (const f of g.features) c[f.status] += 1;
    return c;
  }, [hotel.health.groups]);

  const healthPct = hotel.health.total
    ? Math.round((hotel.health.healthy / hotel.health.total) * 100)
    : 0;

  const defaultStepLabels = [
    "Campaign registry",
    "PMS sync",
    "Booking engine",
    "Proxy number",
    "Brand logo and colors",
  ];

  const onboardingSteps: { label: string; state: "complete" | "action" | "pending"; action?: string }[] =
    hotel.onboarding?.mandatory ??
    defaultStepLabels.map((label) =>
      scenario === "sparse"
        ? { label, state: "action" as const, action: "Set up" }
        : { label, state: "complete" as const },
    );

  const steps = onboardingSteps.map((s) =>
    doneSteps.includes(s.label) ? { ...s, state: "complete" as const } : s,
  );

  const onboardingOptional = hotel.onboarding?.optional ?? [
    { label: "Hosted messaging", value: "Enabled" },
    { label: "Chatbot responses", value: "13/13" },
    { label: "Users", value: String(hotel.people.emails.length) },
    { label: "Enabled campaigns", value: hotel.scenario === "churned" ? "-" : "4" },
    { label: "Domain", value: "mh.directful.com" },
  ];

  const onboardingPct = steps.length
    ? Math.round(
        (steps.filter((s) => s.state === "complete").length / steps.length) *
          100,
      )
    : 0;


  const connectionRows = [
    { label: "PMS", status: hotel.sync.pmsStatus.status },
    { label: "Booking engine", status: hotel.sync.beSync.status },
    { label: "Proxy", status: hotel.sync.proxy.status },
  ];
  const connectionIssues = connectionRows.filter((r) => r.status !== "healthy");

  /* ---------------- actions ---------------- */

  const runStatusCheck = () => {
    if (checking) return;
    setChecking(true);
    setCheckResult(null);
    window.setTimeout(() => {
      setChecking(false);
      setCheckResult(
        attention === 0
          ? "Hotel status is healthy"
          : `Attention required · ${attention} issue${attention > 1 ? "s" : ""} found`,
      );
    }, 1100);
  };

  const getOtp = () => setOtp(String(Math.floor(100000 + Math.random() * 900000)));

  const addTag = (tag: string) => {
    if (hotel.service.tags.includes(tag)) return;
    patch((h) => ({ ...h, service: { ...h.service, tags: [...h.service.tags, tag] } }));
    toast.success("Tag added", { description: tag });
  };

  const removeTag = (tag: string) =>
    patch((h) => ({
      ...h,
      service: { ...h.service, tags: h.service.tags.filter((t) => t !== tag) },
    }));

  const statusOptions = propertyStatuses.map((s) => ({
    label: s,
    tone: statusTone[s] ?? ("neutral" as Health),
  }));

  const setStatus = (next: string) => {
    setAccountStatus(next);
    setConnResult(null);
    setCheckResult(null);
    toast.success(`Account status set to ${next}`, {
      description: "Health, connections and onboarding updated to match.",
    });
  };

  const runConnectionCheck = () => {
    if (connChecking) return;
    setConnChecking(true);
    setConnResult(null);
    window.setTimeout(() => {
      setConnChecking(false);
      setConnResult(
        connectionIssues.length === 0
          ? `All connections responded · checked ${hotel.localTime}`
          : `${connectionIssues.length} connection${connectionIssues.length > 1 ? "s" : ""} still failing: ${connectionIssues
              .map((c) => c.label)
              .join(", ")}`,
      );
      if (connectionIssues.length === 0) toast.success("Connections are healthy");
      else toast.warning("Connection check found issues");
    }, 1200);
  };

  const settingsFields = (title: string): EditField[] => {
    const group = hotel.settings.find((s) => s.title === title);
    if (!group) return [];
    const recipients = [
      hotel.people.csm,
      hotel.people.salesAgent,
      ...hotel.people.emails.map((e) => e.name),
    ].filter(Boolean);
    return group.rows
      .map((r) => {
        if (r.label === "Recipient")
          return {
            label: r.label,
            value: recipients.includes(r.value) ? r.value : (recipients[0] ?? ""),
            type: "select" as const,
            options: recipients,
            hint: "Who receives the ACH authorization form",
            full: true,
          };
        const options = settingOptions[r.label];
        if (options)
          return {
            label: r.label,
            value: options.includes(r.value) ? r.value : (options[0] ?? r.value),
            type: "select" as const,
            options,
          };
        return {
          label: r.label,
          value: r.value,
          placeholder: r.action ? `${r.action}…` : `Enter ${r.label.toLowerCase()}`,
          full: r.value.length > 28 || !!r.action,
        };
      });
  };

  const saveSettings = (title: string) => (v: Record<string, string>) =>
    patch((h) => ({
      ...h,
      settings: h.settings.map((s) =>
        s.title === title
          ? {
              ...s,
              rows: s.rows.map((r) => (v[r.label] !== undefined ? { ...r, value: v[r.label]! } : r)),
            }
          : s,
      ),
    }));

  const editSettings = (title: string) => {
    const fields = settingsFields(title);
    if (!fields.length) {
      toast("Nothing to edit here yet", { description: title });
      return;
    }
    setEdit({ title: title.toLowerCase(), fields, onSave: saveSettings(title) });
  };

  const editManagementCompany = () =>
    setEdit({
      title: "management company change",
      groups: [
        { title: "New management company", hint: "Who takes over this property", icon: Building },
        { title: "Transfer details", hint: "When and why the change happens", icon: CalendarDays },
      ],
      fields: [
        {
          label: "Current company",
          value: hotel.identity.group,
          group: "New management company",
        },
        {
          label: "New company",
          value: "AD1 Global",
          type: "select",
          options: ["AD1 Global", "Marriott Management", "Highgate", "Aimbridge Hospitality", "Other"],
          group: "New management company",
        },
        {
          label: "New billing contact",
          value: hotel.people.emails[0]?.name ?? hotel.people.csm,
          type: "select",
          options: [hotel.people.csm, ...hotel.people.emails.map((e) => e.name)].filter(Boolean),
          group: "New management company",
          full: true,
        },
        { label: "Effective date", value: hotel.service.setOn, group: "Transfer details" },
        {
          label: "Reason",
          value: "Ownership change",
          type: "select",
          options: ["Ownership change", "Contract renewal", "Brand transfer", "Consolidation"],
          group: "Transfer details",
        },
        {
          label: "Notify hotel contacts",
          value: "Yes",
          type: "select",
          options: ["Yes", "No"],
          group: "Transfer details",
        },
      ],
      onSave: (v) => {
        patch((h) => ({
          ...h,
          identity: { ...h.identity, group: v["New company"] ?? h.identity.group },
          service: { ...h.service, setOn: v["Effective date"] ?? h.service.setOn },
        }));
        toast.success("Management company change started", {
          description: `${v["New company"]} · effective ${v["Effective date"]}`,
        });
      },
    });

  const editHotel = () =>
    setEdit({
      title: "hotel",
      groups: [
        { title: "Parent and chain", hint: "Brand, chain and owner group", icon: Building },
        { title: "Property details", hint: "Name, rooms and stay times", icon: BedDouble },
        { title: "Systems & identifiers", hint: "PMS, booking engine and codes", icon: Server },
        { title: "Account status", hint: "How this hotel appears across the workspace", icon: BadgeCheck },
      ],
      fields: [
        {
          label: "Brand",
          value: hotel.identity.parentChain,
          type: "brand",
          options: brandNames,
          group: "Parent and chain",
        },
        {
          label: "Chain",
          value: hotel.identity.chain,
          type: "select",
          options:
            chainsByBrand[hotel.identity.parentChain] ??
            Object.values(chainsByBrand).flat(),
          group: "Parent and chain",
        },
        {
          label: "Owner group",
          value: hotel.identity.group,
          type: "select",
          options: ownerGroups.includes(hotel.identity.group)
            ? ownerGroups
            : [hotel.identity.group, ...ownerGroups],
          group: "Parent and chain",
          full: true,
        },
        {
          label: "Hotel name",
          value: hotel.name,
          placeholder: "e.g. Maritime Hotel Fort Lauderdale",
          group: "Property details",
          full: true,
        },
        {
          label: "Rooms",
          value: hotel.identity.rooms,
          inputType: "number",
          placeholder: "e.g. 130",
          group: "Property details",
        },
        {
          label: "Reservation hotline",
          value: "+19545337846",
          inputType: "tel",
          placeholder: "+1 954 533 7846",
          group: "Property details",
        },
        {
          label: "Check-in",
          value: hotel.identity.checkIn,
          type: "select",
          options: checkTimes,
          group: "Property details",
        },
        {
          label: "Check-out",
          value: hotel.identity.checkOut,
          type: "select",
          options: checkTimes,
          group: "Property details",
        },
        {
          label: "Hotel external ID",
          value: hotel.identity.hotelId,
          hint: "PMS property code",
          placeholder: "e.g. FLLTA",
          group: "Systems & identifiers",
        },
        {
          label: "PMS",
          value: hotel.identity.pms,
          type: "select",
          options: ["Marriott GXP", "Opera Cloud", "Mews", "Cloudbeds", "StayNTouch"],
          group: "Systems & identifiers",
        },
        {
          label: "Booking engine URL",
          value: hotel.website,
          inputType: "url",
          placeholder: "https://www.marriott.com/reservation/availability",
          group: "Systems & identifiers",
          full: true,
        },
        {
          label: "Service start date",
          value: hotel.service.startedOn,
          placeholder: "e.g. Aug 1, 2026",
          group: "Systems & identifiers",
        },
        {
          label: "Locality",
          value: location ?? "",
          placeholder: "e.g. Fort Lauderdale, FL",
          group: "Systems & identifiers",
        },

        {
          label: "Account status",
          value: propertyStatus,
          type: "status",
          statusOptions,
          group: "Account status",
          full: true,
        },
      ],
      gallery: {
        images: gallery,
        coverId,
        onDelete: deleteImage,
        onCover: makeCover,
        onAdd: restoreGallery,
      },
      onSave: (v) => {
        if (v["Account status"] && v["Account status"] !== accountStatus)
          setStatus(v["Account status"]);
        patch((h) => ({
          ...h,
          name: v["Hotel name"] ?? h.name,
          identity: {
            ...h.identity,
            parentChain: v["Brand"] ?? h.identity.parentChain,
            chain: v["Chain"] ?? h.identity.chain,
            group: v["Owner group"] ?? h.identity.group,
            rooms: v["Rooms"] ?? h.identity.rooms,
            checkIn: v["Check-in"] ?? h.identity.checkIn,
            checkOut: v["Check-out"] ?? h.identity.checkOut,
            hotelId: v["Hotel external ID"] ?? h.identity.hotelId,
            pms: v["PMS"] ?? h.identity.pms,
          },
          service: {
            ...h.service,
            startedOn: v["Service start date"] ?? h.service.startedOn,
          },
        }));
      },
    });

  /** People edit covers the whole roster: internal team plus every hotel contact. */
  const editPeople = () => {
    const contacts = hotel.people.emails;
    const contactFields: EditField[] = contacts.flatMap((c, i) => [
      { label: `Contact ${i + 1} name`, value: c.name, group: "Hotel contacts" },
      {
        label: `Contact ${i + 1} role`,
        value: c.role,
        type: "select" as const,
        options: ["Hotel contact", "PMS integration", "Billing", "General manager", "Front desk"],
        group: "Hotel contacts",
      },
      { label: `Contact ${i + 1} email`, value: c.email, group: "Hotel contacts", full: true },
    ]);
    const newIndex = contacts.length + 1;
    setEdit({
      title: "people",
      groups: [
        { title: "Account team", hint: "Who looks after this property internally", icon: UserRound },
        { title: "Hotel contacts", hint: "People at the property", icon: Mail },
        { title: "Add a contact", hint: "Leave blank to skip", icon: Plus },
      ],
      fields: [
        { label: "CSM", value: hotel.people.csm, group: "Account team" },
        { label: "Sales agent", value: hotel.people.salesAgent, group: "Account team" },
        { label: "Referrer", value: hotel.people.referrer, group: "Account team", full: true },
        ...contactFields,
        { label: `Contact ${newIndex} name`, value: "", group: "Add a contact" },
        {
          label: `Contact ${newIndex} role`,
          value: "Hotel contact",
          type: "select",
          options: ["Hotel contact", "PMS integration", "Billing", "General manager", "Front desk"],
          group: "Add a contact",
        },
        { label: `Contact ${newIndex} email`, value: "", group: "Add a contact", full: true },
      ],
      onSave: (v) =>
        patch((h) => {
          const updated = h.people.emails.map((c, i) => ({
            name: v[`Contact ${i + 1} name`] ?? c.name,
            role: v[`Contact ${i + 1} role`] ?? c.role,
            email: v[`Contact ${i + 1} email`] ?? c.email,
          }));
          const addedName = v[`Contact ${newIndex} name`]?.trim();
          const addedEmail = v[`Contact ${newIndex} email`]?.trim();
          if (addedName && addedEmail)
            updated.push({
              name: addedName,
              role: v[`Contact ${newIndex} role`] ?? "Hotel contact",
              email: addedEmail,
            });
          return {
            ...h,
            people: {
              csm: v["CSM"] ?? h.people.csm,
              salesAgent: v["Sales agent"] ?? h.people.salesAgent,
              referrer: v["Referrer"] ?? h.people.referrer,
              emails: updated.filter((c) => c.name || c.email),
            },
          };
        }),
    });
  };

  /** Legal edit covers the entity, registration and both addresses. */
  const editLegal = () => {
    const l = hotel.legal;
    setEdit({
      title: "legal information",
      groups: [
        { title: "Entity", hint: "Registered business details", icon: Landmark },
        { title: "Registration", hint: "Tax and campaign registry identifiers", icon: BadgeCheck },
        { title: "Addresses", hint: "Where invoices and mail go", icon: Receipt },
      ],
      fields: [
        { label: "Legal name", value: l?.legalName ?? "", group: "Entity", full: true },
        { label: "Doing business as", value: l?.dba ?? "", group: "Entity", full: true },
        { label: "Support email", value: l?.supportEmail ?? "", group: "Entity", full: true },
        { label: "EIN", value: l?.ein ?? "", group: "Registration" },
        { label: "TCR brand ID", value: l?.tcrBrandId ?? "", group: "Registration" },
        { label: "TCR campaign ID", value: l?.tcrCampaignId ?? "", group: "Registration" },
        { label: "Billing address", value: l?.billingAddress ?? "", group: "Addresses", full: true },
        { label: "Invoice address", value: l?.invoiceAddress ?? "", group: "Addresses", full: true },
      ],
      onSave: (v) =>
        patch((h) => ({
          ...h,
          legal: {
            legalName: v["Legal name"] ?? "",
            dba: v["Doing business as"] ?? "",
            supportEmail: v["Support email"] ?? "",
            ein: v["EIN"] ?? "",
            tcrBrandId: v["TCR brand ID"] ?? "",
            tcrCampaignId: v["TCR campaign ID"] ?? "",
            billingAddress: v["Billing address"] ?? "",
            invoiceAddress: v["Invoice address"] ?? "",
          },
        })),
    });
  };

  /** Billing edit covers addresses, plan, cycles, tax and ACH in one form. */
  const editBilling = () => {
    const l = hotel.legal;
    const plan = hotel.settings.find((s) => s.title === "Plan & Billing");
    const recipients = [
      hotel.people.csm,
      hotel.people.salesAgent,
      ...hotel.people.emails.map((e) => e.name),
    ].filter(Boolean);
    setEdit({
      title: "billing",
      groups: [
        { title: "Addresses", hint: "Billing and invoice addresses", icon: Receipt },
        { title: "Plan", hint: "What this hotel pays for", icon: Landmark },
        { title: "Payment terms", hint: "Cycles, periods and tax", icon: CalendarDays },
        { title: "ACH authorization", hint: "Who signs the ACH form", icon: BadgeCheck },
      ],
      fields: [
        { label: "Billing address", value: l?.billingAddress ?? "", group: "Addresses", full: true },
        { label: "Invoice address", value: l?.invoiceAddress ?? "", group: "Addresses", full: true },
        {
          label: "Setup fee",
          value: plan?.rows.find((r) => r.label === "Setup fee")?.value ?? "",
          group: "Plan",
          full: true,
        },
        {
          label: "Engage",
          value: plan?.rows.find((r) => r.label === "Engage")?.value ?? "",
          group: "Plan",
          full: true,
        },
        {
          label: "Payment cycle",
          value: plan?.rows.find((r) => r.label === "Payment cycle")?.value ?? "Quarterly Payment",
          type: "select",
          options: settingOptions["Payment cycle"]!,
          group: "Payment terms",
        },
        {
          label: "Auto payments",
          value: "Enabled",
          type: "select",
          options: settingOptions["Auto payments"]!,
          group: "Payment terms",
        },
        {
          label: "Reconciliation period",
          value: "0 days",
          type: "select",
          options: settingOptions["Reconciliation period"]!,
          group: "Payment terms",
        },
        {
          label: "Payment period",
          value: "0 days",
          type: "select",
          options: settingOptions["Payment period"]!,
          group: "Payment terms",
        },
        { label: "Billing tax rate", value: "0", group: "Payment terms" },
        {
          label: "Recipient",
          value: recipients[0] ?? "",
          type: "select",
          options: recipients,
          hint: "Receives the ACH authorization form",
          group: "ACH authorization",
          full: true,
        },
      ],
      onSave: (v) => {
        patch((h) => ({
          ...h,
          legal: h.legal
            ? {
                ...h.legal,
                billingAddress: v["Billing address"] ?? h.legal.billingAddress,
                invoiceAddress: v["Invoice address"] ?? h.legal.invoiceAddress,
              }
            : h.legal,
          settings: h.settings.map((s) => ({
            ...s,
            rows: s.rows.map((r) => (v[r.label] !== undefined ? { ...r, value: v[r.label]! } : r)),
          })),
        }));
      },
    });
  };

  const editService = () =>
    setEdit({
      title: "service",
      groups: [
        { title: "Lifecycle", hint: "Status and key dates", icon: Gauge },
        { title: "Configuration", hint: "How this account is set up", icon: Layers },
      ],
      fields: [
        {
          label: "Account status",
          value: propertyStatus,
          type: "status",
          statusOptions,
          hint: statusMeaning[propertyStatus] ?? "",
          group: "Lifecycle",
          full: true,
        },
        { label: "Service started", value: hotel.service.startedOn, group: "Lifecycle" },
        { label: "Churn date", value: hotel.service.churnDate ?? "", group: "Lifecycle" },
        {
          label: "Configuration stage",
          value: hotel.service.configurationStage,
          type: "select",
          options: ["Basic account", "Advanced account", "Enterprise account"],
          group: "Configuration",
        },
        {
          label: "Onboarding stage",
          value: hotel.onboarding?.stage ?? "Complete",
          type: "select",
          options: [
            "Initial Payment Stage",
            "Integration Stage",
            "Content Stage",
            "Go-live Stage",
            "Complete",
          ],
          group: "Configuration",
        },
      ],
      onSave: (v) => {
        if (v["Account status"] && v["Account status"] !== accountStatus)
          setStatus(v["Account status"]);
        patch((h) => ({
          ...h,
          onboarding:
            h.onboarding && v["Onboarding stage"]
              ? { ...h.onboarding, stage: v["Onboarding stage"] }
              : h.onboarding,
          service: {
            ...h.service,
            startedOn: v["Service started"] ?? h.service.startedOn,
            churnDate: v["Churn date"] ? v["Churn date"] : null,
            configurationStage: v["Configuration stage"] ?? h.service.configurationStage,
          },
        }));
      },
    });

  /** Account edit covers the full record: status, stage, dates, ownership and tags. */
  const editAccount = () =>
    setEdit({
      title: "account",
      groups: [
        { title: "Status", hint: "Drives health, connections and onboarding", icon: BadgeCheck },
        { title: "Record", hint: "Stage, dates and who set it", icon: Layers },
        { title: "Ownership", hint: "Brand, group and management", icon: Building },
        { title: "Tags", hint: "Comma separated", icon: Hash },
      ],
      fields: [
        {
          label: "Account status",
          value: propertyStatus,
          type: "status",
          statusOptions,
          hint: statusMeaning[propertyStatus] ?? "",
          group: "Status",
          full: true,
        },
        {
          label: "Configuration stage",
          value: hotel.service.configurationStage,
          type: "select",
          options: ["Basic account", "Advanced account", "Enterprise account"],
          group: "Record",
        },
        { label: "Added on", value: hotel.service.addedOn, group: "Record" },
        {
          label: "Set by",
          value: hotel.service.setBy,
          type: "select",
          options: [hotel.service.setBy, hotel.people.csm, hotel.people.salesAgent].filter(Boolean),
          group: "Record",
        },
        { label: "Set on", value: hotel.service.setOn, group: "Record" },
        { label: "Service started", value: hotel.service.startedOn, group: "Record" },
        { label: "Churn date", value: hotel.service.churnDate ?? "", group: "Record" },
        { label: "Owner group", value: hotel.identity.group, group: "Ownership", full: true },
        { label: "Brand", value: hotel.identity.parentChain, group: "Ownership" },
        { label: "Chain", value: hotel.identity.chain, group: "Ownership" },
        {
          label: "Tags",
          value: hotel.service.tags.join(", "),
          hint: `Available: ${tagLibrary.join(", ")}`,
          group: "Tags",
          full: true,
        },
      ],
      onSave: (v) => {
        if (v["Account status"] && v["Account status"] !== accountStatus)
          setStatus(v["Account status"]);
        patch((h) => ({
          ...h,
          identity: {
            ...h.identity,
            group: v["Owner group"] ?? h.identity.group,
            parentChain: v["Brand"] ?? h.identity.parentChain,
            chain: v["Chain"] ?? h.identity.chain,
          },
          service: {
            ...h.service,
            configurationStage: v["Configuration stage"] ?? h.service.configurationStage,
            addedOn: v["Added on"] ?? h.service.addedOn,
            setBy: v["Set by"] ?? h.service.setBy,
            setOn: v["Set on"] ?? h.service.setOn,
            startedOn: v["Service started"] ?? h.service.startedOn,
            churnDate: v["Churn date"] ? v["Churn date"] : null,
            tags:
              v["Tags"] !== undefined
                ? v["Tags"]
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : h.service.tags,
          },
        }));
      },
    });

  /* ---------------- render ---------------- */

  const headerActions = (compact?: boolean) => (
    <div className="flex shrink-0 items-center gap-2">
      {compact ? (
        <Button size="sm" onClick={editHotel}>
          <Pencil className="size-4" /> Edit hotel
        </Button>
      ) : null}
      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More hotel actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Hotel utilities</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setDetail("features")}>
            View all features
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDetail("jobs")}>View PMS jobs</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => goTo("links")}>Links & references</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDetail("settings")}>
            Hotel settings

          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <AppSidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-[58px] items-center border-b border-border bg-surface/95 px-4 backdrop-blur md:px-5">
          <div className="hidden h-9 w-[460px] items-center gap-2 rounded-lg bg-muted px-3 text-muted-foreground md:flex">
            <Search className="size-4" />
            <span className="text-[12px]">Search hotels, IDs, or anything…</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
             <Button className="md:hidden" variant="ghost" size="icon" aria-label="Search" title="Search">
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications">
              <Bell className="size-4" />
            </Button>
            <div className="ml-2 hidden items-center gap-2 border-l border-border pl-4 sm:flex">
              <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-primary-foreground">LT</span>
              <span className="text-[11px] font-semibold text-foreground">Lakshay Tyagi</span>
              <span className="text-[10px] text-muted-foreground">{hotel.localTime}<br />{hotel.timezone}</span>
            </div>
          </div>
        </header>

        {/* sticky hotel context bar */}
        <div
          className={cn(
            "sticky top-16 z-30 border-b border-border bg-surface/95 backdrop-blur transition-all duration-200",
            scrolled ? "h-14 opacity-100" : "pointer-events-none h-0 overflow-hidden opacity-0",
          )}
        >
          <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-3 px-8">
            <img
              src={propertyImage}
              alt=""
              width={1024}
              height={768}
              className="size-9 rounded-md object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-foreground">
                {hotel.name} <span className="text-muted-foreground">{hotel.displayId}</span>
              </div>
            </div>
            <StatusDot
              status={attention === 0 ? "healthy" : "warning"}
              label={`${hotel.health.healthy}/${hotel.health.total} healthy`}
            />
            <div className="ml-auto">{headerActions(true)}</div>
          </div>
        </div>

        <main className="mx-auto max-w-[1540px] px-4 pt-4 pb-12 md:px-5">
          {/* ---------------- bento grid ---------------- */}
          <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* account status bar — above the hotel photo */}
            <div className="md:col-span-2 xl:col-span-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.11em] text-muted-foreground uppercase">
                    Account status
                  </span>
                  <StatusPill status={propertyStatusTone} label={propertyStatus} />
                </div>
                <p className="order-3 w-full text-[12px] text-muted-foreground lg:order-none lg:w-auto lg:flex-1">
                  {statusMeaning[propertyStatus] ?? ""}
                </p>
                <StatusSelector
                  className="ml-auto"
                  options={statusOptions}
                  value={propertyStatus}
                  onChange={setStatus}
                />
              </div>
            </div>

            {/* hotel hero — spans full width */}
            <div className="md:col-span-2 xl:col-span-4">
              <header className="grid min-h-[220px] overflow-hidden rounded-2xl border border-border bg-foreground shadow-[0_8px_28px_oklch(0.25_0.03_255/0.1)] lg:grid-cols-[34%_66%]">
                <div className="relative min-h-[200px]">
                  <img
                    src={coverImage}
                    alt={`Exterior of ${hotel.name}`}
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-primary-foreground">
                    <span className="flex items-center gap-1.5 rounded-md bg-foreground/65 px-2 py-1 text-[11px] backdrop-blur-sm">
                      <Images className="size-3.5" />
                      {gallery.length} photo{gallery.length === 1 ? "" : "s"}
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 bg-foreground/70 text-primary-foreground hover:bg-foreground/85"
                      onClick={() => setGalleryOpen(true)}
                      disabled={gallery.length === 0}
                    >
                      View gallery
                    </Button>
                  </div>
                </div>
                <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden p-5 text-primary-foreground md:p-6">
                  <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                  <div className="absolute inset-0 bg-foreground/85" />
                  <div className="relative pt-10 lg:pt-0">
                    <div className="min-w-0 max-w-[760px]">
                      <div className="mb-2 flex items-center gap-2 pr-36 sm:pr-44">
                        <StatusPill status={propertyStatusTone} label={propertyStatus.toUpperCase()} />
                        <span className="text-[12px] opacity-75">Property {hotel.displayId}</span>
                      </div>
                      <h1 className="max-w-3xl text-[28px] leading-[1.12] font-bold text-primary-foreground lg:text-[32px]">
                        {hotel.name}
                      </h1>
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-primary-foreground/85">
                        <span className="flex items-center gap-2">
                          <img src={brandChainLogo} alt={`${hotel.identity.parentChain} logo`} loading="lazy" width={816} height={816} className="size-5 rounded-sm bg-surface object-contain p-0.5" />
                          <span className="font-semibold text-primary-foreground">{hotel.identity.parentChain}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <img src={brandGroupLogo} alt={`${hotel.identity.group} logo`} loading="lazy" width={816} height={816} className="size-5 rounded-sm bg-surface object-contain p-0.5" />
                          <span>{hotel.identity.group}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-primary-foreground/70" />
                          <span>{location}</span>
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 text-foreground">{headerActions()}</div>
                  </div>
                  <div className="relative mt-4 flex flex-wrap items-center gap-4">
                    <LiveClock timezone={hotel.timezone} fallback={hotel.localTime} />
                    <span className="min-w-[90px]">
                      <span className="block text-[10px] text-primary-foreground/60">Hotel ID</span>
                      <span className="mt-1 block text-[13px] font-semibold text-primary-foreground">{hotel.identity.hotelId}</span>
                    </span>
                    <span className="ml-auto rounded-md bg-surface px-3 py-2 text-[11px] font-medium text-foreground shadow-sm"><span className="mr-1.5 inline-block size-2 rounded-full bg-success" />{lifecycle.sub}</span>
                  </div>

                </div>
              </header>
            </div>

            {/* sticky workspace bar — tabs + quick actions */}
            <div className="md:col-span-2 xl:col-span-4">
              <div
                className={cn(
                  "sticky z-20 rounded-2xl border border-border bg-surface/95 px-2 py-2 shadow-sm backdrop-blur",
                  scrolled ? "top-[112px]" : "top-[58px]",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {sectionNav.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActive(s.id)}
                        className={cn(
                          "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                          active === s.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div className="ml-auto flex flex-wrap items-center gap-1.5">
                    <Button size="sm" className="h-8" onClick={editHotel}>
                      <Pencil className="size-3.5" /> Edit hotel
                    </Button>

                    {otpUnavailable ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        disabled
                        title="No OTP history for this hotel"
                      >
                        <KeyRound className="size-3.5" /> No OTP history
                      </Button>
                    ) : (
                      <Popover onOpenChange={(o) => (o ? getOtp() : setOtp(null))}>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">
                            <KeyRound className="size-3.5" /> Last OTP
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-60">
                          <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                            Last OTP
                          </div>
                          <div className="mt-1.5 flex items-center justify-between gap-3">
                            <span className="font-mono text-[22px] font-semibold text-foreground">
                              {otp ?? "······"}
                            </span>
                            {otp ? <CopyButton value={otp} /> : null}
                          </div>
                          <p className="mt-2 text-[12px] text-muted-foreground">
                            Expires in 5 minutes.
                          </p>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Prototype only — ticket 30282 (live status check) is not shipped yet. */}
                    {statusCheckUnavailable ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        disabled
                        title="Service ended — status checks no longer run"
                      >
                        <Stethoscope className="size-3.5" /> Status check off
                      </Button>
                    ) : (
                      <Popover onOpenChange={(o) => o && runStatusCheck()}>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8">
                            <Stethoscope className="size-3.5" /> Check status
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-72">
                          {checking ? (
                            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                              <Loader2 className="size-4 animate-spin" /> Checking hotel status…
                            </div>
                          ) : (
                            <StatusDot
                              status={attention === 0 ? "healthy" : "warning"}
                              label={checkResult ?? "Ready to check"}
                            />
                          )}
                        </PopoverContent>
                      </Popover>
                    )}

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8">
                          <Mail className="size-3.5" /> Emails
                          {hotel.people.emails.length ? (
                            <span className="ml-1 rounded-full bg-muted px-1.5 text-[11px] text-muted-foreground">
                              {hotel.people.emails.length}
                            </span>
                          ) : null}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-80">
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                          Hotel emails
                        </div>
                        {hotel.people.emails.length === 0 ? (
                          <p className="mt-2 text-[12.5px] text-muted-foreground">
                            No hotel emails on record for this property yet.
                          </p>
                        ) : (
                          <div className="mt-2 space-y-1.5">
                            {hotel.people.emails.map((e) => (
                              <div
                                key={e.email}
                                className="flex items-center justify-between gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/60"
                              >
                                <div className="min-w-0">
                                  <a
                                    href={`mailto:${e.email}`}
                                    className="block truncate text-[13px] font-medium text-foreground hover:text-primary hover:underline"
                                  >
                                    {e.email}
                                  </a>
                                  <div className="text-[11px] text-muted-foreground">{e.role}</div>
                                </div>
                                <CopyButton value={e.email} compact />
                              </div>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={() => window.open(hotel.website, "_blank", "noopener")}
                    >
                      <Eye className="size-3.5" /> View as client
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn("h-8", demoMode && "bg-primary/10 text-primary")}
                      onClick={() => {
                        setDemoMode((d) => !d);
                        toast(demoMode ? "Demo mode off" : "Demo mode on", {
                          description: demoMode
                            ? "Back to live property data."
                            : "The property now shows sample data for demos.",
                        });
                      }}
                    >
                      <MonitorPlay className="size-3.5" /> Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>


            {/* operational snapshot — bento row */}
            {/* health — large */}
            <div id="snapshot" className="scroll-mt-[118px] md:col-span-2 xl:col-span-2">
              <CardShell
                icon={Activity}
                tone="primary"
                title="Hotel health"
                subtitle="Feature coverage across the account"
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-[12px]"
                    onClick={() => setDetail("features")}
                  >
                    All features <ChevronRight className="size-3.5" />
                  </Button>
                }
              >
                <div className="flex h-full flex-wrap items-center justify-center gap-6">
                  <Donut
                    total={hotel.health.total}
                    segments={[
                      { value: counts.healthy, color: "var(--success)" },
                      { value: counts.warning, color: "var(--warning)" },
                      { value: counts.failed, color: "var(--danger)" },
                    ]}
                    centerValue={`${healthPct}%`}
                    centerLabel="Healthy"
                  />
                  <div className="min-w-[168px] flex-1 space-y-0.5">
                    <LegendItem
                      color="var(--success)"
                      label="Healthy"
                      value={counts.healthy}
                    />
                    <LegendItem
                      color="var(--warning)"
                      label="Needs attention"
                      value={counts.warning}
                    />
                    <LegendItem color="var(--danger)" label="Failing" value={counts.failed} />
                    <LegendItem
                      color="var(--neutral-soft)"
                      label="Not configured"
                      value={counts.neutral}
                    />
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5">
                      <TrendingUp className="size-4 shrink-0 text-primary" />
                      <span className="text-[12px] text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {hotel.health.healthy}/{hotel.health.total}
                        </span>{" "}
                        features are running normally
                      </span>
                    </div>
                  </div>
                </div>
              </CardShell>
            </div>

            {/* connections — medium */}
            <div className="md:col-span-1 xl:col-span-1">
              <CardShell
                icon={Cable}
                tone={hotel.sync.pmsStatus.status === "healthy" ? "success" : "warning"}
                title="Connections"
                subtitle="Integrations and sync state"
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-[12px]"
                    disabled={!hotel.sync.jobs.length}
                    onClick={() => setDetail("jobs")}
                  >
                    Jobs <ChevronRight className="size-3.5" />
                  </Button>
                }
              >
                <div className="space-y-1.5">
                  <ConnRow
                    icon={Server}
                    label="PMS"
                    sub={hotel.sync.pms}
                    status={hotel.sync.pmsStatus.status}
                    value={hotel.sync.pmsStatus.label}
                  />
                  <ConnRow
                    icon={Globe}
                    label="Booking engine"
                    sub={hotel.sync.bookingEngine}
                    status={hotel.sync.beSync.status}
                    value={hotel.sync.beSync.label}
                  />
                  <ConnRow
                    icon={RefreshCw}
                    label="Last BE sync"
                    sub={hotel.sync.lastBeSync}
                    status="neutral"
                    value=""
                  />
                  <ConnRow
                    icon={PhoneCall}
                    label="Proxy"
                    sub={hotel.sync.proxy.label}
                    status={hotel.sync.proxy.status}
                    value=""
                  />
                  <ConnRow
                    icon={Workflow}
                    label="PMS jobs"
                    sub={
                      hotel.sync.jobs.length
                        ? `${hotel.sync.jobs.length} configured`
                        : "None configured"
                    }
                    status={hotel.sync.jobs.length ? "healthy" : "neutral"}
                    value=""
                  />
                </div>
                <div
                  className={cn(
                    "mt-3 rounded-xl border p-3.5",
                    connectionIssues.length
                      ? "border-warning/25 bg-warning-soft/60"
                      : "border-border bg-muted/40",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {connectionIssues.length ? (
                      <AlertTriangle className="size-4 shrink-0 text-warning" />
                    ) : (
                      <Check className="size-4 shrink-0 text-success" />
                    )}
                    <span
                      className={cn(
                        "text-[13px] font-semibold",
                        connectionIssues.length ? "text-warning" : "text-foreground",
                      )}
                    >
                      {connectionIssues.length === 0
                        ? "All connections healthy"
                        : connectionIssues.length === 1
                          ? `${connectionIssues[0]!.label} sync failed`
                          : `${connectionIssues.length} connections need attention`}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                    {checking
                      ? "Checking connections…"
                      : (checkResult ??
                        (connectionIssues.length
                          ? `Last successful sync: never. ${connectionIssues
                              .map((c) => c.label)
                              .join(", ")} affected — bookings and availability are impacted.`
                          : `Everything responded normally · local time ${hotel.localTime}`))}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 h-9 rounded-lg bg-surface px-3 text-[13px] font-medium shadow-sm"
                    onClick={runStatusCheck}
                    disabled={checking}
                  >
                    {checking ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Stethoscope className="size-4" />
                    )}
                    Check status
                  </Button>
                </div>

              </CardShell>
            </div>

            {/* onboarding — medium */}
            <div className="md:col-span-1 xl:col-span-1">
              <CardShell
                icon={ListChecks}
                tone="warning"
                title="Onboarding"
                subtitle={hotel.onboarding?.stage ?? (onboardingPct === 100 ? "All steps complete" : "Setup in progress")}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-[12px]"
                    onClick={() => setDetail("onboarding")}
                  >
                    All steps <ChevronRight className="size-3.5" />
                  </Button>
                }
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-700"
                      style={{ width: `${onboardingPct}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground">
                    {onboardingPct}%
                  </span>
                </div>
                <div className="space-y-1.5">
                  {steps.slice(0, 5).map((m) => (
                    <div
                      key={m.label}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/60"
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full",
                          m.state === "complete"
                            ? "bg-success-soft text-success"
                            : "bg-warning-soft text-warning",
                        )}
                      >
                        {m.state === "complete" ? (
                          <Check className="size-3.5" strokeWidth={3} />
                        ) : (
                          <Clock3 className="size-3.5" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground">
                        {m.label}
                      </span>
                      {m.state === "complete" ? (
                        <span className="text-[11.5px] font-medium text-muted-foreground">
                          Done
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSetupStep(m.label)}
                          className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary hover:underline"
                        >
                          {m.action ?? "Set up"} <ChevronRight className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-border/70 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full rounded-lg text-[13px] font-medium"
                    onClick={runStatusCheck}
                    disabled={checking}
                  >
                    {checking ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Stethoscope className="size-4" />
                    )}
                    {checking ? "Checking hotel status…" : "Check hotel status"}
                  </Button>
                  {checkResult && !checking ? (
                    <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
                      {checkResult}
                    </p>
                  ) : null}
                </div>
              </CardShell>
            </div>

            {/* identity — bento card */}
            <div id="identity" className="scroll-mt-[118px] md:col-span-2 xl:col-span-2">
              <Surface className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-[10px] bg-primary/10 text-primary">
                      <Building2 className="size-4" />
                    </span>
                    <h2 className="text-[15px] font-semibold text-foreground">Identity</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={editHotel}>
                    Edit
                  </Button>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <Panel icon={Building2} title="Property" hint="Rooms, group and stay times">
                    <div className="space-y-0.5">
                      <Row icon={Layers} label="Group" value={hotel.identity.group} />
                      <Row icon={BedDouble} label="Rooms" value={hotel.identity.rooms} />
                      <Row icon={LogIn} label="Check-in" value={hotel.identity.checkIn} />
                      <Row icon={LogOut} label="Check-out" value={hotel.identity.checkOut} />
                      <Row icon={Building} label="Parent chain" value={hotel.identity.parentChain} />
                    </div>
                  </Panel>
                  <Panel icon={Hash} title="Systems & records" hint="Identifiers and connections">
                    <div className="space-y-0.5">
                      <Row
                        icon={Hash}
                        label="Hotel ID"
                        value={<span className="font-mono">{hotel.identity.hotelId}</span>}
                        action={<CopyButton value={hotel.identity.hotelId} compact />}
                      />
                      <Row icon={Globe} label="Booking engine" value={hotel.identity.bookingEngine} />
                      <Row icon={Server} label="PMS" value={hotel.identity.pms} />
                      <Row icon={CalendarDays} label="Added on" value={hotel.identity.addedOn} />
                    </div>
                  </Panel>
                </div>
              </Surface>
            </div>

            {/* people — bento card */}
            <div id="people" className="scroll-mt-[118px] md:col-span-2 xl:col-span-2">

              <Surface className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-[10px] bg-primary/10 text-primary">
                      <Users className="size-4" />
                    </span>
                    <h2 className="text-[15px] font-semibold text-foreground">People</h2>
                  </div>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <Panel
                    icon={UserRound}
                    title="Account team"
                    hint="Who looks after this property"
                    action={
                      <Button variant="ghost" size="sm" onClick={editPeople}>
                        Edit
                      </Button>
                    }
                  >
                    <div className="space-y-2">
                      {[
                        { role: "CSM", name: hotel.people.csm },
                        { role: "Sales agent", name: hotel.people.salesAgent },
                        { role: "Referrer", name: hotel.people.referrer },
                      ].map((p) => (
                        <div
                          key={p.role}
                          className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface px-3 py-2.5"
                        >
                          <InitialsAvatar name={p.name} />
                          <div className="min-w-0">
                            <div className="truncate text-[13.5px] font-semibold text-foreground">
                              {p.name}
                            </div>
                            <div className="text-[11.5px] text-muted-foreground">{p.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <Panel icon={Mail} title="Hotel emails" hint="Contacts at the property">
                    {hotel.people.emails.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border px-4 py-5 text-center">
                        <Muted>No hotel emails added yet.</Muted>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openEdit("hotel contact", [
                                { label: "Name", value: "" },
                                { label: "Role", value: "" },
                                { label: "Email", value: "" },
                              ])
                            }
                          >
                            <Plus className="size-4" /> Add contact
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {hotel.people.emails.map((e) => (
                          <div
                            key={e.email}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface px-3 py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <InitialsAvatar name={e.name} size="sm" />
                              <div className="min-w-0">
                                <a
                                  href={`mailto:${e.email}`}
                                  className="block truncate text-[13px] font-medium text-foreground hover:text-primary hover:underline"
                                >
                                  {e.email}
                                </a>
                                <div className="text-[11.5px] text-muted-foreground">{e.role}</div>
                              </div>
                            </div>
                            <CopyButton value={e.email} compact />
                          </div>
                        ))}
                      </div>
                    )}
                  </Panel>
                </div>
              </Surface>
            </div>

            {/* legal & billing — bento card */}
            <div id="legal" className="scroll-mt-[118px] md:col-span-2 xl:col-span-4">
              <Surface className="h-full">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-[10px] bg-primary/10 text-primary">
                    <Scale className="size-4" />
                  </span>
                  <h2 className="text-[15px] font-semibold text-foreground">Legal & billing</h2>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <Panel
                    icon={Landmark}
                    title="Legal"
                    hint="Entity and registration"
                    action={
                      <Button variant="ghost" size="sm" onClick={editLegal}>
                        Edit
                      </Button>
                    }
                  >
                    {hotel.legal ? (
                      <div className="space-y-0.5">
                        <Row label="Legal name" value={hotel.legal.legalName} />
                        <Row label="Doing business as" value={hotel.legal.dba} />
                        <Row
                          label="Support email"
                          value={
                            <a
                              href={`mailto:${hotel.legal.supportEmail}`}
                              className="truncate hover:text-primary hover:underline"
                            >
                              {hotel.legal.supportEmail}
                            </a>
                          }
                          action={<CopyButton value={hotel.legal.supportEmail} compact />}
                        />
                        <Row label="EIN" value={<span className="font-mono">{hotel.legal.ein}</span>} />
                        <Row
                          label="TCR brand"
                          value={<span className="font-mono">{hotel.legal.tcrBrandId}</span>}
                        />
                        <Row
                          label="TCR campaign"
                          value={<span className="font-mono">{hotel.legal.tcrCampaignId}</span>}
                        />
                        <Row
                          label="Campaign registry"
                          value={
                            <button
                              type="button"
                              onClick={() => setRegistryOpen(true)}
                              className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                            >
                              Open registry <ArrowUpRight className="size-3.5" />
                            </button>
                          }
                        />
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center">
                        <Muted>Legal information not configured.</Muted>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" onClick={editLegal}>
                            Add legal details
                          </Button>
                        </div>
                      </div>
                    )}
                  </Panel>

                  <Panel
                    icon={Receipt}
                    title="Billing"
                    hint="Addresses and billing settings"
                    action={
                      hotel.legal ? (
                        <Button variant="ghost" size="sm" onClick={editBilling}>
                          Edit
                        </Button>
                      ) : null
                    }
                  >
                    {hotel.legal ? (
                      <div className="space-y-4">
                        <div>
                          <div className="text-[12px] text-muted-foreground">Billing address</div>
                          <div className="text-[13.5px] font-medium text-foreground">
                            {hotel.legal.billingAddress}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] text-muted-foreground">Invoice address</div>
                          <div className="text-[13.5px] font-medium text-foreground">
                            {hotel.legal.invoiceAddress}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Muted>Not configured.</Muted>
                    )}
                    <div className="mt-4 space-y-0.5 border-t border-border pt-1">
                      {hotel.settings
                        .filter((s) =>
                          [
                            "Plan & Billing",
                            "Billing details",
                            "Billing tax details",
                            "ACH authorization",
                            "Rate codes",
                          ].includes(s.title),
                        )
                        .map((s) => (
                          <Row
                            key={s.title}
                            label={s.title}
                            value={
                              <button
                                type="button"
                                onClick={() => editSettings(s.title)}
                                className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                              >
                                View details <ChevronRight className="size-3.5" />
                              </button>
                            }
                          />
                        ))}
                    </div>
                  </Panel>
                </div>
              </Surface>
            </div>

            {/* service & account — bento card */}
            <div id="service" className="scroll-mt-[118px] md:col-span-2 xl:col-span-2">
              <Surface className="h-full">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-[10px] bg-primary/10 text-primary">
                    <BadgeCheck className="size-4" />
                  </span>
                  <h2 className="text-[15px] font-semibold text-foreground">Service & account</h2>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <Panel
                    icon={Gauge}
                    title="Service"
                    hint="Lifecycle and configuration"
                    action={
                      <Button variant="ghost" size="sm" onClick={editService}>
                        Edit
                      </Button>
                    }
                  >
                    <div className="space-y-0.5">
                      <Row icon={CalendarDays} label="Service started" value={hotel.service.startedOn} />
                      <Row icon={Clock3} label="Churn date" value={hotel.service.churnDate ?? "—"} />
                      <Row icon={Layers} label="Configuration stage" value={hotel.service.configurationStage} />
                      <Row
                        icon={Building}
                        label="Management company"
                        value={
                          <button
                            type="button"
                            onClick={() =>
                              toast("Management company change", {
                                description: "Transfer workflow started for this property.",
                              })
                            }
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                          >
                            Start change <ChevronRight className="size-3.5" />
                          </button>
                        }
                      />
                    </div>
                  </Panel>

                  <Panel
                    icon={BadgeCheck}
                    title="Account"
                    hint="Record details and tags"
                    action={
                      <Button variant="ghost" size="sm" onClick={editAccount}>
                        Edit
                      </Button>
                    }
                  >
                    <div className="space-y-0.5">
                      <Row icon={Layers} label="Basic account" value={hotel.service.configurationStage} />
                      <Row icon={CalendarDays} label="Added on" value={hotel.service.addedOn} />
                      <Row icon={UserRound} label="Set by" value={hotel.service.setBy} />
                      <Row icon={Clock3} label="Set on" value={hotel.service.setOn} />
                    </div>
                    <div className="mt-3 border-t border-border/70 pt-3">
                      <div className="text-[12px] text-muted-foreground">Tags</div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {hotel.service.tags.length === 0 ? (
                          <Muted>No tags added yet.</Muted>
                        ) : (
                          hotel.service.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-[12px] font-medium text-foreground"
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                aria-label={`Remove ${t}`}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-0.5 text-[12px] font-medium text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="size-3" /> Add tag
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-56 space-y-2">
                            <Input
                              value={tagQuery}
                              onChange={(e) => setTagQuery(e.target.value)}
                              placeholder="Search tags…"
                              className="h-8"
                            />
                            <div className="space-y-1.5">
                              {tagLibrary
                                .filter((t) => t.toLowerCase().includes(tagQuery.toLowerCase()))
                                .map((t) => (
                                  <label
                                    key={t}
                                    className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-muted"
                                  >
                                    <Checkbox
                                      checked={hotel.service.tags.includes(t)}
                                      onCheckedChange={(c) => (c ? addTag(t) : removeTag(t))}
                                    />
                                    {t}
                                  </label>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </Panel>
                </div>
              </Surface>
            </div>

            {/* links — bento card */}
            <div id="links" className="scroll-mt-[118px] md:col-span-2 xl:col-span-2">
              <Surface className="h-full">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-[10px] bg-primary/10 text-primary">
                    <LinkIcon className="size-4" />
                  </span>
                  <h2 className="text-[15px] font-semibold text-foreground">Links & references</h2>
                </div>
                <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <SubTitle>Hotel</SubTitle>
                    <ul className="space-y-2">
                      {hotel.links
                        .filter((l) => l.label !== "Hotline")
                        .map((l) => (
                          <li key={l.label}>
                            <a
                              href={l.label === "Website" ? hotel.website : l.href}
                              target={l.label === "Website" ? "_blank" : undefined}
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[13.5px] text-foreground hover:text-primary hover:underline"
                            >
                              {l.label}
                              <ExternalLink className="size-3.5 text-muted-foreground" />
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <SubTitle>Contact</SubTitle>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="tel:+19545337846"
                          className="inline-flex items-center gap-1.5 text-[13.5px] text-foreground hover:text-primary hover:underline"
                        >
                          <Phone className="size-3.5 text-muted-foreground" /> (954) 533-7846
                        </a>
                      </li>
                      <li>
                        <Muted>Hotline · front desk</Muted>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <SubTitle>Product</SubTitle>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13.5px] text-foreground hover:text-primary hover:underline"
                        >
                          Booking engine · {hotel.identity.bookingEngine}
                          <ExternalLink className="size-3.5 text-muted-foreground" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="#guest-landing"
                          className="inline-flex items-center gap-1.5 text-[13.5px] text-foreground hover:text-primary hover:underline"
                        >
                          Guest landing page
                          <ExternalLink className="size-3.5 text-muted-foreground" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <SubTitle>Messaging</SubTitle>
                    <ul className="space-y-2 text-[13.5px] text-foreground">
                      <li className="flex items-center gap-1.5">
                        Proxy numbers <Muted>· (954) 408-4642</Muted>
                      </li>
                      <li className="flex items-center gap-1.5">
                        Hosted messaging <Muted>· Not started</Muted>
                      </li>
                    </ul>
                  </div>
                </div>
              </Surface>
            </div>
          </div>
        </main>
      </div>

      {/* ---------------- drawers ---------------- */}
      <EditDialog target={edit} onOpenChange={(o) => !o && setEdit(null)} />

      <SetupDialog
        step={setupStep}
        onOpenChange={(o) => !o && setSetupStep(null)}
        onComplete={(s) => setDoneSteps((d) => (d.includes(s) ? d : [...d, s]))}
      />

      <RegistryDialog
        open={registryOpen}
        onOpenChange={setRegistryOpen}
        brandId={hotel.legal?.tcrBrandId ?? "—"}
        campaignId={hotel.legal?.tcrCampaignId ?? "—"}
        legalName={hotel.legal?.legalName ?? "—"}
        ein={hotel.legal?.ein ?? "—"}
      />

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-[17px]">Property photos</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[70vh] gap-3 overflow-y-auto sm:grid-cols-2">
            {gallery.map((img) => (
              <figure key={img.id} className="overflow-hidden rounded-xl border border-border">
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="flex items-center justify-between px-3 py-2 text-[12px] text-muted-foreground">
                  {img.label}
                  {img.id === coverId ? (
                    <span className="text-[10px] font-semibold tracking-wide text-primary uppercase">
                      Cover
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-border px-6 py-5 text-left">
            <DialogTitle className="text-[17px]">
              {detail === "features"
                ? "Feature status"
                : detail === "jobs"
                  ? "PMS sync jobs"
                  : detail === "settings"
                    ? "Hotel settings"
                    : "Onboarding steps"}
            </DialogTitle>
            <DialogDescription>
              {detail === "features"
                ? `${hotel.health.healthy} / ${hotel.health.total} healthy`
                : detail === "jobs"
                  ? `Last run ${hotel.localTime} · ${hotel.sync.pms}`
                  : detail === "settings"
                    ? "Plan, billing and configuration groups"
                    : hotel.onboarding?.stage}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {detail === "features" ? (
              <div className="space-y-5">
                {hotel.health.groups.map((g) => (
                  <div key={g.label}>
                    <SubTitle>{g.label}</SubTitle>
                    <div className="space-y-0.5">
                      {g.features.map((f) => (
                        <Row
                          key={f.name}
                          label={f.name}
                          value={<StatusDot status={f.status} label={healthWord[f.status]} />}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {detail === "jobs" ? (
              hotel.sync.jobs.length ? (
                <div className="space-y-0.5">
                  {hotel.sync.jobs.map((j) => (
                    <Row
                      key={j.name}
                      label={j.name}
                      value={<StatusDot status={j.status} label={healthWord[j.status]} />}
                    />
                  ))}
                </div>
              ) : (
                <Muted>No PMS jobs are configured for this hotel yet.</Muted>
              )
            ) : null}

            {detail === "settings" ? (
              <div className="space-y-5">
                {hotel.settings.map((g) => (
                  <div key={g.title}>
                    <SubTitle>{g.title}</SubTitle>
                    <div className="space-y-0.5">
                      {g.rows.map((r) => (
                        <Row
                          key={r.label}
                          label={r.label}
                          value={
                            r.action ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setDetail(null);
                                  editSettings(g.title);
                                }}
                                className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                              >
                                {r.action} <ChevronRight className="size-3.5" />
                              </button>
                            ) : (
                              r.value || "—"
                            )
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full text-[12px]"
                        onClick={() => {
                          setDetail(null);
                          editSettings(g.title);
                        }}
                      >
                        Edit {g.title.toLowerCase()}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {detail === "onboarding" ? (
              <div className="space-y-6">
                <div>
                  <SubTitle>Mandatory steps</SubTitle>
                  <div className="space-y-0.5">
                    {steps.map((m) => (
                      <Row
                        key={m.label}
                        label={m.label}
                        value={
                          m.state === "complete" ? (
                            <StatusDot status="healthy" label="Done" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSetupStep(m.label)}
                              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
                            >
                              {m.action ?? "Set up"} <ChevronRight className="size-3.5" />
                            </button>
                          )
                        }
                      />
                      ))}
                  </div>
                </div>
                <div>
                  <SubTitle>Optional</SubTitle>
                  <div className="space-y-0.5">
                    {onboardingOptional.map((o) => (
                      <Row key={o.label} label={o.label} value={o.value} />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
