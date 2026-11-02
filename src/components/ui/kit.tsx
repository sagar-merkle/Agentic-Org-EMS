"use client";
import { useState, type ReactNode } from "react";
import { ChevronDown, Sparkles, X } from "lucide-react";
import type { AgentId, Category } from "@/lib/types";
import { agentById } from "@/lib/base";

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
export const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export function TitleBand({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="bg-brand text-white px-6 py-4 flex items-center justify-between rounded-b-2xl">
      <div>
        <h1 className="text-lg font-semibold leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-blue-100 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-5 max-w-[1280px] mx-auto fade-up ${className}`}>{children}</div>;
}

export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl border border-line shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", className = "", disabled, type = "button" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "ghost" | "danger" | "success"; className?: string; disabled?: boolean; type?: "button" | "submit" }) {
  const v = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    outline: "border border-brand text-brand bg-white hover:bg-brand-soft",
    ghost: "text-brand hover:bg-brand-soft",
    danger: "bg-hot text-white hover:bg-red-700",
    success: "bg-done text-white hover:bg-green-700",
  }[variant];
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`rounded-full px-4 py-1.5 text-sm font-medium inline-flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed ${v} ${className}`}>
      {children}
    </button>
  );
}

const CAT: Record<Category, string> = {
  Hot: "bg-red-50 text-hot border-red-200",
  Warm: "bg-amber-50 text-amber-700 border-amber-200",
  Cold: "bg-blue-50 text-cold border-blue-200",
  "Not Set": "bg-gray-100 text-gray-500 border-gray-200",
};
export const CategoryBadge = ({ c }: { c: Category }) => <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${CAT[c]}`}>{c}</span>;

export function Chip({ children, tone = "gray", className = "" }: { children: ReactNode; tone?: "gray" | "blue" | "green" | "red" | "amber" | "violet"; className?: string }) {
  const t = { gray: "bg-gray-100 text-gray-600", blue: "bg-blue-50 text-blue-700", green: "bg-green-50 text-green-700", red: "bg-red-50 text-red-700", amber: "bg-amber-50 text-amber-700", violet: "bg-violet-50 text-violet-700" }[tone];
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${t} ${className}`}>{children}</span>;
}

export function AiMark({ agent, label, className = "" }: { agent?: AgentId; label?: string; className?: string }) {
  const a = agent ? agentById(agent) : null;
  const colour = a?.colour ?? "#0a3d9c";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${className}`} style={{ background: (a?.tint ?? "#e8eefb"), color: colour }}>
      <Sparkles size={11} /> {label ?? (a ? a.name : "AI")}
    </span>
  );
}

export function AgentDot({ agent, size = 28 }: { agent: AgentId; size?: number }) {
  const a = agentById(agent);
  return (
    <span className="rounded-full text-white font-semibold inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, background: a.colour, fontSize: size * 0.42 }}>
      {a.name.replace("AI ", "")[0]}
    </span>
  );
}

export function Collapsible({ title, children, defaultOpen = false, hint, className = "" }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; hint?: string; className?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-white rounded-2xl border border-line ${className}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="font-medium text-sm flex items-center gap-2">{title}{hint && <span className="text-xs text-gray-400 font-normal">{hint}</span>}</span>
        <ChevronDown size={16} className={`text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 border-t border-line pt-3">{children}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, counts }: { tabs: readonly T[]; value: T; onChange: (t: T) => void; counts?: Partial<Record<T, number>> }) {
  return (
    <div className="flex gap-1 border-b border-line overflow-x-auto scroll-thin">
      {tabs.map((t) => (
        <button key={t} onClick={() => onChange(t)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px ${value === t ? "border-brand text-brand" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
          {t}
          {counts?.[t] !== undefined && <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${value === t ? "bg-brand text-white" : "bg-gray-100 text-gray-500"}`}>{counts[t]}</span>}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub, tone, onClick, active }: { label: string; value: ReactNode; sub?: string; tone?: "red" | "green" | "amber" | "blue"; onClick?: () => void; active?: boolean }) {
  const c = tone === "red" ? "text-hot" : tone === "green" ? "text-done" : tone === "amber" ? "text-amber-600" : tone === "blue" ? "text-cold" : "text-ink";
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl border px-4 py-3 ${onClick ? "cursor-pointer hover:shadow-md" : ""} ${active ? "border-brand ring-1 ring-brand" : "border-line"}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-semibold mt-0.5 ${c}`}>{value}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export function StatRow({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 | 5 }) {
  const g = { 3: "grid-cols-3", 4: "grid-cols-2 md:grid-cols-4", 5: "grid-cols-2 md:grid-cols-5" }[cols];
  return <div className={`grid gap-3 ${g}`}>{children}</div>;
}

export function Drawer({ open, onClose, title, children, width = 520 }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; width?: number }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white h-full shadow-xl drawer-in flex flex-col" style={{ width, maxWidth: "100vw" }}>
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 scroll-thin">{children}</div>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg fade-up max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children, tip }: { label: string; children: ReactNode; tip?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="mt-1">{children}</div>
      {tip && <span className="text-[11px] text-gray-400">{tip}</span>}
    </label>
  );
}
export const inputCls = "w-full border border-line rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

export function Why({ factors, reason }: { factors: { label: string; delta: number; note?: string }[]; reason?: string }) {
  return (
    <Collapsible title={<span className="flex items-center gap-1.5 text-brand"><Sparkles size={13} /> Why?</span>} className="!rounded-xl">
      {reason && <p className="text-sm text-gray-600 mb-2">{reason}</p>}
      <ul className="space-y-1">
        {factors.map((f, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>{f.label}{f.note && <span className="text-gray-400"> · {f.note}</span>}</span>
            <span className={f.delta >= 0 ? "text-done font-medium" : "text-hot font-medium"}>{f.delta >= 0 ? "+" : ""}{f.delta}</span>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="text-center text-sm text-gray-400 py-10">{text}</div>;
}
