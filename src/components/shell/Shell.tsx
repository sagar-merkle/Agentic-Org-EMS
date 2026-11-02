"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Bot, CalendarCheck, ClipboardList, FileBarChart, Headphones, Home, Menu, MessageSquareHeart, PhoneCall, Search, Send, ShieldCheck, Sparkles, Stethoscope, Users, Wrench, ChevronDown, LogOut, Smartphone, Phone, Target, Scale, BadgeCheck, ListChecks } from "lucide-react";
import { useStore } from "@/lib/store";
import { Login, BuddyFab } from "./Login";
import { AGENTS, PERSONAS, personaById } from "@/lib/base";
import type { PersonaId } from "@/lib/types";
import { Drawer } from "@/components/ui/kit";

type Nav = { href: string; label: string; icon: ReactNode; ai?: boolean };
const I = 17;
const NAV: Record<PersonaId, Nav[]> = {
  branch: [
    { href: "/", label: "Home", icon: <Home size={I} /> },
    { href: "/enquiries", label: "Enquiries", icon: <Users size={I} /> },
    { href: "/bookings", label: "Bookings", icon: <CalendarCheck size={I} /> },
    { href: "/tasks", label: "Today's Tasks", icon: <ListChecks size={I} /> },
    { href: "/agents", label: "AI Agents", icon: <Sparkles size={I} />, ai: true },
    { href: "/lead-management", label: "Lead Management", icon: <Target size={I} /> },
    { href: "/virtual-number", label: "Virtual Number", icon: <Phone size={I} /> },
    { href: "/reports", label: "Reports", icon: <FileBarChart size={I} /> },
    { href: "/service", label: "Service", icon: <Wrench size={I} /> },
    { href: "/warranty", label: "Warranty", icon: <ShieldCheck size={I} /> },
    { href: "/voc", label: "Voice of Customer", icon: <MessageSquareHeart size={I} /> },
  ],
  dse: [
    { href: "/", label: "Home", icon: <Home size={I} /> },
    { href: "/enquiries", label: "Enquiries", icon: <Users size={I} /> },
    { href: "/bookings", label: "Bookings", icon: <CalendarCheck size={I} /> },
    { href: "/tasks", label: "Today's Tasks", icon: <ListChecks size={I} /> },
    { href: "/salesmate", label: "Salesmate", icon: <Scale size={I} />, ai: true },
    { href: "/reports", label: "Reports", icon: <FileBarChart size={I} /> },
  ],
  callcentre: [
    { href: "/call-queue", label: "Call Queue", icon: <Headphones size={I} /> },
    { href: "/enquiries", label: "Enquiries", icon: <Users size={I} /> },
    { href: "/tasks", label: "Today's Tasks", icon: <ListChecks size={I} /> },
    { href: "/agents", label: "AI Agents", icon: <Sparkles size={I} />, ai: true },
  ],
  advisor: [
    { href: "/service", label: "Service Home", icon: <Home size={I} /> },
    { href: "/service/jobs", label: "Job Cards", icon: <ClipboardList size={I} /> },
    { href: "/service/health", label: "Vehicle Health", icon: <Stethoscope size={I} />, ai: true },
    { href: "/service/fleet", label: "Fleet", icon: <BadgeCheck size={I} /> },
    { href: "/reports", label: "Reports", icon: <FileBarChart size={I} /> },
  ],
  technician: [
    { href: "/technician", label: "My Jobs", icon: <Wrench size={I} /> },
    { href: "/service/health", label: "Vehicle Health", icon: <Stethoscope size={I} /> },
  ],
  warranty: [
    { href: "/warranty", label: "Warranty Claims", icon: <ShieldCheck size={I} />, ai: true },
    { href: "/reports", label: "Reports", icon: <FileBarChart size={I} /> },
  ],
  cx: [
    { href: "/voc", label: "Voice of Customer", icon: <MessageSquareHeart size={I} />, ai: true },
    { href: "/agents", label: "AI Agents", icon: <Sparkles size={I} /> },
    { href: "/reports", label: "Reports", icon: <FileBarChart size={I} /> },
  ],
  customer: [{ href: "/customer", label: "Customer phone", icon: <Smartphone size={I} /> }],
};

const BUDDY_ANSWERS: [RegExp, string][] = [
  [/hot|priority|first/i, "You have 3 Hot enquiries. ENQ-4003 asked about a test ride today, call that one first."],
  [/missed|overdue/i, "2 follow-ups and 1 test ride are missed. Open Today's Tasks, then Missed."],
  [/claim|warranty/i, "4 claims are waiting. 3 are auto-approve candidates and 1 needs a human look."],
  [/service|job/i, "Two job cards need advisor approval today. The first is JC-8801, estimate ₹3,400."],
];

function BuddyDrawer() {
  const { buddyOpen, setBuddyOpen } = useStore();
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "Hi, I'm AI Buddy. Ask me about your enquiries, tasks, service jobs or claims." }]);
  const [q, setQ] = useState("");
  const send = (text: string) => {
    if (!text.trim()) return;
    const a = BUDDY_ANSWERS.find(([r]) => r.test(text))?.[1] ?? "I can help with enquiries, tasks, service jobs and claims. Try asking 'which lead should I call first?'";
    setMsgs((m) => [...m, { me: true, t: text }, { me: false, t: a }]);
    setQ("");
  };
  return (
    <Drawer open={buddyOpen} onClose={() => setBuddyOpen(false)} title={<span className="flex items-center gap-2"><Bot size={18} className="text-brand" /> AI Buddy</span>} width={400}>
      <div className="flex flex-col gap-2 min-h-[60vh]">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] text-sm rounded-2xl px-3 py-2 ${m.me ? "self-end bg-brand text-white" : "self-start bg-gray-100"}`}>{m.t}</div>
        ))}
        <div className="flex flex-wrap gap-2 mt-2">
          {["Which lead should I call first?", "Show missed tasks", "Any claims waiting?"].map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs border border-brand text-brand rounded-full px-3 py-1 hover:bg-brand-soft">{s}</button>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 bg-white pt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(q)} placeholder="Ask AI Buddy" className="flex-1 border border-line rounded-full px-4 py-2 text-sm" />
        <button onClick={() => send(q)} className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center"><Send size={15} /></button>
      </div>
    </Drawer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const s = useStore();
  const path = usePathname();
  const router = useRouter();
  const [personaOpen, setPersonaOpen] = useState(false);

  if (!s.ready) return null;
  if (!s.authed) return <Login />;

  const info = personaById(s.persona);
  const nav = NAV[s.persona];
  const isActive = (h: string) => (h === "/" ? path === "/" : path === h || path.startsWith(h + "/"));
  const customerMode = s.persona === "customer";

  const pick = (id: PersonaId) => {
    s.setPersona(id);
    setPersonaOpen(false);
    router.push(personaById(id).home);
  };

  return (
    <div className="min-h-screen flex">
      {s.sidebarOpen && (
        <aside className="w-60 shrink-0 bg-white border-r border-line flex flex-col sticky top-0 h-screen">
          <div className="p-4 border-b border-line">
            <Image src="/brand/tvs-logo-full.png" alt="TVS" width={110} height={30} style={{ height: "auto" }} />
            <div className="text-[11px] text-gray-400 mt-1">Shree Motors TVS · Pune</div>
          </div>
          <div className="p-3 relative">
            <button onClick={() => setPersonaOpen(!personaOpen)} className="w-full text-left rounded-xl bg-brand-soft px-3 py-2 flex items-center justify-between">
              <span>
                <span className="block text-[10px] uppercase tracking-wide text-gray-500">Viewing as</span>
                <span className="block text-sm font-semibold text-brand">{info.label}</span>
                <span className="block text-[11px] text-gray-500">{info.person}</span>
              </span>
              <ChevronDown size={15} className="text-brand" />
            </button>
            {personaOpen && (
              <div className="absolute left-3 right-3 top-full z-30 bg-white border border-line rounded-xl shadow-lg overflow-hidden">
                {PERSONAS.map((p) => (
                  <button key={p.id} onClick={() => pick(p.id)} className={`w-full text-left px-3 py-2 text-sm hover:bg-brand-soft ${p.id === s.persona ? "font-semibold text-brand" : ""}`}>
                    {p.label}<span className="block text-[11px] text-gray-400">{p.person}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto px-2 pb-3 scroll-thin">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5 ${isActive(n.href) ? "bg-brand text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                {n.icon}
                <span className="flex-1">{n.label}</span>
                {n.ai && <Sparkles size={12} className={isActive(n.href) ? "text-white" : "text-brand"} />}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-line">
            <div className="flex -space-x-1 mb-2">
              {AGENTS.map((a) => (
                <span key={a.id} title={a.name} className="w-6 h-6 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-semibold" style={{ background: a.colour }}>{a.name.replace("AI ", "")[0]}</span>
              ))}
            </div>
            <button onClick={s.logout} className="text-xs text-gray-500 flex items-center gap-1.5 hover:text-hot"><LogOut size={13} /> Sign out</button>
          </div>
        </aside>
      )}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-line h-14 px-5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => s.setSidebarOpen(!s.sidebarOpen)} className="p-1.5 rounded hover:bg-gray-100"><Menu size={20} /></button>
            {!s.sidebarOpen && <Image src="/brand/tvs-logo-full.png" alt="TVS" width={90} height={24} style={{ height: "auto" }} />}
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Search size={18} />
            <span className="relative"><Bell size={18} /><span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-hot" /></span>
            <span className="text-sm">{info.person}</span>
          </div>
        </header>
        <main className="pb-24">{children}</main>
      </div>
      {!customerMode && <BuddyFab />}
      <BuddyDrawer />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] space-y-2">
        {s.toasts.map((t) => (
          <div key={t.id} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg fade-up">{t.text}</div>
        ))}
      </div>
    </div>
  );
}
export { PhoneCall };
