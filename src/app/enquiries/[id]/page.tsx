"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bot, Check, Phone, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { variantById, imageFor } from "@/lib/variants";
import { agentById, NOW } from "@/lib/base";
import type { Category, TestRide } from "@/lib/types";
import { AiMark, Btn, Card, CategoryBadge, Chip, Collapsible, Empty, Field, fmtDate, inputCls, inr, Modal, Page, Tabs, TitleBand, Why } from "@/components/ui/kit";
import { PreCallBrief } from "@/components/sales/bits";

const TABS = ["Customer History", "Enquiry Details", "Test Ride Details", "Booking Details"] as const;

export default function EnquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const { enquiries, bookings, updateEnquiry, addInteraction, toast } = useStore();
  const router = useRouter();
  const e = enquiries.find((x) => x.id === id);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Customer History");
  const [actions, setActions] = useState(false);
  const [brief, setBrief] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [tr, setTr] = useState<TestRide>({ variantId: "", status: "Scheduled", date: "2026-11-07", slot: "Before 12 PM", place: "At Dealership" });

  if (!e) return <div><TitleBand title="Enquiry" /><Page><Empty text="Enquiry not found" /></Page></div>;
  const booking = bookings.find((b) => b.id === e.bookingId || b.enquiryId === e.id);
  const missing = ["budget", "usage", "dailyKm", "city", "parking", "charging", "purchaseMode", "timeline"].filter((k) => !(e.intake as Record<string, string> | undefined)?.[k]);
  const trVariant = tr.variantId || e.testRide?.variantId || e.vehicles[0];

  const acceptAi = (c: Category) => {
    updateEnquiry(e.id, { category: c });
    toast(`Category set to ${c}`);
  };
  const saveRide = () => {
    updateEnquiry(e.id, { testRide: { ...tr, variantId: trVariant } });
    addInteraction(e.id, { id: `H-${Date.now()}`, ts: NOW.toISOString(), source: "ACCELERATOR", title: "Test ride scheduled", detail: `${variantById(trVariant).name}, ${tr.date}, ${tr.slot}, ${tr.place}` });
    toast("Test ride scheduled");
  };

  return (
    <div>
      <TitleBand title={e.name} subtitle={`${e.id} · ${e.phone}`} right={
        <>
          <button onClick={() => setBrief(true)} className="p-2 rounded-full hover:bg-white/10" title="AI pre-call brief"><Bot size={18} /></button>
          <button onClick={() => router.push(`/enquiries/${e.id}/follow-up`)} className="p-2 rounded-full bg-white/15 hover:bg-white/25" title="Call"><Phone size={16} /></button>
        </>
      } />
      <Page className="space-y-4">
        {missing.length > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2">Add Additional Information: {missing.join(", ")}</div>
        )}
        <Card className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div><div className="text-xs text-gray-400">Received</div>{fmtDate(e.receivedAt)}</div>
          <div><div className="text-xs text-gray-400">Created by</div>{e.createdBy}</div>
          <div><div className="text-xs text-gray-400">Assigned to</div>{e.assignedTo ?? "Unassigned"}</div>
          <div><div className="text-xs text-gray-400">Next follow-up</div>{e.nextFollowUp ? fmtDate(e.nextFollowUp) : "—"}</div>
          <div className="flex items-center gap-1.5 flex-wrap"><CategoryBadge c={e.category} />{e.tag && <Chip tone="violet">{e.tag}</Chip>}{e.dnc && <Chip tone="red">Do not call</Chip>}</div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Tabs tabs={TABS} value={tab} onChange={setTab} />

            {tab === "Customer History" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-600">Customer Interactions History</h3>
                {e.history.length === 0 && <Empty text="No interactions yet" />}
                {e.history.map((h, i) => (
                  <Card key={h.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-brand text-white text-xs flex items-center justify-center shrink-0">{e.history.length - i}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                          <span>{fmtDate(h.ts)}</span><Chip tone="blue">{h.source}</Chip>
                          {h.agentId && <AiMark agent={h.agentId} />}
                        </div>
                        <div className="font-medium text-sm mt-1">{h.title}</div>
                        <p className="text-sm text-gray-600 mt-0.5">{h.detail}</p>
                        {h.transcript && (
                          <Collapsible title="Transcript" className="mt-2 !rounded-xl">
                            <div className="space-y-1.5">
                              {h.transcript.map((t, j) => (
                                <div key={j} className={`text-sm flex gap-2 ${t.who === "customer" ? "" : "text-brand"}`}>
                                  <span className="w-16 shrink-0 text-xs uppercase text-gray-400 pt-0.5">{t.who}</span><span>{t.text}</span>
                                </div>
                              ))}
                            </div>
                          </Collapsible>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {tab === "Enquiry Details" && (
              <div className="space-y-3">
                <Collapsible title="Customer Information" defaultOpen>
                  {e.intake ? (
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      {Object.entries(e.intake).map(([k, v]) => (
                        <div key={k}><dt className="text-xs text-gray-400 capitalize">{k.replace(/([A-Z])/g, " $1")}</dt><dd className="flex items-center gap-1.5">{v}{e.aiOwner && <Sparkles size={11} className="text-brand" />}</dd></div>
                      ))}
                    </dl>
                  ) : <p className="text-sm text-gray-400">No intake captured</p>}
                  {e.aiOwner && e.intake && <p className="text-[11px] text-gray-400 mt-2">Captured by {agentById(e.aiOwner).name} during the first conversation.</p>}
                </Collapsible>
                <h3 className="text-sm font-semibold text-gray-600 pt-1">Interested Vehicles</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {e.vehicles.map((v) => {
                    const vv = variantById(v);
                    return (
                      <Card key={v} className="p-3 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageFor(v)} alt="" className="w-20 h-16 object-contain" />
                        <div className="text-sm"><div className="font-medium">{vv.name}</div><div className="text-xs text-gray-500">{vv.rangeKm} km · ex-showroom {inr(vv.priceInr)}</div></div>
                      </Card>
                    );
                  })}
                </div>
                {e.comments && <Card className="p-4 text-sm"><div className="text-xs text-gray-400">Comments</div>{e.comments}</Card>}
              </div>
            )}

            {tab === "Test Ride Details" && (
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Test Ride</h3>
                  {e.testRide && <Chip tone={e.testRide.status === "Completed" ? "green" : e.testRide.status === "Missed" ? "red" : "blue"}>{e.testRide.status}</Chip>}
                </div>
                {e.testRide && e.testRide.status !== "Not Planned" && (
                  <div className="rounded-xl bg-brand-soft p-3 text-sm">
                    {variantById(e.testRide.variantId).name}{e.testRide.date && <> · {e.testRide.date}</>}{e.testRide.slot && <> · {e.testRide.slot}</>}{e.testRide.place && <> · {e.testRide.place}</>}
                    {e.aiOwner && <div className="mt-1 text-xs flex items-center gap-1 text-brand"><AiMark agent="meera" label="Booked / reminded by AI Meera" /></div>}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Vehicle"><select className={inputCls} value={trVariant} onChange={(x) => setTr({ ...tr, variantId: x.target.value })}>{e.vehicles.map((v) => <option key={v} value={v}>{variantById(v).name}</option>)}</select></Field>
                  <Field label="Date"><input type="date" className={inputCls} value={tr.date} onChange={(x) => setTr({ ...tr, date: x.target.value })} /></Field>
                  <Field label="Time"><select className={inputCls} value={tr.slot} onChange={(x) => setTr({ ...tr, slot: x.target.value as TestRide["slot"] })}><option>Before 12 PM</option><option>After 12 PM</option></select></Field>
                  <Field label="Place"><select className={inputCls} value={tr.place} onChange={(x) => setTr({ ...tr, place: x.target.value as TestRide["place"] })}><option>At Dealership</option><option>At Home</option></select></Field>
                </div>
                <div className="flex gap-2"><Btn onClick={saveRide}>Schedule Test Ride</Btn>
                  {e.testRide?.status === "Scheduled" && <Btn variant="outline" onClick={() => { updateEnquiry(e.id, { testRide: { ...e.testRide!, status: "Completed" } }); toast("Marked completed"); }}><Check size={14} /> Mark completed</Btn>}</div>
                {trVariant === "tvs-x" && <p className="text-xs text-gray-500">TVS X stops at test ride. Booking is not open for it yet.</p>}
              </Card>
            )}

            {tab === "Booking Details" && (
              booking ? (
                <Card className="p-5 text-sm grid grid-cols-2 gap-3">
                  <div><div className="text-xs text-gray-400">Booking</div>{booking.id}</div>
                  <div><div className="text-xs text-gray-400">Status</div>{booking.status}</div>
                  <div><div className="text-xs text-gray-400">Vehicle</div>{variantById(booking.variantId).name} · {booking.colour}</div>
                  <div><div className="text-xs text-gray-400">Amount</div>{inr(booking.amount)}</div>
                </Card>
              ) : (
                <Card className="p-6 text-center space-y-3"><p className="text-sm text-gray-500">No booking yet</p><Btn onClick={() => router.push(`/bookings/new?enquiry=${e.id}`)}>Proceed To Booking</Btn></Card>
              )
            )}
          </div>

          <div className="space-y-3">
            {e.ai ? (
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold">Classification</span><AiMark agent="meera" /></div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip tone="blue" className="!text-xs"><Sparkles size={11} /> AI suggests: {e.ai.category}</Chip>
                  <span className="text-2xl font-semibold">{e.ai.score}</span><span className="text-xs text-gray-400">/ 100</span>
                  {e.ai.limitedData && <Chip tone="amber">Limited data</Chip>}
                </div>
                <p className="text-sm text-gray-600">{e.ai.reason}</p>
                <div className="text-sm"><span className="text-xs text-gray-400 block">Next best action</span>{e.ai.nextAction}</div>
                <div className="flex gap-2">
                  {e.category !== e.ai.category ? <Btn onClick={() => acceptAi(e.ai!.category)}>Accept</Btn> : <Chip tone="green"><Check size={11} /> Accepted</Chip>}
                  <Btn variant="outline" onClick={() => toast("Keeping DSE category")}>Keep mine</Btn>
                </div>
                <Why factors={e.ai.factors} reason="Score is the sum of these signals. You can override it." />
              </Card>
            ) : (
              <Card className="p-4 text-sm text-gray-500">No AI score yet. Capture a follow up to generate one.</Card>
            )}
            {e.dnc && <Card className="p-3 text-xs text-hot bg-red-50 border-red-200">Customer opted out of calls. AI agents will not call this number.</Card>}
          </div>
        </div>

        <div className="sticky bottom-3 flex justify-center gap-2">
          <Btn variant="outline" onClick={() => setActions(true)}>Actions</Btn>
          <Btn onClick={() => router.push(`/enquiries/${e.id}/follow-up`)}>Follow Up</Btn>
        </div>
      </Page>

      <Modal open={actions} onClose={() => setActions(false)} title="Actions">
        <div className="grid gap-2">
          {["Assign", "Generate Quotation", "Customer Feedback", "Ask AI to call", "Approve AI proposal"].map((a) => (
            <Btn key={a} variant="outline" className="justify-center" onClick={() => { setOpen(a); setActions(false); toast(a === "Ask AI to call" ? "AI Meera queued a call" : a === "Approve AI proposal" ? "No pending AI proposal" : `${a} (demo)`); }}>
              {a.includes("AI") && <Sparkles size={13} />} {a}
            </Btn>
          ))}
          <Btn className="justify-center" onClick={() => router.push(`/bookings/new?enquiry=${e.id}`)}>Proceed To Booking</Btn>
        </div>
        {open && <span className="hidden" />}
      </Modal>
      <PreCallBrief e={e} open={brief} onClose={() => setBrief(false)} />
    </div>
  );
}
