"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Filter, Phone, Plus, Search, Share2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { variantById } from "@/lib/variants";
import type { Category, Enquiry, EnquirySource, EnquiryStatus } from "@/lib/types";
import { AiMark, Btn, Card, CategoryBadge, Chip, Collapsible, Empty, fmtDate, inputCls, Page, Tabs, TitleBand } from "@/components/ui/kit";
import { OwnerStrip, PreCallBrief } from "@/components/sales/bits";

const TABS = ["Not Followed Up", "Followed Up", "Converted", "Postponed", "Lost & Dropped"] as const satisfies readonly EnquiryStatus[];
const CATS: Category[] = ["Hot", "Warm", "Cold", "Not Set"];
const SOURCES: EnquirySource[] = ["Walk-in", "Digital", "Telephone", "Outdoor", "WhatsApp", "AI Voice", "Web Chat", "Upgrade"];

const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`px-3 py-1 rounded-full text-xs border ${on ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-line hover:border-brand"}`}>{children}</button>
);

export default function EnquiriesPage() {
  const { enquiries } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Not Followed Up");
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [srcs, setSrcs] = useState<EnquirySource[]>([]);
  const [aiOnly, setAiOnly] = useState(false);
  const [unassigned, setUnassigned] = useState(false);
  const [dnc, setDnc] = useState(false);
  const [brief, setBrief] = useState<Enquiry | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t && (TABS as readonly string[]).includes(t)) setTab(t as (typeof TABS)[number]);
  }, []);

  const tog = <T,>(l: T[], v: T, set: (x: T[]) => void) => set(l.includes(v) ? l.filter((x) => x !== v) : [...l, v]);
  const applied = cats.length + srcs.length + +aiOnly + +unassigned + +dnc;

  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t, enquiries.filter((e) => e.status === t).length])), [enquiries]);
  const list = enquiries.filter((e) => {
    if (e.status !== tab) return false;
    if (q && !(e.name.toLowerCase().includes(q.toLowerCase()) || e.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "") || "~~"))) return false;
    if (cats.length && !cats.includes(e.category)) return false;
    if (srcs.length && !srcs.includes(e.source)) return false;
    if (aiOnly && e.tag !== "AI qualified") return false;
    if (unassigned && e.assignedTo) return false;
    if (dnc && !e.dnc) return false;
    return true;
  });

  return (
    <div>
      <TitleBand title="Enquiries" subtitle="EV" right={
        <button onClick={() => setShowFilters(!showFilters)} className="relative p-2 rounded-full hover:bg-white/10"><Filter size={18} />
          {applied > 0 && <span className="absolute -top-0.5 -right-0.5 bg-hot text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{applied}</span>}
        </button>
      } />
      <Page className="space-y-4">
        <Tabs tabs={TABS} value={tab} onChange={setTab} counts={counts} />
        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input className={`${inputCls} !pl-9 !rounded-full`} placeholder="Search by name or mobile number" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Btn variant={unassigned ? "primary" : "outline"} onClick={() => setUnassigned(!unassigned)}>Unassigned Leads</Btn>
          <Btn variant={aiOnly ? "primary" : "outline"} onClick={() => setAiOnly(!aiOnly)}><Bot size={14} /> AI qualified</Btn>
        </div>

        {showFilters && (
          <Collapsible title="Filters" hint={applied ? `(${applied}) Filters Applied` : undefined} defaultOpen>
            <div className="space-y-3">
              <div><div className="text-xs text-gray-500 mb-1.5">Category</div><div className="flex gap-1.5 flex-wrap">{CATS.map((c) => <Pill key={c} on={cats.includes(c)} onClick={() => tog(cats, c, setCats)}>{c}</Pill>)}</div></div>
              <div><div className="text-xs text-gray-500 mb-1.5">Enquiry Type</div><div className="flex gap-1.5 flex-wrap">{SOURCES.map((s) => <Pill key={s} on={srcs.includes(s)} onClick={() => tog(srcs, s, setSrcs)}>{s}</Pill>)}</div></div>
              <div><div className="text-xs text-gray-500 mb-1.5">Enquiry Tag & Handled by</div><div className="flex gap-1.5 flex-wrap">
                <Pill on={aiOnly} onClick={() => setAiOnly(!aiOnly)}>AI qualified</Pill>
                <Pill on={unassigned} onClick={() => setUnassigned(!unassigned)}>Unassigned</Pill>
                <Pill on={dnc} onClick={() => setDnc(!dnc)}>Do not call</Pill>
              </div></div>
              <div className="flex gap-2 justify-end">
                <Btn variant="outline" onClick={() => { setCats([]); setSrcs([]); setAiOnly(false); setUnassigned(false); setDnc(false); }}>Clear All</Btn>
                <Btn onClick={() => setShowFilters(false)}>Apply</Btn>
              </div>
            </div>
          </Collapsible>
        )}

        {list.length === 0 ? <Empty text="No enquiries found" /> : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {list.map((e) => (
              <Card key={e.id} className="overflow-hidden flex flex-col">
                {!!e.lapsedDays && e.lapsedDays > 0 && <div className="bg-red-50 text-hot text-xs font-medium px-4 py-1">Lapsed Time: {e.lapsedDays} days</div>}
                <div className="p-4 space-y-2.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {e.tag && (e.tag === "AI qualified" ? <AiMark agent={e.aiOwner ?? "meera"} label="AI qualified" /> : <Chip tone="violet">{e.tag}</Chip>)}
                      {!e.assignedTo && <Chip tone="amber">Unassigned</Chip>}
                      {e.dnc && <Chip tone="red">Do not call</Chip>}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <button title="AI pre-call brief" onClick={() => setBrief(e)} className="p-1 rounded-full text-brand hover:bg-brand-soft"><Bot size={16} /></button>
                      <Share2 size={15} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{e.name}</span>
                    <CategoryBadge c={e.category} />
                    {e.ai && e.ai.category !== e.category && <Chip tone="blue"><span className="font-semibold">AI suggests: {e.ai.category}</span></Chip>}
                  </div>
                  <div className="text-xs text-gray-500">{e.phone} · {e.source}</div>
                  <div className="text-sm">{e.vehicles.slice(0, 1).map((v) => variantById(v).name)}{e.vehicles.length > 1 && <span className="text-brand"> +{e.vehicles.length - 1}</span>}</div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>Received: {fmtDate(e.receivedAt)}</div>
                    <div>Follow ups taken: {e.followUps}{e.nextFollowUp && <> · Next: {fmtDate(e.nextFollowUp)}</>}</div>
                  </div>
                  {e.ai && <div className="text-xs bg-brand-soft/60 rounded-lg px-2.5 py-1.5 text-gray-700"><AiMark label={`${e.ai.score}`} className="mr-1" />{e.ai.nextAction}</div>}
                  <OwnerStrip e={e} />
                </div>
                <div className="flex gap-2 px-4 pb-4">
                  <Btn variant="outline" className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${e.id}`)}>View Enquiry</Btn>
                  <Btn className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${e.id}/follow-up`)}><Phone size={13} /> Follow Up</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="sticky bottom-3 flex justify-center"><Btn onClick={() => router.push("/enquiries/new")}><Plus size={14} /> Create Enquiry</Btn></div>
      </Page>
      <PreCallBrief e={brief} open={!!brief} onClose={() => setBrief(null)} />
    </div>
  );
}
