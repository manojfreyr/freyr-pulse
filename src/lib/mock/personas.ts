import type { Persona, PersonaId } from "@/lib/types";

/**
 * The 8 buyer personas a Freyr salesperson speaks with. These are
 * company-independent. The talking-points generator (src/lib/generators)
 * resolves these against a specific company to produce TalkingPoints, and the
 * outreach generator uses them to set tone and angle.
 *
 * Tokens {company} and {trigger} in openingLineTemplate are filled at runtime.
 */
export const PERSONAS: Persona[] = [
  {
    id: "vp-regulatory-affairs",
    title: "VP Regulatory Affairs",
    caresAbout: [
      "Global filing strategy and approval timelines",
      "Regulatory risk across the portfolio",
      "Building scalable capacity without growing fixed headcount",
      "Agency relationships and inspection outcomes",
    ],
    kpis: [
      "On-time submission and approval rates",
      "Time-to-market for new products and indications",
      "Inspection / audit findings (number and severity)",
      "Regulatory cost as a percentage of R&D",
    ],
    painPoints: [
      "Uneven workload peaks that strain internal teams",
      "Fragmented regional execution and inconsistent quality",
      "Pressure to support pipeline growth without headcount",
      "Visibility gaps across a complex global portfolio",
    ],
    freyrPositioning:
      "Position Freyr as a strategic regulatory partner that flexes capacity and adds global execution depth, freeing the internal team to focus on strategy and agency engagement.",
    discoveryQuestions: [
      "Where do submission timelines slip most often today — strategy, authoring, or operations?",
      "How are you resourcing regulatory work for the pipeline over the next 18 months?",
      "Which regions stretch your team the thinnest right now?",
      "How consistent is regulatory quality across your markets?",
    ],
    openingLineTemplate:
      "Given {company}'s global portfolio and {trigger}, most VPs of Reg Affairs in your position are weighing how to add capacity and consistency without growing fixed cost — that's exactly where we help.",
    objections: [
      {
        objection: "We already have an internal team that handles this.",
        response:
          "Most of our partners do too — we typically augment rather than replace, taking the peaks and the operational load so your team stays focused on strategy and the agencies.",
      },
      {
        objection: "We use a large CRO already.",
        response:
          "Many clients keep their CRO for clinical and use us specifically for regulatory depth, labeling, and operations, where focus and responsiveness matter most.",
      },
    ],
    recommendedNextStep:
      "Propose a 30-minute working session to map current submission load against upcoming pipeline milestones.",
    ownsServiceCategories: [
      "Regulatory Affairs",
      "Regulatory Strategy",
      "Regulatory Intelligence",
      "Medical Writing",
      "Combination Products",
      "Medical Devices",
      "Local Regulatory Affairs",
    ],
  },
  {
    id: "director-regulatory-operations",
    title: "Director Regulatory Operations",
    caresAbout: [
      "Submission throughput and publishing quality",
      "RIM data integrity and system adoption",
      "Operational efficiency and rework reduction",
      "Predictable execution under deadline pressure",
    ],
    kpis: [
      "Submissions published on time and right-first-time",
      "Validation error and rework rates",
      "RIM data completeness and accuracy",
      "Cost per submission",
    ],
    painPoints: [
      "Submission backlogs at peak periods",
      "Manual, error-prone publishing steps",
      "RIM data that is incomplete or out of sync",
      "Difficulty scaling operations quickly",
    ],
    freyrPositioning:
      "Position Freyr as the operations engine: scalable publishing and submission capacity plus RIM expertise that lifts throughput and reduces rework.",
    discoveryQuestions: [
      "What's your current submission backlog and how does it move during peaks?",
      "Where does rework most commonly creep into publishing today?",
      "How healthy is your RIM data, and who keeps it current?",
      "How quickly can you scale operations when a big filing lands?",
    ],
    openingLineTemplate:
      "With {company}'s submission volume and {trigger}, operations leaders are usually looking for capacity that scales on demand without sacrificing right-first-time quality.",
    objections: [
      {
        objection: "Our publishing is handled in-house and works fine.",
        response:
          "Then the value is at the peaks — a managed pod absorbs surges so your team isn't the bottleneck when several filings hit at once.",
      },
      {
        objection: "We just implemented a RIM system.",
        response:
          "That's the ideal moment — most value is lost in adoption and data quality, and that's precisely where our managed RIM operations help.",
      },
    ],
    recommendedNextStep:
      "Offer a short operational assessment of current throughput, rework, and peak-load handling.",
    ownsServiceCategories: [
      "Regulatory Operations",
      "Submissions",
      "Publishing",
      "RIM",
      "Product Registration",
      "Technology Platforms",
    ],
  },
  {
    id: "head-of-labeling",
    title: "Head of Labeling",
    caresAbout: [
      "Label accuracy and global consistency",
      "Speed of label updates across markets",
      "Artwork change control and compliance",
      "Reducing labeling-related compliance risk",
    ],
    kpis: [
      "Time to implement a CCDS change across markets",
      "Label / artwork error and deviation rates",
      "Number of labeling-related compliance events",
      "Backlog of pending label updates",
    ],
    painPoints: [
      "Slow, manual derivation of local labels from the CCDS",
      "Artwork change management bottlenecks",
      "Inconsistent labels across regions",
      "Compliance exposure from late label updates",
    ],
    freyrPositioning:
      "Position Freyr as the labeling specialist that harmonises global labeling, accelerates local derivation, and tightens artwork change control.",
    discoveryQuestions: [
      "How long does a CCDS change take to reach all your markets today?",
      "Where do artwork bottlenecks slow you down most?",
      "How do you ensure label consistency across regions?",
      "What's your current backlog of pending label updates?",
    ],
    openingLineTemplate:
      "For a portfolio the size of {company}'s, labeling harmonisation and artwork change control are usually where compliance risk and delay concentrate — that's a core area for us.",
    objections: [
      {
        objection: "Labeling is tightly controlled internally for good reason.",
        response:
          "Agreed — we don't loosen control, we strengthen it, adding capacity and a structured process so updates land faster and more consistently.",
      },
      {
        objection: "We have a labeling system already.",
        response:
          "Systems help, but the work is in the derivation and artwork steps — that's where our labeling specialists add the most value.",
      },
    ],
    recommendedNextStep:
      "Suggest a focused review of CCDS-to-local turnaround time and artwork change throughput.",
    ownsServiceCategories: ["Labeling", "Artwork"],
  },
  {
    id: "head-of-quality",
    title: "Head of Quality",
    caresAbout: [
      "Inspection and audit readiness",
      "GxP compliance across sites and suppliers",
      "Robust, current quality systems and SOPs",
      "Validated, compliant computer systems",
    ],
    kpis: [
      "Inspection findings and CAPA closure times",
      "Audit coverage of suppliers and sites",
      "SOP currency and training completion",
      "Validation status of GxP systems",
    ],
    painPoints: [
      "Audit and inspection backlog",
      "Outdated or inconsistent SOPs",
      "Validation debt across GxP systems",
      "Stretched quality teams under compliance pressure",
    ],
    freyrPositioning:
      "Position Freyr as a quality and compliance partner that boosts audit coverage, modernises SOPs and QMS, and clears validation debt with risk-based CSA.",
    discoveryQuestions: [
      "How current is your SOP library, and when was it last harmonised?",
      "What's your supplier-audit coverage versus plan this year?",
      "Where do you carry the most validation debt across GxP systems?",
      "How ready would you be for an unannounced inspection next month?",
    ],
    openingLineTemplate:
      "With {company}'s footprint and {trigger}, quality leaders are usually balancing inspection readiness against stretched teams — we add audit, SOP, and validation capacity quickly.",
    objections: [
      {
        objection: "Quality is core — we don't outsource it.",
        response:
          "Understood — we don't take ownership of your quality, we supplement it with audit capacity, SOP authoring, and validation work that frees your team for oversight.",
      },
      {
        objection: "We're between systems right now.",
        response:
          "That's often when risk peaks — a risk-based CSA approach keeps you compliant through the transition without over-validating.",
      },
    ],
    recommendedNextStep:
      "Propose a gap review of SOP currency, audit coverage, and validation status.",
    ownsServiceCategories: ["Quality & Compliance", "GxP Audits", "CSV / CSA", "SOP Writing & Review", "QMS Support"],
  },
  {
    id: "head-of-pharmacovigilance",
    title: "Head of Pharmacovigilance",
    caresAbout: [
      "Case processing capacity and timeliness",
      "Signal detection and management quality",
      "Compliance of aggregate and expedited reporting",
      "Medical information service levels",
    ],
    kpis: [
      "On-time ICSR and aggregate report submission",
      "Case backlog and processing cycle time",
      "Signal management compliance",
      "Medical information response times",
    ],
    painPoints: [
      "Rising case volume outpacing capacity",
      "Cost pressure on PV operations",
      "Compliance risk from late or missed reporting",
      "Difficulty scaling for launches or new markets",
    ],
    freyrPositioning:
      "Position Freyr as a PV partner offering scalable case processing, signal management, and medical information with strong compliance discipline.",
    discoveryQuestions: [
      "How is your case volume trending, and where's the pressure greatest?",
      "What's your current case backlog and cycle time?",
      "How are you resourcing PV for upcoming launches or new markets?",
      "Where do cost pressures hit your PV operation hardest?",
    ],
    openingLineTemplate:
      "Given {company}'s product breadth and {trigger}, PV leaders often need to scale case processing and reporting capacity without inflating fixed cost — that's a core service for us.",
    objections: [
      {
        objection: "PV compliance is too sensitive to hand off.",
        response:
          "That's why model and oversight matter — we run to your SOPs with full audit trails, and many clients start with overflow before expanding scope.",
      },
      {
        objection: "We have a PV vendor already.",
        response:
          "Many clients run dual sourcing for resilience — we can take specific markets or activities where you need more responsiveness or capacity.",
      },
    ],
    recommendedNextStep:
      "Offer a capacity-and-compliance review of case volume trends and reporting timeliness.",
    ownsServiceCategories: ["Pharmacovigilance", "Medical Information"],
  },
  {
    id: "procurement-leader",
    title: "Procurement Leader",
    caresAbout: [
      "Total cost of ownership and savings",
      "Vendor consolidation and rationalisation",
      "Contract flexibility and risk reduction",
      "Supplier performance and governance",
    ],
    kpis: [
      "Cost savings delivered against target",
      "Number of vendors consolidated",
      "Contract compliance and SLA adherence",
      "Supplier risk and performance scores",
    ],
    painPoints: [
      "Too many fragmented niche vendors",
      "Unpredictable spend from variable demand",
      "Limited flexibility in rigid contracts",
      "Difficulty governing many small suppliers",
    ],
    freyrPositioning:
      "Position Freyr as a consolidation partner: one accountable supplier across multiple regulatory, quality, and PV needs, with flexible managed-service commercial models.",
    discoveryQuestions: [
      "How many vendors support your regulatory, quality, and PV functions today?",
      "Where is spend least predictable, and why?",
      "What would an ideal consolidated supplier relationship look like?",
      "How do you currently govern supplier performance across these areas?",
    ],
    openingLineTemplate:
      "With {company}'s scale and {trigger}, procurement leaders are usually looking to consolidate fragmented regulatory and quality spend under fewer, more flexible suppliers — that's where we fit.",
    objections: [
      {
        objection: "We don't want to over-concentrate with one supplier.",
        response:
          "Sensible — we typically start with a defined scope and prove value before expanding, so consolidation happens on your terms.",
      },
      {
        objection: "Switching costs are too high.",
        response:
          "We design phased transitions with knowledge transfer built in, so you capture savings without operational disruption.",
      },
    ],
    recommendedNextStep:
      "Suggest a spend-and-vendor mapping exercise to size the consolidation opportunity.",
    ownsServiceCategories: ["VMO / Managed Services"],
  },
  {
    id: "cio-digital",
    title: "CIO / Digital Transformation Leader",
    caresAbout: [
      "Platform modernisation and integration",
      "Data quality and a single source of truth",
      "Responsible adoption of AI and automation",
      "Validated, compliant technology",
    ],
    kpis: [
      "System adoption and user satisfaction",
      "Data quality and integration coverage",
      "Automation / efficiency gains delivered",
      "Validation and compliance status of systems",
    ],
    painPoints: [
      "Legacy regulatory systems and data silos",
      "Slow, costly RIM and labeling implementations",
      "Pressure to show AI value without compliance risk",
      "Validation overhead on every change",
    ],
    freyrPositioning:
      "Position Freyr as a partner that combines regulatory technology platforms with the domain expertise to implement, validate, and adopt them — and to apply AI responsibly.",
    discoveryQuestions: [
      "Where are your biggest regulatory data silos today?",
      "What's blocking value from your current RIM or labeling platforms?",
      "Where do you most want AI to help, and what's holding it back?",
      "How much validation overhead slows your change cycles?",
    ],
    openingLineTemplate:
      "Given {company}'s {trigger}, digital leaders are usually trying to turn regulatory platforms and AI into real, compliant productivity — we pair the technology with the domain expertise to deliver it.",
    objections: [
      {
        objection: "We're already invested in our own platforms.",
        response:
          "Good — we're platform-aware and often implement and optimise existing investments rather than replacing them.",
      },
      {
        objection: "AI in regulated workflows feels risky.",
        response:
          "That's exactly our discipline — human-in-the-loop, validated, and auditable, so you get the productivity without the compliance exposure.",
      },
    ],
    recommendedNextStep:
      "Propose a short architecture and use-case session on RIM, labeling, and AI opportunities.",
    ownsServiceCategories: ["RIM", "Technology Platforms", "AI-enabled Regulatory Solutions", "CSV / CSA"],
  },
  {
    id: "ceo-business-unit",
    title: "CEO / Business Unit Head",
    caresAbout: [
      "Speed to market and revenue growth",
      "Successful market expansion",
      "Operational leverage and margin",
      "Reducing strategic and compliance risk",
    ],
    kpis: [
      "Revenue and market-share growth",
      "Time-to-market for new products and markets",
      "Operating margin and cost efficiency",
      "Successful launches and approvals",
    ],
    painPoints: [
      "Regulatory bottlenecks delaying revenue",
      "Cost and complexity of global expansion",
      "Scaling operations without scaling cost",
      "Compliance events that create headline risk",
    ],
    freyrPositioning:
      "Position Freyr as a growth enabler: faster approvals, smoother market entry, and operational leverage that protects margin while reducing compliance risk.",
    discoveryQuestions: [
      "Where are regulatory timelines holding back revenue today?",
      "Which new markets matter most over the next two years?",
      "Where do you most need to scale without adding fixed cost?",
      "What compliance risks worry you at the board level?",
    ],
    openingLineTemplate:
      "With {company}'s {trigger}, the executive question is usually how to grow and enter markets faster without adding fixed cost or compliance risk — that's the outcome we're built to deliver.",
    objections: [
      {
        objection: "This feels like an operational, not executive, topic.",
        response:
          "It becomes executive when it gates revenue and margin — that's the lens we bring, tying regulatory execution to growth outcomes.",
      },
      {
        objection: "We have these capabilities internally.",
        response:
          "Most leaders do — the question is whether they scale fast enough for your growth plans, and that's where a partner protects your timelines.",
      },
    ],
    recommendedNextStep:
      "Request a brief executive conversation framed around growth, market entry, and margin.",
    ownsServiceCategories: ["Regulatory Strategy", "Market Access"],
  },
];

export const PERSONA_BY_ID: Record<PersonaId, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p]),
) as Record<PersonaId, Persona>;
