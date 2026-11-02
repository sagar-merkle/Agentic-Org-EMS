"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { AGENTS } from "@/lib/base";
import { AgentDot, AiMark, Card, Chip, Page, Stat, StatRow, TitleBand, inr } from "@/components/ui/kit";
import { StatusChip, vehicleName } from "@/components/service/bits";

export default function ServiceHome() {
  const { jobs, vehicles } = useStore();
  const sagar = AGENTS.find((a) => a.id === "sagar")!;
  const open = jobs.filter((j) => j.status !== "Delivered");
  const awaiting = jobs.filter((j) => j.status === "Awaiting approval").length;
  const alerts = vehicles.filter((v) => v.alert).length;
  const drop = jobs.filter((j) => j.status === "Drop & leave").length;
  const ready = jobs.filter((j) => j.status === "Ready").length;
  const vOf = (id: string) => vehicles.find((v) => v.id === id)!;

  return (
    <>
      <TitleBand title="Service Home" subtitle="Rohit Pawar · Shree Motors TVS, Pune" />
      <Page className="space-y-5">
        <StatRow cols={5}>
          <Stat label="Today's jobs" value={open.length} />
          <Stat label="Awaiting approval" value={awaiting} tone="amber" />
          <Stat label="Health alerts" value={alerts} tone="red" />
          <Stat label="Drop & leave" value={drop} tone="blue" />
          <Stat label="Ready for delivery" value={ready} tone="green" />
        </StatRow>

        <Card className="px-4 py-3 flex items-center gap-3">
          <AgentDot agent="sagar" />
          <div className="flex-1 text-sm">
            <AiMark agent="sagar" /> <span className="ml-1 text-gray-600">{sagar.doing}. {awaiting} estimate(s) waiting for your approval.</span>
          </div>
          <Link href="/service/health" className="text-sm text-brand font-medium">Health alerts</Link>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Today&apos;s jobs</h2>
            <Link href="/service/jobs" className="text-sm text-brand font-medium inline-flex items-center gap-1">All job cards <ArrowRight size={14} /></Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {open.map((j) => {
              const v = vOf(j.vehicleId);
              return (
                <Link key={j.id} href={`/service/jobs/${j.id}`}>
                  <Card className="p-4 hover:shadow-md transition h-full">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-sm">{j.id}</div>
                      <StatusChip s={j.status} />
                    </div>
                    <div className="text-sm mt-1">{v.owner} · {vehicleName(v)}</div>
                    <div className="text-xs text-gray-500">{v.reg} · {j.slot}</div>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{j.issue}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-medium">{inr(j.estimateInr)}</span>
                      {j.createdBy !== "Advisor" ? <AiMark agent={j.createdBy} label={`Created by ${sagar.name}`} /> : <Chip>Advisor</Chip>}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 text-sm">
          <Link href="/service/jobs" className="text-brand font-medium">Job Cards</Link>
          <Link href="/service/health" className="text-brand font-medium">Vehicle Health</Link>
          <Link href="/service/fleet" className="text-brand font-medium">Fleet</Link>
        </div>
      </Page>
    </>
  );
}
