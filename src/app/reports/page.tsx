"use client";
import Link from "next/link";
import { BarChart3, ChevronRight } from "lucide-react";
import { TitleBand, Page, Card } from "@/components/ui/kit";
import { REPORT_GROUPS, REPORTS } from "@/components/agents/reportDefs";
import { useReportData } from "@/components/agents/useReportData";
import { Bars } from "@/components/agents/Bars";

export default function ReportsPage() {
  const d = useReportData();
  return (
    <>
      <TitleBand title="Reports" subtitle="Dealership performance, service, warranty, customer voice and AI agents" />
      <Page className="space-y-6">
        {REPORT_GROUPS.map((g) => {
          const list = REPORTS.filter((r) => r.group === g);
          if (!list.length) return null;
          return (
            <section key={g}>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">{g}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((r) => {
                  const v = r.build(d);
                  return (
                    <Link key={r.id} href={`/reports/${r.id}`}>
                      <Card className="p-4 h-full hover:shadow-md transition">
                        <div className="flex items-start gap-2">
                          <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand inline-flex items-center justify-center shrink-0"><BarChart3 size={16} /></span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{r.title}</div>
                            <div className="text-xs text-gray-500">{r.blurb}</div>
                          </div>
                          <ChevronRight size={16} className="text-gray-300 mt-1" />
                        </div>
                        <div className="mt-3 text-xs text-gray-400">{v.rows.length} rows</div>
                        {v.bars && <div className="mt-2"><Bars bars={{ ...v.bars, title: "", items: v.bars.items.slice(0, 3) }} /></div>}
                      </Card>
                    </Link>
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
