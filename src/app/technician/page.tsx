"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { AiMark, Card, Chip, Empty, Page, TitleBand } from "@/components/ui/kit";
import { StatusChip, vehicleName } from "@/components/service/bits";

export default function TechnicianHome() {
  const { jobs, vehicles } = useStore();
  const mine = jobs.filter((j) => j.technician === "Santosh Gaikwad");
  const active = mine.filter((j) => j.status !== "Ready" && j.status !== "Delivered");
  const done = mine.filter((j) => j.status === "Ready" || j.status === "Delivered");

  const row = (id: string) => {
    const j = jobs.find((x) => x.id === id)!;
    const v = vehicles.find((x) => x.id === j.vehicleId)!;
    return (
      <Link key={j.id} href={`/technician/${j.id}`}>
        <Card className="p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-sm">{j.id}</span>
            <StatusChip s={j.status} />
          </div>
          <div className="text-sm mt-1">{vehicleName(v)} · {v.reg}</div>
          <p className="text-sm text-gray-700 mt-1">{j.issue}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1.5">
              {j.diagnosis && <AiMark agent="sagar" label="Co-Pilot ready" />}
              {j.diagnosis?.needsBench && <Chip tone="amber">Needs bench</Chip>}
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <>
      <TitleBand title="My Jobs" subtitle="Santosh Gaikwad · Technician Co-Pilot" />
      <Page className="space-y-4 max-w-2xl">
        <h2 className="font-semibold text-sm">To do ({active.length})</h2>
        {active.length === 0 && <Empty text="No jobs assigned" />}
        <div className="space-y-3">{active.map((j) => row(j.id))}</div>
        {done.length > 0 && (
          <>
            <h2 className="font-semibold text-sm pt-2">Completed ({done.length})</h2>
            <div className="space-y-3">{done.map((j) => row(j.id))}</div>
          </>
        )}
      </Page>
    </>
  );
}
