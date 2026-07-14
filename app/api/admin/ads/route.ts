import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getClientIp } from "@/lib/auth";
import { adSchema } from "@/lib/validations";
import { logAdminAction } from "@/lib/audit-log";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ads = await prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ads });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = adSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const ad = await prisma.advertisement.create({ data: parsed.data });
  await logAdminAction(admin, "ad.create", { targetType: "Advertisement", targetId: ad.id, metadata: { title: ad.title }, ip: await getClientIp() });
  return NextResponse.json(ad, { status: 201 });
}
