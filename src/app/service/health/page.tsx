"use client";
import { AlertTriangle, WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { AiMark, Btn, Card, Chip, Collapsible, Page, TitleBand } from "@/components/ui/kit";
import { HealthBar, useServiceActions, vehicleName } from "@/components/service/bits";
import { UpgradeBlock, WarrantyClock } from "@/components/service/Parts";

export default function HealthPage() {
  const { vehicles, toast } = useStore();
  const { outreach, createJob } = useServiceActions();
  const sorted = [...vehicles].sort((a, b) => Number(!!b.alert) - Number(!!a.alert));

  return (
    <>
      <TitleBand title="Vehicle Health" subtitle="Battery, motor, brakes and tyres against similar vehicles · telemetry is simulated" />
      <Page className="space-y-4">
        <Collapsible title="Why it matters" hint="customers lost after the 2nd or 3rd service">
          <p className="text-sm text-gray-600">Many owners stop coming back after the second or third service. Catching a fault early and booking the visit before the owner notices keeps them in the dealership, and avoids costly out-of-warranty repairs.</p>
        </Collapsible>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sorted.map((v) => (
            <Card key={v.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm">{v.owner}</div>
                  <div className="text-xs text-gray-500">{vehicleName(v)} · {v.reg}</div>
                </div>
                {v.connected ? <Chip tone="green">Connected</Chip> : <Chip tone="gray"><WifiOff size={11} /> Not connected</Chip>}
              </div>

              {v.connected ? (
                <div className="space-y-2">
                  <HealthBar label="Battery" value={v.health.battery} peer={v.peerBattery} />
                  <HealthBar label="Motor" value={v.health.motor} />
                  <HealthBar label="Brakes" value={v.health.brakes} />
                  <HealthBar label="Tyres" value={v.health.tyres} />
                  {v.health.brakes === null && <p className="text-[11px] text-gray-400">No TPMS sensor on this trim; brake-wear data is not available.</p>}
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                  Not connected. No telemetry is available, so health is unknown. Service is booked on the customer&apos;s request instead.
                  <div className="mt-2">
                    <Btn variant="outline" onClick={() => { const j = createJob(v, { source: "Customer request", issue: "Routine check (no telemetry)", agent: "sagar", quiet: true }); toast(`Service booking offered; job ${j.id} created`); }}>Offer service booking</Btn>
                  </div>
                </div>
              )}

              {v.alert && (
                <div className={`rounded-xl p-3 text-sm ${v.alert.severity === "Act soon" ? "bg-red-50" : "bg-amber-50"}`}>
                  <div className="flex items-center gap-1.5 font-medium"><AlertTriangle size={14} className={v.alert.severity === "Act soon" ? "text-hot" : "text-amber-600"} /> {v.alert.title}</div>
                  <Chip tone={v.alert.severity === "Act soon" ? "red" : "amber"} className="mt-1">{v.alert.severity}</Chip>
                  <p className="text-xs text-gray-600 mt-1.5"><b>Cost of delay:</b> {v.alert.costOfDelay}</p>
                  <Btn className="mt-2" onClick={() => outreach(v)}><AiMark agent={v.alert.agentId} className="!bg-white" /> will call to book</Btn>
                </div>
              )}

              <Collapsible title="Warranty clock and upgrade offer" className="!rounded-xl">
                <div className="space-y-3">
                  <WarrantyClock v={v} />
                  <div className="text-xs text-gray-400">{v.serviceVisits} service visits</div>
                  <UpgradeBlock v={v} />
                </div>
              </Collapsible>
            </Card>
          ))}
        </div>
      </Page>
    </>
  );
}
