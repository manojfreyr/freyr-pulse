import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db";
import { dataMode } from "@/lib/db/dataMode";
import type { ServiceType, CustomerSegment, Market, SalesAsset, ServiceApplicabilityRule, ServiceAssetLink } from "@/lib/commercial/types";

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
  let insert = false;
  let read = false;
  let del = false;
  let error: string | undefined;
  try {
    await repo.upsert(probe);
    insert = true;
    const r = await repo.getById(probe.id);
    read = !!r && r.id === probe.id;
    try {
      await repo.remove(probe.id);
      const after = await repo.getById(probe.id);
      del = !after || after.id !== probe.id;
    } catch (e) {
      error = `delete: ${e instanceof Error ? e.message : String(e)}`;
    }
    return { table, present: true, insert, read, delete: del, ok: insert && read && del, ...(error ? { error } : {}) };
  } catch (e) {
    return { table, present: false, insert, read, delete: del, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: Request) {
  const mode = dataMode();
  const repos = getRepos();
  const ts = Date.now().toString(36);

  // Raw probe: exact insert/read/delete/read responses for one table (service_types).
  if (new URL(req.url).searchParams.get("raw") === "1") {
    if (mode !== "supabase") return NextResponse.json({ dataMode: mode, note: "raw probe requires supabase mode" });
    const { getSupabase } = await import("@/lib/db/supabaseClient");
    const sb = getSupabase();
    const table = "service_types";
    const id = `__rawprobe_${ts}`;
    const ins = await sb.from(table).insert({ id, name: "__raw", status: "inactive", display_order: 999, data: { id, name: "__raw", status: "inactive", displayOrder: 999 }, updated_at: new Date().toISOString() }).select("id");
    const read1 = await sb.from(table).select("id").eq("id", id).maybeSingle();
    const del = await sb.from(table).delete().eq("id", id).select("id");
    const read2 = await sb.from(table).select("id").eq("id", id).maybeSingle();
    // best-effort cleanup if still present
    if (read2.data) await sb.from(table).delete().eq("id", id);
    return NextResponse.json({
      dataMode: mode,
      table,
      "1_insertedId": id,
      "2_readBackId": read1.data?.id ?? null,
      "3_deletePassedId": id,
      "4_deleteResponse": { error: del.error?.message ?? null, code: del.error?.code ?? null, returnedRows: del.data ?? null, returnedCount: del.data?.length ?? 0 },
      "5_deleteSelectReturned": del.error ? "error" : (del.data?.length ?? 0) === 0 ? "zero rows" : `id=${del.data?.[0]?.id}`,
      "6_afterDeleteRowStillExists": Boolean(read2.data),
      insertError: ins.error?.message ?? null,
      verdict:
        del.error ? "DELETE returned an error (see 4)."
          : read2.data ? "Row STILL EXISTS after delete — delete is being filtered/blocked at the DB."
          : (del.data?.length ?? 0) === 0 ? "Row WAS deleted, but .delete().select() returned 0 rows — representation quirk; deleteById's re-read handles this."
          : "Row WAS deleted and .select() returned it — delete works; validation should pass.",
    });
  }

  let serviceTypes: ServiceType[] = [];
  let segments: CustomerSegment[] = [];
  let markets: Market[] = [];
  try {
    serviceTypes = await repos.serviceTypes.list();
    segments = await repos.segments.list();
    markets = await repos.markets.list();
  } catch (e) {
    return NextResponse.json({ dataMode: mode, fatal: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  const probeType: ServiceType = { id: `__probe_type_${ts}`, name: "__probe", status: "inactive", displayOrder: 999 };
  const probeSegment: CustomerSegment = { id: `__probe_seg_${ts}`, name: "__probe", status: "inactive", displayOrder: 999, classificationRules: [] };
  const probeMarket: Market = { id: `__probe_mkt_${ts}`, name: "__probe", region: "Americas", regulatoryBody: "X", status: "inactive", displayOrder: 999, relevanceRules: [] };
  const probeAsset: SalesAsset = { id: `__probe_asset_${ts}`, title: "__probe", assetType: "other", url: "https://example.com", status: "draft", tags: [] };
  const probeRule: ServiceApplicabilityRule = { id: `__probe_rule_${ts}`, serviceId: "__probe", segmentId: "*", marketId: "*", applicability: "applicable" };
  const probeLink: ServiceAssetLink = { id: `__probe_link_${ts}`, serviceId: "__probe", assetId: "__probe" };

  const roundTrips: RT[] = [
    await roundTrip("service_types", repos.serviceTypes, probeType),
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
    mode === "supabase" && serviceTypes.length === 8 && segments.length === 10 && markets.length === 8 && allTablesPresent && allRoundTripsOk;

  return NextResponse.json({
    dataMode: mode,
    pass,
    summary: {
      serviceTypeCount: serviceTypes.length,
      segmentCount: segments.length,
      marketCount: markets.length,
      salesAssetCount,
      applicabilityCount,
      serviceAssetCount,
      allTablesPresent,
      allRoundTripsOk,
    },
    serviceTypes: serviceTypes.map((t) => ({ id: t.id, name: t.name, status: t.status, order: t.displayOrder })),
    segments: segments.map((s) => ({ id: s.id, name: s.name, status: s.status, order: s.displayOrder })),
    markets: markets.map((m) => ({ id: m.id, name: m.name, region: m.region, regulatoryBody: m.regulatoryBody })),
    roundTrips,
    note:
      mode === "supabase"
        ? "pass=true requires supabase mode, 8 service types, 10 segments, 8 markets, all tables present, all round-trips ok."
        : "Not in Supabase mode — round-trips run against the in-memory fallback (parity check). Set Supabase env for the full check.",
  });
}
