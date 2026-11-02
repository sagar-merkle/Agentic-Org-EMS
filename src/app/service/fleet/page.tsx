"use client";
import { useStore } from "@/lib/store";
import { AiMark, Btn, Card, Chip, Page, Stat, StatRow, TitleBand } from "@/components/ui/kit";
import { useServiceActions, vehicleName } from "@/components/service/bits";

export default function FleetPage() {
  const { vehicles } = useStore();
  const { outreach } = useServiceActions();
  const owners = Array.from(new Set(vehicles.filter((v) => v.fleet).map((v) => v.fleet!)));

  return (
    <>
      <TitleBand title="Fleet" subtitle="B2B vehicles grouped by fleet owner · telemetry is simulated" />
      <Page className="space-y-6">
        {owners.map((o) => {
          const list = vehicles.filter((v) => v.fleet === o);
          const nearLimit = list.filter((v) => v.warranty.kmUsed / v.warranty.kmTotal > 0.8).length;
          return (
            <section key={o} className="space-y-3">
              <h2 className="font-semibold">{o}</h2>
              <StatRow cols={3}>
                <Stat label="Vehicles" value={list.length} />
                <Stat label="Near warranty km limit" value={nearLimit} tone={nearLimit ? "red" : "green"} />
                <Stat label="Avg km" value={Math.round(list.reduce((s, v) => s + v.kms, 0) / list.length).toLocaleString("en-IN")} />
              </StatRow>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {list.map((v) => {
                  const pct = Math.min(100, (v.warranty.kmUsed / v.warranty.kmTotal) * 100);
                  return (
                    <Card key={v.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{v.reg}</div>
                          <div className="text-xs text-gray-500">{vehicleName(v)}</div>
                        </div>
                        {v.alert ? <Chip tone={v.alert.severity === "Act soon" ? "red" : "amber"}>{v.alert.severity}</Chip> : <Chip tone="green">OK</Chip>}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600"><span>Km vs warranty limit</span><span>{v.kms.toLocaleString("en-IN")} / {v.warranty.kmTotal.toLocaleString("en-IN")}</span></div>
                        <div className="h-2 rounded-full bg-gray-100 mt-1"><div className={`h-2 rounded-full ${pct > 80 ? "bg-hot" : pct > 60 ? "bg-amber-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
                      </div>
                      {v.alert && <p className="text-xs text-gray-600">{v.alert.title}</p>}
                      <Btn variant="outline" onClick={() => outreach(v)}><AiMark agent={v.alert?.agentId ?? "sagar"} className="!bg-transparent" /> Outreach and book</Btn>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </Page>
    </>
  );
}
