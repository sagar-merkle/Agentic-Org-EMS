export type AgentId = "meera" | "maheb" | "arjun" | "sagar" | "mansi";

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  colour: string; // hex
  tint: string; // light background hex
  useCases: number[];
  doing: string;
  status: "On call" | "Idle" | "Paused";
};

export type PersonaId =
  | "branch"
  | "dse"
  | "callcentre"
  | "advisor"
  | "technician"
  | "warranty"
  | "cx"
  | "customer";

export type Variant = {
  id: string;
  family: "iQube" | "Orbiter" | "TVS X";
  name: string;
  kwh: number;
  priceInr: number; // ex-showroom
  onRoadInr: number; // Pune, mid
  rangeKm: number; // IDC
  topSpeed: number;
  image: string;
  colours: string[];
  bookable: boolean;
};

export type Category = "Hot" | "Warm" | "Cold" | "Not Set";
export type EnquiryStatus = "Not Followed Up" | "Followed Up" | "Converted" | "Postponed" | "Lost & Dropped";
export type EnquirySource = "Walk-in" | "Digital" | "Telephone" | "Outdoor" | "WhatsApp" | "AI Voice" | "Web Chat" | "Upgrade";

export type TranscriptLine = { who: "agent" | "customer" | "dse"; text: string };

export type Interaction = {
  id: string;
  ts: string; // ISO
  source: "ACCELERATOR" | "FACEBOOK" | "WEB CHAT" | "WHATSAPP" | "AI VOICE" | "DSE CALL" | "WALK-IN" | "SERVICE";
  agentId?: AgentId;
  title: string;
  detail: string;
  transcript?: TranscriptLine[];
};

export type Intake = {
  budget: string;
  usage: string;
  dailyKm: string;
  city: string;
  parking: string;
  charging: string;
  purchaseMode: "Cash" | "Finance";
  timeline: string;
};

export type Factor = { label: string; delta: number; note?: string };

export type AiScore = {
  category: Category;
  score: number; // 0-100
  reason: string;
  factors: Factor[];
  nextAction: string;
  limitedData?: boolean;
};

export type TestRide = {
  variantId: string;
  status: "Scheduled" | "Completed" | "Missed" | "Not Planned";
  date?: string;
  slot?: "Before 12 PM" | "After 12 PM";
  place?: "At Dealership" | "At Home";
};

export type Enquiry = {
  id: string; // ENQ-xxxx
  name: string;
  phone: string;
  receivedAt: string;
  createdBy: string;
  assignedTo: string | null; // human name, null = Unassigned
  aiOwner?: AgentId;
  source: EnquirySource;
  vehicles: string[]; // variant ids
  category: Category;
  status: EnquiryStatus;
  followUps: number;
  nextFollowUp?: string;
  lapsedDays?: number;
  tag?: "AI qualified" | "Upgrade" | "Qualified Lead" | "Pre-approved TVS credit lead";
  dnc?: boolean;
  intake?: Partial<Intake>;
  ai?: AiScore;
  history: Interaction[];
  testRide?: TestRide;
  bookingId?: string;
  comments?: string;
};

export type BookingStatus = "Open Partially Paid" | "Open Fully Paid Online" | "Allotted" | "Invoiced" | "Cancelled";

export type Booking = {
  id: string; // BKG-xxxx
  enquiryId?: string;
  customer: string;
  phone: string;
  variantId: string;
  colour: string;
  amount: number;
  status: BookingStatus;
  finance: "Cash" | "Finance";
  dse: string;
  createdAt: string;
  chargerIncluded: boolean;
};

export type Task = {
  id: string;
  enquiryId: string;
  title: string;
  kind: "Call" | "Test ride" | "Follow up" | "Delivery" | "Approve AI";
  due: string; // ISO
  missed: boolean;
  done: boolean;
  createdBy?: AgentId;
};

export type CallChannel = "Voice" | "WhatsApp" | "Chat";
export type CallType =
  | "Inbound"
  | "Qualification"
  | "Reminder"
  | "Test ride reminder"
  | "Feedback"
  | "Upgrade offer"
  | "Service booking"
  | "Health outreach"
  | "Claim review"
  | "VoC analysis";
export type Outcome = "Positive" | "Neutral" | "Needs human" | "No answer";

export type CallRecord = {
  id: string;
  agentId: AgentId;
  ts: string;
  customer: string;
  phone: string;
  channel: CallChannel;
  type: CallType;
  outcome: Outcome;
  durationSec: number;
  nextAction: string;
  nextOwner: string; // human or agent name
  useCase: number;
  enquiryId?: string;
  summary: string;
  captured: { k: string; v: string; quote?: string }[];
  transcript: TranscriptLine[];
  scoreChange?: { from: Category; to: Category; factors: Factor[] };
  consent: "Recorded" | "Not asked" | "Opted out";
  costInr: number;
  handoff?: { from: AgentId; to: string };
};

export type Approval = {
  id: string;
  agentId: AgentId;
  useCase: number;
  title: string;
  detail: string;
  enquiryId?: string;
  state: "pending" | "approved" | "rejected" | "modified";
  decidedBy?: string;
};

export type Vehicle = {
  id: string;
  owner: string;
  phone: string;
  variantId: string;
  reg: string;
  kms: number;
  ageMonths: number;
  connected: boolean;
  fleet?: string;
  health: { battery: number; motor: number; brakes: number | null; tyres: number | null };
  peerBattery: number; // similar vehicles average
  alert?: { severity: "Watch" | "Act soon"; title: string; costOfDelay: string; agentId: AgentId };
  warranty: { monthsUsed: number; kmUsed: number; monthsTotal: 36; kmTotal: 50000 };
  serviceVisits: number;
  lastService: string;
  upgradeOffer?: { score: number; reasons: Factor[]; state: "none" | "offered" | "enquiry created" };
};

export type JobStatus = "Booked" | "Drop & leave" | "Awaiting approval" | "In repair" | "Ready" | "Delivered";

export type JobCard = {
  id: string; // JC-xxxx
  vehicleId: string;
  status: JobStatus;
  issue: string;
  voiceNote?: { transcript: string; translated: string; lang: string };
  estimateInr: number;
  estimateLines: { item: string; inr: number }[];
  advisor: string;
  technician?: string;
  createdBy: AgentId | "Advisor";
  bookedVia: "WhatsApp" | "Voice" | "Chat" | "Walk-in";
  slot: string;
  source: "Health alert" | "Customer request" | "Walk-in";
  diagnosis?: {
    causes: { cause: string; confidence: number }[];
    steps: string[];
    parts: { name: string; stock: number; bin: string }[];
    etaMin: number;
    needsBench: boolean;
  };
  claimId?: string;
};

export type ClaimBucket = "Auto-approve" | "Human review" | "Auto-reject";
export type Claim = {
  id: string; // WC-xxxx
  jobId: string;
  vehicleId: string;
  dealer: string;
  part: string;
  failure: string;
  amountInr: number;
  confidence: number; // 0-100
  bucket: ClaimBucket;
  flags: string[];
  evidence: { label: string; ok: boolean }[];
  summary: string;
  state: "Pending L1" | "Pending L2" | "Approved" | "Rejected";
  l1?: string;
  l2?: string;
  submittedAt: string;
};

export type Feedback = {
  id: string;
  ts: string;
  model: string; // variant family label
  region: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  topic: string;
  text: string; // PII masked
  channel: "Feedback call" | "WhatsApp" | "Survey";
};

export type Dealer = {
  name: string;
  code: string;
  city: string;
  virtualNumber: string;
};
