"use client";
import type { AgentId, JobCard, JobStatus, Vehicle } from "@/lib/types";
import { variantById } from "@/lib/variants";
import { useStore } from "@/lib/store";
import { Chip } from "@/components/ui/kit";

export const JOB_FLOW: JobStatus[] = ["Booked", "Drop & leave", "Awaiting approval", "In repair", "Ready", "Delivered"];

const TONE: Record<JobStatus, "gray" | "blue" | "green" | "red" | "amber" | "violet"> = {
  Booked: "blue",
  "Drop & leave": "violet",
  "Awaiting approval": "amber",
  "In repair": "blue",
  Ready: "green",
  Delivered: "gray",
};
export const StatusChip = ({ s }: { s: JobStatus }) => <Chip tone={TONE[s]}>{s}</Chip>;

export const vehicleName = (v: Vehicle) => variantById(v.variantId).name;

export function HealthBar({ label, value, peer }: { label: string; value: number | null; peer?: number }) {
  if (value === null) {
    return (
      <div>
        <div className="flex justify-between text-xs text-gray-500"><span>{label}</span><span className="text-gray-400">{label === "Tyres" ? "No TPMS sensor" : "No data"}</span></div>
        <div className="h-2 rounded-full bg-gray-100 mt-1" />
      </div>
    );
  }
  const col = value >= 80 ? "bg-done" : value >= 65 ? "bg-amber-500" : "bg-hot";
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600"><span>{label}</span><span className="font-medium">{value}%{peer ? <span className="text-gray-400 font-normal"> · peers {peer}%</span> : null}</span></div>
      <div className="h-2 rounded-full bg-gray-100 mt-1 relative">
        <div className={`h-2 rounded-full ${col}`} style={{ width: `${value}%` }} />
        {peer ? <div className="absolute top-[-3px] w-0.5 h-3.5 bg-gray-700" style={{ left: `${peer}%` }} title="Similar-vehicle average" /> : null}
      </div>
    </div>
  );
}

export function useServiceActions() {
  const { jobs, addJob, updateVehicle, toast } = useStore();

  const createJob = (v: Vehicle, opts?: { source?: JobCard["source"]; agent?: AgentId; slot?: string; issue?: string; quiet?: boolean }) => {
    const existing = jobs.find((j) => j.vehicleId === v.id && j.status !== "Delivered" && j.source === "Health alert");
    if (existing && !opts?.quiet) {
      toast(`Job ${existing.id} already open for ${v.reg}`);
      return existing;
    }
    const job: JobCard = {
      id: `JC-${8801 + jobs.length}`,
      vehicleId: v.id,
      status: "Booked",
      issue: opts?.issue ?? v.alert?.title ?? "Health check",
      estimateInr: 1500,
      estimateLines: [{ item: "Diagnostic check", inr: 1200 }, { item: "Labour", inr: 300 }],
      advisor: "Rohit Pawar",
      createdBy: opts?.agent ?? v.alert?.agentId ?? "sagar",
      bookedVia: "Voice",
      slot: opts?.slot ?? "Tomorrow 10:00 AM",
      source: opts?.source ?? "Health alert",
    };
    addJob(job);
    return job;
  };

  const outreach = (v: Vehicle) => {
    const agent = v.alert?.agentId ?? "sagar";
    const name = agent === "arjun" ? "AI Arjun" : "AI Sagar";
    const job = createJob(v, { agent, quiet: true });
    toast(`${name} will call ${v.owner}. Slot booked (${job.slot}) and job ${job.id} created.`);
  };

  const upgradeEnquiry = (v: Vehicle) => {
    if (!v.upgradeOffer) return;
    updateVehicle(v.id, { upgradeOffer: { ...v.upgradeOffer, state: "enquiry created" } });
    toast(`Upgrade enquiry created for ${v.owner} (UC 13)`);
  };

  return { createJob, outreach, upgradeEnquiry };
}
