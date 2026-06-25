import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db";
import { dataMode } from "@/lib/db/dataMode";
import type { CustomerSegment, Market, SalesAsset, ServiceApplicabilityRule, ServiceAssetLink } from "@/lib/commercial/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * V2.0-A foundation validation. Reports data mode, seeded segment/market counts,
 * and an insert → read → delete round-trip for each of the five new tables (which,
 * in Supabase mode, proves the table exists and RLS permits read+write).
 */

type RT = { table: string; present: boolean; insert: boolean; read: boolean; delete: boolean; ok: boolean; error?: string };

async function roundTrip<T extends { id: string }>(
  table: string,
  repo: { upsert: (e: T) => Promise<T>; getById: (id: string) => Promise<T | null>; remove: (id: string) => Promise<void> },
  probe: T,
): Promise<RT> {
  try {
    await repo.upsert(probe);
    const read = await repo.getById(probe.id);
    const readOk = !!read && read.id === probe.id;
    await repo.remove(probe.id);
    const after = await repo.getById(probe.id);
    const deleteOk = !after || after.id !== probe.id;
    return { table, present: true, insert: true, read: readOk, delete: deleteOk, ok: readOk && deleteOk };
  } catch (e) {
    return { table, present: false, insert: false, read: false, delete: false, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET() {
  const mode = dataMode();
  const repos = getRepos();
  const ts = Date.now().toString(36);

  let segments: CustomerSegment[] = [];
  let markets: Market[] = [];
  try {
    segments = await repos.segments.list();
    markets = await repos.markets.list();
  } catch (e) {
    return NextResponse.json({ dataMode: mode, fatal: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  const probeSegment: CustomerSegment = { id: `__probe_seg_${ts}`, name: "__probe", status: "inactive", displayOrder: 999, classificationRules: [] };
  const probeMarket: Market = { id: `__probe_mkt_${ts}`, name: "__probe", region: "Americas", regulatoryBody: "X", status: "inactive", displayOrder: 999, relevanceRules: [] };
  const probeAsset: SalesAsset = { id: `__probe_asset_${ts}`, title: "__probe", assetType: "other", url: "https://example.com", status: "draft", tags: [] };
  const probeRule: ServiceApplicabilityRule = { id: `__probe_rule_${ts}`, serviceId: "__probe", segmentId: "*", marketId: "*", applicability: "applicable" };
  const probeLink: ServiceAssetLink = { id: `__probe_link_${ts}`, serviceId: "__probe", assetId: "__probe" };

  const roundTrips: RT[] = [
    await roundTrip("customer_segments", repos.segments, probeSegment),
    await roundTrip("markets", repos.markets, probeMarket),
    await roundTrip("sales_assets", repos.salesAssets, probeAsset),
    await roundTrip("service_applicability", repos.applicability, probeRule),
    await roundTrip("service_assets", repos.serviceAssets, probeLink),
  ];

  const salesAssetCount = (await repos.salesAssets.list()).length;
  const applicabilityCount = (await repos.applicability.list()).length;
  const serviceAssetCount = (await repos.serviceAssets.list()).length;

  const allTablesPresent = roundTrips.every((r) => r.present);
  const allRoundTripsOk = roundTrips.every((r) => r.ok);
  const pass =
    mode === "supabase" && segments.length === 10 && markets.length === 8 && allTablesPresent && allRoundTripsOk;

  return NextResponse.json({
    dataMode: mode,
    pass,
    summary: {
      segmentCount: segments.length,
      marketCount: markets.length,
      salesAssetCount,
      applicabilityCount,
      serviceAssetCount,
      allTablesPresent,
      allRoundTripsOk,
    },
    segments: segments.map((s) => ({ id: s.id, name: s.name, status: s.status, order: s.displayOrder })),
    markets: markets.map((m) => ({ id: m.id, name: m.name, region: m.region, regulatoryBody: m.regulatoryBody })),
    roundTrips,
    note:
      mode === "supabase"
        ? "pass=true requires supabase mode, 10 segments, 8 markets, all tables present, all round-trips ok."
        : "Not in Supabase mode — round-trips run against the in-memory fallback (parity check). Set Supabase env for the full check.",
  });
}
