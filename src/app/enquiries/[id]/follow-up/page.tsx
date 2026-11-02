"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Headphones, MessageCircle, Mic, Phone, PhoneOff, Sparkles, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { variantById } from "@/lib/variants";
import { NOW } from "@/lib/base";
import type { Category, EnquiryStatus, TranscriptLine } from "@/lib/types";
import { AiMark, Btn, Card, CategoryBadge, Chip, Collapsible, Empty, Field, inputCls, Page, TitleBand } from "@/components/ui/kit";

const UPDATES = ["Spoke with Customer", "SMS'ed", "Customer Visited", "Busy / No answer", "Switched off"];
const STATUSES: EnquiryStatus[] = ["Followed Up", "Postponed", "Converted", "Lost & Dropped"];

const SCRIPT: TranscriptLine[] = [
  { who: "dse", text: "Namaste, I'm calling from Shree Motors TVS about your iQube enquiry. Is this a good time?" },
  { who: "customer", text: "Yes, tell me. I mainly want to know the real-world range and EMI." },
  { who: "dse", text: "Real-world range is about 100 km in the city. EMI can start near 4,500 a month." },
  { who: "customer", text: "Okay. I can come for a test ride this Saturday morning, and I'll decide on finance after that." },
  { who: "dse", text: "Great, I'll book Saturday before 12 PM at the dealership and call you Friday to confirm." },
];

const Tag = () => <Sparkles size={11} className="inline text-brand ml-1" />;

export default function FollowUp() {
  const { id } = useParams<{ id: string }>();
  const { enquiries, updateEnquiry, addInteraction, toast } = useStore();
  const router = useRouter();
  const e = enquiries.find((x) => x.id === id);

  const [walkin, setWalkin] = useState(false);
  const [phase, setPhase] = useState<"idle" | "live" | "ended">("idle");
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [secs, setSecs] = useState(0);
  const [prefilled, setPrefilled] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [update, setUpdate] = useState("");
  const [status, setStatus] = useState<EnquiryStatus>("Followed Up");
  const [comments, setComments] = useState("");
  const [next, setNext] = useState("2026-11-06T11:00");
  const [method, setMethod] = useState("Call");
  const [mode, setMode] = useState<"Cash" | "Finance">("Cash");
  const [cat, setCat] = useState<Category>("Not Set");
  const [ride, setRide] = useState<"Not Planned" | "Scheduled">("Not Planned");
  const [slot, setSlot] = useState<"Before 12 PM" | "After 12 PM">("Before 12 PM");
  const [place, setPlace] = useState<"At Dealership" | "At Home">("At Dealership");
  const [rideDate, setRideDate] = useState("2026-11-07");
  const [error, setError] = useState(false);

  useEffect(() => { if (e) setCat(e.category); }, [e?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  if (!e) return <div><TitleBand title="Capture Follow Up" /><Page><Empty text="Enquiry not found" /></Page></div>;

  const start = () => {
    setPhase("live"); setLines([]); setSecs(0);
    let i = 0;
    timer.current = setInterval(() => {
      setSecs((s) => s + 1);
      if (i < SCRIPT.length && Math.random() > 0.35) { const l = SCRIPT[i++]; setLines((x) => [...x, l]); }
    }, 900);
  };
  const end = () => {
    if (timer.current) clearInterval(timer.current);
    if (lines.length < SCRIPT.length) setLines(SCRIPT);
    setPhase("ended");
    setUpdate("Spoke with Customer"); setComments("Customer wants real-world range and EMI. Agreed on a Saturday morning test ride at the dealership; finance decision after the ride.");
    setNext("2026-11-06T11:00"); setMode("Finance"); setCat("Hot"); setRide("Scheduled"); setPrefilled(true);
    toast("AI summary ready. Fields pre-filled, please review");
  };
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  const submit = (editAfter: boolean) => {
    if (!update || !comments.trim()) { setError(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    addInteraction(e.id, {
      id: `H-${Date.now()}`, ts: NOW.toISOString(), source: walkin ? "WALK-IN" : "DSE CALL", title: `${update}${walkin ? " (walk-in)" : ""}`,
      detail: comments, transcript: phase === "ended" ? lines : undefined,
    });
    updateEnquiry(e.id, {
      status, category: cat, followUps: e.followUps + 1, nextFollowUp: new Date(next).toISOString(), comments,
      testRide: ride === "Scheduled" ? { variantId: e.vehicles[0], status: "Scheduled", date: rideDate, slot, place } : e.testRide,
    });
    toast("Follow up captured");
    router.push(editAfter ? `/enquiries/${e.id}` : "/enquiries");
  };

  const Radio = ({ v, cur, set }: { v: string; cur: string; set: (x: never) => void }) => (
    <button type="button" onClick={() => set(v as never)} className={`px-3 py-1.5 rounded-full text-sm border ${cur === v ? "bg-brand text-white border-brand" : "bg-white border-line text-gray-600"}`}>{v}</button>
  );

  return (
    <div>
      <TitleBand title="Capture Follow Up" subtitle={`${e.name} · ${e.phone}`} right={<><MessageCircle size={18} /><Phone size={18} /></>} />
      <Page className="space-y-4">
        {error && <div className="rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-sm px-4 py-2">Please fill the mandatory fields: Follow Up Update and Customer Comments.</div>}
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div><div className="font-semibold">{e.name}</div><div className="text-xs text-gray-500">{e.vehicles.map((v) => variantById(v).name).join(", ")}</div></div>
                <CategoryBadge c={e.category} />
              </div>
              {e.ai && <div className="text-xs bg-brand-soft/60 rounded-lg px-2.5 py-1.5"><AiMark label="Brief" className="mr-1" />{e.ai.nextAction}</div>}
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={walkin} disabled={phase === "live"} onChange={(x) => setWalkin(x.target.checked)} /> <Users size={13} /> Walk-in (2-speaker mode)</label>
              </div>

              {phase === "idle" && (
                <Btn onClick={start} disabled={e.dnc} className="w-full justify-center"><Phone size={14} /> {walkin ? "Start recording conversation" : "Follow Up"}</Btn>
              )}
              {e.dnc && <p className="text-xs text-hot">Do not call: customer opted out.</p>}
              {phase !== "idle" && (
                <div className="rounded-xl border border-line overflow-hidden">
                  <div className={`px-3 py-2 text-xs flex items-center justify-between ${phase === "live" ? "bg-green-50 text-done" : "bg-gray-50 text-gray-500"}`}>
                    <span className="flex items-center gap-1.5">{phase === "live" ? <span className="w-2 h-2 rounded-full bg-done live-dot" /> : null}
                      {walkin ? <><Mic size={13} /> Walk-in · 2 speakers (DSE + customer)</> : <><Headphones size={13} /> Connected via phone + headset</>}</span>
                    <span className="font-mono">{mmss}</span>
                  </div>
                  <div className="p-3 space-y-1.5 max-h-56 overflow-y-auto scroll-thin text-sm">
                    {lines.length === 0 && <p className="text-xs text-gray-400">Listening…</p>}
                    {lines.map((l, i) => (
                      <div key={i} className={`flex ${l.who === "customer" ? "justify-start" : "justify-end"}`}>
                        <span className={`px-3 py-1.5 rounded-2xl max-w-[85%] ${l.who === "customer" ? "bg-gray-100" : "bg-brand-soft text-brand"}`}>
                          <span className="block text-[10px] uppercase opacity-60">{l.who === "customer" ? "Customer" : "DSE"}</span>{l.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  {phase === "live" && <div className="p-3 border-t border-line"><Btn variant="danger" onClick={end} className="w-full justify-center"><PhoneOff size={14} /> End call</Btn></div>}
                </div>
              )}
              {phase === "ended" && (
                <div className="rounded-xl border border-brand/30 bg-brand-soft/50 p-3 text-sm space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-brand"><AiMark agent="meera" label="AI Meera summary" /></div>
                  <p>Wants range and EMI details. Test ride Saturday before 12 PM at the dealership. Leaning Finance. Likely to buy this week.</p>
                  <div className="flex gap-1.5 flex-wrap"><Chip tone="green">Consent: recorded</Chip><Chip tone="blue">Suggest: Hot</Chip></div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">Follow Up Update *{prefilled && <Tag />}</h3>
              <div className="flex gap-2 flex-wrap">{UPDATES.map((u) => <Radio key={u} v={u} cur={update} set={setUpdate as never} />)}</div>
              <Field label="Enquiry Status"><select className={inputCls} value={status} onChange={(x) => setStatus(x.target.value as EnquiryStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label={`Customer Comments *${prefilled ? " (AI pre-filled, editable)" : ""}`}><textarea rows={3} className={inputCls} value={comments} onChange={(x) => setComments(x.target.value)} /></Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Next Follow Up date and time"><input type="datetime-local" className={inputCls} value={next} onChange={(x) => setNext(x.target.value)} /></Field>
                <Field label="Preferred method"><select className={inputCls} value={method} onChange={(x) => setMethod(x.target.value)}><option>Call</option><option>WhatsApp</option><option>SMS</option><option>Visit</option></select></Field>
              </div>
            </Card>

            <Collapsible title={<>Additional Information{prefilled && <Tag />}</>} defaultOpen={prefilled}>
              <div className="space-y-3">
                <div><div className="text-xs text-gray-500 mb-1">Purchase Mode</div><div className="flex gap-2">{(["Cash", "Finance"] as const).map((m) => <Radio key={m} v={m} cur={mode} set={setMode as never} />)}</div></div>
                <div><div className="text-xs text-gray-500 mb-1">Enquiry Category</div><div className="flex gap-2">{(["Hot", "Warm", "Cold"] as const).map((m) => <Radio key={m} v={m} cur={cat} set={setCat as never} />)}</div></div>
                <Field label="Source of Awareness"><select className={inputCls} defaultValue="Digital"><option>Digital</option><option>Walk-in</option><option>Referral</option><option>Hoarding</option></select></Field>
              </div>
            </Collapsible>

            <Collapsible title={<>Test Ride{prefilled && <Tag />}</>} defaultOpen={prefilled}>
              <div className="space-y-3">
                <div className="flex gap-2">{(["Not Planned", "Scheduled"] as const).map((m) => <Radio key={m} v={m} cur={ride} set={setRide as never} />)}</div>
                {ride === "Scheduled" && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Vehicle"><input className={inputCls} readOnly value={variantById(e.vehicles[0]).name} /></Field>
                    <Field label="Date"><input type="date" className={inputCls} value={rideDate} onChange={(x) => setRideDate(x.target.value)} /></Field>
                    <Field label="Time"><select className={inputCls} value={slot} onChange={(x) => setSlot(x.target.value as typeof slot)}><option>Before 12 PM</option><option>After 12 PM</option></select></Field>
                    <Field label="Place"><select className={inputCls} value={place} onChange={(x) => setPlace(x.target.value as typeof place)}><option>At Dealership</option><option>At Home</option></select></Field>
                  </div>
                )}
              </div>
            </Collapsible>
          </div>
        </div>
        <div className="sticky bottom-3 flex justify-center gap-2">
          <Btn variant="outline" onClick={() => router.back()}>Cancel</Btn>
          <Btn variant="outline" onClick={() => submit(true)}>Submit & Edit Enquiry</Btn>
          <Btn onClick={() => submit(false)}>Submit</Btn>
        </div>
      </Page>
    </div>
  );
}
