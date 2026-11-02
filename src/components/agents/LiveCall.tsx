"use client";
import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { LIVE_SCRIPT } from "@/lib/seed";
import { agentById } from "@/lib/base";
import { AgentDot, Card, Chip } from "@/components/ui/kit";

const END = 24;

export function LiveCall() {
  const [t, setT] = useState(0);
  const a = agentById(LIVE_SCRIPT.agentId);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x >= END + 4 ? 0 : x + 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const shown = LIVE_SCRIPT.steps.filter((s) => s.at <= t);
  const next = LIVE_SCRIPT.steps.find((s) => s.at > t);
  const fields = shown.filter((s) => "field" in s && s.field).map((s) => (s as { field: { k: string; v: string } }).field);
  const done = t >= END;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <AgentDot agent={a.id} size={34} />
        <div className="flex-1">
          <div className="font-semibold text-sm flex items-center gap-2">
            Live call · {a.name} <span className="relative flex h-2 w-2">{!done && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />}<span className={`relative inline-flex rounded-full h-2 w-2 ${done ? "bg-gray-400" : "bg-red-500"}`} /></span>
          </div>
          <div className="text-xs text-gray-500">{LIVE_SCRIPT.customer} · {LIVE_SCRIPT.phone} · {LIVE_SCRIPT.type} {LIVE_SCRIPT.channel}</div>
        </div>
        <Chip tone={done ? "green" : "red"}><PhoneCall size={11} /> {done ? "Completed" : `Live 0:${String(Math.min(t, 59)).padStart(2, "0")}`}</Chip>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (t / END) * 100)}%`, background: a.colour }} />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2 min-h-[210px]">
          {shown.map((s, i) => (
            <div key={i} className={`flex ${s.line.who === "customer" ? "justify-end" : ""} fade-up`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${s.line.who === "customer" ? "bg-gray-100" : ""}`} style={s.line.who !== "customer" ? { background: a.tint } : undefined}>
                {s.line.text}
              </div>
            </div>
          ))}
          {next && !done && (
            <div className={`flex ${next.line.who === "customer" ? "justify-end" : ""}`}>
              <div className="rounded-2xl px-3 py-2 bg-gray-50 flex gap-1">
                {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />)}
              </div>
            </div>
          )}
        </div>
        <div className="border-l border-line pl-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">Captured live</div>
          {fields.length === 0 && <div className="text-xs text-gray-400">Listening…</div>}
          {fields.map((f, i) => (
            <div key={i} className="flex justify-between text-sm py-1 fade-up"><span className="text-gray-500">{f.k}</span><span className="font-medium">{f.v}</span></div>
          ))}
          {done && <div className="mt-3 text-xs bg-green-50 text-green-700 rounded-lg p-2">Test ride Saturday AM queued for approval. Lead → Hot.</div>}
        </div>
      </div>
    </Card>
  );
}
