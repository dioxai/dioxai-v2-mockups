// Pre-baked examples — used when user clicks "try this one" AND as fallback when API is unreachable.
window.WB_EXAMPLES = [
  {
    prompt: "Real estate agent gets a Zillow lead → manually researches the property and buyer → calls back 2 hours later → most leads ghost because someone else already called them.",
    result: {
      currentSteps: [
        { id: "m1", label: "Zillow lead lands in inbox", type: "notification", timeMinutes: 0 },
        { id: "m2", label: "Agent eventually notices the email", type: "manual", timeMinutes: 45, painPoint: "Avg 45 min before anyone looks" },
        { id: "m3", label: "Pull up MLS, Zillow, social to research", type: "manual", timeMinutes: 12, painPoint: "Tab-juggling, no consolidated view" },
        { id: "m4", label: "Draft talking points in notes app", type: "manual", timeMinutes: 6 },
        { id: "m5", label: "Call back — voicemail", type: "manual", timeMinutes: 4, painPoint: "Competitor already called 90 min ago" },
        { id: "m6", label: "Lead goes cold", type: "manual", timeMinutes: 0, painPoint: "~70% ghost rate" }
      ],
      automatedSteps: [
        { id: "a1", label: "Zillow lead hits webhook", type: "integration", timeMinutes: 0 },
        { id: "a2", label: "AI qualifier scores intent & budget fit", type: "ai", timeMinutes: 0.2 },
        { id: "a3", label: "Auto-enrich: property comps, owner data, social", type: "ai", timeMinutes: 0.3 },
        { id: "a4", label: "Talking-points brief delivered to agent's phone", type: "notification", timeMinutes: 0.1 },
        { id: "a5", label: "Agent calls back within 60 seconds — armed", type: "manual", timeMinutes: 4 }
      ],
      hoursPerWeekSaved: 14,
      dollarsPerMonthSaved: 9200
    }
  },
  {
    prompt: "Med spa gets a DM at 11pm — no one sees it until 9am — client has already booked at a competitor.",
    result: {
      currentSteps: [
        { id: "m1", label: "Instagram DM arrives at 11:14pm", type: "notification", timeMinutes: 0 },
        { id: "m2", label: "No one on staff after hours", type: "manual", timeMinutes: 600, painPoint: "10+ hours of silence" },
        { id: "m3", label: "Front desk skims DMs in the morning", type: "manual", timeMinutes: 15, painPoint: "Buried under 40 other messages" },
        { id: "m4", label: "Reply 'Hi! Want to book a consult?'", type: "manual", timeMinutes: 3 },
        { id: "m5", label: "Client has already booked competitor", type: "manual", timeMinutes: 0, painPoint: "~55% of after-hours DMs lost" }
      ],
      automatedSteps: [
        { id: "a1", label: "DM hits AI concierge instantly", type: "integration", timeMinutes: 0 },
        { id: "a2", label: "AI answers questions, qualifies treatment", type: "ai", timeMinutes: 0.5 },
        { id: "a3", label: "Books appointment in your calendar", type: "integration", timeMinutes: 0.2 },
        { id: "a4", label: "SMS confirmation + intake form sent", type: "notification", timeMinutes: 0.1 },
        { id: "a5", label: "Staff sees booked appt at 9am — done", type: "manual", timeMinutes: 0 }
      ],
      hoursPerWeekSaved: 9,
      dollarsPerMonthSaved: 6800
    }
  },
  {
    prompt: "Law firm gets an intake call — partner spends 45 min on a $0 conversation — 60% of callers don't actually sign.",
    result: {
      currentSteps: [
        { id: "m1", label: "Prospect calls main line", type: "notification", timeMinutes: 0 },
        { id: "m2", label: "Receptionist routes to partner", type: "manual", timeMinutes: 3, painPoint: "No screening, no conflict check" },
        { id: "m3", label: "Partner takes intake call cold", type: "manual", timeMinutes: 45, painPoint: "$650/hr time spent unqualified" },
        { id: "m4", label: "Hand-write notes, find matter template", type: "manual", timeMinutes: 15 },
        { id: "m5", label: "Email follow-up + retainer agreement", type: "manual", timeMinutes: 10 },
        { id: "m6", label: "60% never sign — billable time lost", type: "manual", timeMinutes: 0, painPoint: "~3 wasted partner hours/day" }
      ],
      automatedSteps: [
        { id: "a1", label: "Call routes to AI intake agent", type: "ai", timeMinutes: 8 },
        { id: "a2", label: "Conflict check runs against Clio in real time", type: "integration", timeMinutes: 0.2 },
        { id: "a3", label: "Matter brief + risk score auto-drafted", type: "ai", timeMinutes: 0.5 },
        { id: "a4", label: "Brief lands in partner's inbox", type: "notification", timeMinutes: 0.1 },
        { id: "a5", label: "Partner reviews qualified leads only — calls back", type: "manual", timeMinutes: 12 }
      ],
      hoursPerWeekSaved: 18,
      dollarsPerMonthSaved: 23400
    }
  }
];
