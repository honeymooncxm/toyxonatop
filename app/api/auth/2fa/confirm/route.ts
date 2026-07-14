import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verifyTotpCode } from "@/lib/totp";

/** Activates 2FA once the admin proves they scanned the QR correctly. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  if (!code) {
    return NextResponse.json({ error: "codeRequired" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "setupNotStarted" }, { status: 400 });
  }

  if (!verifyTotpCode(session.email, user.twoFactorSecret, code)) {
    return NextResponse.json({ error: "invalidCode" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
  return NextResponse.json({ ok: true });
}
