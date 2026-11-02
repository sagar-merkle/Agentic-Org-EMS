/**
 * TVS iQube product knowledge.
 * Values are from data/iqube/variants.csv + data/iqube/pricing_pune.csv (see data/iqube/README.md).
 * IDC range is a certification figure; estimatedRealWorldRangeKm is IDC x 0.83.
 */

export type Variant = {
  id: string;
  name: string;
  trim: string;
  position: number;
  image: string;
  exShowroom: number;
  onRoadLow: number;
  onRoadMid: number;
  onRoadHigh: number;
  batteryKwh: number;
  idcRangeKm: number;
  realWorldRangeKm: number;
  topSpeedKmph: number;
  accel0to40s: number;
  chargeMinutes: number;
  kerbWeightKg: number;
  storageLitres: number;
  clusterType: string;
  featureCount: number;
  tierFeatures: string[];
  colours: string[];
  accent: string;
};

export const VARIANTS: Variant[] = [
  {
    id: "iqube-2-3-kwh",
    name: "iQube 2.3 kWh",
    trim: "iQube",
    position: 1,
    image: "/scooters/iqube-2-3-kwh.png",
    exShowroom: 119250,
    onRoadLow: 124840,
    onRoadMid: 125914,
    onRoadHigh: 126987,
    batteryKwh: 2.3,
    idcRangeKm: 114,
    realWorldRangeKm: 95,
    topSpeedKmph: 68,
    accel0to40s: 4.7,
    chargeMinutes: 170,
    kerbWeightKg: 109,
    storageLitres: 30,
    clusterType: "LCD Display",
    featureCount: 14,
    tierFeatures: [],
    colours: ["Pearl White", "Walnut Brown", "Titanium Grey"],
    accent: "#8ea0b5",
  },
  {
    id: "iqube-3-1-kwh",
    name: "iQube 3.1 kWh",
    trim: "iQube",
    position: 2,
    image: "/scooters/iqube-3-1-kwh.png",
    exShowroom: 138510,
    onRoadLow: 144813,
    onRoadMid: 146060,
    onRoadHigh: 147306,
    batteryKwh: 3.1,
    idcRangeKm: 123,
    realWorldRangeKm: 102,
    topSpeedKmph: 82,
    accel0to40s: 4.2,
    chargeMinutes: 243,
    kerbWeightKg: 116.8,
    storageLitres: 32,
    clusterType: "TFT Display",
    featureCount: 15,
    tierFeatures: ["Hill hold (unverified across sources)"],
    colours: ["Titanium Grey", "Pearl White", "Starlight Blue-Beige", "Copper Bronze-Beige"],
    accent: "#7f9dd6",
  },
  {
    id: "iqube-millionr-edition",
    name: "iQube MillionR Edition",
    trim: "MillionR Edition",
    position: 3,
    image: "/scooters/iqube-millionr-edition.png",
    exShowroom: 140138,
    onRoadLow: 146501,
    onRoadMid: 147762,
    onRoadHigh: 149024,
    batteryKwh: 3.5,
    idcRangeKm: 145,
    realWorldRangeKm: 120,
    topSpeedKmph: 82,
    accel0to40s: 4.2,
    chargeMinutes: 270,
    kerbWeightKg: 119.1,
    storageLitres: 35.5,
    clusterType: "TFT Display",
    featureCount: 14,
    tierFeatures: ["35.5 L storage", "Type-C port"],
    colours: ["Aurora Green"],
    accent: "#4fbf9a",
  },
  {
    id: "iqube-3-5-kwh",
    name: "iQube 3.5 kWh",
    trim: "iQube",
    position: 4,
    image: "/scooters/iqube-3-5-kwh.png",
    exShowroom: 145653,
    onRoadLow: 152220,
    onRoadMid: 153531,
    onRoadHigh: 154842,
    batteryKwh: 3.5,
    idcRangeKm: 145,
    realWorldRangeKm: 120,
    topSpeedKmph: 82,
    accel0to40s: 4.2,
    chargeMinutes: 270,
    kerbWeightKg: 119.1,
    storageLitres: 32,
    clusterType: "TFT Display",
    featureCount: 14,
    tierFeatures: [],
    colours: [
      "Pearl White",
      "Titanium Grey",
      "Walnut Brown",
      "Starlight Blue-Beige",
      "Copper Bronze-Beige",
    ],
    accent: "#5aa9e6",
  },
  {
    id: "iqube-s-4-7-kwh",
    name: "iQube S 4.7 kWh",
    trim: "iQube S",
    position: 5,
    image: "/scooters/iqube-s-4-7-kwh.png",
    exShowroom: 165353,
    onRoadLow: 172649,
    onRoadMid: 174137,
    onRoadHigh: 175625,
    batteryKwh: 4.7,
    idcRangeKm: 175,
    realWorldRangeKm: 145,
    topSpeedKmph: 82,
    accel0to40s: 4.3,
    chargeMinutes: 240,
    kerbWeightKg: 128.8,
    storageLitres: 32,
    clusterType: "TFT Display (17.78 cm)",
    featureCount: 19,
    tierFeatures: [
      "HMI joystick",
      "Voice assist",
      "Music control",
      "Incognito mode",
      "Flip key with LED",
    ],
    colours: ["Titanium Grey Matte", "Magnificence Purple-Beige", "Harlequin Blue-Beige"],
    accent: "#a78bfa",
  },
  {
    id: "iqube-st-5-3-kwh",
    name: "iQube ST 5.3 kWh",
    trim: "iQube ST",
    position: 6,
    image: "/scooters/iqube-st-5-3-kwh.png",
    exShowroom: 175599,
    onRoadLow: 183274,
    onRoadMid: 184854,
    onRoadHigh: 186435,
    batteryKwh: 5.3,
    idcRangeKm: 212,
    realWorldRangeKm: 176,
    topSpeedKmph: 82,
    accel0to40s: 4.5,
    chargeMinutes: 258,
    kerbWeightKg: 132,
    storageLitres: 32,
    clusterType: "TFT Touch Display",
    featureCount: 20,
    tierFeatures: [
      "HMI joystick",
      "Voice assist",
      "Music control",
      "Incognito mode",
      "Flip key with LED",
      "TPMS",
    ],
    colours: ["Titanium Grey Matte", "Starlight Blue-Beige", "Copper Bronze-Beige"],
    accent: "#f0a35e",
  },
];

export const VARIANT_BY_ID = Object.fromEntries(VARIANTS.map((v) => [v.id, v])) as Record<
  string,
  Variant
>;

export function getVariant(id: string): Variant {
  const v = VARIANT_BY_ID[id];
  if (!v) throw new Error(`Unknown variant: ${id}`);
  return v;
}

export const OWNERSHIP = {
  batteryWarranty: "3 years or 50,000 km",
  motorWarranty: "3 years",
  runningCostPerKm: 0.2,
  baasMax: 59999,
  chargerWatts: 950,
};

export type Accessory = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export const ACCESSORIES: Accessory[] = [
  { id: "acc-helmet", name: "TVS full-face helmet (ISI)", price: 2450, category: "Safety" },
  { id: "acc-topbox", name: "30 L top box + mounting plate", price: 3990, category: "Utility" },
  { id: "acc-mount", name: "Handlebar phone mount", price: 890, category: "Utility" },
  { id: "acc-floormat", name: "Moulded floor mat", price: 640, category: "Protection" },
  { id: "acc-cover", name: "All-weather body cover", price: 1150, category: "Protection" },
  { id: "acc-charger", name: "Spare 950 W offboard charger", price: 6800, category: "Charging" },
];

export type Lender = {
  id: string;
  name: string;
  annualRatePct: number;
  processingFee: number;
  minCibil: number;
  maxTenureMonths: number;
  minDownPaymentPct: number;
  note: string;
};

export const LENDERS: Lender[] = [
  {
    id: "bajaj",
    name: "Bajaj Finserv",
    annualRatePct: 11.5,
    processingFee: 1899,
    minCibil: 700,
    maxTenureMonths: 36,
    minDownPaymentPct: 15,
    note: "Fastest disbursal, dealer-integrated",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    annualRatePct: 9.9,
    processingFee: 2499,
    minCibil: 740,
    maxTenureMonths: 48,
    minDownPaymentPct: 20,
    note: "Lowest rate in panel, salaried-only",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    annualRatePct: 10.75,
    processingFee: 2199,
    minCibil: 720,
    maxTenureMonths: 42,
    minDownPaymentPct: 18,
    note: "Pre-approved for existing account holders",
  },
];
