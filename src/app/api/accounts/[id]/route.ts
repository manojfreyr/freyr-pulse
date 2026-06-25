import type { SavedAccount } from "@/lib/types";
import { getRepos } from "@/lib/db";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let patch: Partial<SavedAccount>;
  try {
    patch = (await req.json()) as Partial<SavedAccount>;
  } catch {
    return bad("Invalid JSON body");
  }
  return handle(() => getRepos().accounts.update(params.id, patch));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  return handle(async () => {
    await getRepos().accounts.remove(params.id);
    return { companyId: params.id, deleted: true };
  });
}
