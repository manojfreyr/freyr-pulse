import type { Company, OutreachMessage, PersonaId } from "@/lib/types";
import type { MatchedService } from "@/lib/generators/serviceMatch";
import { PERSONA_BY_ID } from "@/lib/mock/personas";
import { generateTalkingPoints } from "./talkingPoints";

/**
 * Generates ready-to-use outreach for a company + persona. The service angle is
 * catalog-driven: the primary service and the named services come from the
 * ranked `matched` output (matchServices against the ACTIVE catalog), not from
 * any stored per-company list. Opportunity-level context (verdict, score,
 * reasons) is company intelligence and is used as-is.
 *
 * The signature is the seam for a real model call later.
 */
export function generateOutreach(
  company: Company,
  personaId: PersonaId,
  matched: MatchedService[],
): OutreachMessage[] {
  const persona = PERSONA_BY_ID[personaId];
  const tp = generateTalkingPoints(company, personaId, matched);
  const trigger = company.triggers[0];
  // Phase 2B: lead with the strongest evidence behind the top recommendation —
  // a recent, cited event (trial/approval/recall) beats a generic curated trigger.
  const topMatch = matched[0];
  const eventEv = topMatch?.evidence?.find(
    (e) => e.category === "trigger" || e.category === "regulatory" || e.category === "pipeline",
  );
  const evidenceHook = eventEv
    ? `${eventEv.signalLabel}${eventEv.observedAt ? ` (${eventEv.observedAt.slice(0, 7)})` : ""}`
    : undefined;
  const triggerText = evidenceHook ?? (trigger ? trigger.headline : "recent developments");

  const topServiceNames = matched.slice(0, 3).map((m) => m.service.serviceName);
  const primaryService = topServiceNames[0] ?? "regulatory support";
  const reason = company.opportunity.reasons[0] ?? "your global regulatory footprint";

  const coldEmail: OutreachMessage = {
    kind: "cold-email",
    label: "Cold email",
    subject: `${company.name}: scaling ${shortService(primaryService)} without adding headcount`,
    body:
`Hi [First name],

I lead partnerships at Freyr, where we help life-sciences organisations strengthen their regulatory, quality, and safety operations.

I've been following ${company.name} — ${triggerText.toLowerCase()} stood out, and it's the kind of moment where ${persona.title.toLowerCase()}s often need more ${shortService(primaryService)} capacity than the team can add quickly.

We typically help by ${persona.freyrPositioning.charAt(0).toLowerCase()}${persona.freyrPositioning.slice(1)}

Would a short call to compare notes be useful? I can share how we've supported similar organisations on ${topServiceNames.slice(0, 2).join(" and ") || "regulatory operations"}.

Best,
[Your name]
Freyr`,
  };

  const linkedin: OutreachMessage = {
    kind: "linkedin-message",
    label: "LinkedIn message",
    body:
`Hi [First name] — I work with life-sciences regulatory and quality teams at Freyr. With ${triggerText.toLowerCase()} at ${company.name}, ${shortService(primaryService)} capacity is often a pressure point. Open to a brief chat on how we help teams like yours flex without adding fixed headcount?`,
  };

  const callOpening: OutreachMessage = {
    kind: "call-opening",
    label: "Call opening",
    body:
`"Thanks for taking a few minutes. I'll be brief.

The reason I reached out specifically to ${company.name} is ${reason.toLowerCase()} — and ${triggerText.toLowerCase()}. In our experience, that combination usually puts pressure on ${shortService(primaryService)}.

Before I say anything else — ${tp.discoveryQuestions[0]?.toLowerCase() ? tp.discoveryQuestions[0] : "where does your team feel the most pressure right now?"}"`,
  };

  const followUp: OutreachMessage = {
    kind: "follow-up-email",
    label: "Follow-up email",
    subject: `Following up — ${company.name} & Freyr`,
    body:
`Hi [First name],

Following up on my note. Given ${triggerText.toLowerCase()}, I thought a couple of specifics might help:

• Where we help most: ${topServiceNames.join(", ") || "regulatory operations and labeling"}
• How we engage: a small, defined scope first, with clear metrics, before any broader commitment
• Why teams choose us: ${company.strategy.differentiation}

If it's useful, I can put together a short, no-obligation view of where we'd start. Worth a 20-minute call?

Best,
[Your name]
Freyr`,
  };

  const meetingBrief: OutreachMessage = {
    kind: "meeting-brief",
    label: "Meeting brief",
    body:
`MEETING BRIEF — ${company.name}
Persona: ${persona.title}

WHY THEY MATTER
${company.opportunity.verdict}

OPPORTUNITY
Score ${company.opportunity.score}/100 (${company.opportunity.level}).

TOP SERVICES TO LEAD WITH
${(topServiceNames.length ? topServiceNames : ["Insufficient data — enrich profile first"]).map((s) => `• ${s}`).join("\n")}

TOP ANGLES
${company.opportunity.reasons.slice(0, 3).map((r) => `• ${r}`).join("\n")}

WHAT THIS PERSONA CARES ABOUT
${persona.caresAbout.slice(0, 3).map((c) => `• ${c}`).join("\n")}

LIKELY PAIN POINTS
${tp.painPoints.slice(0, 3).map((p) => `• ${p}`).join("\n")}

DISCOVERY QUESTIONS
${persona.discoveryQuestions.slice(0, 3).map((q) => `• ${q}`).join("\n")}

RECOMMENDED NEXT STEP
${persona.recommendedNextStep}

REMEMBER: every claim above is intelligence, not confirmed fact — validate in conversation.`,
  };

  const objectionHandling: OutreachMessage = {
    kind: "objection-handling",
    label: "Objection handling",
    body:
persona.objections
  .map((o, i) => `OBJECTION ${i + 1}: "${o.objection}"\nRESPONSE: ${o.response}`)
  .join("\n\n") +
`\n\nGENERAL POSITIONING\n${persona.freyrPositioning}`,
  };

  return [coldEmail, linkedin, callOpening, followUp, meetingBrief, objectionHandling];
}

function shortService(name: string): string {
  return name
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/^Global\s+/i, "")
    .replace(/\s+&\s+/g, " and ")
    .trim()
    .toLowerCase();
}
