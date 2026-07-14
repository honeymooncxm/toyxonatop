import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "OWNER" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const venues = await prisma.venue.findMany({
    where: { ownerId: session.sub },
    include: venueInclude,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ venues: venues.map(serializeVenue) });
}
