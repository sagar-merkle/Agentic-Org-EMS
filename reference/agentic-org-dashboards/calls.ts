import type { AgentId, CallType, Captured, Line, Outcome } from "./types";
import { OUTCOME } from "./labels";
import { AGENTS } from "./people";

export type CallCtx = {
  first: string;
  product?: string;
  slot?: string;
  vehicle?: string;
  budget?: string;
  emi?: string;
  daily?: number;
  lender?: string;
  rating?: number;
  job?: string;
};

export type CallContent = {
  summary: string[];
  captured: Captured[];
  transcript: Line[];
  nextAction: string;
  sentiment: "positive" | "neutral" | "negative";
};

type Turn = ["a" | "c", string];

function lines(turns: Turn[]): Line[] {
  let t = 2;
  return turns.map(([who, text]) => {
    const line: Line = { who: who === "a" ? "agent" : "customer", text, t };
    t += Math.max(3, Math.round(text.length / 14));
    return line;
  });
}

const intro = (agent: AgentId, first: string, about: string): Turn =>
  ["a", `Hi ${first}, this is ${AGENTS[agent].name}, an AI assistant from TVS Kothrud, calling about ${about}. This call may be recorded. Is now a good time?`];

export const NOT_REACHED: Outcome[] = ["no_answer", "busy", "switched_off", "wrong_number", "dnd"];

export function callContent(type: CallType, agent: AgentId, outcome: Outcome, c: CallCtx): CallContent {
  if (NOT_REACHED.includes(outcome)) {
    const dnd = outcome === "dnd";
    return {
      summary: dnd
        ? ["Number is on the DND registry", "No further calls will be placed"]
        : [`${OUTCOME[outcome].label}, no conversation`, outcome === "wrong_number" ? "Number flagged for correction" : "Retry scheduled automatically"],
      captured: [],
      transcript: [],
      nextAction: dnd ? "Do not call. Use WhatsApp opt-in only" : outcome === "wrong_number" ? "Verify number with the lead source" : "Retry at 18:30",
      sentiment: "neutral",
    };
  }

  const p = c.product ?? "the scooter";
  switch (type) {
    case "discovery":
    case "follow_up": {
      const booked = outcome === "test_ride_booked";
      const no = outcome === "not_interested" || outcome === "bought_elsewhere";
      const turns: Turn[] = [
        intro(agent, c.first, type === "discovery" ? `your enquiry for the ${p}` : `the ${p} you looked at`),
        ["c", "Yes, go ahead. I'm comparing a few electric scooters."],
        ["a", "What will you mostly use it for, and how far do you ride on a normal day?"],
        ["c", `Office commute mostly. About ${c.daily ?? 25} kilometres a day.`],
        ["a", "Got it. And roughly what budget did you have in mind?"],
        ["c", `Around ${c.budget ?? "one and a quarter lakh"}. I'd want to keep the EMI low.`],
      ];
      if (booked)
        turns.push(
          ["a", `The ${p} covers about three days of your riding on one charge. Would you like to ride it this weekend?`],
          ["c", `Sure, ${c.slot ?? "Saturday morning"} works.`],
          ["a", `Booked for ${c.slot ?? "Saturday 11:00"} at TVS Kothrud. You'll get a WhatsApp confirmation.`],
        );
      else if (no)
        turns.push(
          ["c", outcome === "bought_elsewhere" ? "Actually I already booked an Ather last week." : "I think I'll hold off for now, thanks."],
          ["a", "No problem at all. Thanks for your time, and do reach out whenever you're ready."],
        );
      else if (outcome === "callback")
        turns.push(["c", "Can you call me back in the evening? I'm driving."], ["a", "Of course, I'll call you at 7 pm."]);
      else turns.push(["a", `The ${p} fits that well. Shall I share the price breakup on WhatsApp?`], ["c", "Yes, please send it."]);
      return {
        summary: booked
          ? [`Commute about ${c.daily ?? 25} km/day, budget ${c.budget ?? "≈ ₹1.25 L"}`, `Test ride booked: ${c.slot ?? "Sat 11:00"}`, "Prefers low EMI"]
          : no
            ? [OUTCOME[outcome].label, "Closed politely, no follow-up pushed"]
            : [`Commute about ${c.daily ?? 25} km/day`, `Budget ${c.budget ?? "≈ ₹1.25 L"}`, outcome === "callback" ? "Asked for an evening callback" : "Price breakup sent on WhatsApp"],
        captured: [
          { field: "Daily distance", value: `${c.daily ?? 25} km`, quote: `About ${c.daily ?? 25} kilometres a day.` },
          { field: "Budget", value: c.budget ?? "≈ ₹1.25 L", quote: `Around ${c.budget ?? "one and a quarter lakh"}.` },
          { field: "Use", value: "Office commute", quote: "Office commute mostly." },
          ...(booked ? [{ field: "Test ride", value: c.slot ?? "Sat 11:00", quote: `${c.slot ?? "Saturday morning"} works.` }] : []),
        ],
        transcript: lines(turns),
        nextAction: booked ? `Sales exec to meet at test ride (${c.slot ?? "Sat 11:00"})` : no ? "Mark lost" : outcome === "callback" ? "Meera to call back at 19:00" : "Follow up in 2 days",
        sentiment: no ? "negative" : booked ? "positive" : "neutral",
      };
    }
    case "ride_reminder":
      return {
        summary: [`Confirmed test ride ${c.slot ?? "tomorrow"}`, "Reminded to bring driving licence"],
        captured: [{ field: "Test ride", value: `Confirmed ${c.slot ?? ""}`.trim(), quote: "Yes, I'll be there." }],
        transcript: lines([
          intro(agent, c.first, `your ${p} test ride`),
          ["c", "Yes, tell me."],
          ["a", `Just confirming your ride ${c.slot ?? "tomorrow"}. Please bring your driving licence.`],
          ["c", "Yes, I'll be there."],
        ]),
        nextAction: "Sales exec to host the ride",
        sentiment: "positive",
      };
    case "debrief": {
      const no = outcome === "not_interested";
      return {
        summary: no
          ? ["Did not like the ride feel", "Closed politely"]
          : ["Liked the ride and the boot space", "Unsure about range in Power mode", outcome === "escalated" ? "Wants to negotiate price with a person" : "Open to finance options"],
        captured: [{ field: "Impression", value: no ? "Negative" : "Positive", quote: no ? "It felt a bit slow for me." : "Ride was smooth, really comfortable." }],
        transcript: lines([
          intro(agent, c.first, `your test ride of the ${p}`),
          ["c", "Sure."],
          ["a", "How did the ride feel?"],
          ["c", no ? "It felt a bit slow for me." : "Ride was smooth, really comfortable. Range dropped a bit fast in Power mode though."],
          ["a", no ? "Thanks for trying it. I'll note that." : "That's normal in Power mode; Eco gets you the full range. Shall I ask our finance team to share EMI options?"],
          ["c", no ? "Okay, thanks." : outcome === "escalated" ? "I'd rather talk price with someone at the showroom." : "Yes, please."],
        ]),
        nextAction: no ? "Mark lost" : outcome === "escalated" ? "Sales exec to call about price" : "Maheb: finance options call",
        sentiment: no ? "negative" : "positive",
      };
    }
    case "finance":
      return {
        summary: [
          `Shared 3 EMI options for ${p}`,
          `Lowest: ${c.emi ?? "₹3,600/mo"} with ${c.lender ?? "TVS Credit"}, 36 months`,
          outcome === "escalated" ? "Asked for a better price before booking" : "Comfortable with the EMI",
        ],
        captured: [
          { field: "EMI comfort", value: c.emi ?? "≤ ₹4,000/mo", quote: "As long as it's under four thousand a month." },
          { field: "Preferred lender", value: c.lender ?? "TVS Credit", quote: `${c.lender ?? "TVS Credit"} sounds fine.` },
        ],
        transcript: lines([
          intro(agent, c.first, `finance options for the ${p}`),
          ["c", "Yes, I was waiting for this."],
          ["a", `With ₹15,000 down, the lowest EMI is ${c.emi ?? "about ₹3,600"} a month for 36 months with ${c.lender ?? "TVS Credit"}.`],
          ["c", "As long as it's under four thousand a month."],
          ["a", "It is. Shall I lock this structure?"],
          ["c", outcome === "escalated" ? "If you can do a little on the price, I'll book today." : `${c.lender ?? "TVS Credit"} sounds fine.`],
        ]),
        nextAction: outcome === "escalated" ? "Approval: extra discount to close today" : "Collect documents, book",
        sentiment: "positive",
      };
    case "owner_checkin": {
      const yes = outcome === "interested";
      return {
        summary: yes
          ? [`${c.vehicle ?? "Petrol scooter"} running well, fuel ≈ ₹1,800/month`, "Agreed to a call about electric scooters", "Consent recorded"]
          : [`${c.vehicle ?? "Petrol scooter"} running fine`, outcome === "callback" ? "Asked to talk next week" : "Not interested in switching"],
        captured: [
          { field: "Fuel spend", value: "≈ ₹1,800/month", quote: "Petrol is about eighteen hundred a month." },
          { field: "EV call consent", value: yes ? "Yes" : "No", quote: yes ? "Sure, have someone call me." : "Not right now." },
        ],
        transcript: lines([
          intro(agent, c.first, `your ${c.vehicle ?? "scooter"}`),
          ["c", "Yes, okay."],
          ["a", "How is the scooter running, and roughly what do you spend on petrol each month?"],
          ["c", "Running fine. Petrol is about eighteen hundred a month."],
          ["a", "Would you like someone to call you about switching to electric? It could save most of that."],
          ["c", yes ? "Sure, have someone call me." : "Not right now."],
        ]),
        nextAction: yes ? "Send to sales: EV conversation" : outcome === "callback" ? "Arjun to call next week" : "No action",
        sentiment: yes ? "positive" : "neutral",
      };
    }
    case "accessories": {
      const yes = outcome === "interested";
      return {
        summary: yes ? ["Accepted helmet + top box bundle", "Declined spare charger"] : ["Declined accessories for now"],
        captured: [{ field: "Accessories", value: yes ? "Helmet, top box" : "None", quote: yes ? "Helmet and the top box, yes." : "Not now, thanks." }],
        transcript: lines([
          intro(agent, c.first, `your new ${p}`),
          ["c", "Yes."],
          ["a", "Before delivery, would you like a helmet and a 30 litre top box fitted? Both suit your commute."],
          ["c", yes ? "Helmet and the top box, yes." : "Not now, thanks."],
        ]),
        nextAction: yes ? "Add to delivery job card" : "No action",
        sentiment: yes ? "positive" : "neutral",
      };
    }
    case "insurance":
      return {
        summary: outcome === "interested" ? ["Renewal quote accepted", "Payment link sent"] : ["Renewal reminder given", OUTCOME[outcome].label],
        captured: [{ field: "Renewal", value: outcome === "interested" ? "Accepted" : "Pending" }],
        transcript: lines([
          intro(agent, c.first, "your insurance renewal"),
          ["c", "Oh yes, it's due soon."],
          ["a", "I can renew it today with your no-claim bonus intact. Shall I send the link?"],
          ["c", outcome === "interested" ? "Yes, send it." : "Call me later this week."],
        ]),
        nextAction: outcome === "interested" ? "Track payment" : "Arjun to call later this week",
        sentiment: "neutral",
      };
    case "service_reminder":
      return {
        summary: outcome === "service_booked" ? [`Service booked ${c.slot ?? "tomorrow 10:00"}`, "Pickup requested"] : [OUTCOME[outcome].label, "Will remind again"],
        captured: outcome === "service_booked" ? [{ field: "Slot", value: c.slot ?? "Tomorrow 10:00", quote: "Tomorrow morning is fine." }, { field: "Pickup", value: "Yes", quote: "Please pick it up." }] : [],
        transcript: lines([
          intro(agent, c.first, `your ${c.vehicle ?? "scooter"} service`),
          ["c", "Yes."],
          ["a", "Your service is due. Shall I book a slot, with free pickup?"],
          ["c", outcome === "service_booked" ? "Tomorrow morning is fine. Please pick it up." : outcome === "callback" ? "Call me next week." : "I'll get it done elsewhere."],
        ]),
        nextAction: outcome === "service_booked" ? "Schedule pickup" : "Remind in 7 days",
        sentiment: outcome === "service_booked" ? "positive" : "neutral",
      };
    case "vehicle_ready":
      return {
        summary: ["Shared work summary", "Drop-off confirmed for this evening"],
        captured: [{ field: "Drop-off", value: "Today 18:30", quote: "Evening drop is perfect." }],
        transcript: lines([
          intro(agent, c.first, `your ${c.vehicle ?? "scooter"}`),
          ["c", "Is it ready?"],
          ["a", `Yes. ${c.job ?? "Service"} is done, no extra work needed. Can we drop it at 6:30 this evening?`],
          ["c", "Evening drop is perfect."],
        ]),
        nextAction: "Drop at 18:30",
        sentiment: "positive",
      };
    case "feedback": {
      const r = c.rating ?? 5;
      return {
        summary: [`Rated ${r}/5`, r <= 3 ? "Unhappy: escalated to the service advisor" : "Happy with pickup and drop"],
        captured: [{ field: "Rating", value: `${r}/5`, quote: r <= 3 ? "Honestly, it came back late." : "Very smooth, thank you." }],
        transcript: lines([
          intro(agent, c.first, "your recent service"),
          ["c", "Sure."],
          ["a", "On a scale of one to five, how was the service?"],
          ["c", r <= 3 ? `${r}. Honestly, it came back late.` : `${r}. Very smooth, thank you.`],
          ["a", r <= 3 ? "I'm sorry. I'm asking our service advisor to call you today." : "Glad to hear it. Thanks!"],
        ]),
        nextAction: r <= 3 ? "Service advisor to call back today" : "None",
        sentiment: r <= 3 ? "negative" : "positive",
      };
    }
  }
}
