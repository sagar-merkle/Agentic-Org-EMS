"use client";
import { useState } from "react";
import { Bot, GitCompare, Mic, Presentation, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { VARIANTS, imageFor, variantById } from "@/lib/variants";
import { AiMark, Btn, Chip, inr, Why } from "@/components/ui/kit";

const COMPETITORS = [
  { name: "Ather Rizta S", price: 124999, range: 123, speed: 80, kwh: 2.9, note: "Roomy seat, strong app" },
  { name: "Ola S1 Pro Gen 3", price: 134999, range: 242, speed: 120, kwh: 4.0, note: "Highest claimed range" },
  { name: "Bajaj Chetak 3503", price: 129000, range: 155, speed: 63, kwh: 3.5, note: "Metal body" },
  { name: "Hero Vida V2 Plus", price: 115000, range: 143, speed: 90, kwh: 3.4, note: "Swappable battery" },
];
const LANGS = ["English", "हिन्दी", "मराठी"];

export default function Salesmate() {
  const { toast } = useStore();
  const [view, setView] = useState<"home" | "compare" | "pitch">("home");
  const [tvs, setTvs] = useState("iqube-3-1-kwh");
  const [other, setOther] = useState(COMPETITORS[0].name);
  const [done, setDone] = useState(false);
  const [lang, setLang] = useState("English");
  const [pitchTab, setPitchTab] = useState("30 s");
  const v = variantById(tvs);
  const c = COMPETITORS.find((x) => x.name === other)!;

  const rows: { label: string; a: string; b: string; win: "a" | "b" | "tie" }[] = [
    { label: "Ex-showroom price", a: inr(v.priceInr), b: inr(c.price), win: v.priceInr <= c.price ? "a" : "b" },
    { label: "Range (claimed)", a: `${v.rangeKm} km`, b: `${c.range} km`, win: v.rangeKm >= c.range ? "a" : "b" },
    { label: "Top speed", a: `${v.topSpeed} km/h`, b: `${c.speed} km/h`, win: v.topSpeed >= c.speed ? "a" : "b" },
    { label: "Battery", a: `${v.kwh} kWh`, b: `${c.kwh} kWh`, win: v.kwh >= c.kwh ? "a" : "b" },
  ];
  const tvsWins = rows.filter((r) => r.win === "a").length;

  return (
    <div className="min-h-full" style={{ background: "linear-gradient(135deg,#fdf2f8 0%,#eef2ff 50%,#ecfeff 100%)" }}>
      <div className="px-6 py-6 max-w-[1100px] mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-semibold flex items-center gap-2">Salesmate AI <Chip tone="violet">New!</Chip></h1><p className="text-sm text-gray-500">EV pitches and comparisons for iQube, Orbiter and TVS X</p></div>
          <div className="flex gap-1">{LANGS.map((l) => <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-full text-xs border ${lang === l ? "bg-brand text-white border-brand" : "bg-white/70 border-line"}`}>{l}</button>)}</div>
        </div>
        <div className="relative max-w-md"><Search size={15} className="absolute left-3 top-2.5 text-gray-400" /><input className="w-full rounded-full border border-line bg-white/80 pl-9 pr-3 py-2 text-sm" placeholder="Search TVS EV model" /></div>

        {view === "home" && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { k: "pitch" as const, t: "Get Personalized Pitch", d: "5 s, 30 s and 2 min pitches", i: <Presentation size={22} />, g: "from-sky-400 to-indigo-500" },
              { k: "compare" as const, t: "Obtain Comparison Results", d: "TVS EV vs other brands", i: <GitCompare size={22} />, g: "from-fuchsia-400 to-purple-500" },
              { k: "buddy" as const, t: "Your AI Buddy", d: "Ask anything about EVs", i: <Bot size={22} />, g: "from-emerald-400 to-teal-500" },
            ].map((t) => (
              <button key={t.k} onClick={() => (t.k === "buddy" ? toast("Open Your AI Buddy from the floating button") : setView(t.k))} className={`rounded-2xl p-5 text-left text-white bg-gradient-to-br ${t.g} shadow hover:shadow-lg transition`}>
                {t.i}<div className="font-semibold mt-3">{t.t}</div><div className="text-xs opacity-90">{t.d}</div>
              </button>
            ))}
          </div>
        )}

        {view === "pitch" && (
          <div className="bg-white/90 rounded-2xl border border-line p-5 space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-semibold">Personalized pitch · {v.name}</h2><AiMark agent="meera" /></div>
            <select className="border border-line rounded-lg px-3 py-2 text-sm" value={tvs} onChange={(e) => setTvs(e.target.value)}>{VARIANTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
            <div className="flex gap-1">{["5 s", "30 s", "2 min"].map((t) => <button key={t} onClick={() => setPitchTab(t)} className={`px-4 py-1.5 rounded-full text-sm border ${pitchTab === t ? "bg-brand text-white border-brand" : "border-line"}`}>{t}</button>)}</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {pitchTab === "5 s" && `${v.name}: up to ${v.rangeKm} km range, ${v.topSpeed} km/h, from ${inr(v.priceInr)}.`}
              {pitchTab === "30 s" && `${v.name} gives you up to ${v.rangeKm} km on a charge from a ${v.kwh} kWh battery with a top speed of ${v.topSpeed} km/h. Running cost is a fraction of petrol and you can charge at home overnight. Ex-showroom ${inr(v.priceInr)}.`}
              {pitchTab === "2 min" && `${v.name} is built for daily city use. ${v.kwh} kWh battery, up to ${v.rangeKm} km IDC range (expect around 70% in real traffic), ${v.topSpeed} km/h top speed. Home charging on a 15A socket, low running cost, and a ₹5,000 refundable token holds your slot (iQube and Orbiter). Ask for a test ride today.`}
            </p>
            <Btn variant="outline" onClick={() => setView("home")}>Back</Btn>
          </div>
        )}

        {view === "compare" && (
          <div className="bg-white/90 rounded-2xl border border-line p-5 space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold flex items-center gap-2">Obtain Comparison Results <AiMark agent="meera" /></h2><Chip tone="gray">Competitor data indicative · simulated</Chip></div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-500">TVS model<select className="mt-1 w-full border border-line rounded-lg px-3 py-2 text-sm text-ink" value={tvs} onChange={(e) => { setTvs(e.target.value); setDone(false); }}>{VARIANTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
              <label className="text-xs text-gray-500">Compare with<select className="mt-1 w-full border border-line rounded-lg px-3 py-2 text-sm text-ink" value={other} onChange={(e) => { setOther(e.target.value); setDone(false); }}>{COMPETITORS.map((x) => <option key={x.name}>{x.name}</option>)}</select></label>
            </div>
            <div className="flex gap-2"><Btn onClick={() => setDone(true)}><GitCompare size={14} /> Obtain Comparison Results</Btn><Btn variant="ghost" onClick={() => setView("home")}>Back</Btn><Btn variant="ghost" onClick={() => toast("Voice query (demo)")}><Mic size={14} /></Btn></div>
            {done && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center text-center gap-2">
                  <div>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageFor(tvs)} alt="" className="h-24 mx-auto object-contain" /><div className="text-sm font-medium">{v.name}</div></div>
                  <div className="text-xs text-gray-400">vs</div>
                  <div className="rounded-xl bg-gray-50 py-6 text-sm font-medium">{c.name}<div className="text-xs text-gray-400 font-normal">{c.note}</div></div>
                </div>
                <table className="w-full text-sm">
                  <tbody>{rows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <td className={`py-2 text-center ${r.win === "a" ? "text-done font-semibold" : ""}`}>{r.a}</td>
                      <td className="py-2 text-center text-xs text-gray-500">{r.label}</td>
                      <td className={`py-2 text-center ${r.win === "b" ? "text-done font-semibold" : ""}`}>{r.b}</td>
                    </tr>
                  ))}</tbody>
                </table>
                <div className="rounded-xl bg-brand-soft p-3 text-sm"><AiMark agent="meera" label="AI summary" className="mr-2" />{v.name} leads on {tvsWins} of 4 specs. Lead with dealer service reach, charger bundling and a test ride, and be honest where {c.name} is ahead.</div>
                <Why factors={rows.map((r) => ({ label: r.label, delta: r.win === "a" ? 1 : -1, note: r.win === "a" ? "TVS ahead" : "Competitor ahead" }))} reason="Each spec is compared head to head. +1 means the TVS model is ahead." />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
