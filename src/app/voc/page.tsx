"use client";
import { useMemo, useState } from "react";
import { MessageSquareHeart, PhoneCall } from "lucide-react";
import { AiMark, AgentDot, Btn, Card, Chip, Collapsible, Field, Modal, Page, Stat, StatRow, TitleBand, Why, fmtDay, inputCls } from "@/components/ui/kit";
import { useStore } from "@/lib/store";
import { FEEDBACK } from "@/lib/seedService";
import { CALLS } from "@/lib/seed";
import type { Feedback } from "@/lib/types";

const ALL = "All";
const uniq = (f: (x: Feedback) => string) => [ALL, ...Array.from(new Set(FEEDBACK.map(f)))];
const mask = (t: string) => t.replace(/\+?\d[\d\s-]{8,}\d/g, "[phone]").replace(/[\w.]+@[\w.]+/g, "[email]");
const tone = (s: Feedback["sentiment"]) => (s === "Positive" ? "green" : s === "Negative" ? "red" : "gray");

export default function VocPage() {
  const { toast } = useStore();
  const [model, setModel] = useState(ALL);
  const [region, setRegion] = useState(ALL);
  const [channel, setChannel] = useState(ALL);
  const [sent, setSent] = useState(ALL);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [cModel, setCModel] = useState(ALL);
  const [cRegion, setCRegion] = useState(ALL);
  const [queued, setQueued] = useState<{ n: number; label: string }[]>([]);

  const rows = useMemo(
    () => FEEDBACK.filter((f) => (model === ALL || f.model === model) && (region === ALL || f.region === region) && (channel === ALL || f.channel === channel) && (sent === ALL || f.sentiment === sent)),
    [model, region, channel, sent],
  );
  const pct = (s: Feedback["sentiment"]) => (rows.length ? Math.round((rows.filter((r) => r.sentiment === s).length / rows.length) * 100) : 0);

  const topics = useMemo(() => {
    const m = new Map<string, { Positive: number; Neutral: number; Negative: number; n: number }>();
    rows.forEach((r) => {
      const t = m.get(r.topic) ?? { Positive: 0, Neutral: 0, Negative: 0, n: 0 };
      t[r.sentiment]++;
      t.n++;
      m.set(r.topic, t);
    });
    return Array.from(m.entries()).sort((a, b) => b[1].n - a[1].n);
  }, [rows]);

  const insightRows = FEEDBACK.filter((f) => f.model === "iQube 3.1 kWh" && f.region === "Pune" && f.topic === "Range" && f.sentiment === "Negative");
  const callsMade = CALLS.filter((c) => c.type === "Feedback").length + queued.reduce((s, q) => s + q.n, 0);
  const audience = FEEDBACK.filter((f) => (cModel === ALL || f.model === cModel) && (cRegion === ALL || f.region === cRegion)).length;

  const launch = () => {
    const label = `${cModel === ALL ? "All models" : cModel} · ${cRegion === ALL ? "all regions" : cRegion}`;
    setQueued((q) => [{ n: audience, label }, ...q]);
    toast(`AI Arjun queued ${audience} feedback calls`);
    setModal(false);
  };

  const Sel = ({ label, v, set, opts }: { label: string; v: string; set: (s: string) => void; opts: string[] }) => (
    <Field label={label}>
      <select className={inputCls} value={v} onChange={(e) => set(e.target.value)}>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );

  return (
    <>
      <TitleBand
        title="Voice of Customer"
        subtitle="Feedback from calls, WhatsApp and surveys"
        right={
          <div className="relative">
            <Btn variant="outline" onClick={() => setMenu(!menu)}>Actions</Btn>
            {menu && (
              <div className="absolute right-0 mt-1 w-52 bg-white text-ink rounded-xl border border-line shadow-lg z-20">
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-brand-soft rounded-xl flex items-center gap-2" onClick={() => { setMenu(false); setModal(true); }}>
                  <PhoneCall size={14} /> Customer Feedback
                </button>
              </div>
            )}
          </div>
        }
      />
      <Page className="space-y-4">
        <StatRow cols={5}>
          <Stat label="Feedback received" value={rows.length} />
          <Stat label="Positive" value={`${pct("Positive")}%`} tone="green" />
          <Stat label="Negative" value={`${pct("Negative")}%`} tone="red" />
          <Stat label="Top topic" value={<span className="text-lg">{topics[0]?.[0] ?? "-"}</span>} />
          <Stat label="Feedback calls made" value={callsMade} sub="by AI Arjun" />
        </StatRow>

        {queued.length > 0 && (
          <div className="bg-brand-soft rounded-xl px-4 py-2.5 text-sm space-y-0.5">
            {queued.map((q, i) => <div key={i}><Chip tone="blue">Calls queued</Chip> <span className="ml-1">{q.n} calls · {q.label}</span></div>)}
          </div>
        )}

        <Card className="p-4 border-slate-300 bg-slate-50">
          <div className="flex items-center gap-2 mb-1">
            <AgentDot agent="mansi" size={24} />
            <span className="font-semibold text-sm">AI Mansi insight</span>
            <AiMark agent="mansi" label="Early signal" />
          </div>
          <p className="text-sm font-medium">Pune iQube 3.1 range complaints rising</p>
          <p className="text-sm text-gray-600 mt-1">{insightRows.length} recent customers report about 90 km on a full charge against the showroom claim. Suggest a range-expectation briefing and a battery health check offer.</p>
          <div className="mt-2">
            <Why
              reason="Computed from negative Range feedback for iQube 3.1 kWh in Pune."
              factors={[
                { label: "Negative range feedback, Pune iQube 3.1", delta: insightRows.length },
                { label: "Same topic, other regions: mostly positive", delta: -2, note: "isolated to Pune" },
              ]}
            />
          </div>
        </Card>

        <div className="grid md:grid-cols-4 gap-3">
          <Sel label="Model" v={model} set={setModel} opts={uniq((f) => f.model)} />
          <Sel label="Region" v={region} set={setRegion} opts={uniq((f) => f.region)} />
          <Sel label="Channel" v={channel} set={setChannel} opts={uniq((f) => f.channel)} />
          <Sel label="Sentiment" v={sent} set={setSent} opts={[ALL, "Positive", "Neutral", "Negative"]} />
        </div>

        <Card className="p-4">
          <div className="font-semibold text-sm mb-3 flex items-center gap-2"><MessageSquareHeart size={16} /> Sentiment by topic</div>
          <div className="space-y-2">
            {topics.map(([t, v]) => (
              <div key={t} className="flex items-center gap-3 text-sm">
                <div className="w-28 shrink-0">{t}</div>
                <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-gray-100">
                  <div className="bg-done" style={{ width: `${(v.Positive / v.n) * 100}%` }} />
                  <div className="bg-gray-300" style={{ width: `${(v.Neutral / v.n) * 100}%` }} />
                  <div className="bg-hot" style={{ width: `${(v.Negative / v.n) * 100}%` }} />
                </div>
                <div className="w-8 text-right text-xs text-gray-500">{v.n}</div>
              </div>
            ))}
            {!topics.length && <div className="text-sm text-gray-400">No feedback matches the filters</div>}
          </div>
          <div className="flex gap-3 mt-3 text-[11px] text-gray-500"><span>Green positive</span><span>Grey neutral</span><span>Red negative</span></div>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-4 py-2.5 text-sm font-semibold border-b border-line">Feedback ({rows.length})</div>
          <ul>
            {rows.slice(0, 20).map((f) => (
              <li key={f.id} className="px-4 py-3 border-t border-line first:border-t-0 flex gap-3 items-start">
                <Chip tone={tone(f.sentiment)}>{f.sentiment}</Chip>
                <div className="flex-1">
                  <p className="text-sm">{mask(f.text)}</p>
                  <div className="text-[11px] text-gray-400 mt-0.5">{f.topic} · {f.model} · {f.region} · {f.channel} · {fmtDay(f.ts)}</div>
                </div>
              </li>
            ))}
          </ul>
          {rows.length > 20 && <div className="px-4 py-2 text-xs text-gray-400 border-t border-line">Showing 20 of {rows.length}</div>}
        </Card>

        <Collapsible title="About this data">
          <p className="text-sm text-gray-600">Customer names and phone numbers are masked in feedback text. Sentiment and topics are tagged by AI Mansi from call transcripts, WhatsApp replies and surveys.</p>
        </Collapsible>
      </Page>

      <Modal open={modal} onClose={() => setModal(false)} title="Customer Feedback calls">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600"><AgentDot agent="arjun" size={24} /> AI Arjun will call customers for feedback.</div>
          <Sel label="Model" v={cModel} set={setCModel} opts={uniq((f) => f.model)} />
          <Sel label="Region" v={cRegion} set={setCRegion} opts={uniq((f) => f.region)} />
          <div className="text-sm bg-gray-50 rounded-lg px-3 py-2">Customers to call: <b>{audience}</b></div>
          <div className="flex justify-end gap-2">
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn disabled={!audience} onClick={launch}>Confirm and queue calls</Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}
