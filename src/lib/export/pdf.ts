import "server-only";
import PDFDocument from "pdfkit";
import type { AccountBrief, BriefService, Deliverable, Insight } from "./briefModel";
import { refMarker } from "./citations";
import type { SourceCitation } from "@/lib/types";

const NAVY = "#0E2436";
const TEAL = "#0D9488";
const INK = "#1F2933";
const MUTED = "#6B7280";
const LINE = "#E5E7EB";
const PAGE = { margin: 54, width: 595.28 }; // A4

function conf(c?: string): string {
  return c ? ` · ${c}` : "";
}
function asOf(o?: string): string {
  return o ? ` · as of ${o.slice(0, 10)}` : "";
}

export async function renderPdf(brief: AccountBrief, deliverable: Deliverable): Promise<Buffer> {
  const fixedDate = new Date(`${brief.generatedAt}T00:00:00Z`);
  const doc = new PDFDocument({ size: "A4", margin: PAGE.margin, info: { Title: `${brief.company.name} — ${deliverable}`, Author: "Freyr Pulse", CreationDate: fixedDate, ModDate: fixedDate } });
  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((res) => doc.on("end", () => res(Buffer.concat(chunks))));

  const left = PAGE.margin;
  const contentW = PAGE.width - PAGE.margin * 2;

  const h1 = (t: string) => {
    if (doc.y > 720) doc.addPage();
    doc.moveDown(0.6).fillColor(TEAL).fontSize(9).font("Helvetica-Bold").text(t.toUpperCase(), left, doc.y, { characterSpacing: 1 });
    doc.moveTo(left, doc.y + 2).lineTo(left + contentW, doc.y + 2).strokeColor(LINE).lineWidth(1).stroke();
    doc.moveDown(0.5);
  };
  const para = (t: string, opts: { color?: string; size?: number; bold?: boolean } = {}) => {
    doc.fillColor(opts.color ?? INK).font(opts.bold ? "Helvetica-Bold" : "Helvetica").fontSize(opts.size ?? 10).text(t, left, doc.y, { width: contentW, align: "left" });
  };
  const small = (t: string) => doc.fillColor(MUTED).font("Helvetica").fontSize(8.5).text(t, left, doc.y, { width: contentW });
  const bullet = (t: string) => doc.fillColor(INK).font("Helvetica").fontSize(10).text(`•  ${t}`, left + 6, doc.y, { width: contentW - 6 });
  const refs = (cites: SourceCitation[]) => cites.map((c) => refMarker(brief.citationIndex, c)).filter(Boolean).join(" ");

  const insightLine = (i: Insight) => {
    const tag = i.analysis ? " · Freyr analysis" : ` ${refs(i.citations)}`;
    const val = i.value ? `: ${i.value}` : "";
    doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(`${i.label}${val}`, left, doc.y, { width: contentW, continued: true })
      .font("Helvetica").fillColor(MUTED).fontSize(8.5).text(`${conf(i.confidence)}${asOf(i.observedAt)}${tag}`);
  };

  // ---------- cover / header ----------
  const cover = (subtitle: string) => {
    doc.rect(0, 0, PAGE.width, 150).fill(NAVY);
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(22).text(brief.company.name, left, 46, { width: contentW });
    doc.fillColor("#9FB3C8").font("Helvetica").fontSize(11).text(subtitle, left, 78);
    doc.fillColor("#7DD3C8").fontSize(9).text(`${brief.company.segment} · ${brief.company.size} · ${brief.company.hq}`, left, 100);
    doc.fillColor("#9FB3C8").fontSize(8).text(`Prepared by Freyr Pulse · ${brief.generatedAt} · data as of ${brief.dataAsOf.slice(0, 10)}${brief.researched ? "" : " · not yet researched"}`, left, 122);
    doc.y = 172;
    doc.fillColor(INK);
  };

  const opportunityBlock = () => {
    h1("Opportunity");
    para(brief.opportunity.verdict, { bold: true, size: 12 });
    small(`Level ${brief.opportunity.level} · score ${brief.opportunity.score}/100 · ${brief.opportunity.confidence} · ${brief.opportunity.overallStrength} evidence`);
    doc.moveDown(0.4);
    for (const r of brief.opportunity.reasons.slice(0, 5)) bullet(r);
    doc.moveDown(0.3);
    para(`Next best action: ${brief.opportunity.nextBestAction}`, { bold: true });
  };

  const servicesBlock = (list: BriefService[], withEvidence: boolean) => {
    h1("Recommended services");
    for (const s of list) {
      if (doc.y > 700) doc.addPage();
      doc.font("Helvetica-Bold").fontSize(11).fillColor(INK).text(s.name, left, doc.y, { continued: true })
        .font("Helvetica").fontSize(8.5).fillColor(TEAL).text(`   ${s.strength ?? ""} evidence`);
      small(`${s.line} · ${s.category} · likely buyer: ${s.likelyBuyer}`);
      para(s.why, { size: 9.5 });
      if (withEvidence) {
        for (const e of s.evidence) {
          const tag = e.citations.length ? ` ${refs(e.citations)}` : " · Freyr analysis";
          doc.fillColor(MUTED).font("Helvetica").fontSize(8.5).text(`   – ${e.label} (${e.confidence}${asOf(e.observedAt)}, +${e.contribution})${tag}`, left + 6, doc.y, { width: contentW - 6 });
        }
      }
      doc.moveDown(0.5);
    }
  };

  const sources = () => {
    if (!brief.citations.length) return;
    h1("Sources & methodology");
    small("Recommendations are deterministic and evidence-weighted (confidence × recency, with a small corroboration bonus). Confidence: Verified / Likely / Inferred / Unknown. Items marked \u201cFreyr analysis\u201d are internal, non-cited assessments.");
    doc.moveDown(0.3);
    for (const { n, citation } of brief.citations) {
      const date = citation.publishedAt || citation.retrievedAt || citation.dateRetrieved;
      doc.fillColor(INK).font("Helvetica").fontSize(8.5).text(`[${n}] ${citation.publisher ? citation.publisher + " — " : ""}${citation.label}${date ? ` (${date.slice(0, 10)})` : ""}`, left, doc.y, { width: contentW, continued: false });
      if (citation.url && /^https?:/i.test(citation.url)) doc.fillColor(TEAL).fontSize(8).text(citation.url, { link: citation.url, underline: true, width: contentW });
    }
  };

  const personasBlock = (limit: number) => {
    h1("Stakeholders & talk track");
    for (const p of brief.personas.slice(0, limit)) {
      if (doc.y > 680) doc.addPage();
      para(p.title, { bold: true, size: 11 });
      small(`Cares about: ${p.caresAbout.join(", ")}`);
      small(`KPIs: ${p.kpis.join(", ")}`);
      para(`Opening: ${p.openingLine}`, { size: 9.5 });
      doc.moveDown(0.5);
    }
  };

  const outreachBlock = () => {
    h1(`Outreach pack — aimed at ${brief.primaryPersonaTitle}`);
    for (const m of brief.outreach) {
      if (doc.y > 680) doc.addPage();
      para(m.label, { bold: true, size: 10.5 });
      if (m.subject) small(`Subject: ${m.subject}`);
      para(m.body, { size: 9.5 });
      doc.moveDown(0.6);
    }
  };

  const whyNowBlock = (limit: number) => {
    h1("Why now");
    for (const w of brief.whyNow.slice(0, limit)) {
      const tag = w.analysis ? " · Freyr analysis" : ` ${refs(w.citations)}`;
      doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(w.headline, left, doc.y, { width: contentW, continued: true })
        .font("Helvetica").fontSize(8.5).fillColor(MUTED).text(`${conf(w.confidence)}${asOf(w.observedAt)}${tag}`);
      small(w.whyItMatters);
      doc.moveDown(0.3);
    }
  };

  // ---------- deliverable composition ----------
  if (deliverable === "account-brief") {
    cover("Account Brief");
    opportunityBlock();
    h1("Company snapshot");
    for (const i of brief.snapshot) insightLine(i);
    h1("Signals & intelligence");
    for (const g of brief.signals) {
      para(g.category, { bold: true, size: 10 });
      for (const i of g.items) insightLine(i);
      doc.moveDown(0.3);
    }
    whyNowBlock(8);
    servicesBlock(brief.services, true);
    personasBlock(3);
    outreachBlock();
    sources();
  } else if (deliverable === "exec-summary") {
    cover("Executive Summary");
    opportunityBlock();
    servicesBlock(brief.services.slice(0, 3), false);
    whyNowBlock(3);
    sources();
  } else if (deliverable === "meeting-prep") {
    cover(`Meeting Prep — ${brief.primaryPersonaTitle}`);
    whyNowBlock(5);
    h1(`Talk track — ${brief.primaryPersonaTitle}`);
    {
      const p = brief.personas[0];
      if (p) {
        small(`Cares about: ${p.caresAbout.join(", ")} · KPIs: ${p.kpis.join(", ")}`);
        para(`Opening: ${p.openingLine}`);
        doc.moveDown(0.3);
        para("Discovery questions", { bold: true });
        for (const q of p.discoveryQuestions) bullet(q);
        doc.moveDown(0.3);
        para("Likely objections", { bold: true });
        for (const o of p.objections) { para(o.objection, { bold: true, size: 9.5 }); small(o.response); }
        doc.moveDown(0.3);
        para(`Recommended next step: ${p.recommendedNextStep}`, { bold: true });
      }
    }
    servicesBlock(brief.services.slice(0, 3), true);
    sources();
  } else {
    // outreach-pack
    cover("Outreach Pack");
    whyNowBlock(3);
    outreachBlock();
    servicesBlock(brief.services.slice(0, 3), false);
    sources();
  }

  doc.end();
  return done;
}
