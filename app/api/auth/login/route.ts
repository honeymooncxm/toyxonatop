import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  signSession,
  setSessionCookie,
  signPending2FAToken,
  setPending2FACookie,
  getClientIp,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { isLoginLocked, recordLoginAttempt, countRecentFailures } from "@/lib/rate-limit";
import { notifyFailedLoginBurst } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalidCredentials" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const ip = await getClientIp();

  const { locked, retryAfterMinutes } = await isLoginLocked(ip, email);
  if (locked) {
    return NextResponse.json(
      { error: "tooManyAttempts", retryAfterMinutes },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !valid) {
    await recordLoginAttempt(ip, email, false);
    const recentFailures = await countRecentFailures(email, 5 * 60 * 1000);
    if (recentFailures >= 3) {
      await notifyFailedLoginBurst(email, recentFailures);
    }
    return NextResponse.json({ error: "invalidCredentials" }, { status: 401 });
  }

  const role = user.role as "CUSTOMER" | "OWNER" | "ADMIN";

  if (role === "ADMIN" && user.twoFactorEnabled) {
    await recordLoginAttempt(ip, email, true);
    const pendingToken = await signPending2FAToken(user.id);
    await setPending2FACookie(pendingToken);
    return NextResponse.json({ requires2FA: true });
  }

  await recordLoginAttempt(ip, email, true);

  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role,
    tokenVersion: user.tokenVersion,
  });
  await setSessionCookie(token, role);

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    requiresTwoFactorSetup: role === "ADMIN" && !user.twoFactorEnabled,
  });
}
