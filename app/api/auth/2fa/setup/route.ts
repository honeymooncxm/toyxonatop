import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateTotpSecret, generateTotpQrCode } from "@/lib/totp";

/** Generates (but does not yet activate) a new TOTP secret for the current admin. */
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const secret = generateTotpSecret();
  await prisma.user.update({
    where: { id: session.sub },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
  });

  const qrCodeDataUrl = await generateTotpQrCode(session.email, secret);
  return NextResponse.json({ secret, qrCodeDataUrl });
}
