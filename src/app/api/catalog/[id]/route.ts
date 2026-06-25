import { getRepos } from "@/lib/db";
import { handle } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await getRepos().catalog.remove(params.id);
    return { id: params.id, deleted: true };
  });
}
