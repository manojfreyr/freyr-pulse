import { currentDataMode } from "@/lib/db";
import { ok } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return ok({ status: "ok", dataMode: currentDataMode() });
}
