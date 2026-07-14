import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getClientIp } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.active !== "boolean") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const ad = await prisma.advertisement.update({ where: { id }, data: { active: body.active } });
  await logAdminAction(admin, body.active ? "ad.activate" : "ad.deactivate", { targetType: "Advertisement", targetId: id, ip: await getClientIp() });
  return NextResponse.json(ad);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.advertisement.delete({ where: { id } });
  await logAdminAction(admin, "ad.delete", { targetType: "Advertisement", targetId: id, ip: await getClientIp() });
  return NextResponse.json({ ok: true });
}
