export type AgentId = "meera" | "maheb" | "arjun" | "sagar";
export type StaffId = "sanjay" | "pooja" | "rohit" | "aditi" | "vikas" | "anand";
export type ProductId = string;

export type Tier = "hot" | "warm" | "cold";
export type LeadStage = "new" | "contacted" | "test_ride" | "quote" | "booked" | "delivered" | "lost";
export type LeadSource =
  | "website"
  | "ads"
  | "walk_in"
  | "call_in"
  | "referral"
  | "existing_owner"
  | "service_bay";
export type Priority = "value" | "range" | "tech" | "performance" | "comfort";

export type LeadSignals = {
  timeline: "this_month" | "within_3_months" | "exploring" | "unknown";
  testRide: "none" | "booked" | "done";
  budget: number | null;
  engagement: 0 | 1 | 2 | 3;
  finance: "unknown" | "cash" | "eligible" | "within_cap";
  exchange: string | null;
};

export type ScoreFactor = { key: string; label: string; points: number; max: number; note: string };

export type Lead = {
  id: string;
  name: string;
  phone: string;
  area: string;
  source: LeadSource;
  interest: ProductId;
  dailyKm: number;
  priority: Priority;
  emiCeiling: number | null;
  signals: LeadSignals;
  score: number;
  tier: Tier;
  factors: ScoreFactor[];
  stage: LeadStage;
  assignedTo: StaffId;
  createdAt: number;
  contactedAt?: number;
  testRideAt?: number;
  quoteAt?: number;
  bookedAt?: number;
  retailAt?: number;
  lostAt?: number;
  lostReason?: string;
  accessoriesValue?: number;
  lastTouch: { at: number; by: AgentId | StaffId; agent: boolean } | null;
  nextAction: string;
  nextDue: number;
  summary: string;
  ownerId?: string;
};

export type CallType =
  | "discovery"
  | "follow_up"
  | "ride_reminder"
  | "debrief"
  | "finance"
  | "owner_checkin"
  | "accessories"
  | "insurance"
  | "service_reminder"
  | "vehicle_ready"
  | "feedback";

export type Outcome =
  | "interested"
  | "test_ride_booked"
  | "service_booked"
  | "callback"
  | "feedback_captured"
  | "confirmed"
  | "escalated"
  | "needs_info"
  | "not_interested"
  | "bought_elsewhere"
  | "no_answer"
  | "busy"
  | "switched_off"
  | "wrong_number"
  | "dnd";

export type OutcomeGroup = "positive" | "followup" | "negative" | "not_reached" | "blocked";

export type Captured = { field: string; value: string; quote?: string };
export type Line = { who: "agent" | "customer"; text: string; t: number };

export type Call = {
  id: string;
  agent: AgentId;
  type: CallType;
  customer: string;
  leadId?: string;
  ownerId?: string;
  jobId?: string;
  at: number;
  durationS: number;
  outcome: Outcome;
  summary: string[];
  captured: Captured[];
  transcript: Line[];
  nextAction: string;
  scoreBefore?: number;
  scoreAfter?: number;
  sentiment: "positive" | "neutral" | "negative";
  costInr: number;
};

export type Handoff = {
  id: string;
  from: AgentId;
  to: AgentId | StaffId;
  customer: string;
  leadId?: string;
  reason: string;
  at: number;
  accepted: boolean | null;
};

export type ApprovalType = "discount" | "exchange" | "finance_exception" | "accessory_bundle" | "complaint";

export type Approval = {
  id: string;
  type: ApprovalType;
  raisedBy: AgentId;
  customer: string;
  leadId?: string;
  jobId?: string;
  title: string;
  value: string;
  reason: string;
  detail: string[];
  status: "pending" | "approved" | "rejected";
  at: number;
  resolvedBy?: StaffId;
  resolvedAt?: number;
  note?: string;
};

export type JobStage = "booked" | "picked_up" | "in_bay" | "ready" | "delivered" | "feedback_done";

export type Job = {
  id: string;
  reg: string;
  model: string;
  ev: boolean;
  ownerId?: string;
  customer: string;
  jobType: string;
  lines: string[];
  stage: JobStage;
  promisedAt: number;
  advisor: StaffId;
  pickup: boolean;
};

export type Reminder = {
  id: string;
  ownerId: string;
  customer: string;
  vehicle: string;
  reason: string;
  status: "not_called" | Outcome;
  slot?: number;
  callId?: string;
};

export type Feedback = {
  id: string;
  customer: string;
  vehicle: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  at: number;
  callId?: string;
};

export type EvAlert = {
  id: string;
  customer: string;
  model: string;
  reg: string;
  health: number;
  alert: string;
  severity: "high" | "medium" | "low";
  action: string;
};

export type Opportunity = {
  ownerId: string;
  customer: string;
  vehicle: string;
  ageYears: number;
  readiness: number;
  readinessTier: "hot" | "warm" | "cold" | "unreachable";
  suggested: ProductId;
  saving: number;
  arjun: "not_called" | "consented" | "callback" | "declined" | "no_answer";
  inWorkshop: boolean;
  sentToSales: boolean;
};

export type Targets = { enquiries: number; testRides: number; bookings: number; retail: number };

export type World = {
  now: number;
  leads: Lead[];
  calls: Call[];
  handoffs: Handoff[];
  approvals: Approval[];
  jobs: Job[];
  reminders: Reminder[];
  feedback: Feedback[];
  evAlerts: EvAlert[];
  opportunities: Opportunity[];
  targets: Targets;
  seq: number;
};

export type Owner = {
  id: string;
  name: string;
  area: string;
  reg: string;
  model: string;
  variant: string;
  powertrain: "ICE" | "EV";
  purchaseDate: string;
  annualKm: number;
  serviceAdherence: "complete" | "partial" | "lapsed";
  contactability: string;
  visits: number;
  lastServiceDate: string | null;
  lastOdometer: number | null;
  insuranceExpiry: string | null;
  insuranceProvider: string | null;
  financeKind: string;
  financeClosed: boolean;
  financeEmi: number | null;
  financeLender: string | null;
  dailyCommuteKm: number | null;
  issueCodes: string[];
};
