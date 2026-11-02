"use client";
import { useState } from "react";
import { Info } from "lucide-react";
import { useStore } from "@/lib/store";
import { HUMANS, agentById } from "@/lib/base";
import { AgentDot, AiMark, Btn, Card, Chip, Collapsible, Page, TitleBand } from "@/components/ui/kit";

export default function LeadManagement() {
  const { toast } = useStore();
  const meera = agentById("meera");
  const [firstTouch, setFirstTouch] = useState(true);
  const [users, setUsers] = useState(HUMANS.slice(0, 3));
  const pool = HUMANS.filter((h) => !users.includes(h));
  const order = firstTouch ? ["AI Meera", ...users] : users;

  return (
    <div>
      <TitleBand title="Digital Lead Management" subtitle="Shree Motors TVS · 100-1" />
      <Page className="space-y-4 max-w-4xl">
        <div className="rounded-xl bg-blue-50 text-blue-800 text-sm px-4 py-2 flex gap-2"><Info size={16} className="shrink-0 mt-0.5" /> Digital leads for this brand will be distributed among all assigned users.</div>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div><div className="font-semibold">TVS Electric (iQube, Orbiter, TVS X)</div><div className="text-xs text-gray-500">{users.length} human users{firstTouch && " and AI Meera"}</div></div>
            <Btn variant="outline" onClick={() => { setUsers(HUMANS.slice(0, 3)); setFirstTouch(true); toast("Reset to default"); }}>Reset to Default</Btn>
          </div>

          <div className="rounded-xl border p-4 flex items-center justify-between gap-3" style={{ background: meera.tint, borderColor: meera.colour + "55" }}>
            <div className="flex items-center gap-3">
              <AgentDot agent="meera" />
              <div>
                <div className="font-medium text-sm flex items-center gap-2">AI Meera <AiMark label="Assignee 0" agent="meera" /></div>
                <div className="text-xs text-gray-600">First touch: replies to every new digital lead within a minute, qualifies it, then hands it to the next human in the round robin.</div>
              </div>
            </div>
            <button onClick={() => setFirstTouch(!firstTouch)} aria-label="First touch" className={`w-11 h-6 rounded-full relative transition ${firstTouch ? "bg-brand" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${firstTouch ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2">Assigned users · order of distribution</div>
            <ol className="space-y-2">
              {order.map((u, i) => (
                <li key={u} className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm">
                  <span className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-gray-100 text-xs flex items-center justify-center">{firstTouch ? i : i + 1}</span>{u}{u === "AI Meera" && <Chip tone="blue">First touch</Chip>}</span>
                  {u !== "AI Meera" && <Btn variant="ghost" onClick={() => setUsers(users.filter((x) => x !== u))}>Unassign</Btn>}
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <Collapsible title="Unassigned users" hint="Recommended">
          {pool.length === 0 ? <p className="text-sm text-gray-400">Everyone is assigned</p> : (
            <ul className="space-y-2">{pool.map((u) => (
              <li key={u} className="flex items-center justify-between text-sm"><span>{u} <span className="text-xs text-gray-400">Electric Vehicle Consultant</span></span><Btn variant="outline" onClick={() => setUsers([...users, u])}>Assign</Btn></li>
            ))}</ul>
          )}
        </Collapsible>
        <div className="sticky bottom-3 flex justify-center gap-2"><Btn variant="outline">Cancel</Btn><Btn onClick={() => toast("Lead distribution saved")}>Apply</Btn></div>
      </Page>
    </div>
  );
}
