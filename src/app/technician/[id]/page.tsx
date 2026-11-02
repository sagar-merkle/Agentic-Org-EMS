"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Camera, CheckCircle2, Square, CheckSquare } from "lucide-react";
import { useStore } from "@/lib/store";
import { AiMark, Btn, Card, Chip, Empty, Page, TitleBand } from "@/components/ui/kit";
import { StatusChip, vehicleName } from "@/components/service/bits";

export default function TechJob() {
  const { id } = useParams<{ id: string }>();
  const { jobs, vehicles, updateJob, toast } = useStore();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const job = jobs.find((j) => j.id === id);
  if (!job) return <Page><Empty text="Job not found" /></Page>;
  const v = vehicles.find((x) => x.id === job.vehicleId)!;
  const d = job.diagnosis;
  const finished = job.status === "Ready" || job.status === "Delivered";
  const doneCount = d ? d.steps.filter((_, i) => checked[i]).length : 0;
  const allDone = !d || doneCount === d.steps.length;

  const scan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); toast("Photo scanned"); }, 900);
  };

  return (
    <>
      <TitleBand title={`${job.id} · ${vehicleName(v)}`} subtitle={`${v.reg} · ${job.slot}`} right={<StatusChip s={job.status} />} />
      <Page className="space-y-4 max-w-2xl">
        <Link href="/technician" className="text-sm text-brand">← My Jobs</Link>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">Reported issue</h3>
            <AiMark agent="sagar" label="Co-Pilot" />
          </div>
          <p className="text-sm text-gray-700">{job.issue}</p>
          {job.voiceNote && <p className="text-xs text-gray-500 mt-1 italic">&ldquo;{job.voiceNote.translated}&rdquo;</p>}
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm">1. Scan part photo</h3>
          {!scanned ? (
            <Btn onClick={scan} disabled={scanning}><Camera size={15} /> {scanning ? "Scanning..." : "Scan photo (simulated upload)"}</Btn>
          ) : (
            <div className="rounded-xl bg-green-50 p-3 text-sm">
              <div className="flex items-center gap-1.5 font-medium text-green-700"><CheckCircle2 size={15} /> Part detected</div>
              <div className="mt-1">{d?.parts[0]?.name ?? "Wheel / tyre assembly"}</div>
              <div className="text-xs text-gray-500">NPQR: {d?.parts[0] ? `NP-${d.parts[0].bin.replace("-", "")}-7` : "NP-TY-2201"} · matches vehicle VIN</div>
            </div>
          )}
        </Card>

        {d ? (
          <>
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">2. Likely causes</h3>
                <div className="flex gap-1.5">
                  <Chip tone="blue">ETA {d.etaMin} min</Chip>
                  {d.needsBench && <Chip tone="amber">Needs bench</Chip>}
                </div>
              </div>
              {d.causes.map((c) => (
                <div key={c.cause}>
                  <div className="flex justify-between text-sm"><span>{c.cause}</span><span className="text-gray-500">{c.confidence}%</span></div>
                  <div className="h-1.5 rounded-full bg-gray-100 mt-1"><div className="h-1.5 rounded-full bg-done" style={{ width: `${c.confidence}%` }} /></div>
                </div>
              ))}
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">3. Repair steps <span className="text-gray-400 font-normal">({doneCount}/{d.steps.length})</span></h3>
              <ul className="space-y-1">
                {d.steps.map((s, i) => (
                  <li key={i}>
                    <button className="flex items-start gap-2 text-left text-sm w-full py-1.5" onClick={() => setChecked({ ...checked, [i]: !checked[i] })}>
                      {checked[i] ? <CheckSquare size={18} className="text-done shrink-0" /> : <Square size={18} className="text-gray-400 shrink-0" />}
                      <span className={checked[i] ? "line-through text-gray-400" : ""}>{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">Parts</h3>
              <ul className="divide-y divide-line">
                {d.parts.map((p) => (
                  <li key={p.name} className="py-2 flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="flex gap-2"><Chip tone={p.stock > 0 ? "green" : "red"}>{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</Chip><Chip>Bin {p.bin}</Chip></span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        ) : (
          <Card className="p-4 text-sm text-gray-500">No AI diagnosis for this job yet. Scan a photo to start; steps follow the advisor estimate: {job.estimateLines.map((l) => l.item).join(", ")}.</Card>
        )}

        {finished ? (
          <Chip tone="green">Job complete</Chip>
        ) : (
          <Btn variant="success" className="w-full justify-center !py-3" disabled={!allDone} onClick={() => { updateJob(job.id, { status: "Ready" }); toast(`${job.id} marked complete. Advisor notified.`); }}>Mark complete</Btn>
        )}
        {!finished && !allDone && <p className="text-xs text-gray-400 text-center">Tick every repair step to complete.</p>}
      </Page>
    </>
  );
}
