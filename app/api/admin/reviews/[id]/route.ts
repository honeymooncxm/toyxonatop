import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getClientIp } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (body?.status !== "APPROVED" && body?.status !== "REJECTED") {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const review = await prisma.review.update({ where: { id }, data: { status: body.status } });

  const approvedReviews = await prisma.review.findMany({
    where: { venueId: review.venueId, status: "APPROVED" },
    select: { rating: true },
  });
  const reviewCount = approvedReviews.length;
  const rating = reviewCount
    ? Math.round((approvedReviews.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10
    : 0;

  await prisma.venue.update({ where: { id: review.venueId }, data: { reviewCount, rating } });

  await logAdminAction(admin, `review.${body.status.toLowerCase()}`, {
    targetType: "Review",
    targetId: id,
    ip: await getClientIp(),
  });

  return NextResponse.json({ id: review.id, status: review.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.review.delete({ where: { id } });
  await logAdminAction(admin, "review.delete", { targetType: "Review", targetId: id, ip: await getClientIp() });
  return NextResponse.json({ ok: true });
}
