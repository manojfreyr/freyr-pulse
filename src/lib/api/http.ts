import { NextResponse } from "next/server";

export function ok(data: unknown, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Wraps a handler so repo/Supabase errors become clean 500 JSON, not crashes. */
export async function handle<T>(fn: () => Promise<T>) {
  try {
    return ok(await fn());
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
