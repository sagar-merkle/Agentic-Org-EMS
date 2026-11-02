# Agentic Org-EMS: TVS Dealer Experience
## Frontend wireframe / UI-UX demo scope (draft v0.1)

| | |
|---|---|
| **Client** | TVS Motor Company (TVSM) |
| **Pitch** | Great AI use cases inside a system that looks and behaves like the EMS / Accelerator users already know, so there is almost no learning curve |
| **This phase** | Frontend only. Mock data, simulated calls and chats. No backend, no AI/ML |
| **Products** | **All TVS EV variants**, marketing names, from `data/products.json`: iQube 2.3 / 3.1 / 3.5 kWh, MillionR Edition, S 4.7 kWh, ST 5.3 kWh; Orbiter V1 and V2; TVS X (9 variants). ICE models are out of scope |
| **Predecessors** | `../agentic-org` (iQube, graph POC) and `../agentic-org-dashboards` (dashboards, Orbiter, X). The node graph is dropped |
| **Inputs** | `../EMS-Accelerator Screenshots`, `../TVSM usecases.xlsx` (tab 1 only for the use cases) |
| **Status** | Scope draft for validation, 2 Nov 2026 |

---

## 1. Summary

Take the EMS look and feel and add an **AI workforce** to it. Five named AI agents work across shop,
buy and own. Each of the 10 use cases appears **where the user would already look for it** in EMS: an
enquiry card, a follow-up form, a booking screen, a Reports page.

Two principles carry over from Agentic Org: **agents prepare and humans approve**, and **every score
has a reason**.

**No story is baked in.** The Excel user journey was context only. The demo is run by switching
persona and working through that persona's screens. The mock data is seeded so that every use case has
records in the right state to show.

## 2. Design principles

1. **EMS first.** If EMS already has a pattern for it (card, tab, pill toggle, filter page, bottom
   action bar), use that pattern. New patterns only where EMS has none.
2. **Clean by default.** On AI-only screens, at most five KPI tiles and one primary list (screens cloned
   from EMS, such as Home with its six stat rows, keep their EMS layout). Everything extra is
   collapsible and **collapsed by default**, using EMS-style section headers with a chevron.
3. **AI is marked, not shouting.** A small sparkle mark and the agent's colour on AI-created or
   AI-changed items. Never a new screen layout just for AI.
4. **Every number has a "why".** Scores, recommendations and outcomes show their reason in a collapsed
   "Why?" section.
5. **Agents propose, humans approve.** Approve, Modify and Reject buttons sit where EMS puts actions.
6. **One mock dataset.** An enquiry created by an agent shows up in the DSE list and in the manager's
   counts.
7. **Simulated is labelled.** Telemetry, slots, stock and range carry a "simulated" or "estimated" tag.

## 3. Layout and look (anchored to the screenshots)

Your choice: EMS look and feel, with a **wider desktop layout and a persistent left sidebar**.

| EMS element | Here |
|---|---|
| White top header (hamburger, TVS logo, bell and filter on Home) plus a **blue page-title band** (`#0A3D9C`-ish, back arrow, title) on sub-pages only. Home has no blue band | Kept as-is. Call dot and WhatsApp icons only where EMS has them (Details, Follow Up); lists show just the filter icon |
| Hamburger drawer with profile card, dealer code, virtual number and menu | Becomes a **persistent sidebar** (collapses to icons). The profile card and virtual number card stay on top |
| Centred narrow content column | Widens to about 1280 px. Cards go 3 to 4 per row (EMS already does 3) |
| Stat rows ("Total Enquiries 38 >") | Kept. Used as the home tiles for each persona |
| Tabs with counts ("Not Followed Up (23)") | Kept for every list |
| Enquiry cards (tag, DSE strip, View / Follow Up) | Kept. Add a score chip, an AI marker and a next-best-action line |
| Filters page: collapsible sections, pill chips, Clear, Apply | Kept as a right-side filter panel |
| Bottom action bar of pill buttons | Becomes a sticky footer bar on lists and forms |
| Pill toggles (Cash / Finance, Hot / Warm / Cold) | Kept |
| Floating robot button and "Your AI Buddy" chat | Kept as the AI Buddy. Opens the agent chat and also hosts the Ask-the-data Q&A |
| Salesmate AI menu item | Joined by an **AI Agents** menu item |
| Light, white cards, pill buttons, blue primary | Reused. Brand blue for primary actions and the title bar, red only for alerts, as in EMS |

Desktop first (1440 px, works at 1280). Mobile is not a goal for this phase.

### 3a. EMS pattern inventory (from all 46 screenshots)

What EMS actually contains, so every addition reuses a pattern that exists.

| Area | What EMS does | Where we hook in |
|---|---|---|
| **Login** | Blue left panel with Accelerator logo card, white right panel. Mobile number, Next, then a 4-digit OTP with Back / Login, "Resend via SMS or WhatsApp", Help & Support, "TVS Employee Login" | Static login: mobile `9999999999`, OTP `0000`. A light-coloured tip under each field shows the demo value |
| **Home** | Stat rows (Total 38, Not Followed Up 23/38, Followed Up, Converted, Postponed, Lost & Dropped with a 6-way breakdown). Bell and filter top right. Bottom pills: Search Enquiry, Create Enquiry, Today's Tasks (1), Missed Tasks (307) | Same rows. A slim AI strip above them ("AI handled 14 today") and AI-sourced counts inside the existing rows |
| **Sidebar menu** | Profile card (name, role, dealer code), QR card, **Virtual/Google incoming call number**, Home, Your Tasks, Reports, Configure Quotations, **Salesmate AI** (New!), Dealer Processes, **Lead Management** (Digital Lead Management, Virtual Number Call Management), User Management, Tutorials, Announcements | Add **AI Agents** beside Salesmate AI. Agents appear as assignees in both Lead Management screens |
| **Enquiries list** | Title bar with filter icon. Tabs with counts. Search by name or number. 3-up cards: checkbox, icons, Hot/Not Set tag, name, vehicle (+N), received, follow-ups taken, next date, DSE box with Viewed / Followed / Closed bar, share, View Enquiry, Follow Up. Red "Lapsed Time" header on overdue. Blue call dot. "Unassigned Leads" with a + button. "(3) Filters Applied" bar | Keep the DSE-set Hot/Warm/Cold tag and add an "AI suggests: Hot" chip with Accept. AI marker on the DSE box when an agent owns it. Next-best-action line. Unassigned leads can go to an agent. Each card already has a **robot (AI Buddy) icon next to share**: it opens the per-lead pre-call brief (UC 5) |
| **Filters** | Collapsible sections with Clear and chevron: User Selection, BM Help Status, Duration & Sorting (30 days to custom), Enquiry Tag (Qualified Lead, Pre-approved TVS credit lead), Category, Enquiry Type (Walk-in, Outdoor, Digital, Telephone, Kirana, Marketplace), Customer Type, Dealer Status, Lost & Dropped, Vehicle Type (EV / ICE), Vehicle Brands. Clear All, Cancel, Apply | New chips only: Enquiry Tag "AI qualified", "Upgrade offer"; Enquiry Type "Chat", "WhatsApp", "AI voice"; a "Handled by" section for agents |
| **Create Enquiry** | Basic info (+91 number, name), Add Interested Vehicles (brand grid with Features, then variant dialog with checkboxes), comments, collapsible Other Information, footer note on auto quotation, toast "Enquiry successfully created!" | Agent-created enquiries use the identical record |
| **Enquiry Details / Customer History** | Bottom tabs: Customer History, Enquiry Details, Test Ride Details, Booking Details. "Add Additional Information" banner listing missing fields. Header strip (name, received, created by, assigned to, next follow-up). **Customer Interactions History**: numbered coloured cards with date, source (FACEBOOK, ACCELERATOR) and event. Collapsible Customer Information. Interested Vehicles cards. Enquiry number, booking number, frame, invoice. Generated Quotations. Actions and Follow Up buttons, pencil and AI Buddy floating | The interaction history is where **every agent chat, call and WhatsApp lands**, with the source label (WEB CHAT, WHATSAPP, AI VOICE) and agent name. Score and "Why?" sit under the classification field |
| **Actions modal** | Assign, Generate Quotation, Customer Feedback, Proceed To Booking | Adds "Ask AI to call", "Approve AI proposal". The existing **Customer Feedback** action is the hook for UC 16 feedback calls |
| **Capture Follow Up** | Pink mandatory-fields banner. Follow Up Update (radio dialog: Spoke with Customer, SMS'ed, Customer Visited, Busy/No answer, Switched off). Enquiry Status, Customer Comments, Next Follow Up date and time, Preferred method. Additional Information: Source of Awareness, Purchase Mode (Cash / Finance), own 2-wheeler, existing vehicle, exchange or scrap, Enquiry Category (Hot / Warm / Cold). Test Ride block (vehicle, status, date, Before or After 12 PM, At Dealership or At Home). Submit & Edit Enquiry, Submit | A call summary **pre-fills** these fields, each with a small AI mark the DSE can edit before Submit |
| **Bookings** | Title "Bookings" with an EV badge, tabs: Total, Open Partially Paid, Open Fully Paid Online, Allotted, Invoiced, Cancelled. Cards with finance status, DSE strip, View Booking, Follow Up. Create flow: slots card (iQube 222/222, Orbiter 50/50), customer details with OTP, vehicle, variant, colour swatches, 650W charger, booking amount **₹5,000 refundable**, purchase mode, summary, Verify Mobile With OTP. Note: the Select Vehicle dialog offers iQube and Orbiter only; footer says "Bookings are currently available only for TVS iQube" | UC 2 uses this flow as is. Token amount follows EMS (₹5,000). Slots show "simulated" |
| **Lead Management** | Info banner, brand search, brand cards ("Aveg Patekar and 2 other users", Assign/Edit Users, Reset to Default). Detail: assigned users with Unassign, unassigned list grouped (Electric Vehicle Consultants, Recommended) | EMS says digital leads "will be distributed among all assigned users" (treated as round-robin). AI Meera is added as an assignee with a "first touch" toggle |
| **Virtual Number Call Management** | Dealer virtual number, drag-to-prioritise list, top 2 assignees get calls, Unassign, Cancel, Apply | AI Meera as "Assignee 0" for inbound calls. EMS routes to the **top 2 assignees**, so this deliberately pushes one human to the third slot (shown in the UI). This is the UC 1 voice entry point |
| **Salesmate AI** | Different look: pastel gradient page, brand search, language picker, three gradient tiles (Get Personalized Pitch, Obtain Comparison Results, Your AI Buddy), last accessed pitches, last viewed comparisons. Pitch has 5 s, 30 s and 2 min tabs. Comparison has TVS vs other brand pickers | Kept as-is but EV-only (iQube, Orbiter, TVS X; ICE pitches dropped). "Obtain Comparison Results" is also where UC 1 model comparison appears |
| **Your AI Buddy** | Clean chat, TVS logo, input with mic, send, suggestion chips, copy / like / dislike under replies | Shell for Buyer Assistant (DSE side), Ask-the-data (VoC) and the persona-aware helper |

Observations that shape the design:
- EMS is **mostly white with a single blue bar**. Colour is rationed: blue buttons, red for overdue, green for done, red for Hot, amber for Warm, blue for Cold. The AI additions must follow that.
- Secondary information is always behind a chevron (Customer Information, Other Information, Booking Slots). We reuse exactly this for "Why?", transcript and details.
- **Salesmate AI is the only place with a playful style.** The agent pages stay in the plain EMS style, and only the Customer phone frame may use more colour.
- Enquiry names such as "don't call" suggest DNC handling exists. UC 1 consent and opt-out can reuse a **Do-not-call** flag on the card.

## 4. Personas and sidebar

Flow: **static login → default persona (Branch Manager, the one captured in the screenshots) → persona
switcher** at the top of the sidebar. The sidebar items change per persona. Persona-specific screens use
the same shell.

Only the Branch Manager home, enquiry, booking and menu screens are captured in the screenshots. The DSE,
Service, Technician, Warranty and CX views are **assumed variants** built with the same patterns. Excel
personas marked "(A)" or "needs confirmation" are likewise assumptions. In EMS, Enquiries and Bookings
are reached from the Home stat rows and bottom pills, not from the menu; the persona sidebars are
EMS menu groups (expandable) with those entries as shortcuts.

Service and warranty personas sit in CPS/TNH in the client's real landscape. Placing them in the EMS shell
is a pitch decision. **Approvals:** anyone in the persona can approve, recorded under the persona's name.

| Persona | Sidebar | Lands on |
|---|---|---|
| **DSE** (sales executive) | Home, Your Tasks, Enquiries, Bookings, Test Rides, Reports, AI Buddy | Home stat rows (EMS clone, assumed) |
| **Call centre** (Excel UC 1, 2, 4, 10) | Queue sorted by score, Calls, AI Agents | Prioritised call queue |
| **Branch Manager / Dealer owner** | Home, Reports, Lead Management, AI Agents, Virtual Number, User Management | Home stat rows, plus agent summary |
| **Service Advisor** | Service Home, Job Cards, Vehicle Health, Reports | Job card queue |
| **Fleet operator** (B2B, UC 9) | Fleet tab under Vehicle Health | Fleet health list |
| **Service Technician** | My Jobs, Co-Pilot | Job card, then guided repair |
| **Warranty L1 / L2** | Claims, Confidence buckets, Audit | Claim queue |
| **CX / Leadership** | Voice of Customer, Reports | VoC overview |
| **Customer (outside EMS)** | A phone-style frame showing web chat, WhatsApp and voice | Channel picker |

Notes:
- Customer channels exist so the channel-facing use cases (1, 2, 9, 10, 13) have a visible front end.
  They are drawn as a device frame, not part of the EMS shell.
- All personas see the same data. The persona only changes what is emphasised.

## 5. AI agents (retained, with a 5th)

| Agent | Role | Use cases | Colour |
|---|---|---|---|
| **AI Meera** | Sales | 1, 2, 4 (scoring), 5 (companion brief and summary) | Sky (as in the old dashboards project) |
| **AI Maheb** | Finance | EMI options, booking token and payment links inside 1, 2 and 10 estimates | Violet (as in the old dashboards project) |
| **AI Arjun** | Engagement and retention | 13 (month-30 upgrade), 9 (outreach), VoC feedback calls (16) | Amber |
| **AI Sagar** | Service | 9, 10, 11 | Green |
| **AI Mansi** | Back-office | 14 (claims), 16 (VoC analysis) | Slate |

Each agent has: a status (On call, Idle, Paused), calls or tasks today, success rate, and one line on
what it is doing now. Agents hand work to humans and to each other as **handoffs**.

## 6. Use case placement (the important part)

Where each use case lives in EMS. **Bold** means a new screen. Plain means an addition to an existing
EMS screen.

| UC | Who sees it | Where it plugs in | What the user sees |
|---|---|---|---|
| **1** Conversational Buying Assistant | Customer, DSE, Manager, call centre (fewer callback requests) | **Customer channel frame** (chat, WhatsApp, voice). In EMS: **Enquiries** list, **Virtual Number Call Management**, Customer History tab | AI-created enquiry card tagged "AI qualified" with the 8-field intake, consent and opt-out recorded. Model recommendation and comparison (also in Salesmate "Obtain Comparison Results"), a "Not a fit because…" card for poor fits, and a nearest-dealer card (from city or pincode; no GPS or route data, nothing guessed). Assignment to a DSE with the customer told who will call. Cross-channel history. Each call type (inbound, qualification, reminder, test-ride reminder) is tagged in Customer History and the AI Agents log. In Virtual Number, an "AI Meera" assignee for inbound calls |
| **4** Lead Prioritisation | DSE, Manager, call centre | Enquiry card, Enquiry Details, filter panel, Home | Keeps the DSE-set Hot / Warm / Cold category and adds an "AI suggests" chip with Accept, a one-line reason, a next-best-action line. Collapsed "Why?" with the factors. A data-completeness hint ties to the "Add Additional Information" banner. Sort and filter by score; the call-centre queue can sort by score. Brand Manager assigns leads to DSE groups via Lead Management. A small panel shows how scoring behaves with limited data and which extra data customers will willingly share |
| **5** DSE Companion | DSE, sales manager | **Follow Up** button on card and details, Capture Follow Up form | Pre-call brief (collapsed sections, opened from the card's robot icon), call started from the existing blue call dot and shown as "Connected via phone + headset" (no laptop call bar), live suggestions, a walk-in mode with a "2-speaker capture" note, post-call summary that **pre-fills** the Capture Follow Up form and re-scores the lead. Manager sees summaries |
| **2** Test Ride and Booking | Customer, DSE | Test Ride Details tab, Capture Follow Up test-ride block, Create New Booking, Booking Slots card | Slots shown as "simulated". Both entry paths are seeded: booking mid-conversation after a recommendation, and a customer calling specifically to book. TVS X stops at enquiry and test ride (the EMS Select Vehicle dialog offers only iQube and Orbiter slots). The call centre steps in after a missed test ride. Reminder call, missed-ride rebooking, post-ride profile update, booking and payment link. DSE approves a re-scored variant |
| **9** Vehicle Health | Customer, service advisor, fleet (B2B) | **Vehicle Health** (Service persona), Customer History tab, customer WhatsApp | Health status against similar vehicles, predictive alert with a "Book service" button, cost of delay, charging guidance. Customer view first; the advisor sees it after booking. Collapsed "Why it matters" panel (customers lost after the 2nd or 3rd service, and the revenue lost). Notes: no TPMS on the S trim and no brake-wear data on any variant. A **fleet tab** for B2B. Telemetry labelled simulated |
| **10** Smart Service Assistant | Customer, service advisor, call centre, technician | **Job Cards** (Service persona), customer chat or voice | Conversational booking, estimate, status updates; a UC 9 health alert links to one-step booking. A pre-built job card from telematics plus a roughly 2-minute voice note (with transcript and translation), with a drop-and-leave option. The technician picks up the job card. Also works **without telemetry** (one seeded non-connected vehicle). Advisor reviews and approves |
| **11** Technician Assistant | Technician | **My Jobs and Co-Pilot** | Root-cause shortlist, a "Scan photo" step for vision diagnosis, step-by-step repair, parts and stock lookup, repair time, a collapsed "Send to NPQR" quality report. Multilingual toggle, positioned as less dependence on skilled technicians. "Needs bench confirmation" shown |
| **14** Warranty Claim Validation | L1 / L2, dealer, finance | **Claims** | Dealer raises the claim from the job card ("Raise warranty claim"). Confidence-bucketed queue: auto-approve, auto-reject (human confirms), human review. Fraud flags, evidence, claim summary, L1 (OEM Country Manager Service) and L2 (Head Office Service, UK, final say) sign-off. Claim status goes to the customer on WhatsApp. A read-only finance view and a Dealer Operations view |
| **13** Warranty Tracking and Upgrade | Customer, marketing, DSE | Warranty clocks on **Vehicle Health**, Enquiries | Time and mileage clocks (3 yr or 50,000 km, whichever comes first), a high-mileage trigger (also for fleet operators), month-30 upgrade offer using the **same scoring and "Why?" panel as UC 4**. The offer becomes a new enquiry tagged "Upgrade". (The Excel Action cell for UC 13 repeats UC 14's text; noted as a source-sheet issue, the scope follows the UC 13 description) |
| **16** Voice of Customer | CX, leadership, regional managers | **Voice of Customer** under Reports, AI Buddy | Sentiment trend, top issues (default cut: by model, switchable to region), early alerts in the bell, natural-language Q&A. PII masked. Feedback calls launched from the EMS **Actions → Customer Feedback**, with per-minute voice cost shown, for consented customers only. A CX score tile on the Manager home |

Missing paths are seeded as data states, not scripted: "just looking" leads with advice only and no
follow-up calls, and a missed test ride with two new slots offered.

## 7. Agent activity and call outcome views

This is the core Agentic Org idea, presented as an EMS-style dashboard (menu item **AI Agents**).

**Home of the page (always visible)**

| Block | Content |
|---|---|
| Stat rows | Calls today, Connected, Positive outcome, Handed to humans, Pending approvals (EMS "Total Enquiries 38 >" style) |
| Agent cards (5) | Name, status, today's count, success %, one-line "doing now". Click filters the log |
| **Live now** (only while a call runs) | Pinned card: agent, customer, call type, timer, streaming lines, captured fields filling in |
| **Call and activity log** (primary list) | Tabs with counts (All, Connected, Positive, Needs human, No answer). Card or row: time, agent, customer, type, outcome chip, duration, next action. Right-side filter panel (agent, channel, type, outcome, duration) |

**Collapsible, collapsed by default**

Outcomes by agent · Calls by hour · Handoffs · Quality and cost · Channel mix.

**Call or activity drawer** (click a row)

- Summary (open), next action with Approve, Reassign, Ask agent to call back.
- Collapsed: captured details with quotes, transcript with audio scrubber, lead score change with factors,
  consent and opt-out record.
- Works for non-call activity too: a chat, a WhatsApp message, a claim decision, a job card.

## 8. Reuse from the previous projects

Already copied into this folder:

| What | From | Now at |
|---|---|---|
| TVS logos (full and horse) | dashboards `public/brand` | `public/brand/` |
| Scooter images (iQube 6, Orbiter 6, X) | dashboards `public/scooters` | `public/scooters/` |
| Products, owners, source data | dashboards `data` | `data/` |
| Agent definitions, catalogue, finance, format, EV readiness | dashboards `reuse/` | `reference/agentic-org-dashboards/` |
| Call and lead types, lead scoring, store | dashboards `src/lib` | `reference/agentic-org-dashboards/` |
| Original scope and concept | `agentic-org/docs` | `reference/agentic-org/` |

Drops: node graph, journey canvas, stage rail, old shell and drawers. These get rebuilt in the EMS style.

## 9. Tech stack and structure (proposal)

Same stack as `agentic-org-dashboards` so nothing new to learn: Next.js 15, React, Tailwind 4,
lucide-react. Local mock store, no backend.

```
src/app/(ems)/…           routes per persona
src/components/shell/     TitleBar, Sidebar, PersonaSwitcher, AiBuddy, FooterBar
src/components/ems/       StatRow, EnquiryCard, TabBar, FilterPanel, PillToggle, Collapsible
src/components/agents/    AgentCard, CallLog, LiveCall, CallDrawer
src/components/channels/  PhoneFrame (chat, WhatsApp, voice)
src/lib/data/             mock dataset seeded for all use cases
```

## 10. Out of scope

Backend, real AI/ML, telephony, Salesforce, real WhatsApp, mobile layout, real authentication
(the login is static: `9999999999` and OTP `0000`, shown as light-coloured tips), multi-dealer, and the node graph.

## 11. Build phases and acceptance

| Phase | Output | Accept when |
|---|---|---|
| 0 | Skeleton: shell, sidebar, persona switcher, theme, data seed | Looks like EMS side by side with the screenshots |
| 1 | DSE and Manager: Home, Enquiries, Enquiry Details, Follow Up, Bookings, filters (UC 4, 5, 2) | A reviewer finds the AI additions without a guide |
| 2 | **AI Agents** dashboard and drawers, Virtual Number (UC 1) | Every call can be traced from agent, to outcome, to next owner |
| 3 | Customer channel frame (UC 1, 2) | Chat, WhatsApp and voice all create the same enquiry |
| 4 | Service personas (UC 9, 10, 11) | Alert, job card and technician steps are all reachable |
| 5 | Warranty and VoC (UC 13, 14, 16) | Buckets, upgrade enquiry and Q&A all work |
| 6 | Polish, empty states, collapse memory | No AI-only screen shows more than 5 tiles or 1 primary list by default (EMS-cloned screens keep their layout) |

## 12. Open items

Decided:
- Fifth agent is **AI Mansi**. **AI Maheb** (Finance) stays.
- Customer side is a **single phone-style frame** with chat, WhatsApp and voice tabs.
- **Static login** at the start: mobile `9999999999`, OTP `0000`, with light-colour tips.
- Real catalogue variants in mock data. Booking token follows EMS (₹5,000), not the Excel story.

- **Final variant list (all TVS EVs sold)**, from `data/products.json`, 9 variants:
  iQube 2.3 kWh (sold/marketed as 2.2 kWh in some sources), 3.1 kWh, 3.5 kWh, MillionR Edition, S 4.7 kWh,
  ST 5.3 kWh; Orbiter V1 (2 colours) and V2 (6 colours); TVS X. Bookings follow the EMS Select Vehicle dialog
    (iQube and Orbiter); TVS X stops at enquiry and test ride. Slot counts are simulated.
  - **EV only everywhere.** Brand grids, Lead Management brand cards, the Vehicle Type filter (fixed to EV or
    hidden), Salesmate AI content and AI Buddy chips show only iQube, Orbiter and TVS X. ICE is out of scope.
- **Reports, Today's Tasks, Missed Tasks, Service, Warranty and VoC** follow the EMS style, specified as:
  - Reports: a sub-menu of report cards, each opening stat rows, tabs and a filter panel.
  - Today's and Missed Tasks: list page with count tabs and enquiry-style cards; missed tasks get the red "Lapsed Time" header; agent-created tasks are marked.
  - Service, Warranty, VoC: blue page-title band, tabs with counts, 3-up cards, the collapsible filter panel and the pill footer.
- **Orbiter images** are transparent PNGs, cut out and edge-cleaned.
  No SVG scooter artwork exists in any prior project; all scooter images are transparent PNG.
- Two independent Opus 5.5 reviews have been applied to this scope.

Still open: none from this round.
