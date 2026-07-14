import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getClientIp } from "@/lib/auth";
import { VENUE_STATUSES } from "@/lib/constants";
import { logAdminAction } from "@/lib/audit-log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const data: { status?: string; featured?: boolean } = {};
  if (body.status && (VENUE_STATUSES as readonly string[]).includes(body.status)) {
    data.status = body.status;
  }
  if (typeof body.featured === "boolean") {
    data.featured = body.featured;
  }

  const venue = await prisma.venue.update({ where: { id }, data });

  const ip = await getClientIp();
  if (data.status) {
    await logAdminAction(admin, `venue.status.${data.status.toLowerCase()}`, { targetType: "Venue", targetId: id, ip });
  }
  if (typeof data.featured === "boolean") {
    await logAdminAction(admin, data.featured ? "venue.feature" : "venue.unfeature", { targetType: "Venue", targetId: id, ip });
  }

  return NextResponse.json({ id: venue.id, status: venue.status, featured: venue.featured });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const venue = await prisma.venue.delete({ where: { id } });
  await logAdminAction(admin, "venue.delete", {
    targetType: "Venue",
    targetId: id,
    metadata: { hallName: venue.hallName },
    ip: await getClientIp(),
  });
  return NextResponse.json({ ok: true });
}
