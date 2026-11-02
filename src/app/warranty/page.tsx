"use client";
import { useState } from "react";
import Link from "next/link";
import { Flag } from "lucide-react";
import { AiMark, Btn, Card, Chip, Collapsible, Modal, Page, Stat, StatRow, Tabs, TitleBand, inr, fmtDay } from "@/components/ui/kit";
import { useStore } from "@/lib/store";
import { Meter, StateChip, L2_THRESHOLD } from "@/components/warranty/bits";
import type { ClaimBucket } from "@/lib/types";

const TABS = ["Auto-approve", "Human review", "Auto-reject"] as const;

export default function WarrantyPage() {
  const { claims, updateClaim, toast } = useStore();
  const [tab, setTab] = useState<ClaimBucket>("Auto-approve");
  const [confirm, setConfirm] = useState(false);

  const counts = Object.fromEntries(TABS.map((t) => [t, claims.filter((c) => c.bucket === t).length])) as Record<ClaimBucket, number>;
  const open = claims.filter((c) => c.state.startsWith("Pending"));
  const value = open.reduce((s, c) => s + c.amountInr, 0);
  const l2 = open.filter((c) => c.state === "Pending L2").length;
  const rows = claims.filter((c) => c.bucket === tab);
  const bulk = claims.filter((c) => c.bucket === "Auto-approve" && c.state === "Pending L1" && c.amountInr < L2_THRESHOLD);

  const bulkApprove = () => {
    bulk.forEach((c) => updateClaim(c.id, { state: "Approved", l1: "Meenal Rao" }));
    toast(`${bulk.length} claims approved at L1`);
    setConfirm(false);
  };

  return (
    <>
      <TitleBand title="Warranty Claims" subtitle="L1 and L2 review queue" right={<AiMark agent="mansi" label="AI Mansi pre-checked" />} />
      <Page className="space-y-4">
        <StatRow cols={5}>
          <Stat label="Open claims" value={open.length} />
          <Stat label="Open value" value={inr(value)} />
          <Stat label="Auto-approve candidates" value={counts["Auto-approve"]} tone="green" />
          <Stat label="Need human review" value={counts["Human review"]} tone="amber" />
          <Stat label="Waiting for L2" value={l2} tone="blue" />
        </StatRow>

        <div className="text-sm text-gray-600 bg-brand-soft rounded-xl px-4 py-2.5">
          AI Mansi has pre-checked every claim against warranty terms, photos, telemetry and history. Humans sign off: L1 reviews every claim, and claims of {inr(L2_THRESHOLD)} or more also need L2 approval.
        </div>

        <Tabs tabs={TABS} value={tab} onChange={setTab} counts={counts} />

        {tab === "Auto-approve" && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{bulk.length} claims under {inr(L2_THRESHOLD)} ready for bulk L1 approval</span>
            <Btn disabled={!bulk.length} onClick={() => setConfirm(true)}>Approve all ({bulk.length})</Btn>
          </div>
        )}

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 text-left">
              <tr>
                <th className="px-4 py-2.5">Claim</th>
                <th className="px-4 py-2.5">Part / failure</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">AI confidence</th>
                <th className="px-4 py-2.5">Flags</th>
                <th className="px-4 py-2.5">State</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-line hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/warranty/${c.id}`} className="text-brand font-medium">{c.id}</Link>
                    <div className="text-[11px] text-gray-400">{fmtDay(c.submittedAt)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.part}</div>
                    <div className="text-xs text-gray-500">{c.failure}</div>
                  </td>
                  <td className="px-4 py-3">
                    {inr(c.amountInr)}
                    {c.amountInr >= L2_THRESHOLD && <div className="text-[11px] text-violet-600">L2 required</div>}
                  </td>
                  <td className="px-4 py-3"><Meter value={c.confidence} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.flags.length ? c.flags.map((f) => <Chip key={f} tone="amber"><Flag size={10} />{f}</Chip>) : <span className="text-xs text-gray-400">None</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StateChip s={c.state} /></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="text-center text-gray-400 py-8">No claims in this bucket</td></tr>}
            </tbody>
          </table>
        </Card>

        <Collapsible title="How AI Mansi buckets claims">
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Auto-approve: all evidence present and pattern matches prior approved claims (confidence 85% and above).</li>
            <li>Human review: missing or conflicting evidence, or flags such as commercial use.</li>
            <li>Auto-reject: out of warranty or clear policy exclusion. A human can still override.</li>
          </ul>
        </Collapsible>
      </Page>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Approve all Auto-approve claims?">
        <p className="text-sm text-gray-600">
          {bulk.length} claims worth {inr(bulk.reduce((s, c) => s + c.amountInr, 0))} will be approved at L1. Claims of {inr(L2_THRESHOLD)} or more are excluded and stay for individual review.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="outline" onClick={() => setConfirm(false)}>Cancel</Btn>
          <Btn variant="success" onClick={bulkApprove}>Confirm approve</Btn>
        </div>
      </Modal>
    </>
  );
}
