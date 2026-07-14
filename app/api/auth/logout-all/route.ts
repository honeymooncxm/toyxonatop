import { NextResponse } from "next/server";
import { getSession, clearSessionCookie, invalidateAllSessions } from "@/lib/auth";

/** Bumps the user's tokenVersion, instantly invalidating every previously issued session/device. */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await invalidateAllSessions(session.sub);
  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}
