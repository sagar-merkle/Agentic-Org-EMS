import { useEffect, useState } from "react";

/* Mirrors backend/app/main.py and backend/app/services/ev_readiness.py. */

export type Tier = "hot" | "warm" | "cold" | "unreachable";

export type Evidence = { field: string; value: string };

export type Factor = {
  key: string;
  label: string;
  points: number;
  max_points: number;
  note: string;
  evidence: Evidence[];
};

export type VariantMatch = {
  variant_id: string;
  name: string;
  on_road_mid_inr: number;
  real_world_range_km: number;
  daily_km: number;
  daily_km_basis: string;
  required_range_km: number;
  covers_required_range: boolean;
};

export type Readiness = {
  score: number;
  tier: Tier;
  vehicle_age_years: number;
  estimated_odometer_km: number;
  annual_fuel_cost_inr: number;
  annual_ev_cost_inr: number;
  annual_saving_inr: number;
  match: VariantMatch;
  touchpoint: { kind: "insurance_renewal"; date: string; days_away: number } | null;
  factors: Factor[];
};

export type OwnerRow = {
  id: string;
  name: string;
  area: string;
  model: string;
  powertrain: "ICE" | "EV";
  purchase_date: string;
  annual_km: number;
  service_adherence: "complete" | "partial" | "lapsed";
  preferred_channel: string;
  readiness: Readiness | null;
};

export type SourceInfo = {
  system: string;
  mode: "staged" | "live";
  snapshot_date: string;
  records: number;
};

export type InstalledBase = {
  source: SourceInfo;
  as_of: string;
  summary: {
    owners: number;
    ice: number;
    ev: number;
    hot: number;
    warm: number;
    cold: number;
    unreachable: number;
    renewals_in_window: number;
    addressable_saving_inr: number;
  };
  assumptions: { label: string; value: string; basis: string }[];
  owners: OwnerRow[];
};

export type ServiceVisit = {
  id: string;
  date: string;
  odometer_km: number;
  work: string[];
  cost_inr: number;
  dealer: string;
  scheduled_interval: string;
};

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  area: string;
  city: string;
  vehicle: {
    registration: string;
    model: string;
    variant: string | null;
    powertrain: "ICE" | "EV";
    purchase_date: string;
    ex_showroom_inr: number;
  };
  annual_km: number;
  service_visits: ServiceVisit[];
  insurance: { provider: string; expiry_date: string; ncb_pct: number; claims: number; premium_inr: number };
  finance: { kind: "cash" | "loan"; lender: string | null; closed: boolean; emi_inr: number | null };
  contact: { preferred_channel: string };
  daily_commute_km: number | null;
  household_riders: number | null;
  source: SourceInfo & { record_id: string };
};

export type OwnerDetail = { customer: Customer; readiness: Readiness | null };

export const TIER: Record<Tier, { label: string; colour: string; blurb: string }> = {
  hot: { label: "Hot", colour: "#fb7185", blurb: "Strong case and a reason to call" },
  warm: { label: "Warm", colour: "#fbbf24", blurb: "Good case, timing not yet right" },
  cold: { label: "Cold", colour: "#7c8db5", blurb: "Recently bought or low usage" },
  unreachable: { label: "Unreachable", colour: "#5d6b82", blurb: "No working contact on record" },
};

export const EV_COLOUR = "#34d399";

/** Proxied to the Python backend by next.config.mjs. */
const API = "/backend";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const fetchOwner = (id: string) => get<OwnerDetail>(`/customers/${encodeURIComponent(id)}`);

export type Remote<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string };

export function useInstalledBase(): Remote<InstalledBase> {
  const [state, setState] = useState<Remote<InstalledBase>>({ status: "loading" });
  useEffect(() => {
    let live = true;
    get<InstalledBase>("/installed-base")
      .then((data) => live && setState({ status: "ready", data }))
      .catch((e: Error) => live && setState({ status: "error", message: e.message }));
    return () => {
      live = false;
    };
  }, []);
  return state;
}
