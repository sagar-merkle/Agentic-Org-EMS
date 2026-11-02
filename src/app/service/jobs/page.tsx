"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { AiMark, Btn, Card, Collapsible, Empty, Page, Tabs, TitleBand, inr } from "@/components/ui/kit";
import { StatusChip, useServiceActions, vehicleName } from "@/components/service/bits";
import type { JobStatus } from "@/lib/types";

const TABS = ["All", "Booked", "Drop & leave", "Awaiting approval", "In repair", "Ready", "Delivered"] as const;
type Tab = (typeof TABS)[number];

export default function JobsPage() {
  const { jobs, vehicles } = useStore();
  const [tab, setTab] = useState<Tab>("All");
  const router = useRouter();
  const { createJob } = useServiceActions();
  const alertVehicles = vehicles.filter((v) => v.alert);
  const counts = Object.fromEntries(TABS.map((t) => [t, t === "All" ? jobs.length : jobs.filter((j) => j.status === (t as JobStatus)).length])) as Record<Tab, number>;
  const list = tab === "All" ? jobs : jobs.filter((j) => j.status === tab);

  return (
    <>
      <TitleBand title="Job Cards" subtitle="Created by AI Sagar from health alerts and customer requests" />
      <Page className="space-y-4">
        <Collapsible title="Create a job card from a health alert" hint={`${alertVehicles.length} vehicles with alerts`}>
          <div className="space-y-2">
            {alertVehicles.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-3 text-sm">
                <span>{v.owner} · {v.reg} · <span className="text-gray-500">{v.alert!.title}</span></span>
                <Btn variant="outline" onClick={() => { const j = createJob(v); router.push(`/service/jobs/${j.id}`); }}>Create job card</Btn>
              </div>
            ))}
          </div>
        </Collapsible>
        <Tabs tabs={TABS} value={tab} onChange={setTab} counts={counts} />
        {list.length === 0 && <Empty text="No job cards in this status" />}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((j) => {
            const v = vehicles.find((x) => x.id === j.vehicleId)!;
            return (
              <Link key={j.id} href={`/service/jobs/${j.id}`}>
                <Card className="p-4 hover:shadow-md transition h-full">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{j.id}</span>
                    <StatusChip s={j.status} />
                  </div>
                  <div className="text-sm mt-1">{v.owner} · {vehicleName(v)}</div>
                  <div className="text-xs text-gray-500">{v.reg} · {j.slot} · {j.source}</div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{j.issue}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium">{inr(j.estimateInr)}</span>
                    {j.createdBy !== "Advisor" && <AiMark agent={j.createdBy} />}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Page>
    </>
  );
}
