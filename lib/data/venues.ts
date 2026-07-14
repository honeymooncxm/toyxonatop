import "server-only";
import { prisma } from "@/lib/prisma";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";

export async function getFeaturedVenues(take = 8) {
  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED", featured: true },
    include: venueInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
  return venues.map(serializeVenue);
}

export async function getPremiumVenues(take = 6) {
  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED", luxury: true },
    include: venueInclude,
    orderBy: { priceMax: "desc" },
    take,
  });
  return venues.map(serializeVenue);
}

export async function getPopularVenues(take = 8) {
  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED" },
    include: venueInclude,
    orderBy: { viewCount: "desc" },
    take,
  });
  return venues.map(serializeVenue);
}

export async function getLatestVenues(take = 8) {
  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED" },
    include: venueInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
  return venues.map(serializeVenue);
}

export async function getPopularCities(take = 6) {
  const grouped = await prisma.venue.groupBy({
    by: ["region"],
    where: { status: "APPROVED" },
    _count: { region: true },
    orderBy: { _count: { region: "desc" } },
    take,
  });
  return grouped.map((g) => ({ region: g.region, count: g._count.region }));
}

export async function getSimilarVenues(venueId: string, region: string, take = 4) {
  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED", region, id: { not: venueId } },
    include: venueInclude,
    orderBy: { rating: "desc" },
    take,
  });
  return venues.map(serializeVenue);
}

export async function getHomeStats() {
  const [venues, cities, reviews] = await Promise.all([
    prisma.venue.count({ where: { status: "APPROVED" } }),
    prisma.venue.findMany({ where: { status: "APPROVED" }, select: { region: true }, distinct: ["region"] }),
    prisma.review.count({ where: { status: "APPROVED" } }),
  ]);
  return { venues, cities: cities.length, reviews };
}
