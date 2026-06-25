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
    const count = async () => (await sb.from(table).select("id", { count: "exact", head: true }).eq("id", id)).count ?? -1;

    const ins = await sb.from(table).insert({ id, name: "__raw", status: "inactive", display_order: 999, data: { id, name: "__raw", status: "inactive", displayOrder: 999 }, updated_at: new Date().toISOString() }).select("*");
    const countAfterInsert = await count();
    const allAfterInsert = await sb.from(table).select("*").eq("id", id);

    const del = await sb.from(table).delete().eq("id", id).select("*");
    const countImmediatelyAfterDelete = await count();
    const rowAfterDelete = (await sb.from(table).select("*").eq("id", id)).data?.[0] ?? null;

    await new Promise((r) => setTimeout(r, 600));
    const countAfter600ms = await count();

    const del2 = await sb.from(table).delete().eq("id", id).select("id");
    const countAfterSecondDelete = await count();

    const repoGetById = await getRepos().serviceTypes.getById(id); // seed-merge path, for comparison

    // Unique-constraint check: insert the same id twice. If the 2nd insert does NOT
    // error, the table has no PK/unique on id (create-if-not-exists hit a pre-existing
    // table without the constraint) — the prime suspect for delete anomalies.
    const dupId = `__rawdup_${ts}`;
    const dupRow = { id: dupId, name: "__dup", status: "inactive", display_order: 999, data: { id: dupId }, updated_at: new Date().toISOString() };
    await sb.from(table).insert(dupRow);
    const dup2 = await sb.from(table).insert(dupRow);
    const dupCount = (await sb.from(table).select("id", { count: "exact", head: true }).eq("id", dupId)).count ?? -1;
    const uniqueConstraintOnId = Boolean(dup2.error) || dupCount <= 1;
    await sb.from(table).delete().eq("id", dupId);

    // best-effort cleanup
    await sb.from(table).delete().eq("id", id);

    let interpretation: string;
    if (ins.error) interpretation = "INSERT errored — see insertError.";
    else if (!uniqueConstraintOnId) interpretation = `ROOT CAUSE: table service_types has NO primary key / unique constraint on id (a duplicate insert succeeded; ${dupCount} rows share an id). 'create table if not exists' was a no-op against a pre-existing table that lacks the PK. FIX: add a primary key on id (see remediation SQL).`;
    else if (del.error) interpretation = "DELETE errored — see deleteError.";
    else if (countImmediatelyAfterDelete === 0) interpretation = "DELETE WORKS at the DB: 0 rows immediately after delete. If validation still fails it's the repo/round-trip, not the DB.";
    else if (countAfter600ms === 0) interpretation = "READ-VISIBILITY LAG: row present right after delete but gone after 600ms — a read-replica/visibility delay. Disable read replicas or route reads to primary.";
    else if (countAfterSecondDelete >= 1) interpretation = "ROW IS RE-CREATED: survives repeated deletes — a trigger/rule on service_types re-inserts it. Inspect triggers on the table.";
    else interpretation = "Row persisted after first delete but cleared on second — investigate further.";

    return NextResponse.json({
      dataMode: mode,
      table,
      "1_insertedId": id,
      "2_readBackId": allAfterInsert.data?.[0]?.id ?? null,
      "3_deletePassedId": id,
      "4_deleteResponse": { error: del.error?.message ?? null, code: del.error?.code ?? null, returnedCount: del.data?.length ?? 0, returnedRow: del.data?.[0] ?? null },
      "5_deleteSelectReturned": del.error ? "error" : (del.data?.length ?? 0) === 0 ? "zero rows" : `id=${del.data?.[0]?.id}`,
      "6_afterDeleteRowStillExists": countImmediatelyAfterDelete > 0,
      counts: { afterInsert: countAfterInsert, immediatelyAfterDelete: countImmediatelyAfterDelete, after600ms: countAfter600ms, afterSecondDelete: countAfterSecondDelete },
      rowAfterDelete,
      secondDeleteReturnedCount: del2.data?.length ?? 0,
      uniqueConstraintOnId,
      duplicateInsertError: dup2.error?.message ?? null,
      repoGetByIdAfterDelete: repoGetById ? repoGetById.id : null,
      insertError: ins.error?.message ?? null,
      deleteError: del.error?.message ?? null,
      interpretation,
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
