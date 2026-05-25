// Industry routing data — each key drives the reshaped hero
const INDUSTRIES = {
  healthcare: {
    label: "Healthcare / Medical Practice",
    icon: "✚",
    tag: "Healthcare",
    headline: "Your front desk is drowning. <em>AI can answer the phone before it rings twice.</em>",
    lede: "We build HIPAA-aware voice + intake agents that book appointments, route urgent calls, and stop the no-show spiral — without replacing your staff.",
    pains: [
      "47% of patient calls go to voicemail after 5pm — and never call back",
      "Manual insurance verification eats 6+ hours per provider per week",
      "No-show rates above 18% kill margin on every fee-for-service visit"
    ],
    caseClient: "Multi-site internal medicine, FL",
    caseResult: "Recaptured $312K in annual revenue from after-hours bookings.",
    caseDesc: "Voice agent + SMS reminder loop deployed in 18 days. Zero EHR replacement.",
    pricingLow: "$18K",
    pricingHigh: "$45K",
    pricingScope: "pilot to full multi-site rollout"
  },
  realestate: {
    label: "Real Estate / Brokerage",
    icon: "⌂",
    tag: "Real Estate",
    headline: "Leads die in 5 minutes. <em>Yours should be qualified in 30 seconds.</em>",
    lede: "We build the lead-qualification layer that sits between Zillow/portal forms and your agents — so the warm ones get a call back instantly and the tire-kickers get nurtured.",
    pains: [
      "Agents waste 60% of their day on leads that were never going to close",
      "Portal leads ghost within 8 minutes if no human responds",
      "Listing prep, MLS copy, and follow-up sequences are pure agent-time tax"
    ],
    caseClient: "30-agent boutique brokerage, Austin",
    caseResult: "3.4x increase in lead-to-showing conversion in Q1.",
    caseDesc: "Custom GPT-4 qualifier + Twilio voice + CRM webhook stack. Agents see only A-tier leads.",
    pricingLow: "$12K",
    pricingHigh: "$38K",
    pricingScope: "single-team to brokerage-wide"
  },
  entertainment: {
    label: "Entertainment / Events",
    icon: "♪",
    tag: "Entertainment & Events",
    headline: "Booking inquiries spike at midnight. <em>Your AI handles them before brunch.</em>",
    lede: "We build booking concierges for venues, talent agencies, and event producers — qualifying date, budget, and headcount in conversation, then slotting confirmed inquiries onto a real calendar.",
    pains: [
      "70% of inquiries arrive outside business hours and bounce to competitors",
      "Junior staff burn out triaging 'how much for a Saturday?' emails",
      "No clean way to A/B test pricing tiers or upsell production add-ons"
    ],
    caseClient: "Boutique event venue group, NYC",
    caseResult: "Closed an extra 41 weddings in 6 months — zero added headcount.",
    caseDesc: "Conversational concierge across SMS + Instagram DM + web. Routes hot leads to humans only when ready.",
    pricingLow: "$15K",
    pricingHigh: "$50K",
    pricingScope: "single venue to multi-property"
  },
  ecommerce: {
    label: "E-commerce / Retail",
    icon: "🛍",
    tag: "E-commerce",
    headline: "Your support inbox is a margin killer. <em>Let an agent close 80% of it.</em>",
    lede: "We build product-aware support + recovery agents that handle WISMO, sizing, returns, and abandoned-cart rescue — trained on YOUR catalog, not a generic LLM.",
    pains: [
      "Support headcount scales linearly with revenue — that's a broken model",
      "Abandoned cart sequences are still generic 'come back!' emails in 2026",
      "Returns/exchanges eat 22% of operator time and tank CSAT"
    ],
    caseClient: "DTC apparel brand, $14M GMV",
    caseResult: "Cut ticket volume 71%. Recovered $190K in carts in 90 days.",
    caseDesc: "Shopify + Gorgias deep integration. Agent knows every SKU, variant, and policy.",
    pricingLow: "$10K",
    pricingHigh: "$40K",
    pricingScope: "Shopify Plus or custom stack"
  },
  professional: {
    label: "Professional Services (Law, Accounting)",
    icon: "§",
    tag: "Professional Services",
    headline: "Your billable hour shouldn't be spent on intake. <em>Automate the front of the funnel.</em>",
    lede: "We build intake and conflict-check agents for law and accounting firms — capturing matter details, running preliminary checks, and prepping a partner-ready brief before the consult.",
    pains: [
      "Partners doing $400/hr intake calls is malpractice on your own P&L",
      "Conflict checks across multiple matter management systems are still manual",
      "Cold inbound leaves money on the table — most firms answer in days, not minutes"
    ],
    caseClient: "Mid-size litigation firm, Chicago",
    caseResult: "Freed 11 partner-hours per week. Intake-to-retainer up 28%.",
    caseDesc: "Custom intake agent + Clio integration + secure document handoff. SOC 2 ready.",
    pricingLow: "$22K",
    pricingHigh: "$60K",
    pricingScope: "boutique to AmLaw 200 pilot"
  },
  medspa: {
    label: "Med Spa / Wellness",
    icon: "❋",
    tag: "Med Spa & Wellness",
    headline: "Instagram DMs are your new front desk. <em>Staff them with an AI that books.</em>",
    lede: "We build social-first booking agents for med spas and wellness clinics — answering pricing, contraindication, and 'is this right for me?' questions, then dropping clients straight onto your calendar.",
    pains: [
      "DM inquiries die because front desk only checks IG twice a day",
      "Pricing questions over and over erode margin and feel transactional",
      "Returning client retention drops when reminder/rebooking is manual"
    ],
    caseClient: "3-location aesthetics group, Miami",
    caseResult: "Booked utilization rose from 64% → 89% in one quarter.",
    caseDesc: "Instagram DM + SMS agent with treatment-aware logic. Front desk now only handles in-person.",
    pricingLow: "$12K",
    pricingHigh: "$32K",
    pricingScope: "single location to small chain"
  },
  auto: {
    label: "Auto / Dealership",
    icon: "🚗",
    tag: "Automotive",
    headline: "Internet leads cost you $40 each. <em>Stop letting BDC reps lose them.</em>",
    lede: "We build dealership-grade SDR agents that respond in under 60 seconds, qualify trade-in value, and book test drives — across phone, SMS, and web chat.",
    pains: [
      "BDC turnover is brutal — every new hire is a 3-month productivity hole",
      "After-hours leads (45% of total) get a form-letter and never convert",
      "Trade-in valuation back-and-forth eats 4 messages before any qualifying happens"
    ],
    caseClient: "Independent multi-rooftop dealer, TX",
    caseResult: "Test-drive bookings up 52%. CPL down 31%.",
    caseDesc: "DMS-integrated agent across Twilio + web chat + Facebook Marketplace inbox.",
    pricingLow: "$18K",
    pricingHigh: "$55K",
    pricingScope: "single rooftop to dealer group"
  },
  construction: {
    label: "Construction / Trades",
    icon: "⚒",
    tag: "Construction & Trades",
    headline: "You bid 30% of inquiries and win 12%. <em>Fix the math at intake.</em>",
    lede: "We build estimating-prep and lead-qualification agents for GCs, remodelers, and specialty trades — so your estimator only walks jobs that will actually close.",
    pains: [
      "Estimators driving to dead-end site visits is the #1 hidden cost in trades",
      "Permit/scope questions get re-asked 4 times before a real bid happens",
      "Referrals stall because nobody followed up in week 2"
    ],
    caseClient: "Design-build remodeler, Denver",
    caseResult: "Estimator capacity effectively doubled. Bid-to-close up to 34%.",
    caseDesc: "Qualifier agent + JobTread integration + automated follow-up cadence.",
    pricingLow: "$14K",
    pricingHigh: "$42K",
    pricingScope: "single trade to multi-division GC"
  },
  restaurant: {
    label: "Restaurant / Hospitality",
    icon: "🍽",
    tag: "Restaurant & Hospitality",
    headline: "Phones, OpenTable, Resy, DMs. <em>One agent. One source of truth.</em>",
    lede: "We build hospitality concierges that handle reservations, private events, allergen questions, and gift cards — across every channel guests actually use.",
    pains: [
      "Host stand can't answer the phone during dinner service — that's lost covers",
      "Private event inquiries get buried in a shared Gmail for days",
      "Allergen/dietary questions vary by shift — inconsistent answers hurt repeat rate"
    ],
    caseClient: "Independent steakhouse group, Chicago",
    caseResult: "Reservation no-show down 22%. Private event close-rate up 2.1x.",
    caseDesc: "Voice + SMS + web. Integrated with Resy + Tock. Always-on, always on-brand.",
    pricingLow: "$10K",
    pricingHigh: "$35K",
    pricingScope: "single concept to small group"
  },
  other: {
    label: "Other",
    icon: "✦",
    tag: "Custom Build",
    headline: "Not on the list? <em>Good — most of our best work isn't either.</em>",
    lede: "We've built for non-profits, logistics, fintech, education, and one very specific niche of competitive horse training. If your business has a repeatable conversation, we can build the agent.",
    pains: [
      "You've tried off-the-shelf 'AI' tools and they fundamentally don't understand your business",
      "Your team has a list of 'things AI should do' that nobody knows how to scope",
      "You don't want a SaaS subscription — you want a system you own"
    ],
    caseClient: "Mixed portfolio — happy to share relevant case",
    caseResult: "We scope, prototype, and prove value before you commit to a build.",
    caseDesc: "Every Other engagement starts with a paid 2-week discovery sprint. Fixed price. Real prototype.",
    pricingLow: "$8K",
    pricingHigh: "scope-dependent",
    pricingScope: "discovery sprint first, always"
  }
};
