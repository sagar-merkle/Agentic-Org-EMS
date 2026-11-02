"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { AiMark, Btn, Card, Chip, Empty, fmtDate, Page, Tabs, TitleBand } from "@/components/ui/kit";

const TABS = ["Today's Tasks", "Missed Tasks"] as const;

export default function Tasks() {
  const { tasks, enquiries, completeTask, toast } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Today's Tasks");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "Missed") setTab("Missed Tasks");
  }, []);

  const today = tasks.filter((t) => !t.done && !t.missed);
  const missed = tasks.filter((t) => !t.done && t.missed);
  const list = tab === "Today's Tasks" ? today : missed;

  return (
    <div>
      <TitleBand title="Your Tasks" />
      <Page className="space-y-4">
        <Tabs tabs={TABS} value={tab} onChange={setTab} counts={{ "Today's Tasks": today.length, "Missed Tasks": missed.length }} />
        {list.length === 0 ? <Empty text="All clear" /> : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {list.map((t) => {
              const e = enquiries.find((x) => x.id === t.enquiryId);
              return (
                <Card key={t.id} className={`p-4 space-y-2 ${t.missed ? "border-red-200" : ""}`}>
                  <div className="flex items-center justify-between">
                    <Chip tone={t.missed ? "red" : "blue"}>{t.kind}</Chip>
                    {t.createdBy && <AiMark agent={t.createdBy} />}
                  </div>
                  <div className="font-medium text-sm">{t.title}</div>
                  <div className="text-xs text-gray-500">{e?.name ?? t.enquiryId} · {t.enquiryId}</div>
                  <div className={`text-xs ${t.missed ? "text-hot" : "text-gray-500"}`}>{t.missed ? "Missed · was due " : "Due "}{fmtDate(t.due)}</div>
                  <div className="flex gap-2 pt-1">
                    <Btn variant="outline" className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${t.enquiryId}`)}>View</Btn>
                    {t.kind === "Call" || t.kind === "Follow up" ? (
                      <Btn variant="outline" onClick={() => router.push(`/enquiries/${t.enquiryId}/follow-up`)}><Phone size={13} /></Btn>
                    ) : null}
                    <Btn variant="success" onClick={() => { completeTask(t.id); toast("Task completed"); }}><Check size={13} /> Done</Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Page>
    </div>
  );
}
