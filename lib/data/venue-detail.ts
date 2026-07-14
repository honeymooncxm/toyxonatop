import "server-only";
import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/auth";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";

export async function getVenueForViewer(slug: string, session: SessionPayload | null) {
  const venue = await prisma.venue.findUnique({ where: { slug }, include: venueInclude });
  if (!venue) return null;

  if (venue.status !== "APPROVED") {
    const isOwner = session?.sub === venue.ownerId;
    const isAdmin = session?.role === "ADMIN";
    if (!isOwner && !isAdmin) return null;
  } else {
    await prisma.venue.update({ where: { id: venue.id }, data: { viewCount: { increment: 1 } } });
  }

  return serializeVenue(venue);
}
