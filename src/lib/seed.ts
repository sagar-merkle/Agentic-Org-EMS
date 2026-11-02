import { iso } from "./base";
import type { Approval, Booking, CallRecord, Enquiry, Interaction, Task } from "./types";

let hid = 0;
const h = (
  daysAgo: number,
  hh: number,
  source: Interaction["source"],
  title: string,
  detail: string,
  extra: Partial<Interaction> = {},
): Interaction => ({ id: `H${++hid}`, ts: iso(daysAgo, hh, 15), source, title, detail, ...extra });

export const ENQUIRIES: Enquiry[] = [
  {
    id: "ENQ-4001", name: "Rohan Mehta", phone: "+91 98220 41107", receivedAt: iso(0, 9, 12), createdBy: "AI Meera", assignedTo: "Aveg Patekar", aiOwner: "meera",
    source: "Web Chat", vehicles: ["iqube-3-1-kwh", "iqube-3-5-kwh"], category: "Not Set", status: "Not Followed Up", followUps: 0, tag: "AI qualified",
    nextFollowUp: iso(-0, 16, 0),
    intake: { budget: "₹1.4 – 1.6 lakh", usage: "Daily office commute", dailyKm: "38 km", city: "Pune, Baner", parking: "Society parking, charging point available", charging: "Home 15A socket", purchaseMode: "Finance", timeline: "Within 2 weeks" },
    ai: {
      category: "Hot", score: 86, reason: "Asked for EMI and test ride in the first chat, budget fits 3.1 and 3.5 kWh.",
      factors: [
        { label: "Asked for a test ride", delta: 24 }, { label: "Budget matches variant", delta: 18 }, { label: "Home charging available", delta: 12 },
        { label: "Buying within 2 weeks", delta: 20 }, { label: "Finance interest (EMI asked)", delta: 8 }, { label: "First-touch channel is web chat", delta: -2 },
      ],
      nextAction: "Call today before 4 PM, offer Saturday 11 AM test ride at Baner.",
    },
    history: [
      h(0, 9, "WEB CHAT", "AI Meera chat, 6 min", "Recommended iQube 3.1 kWh and 3.5 kWh for a 38 km daily commute. Collected 8 intake fields. Consent recorded. Assigned to Aveg Patekar.", {
        agentId: "meera",
        transcript: [
          { who: "customer", text: "I travel about 38 km a day to Hinjewadi. Which iQube should I pick?" },
          { who: "agent", text: "For 38 km a day the 3.1 kWh gives you a real-world range near 100 km, so roughly 2.5 days per charge. The 3.5 kWh gives about 120 km if you prefer charging twice a week." },
          { who: "customer", text: "Can I get EMI? And can I test ride this weekend?" },
          { who: "agent", text: "Yes. AI Maheb can share EMI options, and I can book a test ride. May I record this chat and share your details with the Baner dealership?" },
          { who: "customer", text: "Yes please." },
        ],
      }),
    ],
  },
  {
    id: "ENQ-4002", name: "Sneha Kulkarni", phone: "+91 98900 11876", receivedAt: iso(1, 18, 40), createdBy: "AI Meera", assignedTo: "Priya Nair", aiOwner: "meera",
    source: "AI Voice", vehicles: ["orbiter-v2"], category: "Warm", status: "Followed Up", followUps: 2, tag: "AI qualified", nextFollowUp: iso(-1, 11, 0),
    intake: { budget: "₹1.1 – 1.2 lakh", usage: "College and local errands", dailyKm: "18 km", city: "Pune, Kothrud", parking: "Ground floor", charging: "Home socket", purchaseMode: "Cash", timeline: "This month" },
    ai: { category: "Warm", score: 64, reason: "Short commute fits Orbiter V2, test ride booked, budget confirmed, no timeline pressure.", factors: [{ label: "Test ride scheduled", delta: 22 }, { label: "Budget matches", delta: 16 }, { label: "Short commute fits range", delta: 10 }, { label: "Timeline is this month", delta: 8 }, { label: "Compared with a rival brand", delta: -6 }], nextAction: "Send a test ride reminder the evening before." },
    testRide: { variantId: "orbiter-v2", status: "Scheduled", date: iso(-1, 11, 0), slot: "Before 12 PM", place: "At Dealership" },
    history: [
      h(1, 18, "AI VOICE", "Inbound call to dealer number, 4 min", "AI Meera answered via the virtual number, qualified the buyer and booked a test ride for tomorrow 11 AM.", { agentId: "meera" }),
      h(0, 9, "AI VOICE", "Test ride reminder call, 1 min", "AI Meera confirmed tomorrow's slot. Customer confirmed.", { agentId: "meera" }),
    ],
  },
  {
    id: "ENQ-4003", name: "Imran Shaikh", phone: "+91 98600 55231", receivedAt: iso(6, 12, 0), createdBy: "Aveg Patekar", assignedTo: "Aveg Patekar", aiOwner: "meera",
    source: "Walk-in", vehicles: ["iqube-s-4-7-kwh"], category: "Warm", status: "Followed Up", followUps: 3, nextFollowUp: iso(-0, 17, 0),
    ai: { category: "Warm", score: 58, reason: "Missed the test ride yesterday; still interested in the S variant and replied on WhatsApp.", factors: [{ label: "Missed test ride", delta: -14 }, { label: "Replied within 2 hours", delta: 12 }, { label: "Visited the showroom", delta: 20 }, { label: "Asked about colours", delta: 8 }], nextAction: "Approve the two new slots AI Meera proposes." },
    testRide: { variantId: "iqube-s-4-7-kwh", status: "Missed", date: iso(1, 15, 0), slot: "After 12 PM", place: "At Dealership" },
    history: [
      h(6, 12, "WALK-IN", "Showroom visit", "Walk-in with family. Interested in iQube S 4.7 kWh. Quotation generated."),
      h(1, 16, "AI VOICE", "Test ride reminder, no answer", "AI Meera called twice, then messaged on WhatsApp.", { agentId: "meera" }),
      h(0, 9, "WHATSAPP", "Rebooking proposal", "Customer said he was stuck at work and asked for Saturday. AI Meera proposed Sat 11 AM and 4 PM for the DSE to approve.", { agentId: "meera" }),
    ],
  },
  {
    id: "ENQ-4004", name: "Pooja Deshmukh", phone: "+91 98230 77412", receivedAt: iso(9, 11, 30), createdBy: "Priya Nair", assignedTo: "Priya Nair", source: "Walk-in",
    vehicles: ["iqube-3-5-kwh"], category: "Hot", status: "Converted", followUps: 5, bookingId: "BKG-2201",
    ai: { category: "Hot", score: 91, reason: "Test ride completed, token paid, finance pre-approved.", factors: [{ label: "Test ride completed", delta: 25 }, { label: "Token paid", delta: 30 }, { label: "Finance pre-approved", delta: 15 }], nextAction: "Schedule delivery." },
    testRide: { variantId: "iqube-3-5-kwh", status: "Completed", date: iso(5, 11, 0), slot: "Before 12 PM", place: "At Dealership" },
    history: [h(9, 11, "WALK-IN", "Showroom visit", "Walk-in. Quotation generated."), h(5, 11, "DSE CALL", "Test ride completed", "Rode iQube 3.5 kWh for 15 min."), h(3, 15, "ACCELERATOR", "Booking created", "BKG-2201, ₹5,000 refundable token paid.")],
  },
  {
    id: "ENQ-4005", name: "Vijay Patil", phone: "+91 98810 23390", receivedAt: iso(0, 8, 5), createdBy: "AI Arjun", assignedTo: "Sandeep Kulkarni", aiOwner: "arjun",
    source: "Upgrade", vehicles: ["iqube-s-4-7-kwh"], category: "Not Set", status: "Not Followed Up", followUps: 0, tag: "Upgrade", nextFollowUp: iso(-0, 15, 0),
    ai: { category: "Warm", score: 71, reason: "Month 30 of warranty, 41,200 km, two battery-range complaints, service adherence high.", factors: [{ label: "30 of 36 warranty months used", delta: 22 }, { label: "High mileage (41,200 of 50,000 km)", delta: 18 }, { label: "Always services on time", delta: 14 }, { label: "Two range complaints", delta: 10 }, { label: "No recent finance closure", delta: 7 }], nextAction: "Offer the S 4.7 kWh with exchange value, send brochure." },
    history: [h(0, 8, "WHATSAPP", "Upgrade offer sent", "AI Arjun sent the month-30 upgrade offer for the S 4.7 kWh. Customer tapped 'Interested'. Enquiry created.", { agentId: "arjun" })],
  },
  {
    id: "ENQ-4006", name: "Anita Rao", phone: "+91 98500 66120", receivedAt: iso(12, 14, 0), createdBy: "AI Meera", assignedTo: "Rahul Shinde", aiOwner: "meera", dnc: true,
    source: "Web Chat", vehicles: ["orbiter-v1"], category: "Cold", status: "Postponed", followUps: 1,
    ai: { category: "Cold", score: 22, reason: "Just looking; asked not to be called. Advice shared, no follow-up calls scheduled.", factors: [{ label: "Opted out of calls", delta: -30 }, { label: "No timeline", delta: -12 }, { label: "Read the brochure", delta: 6 }], nextAction: "Do not call. Share price update by WhatsApp only if she opts in." },
    history: [h(12, 14, "WEB CHAT", "AI Meera chat, 3 min", "Customer is just looking. Advice shared. Opted out of calls. Recorded.", { agentId: "meera" })],
  },
  {
    id: "ENQ-4007", name: "Karan Singh", phone: "+91 98350 90021", receivedAt: iso(3, 20, 5), createdBy: "FACEBOOK", assignedTo: "Aveg Patekar", source: "Digital",
    vehicles: ["iqube-2-3-kwh"], category: "Not Set", status: "Not Followed Up", followUps: 0, lapsedDays: 3, nextFollowUp: iso(3, 10, 0),
    ai: { category: "Warm", score: 47, reason: "Only a name, number and model. Score based on limited data; asking two questions would raise confidence.", factors: [{ label: "Facebook lead, model named", delta: 20 }, { label: "No budget or timeline", delta: -8 }, { label: "Not contacted for 3 days", delta: -10 }], nextAction: "Ask budget and commute distance in the first call.", limitedData: true },
    history: [h(3, 20, "FACEBOOK", "Lead received", "Lead from Facebook Ads: iQube 2.3 kWh.")],
  },
  {
    id: "ENQ-4008", name: "Deepak Joshi", phone: "+91 98220 55002", receivedAt: iso(8, 10, 0), createdBy: "Neha Joshi", assignedTo: "Sandeep Kulkarni", source: "Telephone",
    vehicles: ["tvs-x"], category: "Warm", status: "Followed Up", followUps: 2, nextFollowUp: iso(-2, 12, 0),
    ai: { category: "Warm", score: 60, reason: "Rode the X, price above original budget. EMI could close the gap.", factors: [{ label: "Test ride completed", delta: 25 }, { label: "Above budget by ₹60k", delta: -14 }, { label: "Asked for EMI", delta: 10 }], nextAction: "AI Maheb to share a 36-month EMI option." },
    testRide: { variantId: "tvs-x", status: "Completed", date: iso(2, 12, 0), slot: "Before 12 PM", place: "At Dealership" },
    comments: "TVS X is not bookable in EMS yet. Stops at enquiry and test ride.",
    history: [h(8, 10, "ACCELERATOR", "Enquiry created", "Telephone enquiry."), h(2, 12, "DSE CALL", "Test ride", "Rode the X.")],
  },
  {
    id: "ENQ-4009", name: "Manisha Pawar", phone: "+91 98900 12345", receivedAt: iso(20, 12, 0), createdBy: "Priya Nair", assignedTo: "Priya Nair", source: "Walk-in",
    vehicles: ["iqube-3-1-kwh"], category: "Hot", status: "Converted", followUps: 6, bookingId: "BKG-2198",
    history: [h(20, 12, "WALK-IN", "Showroom visit", "Walk-in."), h(14, 11, "ACCELERATOR", "Booking created", "BKG-2198"), h(2, 17, "ACCELERATOR", "Invoiced", "Delivered. Invoice INV-6621.")],
  },
  {
    id: "ENQ-4010", name: "Suresh Naik", phone: "+91 98230 88001", receivedAt: iso(15, 15, 0), createdBy: "Rahul Shinde", assignedTo: "Rahul Shinde", source: "Outdoor",
    vehicles: ["iqube-3-1-kwh"], category: "Cold", status: "Lost & Dropped", followUps: 4, comments: "Lost on price to a rival.",
    history: [h(15, 15, "ACCELERATOR", "Enquiry created", "Outdoor lead."), h(4, 12, "DSE CALL", "Marked lost", "Reason: price, bought another brand.")],
  },
  {
    id: "ENQ-4011", name: "Farhan Ali", phone: "+91 98600 76123", receivedAt: iso(7, 13, 0), createdBy: "Aveg Patekar", assignedTo: "Aveg Patekar", source: "Walk-in",
    vehicles: ["orbiter-v1"], category: "Warm", status: "Postponed", followUps: 2, nextFollowUp: iso(-5, 11, 0),
    history: [h(7, 13, "WALK-IN", "Showroom visit", "Postponed purchase to next month.")],
  },
  {
    id: "ENQ-4012", name: "Kavita More", phone: "+91 98340 22998", receivedAt: iso(0, 7, 48), createdBy: "AI Meera", assignedTo: null, aiOwner: "meera",
    source: "WhatsApp", vehicles: ["iqube-st-5-3-kwh"], category: "Not Set", status: "Not Followed Up", followUps: 0, tag: "AI qualified",
    intake: { budget: "₹1.8 – 2.0 lakh", usage: "Long weekend rides and daily commute", dailyKm: "55 km", city: "Pune, Wakad", parking: "Own garage", charging: "Dedicated 15A point", purchaseMode: "Cash", timeline: "This week" },
    ai: { category: "Hot", score: 88, reason: "55 km daily needs the ST range, cash, buying this week.", factors: [{ label: "Range need matches ST", delta: 22 }, { label: "Cash purchase", delta: 14 }, { label: "Buying this week", delta: 26 }, { label: "Own charging", delta: 12 }, { label: "Unassigned for 3 hours", delta: -6 }], nextAction: "Assign to a DSE now. Hot leads cool quickly." },
    history: [h(0, 7, "WHATSAPP", "AI Meera WhatsApp, 9 messages", "Recommended iQube ST 5.3 kWh. Not a fit: Orbiter V1 (range too short for 55 km).", { agentId: "meera" })],
  },
  {
    id: "ENQ-4013", name: "Amit Jadhav", phone: "+91 98220 99011", receivedAt: iso(5, 11, 0), createdBy: "FACEBOOK", assignedTo: "Rahul Shinde", source: "Digital",
    vehicles: ["orbiter-v2"], category: "Cold", status: "Not Followed Up", followUps: 0, lapsedDays: 5, nextFollowUp: iso(5, 10, 0),
    history: [h(5, 11, "FACEBOOK", "Lead received", "Facebook lead.")],
  },
  {
    id: "ENQ-4014", name: "Tanvi Sharma", phone: "+91 98100 44022", receivedAt: iso(2, 16, 0), createdBy: "Outdoor Team", assignedTo: "Sandeep Kulkarni", source: "Outdoor",
    vehicles: ["iqube-2-3-kwh"], category: "Warm", status: "Followed Up", followUps: 1, tag: "Pre-approved TVS credit lead", nextFollowUp: iso(-3, 11, 0),
    history: [h(2, 16, "ACCELERATOR", "Enquiry created", "Outdoor activity, pre-approved credit offer.")],
  },
  {
    id: "ENQ-4015", name: "Nilesh Kamble", phone: "+91 98230 12090", receivedAt: iso(0, 10, 5), createdBy: "Aveg Patekar", assignedTo: "Aveg Patekar", source: "Walk-in",
    vehicles: ["iqube-3-1-kwh"], category: "Not Set", status: "Not Followed Up", followUps: 0, nextFollowUp: iso(-0, 14, 0),
    ai: { category: "Warm", score: 52, reason: "Walk-in today. Limited data captured so far.", factors: [{ label: "Walked in", delta: 22 }, { label: "No budget or timeline captured", delta: -10 }], nextAction: "Capture budget and commute distance before he leaves.", limitedData: true },
    history: [h(0, 10, "WALK-IN", "Showroom visit", "Walk-in, looking at iQube 3.1 kWh.")],
  },
  {
    id: "ENQ-4016", name: "Rekha Iyer", phone: "+91 98450 31001", receivedAt: iso(2, 19, 0), createdBy: "AI Meera", assignedTo: "Priya Nair", aiOwner: "meera", source: "AI Voice",
    vehicles: ["iqube-2-3-kwh"], category: "Cold", status: "Postponed", followUps: 1, tag: "AI qualified",
    ai: { category: "Cold", score: 31, reason: "Asked for general advice. 6 km daily commute, no purchase plan this year.", factors: [{ label: "No purchase plan this year", delta: -18 }, { label: "Short commute fits 2.3 kWh", delta: 8 }], nextAction: "Advice shared. No follow-up calls." },
    history: [h(2, 19, "AI VOICE", "Inbound call, 5 min", "Advice only. No follow-up.", { agentId: "meera" })],
  },
];

export const BOOKINGS: Booking[] = [
  { id: "BKG-2201", enquiryId: "ENQ-4004", customer: "Pooja Deshmukh", phone: "+91 98230 77412", variantId: "iqube-3-5-kwh", colour: "Pearl White", amount: 5000, status: "Open Partially Paid", finance: "Finance", dse: "Priya Nair", createdAt: iso(3, 15), chargerIncluded: true },
  { id: "BKG-2198", enquiryId: "ENQ-4009", customer: "Manisha Pawar", phone: "+91 98900 12345", variantId: "iqube-3-1-kwh", colour: "Titanium Grey", amount: 138510, status: "Invoiced", finance: "Cash", dse: "Priya Nair", createdAt: iso(14, 11), chargerIncluded: true },
  { id: "BKG-2203", customer: "Ritu Bansal", phone: "+91 98220 33410", variantId: "orbiter-v2", colour: "Stratos Blue", amount: 5000, status: "Open Fully Paid Online", finance: "Cash", dse: "Aveg Patekar", createdAt: iso(2, 12), chargerIncluded: false },
  { id: "BKG-2204", customer: "Gaurav Kadam", phone: "+91 98230 99008", variantId: "iqube-s-4-7-kwh", colour: "Titanium Grey Matte", amount: 5000, status: "Allotted", finance: "Finance", dse: "Sandeep Kulkarni", createdAt: iso(6, 10), chargerIncluded: true },
  { id: "BKG-2195", customer: "Shweta Patil", phone: "+91 98340 11220", variantId: "iqube-2-3-kwh", colour: "Pearl White", amount: 5000, status: "Cancelled", finance: "Cash", dse: "Rahul Shinde", createdAt: iso(18, 10), chargerIncluded: false },
];

export const SLOTS = { iQube: { used: 0, total: 222, left: 222 }, Orbiter: { used: 0, total: 50, left: 50 } };

export const TASKS: Task[] = [
  { id: "T1", enquiryId: "ENQ-4001", title: "Call Rohan Mehta, offer Saturday test ride", kind: "Call", due: iso(0, 16), missed: false, done: false, createdBy: "meera" },
  { id: "T2", enquiryId: "ENQ-4003", title: "Approve new test ride slots for Imran Shaikh", kind: "Approve AI", due: iso(0, 17), missed: false, done: false, createdBy: "meera" },
  { id: "T3", enquiryId: "ENQ-4015", title: "Capture budget for Nilesh Kamble", kind: "Follow up", due: iso(0, 14), missed: false, done: false },
  { id: "T4", enquiryId: "ENQ-4002", title: "Test ride at dealership, Sneha Kulkarni", kind: "Test ride", due: iso(-1, 11), missed: false, done: false },
  { id: "T5", enquiryId: "ENQ-4005", title: "Call Vijay Patil about S 4.7 kWh upgrade", kind: "Call", due: iso(0, 15), missed: false, done: false, createdBy: "arjun" },
  { id: "T6", enquiryId: "ENQ-4007", title: "First call to Karan Singh", kind: "Call", due: iso(3, 10), missed: true, done: false },
  { id: "T7", enquiryId: "ENQ-4013", title: "First call to Amit Jadhav", kind: "Call", due: iso(5, 10), missed: true, done: false },
  { id: "T8", enquiryId: "ENQ-4008", title: "Send EMI plan to Deepak Joshi", kind: "Follow up", due: iso(2, 12), missed: true, done: false },
  { id: "T9", enquiryId: "ENQ-4011", title: "Check back with Farhan Ali", kind: "Follow up", due: iso(1, 11), missed: true, done: false },
  { id: "T10", enquiryId: "ENQ-4004", title: "Plan delivery for Pooja Deshmukh", kind: "Delivery", due: iso(1, 15), missed: true, done: false },
];

export const APPROVALS: Approval[] = [
  { id: "AP1", agentId: "meera", useCase: 2, title: "Reschedule test ride: Imran Shaikh", detail: "Missed yesterday. Proposes Sat 11 AM or Sat 4 PM at the dealership. Re-scored from Warm 58 to Warm 62 if confirmed.", enquiryId: "ENQ-4003", state: "pending" },
  { id: "AP2", agentId: "meera", useCase: 4, title: "Assign Kavita More (Hot, 88)", detail: "Unassigned for 3 hours. Suggests Aveg Patekar (EV consultant, 2 open Hot leads).", enquiryId: "ENQ-4012", state: "pending" },
  { id: "AP3", agentId: "maheb", useCase: 2, title: "Send EMI plan and payment link: Deepak Joshi", detail: "TVS X, 36-month plan, ₹7,980 per month. Pre-approved limit not yet checked.", enquiryId: "ENQ-4008", state: "pending" },
  { id: "AP4", agentId: "arjun", useCase: 13, title: "Upgrade enquiry created: Vijay Patil", detail: "Month 30, 41,200 km. Offer: iQube S 4.7 kWh with exchange.", enquiryId: "ENQ-4005", state: "pending" },
];

const tl = (a: string, c: string) => [{ who: "agent" as const, text: a }, { who: "customer" as const, text: c }];

export const CALLS: CallRecord[] = [
  { id: "C101", agentId: "meera", ts: iso(0, 9, 12), customer: "Rohan Mehta", phone: "+91 98220 41107", channel: "Chat", type: "Qualification", outcome: "Positive", durationSec: 372, nextAction: "Call before 4 PM", nextOwner: "Aveg Patekar", useCase: 1, enquiryId: "ENQ-4001", summary: "Qualified a web chat lead. Recommended iQube 3.1 and 3.5 kWh. Test ride and EMI requested.", captured: [{ k: "Daily distance", v: "38 km", quote: "about 38 km a day" }, { k: "Budget", v: "₹1.4 – 1.6 lakh" }, { k: "Timeline", v: "Within 2 weeks" }, { k: "Charging", v: "Home 15A socket" }], transcript: [...tl("Hello Rohan, I'm AI Meera from Shree Motors TVS. How can I help?", "Which iQube suits a 38 km commute?"), ...tl("The 3.1 kWh covers about 100 km real-world, so 2 to 3 days per charge.", "Can I get EMI and a test ride this weekend?")], scoreChange: { from: "Not Set", to: "Hot", factors: [{ label: "Asked for a test ride", delta: 24 }, { label: "Buying within 2 weeks", delta: 20 }] }, consent: "Recorded", costInr: 6.2, handoff: { from: "meera", to: "Aveg Patekar" } },
  { id: "C102", agentId: "meera", ts: iso(1, 18, 40), customer: "Sneha Kulkarni", phone: "+91 98900 11876", channel: "Voice", type: "Inbound", outcome: "Positive", durationSec: 241, nextAction: "Test ride tomorrow 11 AM", nextOwner: "Priya Nair", useCase: 1, enquiryId: "ENQ-4002", summary: "Inbound call on the dealer virtual number. Booked a test ride for Orbiter V2.", captured: [{ k: "Interest", v: "Orbiter V2" }, { k: "Commute", v: "18 km" }], transcript: tl("Shree Motors TVS, this is AI Meera. How may I help you?", "I want to know about the Orbiter."), consent: "Recorded", costInr: 8.4 },
  { id: "C103", agentId: "meera", ts: iso(0, 9, 30), customer: "Sneha Kulkarni", phone: "+91 98900 11876", channel: "Voice", type: "Test ride reminder", outcome: "Positive", durationSec: 58, nextAction: "None", nextOwner: "AI Meera", useCase: 2, enquiryId: "ENQ-4002", summary: "Confirmed tomorrow's test ride slot.", captured: [{ k: "Slot", v: "Tomorrow 11 AM, dealership" }], transcript: tl("Reminder: your Orbiter test ride is tomorrow at 11 AM.", "Yes, I'll be there."), consent: "Recorded", costInr: 2.0 },
  { id: "C104", agentId: "meera", ts: iso(1, 16, 5), customer: "Imran Shaikh", phone: "+91 98600 55231", channel: "Voice", type: "Test ride reminder", outcome: "No answer", durationSec: 0, nextAction: "WhatsApp sent", nextOwner: "AI Meera", useCase: 2, enquiryId: "ENQ-4003", summary: "Two attempts, no answer.", captured: [], transcript: [], consent: "Not asked", costInr: 0.4 },
  { id: "C105", agentId: "meera", ts: iso(0, 9, 40), customer: "Imran Shaikh", phone: "+91 98600 55231", channel: "WhatsApp", type: "Reminder", outcome: "Needs human", durationSec: 190, nextAction: "Approve new slots", nextOwner: "Aveg Patekar", useCase: 2, enquiryId: "ENQ-4003", summary: "Missed ride. Customer asked for Saturday. Proposed two slots for approval.", captured: [{ k: "Preferred", v: "Saturday" }], transcript: tl("Hi Imran, I noticed you could not make yesterday's ride. Saturday works?", "Yes, Saturday please."), scoreChange: { from: "Warm", to: "Warm", factors: [{ label: "Missed test ride", delta: -14 }, { label: "Replied within 2 hours", delta: 12 }] }, consent: "Recorded", costInr: 1.1, handoff: { from: "meera", to: "Aveg Patekar" } },
  { id: "C106", agentId: "meera", ts: iso(0, 7, 48), customer: "Kavita More", phone: "+91 98340 22998", channel: "WhatsApp", type: "Qualification", outcome: "Positive", durationSec: 420, nextAction: "Assign to a DSE", nextOwner: "Akshay Bhosale", useCase: 1, enquiryId: "ENQ-4012", summary: "Recommended iQube ST. Explained why Orbiter V1 is not a fit for 55 km.", captured: [{ k: "Daily distance", v: "55 km" }, { k: "Purchase", v: "Cash" }, { k: "Timeline", v: "This week" }], transcript: tl("For 55 km a day the ST 5.3 kWh is the right fit.", "Great, what's the price?"), consent: "Recorded", costInr: 4.0 },
  { id: "C107", agentId: "meera", ts: iso(2, 19, 0), customer: "Rekha Iyer", phone: "+91 98450 31001", channel: "Voice", type: "Inbound", outcome: "Neutral", durationSec: 305, nextAction: "Advice only. No follow-up calls", nextOwner: "AI Meera", useCase: 1, enquiryId: "ENQ-4016", summary: "Just looking. Shared advice, no follow-up.", captured: [{ k: "Commute", v: "6 km" }], transcript: tl("A 2.3 kWh is plenty for 6 km.", "Thanks, I'm only exploring."), consent: "Recorded", costInr: 6.0 },
  { id: "C108", agentId: "meera", ts: iso(12, 14, 10), customer: "Anita Rao", phone: "+91 98500 66120", channel: "Chat", type: "Qualification", outcome: "Neutral", durationSec: 180, nextAction: "Do not call", nextOwner: "Rahul Shinde", useCase: 1, enquiryId: "ENQ-4006", summary: "Opted out of calls.", captured: [], transcript: tl("May I call you to follow up?", "Please don't call me."), consent: "Opted out", costInr: 2.0 },
  { id: "C109", agentId: "maheb", ts: iso(0, 9, 55), customer: "Rohan Mehta", phone: "+91 98220 41107", channel: "Chat", type: "Inbound", outcome: "Positive", durationSec: 95, nextAction: "Finance check by DSE", nextOwner: "Aveg Patekar", useCase: 2, enquiryId: "ENQ-4001", summary: "Shared EMI options for 3.1 and 3.5 kWh.", captured: [{ k: "Down payment", v: "₹30,000" }, { k: "Tenure", v: "36 months" }], transcript: tl("36 months at ₹4,120 a month for the 3.1 kWh.", "Okay, send me the plan."), consent: "Recorded", costInr: 1.2 },
  { id: "C110", agentId: "arjun", ts: iso(0, 8, 0), customer: "Vijay Patil", phone: "+91 98810 23390", channel: "WhatsApp", type: "Upgrade offer", outcome: "Positive", durationSec: 130, nextAction: "Call about exchange", nextOwner: "Sandeep Kulkarni", useCase: 13, enquiryId: "ENQ-4005", summary: "Month-30 upgrade offer. Customer tapped Interested.", captured: [{ k: "Odometer", v: "41,200 km" }], transcript: tl("You have 6 months of battery warranty left. Want to see an S 4.7 kWh offer?", "Yes, show me."), scoreChange: { from: "Not Set", to: "Warm", factors: [{ label: "30 of 36 warranty months used", delta: 22 }, { label: "High mileage", delta: 18 }] }, consent: "Recorded", costInr: 1.0, handoff: { from: "arjun", to: "Sandeep Kulkarni" } },
  { id: "C111", agentId: "arjun", ts: iso(0, 9, 5), customer: "Latha Menon", phone: "+91 98330 11004", channel: "Voice", type: "Feedback", outcome: "Positive", durationSec: 210, nextAction: "None", nextOwner: "AI Mansi", useCase: 16, summary: "Post-delivery feedback call. Happy, mild complaint about charger cable length.", captured: [{ k: "Sentiment", v: "Positive" }, { k: "Issue", v: "Charger cable short" }], transcript: tl("How has your first week with the iQube been?", "Very good, but the charger cable is a bit short."), consent: "Recorded", costInr: 9.5 },
  { id: "C112", agentId: "arjun", ts: iso(0, 9, 20), customer: "Mohan Gupta", phone: "+91 98330 20120", channel: "Voice", type: "Feedback", outcome: "Needs human", durationSec: 260, nextAction: "Call back about range issue", nextOwner: "Akshay Bhosale", useCase: 16, summary: "Unhappy about range. Early alert raised for the manager.", captured: [{ k: "Sentiment", v: "Negative" }, { k: "Issue", v: "Range lower than promised" }], transcript: tl("Is everything fine with your scooter?", "Range is much lower than the showroom said."), consent: "Recorded", costInr: 10.8, handoff: { from: "arjun", to: "Akshay Bhosale" } },
  { id: "C113", agentId: "arjun", ts: iso(1, 11, 0), customer: "Prakash Rane", phone: "+91 98330 20001", channel: "Voice", type: "Health outreach", outcome: "Positive", durationSec: 120, nextAction: "Service booked Thursday", nextOwner: "AI Sagar", useCase: 9, summary: "Alerted about battery drift. Customer agreed to service.", captured: [{ k: "Alert", v: "Battery 14% below similar vehicles" }], transcript: tl("Your battery is drifting lower than similar iQubes. Shall I book a check?", "Yes, Thursday."), consent: "Recorded", costInr: 5.0, handoff: { from: "arjun", to: "AI Sagar" } },
  { id: "C114", agentId: "arjun", ts: iso(0, 10, 10), customer: "Sunil Wagh", phone: "+91 98330 99111", channel: "Voice", type: "Upgrade offer", outcome: "No answer", durationSec: 0, nextAction: "Retry tomorrow", nextOwner: "AI Arjun", useCase: 13, summary: "No answer.", captured: [], transcript: [], consent: "Not asked", costInr: 0.4 },
  { id: "C115", agentId: "sagar", ts: iso(0, 8, 30), customer: "Prakash Rane", phone: "+91 98330 20001", channel: "WhatsApp", type: "Service booking", outcome: "Positive", durationSec: 340, nextAction: "Advisor to approve estimate", nextOwner: "Rohit Pawar", useCase: 10, summary: "Booked a service from a voice note and built the job card.", captured: [{ k: "Issue", v: "Battery drift, creaking sound" }, { k: "Slot", v: "Thu 10 AM" }], transcript: tl("Tell me what you've noticed.", "[Voice note, Marathi] बॅटरी लवकर उतरते."), consent: "Recorded", costInr: 3.1, handoff: { from: "sagar", to: "Rohit Pawar" } },
  { id: "C116", agentId: "sagar", ts: iso(1, 15, 0), customer: "Pune Fleet Co", phone: "+91 98330 12001", channel: "Chat", type: "Health outreach", outcome: "Positive", durationSec: 80, nextAction: "Fleet service camp", nextOwner: "Rohit Pawar", useCase: 9, summary: "Fleet alert for 5 vehicles.", captured: [{ k: "Vehicles", v: "5 above 40,000 km" }], transcript: [], consent: "Recorded", costInr: 1.0 },
  { id: "C117", agentId: "mansi", ts: iso(0, 9, 0), customer: "Claim WC-7102", phone: "", channel: "Chat", type: "Claim review", outcome: "Positive", durationSec: 45, nextAction: "Auto-approve; L1 to confirm", nextOwner: "Meenal Rao", useCase: 14, summary: "Confidence 96. Failure matches wear pattern, in warranty, all evidence attached.", captured: [], transcript: [], consent: "Not asked", costInr: 0.3 },
  { id: "C118", agentId: "mansi", ts: iso(0, 9, 5), customer: "Claim WC-7104", phone: "", channel: "Chat", type: "Claim review", outcome: "Needs human", durationSec: 60, nextAction: "Human review", nextOwner: "Meenal Rao", useCase: 14, summary: "Confidence 58. Photo is blurry and part serial differs.", captured: [], transcript: [], consent: "Not asked", costInr: 0.3 },
  { id: "C119", agentId: "mansi", ts: iso(0, 9, 10), customer: "VoC weekly batch", phone: "", channel: "Chat", type: "VoC analysis", outcome: "Positive", durationSec: 120, nextAction: "Alert raised: range complaints up 18%", nextOwner: "Vikram Iyer", useCase: 16, summary: "Analysed 140 feedback items. Range complaints rising in Pune on iQube 3.1.", captured: [], transcript: [], consent: "Not asked", costInr: 2.0, handoff: { from: "mansi", to: "Vikram Iyer" } },
  { id: "C120", agentId: "meera", ts: iso(0, 10, 2), customer: "Nilesh Kamble", phone: "+91 98230 12090", channel: "Voice", type: "Qualification", outcome: "Needs human", durationSec: 70, nextAction: "DSE to capture budget", nextOwner: "Aveg Patekar", useCase: 4, enquiryId: "ENQ-4015", summary: "Customer declined to share budget. Limited-data score.", captured: [{ k: "Interest", v: "iQube 3.1 kWh" }], transcript: tl("Could I ask your budget?", "I'd rather discuss that in the showroom."), consent: "Recorded", costInr: 2.8 },
];

export const LIVE_SCRIPT = {
  agentId: "meera" as const,
  customer: "Aarti Phadke",
  phone: "+91 98220 77003",
  channel: "Voice" as const,
  type: "Inbound" as const,
  steps: [
    { at: 0, line: { who: "agent" as const, text: "Shree Motors TVS, this is AI Meera. How may I help you?" } },
    { at: 3, line: { who: "customer" as const, text: "I want an electric scooter for my daughter, around 15 km a day." }, field: { k: "Daily distance", v: "15 km" } },
    { at: 7, line: { who: "agent" as const, text: "For 15 km, the Orbiter V2 or iQube 2.3 kWh both work. What is your budget?" } },
    { at: 11, line: { who: "customer" as const, text: "About a lakh and ten thousand." }, field: { k: "Budget", v: "~₹1.1 lakh" } },
    { at: 15, line: { who: "agent" as const, text: "Orbiter V2 fits. May I record this call and arrange a test ride?" } },
    { at: 19, line: { who: "customer" as const, text: "Yes, Saturday morning." }, field: { k: "Consent", v: "Recorded" } },
  ],
};
