import { PRODUCTS, price, product } from "../data/products";
import type { LeadSignals, LeadSource, ProductId, ScoreFactor, Tier } from "../data/types";
import { money } from "../format";

const SOURCE_POINTS: Record<LeadSource, [number, string]> = {
  website: [15, "Website callback request: high intent"],
  existing_owner: [13, "Existing TVS owner, consented to an EV call"],
  service_bay: [12, "Raised from the service bay"],
  referral: [12, "Referred by an owner"],
  call_in: [11, "Called the showroom"],
  walk_in: [9, "Walked into the showroom"],
  ads: [8, "Ad form fill: lower intent"],
};

export const HOT = 70;
export const WARM = 40;

export function tierOf(score: number): Tier {
  return score >= HOT ? "hot" : score >= WARM ? "warm" : "cold";
}

/** Placeholder rubric (0-100) until the lead-scoring model lands. Only score/tier/factors are UI contract. */
export function scoreLead(s: LeadSignals, source: LeadSource, interest: ProductId) {
  const factors: ScoreFactor[] = [];

  const timeline = {
    this_month: [20, "Wants to buy this month"],
    within_3_months: [12, "Buying within 3 months"],
    exploring: [4, "Just exploring"],
    unknown: [0, "Timeline not captured yet"],
  }[s.timeline] as [number, string];
  factors.push({ key: "timeline", label: "Purchase timeline", points: timeline[0], max: 20, note: timeline[1] });

  const ride = { done: [20, "Test ride done"], booked: [10, "Test ride booked"], none: [0, "No test ride yet"] }[
    s.testRide
  ] as [number, string];
  factors.push({ key: "test_ride", label: "Test ride", points: ride[0], max: 20, note: ride[1] });

  let budget: [number, string] = [0, "Budget not captured yet"];
  if (s.budget) {
    const want = product(interest);
    if (want.pune.on_road <= s.budget * 1.05) budget = [15, `${money(s.budget)} covers ${want.name}`];
    else {
      const fits = PRODUCTS.filter((p) => p.pune.on_road <= s.budget! * 1.05);
      budget = fits.length
        ? [9, `${money(s.budget)} fits ${fits[fits.length - 1].name}, not ${want.name}`]
        : [3, `${money(s.budget)} is below every on-road price`];
    }
  }
  factors.push({ key: "budget", label: "Budget fit", points: budget[0], max: 15, note: budget[1] });

  const engagementNote = ["No conversation yet", "Short call, answered basics", "Asked questions", "Engaged, kept every callback"];
  factors.push({
    key: "engagement",
    label: "Engagement",
    points: s.engagement * 5,
    max: 15,
    note: engagementNote[s.engagement],
  });

  const [srcPts, srcNote] = SOURCE_POINTS[source];
  factors.push({ key: "source", label: "Source intent", points: srcPts, max: 15, note: srcNote });

  const fin = {
    within_cap: [10, "Eligible, EMI within stated ceiling"],
    cash: [10, "Paying cash"],
    eligible: [6, "Eligible, EMI above stated ceiling"],
    unknown: [0, "Finance not discussed yet"],
  }[s.finance] as [number, string];
  factors.push({ key: "finance", label: "Finance readiness", points: fin[0], max: 10, note: fin[1] });

  factors.push({
    key: "exchange",
    label: "Exchange vehicle",
    points: s.exchange ? 5 : 0,
    max: 5,
    note: s.exchange ? `Exchanging ${s.exchange}` : "No exchange",
  });

  const score = factors.reduce((a, f) => a + f.points, 0);
  return { score, tier: tierOf(score), factors };
}

export const budgetFor = (interest: ProductId, stretch: number) =>
  Math.round((price(interest) * stretch) / 5000) * 5000;
