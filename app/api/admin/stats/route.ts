import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [totalVenues, pending, approved, users, reviews, pendingReviews] = await Promise.all([
    prisma.venue.count(),
    prisma.venue.count({ where: { status: "PENDING" } }),
    prisma.venue.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
    prisma.review.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
  ]);

  return NextResponse.json({ totalVenues, pending, approved, users, reviews, pendingReviews });
}
