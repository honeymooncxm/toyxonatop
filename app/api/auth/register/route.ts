import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { name, email, password, phone, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "emailTaken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, phone: phone || null, role },
  });

  const userRole = user.role as "CUSTOMER" | "OWNER";
  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: userRole, tokenVersion: user.tokenVersion });
  await setSessionCookie(token, userRole);

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
