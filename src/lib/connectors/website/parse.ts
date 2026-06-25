import { parse } from "node-html-parser";
import type { CompanySignal, SourceCitation } from "@/lib/types";

/**
 * Deterministic, rule-based website parsing — NO LLM. Extracts from <title>,
 * meta/OpenGraph, JSON-LD, headings, anchor links, and RSS/Atom feeds, then maps
 * keyword hits to signals. Structured evidence (JSON-LD/meta/og) → Likely;
 * heading/body pattern hits → Inferred. Pure + unit-testable against fixtures.
 */

export interface PageFacts {
  title: string;
  description: string;
  siteName: string;
  ogText: string;
  jsonLdText: string;
  headings: string[];
  anchors: { href: string; text: string }[];
  feedHrefs: string[];
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function extractPageFacts(html: string, baseUrl: string): PageFacts {
  const root = parse(html, { lowerCaseTagName: true, comment: false });
  const title = root.querySelector("title")?.text?.trim() || "";
  const meta = (name: string) =>
    root.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
    root.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ||
    "";
  const description = (meta("description") || meta("og:description")).trim();
  const siteName = (meta("og:site_name") || "").trim();
  const ogText = [meta("og:title"), meta("og:description"), meta("keywords")].filter(Boolean).join(" ");

  const jsonLdText = root
    .querySelectorAll('script[type="application/ld+json"]')
    .map((s) => s.text || "")
    .join(" ")
    .slice(0, 20000);

  const headings = root.querySelectorAll("h1,h2,h3").map((h) => h.text.trim()).filter(Boolean).slice(0, 60);

  const anchors = root
    .querySelectorAll("a")
    .map((a) => ({ href: resolveUrl(a.getAttribute("href") || "", baseUrl), text: (a.text || "").trim() }))
    .filter((a) => a.href.startsWith("http"));

  const feedHrefs = root
    .querySelectorAll('link[rel="alternate"]')
    .filter((l) => /rss|atom|xml/i.test(l.getAttribute("type") || ""))
    .map((l) => resolveUrl(l.getAttribute("href") || "", baseUrl))
    .filter(Boolean);

  return { title, description, siteName, ogText, jsonLdText, headings, anchors, feedHrefs };
}

export type PageKind = "about" | "products" | "pipeline" | "news" | "locations" | "leadership";

const LINK_PATTERNS: Record<PageKind, RegExp> = {
  about: /about|who-we-are|company|overview/i,
  products: /products?|solutions?|services?|portfolio|therapies/i,
  pipeline: /pipeline|research|r-?and-?d|development|science/i,
  news: /news|press|media|newsroom|releases?/i,
  locations: /locations?|global|where-we|offices?|contact/i,
  leadership: /leadership|team|management|executives?|people/i,
};

/** Pick one best URL per page kind from a page's anchors. */
export function discoverLinks(anchors: { href: string; text: string }[]): Partial<Record<PageKind, string>> {
  const found: Partial<Record<PageKind, string>> = {};
  for (const kind of Object.keys(LINK_PATTERNS) as PageKind[]) {
    const pat = LINK_PATTERNS[kind];
    const hit = anchors.find((a) => pat.test(a.href) || pat.test(a.text));
    if (hit) found[kind] = hit.href;
  }
  return found;
}

// Keyword dictionaries (deterministic).
const THERAPEUTIC_TERMS = ["oncology", "cardiology", "neurology", "immunology", "vaccine", "vaccines", "rare disease", "diabetes", "respiratory", "dermatology", "ophthalmology", "hematology", "gene therapy", "cell therapy", "mrna", "biosimilar"];
const SEGMENT_TERMS = ["pharmaceutical", "biotech", "biotechnology", "medical device", "medtech", "diagnostics", "cro", "contract research", "digital health", "consumer health", "generics"];
const TRIGGER_TERMS: { key: string; pat: RegExp }[] = [
  { key: "m&a", pat: /acqui|merger|acquisition/i },
  { key: "launch", pat: /launch|introduc|unveil/i },
  { key: "approval", pat: /approval|approved|fda clears?|ce mark|marketing authoris/i },
  { key: "expansion", pat: /expand|expansion|new facility|new site|opens? (a )?(new )?(office|plant|facility)/i },
  { key: "leadership", pat: /appoint|names? (new )?(ceo|cfo|chief)|joins as|new chief/i },
];

function dedupe(signals: CompanySignal[]): CompanySignal[] {
  const seen = new Set<string>();
  const out: CompanySignal[] = [];
  for (const s of signals) {
    if (!seen.has(s.key)) {
      seen.add(s.key);
      out.push(s);
    }
  }
  return out;
}

function websiteCitation(label: string, url: string, publisher?: string): SourceCitation {
  const at = new Date().toISOString();
  return { sourceType: "website", label, url, publisher, type: "Company Website", dateRetrieved: at, retrievedAt: at };
}

/** Signals from one parsed page. Structured text (JSON-LD/og/meta/title) →
 *  Likely; headings/body → Inferred. */
export function signalsFromPage(facts: PageFacts, pageUrl: string): CompanySignal[] {
  const structured = `${facts.title} ${facts.description} ${facts.siteName} ${facts.ogText} ${facts.jsonLdText}`.toLowerCase();
  const loose = `${structured} ${facts.headings.join(" ")}`.toLowerCase();
  const publisher = facts.siteName || facts.title || undefined;
  const cite = websiteCitation(facts.title || "Company website", pageUrl, publisher);
  const out: CompanySignal[] = [];

  for (const term of THERAPEUTIC_TERMS) {
    if (loose.includes(term)) {
      const confident = structured.includes(term);
      out.push({ key: term, label: term, category: "therapeutic-area", confidence: confident ? "Likely" : "Inferred", source: "Company website", sourceType: "website", citations: [cite] });
    }
  }
  for (const term of SEGMENT_TERMS) {
    if (loose.includes(term)) {
      const confident = structured.includes(term);
      out.push({ key: term, label: term, category: "segment", confidence: confident ? "Likely" : "Inferred", source: "Company website", sourceType: "website", citations: [cite] });
    }
  }
  return dedupe(out);
}

export interface FeedItem {
  title: string;
  link: string;
  date?: string;
}

/** Minimal, deterministic RSS/Atom item extraction (regex; no XML lib). */
export function parseFeedItems(xml: string, limit = 8): FeedItem[] {
  const items: FeedItem[] = [];
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  for (const b of blocks.slice(0, limit)) {
    const title = (b.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    let link = b.match(/<link[^>]*href="([^"]+)"/i)?.[1] || b.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || "";
    link = link.trim();
    const date = (b.match(/<(pubDate|published|updated)[^>]*>([\s\S]*?)<\/\1>/i)?.[2] || "").trim() || undefined;
    if (title) items.push({ title, link, date });
  }
  return items;
}

/** Map recent press/news items to trigger signals (first-party press = Likely). */
export function signalsFromFeed(items: FeedItem[], feedUrl: string, publisher?: string): CompanySignal[] {
  const out: CompanySignal[] = [];
  for (const item of items) {
    const text = item.title.toLowerCase();
    for (const t of TRIGGER_TERMS) {
      if (t.pat.test(text)) {
        const cite: SourceCitation = {
          sourceType: "news",
          label: item.title.slice(0, 120),
          url: item.link || feedUrl,
          publisher,
          type: "Press Release",
          dateRetrieved: new Date().toISOString(),
          retrievedAt: new Date().toISOString(),
          ...(item.date ? { publishedAt: item.date } : {}),
        };
        out.push({ key: t.key, label: item.title.slice(0, 80), category: "trigger", confidence: "Likely", source: "Company newsroom", sourceType: "news", citations: [cite], ...(item.date ? { observedAt: item.date } : {}) });
      }
    }
  }
  return out;
}

/** Best-effort robots.txt check: true if our crawl is broadly disallowed. */
export function robotsDisallowsAll(robotsTxt: string): boolean {
  // Look at the "*" user-agent group for a blanket "Disallow: /".
  const lines = robotsTxt.split(/\r?\n/).map((l) => l.trim());
  let inStar = false;
  let blanket = false;
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith("user-agent:")) inStar = lower.includes("*");
    else if (inStar && lower.startsWith("disallow:")) {
      const path = line.split(":")[1]?.trim();
      if (path === "/") blanket = true;
    }
  }
  return blanket;
}

const GENERIC_TITLE = /\b(home|homepage|welcome|about|about us|products|pipeline|news|official site|official website)\b/i;

/**
 * Conservative, deterministic company-name extraction from page facts.
 * Prefers og:site_name; otherwise picks a brand-like segment of <title>.
 * Returns Inferred identity — never authoritative, never fabricated.
 */
export function identityFromFacts(facts: PageFacts): { name?: string; aliases?: string[] } {
  let name = (facts.siteName || "").trim();
  if (!name && facts.title) {
    const segs = facts.title.split(/[|\u2013\u2014\-:]/).map((s) => s.trim()).filter(Boolean);
    // brand is usually the shortest non-generic segment
    const candidates = segs.filter((s) => !GENERIC_TITLE.test(s) && s.length >= 2 && s.length <= 40);
    candidates.sort((a, b) => a.split(/\s+/).length - b.split(/\s+/).length);
    name = candidates[0] || segs[0] || "";
  }
  name = name.replace(/\s+/g, " ").trim();
  if (!name || name.length < 2 || name.length > 60 || GENERIC_TITLE.test(name)) return {};
  return { name, aliases: [name.toLowerCase()] };
}
