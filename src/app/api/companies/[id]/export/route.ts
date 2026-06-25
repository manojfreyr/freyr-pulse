import { getRepos } from "@/lib/db";
import { bad } from "@/lib/api/http";
import { buildAccountBrief, FORMAT_MATRIX, type Deliverable, type ExportFormat } from "@/lib/export/briefModel";
import { PERSONA_BY_ID } from "@/lib/mock/personas";
import type { PersonaId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME: Record<ExportFormat, string> = {
  pdf: "application/pdf",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function POST(req: Request, { params }: { params: { id: string } }) {
  let body: { deliverable?: Deliverable; format?: ExportFormat; persona?: PersonaId; generatedAt?: string };
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body", 400);
  }

  const deliverable = body.deliverable;
  const format = body.format;
  if (!deliverable || !FORMAT_MATRIX[deliverable]) return bad("Unknown deliverable", 400);
  if (!format || !FORMAT_MATRIX[deliverable].includes(format)) return bad(`Format ${format} not available for ${deliverable}`, 400);
  if (body.persona && !PERSONA_BY_ID[body.persona]) return bad("Unknown persona", 400);

  const company = await getRepos().companies.getById(params.id);
  if (!company) return bad("Company not found", 404);

  // Same catalog the dashboard ranks against → guaranteed parity.
  const catalog = await getRepos().catalog.list();
  const active = catalog.filter((s) => s.activeStatus);

  const generatedAt = body.generatedAt ?? new Date().toISOString().slice(0, 10);
  const brief = buildAccountBrief(company, active, { generatedAt, personaId: body.persona });

  let buffer: Buffer;
  try {
    if (format === "pdf") {
      const { renderPdf } = await import("@/lib/export/pdf");
      buffer = await renderPdf(brief, deliverable);
    } else if (format === "pptx") {
      const { renderPptx } = await import("@/lib/export/pptx");
      buffer = await renderPptx(brief, deliverable);
    } else {
      const { renderDocx } = await import("@/lib/export/docx");
      buffer = await renderDocx(brief, deliverable);
    }
  } catch (err) {
    return bad(`Export render failed: ${(err as Error).message}`, 500);
  }

  const filename = `${company.id}-${deliverable}.${format}`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": MIME[format],
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
