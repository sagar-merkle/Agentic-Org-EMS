import type { Booking, CallRecord, Claim, Enquiry, Feedback, JobCard, Task, Vehicle } from "@/lib/types";
import { agentById } from "@/lib/base";
import { variantById } from "@/lib/variants";
import { fmtDate, inr } from "@/components/ui/kit";

export type ReportData = {
  enquiries: Enquiry[];
  bookings: Booking[];
  tasks: Task[];
  jobs: JobCard[];
  claims: Claim[];
  vehicles: Vehicle[];
  feedback: Feedback[];
  calls: CallRecord[];
};

export type ReportView = {
  columns: string[];
  rows: string[][];
  bars?: { title: string; items: { label: string; value: number; colour?: string }[] };
  filterCol?: number; // column index offered as a dropdown filter
  filterLabel?: string;
};

export type ReportDef = {
  id: string;
  group: string;
  title: string;
  blurb: string;
  build: (d: ReportData) => ReportView;
};

const count = (xs: string[]) => {
  const m = new Map<string, number>();
  xs.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1));
  return [...m.entries()].map(([label, value]) => ({ label, value }));
};

const enqName = (d: ReportData, id: string) => d.enquiries.find((e) => e.id === id)?.name ?? id;
const owner = (d: ReportData, id: string) => d.enquiries.find((e) => e.id === id)?.assignedTo ?? "Unassigned";
const vOwner = (d: ReportData, id: string) => d.vehicles.find((v) => v.id === id);

const taskRows = (d: ReportData, list: Task[]) =>
  list.map((t) => [t.title, enqName(d, t.enquiryId), t.kind, fmtDate(t.due), owner(d, t.enquiryId), t.createdBy ? agentById(t.createdBy).name : "Human"]);
const taskCols = ["Task", "Customer", "Type", "Due", "Owner", "Created by"];

export const REPORT_GROUPS = ["Today's Task", "Missed Task", "Service", "Warranty", "Voice of Customer", "Sales funnel", "Bookings", "AI Agent performance"];

export const REPORTS: ReportDef[] = [
  {
    id: "today-tasks", group: "Today's Task", title: "Today's tasks by type", blurb: "Open calls, follow-ups, test rides and deliveries due today.",
    build: (d) => {
      const l = d.tasks.filter((t) => !t.done && !t.missed);
      return { columns: taskCols, rows: taskRows(d, l), filterCol: 2, filterLabel: "Type", bars: { title: "Open tasks by type", items: count(l.map((t) => t.kind)) } };
    },
  },
  {
    id: "today-approve", group: "Today's Task", title: "AI approvals due", blurb: "Tasks created by agents that need a human decision.",
    build: (d) => {
      const l = d.tasks.filter((t) => !t.done && t.kind === "Approve AI");
      return { columns: taskCols, rows: taskRows(d, l), filterCol: 5, filterLabel: "Created by" };
    },
  },
  {
    id: "missed-tasks", group: "Missed Task", title: "Missed tasks", blurb: "Tasks past due and not completed.",
    build: (d) => {
      const l = d.tasks.filter((t) => t.missed && !t.done);
      return { columns: taskCols, rows: taskRows(d, l), filterCol: 2, filterLabel: "Type", bars: { title: "Missed by type", items: count(l.map((t) => t.kind)) } };
    },
  },
  {
    id: "missed-testrides", group: "Missed Task", title: "Missed test rides", blurb: "Scheduled test rides that did not happen.",
    build: (d) => {
      const l = d.enquiries.filter((e) => e.testRide?.status === "Missed");
      return { columns: ["Enquiry", "Customer", "Vehicle", "Planned", "Owner"], rows: l.map((e) => [e.id, e.name, variantById(e.testRide!.variantId).name, e.testRide!.date ?? "-", e.assignedTo ?? "Unassigned"]), filterCol: 4, filterLabel: "Owner" };
    },
  },
  {
    id: "service-jobs", group: "Service", title: "Job cards", blurb: "All service jobs with status, advisor and estimate.",
    build: (d) => ({
      columns: ["Job", "Customer", "Issue", "Status", "Advisor", "Booked via", "Estimate"],
      rows: d.jobs.map((j) => [j.id, vOwner(d, j.vehicleId)?.owner ?? "-", j.issue, j.status, j.advisor, j.bookedVia, inr(j.estimateInr)]),
      filterCol: 3, filterLabel: "Status",
      bars: { title: "Jobs by status", items: count(d.jobs.map((j) => j.status)) },
    }),
  },
  {
    id: "service-source", group: "Service", title: "Service bookings by source", blurb: "How jobs arrive: AI health alerts, customer requests, walk-ins.",
    build: (d) => ({
      columns: ["Job", "Source", "Booked via", "Created by", "Slot"],
      rows: d.jobs.map((j) => [j.id, j.source, j.bookedVia, j.createdBy === "Advisor" ? "Advisor" : agentById(j.createdBy).name, j.slot]),
      filterCol: 1, filterLabel: "Source",
      bars: { title: "Jobs by source", items: count(d.jobs.map((j) => j.source)) },
    }),
  },
  {
    id: "warranty-claims", group: "Warranty", title: "Warranty claims", blurb: "Claims with AI confidence and review state.",
    build: (d) => ({
      columns: ["Claim", "Part", "Failure", "Amount", "AI confidence", "Bucket", "State"],
      rows: d.claims.map((c) => [c.id, c.part, c.failure, inr(c.amountInr), `${c.confidence}%`, c.bucket, c.state]),
      filterCol: 5, filterLabel: "Bucket",
      bars: { title: "Claims by AI bucket", items: count(d.claims.map((c) => c.bucket)) },
    }),
  },
  {
    id: "warranty-state", group: "Warranty", title: "Claims pending review", blurb: "Claims waiting at L1 or L2.",
    build: (d) => {
      const l = d.claims.filter((c) => c.state.startsWith("Pending"));
      return { columns: ["Claim", "Dealer", "Part", "Amount", "State", "Submitted"], rows: l.map((c) => [c.id, c.dealer, c.part, inr(c.amountInr), c.state, fmtDate(c.submittedAt)]), filterCol: 4, filterLabel: "State" };
    },
  },
  {
    id: "voc-sentiment", group: "Voice of Customer", title: "Sentiment by topic", blurb: "Customer feedback themes, masked for privacy.",
    build: (d) => ({
      columns: ["Date", "Model", "Region", "Topic", "Sentiment", "Channel", "Feedback"],
      rows: d.feedback.map((f) => [fmtDate(f.ts), f.model, f.region, f.topic, f.sentiment, f.channel, f.text]),
      filterCol: 4, filterLabel: "Sentiment",
      bars: { title: "Feedback by topic", items: count(d.feedback.map((f) => f.topic)) },
    }),
  },
  {
    id: "voc-model", group: "Voice of Customer", title: "Feedback by model", blurb: "Which models customers talk about and how they feel.",
    build: (d) => ({
      columns: ["Model", "Topic", "Sentiment", "Region", "Feedback"],
      rows: d.feedback.map((f) => [f.model, f.topic, f.sentiment, f.region, f.text]),
      filterCol: 0, filterLabel: "Model",
      bars: { title: "Feedback by model", items: count(d.feedback.map((f) => f.model)) },
    }),
  },
  {
    id: "funnel-status", group: "Sales funnel", title: "Enquiry funnel", blurb: "Enquiries by follow-up status.",
    build: (d) => ({
      columns: ["Enquiry", "Customer", "Source", "Category", "Status", "Owner", "Follow-ups"],
      rows: d.enquiries.map((e) => [e.id, e.name, e.source, e.category, e.status, e.assignedTo ?? "Unassigned", String(e.followUps)]),
      filterCol: 4, filterLabel: "Status",
      bars: { title: "Enquiries by status", items: count(d.enquiries.map((e) => e.status)) },
    }),
  },
  {
    id: "funnel-source", group: "Sales funnel", title: "Enquiries by source & category", blurb: "Where leads come from and how hot they are.",
    build: (d) => ({
      columns: ["Source", "Hot", "Warm", "Cold", "Not Set", "Total"],
      rows: [...new Set(d.enquiries.map((e) => e.source))].map((s) => {
        const l = d.enquiries.filter((e) => e.source === s);
        const n = (c: string) => String(l.filter((e) => e.category === c).length);
        return [s, n("Hot"), n("Warm"), n("Cold"), n("Not Set"), String(l.length)];
      }),
      bars: { title: "Enquiries by source", items: count(d.enquiries.map((e) => e.source)) },
    }),
  },
  {
    id: "bookings-list", group: "Bookings", title: "Bookings", blurb: "All vehicle bookings and payment status.",
    build: (d) => ({
      columns: ["Booking", "Customer", "Variant", "Colour", "Amount", "Status", "Finance", "DSE"],
      rows: d.bookings.map((b) => [b.id, b.customer, variantById(b.variantId).name, b.colour, inr(b.amount), b.status, b.finance, b.dse]),
      filterCol: 5, filterLabel: "Status",
      bars: { title: "Bookings by status", items: count(d.bookings.map((b) => b.status)) },
    }),
  },
  {
    id: "bookings-variant", group: "Bookings", title: "Bookings by variant", blurb: "Demand split across iQube and Orbiter variants.",
    build: (d) => ({
      columns: ["Variant", "Bookings", "Value"],
      rows: [...new Set(d.bookings.map((b) => b.variantId))].map((v) => {
        const l = d.bookings.filter((b) => b.variantId === v);
        return [variantById(v).name, String(l.length), inr(l.reduce((s, b) => s + b.amount, 0))];
      }),
      bars: { title: "Bookings by variant", items: count(d.bookings.map((b) => variantById(b.variantId).name)) },
    }),
  },
  {
    id: "ai-performance", group: "AI Agent performance", title: "Agent performance", blurb: "Conversations, positive rate, handoffs and cost per agent.",
    build: (d) => {
      const ids = [...new Set(d.calls.map((c) => c.agentId))];
      return {
        columns: ["Agent", "Role", "Interactions", "Positive", "Needs human", "No answer", "Avg duration", "Cost"],
        rows: ids.map((id) => {
          const l = d.calls.filter((c) => c.agentId === id);
          const avg = Math.round(l.reduce((s, c) => s + c.durationSec, 0) / l.length);
          return [agentById(id).name, agentById(id).role, String(l.length), String(l.filter((c) => c.outcome === "Positive").length), String(l.filter((c) => c.outcome === "Needs human").length), String(l.filter((c) => c.outcome === "No answer").length), `${Math.floor(avg / 60)}:${String(avg % 60).padStart(2, "0")}`, inr(Math.round(l.reduce((s, c) => s + c.costInr, 0)))];
        }),
        bars: { title: "Interactions by agent", items: ids.map((id) => ({ label: agentById(id).name, value: d.calls.filter((c) => c.agentId === id).length, colour: agentById(id).colour })) },
      };
    },
  },
  {
    id: "ai-outcomes", group: "AI Agent performance", title: "Call outcomes log", blurb: "Every AI conversation with outcome and next action.",
    build: (d) => ({
      columns: ["Time", "Agent", "Customer", "Channel", "Type", "Outcome", "Next action", "Owner"],
      rows: d.calls.map((c) => [fmtDate(c.ts), agentById(c.agentId).name, c.customer, c.channel, c.type, c.outcome, c.nextAction, c.nextOwner]),
      filterCol: 5, filterLabel: "Outcome",
      bars: { title: "Outcomes", items: count(d.calls.map((c) => c.outcome)) },
    }),
  },
];

export const reportById = (id: string) => REPORTS.find((r) => r.id === id);
