import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");

  const venues = await prisma.venue.findMany({
    where: status ? { status } : undefined,
    include: venueInclude,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ venues: venues.map(serializeVenue) });
}
