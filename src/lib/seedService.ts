import { iso } from "./base";
import type { Claim, Feedback, JobCard, Vehicle } from "./types";

export const VEHICLES: Vehicle[] = [
  { id: "V1", owner: "Prakash Rane", phone: "+91 98330 20001", variantId: "iqube-3-1-kwh", reg: "MH12 TV 4410", kms: 22400, ageMonths: 20, connected: true, health: { battery: 78, motor: 94, brakes: 71, tyres: 66 }, peerBattery: 92, alert: { severity: "Act soon", title: "Battery 14% below similar iQubes", costOfDelay: "Pack replacement risk. Early cell balancing costs about ₹2,800; delay can reach ₹48,000 after warranty.", agentId: "arjun" }, warranty: { monthsUsed: 20, kmUsed: 22400, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 3, lastService: iso(120), upgradeOffer: { score: 38, reasons: [{ label: "20 of 36 months", delta: 10 }], state: "none" } },
  { id: "V2", owner: "Vijay Patil", phone: "+91 98810 23390", variantId: "iqube-3-5-kwh", reg: "MH14 EK 7781", kms: 41200, ageMonths: 30, connected: true, health: { battery: 84, motor: 90, brakes: 62, tyres: 58 }, peerBattery: 88, alert: { severity: "Watch", title: "Tyres near wear limit", costOfDelay: "Replace now at about ₹1,900 to avoid rim damage.", agentId: "sagar" }, warranty: { monthsUsed: 30, kmUsed: 41200, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 5, lastService: iso(40), upgradeOffer: { score: 71, reasons: [{ label: "30 of 36 months used", delta: 22 }, { label: "High mileage", delta: 18 }, { label: "Always services on time", delta: 14 }], state: "enquiry created" } },
  { id: "V3", owner: "Neeta Joshi", phone: "+91 98230 66771", variantId: "iqube-s-4-7-kwh", reg: "MH12 UV 9033", kms: 9800, ageMonths: 9, connected: true, health: { battery: 96, motor: 98, brakes: null, tyres: null }, peerBattery: 95, warranty: { monthsUsed: 9, kmUsed: 9800, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 1, lastService: iso(150), upgradeOffer: { score: 12, reasons: [], state: "none" } },
  { id: "V4", owner: "Sachin Bhise", phone: "+91 98220 15500", variantId: "iqube-2-3-kwh", reg: "MH12 QT 3318", kms: 31000, ageMonths: 24, connected: false, health: { battery: 0, motor: 0, brakes: null, tyres: null }, peerBattery: 0, warranty: { monthsUsed: 24, kmUsed: 31000, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 3, lastService: iso(210), upgradeOffer: { score: 44, reasons: [], state: "none" } },
  { id: "V5", owner: "Pune Fleet Co", phone: "+91 98330 12001", variantId: "orbiter-v2", reg: "MH12 FL 1001", kms: 44100, ageMonths: 16, connected: true, fleet: "Pune Fleet Co", health: { battery: 81, motor: 92, brakes: 59, tyres: 52 }, peerBattery: 90, alert: { severity: "Act soon", title: "High mileage: 44,100 km in 16 months", costOfDelay: "Warranty ends at 50,000 km in about 2 months. Book a full check now.", agentId: "sagar" }, warranty: { monthsUsed: 16, kmUsed: 44100, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 4, lastService: iso(60), upgradeOffer: { score: 55, reasons: [{ label: "Fleet reaching km limit", delta: 30 }], state: "none" } },
  { id: "V6", owner: "Pune Fleet Co", phone: "+91 98330 12001", variantId: "orbiter-v2", reg: "MH12 FL 1002", kms: 41800, ageMonths: 15, connected: true, fleet: "Pune Fleet Co", health: { battery: 86, motor: 93, brakes: 64, tyres: 60 }, peerBattery: 90, warranty: { monthsUsed: 15, kmUsed: 41800, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 3, lastService: iso(75) },
  { id: "V7", owner: "Pune Fleet Co", phone: "+91 98330 12001", variantId: "orbiter-v1", reg: "MH12 FL 1003", kms: 38200, ageMonths: 14, connected: true, fleet: "Pune Fleet Co", health: { battery: 89, motor: 95, brakes: 70, tyres: 63 }, peerBattery: 91, warranty: { monthsUsed: 14, kmUsed: 38200, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 3, lastService: iso(80) },
  { id: "V8", owner: "Mohan Gupta", phone: "+91 98330 20120", variantId: "iqube-3-1-kwh", reg: "MH12 MG 2209", kms: 12100, ageMonths: 11, connected: true, health: { battery: 90, motor: 96, brakes: 80, tyres: 78 }, peerBattery: 91, warranty: { monthsUsed: 11, kmUsed: 12100, monthsTotal: 36, kmTotal: 50000 }, serviceVisits: 2, lastService: iso(90) },
];

export const JOBS: JobCard[] = [
  {
    id: "JC-8801", vehicleId: "V1", status: "Awaiting approval", issue: "Battery drains faster; creaking sound from rear suspension", bookedVia: "WhatsApp", slot: "Thu 10:00 AM", source: "Health alert", advisor: "Rohit Pawar", createdBy: "sagar",
    voiceNote: { transcript: "बॅटरी लवकर उतरते आणि मागून आवाज येतो.", translated: "The battery drains quickly and there is a noise from the rear.", lang: "Marathi" },
    estimateInr: 3400, estimateLines: [{ item: "Cell balancing and pack diagnostic", inr: 2800 }, { item: "Rear shock lubrication", inr: 300 }, { item: "Labour", inr: 300 }],
    technician: "Santosh Gaikwad",
    diagnosis: { causes: [{ cause: "Cell group imbalance (cell 7 and 8)", confidence: 72 }, { cause: "Rear shock bush wear", confidence: 64 }, { cause: "Loose battery connector", confidence: 21 }], steps: ["Connect diagnostic tool and read cell voltages", "Run cell balancing cycle (about 40 min)", "Inspect the rear shock bush and lubricate", "Torque-check the battery connector", "Road test 5 km and re-read the pack"], parts: [{ name: "Rear shock bush", stock: 6, bin: "B-14" }, { name: "Battery connector kit", stock: 2, bin: "C-02" }], etaMin: 95, needsBench: true },
  },
  { id: "JC-8802", vehicleId: "V4", status: "Booked", issue: "Brake feels soft", bookedVia: "Voice", slot: "Today 2:00 PM", source: "Customer request", advisor: "Rohit Pawar", createdBy: "sagar", estimateInr: 900, estimateLines: [{ item: "Brake bleed and pad inspect", inr: 700 }, { item: "Labour", inr: 200 }] },
  { id: "JC-8803", vehicleId: "V2", status: "In repair", issue: "Tyre wear, range drop", bookedVia: "WhatsApp", slot: "Today 11:00 AM", source: "Health alert", advisor: "Rohit Pawar", technician: "Santosh Gaikwad", createdBy: "sagar", estimateInr: 4600, estimateLines: [{ item: "Rear tyre", inr: 1900 }, { item: "Front tyre", inr: 1900 }, { item: "Labour", inr: 800 }], claimId: "WC-7101" },
  { id: "JC-8804", vehicleId: "V8", status: "Drop & leave", issue: "Charging stops at 80%", bookedVia: "WhatsApp", slot: "Drop-off 9:30 AM", source: "Customer request", advisor: "Rohit Pawar", createdBy: "sagar", estimateInr: 1500, estimateLines: [{ item: "Charger and BMS check", inr: 1200 }, { item: "Labour", inr: 300 }] },
  { id: "JC-8805", vehicleId: "V3", status: "Ready", issue: "First service", bookedVia: "Walk-in", slot: "Yesterday", source: "Walk-in", advisor: "Rohit Pawar", createdBy: "Advisor", estimateInr: 650, estimateLines: [{ item: "Free first service", inr: 0 }, { item: "Consumables", inr: 650 }] },
];

const sheet = (flags: string[]) => flags;

export const CLAIMS: Claim[] = [
  { id: "WC-7101", jobId: "JC-8803", vehicleId: "V2", dealer: "Shree Motors TVS, Pune", part: "Rear tyre", failure: "Abnormal wear", amountInr: 1900, confidence: 96, bucket: "Auto-approve", flags: sheet([]), evidence: [{ label: "In warranty (30 mo, 41,200 km)", ok: true }, { label: "Photos attached (3)", ok: true }, { label: "Part serial matches VIN", ok: true }, { label: "Failure matches known wear pattern", ok: true }], summary: "Within warranty and mileage. Wear pattern matches 214 prior approved claims.", state: "Pending L1", submittedAt: iso(0, 8) },
  { id: "WC-7102", jobId: "JC-8801", vehicleId: "V1", dealer: "Shree Motors TVS, Pune", part: "Battery pack (cell group)", failure: "Cell imbalance", amountInr: 48000, confidence: 91, bucket: "Auto-approve", flags: sheet([]), evidence: [{ label: "Telematics shows drift for 6 weeks", ok: true }, { label: "In warranty", ok: true }, { label: "Diagnostic log attached", ok: true }], summary: "Telemetry supports a genuine cell defect. High value, so L2 sign-off is required.", state: "Pending L2", l1: "Meenal Rao", submittedAt: iso(1, 16) },
  { id: "WC-7103", jobId: "JC-8803", vehicleId: "V5", dealer: "Shree Motors TVS, Pune", part: "Hub motor", failure: "Noise", amountInr: 21500, confidence: 74, bucket: "Human review", flags: sheet(["High mileage fleet vehicle"]), evidence: [{ label: "In warranty (44,100 km)", ok: true }, { label: "Photos attached", ok: true }, { label: "Usage is commercial", ok: false }], summary: "Likely valid, but commercial usage may be excluded. Needs a human decision.", state: "Pending L1", submittedAt: iso(0, 7) },
  { id: "WC-7104", jobId: "JC-8802", vehicleId: "V4", dealer: "Shree Motors TVS, Pune", part: "Brake caliper", failure: "Leak", amountInr: 6200, confidence: 58, bucket: "Human review", flags: sheet(["Photo is blurry", "Part serial differs from VIN record"]), evidence: [{ label: "In warranty", ok: true }, { label: "Photo is readable", ok: false }, { label: "Part serial matches VIN", ok: false }], summary: "Evidence incomplete. Ask the dealer for a new photo.", state: "Pending L1", submittedAt: iso(0, 9) },
  { id: "WC-7105", jobId: "JC-8804", vehicleId: "V8", dealer: "Rajesh TVS, Nashik", part: "Charger", failure: "Fails to charge", amountInr: 8900, confidence: 32, bucket: "Auto-reject", flags: sheet(["Physical damage visible", "Water ingress marks"]), evidence: [{ label: "In warranty", ok: true }, { label: "No physical damage", ok: false }, { label: "No water ingress", ok: false }], summary: "Water ingress marks on the connector. Outside warranty terms. Human confirms the rejection.", state: "Pending L1", submittedAt: iso(1, 12) },
  { id: "WC-7106", jobId: "JC-8805", vehicleId: "V3", dealer: "Shree Motors TVS, Pune", part: "Side stand switch", failure: "Not detected", amountInr: 700, confidence: 93, bucket: "Auto-approve", flags: sheet([]), evidence: [{ label: "In warranty", ok: true }, { label: "Known issue, batch B-214", ok: true }], summary: "Matches a known batch issue.", state: "Approved", l1: "Meenal Rao", submittedAt: iso(3, 10) },
  { id: "WC-7107", jobId: "JC-8802", vehicleId: "V6", dealer: "Kothrud TVS", part: "Display", failure: "Flicker", amountInr: 5400, confidence: 82, bucket: "Human review", flags: sheet(["Second claim on same part in 6 months"]), evidence: [{ label: "In warranty", ok: true }, { label: "Photos attached", ok: true }, { label: "No repeat claim", ok: false }], summary: "Repeat claim. Possible fraud or a faulty batch.", state: "Pending L1", submittedAt: iso(0, 6) },
  { id: "WC-7108", jobId: "JC-8802", vehicleId: "V7", dealer: "Baner TVS", part: "Throttle", failure: "Jerky response", amountInr: 3100, confidence: 95, bucket: "Auto-approve", flags: sheet([]), evidence: [{ label: "In warranty", ok: true }, { label: "Telemetry fault code logged", ok: true }], summary: "Fault code confirms the sensor failure.", state: "Pending L1", submittedAt: iso(0, 5) },
];

const topics: [string, string, Feedback["sentiment"]][] = [
  ["Range", "Range is lower than what the showroom told me, about 90 km on a full charge.", "Negative"],
  ["Range", "I get around 100 km in the city. Happy with it.", "Positive"],
  ["Service wait", "Service took two days instead of one. The advisor kept me updated though.", "Neutral"],
  ["Charging", "The charger cable is a bit short for my parking spot.", "Neutral"],
  ["Ride quality", "Smooth, quiet and very comfortable. My family loves it.", "Positive"],
  ["App", "The app drops connection sometimes during charging.", "Negative"],
  ["Delivery", "Delivery was on time and the explanation was clear.", "Positive"],
  ["Price", "Price is high compared with petrol scooters, but running cost is low.", "Neutral"],
  ["Battery", "Battery percentage jumps around after a week of use.", "Negative"],
  ["Brakes", "Rear brake feels soft after 6 months.", "Negative"],
];
const regions = ["Pune", "Mumbai", "Nashik", "Bengaluru", "Hyderabad"];
const models = ["iQube 3.1 kWh", "iQube 3.5 kWh", "iQube S", "Orbiter", "TVS X"];

export const FEEDBACK: Feedback[] = Array.from({ length: 60 }, (_, i) => {
  const t = topics[(i * 7 + 3) % topics.length];
  const model = models[(i * 3) % models.length];
  const region = regions[(i * 2) % regions.length];
  const range = t[0] === "Range" && region === "Pune" && model === "iQube 3.1 kWh";
  return {
    id: `F${i + 1}`,
    ts: iso(i % 28, 10),
    model,
    region,
    sentiment: range ? "Negative" : t[2],
    topic: t[0],
    text: t[1].replace("my family", "my family"),
    channel: (["Feedback call", "WhatsApp", "Survey"] as const)[i % 3],
  };
});
