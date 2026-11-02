import { LENDERS, type Lender, type Variant } from "./catalog";

/** Deterministic simulation of the credit bureau interface. Never an LLM. */
export const CREDIT_PROFILE = {
  bureau: "Simulated CIBIL interface",
  score: 762,
  band: "Very good (750-799)",
  activeLoans: 1,
  monthlyObligations: 6200,
  declaredMonthlyIncome: 62000,
  employment: "Salaried, 4y 2m current employer",
  foirCapPct: 45,
};

export type FinanceOffer = {
  lender: Lender;
  eligible: boolean;
  rejectionReason?: string;
  downPayment: number;
  principal: number;
  tenureMonths: number;
  emi: number;
  totalPayable: number;
  costOfCredit: number;
  ratePct: number;
};

export function emiFor(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 12 / 100;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export type FinanceInput = {
  onRoadPrice: number;
  preferredDownPayment: number;
  emiCap: number;
  tenurePreference: number;
};

export function buildOffers(input: FinanceInput): FinanceOffer[] {
  return LENDERS.map((lender) => {
    const floor = Math.round((lender.minDownPaymentPct / 100) * input.onRoadPrice);
    const downPayment = Math.max(input.preferredDownPayment, floor);
    const principal = input.onRoadPrice - downPayment;
    const tenureMonths = Math.min(input.tenurePreference, lender.maxTenureMonths);
    const emi = Math.round(emiFor(principal, lender.annualRatePct, tenureMonths));
    const eligible = CREDIT_PROFILE.score >= lender.minCibil;
    const totalPayable = emi * tenureMonths + downPayment + lender.processingFee;
    return {
      lender,
      eligible,
      rejectionReason: eligible
        ? undefined
        : `Bureau score ${CREDIT_PROFILE.score} below lender floor ${lender.minCibil}`,
      downPayment,
      principal,
      tenureMonths,
      emi,
      totalPayable,
      costOfCredit: totalPayable - input.onRoadPrice,
      ratePct: lender.annualRatePct,
    };
  });
}

/** Lowest total cost of credit among eligible offers that clear the EMI cap. */
export function rankOffers(offers: FinanceOffer[], emiCap: number): FinanceOffer[] {
  return [...offers].sort((a, b) => {
    const aOk = a.eligible && a.emi <= emiCap ? 0 : 1;
    const bOk = b.eligible && b.emi <= emiCap ? 0 : 1;
    if (aOk !== bOk) return aOk - bOk;
    return a.costOfCredit - b.costOfCredit;
  });
}

export function bestOfferFor(variant: Variant, emiCap = 5000, downPayment = 30000) {
  const offers = rankOffers(
    buildOffers({
      onRoadPrice: variant.onRoadMid,
      preferredDownPayment: downPayment,
      emiCap,
      tenurePreference: 36,
    }),
    emiCap,
  );
  return { offers, best: offers[0] };
}

/** The customer stated ₹5,000. Recommendations are held back from that exact figure. */
export const EMI_STATED_CAP = 5000;
export const EMI_PRUDENCE_CAP = 4800;
export const PREFERRED_DOWN_PAYMENT = 30000;

/**
 * Highest on-road price the customer can carry at the EMI cap, using the
 * cheapest eligible rate in the lender panel. Deterministic, not inferred.
 */
export function affordabilityCeiling(emiCap: number, downPayment: number): number {
  const eligible = LENDERS.filter((l) => CREDIT_PROFILE.score >= l.minCibil);
  const best = eligible.reduce((a, b) => (a.annualRatePct <= b.annualRatePct ? a : b));
  const r = best.annualRatePct / 12 / 100;
  const n = Math.min(36, best.maxTenureMonths);
  const f = Math.pow(1 + r, n);
  const maxPrincipal = (emiCap * (f - 1)) / (r * f);
  return Math.round((maxPrincipal + downPayment) / 1000) * 1000;
}
