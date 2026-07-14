import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fromJsonList } from "@/lib/serialize";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") ?? "PENDING";

  const reviews = await prisma.review.findMany({
    where: { status },
    include: { venue: { select: { hallName: true, slug: true } }, user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      photos: fromJsonList(r.photos),
      createdAt: r.createdAt,
      status: r.status,
      name: r.user?.name ?? r.guestName ?? "Mehmon",
      venue: r.venue,
    })),
  });
}
