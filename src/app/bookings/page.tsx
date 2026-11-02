"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { SLOTS } from "@/lib/seed";
import { imageFor, variantById } from "@/lib/variants";
import type { BookingStatus } from "@/lib/types";
import { Btn, Card, Chip, Empty, fmtDate, inr, Page, Tabs, TitleBand } from "@/components/ui/kit";

const TABS = ["Total", "Open Partially Paid", "Open Fully Paid Online", "Allotted", "Invoiced", "Cancelled"] as const;

export default function Bookings() {
  const { bookings, enquiries, toast } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Total");
  const counts = Object.fromEntries(TABS.map((t) => [t, t === "Total" ? bookings.length : bookings.filter((b) => b.status === t).length]));
  const list = bookings.filter((b) => tab === "Total" || b.status === (tab as BookingStatus));

  return (
    <div>
      <TitleBand title="Bookings" right={<Chip className="!bg-white/20 !text-white">EV</Chip>} />
      <Page className="space-y-4">
        <Tabs tabs={TABS} value={tab} onChange={setTab} counts={counts} />
        {list.length === 0 ? <Empty text="No bookings" /> : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {list.map((b) => {
              const v = variantById(b.variantId);
              const enq = enquiries.find((e) => e.id === b.enquiryId);
              return (
                <Card key={b.id} className="p-4 space-y-2 flex flex-col">
                  <div className="flex justify-between items-start">
                    <Chip tone={b.finance === "Finance" ? "violet" : "green"}>{b.finance}</Chip>
                    <Chip tone={b.status === "Cancelled" ? "red" : b.status.startsWith("Open") ? "amber" : "green"}>{b.status}</Chip>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageFor(b.variantId, b.colour)} alt="" className="w-20 h-16 object-contain" />
                    <div><div className="font-semibold">{b.customer}</div><div className="text-xs text-gray-500">{b.phone}</div><div className="text-sm">{v.name} · {b.colour}</div></div>
                  </div>
                  <div className="text-xs text-gray-500">{b.id} · {fmtDate(b.createdAt)} · Paid {inr(b.amount)}{b.chargerIncluded && " · 650W charger"}</div>
                  <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600">DSE: {b.dse}</div>
                  <div className="flex gap-2 mt-auto pt-1">
                    <Btn variant="outline" className="flex-1 justify-center" onClick={() => toast(`${b.id}: booking details (demo)`)}>View Booking</Btn>
                    {enq && <Btn className="flex-1 justify-center" onClick={() => router.push(`/enquiries/${enq.id}/follow-up`)}>Follow Up</Btn>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        <p className="text-xs text-gray-400 text-center">Slots left (simulated): iQube {SLOTS.iQube.left}/{SLOTS.iQube.total} · Orbiter {SLOTS.Orbiter.left}/{SLOTS.Orbiter.total}</p>
        <div className="sticky bottom-3 flex justify-center"><Btn onClick={() => router.push("/bookings/new")}><Plus size={14} /> New Booking</Btn></div>
      </Page>
    </div>
  );
}
