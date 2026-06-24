import "server-only";
import pptxgen from "pptxgenjs";
import type { AccountBrief, Deliverable } from "./briefModel";
import { inlineTag } from "./citations";

const NAVY = "0E2436";
const TEAL = "0D9488";
const INK = "1F2933";
const MUTED = "6B7280";
const WHITE = "FFFFFF";

export async function renderPptx(brief: AccountBrief, deliverable: Deliverable): Promise<Buffer> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
  pptx.author = "Freyr Pulse";
  pptx.company = "Freyr";

  const W = 13.33;
  const footer = (s: pptxgen.Slide) => {
    s.addText(`Freyr Pulse · ${brief.company.name} · ${brief.generatedAt} · data as of ${brief.dataAsOf.slice(0, 10)} · Internal`, { x: 0.5, y: 7.05, w: W - 1, h: 0.3, fontSize: 8, color: MUTED });
  };
  const title = (subtitle: string) => {
    const s = pptx.addSlide();
    s.background = { color: NAVY };
    s.addText(brief.company.name, { x: 0.7, y: 2.4, w: W - 1.4, h: 1, fontSize: 40, bold: true, color: WHITE });
    s.addText(subtitle, { x: 0.7, y: 3.5, w: W - 1.4, h: 0.6, fontSize: 20, color: "9FB3C8" });
    s.addText(`${brief.company.segment} · ${brief.company.size} · ${brief.company.hq}`, { x: 0.7, y: 4.2, w: W - 1.4, h: 0.4, fontSize: 13, color: "7DD3C8" });
    s.addText(`Prepared by Freyr Pulse · ${brief.generatedAt} · data as of ${brief.dataAsOf.slice(0, 10)}${brief.researched ? "" : " · not yet researched"}`, { x: 0.7, y: 4.8, w: W - 1.4, h: 0.4, fontSize: 11, color: "9FB3C8" });
  };
  const content = (heading: string) => {
    const s = pptx.addSlide();
    s.background = { color: WHITE };
    s.addText(heading, { x: 0.5, y: 0.3, w: W - 1, h: 0.5, fontSize: 20, bold: true, color: NAVY });
    s.addShape(pptx.ShapeType.line, { x: 0.5, y: 0.85, w: W - 1, h: 0, line: { color: TEAL, width: 2 } });
    footer(s);
    return s;
  };
  type Row = { text: string; options?: pptxgen.TextPropsOptions };
  const bullets = (s: pptxgen.Slide, rows: Row[], y = 1.1, h = 5.6) => {
    s.addText(
      rows.map((r) => ({ text: r.text, options: { bullet: true, fontSize: 12, color: INK, paraSpaceAfter: 6, ...r.options } })),
      { x: 0.6, y, w: W - 1.2, h, valign: "top" },
    );
  };

  // ---- Title ----
  title(deliverable === "exec-summary" ? "Executive Summary" : "Account Brief");

  // ---- Opportunity ----
  {
    const s = content("Opportunity");
    s.addText(brief.opportunity.verdict, { x: 0.6, y: 1.0, w: W - 1.2, h: 0.8, fontSize: 18, bold: true, color: NAVY });
    s.addText(`Level ${brief.opportunity.level} · score ${brief.opportunity.score}/100 · ${brief.opportunity.confidence} · ${brief.opportunity.overallStrength} evidence`, { x: 0.6, y: 1.8, w: W - 1.2, h: 0.4, fontSize: 12, color: TEAL });
    bullets(s, brief.opportunity.reasons.slice(0, 5).map((r) => ({ text: r })), 2.3, 3.2);
    s.addText(`Next best action: ${brief.opportunity.nextBestAction}`, { x: 0.6, y: 5.7, w: W - 1.2, h: 0.6, fontSize: 12, bold: true, color: INK });
  }

  // ---- Recommended services ----
  {
    const s = content("Recommended services");
    const list = (deliverable === "exec-summary" ? brief.services.slice(0, 3) : brief.services.slice(0, 6));
    bullets(s, list.map((sv) => ({ text: `${sv.name}  —  ${sv.strength ?? ""} evidence`, options: { bold: true, fontSize: 13 } })));
    // sub-why lines
    let y = 1.15;
    for (const sv of list) {
      s.addText(sv.why, { x: 0.9, y: y + 0.32, w: W - 1.6, h: 0.5, fontSize: 9.5, color: MUTED });
      y += (5.6 / list.length);
    }
  }

  // ---- Why now ----
  {
    const s = content("Why now");
    const list = brief.whyNow.slice(0, deliverable === "exec-summary" ? 3 : 6);
    bullets(s, list.map((w) => ({ text: `${w.headline}  ${w.analysis ? "· Freyr analysis" : w.citations.map(inlineTag).join(" ")}`, options: { fontSize: 12 } })));
  }

  if (deliverable === "account-brief") {
    // ---- Snapshot ----
    {
      const s = content("Company snapshot");
      bullets(s, brief.snapshot.map((i) => ({ text: `${i.label}${i.value ? `: ${i.value}` : ""}  ${i.analysis ? "· Freyr analysis" : i.citations.map(inlineTag).join(" ")}` })));
    }
    // ---- Signals ----
    {
      const s = content("Signals & intelligence");
      const rows: Row[] = [];
      for (const g of brief.signals) {
        rows.push({ text: g.category, options: { bold: true, color: NAVY, bullet: false } });
        for (const i of g.items.slice(0, 4)) rows.push({ text: `${i.label} (${i.confidence ?? "—"})`, options: { fontSize: 11 } });
      }
      bullets(s, rows);
    }
    // ---- Stakeholders ----
    {
      const s = content("Stakeholders");
      bullets(s, brief.personas.slice(0, 3).map((p) => ({ text: `${p.title} — cares about: ${p.caresAbout.slice(0, 3).join(", ")}`, options: { fontSize: 12 } })));
    }
    // ---- Outreach ----
    {
      const s = content(`Outreach starters — ${brief.primaryPersonaTitle}`);
      bullets(s, brief.outreach.slice(0, 4).map((m) => ({ text: `${m.label}${m.subject ? ` — ${m.subject}` : ""}`, options: { bold: true, fontSize: 12 } })));
    }
  }

  // ---- Sources ----
  if (brief.citations.length) {
    const s = content("Sources & methodology");
    bullets(s, brief.citations.map((c) => ({ text: `[${c.n}] ${c.citation.publisher ? c.citation.publisher + " — " : ""}${c.citation.label}  ${c.citation.url && /^https?:/i.test(c.citation.url) ? c.citation.url : ""}`, options: { fontSize: 9 } })));
  }

  const out = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  return out;
}
