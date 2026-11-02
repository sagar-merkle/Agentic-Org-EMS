"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Pencil, Languages } from "lucide-react";
import { useStore } from "@/lib/store";
import { AiMark, Btn, Card, Chip, Collapsible, Empty, Page, TitleBand, inr, inputCls } from "@/components/ui/kit";
import { JOB_FLOW, StatusChip, vehicleName } from "@/components/service/bits";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { jobs, vehicles, claims, updateJob, toast } = useStore();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [issueEdit, setIssueEdit] = useState<string | null>(null);
  const job = jobs.find((j) => j.id === id);
  if (!job) return <Page><Empty text="Job card not found" /></Page>;
  const v = vehicles.find((x) => x.id === job.vehicleId)!;
  const claim = claims.find((c) => c.id === job.claimId || c.jobId === job.id);
  const step = JOB_FLOW.indexOf(job.status);
  const approved = job.status !== "Booked" && job.status !== "Drop & leave" && job.status !== "Awaiting approval";

  const saveLine = (i: number) => {
    const n = parseInt(draft, 10);
    if (isNaN(n) || n < 0) return;
    const lines = job.estimateLines.map((l, k) => (k === i ? { ...l, inr: n } : l));
    updateJob(job.id, { estimateLines: lines, estimateInr: lines.reduce((s, l) => s + l.inr, 0) });
    setEditing(null);
    toast("Estimate line updated");
  };

  return (
    <>
      <TitleBand
        title={`${job.id} · ${v.owner}`}
        subtitle={`${vehicleName(v)} · ${v.reg} · ${job.slot}`}
        right={<StatusChip s={job.status} />}
      />
      <Page className="space-y-4">
        <Link href="/service/jobs" className="text-sm text-brand">← Job Cards</Link>

        <Card className="p-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {JOB_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1 min-w-[90px]">
                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 ${i <= step ? "bg-brand text-white" : "bg-gray-100 text-gray-400"}`}>{i < step ? <Check size={13} /> : i + 1}</span>
                <span className={`text-xs ${i === step ? "font-semibold text-brand" : "text-gray-500"}`}>{s}</span>
                {i < JOB_FLOW.length - 1 && <span className={`flex-1 h-0.5 ${i < step ? "bg-brand" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Issue</h3>
                {job.createdBy !== "Advisor" ? <AiMark agent={job.createdBy} label="Created by AI Sagar" /> : <Chip>Advisor</Chip>}
              </div>
              {issueEdit === null ? (
                <p className="text-sm text-gray-700">{job.issue} <span className="text-xs text-gray-400">(AI-drafted from {job.source.toLowerCase()})</span></p>
              ) : (
                <div className="flex gap-2">
                  <input className={inputCls} value={issueEdit} onChange={(e) => setIssueEdit(e.target.value)} />
                  <Btn onClick={() => { updateJob(job.id, { issue: issueEdit }); setIssueEdit(null); toast("Issue updated"); }}>Save</Btn>
                </div>
              )}
              {issueEdit === null && <button className="text-xs text-brand mt-1" onClick={() => setIssueEdit(job.issue)}>Edit issue</button>}
              {job.voiceNote ? (
                <div className="mt-3 rounded-xl bg-green-50 p-3 space-y-2">
                  <div className="text-xs font-semibold text-green-700 flex items-center gap-1"><Languages size={13} /> Customer voice note · {job.voiceNote.lang} (about 2 min)</div>
                  <p className="text-sm">{job.voiceNote.transcript}</p>
                  <p className="text-sm text-gray-600 italic">English: {job.voiceNote.translated}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-3">No voice note on this job.</p>
              )}
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">Estimate</h3>
              <ul className="divide-y divide-line">
                {job.estimateLines.map((l, i) => (
                  <li key={i} className="py-2 flex items-center justify-between text-sm gap-2">
                    <span>{l.item}</span>
                    {editing === i ? (
                      <span className="flex gap-2 items-center">
                        <input className={`${inputCls} !w-24`} value={draft} onChange={(e) => setDraft(e.target.value)} />
                        <Btn onClick={() => saveLine(i)}>Save</Btn>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {inr(l.inr)}
                        {!approved && <button className="text-gray-400 hover:text-brand" onClick={() => { setEditing(i); setDraft(String(l.inr)); }} aria-label="Edit line"><Pencil size={13} /></button>}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-sm border-t border-line pt-2 mt-1"><span>Total</span><span>{inr(job.estimateInr)}</span></div>
              {job.status === "Awaiting approval" && (
                <div className="flex gap-2 mt-3">
                  <Btn variant="success" onClick={() => { updateJob(job.id, { status: "In repair", technician: job.technician ?? "Santosh Gaikwad" }); toast("Estimate approved. Technician notified."); }}>Approve estimate</Btn>
                  <Btn variant="outline" onClick={() => toast("Use the pencil to edit a line, then approve")}>Edit</Btn>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 space-y-2">
              <h3 className="font-semibold text-sm">Next step</h3>
              {job.status === "Booked" && (
                <>
                  <Btn variant="outline" onClick={() => { updateJob(job.id, { status: "Drop & leave", slot: "Drop-off today" }); toast("Drop & leave: vehicle received, customer can leave"); }}>Customer drops &amp; leaves</Btn>
                  <Btn onClick={() => { updateJob(job.id, { status: "Awaiting approval" }); toast("Estimate sent for approval"); }}>Send estimate for approval</Btn>
                </>
              )}
              {job.status === "Drop & leave" && (
                <>
                  <p className="text-xs text-gray-500">Customer has left the vehicle. AI Sagar sent the estimate on WhatsApp.</p>
                  <Btn onClick={() => { updateJob(job.id, { status: "Awaiting approval" }); toast("Estimate shared with customer"); }}>Request estimate approval</Btn>
                </>
              )}
              {job.status === "In repair" && <Btn variant="success" onClick={() => { updateJob(job.id, { status: "Ready" }); toast("Marked ready. Customer notified."); }}>Mark ready</Btn>}
              {job.status === "Ready" && <Btn variant="success" onClick={() => { updateJob(job.id, { status: "Delivered" }); toast("Vehicle delivered"); }}>Deliver vehicle</Btn>}
              {job.status === "Awaiting approval" && <p className="text-xs text-gray-500">Approve the estimate to release the job to the technician.</p>}
              {job.status === "Delivered" && <p className="text-xs text-gray-500">Job closed.</p>}
            </Card>

            <Card className="p-4 text-sm space-y-1">
              <h3 className="font-semibold text-sm mb-1">Details</h3>
              <div className="flex justify-between"><span className="text-gray-500">Advisor</span>{job.advisor}</div>
              <div className="flex justify-between"><span className="text-gray-500">Technician</span>{job.technician ?? "Unassigned"}</div>
              <div className="flex justify-between"><span className="text-gray-500">Booked via</span>{job.bookedVia}</div>
              <div className="flex justify-between"><span className="text-gray-500">Source</span>{job.source}</div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">Warranty claim</h3>
              {claim ? (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><Link href="/warranty" className="text-brand font-medium">{claim.id}</Link><Chip tone="blue">{claim.state}</Chip></div>
                  <div className="text-gray-600">{claim.part} · {inr(claim.amountInr)}</div>
                </div>
              ) : (
                <Btn variant="outline" onClick={() => toast("Warranty claim raised from this job card")}>Raise warranty claim</Btn>
              )}
            </Card>
          </div>
        </div>

        {job.diagnosis && (
          <Collapsible title="AI diagnosis shared with technician" hint="likely causes">
            <ul className="space-y-1 text-sm">
              {job.diagnosis.causes.map((c) => <li key={c.cause} className="flex justify-between"><span>{c.cause}</span><span className="text-gray-500">{c.confidence}%</span></li>)}
            </ul>
          </Collapsible>
        )}
      </Page>
    </>
  );
}
