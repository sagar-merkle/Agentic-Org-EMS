"""ICE -> iQube conversion readiness.

Deterministic and explainable: every point traces to a field on the CRM record, and every
number that is not on the record is a named assumption. Written as plain functions so an
agent can call them as tools later.
"""

from datetime import date, timedelta
from math import ceil
from typing import Literal

from pydantic import BaseModel

from app.domain.models import Customer, IQubeVariant

Tier = Literal["hot", "warm", "cold", "unreachable"]

PETROL_INR_PER_LITRE = 104.0
ICE_REAL_WORLD_KMPL = {"TVS Jupiter": 50.0, "TVS Jupiter 125": 48.0, "TVS Ntorq 125": 42.0}
ICE_WARRANTY_YEARS = 5
ICE_WARRANTY_KM = 60_000
RIDING_DAYS_PER_YEAR = 300
DAYS_BETWEEN_CHARGES = 3
INSURANCE_WINDOW_DAYS = 60
SAVING_FOR_FULL_POINTS_INR = 30_000
HOT_THRESHOLD = 65
WARM_THRESHOLD = 45


class Assumption(BaseModel):
    label: str
    value: str
    basis: str


ASSUMPTIONS = [
    Assumption(label="Petrol price", value=f"₹{PETROL_INR_PER_LITRE:.0f}/litre", basis="Pune retail, approximate"),
    Assumption(
        label="ICE real-world mileage",
        value=", ".join(f"{m} {k:.0f} km/l" for m, k in ICE_REAL_WORLD_KMPL.items()),
        basis="Owner-reported averages, not certified figures",
    ),
    Assumption(label="iQube running cost", value="₹0.20/km", basis="data/iqube/variants.csv"),
    Assumption(
        label="ICE warranty",
        value=f"{ICE_WARRANTY_YEARS} years / {ICE_WARRANTY_KM:,} km",
        basis="Standard TVS scooter warranty",
    ),
    Assumption(
        label="Daily distance when no commute is on record",
        value=f"annual km ÷ {RIDING_DAYS_PER_YEAR} riding days",
        basis="Convention",
    ),
    Assumption(
        label="Range needed",
        value=f"{DAYS_BETWEEN_CHARGES} days of riding per charge",
        basis="Same buffer rule the sales journey uses for range anxiety",
    ),
]


class Evidence(BaseModel):
    field: str
    value: str


class Factor(BaseModel):
    key: str
    label: str
    points: int
    max_points: int
    note: str
    evidence: list[Evidence]


class VariantMatch(BaseModel):
    variant_id: str
    name: str
    on_road_mid_inr: int
    real_world_range_km: int
    daily_km: float
    daily_km_basis: str
    required_range_km: int
    covers_required_range: bool


class Touchpoint(BaseModel):
    kind: Literal["insurance_renewal"]
    date: date
    days_away: int


class Readiness(BaseModel):
    score: int
    tier: Tier
    vehicle_age_years: float
    estimated_odometer_km: int
    annual_fuel_cost_inr: int
    annual_ev_cost_inr: int
    annual_saving_inr: int
    match: VariantMatch
    touchpoint: Touchpoint | None
    factors: list[Factor]


class Summary(BaseModel):
    owners: int
    ice: int
    ev: int
    hot: int
    warm: int
    cold: int
    unreachable: int
    renewals_in_window: int
    addressable_saving_inr: int


def inr(n: float) -> str:
    """Indian digit grouping: 123456 -> ₹1,23,456."""
    s = str(round(n))
    if len(s) <= 3:
        return f"₹{s}"
    head, tail = s[:-3], s[-3:]
    groups = []
    while len(head) > 2:
        groups.insert(0, head[-2:])
        head = head[:-2]
    if head:
        groups.insert(0, head)
    return "₹" + ",".join(groups + [tail])


def years_between(start: date, end: date) -> float:
    return (end - start).days / 365.25


def estimate_odometer(customer: Customer, as_of: date) -> int:
    """Last recorded odometer rolled forward at the stated annual distance."""
    last = max(customer.service_visits, key=lambda v: v.date, default=None)
    if last is None:
        return round(customer.annual_km * years_between(customer.vehicle.purchase_date, as_of))
    return round(last.odometer_km + customer.annual_km * years_between(last.date, as_of))


def match_variant(customer: Customer, variants: list[IQubeVariant]) -> VariantMatch:
    """Cheapest iQube whose real-world range covers several days of this owner's riding."""
    if customer.daily_commute_km:
        daily_km = float(customer.daily_commute_km)
        basis = "daily_commute_km on record"
    else:
        daily_km = customer.annual_km / RIDING_DAYS_PER_YEAR
        basis = f"annual_km ÷ {RIDING_DAYS_PER_YEAR} riding days, no commute on record"
    required = ceil(daily_km * DAYS_BETWEEN_CHARGES)
    by_price = sorted(variants, key=lambda v: v.on_road_mid_inr)
    pick = next(
        (v for v in by_price if v.real_world_range_km >= required),
        max(variants, key=lambda v: v.real_world_range_km),
    )
    return VariantMatch(
        variant_id=pick.id,
        name=pick.name,
        on_road_mid_inr=pick.on_road_mid_inr,
        real_world_range_km=pick.real_world_range_km,
        daily_km=round(daily_km, 1),
        daily_km_basis=basis,
        required_range_km=required,
        covers_required_range=pick.real_world_range_km >= required,
    )


def _replacement_window(age: float, c: Customer) -> Factor:
    if age >= 6:
        points, note = 25, f"{age:.1f} years old, well past the 5-year mark where replacement talk starts"
    elif age >= 5:
        points, note = 22, f"{age:.1f} years old, just past the 5-year mark"
    elif age >= 4:
        points, note = 16, f"{age:.1f} years old, approaching the 5-year mark"
    elif age >= 3:
        points, note = 9, f"{age:.1f} years old, mid-life"
    else:
        points, note = 3, f"{age:.1f} years old, recently bought"
    return Factor(
        key="replacement_window",
        label="Vehicle age",
        points=points,
        max_points=25,
        note=note,
        evidence=[
            Evidence(field="purchase_date", value=c.vehicle.purchase_date.isoformat()),
            Evidence(field="model", value=c.vehicle.model),
        ],
    )


def _running_cost(c: Customer, fuel: int, ev: int) -> Factor:
    saving = fuel - ev
    points = min(25, round(25 * saving / SAVING_FOR_FULL_POINTS_INR))
    return Factor(
        key="running_cost",
        label="Running-cost saving",
        points=points,
        max_points=25,
        note=f"About {inr(fuel)}/yr on petrol against {inr(ev)}/yr to charge, so {inr(saving)}/yr back",
        evidence=[
            Evidence(field="annual_km", value=f"{c.annual_km:,}"),
            Evidence(field="annual_km_band", value=c.annual_km_band),
            Evidence(field="model", value=c.vehicle.model),
        ],
    )


def _finance_capacity(c: Customer) -> Factor:
    f = c.finance
    if f.kind == "cash":
        points, note = 15, "Bought outright, no finance commitment on record"
    elif f.closed:
        points, note = 15, f"Loan with {f.lender} closed, repayment track record exists"
    else:
        points, note = 3, f"{inr(f.emi_inr or 0)}/mo EMI with {f.lender} still running, so a second loan is a harder ask"
    evidence = [Evidence(field="finance.kind", value=f.kind), Evidence(field="finance.closed", value=str(f.closed).lower())]
    if f.emi_inr:
        evidence.append(Evidence(field="finance.emi_inr", value=f"{f.emi_inr:,}"))
    return Factor(key="finance_capacity", label="Finance headroom", points=points, max_points=15, note=note, evidence=evidence)


def _warranty(c: Customer, age: float, odometer: int, as_of: date) -> Factor:
    by_time = c.vehicle.purchase_date + timedelta(days=round(365.25 * ICE_WARRANTY_YEARS))
    if age >= ICE_WARRANTY_YEARS or odometer >= ICE_WARRANTY_KM:
        reason = "by time" if age >= ICE_WARRANTY_YEARS else "by distance"
        points, note = 10, f"Warranty over {reason}, so every repair is now out of pocket"
    elif by_time - as_of <= timedelta(days=365) or ICE_WARRANTY_KM - odometer <= c.annual_km:
        points, note = 5, "Warranty ends within the next year"
    else:
        points, note = 0, f"Under warranty until {by_time.isoformat()}"
    return Factor(
        key="warranty",
        label="Warranty",
        points=points,
        max_points=10,
        note=note,
        evidence=[
            Evidence(field="purchase_date", value=c.vehicle.purchase_date.isoformat()),
            Evidence(field="odometer (estimated)", value=f"{odometer:,} km"),
        ],
    )


def _relationship(c: Customer) -> Factor:
    points, note = {
        "complete": (10, "Every scheduled service done at the dealer, so the workshop is trusted"),
        "partial": (6, "Some scheduled services skipped"),
        "lapsed": (2, "Stopped coming in for service. Retention risk, so this call is also a win-back"),
    }[c.service_adherence]
    last = max(c.service_visits, key=lambda v: v.date, default=None)
    visits = f"{len(c.service_visits)}, last {last.date.isoformat()}" if last else "none"
    return Factor(
        key="relationship",
        label="Dealer relationship",
        points=points,
        max_points=10,
        note=note,
        evidence=[
            Evidence(field="service_adherence", value=c.service_adherence),
            Evidence(field="service_visits", value=visits),
        ],
    )


def _timing(c: Customer, as_of: date) -> tuple[Factor, Touchpoint | None]:
    days = (c.insurance.expiry_date - as_of).days
    touchpoint = None
    if 0 <= days <= INSURANCE_WINDOW_DAYS:
        points, note = 15, f"Insurance renews in {days} days, a natural reason to call"
        touchpoint = Touchpoint(kind="insurance_renewal", date=c.insurance.expiry_date, days_away=days)
    elif -30 <= days < 0:
        points, note = 10, f"Insurance lapsed {-days} days ago. The renewal call doubles as the EV conversation"
        touchpoint = Touchpoint(kind="insurance_renewal", date=c.insurance.expiry_date, days_away=days)
    else:
        points, note = 0, f"No renewal due in the next {INSURANCE_WINDOW_DAYS} days"
    factor = Factor(
        key="timing",
        label="Reason to call now",
        points=points,
        max_points=15,
        note=note,
        evidence=[
            Evidence(field="insurance.expiry_date", value=c.insurance.expiry_date.isoformat()),
            Evidence(field="insurance.provider", value=c.insurance.provider),
        ],
    )
    return factor, touchpoint


def assess(customer: Customer, variants: list[IQubeVariant], as_of: date) -> Readiness | None:
    """Readiness to move from a petrol scooter to an iQube. None for owners already on EV."""
    if customer.vehicle.powertrain != "ICE":
        return None

    age = years_between(customer.vehicle.purchase_date, as_of)
    odometer = estimate_odometer(customer, as_of)
    match = match_variant(customer, variants)
    ev_per_km = next(v.running_cost_per_km_inr for v in variants if v.id == match.variant_id)
    fuel = round(customer.annual_km / ICE_REAL_WORLD_KMPL[customer.vehicle.model] * PETROL_INR_PER_LITRE)
    ev = round(customer.annual_km * ev_per_km)
    timing, touchpoint = _timing(customer, as_of)

    factors = [
        _replacement_window(age, customer),
        _running_cost(customer, fuel, ev),
        _finance_capacity(customer),
        _warranty(customer, age, odometer, as_of),
        _relationship(customer),
        timing,
    ]
    score = sum(f.points for f in factors)
    if customer.contactability == "unreachable":
        tier: Tier = "unreachable"
    elif score >= HOT_THRESHOLD:
        tier = "hot"
    elif score >= WARM_THRESHOLD:
        tier = "warm"
    else:
        tier = "cold"

    return Readiness(
        score=score,
        tier=tier,
        vehicle_age_years=round(age, 1),
        estimated_odometer_km=odometer,
        annual_fuel_cost_inr=fuel,
        annual_ev_cost_inr=ev,
        annual_saving_inr=fuel - ev,
        match=match,
        touchpoint=touchpoint,
        factors=factors,
    )


def summarise(customers: list[Customer], readiness: dict[str, Readiness | None]) -> Summary:
    scored = [r for r in readiness.values() if r is not None]
    tiers = [r.tier for r in scored]
    return Summary(
        owners=len(customers),
        ice=len(scored),
        ev=len(customers) - len(scored),
        hot=tiers.count("hot"),
        warm=tiers.count("warm"),
        cold=tiers.count("cold"),
        unreachable=tiers.count("unreachable"),
        renewals_in_window=sum(1 for r in scored if r.touchpoint and r.tier != "unreachable"),
        addressable_saving_inr=sum(r.annual_saving_inr for r in scored if r.tier in ("hot", "warm")),
    )
