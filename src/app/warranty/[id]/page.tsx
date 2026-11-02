"use client";
import { use } from "react";
import Link from "next/link";
import { Check, X as XIcon } from "lucide-react";
import { AiMark, Btn, Card, Chip, Page, TitleBand, Why, inr, fmtDate } from "@/components/ui/kit";
import { useStore } from "@/lib/store";
import { variantById } from "@/lib/variants";
import { Meter, StateChip, L2_THRESHOLD } from "@/components/warranty/bits";

export default function ClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { claims, jobs, vehicles, updateClaim, toast } = useStore();
  const c = claims.find((x) => x.id === id);
  if (!c) return <Page><p className="text-sm text-gray-500">Claim not found. <Link href="/warranty" className="text-brand">Back to claims</Link></p></Page>;

  const job = jobs.find((j) => j.id === c.jobId);
  const veh = vehicles.find((v) => v.id === c.vehicleId);
  const variant = veh ? variantById(veh.variantId) : null;
  const needsL2 = c.amountInr >= L2_THRESHOLD;

  const act = (patch: Parameters<typeof updateClaim>[1], msg: string) => {
    updateClaim(c.id, patch);
    toast(msg);
  };

  const timeline = [
    { t: c.submittedAt, text: `Claim submitted by ${c.dealer}` },
    { t: c.submittedAt, text: `AI Mansi pre-checked: ${c.bucket}, confidence ${c.confidence}%` },
    ...(c.l1 ? [{ t: "", text: `L1 approved by ${c.l1}` }] : []),
    ...(c.l2 ? [{ t: "", text: `L2 approved by ${c.l2}` }] : []),
    ...(c.state === "Rejected" ? [{ t: "", text: "Rejected" }] : []),
  ];

  return (
    <>
      <TitleBand title={`${c.id} · ${c.part}`} subtitle={`${c.failure} · ${c.dealer}`} right={<StateChip s={c.state} />} />
      <Page className="space-y-4">
        <Link href="/warranty" className="text-sm text-brand">← All claims</Link>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">AI Mansi summary</div>
                <AiMark agent="mansi" />
              </div>
              <p className="text-sm text-gray-700">{c.summary}</p>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500">Confidence</div>
                <div className="w-48"><Meter value={c.confidence} /></div>
                <Chip tone={c.bucket === "Auto-approve" ? "green" : c.bucket === "Auto-reject" ? "red" : "amber"}>{c.bucket}</Chip>
              </div>
              {c.flags.length > 0 && <div className="flex flex-wrap gap-1">{c.flags.map((f) => <Chip key={f} tone="amber">{f}</Chip>)}</div>}
              <Why
                reason="Mansi compares each claim to warranty terms, attached evidence, telemetry and similar past claims."
                factors={[
                  ...c.evidence.map((e) => ({ label: e.label, delta: e.ok ? 10 : -20 })),
                  ...c.flags.map((f) => ({ label: f, delta: -10 })),
                ]}
              />
            </Card>

            <Card className="p-4">
              <div className="font-semibold mb-2">Evidence checklist</div>
              <ul className="space-y-1.5">
                {c.evidence.map((e) => (
                  <li key={e.label} className="flex items-center gap-2 text-sm">
                    {e.ok ? <Check size={16} className="text-done" /> : <XIcon size={16} className="text-hot" />}
                    <span className={e.ok ? "" : "text-hot"}>{e.label}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <div className="font-semibold mb-2">Timeline</div>
              <ol className="space-y-2 border-l border-line pl-4">
                {timeline.map((e, i) => (
                  <li key={i} className="text-sm">
                    <span className="text-gray-400 text-xs mr-2">{e.t ? fmtDate(e.t) : "Just now"}</span>{e.text}
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 space-y-2">
              <div className="text-xs text-gray-500">Claim amount</div>
              <div className="text-2xl font-semibold">{inr(c.amountInr)}</div>
              <div className="text-xs text-gray-500">{needsL2 ? `L1 then L2 sign-off (${inr(L2_THRESHOLD)} or more)` : "L1 sign-off only"}</div>

              {c.state === "Pending L1" && (
                <Btn className="w-full justify-center" variant="success" onClick={() => act(needsL2 ? { state: "Pending L2", l1: "Meenal Rao" } : { state: "Approved", l1: "Meenal Rao" }, needsL2 ? `${c.id} approved at L1, sent to L2` : `${c.id} approved`)}>Approve L1</Btn>
              )}
              {c.state === "Pending L2" && (
                <Btn className="w-full justify-center" variant="success" onClick={() => act({ state: "Approved", l2: "Rajesh Iyer" }, `${c.id} approved at L2`)}>Approve L2</Btn>
              )}
              {c.state.startsWith("Pending") && (
                <>
                  <Btn className="w-full justify-center" variant="danger" onClick={() => act({ state: "Rejected" }, `${c.id} rejected`)}>Reject</Btn>
                  <Btn className="w-full justify-center" variant="outline" onClick={() => toast(`More information requested from ${c.dealer}`)}>Request more info</Btn>
                </>
              )}
            </Card>

            <Card className="p-4 space-y-1 text-sm">
              <div className="font-semibold mb-1">Vehicle</div>
              {veh && variant ? (
                <>
                  <div>{variant.name}</div>
                  <div className="text-gray-500">{veh.reg} · {veh.owner}</div>
                  <div className="text-gray-500">{veh.kms.toLocaleString("en-IN")} km · {veh.ageMonths} months</div>
                </>
              ) : <div className="text-gray-400">Not found</div>}
            </Card>

            <Card className="p-4 space-y-1 text-sm">
              <div className="font-semibold mb-1">Job card</div>
              {job ? (
                <>
                  <div>{job.id} · {job.status}</div>
                  <div className="text-gray-500">{job.issue}</div>
                  <div className="text-gray-500">Advisor: {job.advisor}</div>
                </>
              ) : <div className="text-gray-400">{c.jobId}</div>}
            </Card>
          </div>
        </div>
      </Page>
    </>
  );
}
