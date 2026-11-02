"use client";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import type { CallRecord, Outcome } from "@/lib/types";
import { agentById } from "@/lib/base";
import { AgentDot, CategoryBadge, Chip, Collapsible, Why, fmtDate, inr } from "@/components/ui/kit";

export const OUTCOME_TONE: Record<Outcome, "green" | "gray" | "red" | "amber"> = {
  Positive: "green",
  Neutral: "gray",
  "Needs human": "red",
  "No answer": "amber",
};

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function CallDetail({ c }: { c: CallRecord }) {
  const a = agentById(c.agentId);
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-3">
        <AgentDot agent={c.agentId} size={36} />
        <div className="flex-1">
          <div className="font-semibold">{c.customer} <span className="text-gray-400 font-normal">· {c.phone}</span></div>
          <div className="text-xs text-gray-500">{a.name} · {c.channel} · {c.type} · {fmtDate(c.ts)} · {mmss(c.durationSec)}</div>
        </div>
        <Chip tone={OUTCOME_TONE[c.outcome]}>{c.outcome}</Chip>
      </div>

      <div className="rounded-xl p-3" style={{ background: a.tint }}>
        <div className="text-xs font-semibold mb-1" style={{ color: a.colour }}>AI summary</div>
        {c.summary}
      </div>

      {c.captured.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-1.5">Captured fields</div>
          <div className="border border-line rounded-xl divide-y divide-line">
            {c.captured.map((f, i) => (
              <div key={i} className="px-3 py-2">
                <div className="flex justify-between"><span className="text-gray-500">{f.k}</span><span className="font-medium">{f.v}</span></div>
                {f.quote && <div className="text-xs text-gray-400 italic mt-0.5">“{f.quote}”</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {c.scoreChange && (
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-1.5">Lead score change</div>
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge c={c.scoreChange.from} /> <ArrowRight size={14} className="text-gray-400" /> <CategoryBadge c={c.scoreChange.to} />
          </div>
          <Why factors={c.scoreChange.factors} />
        </div>
      )}

      <div className="border border-line rounded-xl p-3 flex items-center gap-3">
        <UserRound size={16} className="text-brand" />
        <div className="flex-1">
          <div className="text-xs text-gray-500">Next action</div>
          <div className="font-medium">{c.nextAction}</div>
        </div>
        <Chip tone="blue">Owner: {c.nextOwner}</Chip>
      </div>

      {c.handoff && (
        <div className="text-xs bg-violet-50 text-violet-700 rounded-xl px-3 py-2">
          Handoff: {agentById(c.handoff.from).name} → {c.handoff.to}
        </div>
      )}

      <Collapsible title="Transcript" hint={`${c.transcript.length} lines`} defaultOpen>
        <div className="space-y-2">
          {c.transcript.length === 0 && <div className="text-gray-400">No conversation (no answer).</div>}
          {c.transcript.map((t, i) => (
            <div key={i} className={`flex ${t.who === "customer" ? "justify-end" : ""}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 ${t.who === "customer" ? "bg-gray-100" : "text-gray-800"}`} style={t.who !== "customer" ? { background: a.tint } : undefined}>
                <div className="text-[10px] uppercase text-gray-400">{t.who === "agent" ? a.name : t.who === "dse" ? "DSE" : "Customer"}</div>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title={<span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Consent & cost</span>}>
        <div className="flex justify-between"><span className="text-gray-500">Consent</span><span>{c.consent}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Cost of this interaction</span><span>{inr(c.costInr)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Use case</span><span>UC{c.useCase}</span></div>
      </Collapsible>
    </div>
  );
}
