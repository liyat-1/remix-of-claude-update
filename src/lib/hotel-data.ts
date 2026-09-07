export type Health = "healthy" | "warning" | "failed" | "neutral";

export type Feature = { name: string; status: Health };
export type FeatureGroup = { label: string; features: Feature[] };

export type Scenario = "live" | "onboarding" | "unhealthy" | "churned" | "sparse";

export type Hotel = {
  scenario: Scenario;
  name: string;
  displayId: string;
  website: string;
  websiteLabel: string;
  localTime: string;
  timezone: string;
  identity: {
    group: string;
    rooms: string;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    pms: string;
    bookingEngine: string;
    parentChain: string;
    chain: string;
    addedOn: string;
  };
  health: {
    healthy: number;
    total: number;
    groups: FeatureGroup[];
  };
  sync: {
    pms: string;
    pmsStatus: { label: string; status: Health };
    bookingEngine: string;
    beSync: { label: string; status: Health };
    lastBeSync: string;
    proxy: { label: string; status: Health };
    jobs: Feature[];
  };
  onboarding: null | {
    stage: string;
    mandatory: { label: string; state: "complete" | "action" | "pending"; action?: string }[];
    optional: { label: string; value: string }[];
  };
  people: {
    csm: string;
    salesAgent: string;
    referrer: string;
    emails: { name: string; role: string; email: string }[];
  };
  legal: {
    legalName: string;
    dba: string;
    supportEmail: string;
    ein: string;
    tcrBrandId: string;
    tcrCampaignId: string;
    billingAddress: string;
    invoiceAddress: string;
  } | null;
  service: {
    status: "Active" | "Churned" | "Not started";
    startedOn: string;
    churnDate: string | null;
    addedOn: string;
    configurationStage: string;
    setBy: string;
    setOn: string;
    tags: string[];
  };
  links: { label: string; value: string; href: string }[];
  settings: {
    title: string;
    rows: { label: string; value: string; action?: string }[];
  }[];
};

const baseFeatureGroups: FeatureGroup[] = [
  {
    label: "Services & fees",
    features: [
      { name: "Services & fees", status: "healthy" },
      { name: "Arrivals & In-house", status: "warning" },
      { name: "Bookings", status: "failed" },
    ],
  },
  {
    label: "Analytics",
    features: [
      { name: "Subscribers", status: "failed" },
      { name: "Outreach", status: "failed" },
      { name: "OTA Outreach", status: "failed" },
      { name: "Conversions", status: "failed" },
      { name: "Reviews", status: "failed" },
    ],
  },
  {
    label: "Messaging",
    features: [
      { name: "In-property messaging", status: "failed" },
      { name: "Chatbot", status: "warning" },
      { name: "Announcements", status: "failed" },
    ],
  },
  {
    label: "Automated messages",
    features: [
      { name: "Campaigns", status: "failed" },
      { name: "OTA Campaigns", status: "failed" },
    ],
  },
];

const healthyGroups: FeatureGroup[] = baseFeatureGroups.map((g) => ({
  ...g,
  features: g.features.map((f) => ({ ...f, status: "healthy" as Health })),
}));

const mixedGroups: FeatureGroup[] = baseFeatureGroups.map((g, gi) => ({
  ...g,
  features: g.features.map((f, i) => ({
    ...f,
    status: (gi + i) % 3 === 0 ? "healthy" : (gi + i) % 3 === 1 ? "warning" : "failed",
  })),
}));

const countHealthy = (groups: FeatureGroup[]) =>
  groups.reduce((n, g) => n + g.features.filter((f) => f.status === "healthy").length, 0);

const totalFeatures = (groups: FeatureGroup[]) =>
  groups.reduce((n, g) => n + g.features.length, 0);

const identity = {
  group: "AD1 Global",
  rooms: "130",
  checkIn: "4:00 PM",
  checkOut: "11:00 AM",
  hotelId: "FLLTA",
  pms: "Marriott GXP",
  bookingEngine: "marriott.com",
  parentChain: "Marriott",
  chain: "Marriott Hotels",
  addedOn: "Jul 29, 2026",
};

const legal = {
  legalName: "Hotel at Marina Bay LLC",
  dba: "DBA Maritime Hotel - Ft Lauderdale",
  supportEmail: "clarissa.canaan@ad1hospitality.com",
  ein: "65-0955133",
  tcrBrandId: "BCJMQXQ",
  tcrCampaignId: "CRC1GJ6",
  billingAddress: "2161 Maritime Blvd, Fort Lauderdale, FL 33312, USA",
  invoiceAddress: "2161 Maritime Blvd, Fort Lauderdale, FL 33312, USA",
};

const emails = [
  { name: "Sammie Bashirian", role: "Hotel contact", email: "maritimehotelfortlauderdale@ad1hospitality.com" },
  { name: "Rosetta Herzog", role: "PMS integration", email: "rosetta.herzog@ai.directful.com" },
  { name: "Phoebe Reichel", role: "PMS integration", email: "phoebe.reichel@ai.directful.com" },
];

const links = [
  { label: "Website", value: "marriott.com", href: "#site" },
  { label: "TripAdvisor", value: "Review page", href: "#tripadvisor" },
  { label: "Privacy", value: "Policy", href: "#privacy" },
  { label: "Terms", value: "Terms of service", href: "#terms" },
  { label: "Hotline", value: "(954) 533-7846", href: "#hotline" },
];

const settings = [
  {
    title: "Plan & Billing",
    rows: [
      { label: "Setup fee", value: "$349.00 · Active since Aug 1, 2026" },
      { label: "Engage", value: "$349.00 · Active since Aug 1, 2026" },
      { label: "Payment cycle", value: "Quarterly Payment" },
      { label: "Manage plan", value: "", action: "Manage Plan" },
    ],
  },
  {
    title: "Billing details",
    rows: [
      { label: "Reconciliation period", value: "0 days" },
      { label: "Payment period", value: "0 days" },
      { label: "Auto payments", value: "Enabled" },
    ],
  },
  {
    title: "Billing tax details",
    rows: [{ label: "Billing tax rate", value: "0" }],
  },
  {
    title: "ACH authorization",
    rows: [
      { label: "Recipient", value: "Select user" },
      { label: "ACH Auth Form", value: "", action: "Send ACH Auth Form" },
    ],
  },
  {
    title: "Rate codes",
    rows: [{ label: "Configured rate codes", value: "Managed in rate code editor", action: "Edit" }],
  },
  {
    title: "Hosted messaging",
    rows: [{ label: "Status", value: "NotStarted", action: "Edit" }],
  },
  {
    title: "Proxy numbers",
    rows: [
      { label: "Provider", value: "Bandwidth" },
      { label: "(954) 408-4642", value: "Primary · Active · Bandwidth" },
      { label: "Additional numbers", value: "", action: "Buy another phone number" },
    ],
  },
  {
    title: "Guest landing page",
    rows: [
      { label: "Guest landing page URL", value: "mh.directful.com" },
      { label: "Domain", value: "Default domain", action: "Edit" },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { label: "Use chatbot", value: "Enabled" },
      { label: "Loyalty program outreach", value: "Only sends to non-members · Disabled" },
      { label: "Chatbot help messages", value: "Configured", action: "Edit" },
    ],
  },
  {
    title: "Booking engine",
    rows: [
      { label: "Booking engine", value: "marriott.com · FLLTA" },
      { label: "Test URL", value: "", action: "Test URL" },
    ],
  },
  {
    title: "Documents",
    rows: [
      { label: "Merchant documents", value: "Contract-Jul 06 2022 06:07:54 · application/pdf" },
      { label: "Subsidiary documents", value: "No documents found" },
    ],
  },
  {
    title: "Exclusions & amenities",
    rows: [
      { label: "Property exclusions", value: "No exclusions" },
      { label: "Chain exclusions", value: "24 exclusions", action: "See all" },
      { label: "Amenities & services", value: "No amenities found" },
      { label: "Tracking info", value: "directful-test-ota (1)" },
      { label: "Add exclusions", value: "", action: "Add exclusions" },
    ],
  },
  {
    title: "Management Company Change",
    rows: [{ label: "Transfer management company", value: "", action: "Start change" }],
  },
];

const jobs: Feature[] = [
  { name: "ReservationUpdatesV2", status: "healthy" },
  { name: "GuestUpdates", status: "healthy" },
  { name: "FolioSync", status: "warning" },
  { name: "RateCodeSync", status: "healthy" },
];

function base(scenario: Scenario): Hotel {
  return {
    scenario,
    name: "Maritime Hotel Fort Lauderdale Airport & Cruiseport",
    displayId: "#921",
    website:
      "https://www.marriott.com/en-us/hotels/fllta-maritime-hotel-fort-lauderdale-airport-and-cruiseport/overview/",
    websiteLabel: "www.marriott.com/en-us/hotels/fllta-maritime-hotel-fort-lauderdale-airport-and-cruiseport",
    localTime: "09:02 AM",
    timezone: "UTC -5 / USD",
    identity,
    health: { healthy: countHealthy(healthyGroups), total: totalFeatures(healthyGroups), groups: healthyGroups },
    sync: {
      pms: "Marriott GXP",
      pmsStatus: { label: "Integrated", status: "healthy" },
      bookingEngine: "marriott.com",
      beSync: { label: "Synced", status: "healthy" },
      lastBeSync: "Sep 7, 2026 · 06:12 AM",
      proxy: { label: "Active · Bandwidth", status: "healthy" },
      jobs,
    },
    onboarding: null,
    people: { csm: "Lakshay Tyagi", salesAgent: "Lindsay Wenger", referrer: "Directful.com", emails },
    legal,
    service: {
      status: "Active",
      startedOn: "Aug 01, 2026",
      churnDate: null,
      addedOn: "Jul 29, 2026",
      configurationStage: "Basic account",
      setBy: "Huseyin Kartal",
      setOn: "Aug 14, 2026",
      tags: ["Priority", "Cruiseport"],
    },
    links,
    settings,
  };
}

export const scenarios: Record<Scenario, Hotel> = {
  live: base("live"),
  onboarding: {
    ...base("onboarding"),
    health: {
      healthy: countHealthy(baseFeatureGroups),
      total: totalFeatures(baseFeatureGroups),
      groups: baseFeatureGroups,
    },
    sync: {
      ...base("onboarding").sync,
      pmsStatus: { label: "Not integrated", status: "neutral" },
      beSync: { label: "Not synced", status: "warning" },
      lastBeSync: "Not synced",
      jobs: [],
    },
    onboarding: {
      stage: "Initial Payment Stage",
      mandatory: [
        { label: "Campaign Registry", state: "complete" },
        { label: "PMS sync", state: "action", action: "Set up" },
        { label: "TripAdvisor", state: "complete" },
        { label: "Review settings", state: "complete" },
        { label: "Booking engine", state: "complete" },
        { label: "Billing & invoice address", state: "complete" },
        { label: "Phone number", state: "complete" },
        { label: "Brand logo and colors", state: "complete" },
      ],
      optional: [
        { label: "Hosted messaging", value: "Edit" },
        { label: "Chatbot responses", value: "0/13" },
        { label: "OTA promo", value: "no promo" },
        { label: "Direct promo", value: "no promo" },
        { label: "Users", value: "3" },
        { label: "Enabled campaigns", value: "-" },
        { label: "Domain", value: "http://mh.directful.com" },
        { label: "Marketing URL", value: "marriott-hotels/FortLauderdale" },
      ],
    },
    service: { ...base("onboarding").service, status: "Not started", startedOn: "Aug 01, 2026" },
  },
  unhealthy: {
    ...base("unhealthy"),
    health: { healthy: 5, total: totalFeatures(mixedGroups), groups: mixedGroups },
    sync: {
      ...base("unhealthy").sync,
      pmsStatus: { label: "Failed", status: "failed" },
      beSync: { label: "Not synced", status: "failed" },
      lastBeSync: "Aug 28, 2026 · 11:40 PM",
      proxy: { label: "Degraded · Bandwidth", status: "warning" },
      jobs: [
        { name: "ReservationUpdatesV2", status: "failed" },
        { name: "GuestUpdates", status: "warning" },
        { name: "FolioSync", status: "failed" },
        { name: "RateCodeSync", status: "healthy" },
      ],
    },
  },
  churned: {
    ...base("churned"),
    health: {
      healthy: 1,
      total: totalFeatures(baseFeatureGroups),
      groups: baseFeatureGroups,
    },
    sync: {
      ...base("churned").sync,
      pmsStatus: { label: "Not integrated", status: "neutral" },
      beSync: { label: "Not synced", status: "neutral" },
      lastBeSync: "Jun 30, 2026 · 04:02 AM",
      proxy: { label: "No proxy", status: "neutral" },
      jobs: [],
    },
    service: {
      status: "Churned",
      startedOn: "Aug 01, 2025",
      churnDate: "Jun 30, 2026",
      addedOn: "Jul 29, 2025",
      configurationStage: "Basic account",
      setBy: "Huseyin Kartal",
      setOn: "Aug 14, 2025",
      tags: ["Churn risk"],
    },
  },
  sparse: {
    ...base("sparse"),
    health: {
      healthy: 0,
      total: totalFeatures(baseFeatureGroups),
      groups: baseFeatureGroups.map((g) => ({
        ...g,
        features: g.features.map((f) => ({ ...f, status: "neutral" as Health })),
      })),
    },
    sync: {
      ...base("sparse").sync,
      pmsStatus: { label: "Not integrated", status: "neutral" },
      beSync: { label: "Not synced", status: "neutral" },
      lastBeSync: "Not synced",
      proxy: { label: "No proxy", status: "neutral" },
      jobs: [],
    },
    people: { csm: "Lakshay Tyagi", salesAgent: "Lindsay Wenger", referrer: "Directful.com", emails: [] },
    legal: null,
    service: {
      status: "Not started",
      startedOn: "—",
      churnDate: null,
      addedOn: "Jul 29, 2026",
      configurationStage: "Basic account",
      setBy: "Huseyin Kartal",
      setOn: "Aug 14, 2026",
      tags: [],
    },
  },
};

export const scenarioLabels: { id: Scenario; label: string }[] = [
  { id: "live", label: "Live hotel" },
  { id: "onboarding", label: "Onboarding" },
  { id: "unhealthy", label: "Mixed health" },
  { id: "churned", label: "Churned" },
  { id: "sparse", label: "Sparse data" },
];
