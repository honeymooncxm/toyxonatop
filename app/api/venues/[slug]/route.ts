import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getVenueForViewer } from "@/lib/data/venue-detail";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  const venue = await getVenueForViewer(slug, session);
  if (!venue) return NextResponse.json({ error: "notFound" }, { status: 404 });
  return NextResponse.json(venue);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const venue = await prisma.venue.findUnique({ where: { slug } });
  if (!venue) return NextResponse.json({ error: "notFound" }, { status: 404 });
  if (venue.ownerId !== session.sub && session.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.venue.delete({ where: { id: venue.id } });
  return NextResponse.json({ ok: true });
}
