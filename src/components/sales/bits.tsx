"use client";
import { useRouter } from "next/navigation";
import { Bot, Phone, Sparkles } from "lucide-react";
import type { Enquiry } from "@/lib/types";
import { VARIANTS, variantById } from "@/lib/variants";
import { agentById } from "@/lib/base";
import { AiMark, Btn, Card, CategoryBadge, Chip, Drawer, fmtDate, Why } from "@/components/ui/kit";

export const sortScore = (a: Enquiry, b: Enquiry) => (b.ai?.score ?? 0) - (a.ai?.score ?? 0);

export function PreCallBrief({ e, open, onClose }: { e: Enquiry | null; open: boolean; onClose: () => void }) {
  const router = useRouter();
  if (!e) return null;
  const last = e.history[0];
  return (
    <Drawer open={open} onClose={onClose} title={<span className="flex items-center gap-2"><Bot size={18} className="text-brand" /> Pre-call brief · {e.name}</span>}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <AiMark agent="meera" label="Prepared by AI Meera" />
          <CategoryBadge c={e.ai?.category ?? e.category} />
          {e.ai && <Chip tone="blue">Score {e.ai.score}</Chip>}
          {e.dnc && <Chip tone="red">Do not call</Chip>}
        </div>
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">Open with</div>
          <p className="text-sm">
            Hi {e.name.split(" ")[0]}, this is {"{your name}"} from Shree Motors TVS. {last ? `Following up on ${last.title.toLowerCase()}.` : "Thanks for your interest."}
          </p>
        </Card>
        <div>
          <div className="text-xs text-gray-500 mb-1">Interested in</div>
          <div className="flex flex-wrap gap-1.5">{e.vehicles.map((v) => <Chip key={v} tone="blue">{variantById(v).name}</Chip>)}</div>
        </div>
        {e.intake && (
          <div>
            <div className="text-xs text-gray-500 mb-1">What we know</div>
            <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(e.intake).map(([k, v]) => (
                <li key={k}><span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, " $1")}: </span>{v}</li>
              ))}
            </ul>
          </div>
        )}
        {e.ai && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Suggested next step</div>
            <p className="text-sm font-medium">{e.ai.nextAction}</p>
            <div className="mt-2"><Why factors={e.ai.factors} reason={e.ai.reason} /></div>
          </div>
        )}
        {last && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Last interaction · {fmtDate(last.ts)}</div>
            <p className="text-sm text-gray-600">{last.detail}</p>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Btn onClick={() => router.push(`/enquiries/${e.id}/follow-up`)}><Phone size={14} /> Start follow up</Btn>
          <Btn variant="outline" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </Drawer>
  );
}

export function OwnerStrip({ e }: { e: Enquiry }) {
  if (e.aiOwner) {
    const a = agentById(e.aiOwner);
    return (
      <div className="rounded-lg px-3 py-2 text-xs flex items-center justify-between" style={{ background: a.tint, color: a.colour }}>
        <span className="flex items-center gap-1 font-medium"><Sparkles size={12} /> {a.name} · {e.assignedTo ?? "Unassigned"}</span>
        <span>{e.followUps} follow ups</span>
      </div>
    );
  }
  return (
    <div className="rounded-lg px-3 py-2 text-xs flex items-center justify-between bg-gray-50 text-gray-600">
      <span className="font-medium">{e.assignedTo ?? "Unassigned"}</span>
      <span>{e.followUps} follow ups</span>
    </div>
  );
}

export function VariantPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const families = ["iQube", "Orbiter", "TVS X"] as const;
  return (
    <div className="space-y-3">
      {families.map((f) => (
        <div key={f}>
          <div className="text-xs font-semibold text-gray-500 mb-1.5">TVS {f === "TVS X" ? "X" : f} <span className="font-normal text-gray-400">· EV</span></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {VARIANTS.filter((v) => v.family === f).map((v) => {
              const on = value.includes(v.id);
              return (
                <button type="button" key={v.id} onClick={() => toggle(v.id)} className={`rounded-xl border p-2 text-left text-xs flex items-center gap-2 ${on ? "border-brand bg-brand-soft" : "border-line bg-white"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.image} alt="" className="w-12 h-10 object-contain" />
                  <span><span className="font-medium block">{v.name}</span><span className="text-gray-400">{v.rangeKm} km</span></span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
