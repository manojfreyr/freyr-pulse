import { NextResponse } from "next/server";
import { ACCESS_COOKIE, tokenFor } from "@/lib/auth/gate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const pass = process.env.APP_ACCESS_PASSPHRASE;
  if (!pass) return NextResponse.json({ ok: true, gate: "disabled" });

  let body: { passphrase?: string };
  try {
    body = (await req.json()) as { passphrase?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.passphrase || body.passphrase !== pass) {
    return NextResponse.json({ error: "Incorrect passphrase" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, await tokenFor(pass), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
