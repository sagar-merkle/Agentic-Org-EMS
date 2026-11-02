"use client";
import { Chip } from "@/components/ui/kit";
import type { Claim } from "@/lib/types";

export const L2_THRESHOLD = 20000;

export function Meter({ value }: { value: number }) {
  const c = value >= 85 ? "bg-done" : value >= 60 ? "bg-amber-500" : "bg-hot";
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full ${c}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium w-8 text-right">{value}%</span>
    </div>
  );
}

export function StateChip({ s }: { s: Claim["state"] }) {
  const tone = s === "Approved" ? "green" : s === "Rejected" ? "red" : s === "Pending L2" ? "violet" : "amber";
  return <Chip tone={tone}>{s}</Chip>;
}
