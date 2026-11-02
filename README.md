# Agentic Org-EMS

A frontend-only wireframe / UI-UX demo for **TVS Motor (TVSM)**. It looks and behaves like the EMS / Accelerator dealer system users already know, and plugs 10 AI use cases into the screens where people would already look for them.

The core Agentic Org idea is kept: **five named AI agents do the legwork, humans approve and close**, and every score shows a reason. It is a dashboard, not a node graph.

> Status: UX validation build. All data is mock and all calls, chats and AI results are simulated. There is no backend and no AI/ML yet.

## Run it

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3100>.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3100 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check |

**Login (demo):** mobile `9999999999`, OTP `0000`. Both are shown as light tip text on the form.

State lives in memory (and `sessionStorage` for login and persona). Refresh to reset the data.

## The AI agents

| Agent | Role | Use cases |
|---|---|---|
| **AI Meera** (sky) | Sales: answers, qualifies, books test rides | 1, 2, 4, 5 |
| **AI Maheb** (violet) | Finance: EMI comparison, payment links | 1, 2, 10 |
| **AI Arjun** (amber) | Engagement: reminders, outreach, feedback calls | 9, 13, 16 |
| **AI Sagar** (green) | Service: health alerts, job cards, technician help | 9, 10, 11 |
| **AI Mansi** (slate) | Back-office: warranty pre-checks, feedback insights | 14, 16 |

Colour rules: red = Hot or overdue, amber = Warm, blue = Cold, green = done. AI-created items carry a small sparkle mark in the agent's colour. Every score has a collapsed **Why?** panel.

## User journey

Use the **Viewing as** switcher at the top of the sidebar to walk the story persona by persona. The data is seeded so every use case has a record in the right state.

1. **Customer (phone frame)** `/customer`
   A shopper chats with AI Meera, asks about EVs, compares models, and books a test ride. WhatsApp shows Arjun's test-ride reminder, Sagar's service booking and a feedback request. Voice shows a simulated inbound call. *(UC 1, 2, 9, 10, 16)*
2. **Branch Manager** `/`, `/agents`
   Home looks like EMS. **AI Agents** is the control room: five agent cards, a live Meera call replaying a scripted conversation, approvals waiting for the team, and a call and activity log. Click any row for the outcome: summary, captured fields with quotes, transcript, score change with reasons, next action and owner, consent and cost. Virtual Number and Lead Management let AI Meera take first touch ("Assignee 0") without displacing the sales team's routing silently. *(UC 1)*
3. **Sales Executive (DSE)** `/enquiries`
   Enquiry cards show AI-qualified leads, unassigned leads, DNC flags, and an **AI suggests** category (Hot/Warm/Cold) with a Why panel. The robot icon opens a pre-call brief. **Follow Up** shows "Connected via phone + headset" (with a walk-in two-speaker mode); the post-call AI summary pre-fills Capture Follow Up. Test rides, missed-ride rebooking and EV bookings (iQube and Orbiter, ₹5,000 refundable token) are in the same flow. Salesmate has AI-marked EV comparison. *(UC 1, 2, 4, 5)*
4. **Call centre** `/call-queue`
   Needs-human handoffs, callbacks and leads by score.
5. **Service Advisor** `/service`
   Vehicle Health shows battery, motor, brakes and tyres against similar vehicles, with severity and cost of delay, warranty clocks, and a month-30 upgrade offer. Outreach books a slot and creates a job. Job Cards show the customer's Marathi voice note with English translation, an AI-drafted issue and estimate for the advisor to approve, and a drop-and-leave flow. Fleet groups vehicles by owner. *(UC 9, 10, 13)*
6. **Service Technician** `/technician`
   Co-Pilot: scan a photo, see ranked likely causes with confidence, a repair checklist, parts with stock and bin, and ETA. *(UC 11)*
7. **Warranty L1 / L2** `/warranty`
   AI Mansi pre-checks every claim and buckets it as Auto-approve, Human review or Auto-reject, with confidence, flags and an evidence checklist. Humans sign off at L1, and at L2 for claims of ₹20,000 or more. *(UC 14)*
8. **CX / Leadership** `/voc`
   Voice of Customer: sentiment by topic, filters, a Mansi insight (for example, Pune iQube 3.1 range complaints rising), PII-masked feedback, and an Actions menu that launches feedback calls by AI Arjun. *(UC 16)*
9. **Everyone:** the **AI Buddy** button (bottom right) answers quick questions, and **Reports** carries Today's Task, Missed Task, Service, Warranty, Voice of Customer, funnel, bookings and AI performance reports in EMS style.

## Use case map

| UC | Where it appears |
|---|---|
| 1 | Customer phone frame, Enquiries, Virtual Number, Lead Management, Salesmate |
| 2 | Test Ride tab, booking flow, missed-ride rebooking |
| 4 | Enquiry Details: AI category suggestion and Why |
| 5 | Follow Up call, pre-call brief, summary that pre-fills Capture Follow Up |
| 9 | Vehicle Health, Fleet |
| 10 | Job Cards |
| 11 | Technician Co-Pilot |
| 13 | Warranty clocks and upgrade enquiry |
| 14 | Warranty Claims |
| 16 | Voice of Customer, feedback calls |

Full detail is in [SCOPE.md](./SCOPE.md).

## Product scope

EV only, using real catalogue data: iQube 2.3 / 3.1 / 3.5 kWh, MillionR Edition, S 4.7 kWh, ST 5.3 kWh; Orbiter V1 and V2; TVS X. Bookings cover iQube and Orbiter; TVS X stops at test ride.

## Project layout

```
src/app/            routes (enquiries, bookings, agents, service, warranty, voc, reports, customer, ...)
src/components/     shell, EMS-style UI kit, per-area components
src/lib/            types, agents, personas, variants, seed data, in-memory store
public/             TVS brand assets and scooter images (transparent PNGs)
data/               catalogue and owner source data
reference/          code reused from the earlier agentic-org projects
SCOPE.md            validated scope and use-case placement
```

Stack: Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript, lucide-react.
