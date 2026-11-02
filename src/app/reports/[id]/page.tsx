"use client";
import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Search } from "lucide-react";
import { TitleBand, Page, Card, Btn, Empty } from "@/components/ui/kit";
import { reportById } from "@/components/agents/reportDefs";
import { useReportData } from "@/components/agents/useReportData";
import { Bars } from "@/components/agents/Bars";
import { useStore } from "@/lib/store";

export default function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const def = reportById(id);
  const d = useReportData();
  const { toast } = useStore();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("all");
  const view = useMemo(() => (def ? def.build(d) : null), [def, d]);

  if (!def || !view) {
    return (<><TitleBand title="Report not found" /><Page><Empty text="This report does not exist." /><Link href="/reports" className="text-brand text-sm">Back to reports</Link></Page></>);
  }
  const opts = view.filterCol !== undefined ? [...new Set(view.rows.map((r) => r[view.filterCol!]))] : [];
  const rows = view.rows.filter((r) => (sel === "all" || r[view.filterCol!] === sel) && (!q || r.join(" ").toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <TitleBand
        title={def.title}
        subtitle={`${def.group} · ${def.blurb}`}
        right={<Link href="/reports"><span className="inline-flex items-center gap-1 text-sm bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5"><ArrowLeft size={14} /> All reports</span></Link>}
      />
      <Page className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="border border-line rounded-full pl-8 pr-3 py-1.5 text-sm w-56 bg-white" />
          </div>
          {view.filterCol !== undefined && (
            <select value={sel} onChange={(e) => setSel(e.target.value)} className="border border-line rounded-full px-3 py-1.5 text-sm bg-white">
              <option value="all">All {view.filterLabel}</option>
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
          <select className="border border-line rounded-full px-3 py-1.5 text-sm bg-white" defaultValue="30"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>
          <Btn variant="outline" className="ml-auto" onClick={() => toast("Export started")}><Download size={14} /> Export</Btn>
        </div>

        {view.bars && <Card className="p-4"><Bars bars={view.bars} /></Card>}

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-soft"><tr className="text-left text-xs text-gray-600">
                {view.columns.map((c) => <th key={c} className="py-2.5 px-3 font-semibold whitespace-nowrap">{c}</th>)}
              </tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-line hover:bg-gray-50">
                    {r.map((c, j) => <td key={j} className="py-2 px-3 max-w-[320px]">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && <Empty text="No records for the selected filters." />}
          <div className="px-3 py-2 text-xs text-gray-400 border-t border-line">{rows.length} of {view.rows.length} records</div>
        </Card>
      </Page>
    </>
  );
}
