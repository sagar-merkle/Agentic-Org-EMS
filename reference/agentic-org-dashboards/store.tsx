"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { dayTime, T } from "../format";
import { makeRng } from "../rng";
import { generateWorld, OWNER_BY_ID } from "../data/generate";
import { randomLiveEvent } from "../data/live";
import { rescore } from "../data/mutations";
import { CURRENT_USER } from "../data/people";
import type { Range as RangeKey } from "../data/selectors";
import type { AgentId, Call, Lead, LeadStage, StaffId, World } from "../data/types";
import { DEMO_STEPS, type DemoApi } from "../demo/script";
import { scoreLead } from "../scoring/leadScore";

export type Drawer = { kind: "call" | "lead" | "job" | "owner"; id: string } | { kind: "approvals" } | null;
export type LiveCall = { call: Call; shown: number } | null;
export type Toast = { id: number; text: string; tone: "ok" | "info" | "warn" };
export type DemoState = { active: boolean; step: number; auto: boolean; running: boolean; done: boolean };

class Cancelled extends Error {}

function useStoreValue() {
  const router = useRouter();
  const pathname = usePathname();
  const [world, setWorld] = useState<World | null>(null);
  const [range, setRange] = useState<RangeKey>("today");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [live, setLive] = useState(false);
  const [liveCall, setLiveCall] = useState<LiveCall>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [forced, setForced] = useState<Record<string, number>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [demo, setDemo] = useState<DemoState>({ active: false, step: 0, auto: false, running: false, done: false });

  const worldRef = useRef<World | null>(null);
  worldRef.current = world;
  const demoRef = useRef(demo);
  demoRef.current = demo;
  const runRef = useRef(0);
  const streamRef = useRef<{ timer: ReturnType<typeof setInterval>; finish: () => void } | null>(null);
  const liveRng = useRef(makeRng(7));

  useEffect(() => setWorld(generateWorld()), []);

  const update = useCallback((fn: (w: World) => World) => setWorld((w) => (w ? fn(w) : w)), []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const forceOpen = useCallback((section: string) => setForced((f) => ({ ...f, [section]: Date.now() })), []);

  /* ------------------------------------------------------------ actions */

  const patchLead = useCallback(
    (id: string, fn: (l: Lead) => Lead) => update((w) => ({ ...w, leads: w.leads.map((l) => (l.id === id ? fn(l) : l)) })),
    [update],
  );

  const commitCall = useCallback(
    (call: Call, effect?: (w: World) => World) => {
      update((w) => {
        const next = effect ? effect(w) : w;
        return { ...next, calls: [{ ...call, at: next.now }, ...next.calls], seq: next.seq + 1 };
      });
    },
    [update],
  );

  const actions = useMemo(
    () => ({
      approve(id: string, value?: string) {
        update((w) => {
          const a = w.approvals.find((x) => x.id === id);
          if (!a || a.status !== "pending") return w;
          let leads = w.leads;
          if (a.leadId && (a.type === "discount" || a.type === "finance_exception")) {
            leads = leads.map((l) =>
              l.id === a.leadId && ["contacted", "test_ride", "quote"].includes(l.stage)
                ? rescore(l, { timeline: "this_month" }, {
                    stage: "booked",
                    bookedAt: w.now,
                    nextAction: "Schedule delivery and PDI",
                    nextDue: w.now + 5 * T.DAY,
                    lastTouch: { at: w.now, by: CURRENT_USER, agent: false },
                  })
                : l,
            );
          }
          if (a.leadId && a.type === "exchange")
            leads = leads.map((l) => (l.id === a.leadId ? rescore(l, { exchange: l.signals.exchange ?? "Exchange vehicle" }) : l));
          return {
            ...w,
            leads,
            approvals: w.approvals.map((x) =>
              x.id === id ? { ...x, status: "approved", value: value ?? x.value, resolvedBy: CURRENT_USER, resolvedAt: w.now } : x,
            ),
          };
        });
        toast("Approved. The agent has been told to go ahead.");
      },
      reject(id: string, note: string) {
        update((w) => ({
          ...w,
          approvals: w.approvals.map((x) =>
            x.id === id ? { ...x, status: "rejected", note, resolvedBy: CURRENT_USER, resolvedAt: w.now } : x,
          ),
        }));
        toast("Rejected. The agent will close the loop with the customer.", "info");
      },
      sendToSales(ownerId: string): string | null {
        const w = worldRef.current;
        const opp = w?.opportunities.find((o) => o.ownerId === ownerId);
        const owner = OWNER_BY_ID[ownerId];
        if (!w || !opp || !owner || opp.sentToSales) return null;
        const id = `L-${ownerId}`;
        const signals = {
          timeline: "within_3_months" as const,
          testRide: "none" as const,
          budget: null,
          engagement: (opp.arjun === "consented" ? 2 : 1) as 1 | 2,
          finance: owner.financeKind === "cash" || owner.financeClosed ? ("cash" as const) : ("unknown" as const),
          exchange: `${owner.model.replace("TVS ", "")} ${owner.purchaseDate.slice(0, 4)}`,
        };
        const source = opp.inWorkshop ? ("service_bay" as const) : ("existing_owner" as const);
        const lead: Lead = {
          id,
          name: owner.name,
          phone: "+91 9822000000",
          area: owner.area,
          source,
          interest: opp.suggested,
          dailyKm: Math.round(owner.annualKm / 300),
          priority: "value",
          emiCeiling: null,
          signals,
          ...scoreLead(signals, source, opp.suggested),
          stage: "new",
          assignedTo: CURRENT_USER,
          createdAt: w.now,
          lastTouch: { at: w.now, by: "arjun", agent: true },
          nextAction: opp.arjun === "consented" ? "Call this evening: EV consent on record" : "Intro call about switching to EV",
          nextDue: w.now + 2 * T.HOUR,
          summary: `${owner.model} owner since ${owner.purchaseDate.slice(0, 4)}, ${opp.ageYears} yrs old. Saves ≈ ₹${opp.saving.toLocaleString("en-IN")}/yr on fuel by switching. ${opp.arjun === "consented" ? "Agreed to an EV call." : ""}`,
          ownerId,
        };
        update((cur) => ({
          ...cur,
          leads: [lead, ...cur.leads],
          opportunities: cur.opportunities.map((o) => (o.ownerId === ownerId ? { ...o, sentToSales: true } : o)),
          handoffs: [
            { id: `H-S${cur.seq}`, from: opp.inWorkshop ? "sagar" : "arjun", to: CURRENT_USER, customer: owner.name, leadId: id, reason: "Petrol owner ready for an EV conversation", at: cur.now, accepted: null },
            ...cur.handoffs,
          ],
          seq: cur.seq + 1,
        }));
        toast(`New lead in Sanjay's queue: ${owner.name}`);
        return id;
      },
      askAgent(leadId: string, agent: AgentId) {
        patchLead(leadId, (l) => ({
          ...l,
          nextAction: `AI ${agent[0].toUpperCase()}${agent.slice(1)} calling within 10 min`,
          nextDue: (worldRef.current?.now ?? Date.now()) + 10 * T.MIN,
        }));
        toast(`Queued for AI ${agent[0].toUpperCase()}${agent.slice(1)}.`, "info");
      },
      iWillCall(leadId: string) {
        patchLead(leadId, (l) => ({ ...l, nextAction: "Sanjay calling now", lastTouch: { at: worldRef.current!.now, by: CURRENT_USER, agent: false } }));
        toast("Logged: you're calling.", "info");
      },
      bookTestRide(leadId: string) {
        const now = worldRef.current?.now ?? Date.now();
        const slot = new Date(now + T.DAY);
        slot.setHours(11, 0, 0, 0);
        patchLead(leadId, (l) =>
          rescore(l, { testRide: "booked" }, {
            stage: ["new", "contacted"].includes(l.stage) ? "test_ride" : l.stage,
            testRideAt: slot.getTime(),
            nextAction: `Host test ride ${dayTime(slot.getTime(), now)}`,
            nextDue: slot.getTime(),
          }),
        );
        toast(`Test ride booked: ${dayTime(slot.getTime(), now)}`);
      },
      setStage(leadId: string, stage: LeadStage) {
        const now = worldRef.current?.now ?? Date.now();
        patchLead(leadId, (l) => ({
          ...l,
          stage,
          ...(stage === "booked" && !l.bookedAt ? { bookedAt: now } : {}),
          ...(stage === "delivered" && !l.retailAt ? { retailAt: now } : {}),
        }));
      },
      markLost(leadId: string, reason: string) {
        const now = worldRef.current?.now ?? Date.now();
        patchLead(leadId, (l) => ({ ...l, stage: "lost", lostAt: now, lostReason: reason, nextAction: "Closed" }));
        toast("Marked lost.", "info");
      },
      advanceJob(jobId: string) {
        const order = ["booked", "picked_up", "in_bay", "ready", "delivered", "feedback_done"] as const;
        update((w) => ({
          ...w,
          jobs: w.jobs.map((j) => (j.id === jobId ? { ...j, stage: order[Math.min(order.indexOf(j.stage) + 1, order.length - 1)] } : j)),
        }));
      },
      acceptHandoff(id: string, to?: StaffId) {
        update((w) => ({ ...w, handoffs: w.handoffs.map((h) => (h.id === id ? { ...h, accepted: true, to: to ?? h.to } : h)) }));
      },
    }),
    [update, patchLead, toast],
  );

  /* ------------------------------------------------------- live streaming */

  const stream = useCallback(
    (call: Call, effect?: (w: World) => World, lineMs = 1500) =>
      new Promise<void>((resolve) => {
        if (streamRef.current) streamRef.current.finish();
        setLiveCall({ call, shown: 0 });
        let shown = 0;
        const finish = () => {
          clearInterval(timer);
          streamRef.current = null;
          setLiveCall(null);
          commitCall(call, effect);
          resolve();
        };
        const timer = setInterval(() => {
          shown += 1;
          if (shown > call.transcript.length) finish();
          else setLiveCall({ call, shown });
        }, lineMs);
        streamRef.current = { timer, finish };
      }),
    [commitCall],
  );

  useEffect(() => {
    if (!live) return;
    const tick = setInterval(() => {
      const w = worldRef.current;
      if (!w || streamRef.current || demoRef.current.active) return;
      const rng = liveRng.current;
      const advance = rng.int(2, 5) * T.MIN;
      update((cur) => ({ ...cur, now: cur.now + advance }));
      const ev = randomLiveEvent({ ...w, now: w.now + advance }, rng);
      if (ev.call.transcript.length && rng.chance(0.6)) void stream(ev.call, ev.effect, 1100);
      else commitCall(ev.call, ev.effect);
    }, 9000);
    return () => clearInterval(tick);
  }, [live, update, stream, commitCall]);

  /* ----------------------------------------------------------------- demo */

  const runStep = useCallback(
    async (index: number) => {
      const myRun = ++runRef.current;
      const alive = () => runRef.current === myRun;
      const sleep = (ms: number) =>
        new Promise<void>((resolve, reject) =>
          setTimeout(() => (alive() ? resolve() : reject(new Cancelled())), ms),
        );
      const api: DemoApi = {
        go: (path) => router.push(path),
        sleep,
        highlight: setHighlight,
        forceOpen,
        openDrawer: setDrawer,
        closeDrawer: () => setDrawer(null),
        stream: async (call, effect, lineMs) => {
          await stream(call, effect, lineMs);
          if (!alive()) throw new Cancelled();
        },
        apply: update,
        world: () => worldRef.current!,
        actions,
        auto: () => demoRef.current.auto,
        waitFor: async (pred, autoAct, autoAfter = 3500) => {
          let waited = 0;
          while (!pred(worldRef.current!)) {
            await sleep(250);
            waited += 250;
            if (demoRef.current.auto && waited >= autoAfter && autoAct) {
              autoAct();
              autoAct = undefined;
            }
          }
        },
      };
      setDemo((d) => ({ ...d, step: index, running: true }));
      try {
        await DEMO_STEPS[index].run(api);
        if (!alive()) return;
        setDemo((d) => ({ ...d, running: false, done: index === DEMO_STEPS.length - 1 }));
        if (demoRef.current.auto && index < DEMO_STEPS.length - 1) {
          await sleep(3500);
          void runStep(index + 1);
        }
      } catch (e) {
        if (!(e instanceof Cancelled)) throw e;
      }
    },
    [router, forceOpen, stream, update, actions],
  );

  const demoControls = useMemo(
    () => ({
      start(auto = false) {
        streamRef.current?.finish();
        setLive(false);
        setDrawer(null);
        setHighlight(null);
        setWorld(generateWorld());
        setDemo({ active: true, step: 0, auto, running: false, done: false });
        setTimeout(() => void runStep(0), 400);
      },
      next() {
        const d = demoRef.current;
        if (d.step < DEMO_STEPS.length - 1) {
          streamRef.current?.finish();
          setHighlight(null);
          void runStep(d.step + 1);
        }
      },
      setAuto(auto: boolean) {
        setDemo((d) => ({ ...d, auto }));
        if (auto && !demoRef.current.running && demoRef.current.step < DEMO_STEPS.length - 1) {
          demoRef.current = { ...demoRef.current, auto };
          setTimeout(() => void runStep(demoRef.current.step + 1), 600);
        }
      },
      exit() {
        runRef.current++;
        streamRef.current?.finish();
        setHighlight(null);
        setDemo({ active: false, step: 0, auto: false, running: false, done: false });
      },
    }),
    [runStep],
  );

  return {
    world,
    range,
    setRange,
    drawer,
    openDrawer: setDrawer,
    closeDrawer: () => setDrawer(null),
    live,
    setLive,
    liveCall,
    highlight,
    forced,
    toasts,
    toast,
    actions,
    demo,
    demoControls,
    pathname,
  };
}

export type Store = ReturnType<typeof useStoreValue> & { world: World };

const Ctx = createContext<ReturnType<typeof useStoreValue> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStoreRaw() {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}

/** For components rendered only after the world has loaded. */
export function useStore(): Store {
  const v = useStoreRaw();
  if (!v.world) throw new Error("World not loaded");
  return v as Store;
}
