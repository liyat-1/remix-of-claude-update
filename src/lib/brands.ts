export type Brand = {
  name: string;
  mark: string;
  /** oklch tokens keep the tiles consistent with the rest of the surface palette */
  bg: string;
  fg: string;
};

export const brands: Brand[] = [
  { name: "Marriott", mark: "M", bg: "oklch(0.38 0.12 20)", fg: "oklch(0.99 0 0)" },
  { name: "Hilton", mark: "H", bg: "oklch(0.35 0.09 250)", fg: "oklch(0.99 0 0)" },
  { name: "Hyatt", mark: "HY", bg: "oklch(0.32 0.05 250)", fg: "oklch(0.99 0 0)" },
  { name: "IHG", mark: "IHG", bg: "oklch(0.42 0.14 30)", fg: "oklch(0.99 0 0)" },
  { name: "Wyndham", mark: "W", bg: "oklch(0.48 0.15 250)", fg: "oklch(0.99 0 0)" },
  { name: "Choice Hotels", mark: "CH", bg: "oklch(0.45 0.13 265)", fg: "oklch(0.99 0 0)" },
  { name: "Best Western", mark: "BW", bg: "oklch(0.4 0.12 255)", fg: "oklch(0.99 0 0)" },
  { name: "Independent", mark: "IND", bg: "oklch(0.55 0.02 250)", fg: "oklch(0.99 0 0)" },
];

export const brandNames = brands.map((b) => b.name);

export function brandFor(name: string): Brand {
  const hit = brands.find((b) => b.name.toLowerCase() === (name ?? "").toLowerCase().trim());
  if (hit) return hit;
  return {
    name: name || "Unbranded",
    mark: (name || "?").slice(0, 2).toUpperCase(),
    bg: "oklch(0.55 0.02 250)",
    fg: "oklch(0.99 0 0)",
  };
}

/** Chains available for each brand, so the chain dropdown stays relevant. */
export const chainsByBrand: Record<string, string[]> = {
  Marriott: [
    "Marriott Hotels",
    "Courtyard by Marriott",
    "Residence Inn",
    "Fairfield by Marriott",
    "AC Hotels",
  ],
  Hilton: ["Hilton Hotels & Resorts", "Hampton by Hilton", "DoubleTree", "Embassy Suites"],
  Hyatt: ["Hyatt Regency", "Hyatt Place", "Hyatt House", "Andaz"],
  IHG: ["Holiday Inn", "Holiday Inn Express", "Crowne Plaza", "Staybridge Suites"],
  Wyndham: ["Wyndham Hotels", "Days Inn", "Ramada", "La Quinta"],
  "Choice Hotels": ["Comfort Inn", "Quality Inn", "Sleep Inn", "Clarion"],
  "Best Western": ["Best Western", "Best Western Plus", "SureStay"],
  Independent: ["Independent"],
};

export const ownerGroups = [
  "AD1 Global",
  "Aimbridge Hospitality",
  "Highgate",
  "Marriott Management",
  "Interstate Hotels",
  "Self-managed",
];
