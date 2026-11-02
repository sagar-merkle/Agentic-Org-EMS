export type AgentId = "sales" | "finance" | "service" | "engagement" | "orchestrator" | "human";

export type Agent = {
  id: AgentId;
  name: string;
  short: string;
  colour: string;
  scope: string;
};

export const AGENTS: Record<AgentId, Agent> = {
  orchestrator: {
    id: "orchestrator",
    name: "Orchestrator",
    short: "ORC",
    colour: "#94a3b8",
    scope: "Routing, context assembly, permissions, graph write-back",
  },
  sales: {
    id: "sales",
    name: "Sales Agent",
    short: "SLS",
    colour: "#38bdf8",
    scope: "Understanding, qualification, product match, test ride, follow-up",
  },
  finance: {
    id: "finance",
    name: "Finance Agent",
    short: "FIN",
    colour: "#a78bfa",
    scope: "Eligibility, bureau simulation, EMI, lender panel, affordability",
  },
  service: {
    id: "service",
    name: "Service Agent",
    short: "SRV",
    colour: "#34d399",
    scope: "Service due, battery health, centre allocation, callbacks",
  },
  engagement: {
    id: "engagement",
    name: "Engagement Agent",
    short: "ENG",
    colour: "#fbbf24",
    scope: "Accessories, insurance, campaigns, personalised offers",
  },
  human: {
    id: "human",
    name: "Sales Manager",
    short: "YOU",
    colour: "#fb7185",
    scope: "Approve, modify, escalate, reject",
  },
};

export const AGENT_LIST: Agent[] = [
  AGENTS.sales,
  AGENTS.finance,
  AGENTS.service,
  AGENTS.engagement,
];
