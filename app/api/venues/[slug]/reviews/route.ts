import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { toJsonList, fromJsonList } from "@/lib/serialize";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue) return NextResponse.json({ error: "notFound" }, { status: 404 });

  const reviews = await prisma.review.findMany({
    where: { venueId: venue.id, status: "APPROVED" },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      photos: fromJsonList(r.photos),
      createdAt: r.createdAt,
      name: r.user?.name ?? r.guestName ?? "Mehmon",
    })),
  );
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue || venue.status !== "APPROVED") {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const session = await getSession();
  const { rating, comment, guestName, photos } = parsed.data;

  if (!session && !guestName) {
    return NextResponse.json({ error: "nameRequired" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      venueId: venue.id,
      userId: session?.sub ?? null,
      guestName: session ? null : guestName || null,
      rating,
      comment,
      photos: toJsonList(photos ?? []),
      status: "PENDING",
    },
  });

  return NextResponse.json({ id: review.id, status: review.status }, { status: 201 });
}
