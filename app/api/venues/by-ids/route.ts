import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : [];
  if (ids.length === 0) return NextResponse.json({ venues: [] });

  const venues = await prisma.venue.findMany({
    where: { id: { in: ids }, status: "APPROVED" },
    include: venueInclude,
  });

  const byId = new Map(venues.map((v) => [v.id, v]));
  const ordered = ids.map((id) => byId.get(id)).filter((v): v is NonNullable<typeof v> => Boolean(v));

  return NextResponse.json({ venues: ordered.map(serializeVenue) });
}
