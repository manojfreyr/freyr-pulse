import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, tokenFor } from "@/lib/auth/gate";

export async function middleware(req: NextRequest) {
  const pass = process.env.APP_ACCESS_PASSPHRASE;
  if (!pass) return NextResponse.next(); // gate disabled (fallback/local dev)

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(ACCESS_COOKIE)?.value;
  const expected = await tokenFor(pass);
  if (cookie === expected) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.searchParams.set("next", pathname + (req.nextUrl.search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
