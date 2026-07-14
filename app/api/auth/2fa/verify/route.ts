import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPending2FACookie,
  verifyPending2FAToken,
  clearPending2FACookie,
  signSession,
  setSessionCookie,
  getClientIp,
} from "@/lib/auth";
import { verifyTotpCode } from "@/lib/totp";
import { recordLoginAttempt } from "@/lib/rate-limit";

/** Second step of admin login: exchanges a valid TOTP code for a real session. */
export async function POST(req: NextRequest) {
  const pendingToken = await getPending2FACookie();
  if (!pendingToken) {
    return NextResponse.json({ error: "noPendingLogin" }, { status: 400 });
  }
  const pending = await verifyPending2FAToken(pendingToken);
  if (!pending) {
    return NextResponse.json({ error: "sessionExpired" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  if (!code) {
    return NextResponse.json({ error: "codeRequired" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: pending.sub } });
  const ip = await getClientIp();

  if (!user?.twoFactorSecret || user.role !== "ADMIN" || !verifyTotpCode(user.email, user.twoFactorSecret, code)) {
    await recordLoginAttempt(ip, user?.email ?? "unknown", false);
    return NextResponse.json({ error: "invalidCode" }, { status: 400 });
  }

  await recordLoginAttempt(ip, user.email, true);
  await clearPending2FACookie();

  const role = user.role as "ADMIN";
  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role, tokenVersion: user.tokenVersion });
  await setSessionCookie(token, role);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
