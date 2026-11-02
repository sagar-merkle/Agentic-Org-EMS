import type { Agent, AgentId, Dealer, PersonaId } from "./types";

export const NOW = new Date("2026-11-02T10:30:00+05:30");
export const iso = (daysAgo: number, hh = 10, mm = 0) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
};

export const AGENTS: Agent[] = [
  { id: "meera", name: "AI Meera", role: "Sales", colour: "#0ea5e9", tint: "#e0f2fe", useCases: [1, 2, 4, 5], doing: "Qualifying a web chat from Pune", status: "On call" },
  { id: "maheb", name: "AI Maheb", role: "Finance", colour: "#8b5cf6", tint: "#ede9fe", useCases: [1, 2, 10], doing: "Sending an EMI comparison and payment link", status: "Idle" },
  { id: "arjun", name: "AI Arjun", role: "Engagement", colour: "#f59e0b", tint: "#fef3c7", useCases: [9, 13, 16], doing: "Month-30 upgrade outreach, 4 owners", status: "On call" },
  { id: "sagar", name: "AI Sagar", role: "Service", colour: "#16a34a", tint: "#dcfce7", useCases: [9, 10, 11], doing: "Building a job card from a voice note", status: "Idle" },
  { id: "mansi", name: "AI Mansi", role: "Back-office", colour: "#64748b", tint: "#e2e8f0", useCases: [14, 16], doing: "Scoring 6 warranty claims", status: "On call" },
];

export const agentById = (id: AgentId) => AGENTS.find((a) => a.id === id)!;

export const DEALER: Dealer = {
  name: "Shree Motors TVS",
  code: "100-1",
  city: "Pune",
  virtualNumber: "+91 7358 716 576",
};

export type PersonaInfo = {
  id: PersonaId;
  label: string;
  person: string;
  title: string;
  home: string;
};

export const PERSONAS: PersonaInfo[] = [
  { id: "branch", label: "Branch Manager", person: "Akshay Bhosale", title: "Branch Manager", home: "/" },
  { id: "dse", label: "Sales Executive (DSE)", person: "Aveg Patekar", title: "Sales Executive", home: "/" },
  { id: "callcentre", label: "Call centre", person: "Neha Joshi", title: "Call Centre Executive", home: "/call-queue" },
  { id: "advisor", label: "Service Advisor", person: "Rohit Pawar", title: "Service Advisor", home: "/service" },
  { id: "technician", label: "Service Technician", person: "Santosh Gaikwad", title: "Technician", home: "/technician" },
  { id: "warranty", label: "Warranty L1 / L2", person: "Meenal Rao", title: "Warranty Reviewer", home: "/warranty" },
  { id: "cx", label: "CX / Leadership", person: "Vikram Iyer", title: "CX Head", home: "/voc" },
  { id: "customer", label: "Customer (phone)", person: "Customer", title: "Customer", home: "/customer" },
];

export const personaById = (id: PersonaId) => PERSONAS.find((p) => p.id === id)!;

export const HUMANS = ["Aveg Patekar", "Priya Nair", "Sandeep Kulkarni", "Rahul Shinde", "Neha Joshi"];
