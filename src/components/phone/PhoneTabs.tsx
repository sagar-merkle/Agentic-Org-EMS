"use client";
import { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Send, CheckCheck, Mic } from "lucide-react";
import { VARIANTS, imageFor } from "@/lib/variants";
import { DEALER } from "@/lib/base";
import { inr } from "@/components/ui/kit";

type Msg = { me?: boolean; text?: string; cards?: string[]; time?: string };

function useScroll(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [dep]);
  return ref;
}

function VariantCard({ id }: { id: string }) {
  const v = VARIANTS.find((x) => x.id === id)!;
  return (
    <div className="bg-white rounded-xl border border-gray-200 w-56 overflow-hidden shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageFor(v.id)} alt={v.name} className="h-28 w-full object-contain bg-gray-50" />
      <div className="p-2.5 text-xs">
        <div className="font-semibold text-sm">{v.name}</div>
        <div className="text-gray-500">{v.rangeKm} km range · {v.topSpeed} km/h</div>
        <div className="font-semibold text-sky-700 mt-0.5">{inr(v.priceInr)} <span className="font-normal text-gray-400">ex-showroom</span></div>
      </div>
    </div>
  );
}

function Thread({ msgs, typing, bubbleMe, bubbleBot, cardsOk }: { msgs: Msg[]; typing: boolean; bubbleMe: string; bubbleBot: string; cardsOk?: boolean }) {
  const ref = useScroll(msgs.length + (typing ? 1 : 0));
  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-2 scroll-thin">
      {msgs.map((m, i) => (
        <div key={i} className={`flex flex-col gap-1.5 ${m.me ? "items-end" : "items-start"}`}>
          {m.text && (
            <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px] shadow-sm ${m.me ? bubbleMe : bubbleBot}`}>
              {m.text}
              {m.time && <span className="block text-[9px] text-right opacity-50 mt-0.5">{m.time}{m.me && <CheckCheck size={10} className="inline ml-0.5 text-sky-500" />}</span>}
            </div>
          )}
          {cardsOk && m.cards?.map((c) => <VariantCard key={c} id={c} />)}
        </div>
      ))}
      {typing && <div className={`inline-flex gap-1 rounded-2xl px-3 py-2 ${bubbleBot}`}>{[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />)}</div>}
    </div>
  );
}

function Composer({ chips, onSend, tone }: { chips: string[]; onSend: (t: string) => void; tone: "sky" | "green" }) {
  const [v, setV] = useState("");
  const chipCls = tone === "green" ? "border-green-600 text-green-700" : "border-sky-500 text-sky-700";
  return (
    <div className="border-t border-gray-200 bg-white p-2">
      <div className="flex gap-1.5 overflow-x-auto pb-2 scroll-thin">
        {chips.map((c) => <button key={c} onClick={() => onSend(c)} className={`shrink-0 text-xs border rounded-full px-3 py-1 bg-white hover:bg-gray-50 ${chipCls}`}>{c}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (v.trim()) { onSend(v.trim()); setV(""); } }} className="flex gap-2">
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Type a message" className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm" />
        <button className={`w-8 h-8 rounded-full text-white inline-flex items-center justify-center ${tone === "green" ? "bg-green-600" : "bg-sky-500"}`}><Send size={14} /></button>
      </form>
    </div>
  );
}

const T = () => "10:3" + Math.floor(Math.random() * 9);

/* ---------------- Chat: AI Meera ---------------- */
type ChatStep = "free" | "km" | "slot" | "done";

export function ChatTab() {
  const [msgs, setMsgs] = useState<Msg[]>([{ text: "Hi, I am AI Meera from Shree Motors TVS. Looking for an electric scooter? I can compare models, share prices and book a test ride.", time: "10:30" }]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<ChatStep>("free");
  const [chips, setChips] = useState(["Show EV options", "Best range", "Under ₹1.2 lakh", "Book a test ride"]);

  const bot = (m: Msg, nextChips: string[], nextStep?: ChatStep) => {
    setTyping(true);
    setChips([]);
    setTimeout(() => {
      setTyping(false);
      setMsgs((l) => [...l, { ...m, time: T() }]);
      setChips(nextChips);
      if (nextStep) setStep(nextStep);
    }, 900);
  };
  const free = ["Show EV options", "Best range", "Under ₹1.2 lakh", "Book a test ride"];

  const send = (t: string) => {
    setMsgs((l) => [...l, { me: true, text: t, time: T() }]);
    const s = t.toLowerCase();
    if (step === "km") return bot({ text: `Noted: ${t}. Which slot suits you for the test ride?` }, ["Sat before 12 PM", "Sat after 12 PM", "Sun before 12 PM"], "slot");
    if (step === "slot") return bot({ text: `Test ride booked: ${t.replace("Sat", "Saturday").replace("Sun", "Sunday")} at ${DEALER.name}, ${DEALER.city}. AI Arjun will remind you the day before. Anything else?` }, ["Show EV options", "Talk to a person"], "done");
    if (s.includes("test") || s.includes("ride") || s.includes("book")) return bot({ text: "Happy to arrange it. First, roughly how many km will you ride per day?" }, ["Under 10 km", "10-25 km", "25-50 km", "50+ km"], "km");
    if (s.includes("range")) return bot({ text: "For the longest range, these two lead the line-up:", cards: ["iqube-st-5-3-kwh", "iqube-s-4-7-kwh"] }, ["Book a test ride", "Under ₹1.2 lakh"]);
    if (s.includes("lakh") || s.includes("budget") || s.includes("under") || s.includes("price")) return bot({ text: "Within about ₹1.2 lakh these fit well:", cards: ["orbiter-v2", "iqube-2-3-kwh"] }, ["Book a test ride", "Best range"]);
    if (s.includes("person") || s.includes("human")) return bot({ text: "Sure. I am passing this chat with full context to Aveg Patekar, our sales executive. He will call you shortly." }, free);
    if (s.includes("option") || s.includes("show") || s.includes("ev")) return bot({ text: "Here are our popular EVs:", cards: ["iqube-3-1-kwh", "orbiter-v2", "iqube-s-4-7-kwh"] }, ["Book a test ride", "Best range"]);
    return bot({ text: "I can help with EV models, prices, range and test rides. What would you like to know?" }, free);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-3 py-2.5 flex items-center gap-2 bg-sky-500 text-white">
        <span className="w-8 h-8 rounded-full bg-white text-sky-600 font-bold inline-flex items-center justify-center">M</span>
        <div className="leading-tight"><div className="text-sm font-semibold">AI Meera</div><div className="text-[10px] opacity-80">{DEALER.name} · online</div></div>
      </div>
      <Thread msgs={msgs} typing={typing} bubbleMe="bg-sky-500 text-white" bubbleBot="bg-gray-100 text-gray-800" cardsOk />
      <Composer chips={chips} onSend={send} tone="sky" />
    </div>
  );
}

/* ---------------- WhatsApp: Arjun / Sagar ---------------- */
type WaStage = { bot: string; chips: string[] };
const WA: WaStage[] = [
  { bot: "Hi Aarti, this is AI Arjun from Shree Motors TVS. Reminder: your Orbiter V2 test ride is tomorrow, Saturday 11:00 AM at the showroom. Please carry your driving licence.", chips: ["Confirm", "Reschedule"] },
  { bot: "Thank you, confirmed. 🎉 Separately, AI Sagar here: your iQube is at 9,800 km and due for a free service. Slots are open Mon 10 AM and Tue 2 PM.", chips: ["Book Mon 10 AM", "Book Tue 2 PM", "Not now"] },
  { bot: "Service booked. You will get pickup details on the day. After your test ride we will ask for feedback. How was your recent service experience?", chips: ["⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐"] },
  { bot: "Thanks for the feedback! It goes straight to our CX team. Have a great day. 🙏", chips: [] },
];

export function WhatsAppTab() {
  const [msgs, setMsgs] = useState<Msg[]>([{ text: WA[0].bot, time: "09:00" }]);
  const [stage, setStage] = useState(0);
  const [typing, setTyping] = useState(false);

  const send = (t: string) => {
    if (typing) return;
    setMsgs((l) => [...l, { me: true, text: t, time: T() }]);
    const next = stage + 1;
    if (!WA[next]) return setStage(next);
    setTyping(true);
    setStage(next);
    setTimeout(() => { setTyping(false); setMsgs((l) => [...l, { text: next === 1 && t === "Reschedule" ? "No problem, we will call you to reschedule. " + WA[1].bot : WA[next].bot, time: T() }]); }, 1000);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#efeae2" }}>
      <div className="px-3 py-2.5 flex items-center gap-2 text-white" style={{ background: "#075e54" }}>
        <span className="w-8 h-8 rounded-full bg-amber-400 text-white font-bold inline-flex items-center justify-center">S</span>
        <div className="leading-tight"><div className="text-sm font-semibold">{DEALER.name}</div><div className="text-[10px] opacity-80">Business account · AI assisted</div></div>
      </div>
      <Thread msgs={msgs} typing={typing} bubbleMe="bg-[#d9fdd3] text-gray-800" bubbleBot="bg-white text-gray-800" />
      <Composer chips={WA[stage]?.chips ?? []} onSend={send} tone="green" />
    </div>
  );
}

/* ---------------- Voice: inbound call ---------------- */
const VOICE = [
  { at: 1, who: "agent", text: "Shree Motors TVS, this is AI Meera. How may I help you?" },
  { at: 4, who: "customer", text: "I want an electric scooter for my daughter, around 15 km a day." },
  { at: 8, who: "agent", text: "For 15 km, the Orbiter V2 or iQube 2.3 kWh both work. What is your budget?" },
  { at: 12, who: "customer", text: "About a lakh and ten thousand." },
  { at: 16, who: "agent", text: "Orbiter V2 fits. May I record this call and arrange a test ride?" },
  { at: 20, who: "customer", text: "Yes, Saturday morning." },
  { at: 24, who: "agent", text: "Done. Saturday 11 AM at the showroom. You will get a WhatsApp confirmation now." },
] as const;

export function VoiceTab() {
  const [state, setState] = useState<"idle" | "live" | "ended">("idle");
  const [t, setT] = useState(0);
  useEffect(() => {
    if (state !== "live") return;
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [state]);
  useEffect(() => { if (state === "live" && t > 28) setState("ended"); }, [t, state]);
  const lines = VOICE.filter((l) => l.at <= t);
  const ref = useScroll(lines.length);
  const speaking = state === "live" && lines.length > 0 ? lines[lines.length - 1].who === "agent" && t - lines[lines.length - 1].at < 3 : false;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-900 to-slate-900 text-white">
      <div className="flex flex-col items-center pt-8 pb-4">
        <div className="relative">
          {speaking && <span className="absolute inset-0 rounded-full bg-sky-400/40 animate-ping" />}
          <div className="relative w-24 h-24 rounded-full bg-sky-500 text-4xl font-bold inline-flex items-center justify-center border-4 border-white/20">M</div>
        </div>
        <div className="mt-3 font-semibold">AI Meera</div>
        <div className="text-xs text-sky-200">{DEALER.virtualNumber}</div>
        <div className="text-xs mt-1 text-sky-100">{state === "idle" ? "Ready to call" : state === "live" ? `Connected · 0:${String(t).padStart(2, "0")}` : "Call ended"}</div>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto px-4 space-y-2 scroll-thin">
        {state === "idle" && <p className="text-center text-xs text-sky-200 mt-6">Tap call to simulate an inbound enquiry. Live captions appear here.</p>}
        {lines.map((l, i) => (
          <div key={i} className={`flex ${l.who === "customer" ? "justify-end" : ""} fade-up`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-[13px] ${l.who === "customer" ? "bg-white/15" : "bg-sky-500/80"}`}>{l.text}</div>
          </div>
        ))}
        {state === "ended" && <div className="text-center text-xs bg-green-500/20 text-green-200 rounded-lg p-2">Test ride booked. Lead qualified as Hot. Summary sent to the DSE.</div>}
      </div>
      <div className="p-5 flex justify-center gap-6">
        {state === "live" ? (
          <button onClick={() => setState("ended")} className="w-14 h-14 rounded-full bg-red-500 inline-flex items-center justify-center"><PhoneOff size={22} /></button>
        ) : (
          <button onClick={() => { setT(0); setState("live"); }} className="w-14 h-14 rounded-full bg-green-500 inline-flex items-center justify-center"><Phone size={22} /></button>
        )}
        <span className="w-14 h-14 rounded-full bg-white/10 inline-flex items-center justify-center"><Mic size={20} /></span>
      </div>
    </div>
  );
}
