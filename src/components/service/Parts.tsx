"use client";
import { AiMark, Btn, Chip, Why } from "@/components/ui/kit";
import { useServiceActions } from "@/components/service/bits";
import type { Vehicle } from "@/lib/types";

export function WarrantyClock({ v }: { v: Vehicle }) {
  const w = v.warranty;
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="flex justify-between text-xs text-gray-600"><span>Months</span><span>{w.monthsUsed} / {w.monthsTotal}</span></div>
        <div className="h-2 rounded-full bg-gray-100 mt-1"><div className="h-2 rounded-full bg-brand" style={{ width: `${(w.monthsUsed / w.monthsTotal) * 100}%` }} /></div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-600"><span>Kms</span><span>{w.kmUsed.toLocaleString("en-IN")} / {w.kmTotal.toLocaleString("en-IN")}</span></div>
        <div className="h-2 rounded-full bg-gray-100 mt-1"><div className={`h-2 rounded-full ${w.kmUsed / w.kmTotal > 0.8 ? "bg-hot" : "bg-brand"}`} style={{ width: `${Math.min(100, (w.kmUsed / w.kmTotal) * 100)}%` }} /></div>
      </div>
    </div>
  );
}

export function UpgradeBlock({ v }: { v: Vehicle }) {
  const { upgradeEnquiry } = useServiceActions();
  const u = v.upgradeOffer;
  if (!u) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5">Upgrade offer score <AiMark agent="arjun" /></span>
        <span className="font-semibold">{u.score}/100</span>
      </div>
      {u.reasons.length > 0 && <Why factors={u.reasons} reason="Based on warranty usage, mileage and service history." />}
      {u.state === "enquiry created" ? (
        <Chip tone="green">Upgrade enquiry created</Chip>
      ) : (
        <Btn variant="outline" onClick={() => upgradeEnquiry(v)}>Create upgrade enquiry</Btn>
      )}
    </div>
  );
}
