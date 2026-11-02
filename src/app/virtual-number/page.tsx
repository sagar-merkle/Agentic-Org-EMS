"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { DEALER, HUMANS, agentById } from "@/lib/base";
import { AgentDot, AiMark, Btn, Card, Chip, Collapsible, Page, TitleBand } from "@/components/ui/kit";

export default function VirtualNumber() {
  const { toast } = useStore();
  const meera = agentById("meera");
  const [meeraOn, setMeeraOn] = useState(true);
  const [humans, setHumans] = useState(HUMANS.slice(0, 4));
  const order = meeraOn ? ["AI Meera", ...humans] : humans;
  const ringing = order.slice(0, 2);

  const move = (i: number, d: number) => {
    const l = [...humans]; const j = i + d;
    if (j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]]; setHumans(l);
  };
  const displaced = meeraOn ? humans[1] : null;

  return (
    <div>
      <TitleBand title="Virtual Number Call Management" subtitle={`${DEALER.name} · ${DEALER.code}`} />
      <Page className="space-y-4 max-w-4xl">
        <Card className="p-5 flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-brand-soft text-brand flex items-center justify-center"><Phone size={18} /></span>
          <div><div className="text-xs text-gray-500">Dealer virtual number</div><div className="text-lg font-semibold">{DEALER.virtualNumber}</div></div>
          <div className="ml-auto text-xs text-gray-500">Incoming calls ring the top 2 assignees</div>
        </Card>

        <Card className="p-4 flex items-center justify-between gap-3" >
          <div className="flex items-center gap-3">
            <AgentDot agent="meera" />
            <div>
              <div className="font-medium text-sm flex items-center gap-2">AI Meera answers first <AiMark agent="meera" label="Assignee 0" /></div>
              <div className="text-xs text-gray-500">Answers inbound calls, qualifies, books test rides, and transfers to a human on request.</div>
            </div>
          </div>
          <button onClick={() => setMeeraOn(!meeraOn)} aria-label="AI Meera inbound" className={`w-11 h-6 rounded-full relative transition ${meeraOn ? "bg-brand" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${meeraOn ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Call priority</div>
          {order.map((u, i) => {
            const isAi = u === "AI Meera";
            const hi = meeraOn ? i - 1 : i;
            const rings = i < 2;
            return (
              <div key={u} className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${rings ? "border-brand bg-brand-soft/40" : "border-line"}`} style={isAi ? { background: meera.tint } : undefined}>
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white border text-xs flex items-center justify-center">{meeraOn ? i : i + 1}</span>
                  {u}{isAi && <Chip tone="blue">AI</Chip>}
                  {rings ? <Chip tone="green">Rings</Chip> : <Chip tone="gray">Not rung</Chip>}
                  {u === displaced && <Chip tone="amber">Pushed out of top 2 by AI Meera</Chip>}
                </span>
                {!isAi && (
                  <span className="flex gap-1">
                    <button onClick={() => move(hi, -1)} className="p-1 rounded hover:bg-gray-100"><ArrowUp size={14} /></button>
                    <button onClick={() => move(hi, 1)} className="p-1 rounded hover:bg-gray-100"><ArrowDown size={14} /></button>
                    <Btn variant="ghost" onClick={() => setHumans(humans.filter((x) => x !== u))}>Unassign</Btn>
                  </span>
                )}
              </div>
            );
          })}
        </Card>

        <Collapsible title="Why does a human drop out?">
          <p className="text-sm text-gray-600">EMS rings only the top 2 assignees. With AI Meera as Assignee 0, she takes one of the two slots and the human who was second moves to third, so they are no longer rung. Switch AI Meera off to restore the original routing. Currently ringing: {ringing.join(" and ")}.</p>
        </Collapsible>
        <div className="sticky bottom-3 flex justify-center gap-2"><Btn variant="outline">Cancel</Btn><Btn onClick={() => toast("Call routing saved")}>Apply</Btn></div>
      </Page>
    </div>
  );
}
