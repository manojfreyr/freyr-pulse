import "server-only";
import type { ConnectorOutput, EnrichInput, LiveConnector } from "@/lib/connectors/types";
import { emptyOutput } from "@/lib/connectors/types";
import { getCached, setCached } from "@/lib/cache/sourceCache";
import type { CompanySignal, SourceCitation } from "@/lib/types";
import {
  discoverLinks,
  extractPageFacts,
  parseFeedItems,
  robotsDisallowsAll,
  signalsFromFeed,
  signalsFromPage,
  type PageKind,
} from "./parse";

const UA = "FreyrPulseBot/1.0 (+internal sales-intelligence research)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function normalizeBase(website: string): string | null {
  const w = website.trim();
  if (!w || w.toLowerCase() === "unknown") return null;
  const withProto = w.startsWith("http") ? w : `https://${w.replace(/^www\./, "")}`;
  try {
    const u = new URL(withProto);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

async function fetchText(url: string, accept: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: accept }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (accept.includes("html") && !/html|xml/i.test(ct) && ct) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function getHtml(url: string, bypass: boolean): Promise<string | null> {
  if (!bypass) {
    const cached = await getCached<string>("website", url);
    if (cached) return cached;
  }
  const html = await fetchText(url, "text/html");
  if (html) await setCached("website", url, html);
  return html;
}

export const websiteConnector: LiveConnector = {
  id: "website",
  label: "Company website",
  appliesTo(input: EnrichInput) {
    return Boolean(normalizeBase(input.website ?? ""));
  },
  async enrich(input, opts): Promise<ConnectorOutput> {
    const base = normalizeBase(input.website ?? "");
    if (!base) return emptyOutput("No usable website on file.");

    // Politeness: respect a blanket robots disallow.
    const robots = await fetchText(`${base}/robots.txt`, "text/plain");
    if (robots && robotsDisallowsAll(robots)) {
      return emptyOutput("robots.txt disallows crawling — skipped out of politeness.");
    }

    const home = await getHtml(base, opts.bypassCache);
    if (!home) return emptyOutput("Could not fetch the homepage (timeout, block, or non-HTML).");

    const signals: CompanySignal[] = [];
    const notes: string[] = [];
    const homeFacts = extractPageFacts(home, base);
    signals.push(...signalsFromPage(homeFacts, base));

    // Fetch a few high-value pages (polite, sequential, capped).
    const links = discoverLinks(homeFacts.anchors);
    const order: PageKind[] = ["about", "products", "pipeline"];
    let fetched = 0;
    for (const kind of order) {
      const url = links[kind];
      if (!url || fetched >= 3) continue;
      await sleep(300);
      const html = await getHtml(url, opts.bypassCache);
      fetched++;
      if (!html) continue;
      signals.push(...signalsFromPage(extractPageFacts(html, url), url));
    }

    // Newsroom RSS/Atom → trigger signals (first-party press).
    const feedCandidates = [...homeFacts.feedHrefs, `${base}/feed`, `${base}/rss`, `${base}/news/rss`];
    for (const feedUrl of feedCandidates) {
      await sleep(200);
      const xml = await fetchText(feedUrl, "application/rss+xml, application/atom+xml, application/xml, text/xml");
      if (!xml || !/<(item|entry)\b/i.test(xml)) continue;
      const items = parseFeedItems(xml);
      signals.push(...signalsFromFeed(items, feedUrl, homeFacts.siteName || input.name));
      notes.push(`Parsed ${items.length} newsroom item(s).`);
      break; // one working feed is enough
    }

    if (signals.length === 0) notes.push("No structured signals extracted (thin or JS-rendered site).");
    const citations: SourceCitation[] = signals.flatMap((s) => s.citations ?? []);
    return { signals, citations, notes };
  },
};
