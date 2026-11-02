"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { CALLS } from "@/lib/seed";
import { agentById } from "@/lib/base";
import { AgentDot, AiMark, Btn, Card, CategoryBadge, Chip, Empty, fmtDate, Page, Tabs, TitleBand } from "@/components/ui/kit";
import { sortScore } from "@/components/sales/bits";

const TABS = ["Callbacks", "Needs human", "By score"] as const;

export default function CallQueue() {
  const { enquiries } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Needs human");

  const needs = CALLS.filter((c) => c.outcome === "Needs human");
  const callbacks = CALLS.filter((c) => c.outcome === "No answer" || /call ?back/i.test(c.nextAction));
  const calls = tab === "Needs human" ? needs : callbacks;
  const byScore = enquiries.filter((e) => e.status === "Not Followed Up" && !e.dnc).sort(sortScore);

  return (
    <div>
      <TitleBand title="Call Queue" subtitle="Prioritised by AI score" />
      <Page className="space-y-4">
        <Tabs tabs={TABS} value={tab} onChange={setTab} counts={{ Callbacks: callbacks.length, "Needs human": needs.length, "By score": byScore.length }} />
        {tab === "By score" ? (
          byScore.length === 0 ? <Empty text="Queue empty" /> : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {byScore.map((e) => (
                <Card key={e.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between"><span className="font-semibold">{e.name}</span><CategoryBadge c={e.ai?.category ?? e.category} /></div>
                  <div className="text-xs text-gray-500">{e.phone} · {e.source}</div>
                  {e.ai && <div className="text-xs bg-brand-soft/60 rounded-lg px-2.5 py-1.5"><AiMark label={`${e.ai.score}`} className="mr-1" />{e.ai.nextAction}</div>}
                  <div className="flex gap-2"><Btn variant="outline" className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${e.id}`)}>View</Btn><Btn className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${e.id}/follow-up`)}><Phone size={13} /> Call</Btn></div>
                </Card>
              ))}
            </div>
          )
        ) : calls.length === 0 ? <Empty text="Nothing here" /> : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {calls.map((c) => (
              <Card key={c.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><AgentDot agent={c.agentId} size={22} /><span className="text-xs text-gray-500">{agentById(c.agentId).name} · {c.channel}</span></span>
                  <Chip tone={c.outcome === "Needs human" ? "red" : "amber"}>{c.outcome}</Chip>
                </div>
                <div className="font-semibold text-sm">{c.customer}</div>
                <div className="text-xs text-gray-500">{c.phone} · {fmtDate(c.ts)}</div>
                <p className="text-sm text-gray-600">{c.summary}</p>
                <div className="text-xs"><span className="text-gray-400">Next: </span>{c.nextAction} <span className="text-gray-400">· {c.nextOwner}</span></div>
                {c.handoff && <Chip tone="violet">Handoff {agentById(c.handoff.from).name} → {c.handoff.to}</Chip>}
                <div className="flex gap-2 pt-1">
                  {c.enquiryId && <Btn variant="outline" className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${c.enquiryId}`)}>View enquiry</Btn>}
                  {c.enquiryId && <Btn className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${c.enquiryId}/follow-up`)}><Phone size={13} /> Call</Btn>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Page>
    </div>
  );
}
