"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, ListChecks, Plus, Search, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { agentById, personaById } from "@/lib/base";
import { AgentDot, AiMark, Btn, Card, Page, Stat, StatRow, TitleBand } from "@/components/ui/kit";

export default function Home() {
  const { persona, ready, enquiries, bookings, tasks, approvals, decideApproval, toast } = useStore();
  const router = useRouter();
  const mine = persona === "branch" || persona === "dse";

  useEffect(() => {
    if (ready && !mine) router.replace(personaById(persona).home);
  }, [ready, mine, persona, router]);

  if (!mine) return null;

  const by = (s: string) => enquiries.filter((e) => e.status === s).length;
  const pending = approvals.filter((a) => a.state === "pending");
  const todayTasks = tasks.filter((t) => !t.done && !t.missed).length;
  const missed = tasks.filter((t) => !t.done && t.missed).length;
  const aiToday = enquiries.filter((e) => e.aiOwner).length;
  const me = personaById(persona);
  const go = (tab: string) => router.push(`/enquiries?tab=${encodeURIComponent(tab)}`);

  return (
    <div>
      <div className="px-6 pt-5 max-w-[1280px] mx-auto">
        <h1 className="text-xl font-semibold">Good morning, {me.person.split(" ")[0]}</h1>
        <p className="text-sm text-gray-500">{me.title} · Shree Motors TVS, Pune · EV</p>
      </div>
      <Page className="space-y-5 !pt-3">
        <div className="rounded-xl bg-brand-soft text-brand px-4 py-2 text-sm flex items-center gap-2">
          <AiMark /> AI handled {aiToday} enquiries today · {pending.length} items waiting for your approval
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Enquiries</h2>
          <StatRow cols={4}>
            <Stat label="Total Enquiries" value={enquiries.length} onClick={() => go("Not Followed Up")} />
            <Stat label="Not Followed Up" value={by("Not Followed Up")} tone="red" sub={`of ${enquiries.length}`} onClick={() => go("Not Followed Up")} />
            <Stat label="Followed Up" value={by("Followed Up")} tone="blue" onClick={() => go("Followed Up")} />
            <Stat label="Converted" value={by("Converted")} tone="green" onClick={() => go("Converted")} />
            <Stat label="Postponed" value={by("Postponed")} tone="amber" onClick={() => go("Postponed")} />
            <Stat label="Lost & Dropped" value={by("Lost & Dropped")} onClick={() => go("Lost & Dropped")} />
            <Stat label="AI qualified" value={enquiries.filter((e) => e.tag === "AI qualified").length} sub="by AI Meera" onClick={() => go("Not Followed Up")} />
            <Stat label="Unassigned" value={enquiries.filter((e) => !e.assignedTo).length} tone="amber" onClick={() => go("Not Followed Up")} />
          </StatRow>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Bookings & tasks</h2>
          <StatRow cols={4}>
            <Stat label="Bookings" value={bookings.length} onClick={() => router.push("/bookings")} />
            <Stat label="Open Partially Paid" value={bookings.filter((b) => b.status === "Open Partially Paid").length} tone="amber" onClick={() => router.push("/bookings")} />
            <Stat label="Today's Tasks" value={todayTasks} tone="blue" onClick={() => router.push("/tasks")} />
            <Stat label="Missed Tasks" value={missed} tone="red" onClick={() => router.push("/tasks")} />
          </StatRow>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">Approvals needed <AiMark label="AI proposals" /></h2>
          {pending.length === 0 ? (
            <Card className="p-6 text-sm text-gray-400 text-center">Nothing waiting. AI agents will ask here before acting.</Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {pending.map((a) => (
                <Card key={a.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AgentDot agent={a.agentId} size={24} />
                    <span className="text-xs text-gray-500">{agentById(a.agentId).name} · UC {a.useCase}</span>
                  </div>
                  <div className="font-medium text-sm">{a.title}</div>
                  <p className="text-xs text-gray-500 flex-1">{a.detail}</p>
                  <div className="flex gap-2 pt-1">
                    <Btn variant="success" onClick={() => { decideApproval(a.id, "approved"); toast("Approved"); }}>Approve</Btn>
                    <Btn variant="outline" onClick={() => { decideApproval(a.id, "rejected"); toast("Rejected"); }}>Reject</Btn>
                    {a.enquiryId && <Btn variant="ghost" onClick={() => router.push(`/enquiries/${a.enquiryId}`)}>View</Btn>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="sticky bottom-3 flex flex-wrap gap-2 justify-center">
          <Btn variant="outline" onClick={() => router.push("/enquiries")}><Search size={14} /> Search Enquiry</Btn>
          <Btn onClick={() => router.push("/enquiries/new")}><Plus size={14} /> Create Enquiry</Btn>
          <Btn variant="outline" onClick={() => router.push("/tasks")}><ListChecks size={14} /> Today&apos;s Tasks ({todayTasks})</Btn>
          <Btn variant="danger" onClick={() => router.push("/tasks?tab=Missed")}><CalendarCheck size={14} /> Missed Tasks ({missed})</Btn>
          <Btn variant="outline" onClick={() => router.push("/lead-management")}><Users size={14} /> Lead Management</Btn>
        </div>
      </Page>
    </div>
  );
}
