import "server-only";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import type { AccountBrief, BriefService, Deliverable, Insight } from "./briefModel";
import { refMarker } from "./citations";
import type { SourceCitation } from "@/lib/types";

const NAVY = "0E2436";
const TEAL = "0D9488";
const INK = "1F2933";
const MUTED = "6B7280";

export async function renderDocx(brief: AccountBrief, deliverable: Deliverable): Promise<Buffer> {
  const C: Paragraph[] = [];
  const refs = (cites: SourceCitation[]) => cites.map((c) => refMarker(brief.citationIndex, c)).filter(Boolean).join(" ");

  const h1 = (t: string) =>
    C.push(new Paragraph({
      spacing: { before: 240, after: 100 },
      border: { bottom: { color: TEAL, size: 8, style: BorderStyle.SINGLE, space: 2 } },
      children: [new TextRun({ text: t.toUpperCase(), bold: true, color: TEAL, size: 19, characterSpacing: 20 })],
    }));
  const para = (t: string, o: { bold?: boolean; color?: string; size?: number } = {}) =>
    C.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: t, bold: o.bold, color: o.color ?? INK, size: o.size ?? 21 })] }));
  const small = (t: string) => C.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, color: MUTED, size: 17 })] }));
  const bullet = (t: string) => C.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: t, color: INK, size: 20 })] }));

  const insight = (i: Insight) => {
    const tag = i.analysis ? " · Freyr analysis" : ` ${refs(i.citations)}`;
    C.push(new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: `${i.label}${i.value ? `: ${i.value}` : ""}`, bold: true, color: INK, size: 20 }),
        new TextRun({ text: `${i.confidence ? ` · ${i.confidence}` : ""}${i.observedAt ? ` · as of ${i.observedAt.slice(0, 10)}` : ""}${tag}`, color: MUTED, size: 17 }),
      ],
    }));
  };

  const cover = (subtitle: string) => {
    C.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: brief.company.name, bold: true, color: NAVY, size: 44 })] }));
    C.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: subtitle, color: TEAL, size: 24, bold: true })] }));
    C.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: `${brief.company.segment} · ${brief.company.size} · ${brief.company.hq}`, color: MUTED, size: 18 })] }));
    C.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: `Prepared by Freyr Pulse · ${brief.generatedAt} · data as of ${brief.dataAsOf.slice(0, 10)}${brief.researched ? "" : " · not yet researched"} · Internal`, color: MUTED, size: 16 })] }));
  };

  const opportunity = () => {
    h1("Opportunity");
    para(brief.opportunity.verdict, { bold: true, size: 24, color: NAVY });
    small(`Level ${brief.opportunity.level} · score ${brief.opportunity.score}/100 · ${brief.opportunity.confidence} · ${brief.opportunity.overallStrength} evidence`);
    for (const r of brief.opportunity.reasons.slice(0, 5)) bullet(r);
    para(`Next best action: ${brief.opportunity.nextBestAction}`, { bold: true });
  };

  const whyNow = (limit: number) => {
    h1("Why now");
    for (const w of brief.whyNow.slice(0, limit)) {
      const tag = w.analysis ? " · Freyr analysis" : ` ${refs(w.citations)}`;
      C.push(new Paragraph({ spacing: { after: 30 }, children: [
        new TextRun({ text: w.headline, bold: true, color: INK, size: 20 }),
        new TextRun({ text: `${w.confidence ? ` · ${w.confidence}` : ""}${w.observedAt ? ` · as of ${w.observedAt.slice(0, 10)}` : ""}${tag}`, color: MUTED, size: 16 }),
      ] }));
      small(w.whyItMatters);
    }
  };

  const services = (list: BriefService[], withEvidence: boolean) => {
    h1("Recommended services");
    for (const s of list) {
      C.push(new Paragraph({ spacing: { before: 80, after: 20 }, children: [
        new TextRun({ text: s.name, bold: true, color: INK, size: 22 }),
        new TextRun({ text: `   ${s.strength ?? ""} evidence`, color: TEAL, size: 16 }),
      ] }));
      small(`${s.line} · ${s.category} · likely buyer: ${s.likelyBuyer}`);
      para(s.why, { size: 19 });
      if (withEvidence) for (const e of s.evidence) {
        const tag = e.citations.length ? ` ${refs(e.citations)}` : " · Freyr analysis";
        small(`– ${e.label} (${e.confidence}${e.observedAt ? `, as of ${e.observedAt.slice(0, 10)}` : ""}, +${e.contribution})${tag}`);
      }
    }
  };

  const sources = () => {
    if (!brief.citations.length) return;
    h1("Sources & methodology");
    small("Recommendations are deterministic and evidence-weighted (confidence × recency, with a small corroboration bonus). Items marked \u201cFreyr analysis\u201d are internal, non-cited assessments.");
    for (const { n, citation } of brief.citations) {
      const date = citation.publishedAt || citation.retrievedAt || citation.dateRetrieved;
      C.push(new Paragraph({ spacing: { after: 30 }, children: [
        new TextRun({ text: `[${n}] ${citation.publisher ? citation.publisher + " — " : ""}${citation.label}${date ? ` (${date.slice(0, 10)})` : ""}`, color: INK, size: 17 }),
        ...(citation.url && /^https?:/i.test(citation.url) ? [new TextRun({ text: `  ${citation.url}`, color: TEAL, size: 16 })] : []),
      ] }));
    }
  };

  // ---------- composition ----------
  if (deliverable === "account-brief") {
    cover("Account Brief");
    opportunity();
    h1("Company snapshot");
    for (const i of brief.snapshot) insight(i);
    h1("Signals & intelligence");
    for (const g of brief.signals) { para(g.category, { bold: true }); for (const i of g.items) insight(i); }
    whyNow(8);
    services(brief.services, true);
    h1("Stakeholders & talk track");
    for (const p of brief.personas.slice(0, 3)) { para(p.title, { bold: true, size: 22 }); small(`Cares about: ${p.caresAbout.join(", ")}`); para(`Opening: ${p.openingLine}`, { size: 19 }); }
    h1(`Outreach starters — ${brief.primaryPersonaTitle}`);
    for (const m of brief.outreach) { para(m.label, { bold: true }); if (m.subject) small(`Subject: ${m.subject}`); para(m.body, { size: 19 }); }
    sources();
  } else if (deliverable === "meeting-prep") {
    cover(`Meeting Prep — ${brief.primaryPersonaTitle}`);
    whyNow(5);
    h1(`Talk track — ${brief.primaryPersonaTitle}`);
    const p = brief.personas[0];
    if (p) {
      small(`Cares about: ${p.caresAbout.join(", ")} · KPIs: ${p.kpis.join(", ")}`);
      para(`Opening: ${p.openingLine}`);
      para("Discovery questions", { bold: true });
      for (const q of p.discoveryQuestions) bullet(q);
      para("Likely objections", { bold: true });
      for (const o of p.objections) { para(o.objection, { bold: true, size: 19 }); small(o.response); }
      para(`Recommended next step: ${p.recommendedNextStep}`, { bold: true });
    }
    services(brief.services.slice(0, 3), true);
    sources();
  } else {
    // outreach-pack
    cover("Outreach Pack");
    whyNow(3);
    h1(`Outreach — aimed at ${brief.primaryPersonaTitle}`);
    for (const m of brief.outreach) { para(m.label, { bold: true, size: 22 }); if (m.subject) small(`Subject: ${m.subject}`); para(m.body, { size: 20 }); C.push(new Paragraph({ spacing: { after: 120 }, children: [] })); }
    services(brief.services.slice(0, 3), false);
    sources();
  }

  const doc = new Document({
    creator: "Freyr Pulse",
    title: `${brief.company.name} — ${deliverable}`,
    sections: [{ properties: {}, children: C }],
  });
  return Packer.toBuffer(doc);
}
