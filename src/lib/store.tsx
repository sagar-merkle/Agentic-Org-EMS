"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Approval, Booking, Claim, Enquiry, Interaction, JobCard, PersonaId, Task, Vehicle } from "./types";
import { APPROVALS, BOOKINGS, ENQUIRIES, TASKS } from "./seed";
import { CLAIMS, JOBS, VEHICLES } from "./seedService";
import { personaById } from "./base";

type Toast = { id: number; text: string };

type Store = {
  ready: boolean;
  authed: boolean;
  login: () => void;
  logout: () => void;
  persona: PersonaId;
  setPersona: (p: PersonaId) => void;
  enquiries: Enquiry[];
  bookings: Booking[];
  tasks: Task[];
  approvals: Approval[];
  jobs: JobCard[];
  claims: Claim[];
  vehicles: Vehicle[];
  updateEnquiry: (id: string, patch: Partial<Enquiry>) => void;
  addInteraction: (id: string, it: Interaction) => void;
  addEnquiry: (e: Enquiry) => void;
  addBooking: (b: Booking) => void;
  completeTask: (id: string) => void;
  decideApproval: (id: string, state: Approval["state"]) => void;
  updateJob: (id: string, patch: Partial<JobCard>) => void;
  addJob: (j: JobCard) => void;
  updateClaim: (id: string, patch: Partial<Claim>) => void;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  toasts: Toast[];
  toast: (text: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (b: boolean) => void;
  buddyOpen: boolean;
  setBuddyOpen: (b: boolean) => void;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [persona, setPersonaState] = useState<PersonaId>("branch");
  const [enquiries, setEnquiries] = useState(ENQUIRIES);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [tasks, setTasks] = useState(TASKS);
  const [approvals, setApprovals] = useState(APPROVALS);
  const [jobs, setJobs] = useState(JOBS);
  const [claims, setClaims] = useState(CLAIMS);
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [buddyOpen, setBuddyOpen] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("ems-auth") === "1");
    const p = sessionStorage.getItem("ems-persona") as PersonaId | null;
    if (p && personaById(p)) setPersonaState(p);
    setReady(true);
  }, []);

  const login = useCallback(() => {
    sessionStorage.setItem("ems-auth", "1");
    setAuthed(true);
  }, []);
  const logout = useCallback(() => {
    sessionStorage.removeItem("ems-auth");
    setAuthed(false);
  }, []);
  const setPersona = useCallback((p: PersonaId) => {
    sessionStorage.setItem("ems-persona", p);
    setPersonaState(p);
  }, []);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready, authed, login, logout, persona, setPersona,
      enquiries, bookings, tasks, approvals, jobs, claims, vehicles,
      updateEnquiry: (id, patch) => setEnquiries((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      addInteraction: (id, it) => setEnquiries((l) => l.map((e) => (e.id === id ? { ...e, history: [it, ...e.history] } : e))),
      addEnquiry: (e) => setEnquiries((l) => [e, ...l]),
      addBooking: (b) => setBookings((l) => [b, ...l]),
      completeTask: (id) => setTasks((l) => l.map((t) => (t.id === id ? { ...t, done: true, missed: false } : t))),
      decideApproval: (id, state) => setApprovals((l) => l.map((a) => (a.id === id ? { ...a, state } : a))),
      updateJob: (id, patch) => setJobs((l) => l.map((j) => (j.id === id ? { ...j, ...patch } : j))),
      addJob: (j) => setJobs((l) => [j, ...l]),
      updateClaim: (id, patch) => setClaims((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      updateVehicle: (id, patch) => setVehicles((l) => l.map((v) => (v.id === id ? { ...v, ...patch } : v))),
      toasts, toast, sidebarOpen, setSidebarOpen, buddyOpen, setBuddyOpen,
    }),
    [ready, authed, login, logout, persona, setPersona, enquiries, bookings, tasks, approvals, jobs, claims, vehicles, toasts, toast, sidebarOpen, buddyOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
