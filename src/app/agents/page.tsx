"use client";
import { useMemo, useState } from "react";
import { Check, Pause, Play, X } from "lucide-react";
import { TitleBand, Page, Card, Btn, Chip, AgentDot, Collapsible, Stat, StatRow, Drawer, AiMark, fmtDate, inr } from "@/components/ui/kit";
import { AGENTS, agentById } from "@/lib/base";
import { CALLS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { AgentId, CallChannel, CallRecord, Outcome } from "@/lib/types";
import { CallDetail, OUTCOME_TONE, mmss } from "@/components/agents/CallDetail";
import { LiveCall } from "@/components/agents/LiveCall";

const selCls = "border border-line rounded-full px-3 py-1.5 text-sm bg-white";

export default function AgentsPage() {
  const { approvals, decideApproval, toast } = useStore();
  const [paused, setPaused] = useState<Record<string, boolean>>({});
  const [fAgent, setFAgent] = useState<AgentId | "all">("all");
  const [fOutcome, setFOutcome] = useState<Outcome | "all">("all");
  const [fChannel, setFChannel] = useState<CallChannel | "all">("all");
  const [open, setOpen] = useState<CallRecord | null>(null);

  const pending = approvals.filter((a) => a.state === "pending");
  const kpi = useMemo(() => ({
    total: CALLS.length,
    pos: CALLS.filter((c) => c.outcome === "Positive").length,
    human: CALLS.filter((c) => c.outcome === "Needs human").length,
    cost: CALLS.reduce((s, c) => s + c.costInr, 0),
  }), []);
  const rows = CALLS.filter((c) => (fAgent === "all" || c.agentId === fAgent) && (fOutcome === "all" || c.outcome === fOutcome) && (fChannel === "all" || c.channel === fChannel))
    .sort((a, b) => b.ts.localeCompare(a.ts));

  const togglePause = (id: AgentId) => {
    setPaused((p) => ({ ...p, [id]: !p[id] }));
    toast(`${agentById(id).name} ${paused[id] ? "resumed" : "paused"}`);
  };

  return (
    <>
      <TitleBand title="AI Agents" subtitle="Agents do the legwork and prepare; your team approves and closes" right={<AiMark label="5 agents" />} />
      <Page className="space-y-5">
        <StatRow cols={5}>
          <Stat label="Calls & chats today" value={kpi.total} sub="across voice, WhatsApp, chat" tone="blue" />
          <Stat label="Positive outcomes" value={kpi.pos} sub={`${Math.round((kpi.pos / kpi.total) * 100)}% of conversations`} tone="green" />
          <Stat label="Needs a human" value={kpi.human} tone="red" sub="handed off with context" />
          <Stat label="Approvals pending" value={pending.length} tone="amber" sub="waiting for your team" />
          <Stat label="AI cost today" value={inr(Math.round(kpi.cost))} sub="all agents" />
        </StatRow>

        <div className="grid md:grid-cols-5 gap-3">
          {AGENTS.map((a) => {
            const isPaused = paused[a.id];
            const status = isPaused ? "Paused" : a.status;
            return (
              <Card key={a.id} className="p-3.5 flex flex-col" >
                <div className="h-1 rounded-full mb-3" style={{ background: a.colour }} />
                <div className="flex items-center gap-2">
                  <AgentDot agent={a.id} size={32} />
                  <div className="leading-tight">
                    <div className="font-semibold text-sm">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.role}</div>
                  </div>
                </div>
                <div className="mt-2"><Chip tone={status === "On call" ? "green" : status === "Paused" ? "amber" : "gray"}>● {status}</Chip></div>
                <p className="text-xs text-gray-600 mt-2 flex-1 min-h-[48px]">{isPaused ? "Paused by you. No new outreach." : a.doing}</p>
                <div className="flex flex-wrap gap-1 mt-2">{a.useCases.map((u) => <span key={u} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: a.tint, color: a.colour }}>UC{u}</span>)}</div>
                <Btn variant="outline" className="mt-3 justify-center !py-1 !text-xs" onClick={() => togglePause(a.id)}>
                  {isPaused ? <><Play size={12} /> Resume</> : <><Pause size={12} /> Pause</>}
                </Btn>
              </Card>
            );
          })}
        </div>

        <LiveCall />

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm">Approvals needed <span className="text-xs text-gray-400 font-normal">· agents prepare, humans approve</span></div>
            <Chip tone="amber">{pending.length} pending</Chip>
          </div>
          {pending.length === 0 && <div className="text-sm text-gray-400 py-4 text-center">All caught up.</div>}
          <div className="divide-y divide-line">
            {pending.map((ap) => (
              <div key={ap.id} className="py-2.5 flex items-center gap-3">
                <AgentDot agent={ap.agentId} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{ap.title} <span className="text-[11px] text-gray-400 font-normal">UC{ap.useCase}</span></div>
                  <div className="text-xs text-gray-500">{ap.detail}</div>
                </div>
                <Btn variant="success" className="!py-1 !text-xs" onClick={() => { decideApproval(ap.id, "approved"); toast("Approved"); }}><Check size={12} /> Approve</Btn>
                <Btn variant="outline" className="!py-1 !text-xs" onClick={() => { decideApproval(ap.id, "rejected"); toast("Rejected"); }}><X size={12} /> Reject</Btn>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="font-semibold text-sm mr-auto">Call & activity log</div>
            <select className={selCls} value={fAgent} onChange={(e) => setFAgent(e.target.value as AgentId | "all")}>
              <option value="all">All agents</option>{AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select className={selCls} value={fOutcome} onChange={(e) => setFOutcome(e.target.value as Outcome | "all")}>
              <option value="all">All outcomes</option>{(["Positive", "Neutral", "Needs human", "No answer"] as Outcome[]).map((o) => <option key={o}>{o}</option>)}
            </select>
            <select className={selCls} value={fChannel} onChange={(e) => setFChannel(e.target.value as CallChannel | "all")}>
              <option value="all">All channels</option>{(["Voice", "WhatsApp", "Chat"] as CallChannel[]).map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-gray-500 border-b border-line">
                <th className="py-2 pr-3">Time</th><th className="pr-3">Agent</th><th className="pr-3">Customer</th><th className="pr-3">Channel</th><th className="pr-3">Type</th><th className="pr-3">Outcome</th><th className="pr-3">Duration</th><th>Next action</th>
              </tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} onClick={() => setOpen(c)} className="border-b border-line last:border-0 hover:bg-brand-soft cursor-pointer">
                    <td className="py-2 pr-3 whitespace-nowrap">{fmtDate(c.ts)}</td>
                    <td className="pr-3 whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><AgentDot agent={c.agentId} size={20} />{agentById(c.agentId).name}</span></td>
                    <td className="pr-3">{c.customer}</td>
                    <td className="pr-3">{c.channel}</td>
                    <td className="pr-3 whitespace-nowrap">{c.type}</td>
                    <td className="pr-3"><Chip tone={OUTCOME_TONE[c.outcome]}>{c.outcome}</Chip></td>
                    <td className="pr-3">{mmss(c.durationSec)}</td>
                    <td className="text-gray-600 max-w-[260px] truncate">{c.nextAction}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={8} className="text-center text-gray-400 py-8">No interactions match the filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        <Collapsible title="Analytics, cost & consent" hint="extras">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">Outcomes by agent</div>
              {AGENTS.map((a) => {
                const l = CALLS.filter((c) => c.agentId === a.id);
                const p = l.filter((c) => c.outcome === "Positive").length;
                return (
                  <div key={a.id} className="mb-2">
                    <div className="flex justify-between text-xs"><span>{a.name}</span><span>{p}/{l.length}</span></div>
                    <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 rounded-full" style={{ width: `${l.length ? (p / l.length) * 100 : 0}%`, background: a.colour }} /></div>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">Cost by agent</div>
              {AGENTS.map((a) => (
                <div key={a.id} className="flex justify-between py-0.5"><span>{a.name}</span><span>{inr(Math.round(CALLS.filter((c) => c.agentId === a.id).reduce((s, c) => s + c.costInr, 0)))}</span></div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">Consent</div>
              {(["Recorded", "Not asked", "Opted out"] as const).map((k) => (
                <div key={k} className="flex justify-between py-0.5"><span>{k}</span><span>{CALLS.filter((c) => c.consent === k).length}</span></div>
              ))}
              <p className="text-xs text-gray-400 mt-2">Opted-out customers are never contacted again by agents.</p>
            </div>
          </div>
        </Collapsible>
      </Page>

      <Drawer open={!!open} onClose={() => setOpen(null)} title="Call outcome" width={560}>
        {open && <CallDetail c={open} />}
      </Drawer>
    </>
  );
}
