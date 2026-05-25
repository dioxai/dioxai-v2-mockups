// Industry routing data — 2026 Diox pricing, RANGE-BASED visibility (Layer 1).
// Detailed tier pricing lives in the chatbot system prompt (Layer 2).
// Exact quote requires Discovery Call (Layer 3).
//
// Icons: inline SVGs (Lucide-inspired, 1.4px stroke, currentColor). Editorial,
// professional — no emoji. Each icon is a 28×28 viewbox.
const ICON = {
  healthcare: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v20M4 14h20"/><circle cx="14" cy="14" r="11"/></svg>',
  realestate_brokerage: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13 14 4l11 9"/><path d="M5 12v12h18V12"/><path d="M11 24v-7h6v7"/></svg>',
  realestate_investor: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 24V8l8-4 8 4v16"/><path d="M20 13h4v11h-4"/><path d="M8 14h2M8 18h2M14 14h2M14 18h2"/><path d="M4 24h20"/></svg>',
  entertainment: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22V6l12-2v16"/><circle cx="7" cy="22" r="3"/><circle cx="19" cy="20" r="3"/></svg>',
  ecommerce: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h3l2.5 13h13L23 9H7"/><circle cx="10" cy="23" r="1.5"/><circle cx="20" cy="23" r="1.5"/></svg>',
  law: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v20M7 24h14"/><path d="M14 6 6 10l3 6c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5L14 6Z"/><path d="M14 6l8 4-3 6c0 1.5-1.5 2.5-3 2.5s-3-1-3-2.5L14 6Z"/></svg>',
  accounting: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="18" height="22" rx="2"/><path d="M9 8h10M9 12h10M9 16h6M16 20h3"/></svg>',
  medspa: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4c2 4 6 6 6 10s-2.5 8-6 8-6-4-6-8 4-6 6-10Z"/><path d="M14 14v8"/></svg>',
  auto: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h22M5 18l2-7h14l2 7M5 18v3h3v-3M20 18v3h3v-3"/><circle cx="9" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></svg>',
  construction: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 6-6 4 4 12-12"/><path d="m17 7 8 0 0 8"/><path d="M3 25h22"/></svg>',
  restaurant: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v10a3 3 0 0 0 6 0V3M10 13v12"/><path d="M20 3c-2 0-3 3-3 7s1 5 3 5v10"/></svg>',
  other: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v6M14 19v6M3 14h6M19 14h6M6 6l4 4M18 18l4 4M22 6l-4 4M10 18l-4 4"/></svg>'
};

const INDUSTRIES = {
  healthcare: {
    label: "Healthcare / Medical Practice",
    icon: ICON.healthcare,
    tag: "Healthcare",
    headline: "Your front desk is drowning. <em>AI can answer the phone before it rings twice.</em>",
    lede: "We build HIPAA-aware voice + intake agents that book appointments, route urgent calls, and stop the no-show spiral — without replacing your staff.",
    pains: [
      "After-hours and overflow patient calls go to voicemail — and never call back",
      "Manual insurance verification and intake forms eat hours per provider per week",
      "No-show rates above 18% kill margin on every fee-for-service visit"
    ],
    caseClient: "Multi-clinic injury practice, DFW (in progress)",
    caseResult: "4-phase rollout: discovery → pilot → refine → 7-clinic scale.",
    caseDesc: "Custom patient-flow + staff-workflow system, HIPAA-ready from day one. Days/weeks delivery, not months.",
    pricingRange: "Most engagements: $30K – $120K",
    pricingFootnote: "Pilots from $4.5K · multi-site platforms $150K+ · plus $3K–$6K/mo per clinic"
  },
  realestate_brokerage: {
    label: "Real Estate — Brokerage / Agent",
    icon: ICON.realestate_brokerage,
    tag: "Brokerage",
    headline: "Leads die in 5 minutes. <em>Yours should be qualified in 30 seconds.</em>",
    lede: "We build the lead-qualification layer that sits between Zillow/portal forms and your agents — so the warm ones get a call back instantly and the tire-kickers get nurtured.",
    pains: [
      "Agents waste 60% of their day on leads that were never going to close",
      "Portal leads ghost within 8 minutes if no human responds",
      "Listing prep, MLS copy, and follow-up sequences are pure agent-time tax"
    ],
    caseClient: "Boutique brokerage, growth-mode",
    caseResult: "Custom GPT qualifier + Twilio voice + CRM webhook stack.",
    caseDesc: "Agents see only A-tier leads. Built end-to-end in weeks, not months.",
    pricingRange: "Most engagements: $12K – $40K",
    pricingFootnote: "Starter voice + CRM from $8K · brokerage-wide platforms $75K+"
  },
  realestate_investor: {
    label: "Real Estate — Investor / Property Manager",
    icon: ICON.realestate_investor,
    tag: "Investor & PM",
    headline: "Your portfolio doesn't sleep. <em>Your back office shouldn't have to either.</em>",
    lede: "We build the admin spine investors and PMs actually need — tenant intake & screening, rent + maintenance workflows, document handling, deal underwriting, and the custom app that ties it all together when QuickBooks + Stessa + AppFolio stop being enough.",
    pains: [
      "Tenant communication, maintenance triage, and rent chasing are still manual at scale",
      "Deal underwriting and acquisition analysis live in spreadsheets that don't talk to each other",
      "Off-the-shelf PM software boxes you in — you want a system shaped to YOUR portfolio"
    ],
    caseClient: "Multi-property investor portfolios",
    caseResult: "Custom admin app + automation stack tailored to your acquisition + holding strategy.",
    caseDesc: "AI agents handle inbound tenant comms, maintenance routing, and deal-flow triage. Full app builds available for portfolios that have outgrown SaaS.",
    pricingRange: "Most engagements: $25K – $90K",
    pricingFootnote: "Workflow automations from $5K · full investor/PM platforms $150K+"
  },
  entertainment: {
    label: "Entertainment / Events",
    icon: ICON.entertainment,
    tag: "Entertainment & Events",
    headline: "Booking inquiries spike at midnight. <em>Your AI handles them before brunch.</em>",
    lede: "We build booking concierges for venues, talent, and event producers — qualifying date, budget, and headcount in conversation, then slotting confirmed inquiries onto a real calendar.",
    pains: [
      "70% of inquiries arrive outside business hours and bounce to competitors",
      "Junior staff burn out triaging 'how much for a Saturday?' emails",
      "No clean way to A/B test pricing tiers or upsell production add-ons"
    ],
    caseClient: "Luxury private-event entertainer (in progress)",
    caseResult: "Cinematic site + booking concierge + voice agent build underway.",
    caseDesc: "Conversational concierge across SMS, IG DM, and web. Routes hot leads to humans only when ready.",
    pricingRange: "Most engagements: $15K – $50K",
    pricingFootnote: "Website-only from $6.5K · multi-venue platforms $80K+"
  },
  ecommerce: {
    label: "E-commerce / Retail",
    icon: ICON.ecommerce,
    tag: "E-commerce",
    headline: "Your support inbox is a margin killer. <em>Let an agent close 80% of it.</em>",
    lede: "We build product-aware support + recovery agents that handle WISMO, sizing, returns, and abandoned-cart rescue — trained on YOUR catalog, not a generic LLM.",
    pains: [
      "Support headcount scales linearly with revenue — that's a broken model",
      "Abandoned cart sequences are still generic 'come back!' emails in 2026",
      "Returns/exchanges eat 22% of operator time and tank CSAT"
    ],
    caseClient: "DTC brands at scale",
    caseResult: "Shopify + Gorgias-grade deep integration. Agent knows every SKU, variant, and policy.",
    caseDesc: "Custom-built, not configured. Agent is yours to own.",
    pricingRange: "Most engagements: $15K – $50K",
    pricingFootnote: "Support agent from $8.5K · Shopify Plus deep integrations $80K+"
  },
  law: {
    label: "Legal / Law Firms",
    icon: ICON.law,
    tag: "Legal",
    headline: "Your billable hour shouldn't be spent on intake. <em>Automate the front of the funnel.</em>",
    lede: "We build intake and conflict-check agents for law firms — capturing matter details, running preliminary checks, and prepping a partner-ready brief before the consult.",
    pains: [
      "Partners doing $400/hr intake calls is malpractice on your own P&L",
      "Conflict checks across multiple matter management systems are still manual",
      "Cold inbound leaves money on the table — firms answer in days, not minutes"
    ],
    caseClient: "Litigation and boutique firms",
    caseResult: "Custom intake agent + Clio integration + secure document handoff.",
    caseDesc: "SOC-friendly logging from day one. Discovery-call ready briefs in your inbox.",
    pricingRange: "Most engagements: $18K – $60K",
    pricingFootnote: "Intake agent from $10.5K · AmLaw-grade platforms $100K+"
  },
  accounting: {
    label: "Accounting / Bookkeeping / Tax",
    icon: ICON.accounting,
    tag: "Accounting & Finance",
    headline: "Your team should review work — not chase documents. <em>Let agents handle the chase.</em>",
    lede: "We build client-document collection, categorization, and reconciliation agents for accounting and tax firms — so your staff opens a clean folder, not an email war.",
    pains: [
      "Tax season hinges on chasing 1099s, statements, and receipts that show up half-named",
      "Re-keying QuickBooks/Xero data between client systems is human-toner work",
      "Onboarding new clients is a 12-email back-and-forth before any real work begins"
    ],
    caseClient: "Small-to-mid CPA & bookkeeping practices",
    caseResult: "Document-aware agents + QuickBooks/Xero integration + client portal.",
    caseDesc: "Reduces partner-time on collection and categorization by 60%+. Engagement-letter automation included.",
    pricingRange: "Most engagements: $15K – $50K",
    pricingFootnote: "Workflow bundle from $9.5K · multi-partner platforms $100K+"
  },
  medspa: {
    label: "Med Spa / Wellness",
    icon: ICON.medspa,
    tag: "Med Spa & Wellness",
    headline: "Instagram DMs are your new front desk. <em>Staff them with an AI that books.</em>",
    lede: "We build social-first booking agents for med spas and wellness clinics — answering pricing, contraindication, and 'is this right for me?' questions, then dropping clients straight onto your calendar.",
    pains: [
      "DM inquiries die because front desk only checks IG twice a day",
      "Pricing questions over and over erode margin and feel transactional",
      "Returning-client retention drops when reminder/rebooking is manual"
    ],
    caseClient: "Multi-location aesthetics groups",
    caseResult: "Booked utilization climbs from mid-60s to ~90% in one quarter.",
    caseDesc: "Instagram DM + SMS agent with treatment-aware logic. Front desk only handles in-person.",
    pricingRange: "Most engagements: $10K – $35K",
    pricingFootnote: "Social agent + website bundle from $6.5K · chain platforms $60K+"
  },
  auto: {
    label: "Auto / Dealership",
    icon: ICON.auto,
    tag: "Automotive",
    headline: "Internet leads cost you $40 each. <em>Stop letting BDC reps lose them.</em>",
    lede: "We build dealership-grade SDR agents that respond in under 60 seconds, qualify trade-in value, and book test drives — across phone, SMS, and web chat.",
    pains: [
      "BDC turnover is brutal — every new hire is a 3-month productivity hole",
      "After-hours leads (45% of total) get a form-letter and never convert",
      "Trade-in valuation back-and-forth eats 4 messages before any qualifying happens"
    ],
    caseClient: "Independent and group dealerships",
    caseResult: "Test-drive bookings up 50%+. CPL down meaningfully.",
    caseDesc: "DMS-integrated agent across Twilio + web chat + Facebook Marketplace inbox.",
    pricingRange: "Most engagements: $18K – $60K",
    pricingFootnote: "Voice + SMS bundle from $10.5K · dealer-group platforms $100K+"
  },
  construction: {
    label: "Construction / Trades",
    icon: ICON.construction,
    tag: "Construction & Trades",
    headline: "You bid 30% of inquiries and win 12%. <em>Fix the math at intake.</em>",
    lede: "We build estimating-prep and lead-qualification agents for GCs, remodelers, and specialty trades — so your estimator only walks jobs that will actually close.",
    pains: [
      "Estimators driving to dead-end site visits is the #1 hidden cost in trades",
      "Permit/scope questions get re-asked 4 times before a real bid happens",
      "Referrals stall because nobody followed up in week 2"
    ],
    caseClient: "Design-build remodelers + specialty trades",
    caseResult: "Estimator capacity effectively doubled. Bid-to-close in the 30%+ range.",
    caseDesc: "Qualifier agent + JobTread/Buildertrend integration + automated follow-up cadence.",
    pricingRange: "Most engagements: $12K – $45K",
    pricingFootnote: "Qualifier + CRM stack from $8.5K · multi-division GC platforms $80K+"
  },
  restaurant: {
    label: "Restaurant / Hospitality",
    icon: ICON.restaurant,
    tag: "Restaurant & Hospitality",
    headline: "Phones, OpenTable, Resy, DMs. <em>One agent. One source of truth.</em>",
    lede: "We build hospitality concierges that handle reservations, private events, allergen questions, and gift cards — across every channel guests actually use.",
    pains: [
      "Host stand can't answer the phone during dinner service — that's lost covers",
      "Private event inquiries get buried in a shared Gmail for days",
      "Allergen/dietary questions vary by shift — inconsistent answers hurt repeat rate"
    ],
    caseClient: "Independent groups and steakhouse concepts",
    caseResult: "Reservation no-show down meaningfully. Private event close-rate up 2x+.",
    caseDesc: "Voice + SMS + web. Integrated with Resy + Tock. Always-on, always on-brand.",
    pricingRange: "Most engagements: $10K – $35K",
    pricingFootnote: "Website + voice bundle from $6.5K · group platforms $70K+"
  },
  other: {
    label: "Other / Custom Build",
    icon: ICON.other,
    tag: "Custom Build",
    headline: "Not on the list? <em>Good — most of our best work isn't either.</em>",
    lede: "We've built for non-profits, logistics, fintech, education, and very specific niches. If your business has a repeatable conversation or a workflow you can describe — we can build the agent or the app.",
    pains: [
      "You've tried off-the-shelf 'AI' tools and they fundamentally don't understand your business",
      "Your team has a list of 'things AI should do' that nobody knows how to scope",
      "You don't want a SaaS subscription — you want a system you own"
    ],
    caseClient: "Mixed portfolio — happy to share relevant case",
    caseResult: "We scope, prototype, and prove value before you commit to a build.",
    caseDesc: "Every 'Other' engagement starts with a paid discovery sprint. Fixed price. Real prototype.",
    pricingRange: "Custom-scoped after a 20-min fit call",
    pricingFootnote: "Discovery sprints from $4.5K · custom apps $40K–$500K+ based on scope"
  }
};
