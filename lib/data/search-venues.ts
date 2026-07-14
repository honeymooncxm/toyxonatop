import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export async function searchVenues(sp: URLSearchParams) {
  const where: Prisma.VenueWhereInput = { status: "APPROVED" };

  const region = sp.get("region");
  const district = sp.get("district");
  const q = sp.get("q");
  const guests = sp.get("guests");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const minRating = sp.get("minRating");
  const kitchenType = sp.get("kitchenType");
  const category = sp.get("category");

  if (region) where.region = region;
  if (district) where.district = district;
  if (q) {
    where.OR = [
      { hallName: { contains: q } },
      { businessName: { contains: q } },
      { address: { contains: q } },
    ];
  }
  if (guests) where.capacityMax = { gte: Number(guests) };
  if (minPrice) where.priceMax = { gte: Number(minPrice) };
  if (maxPrice) where.priceMin = { lte: Number(maxPrice) };
  if (minRating) where.rating = { gte: Number(minRating) };
  if (kitchenType) where.kitchenType = kitchenType;
  if (sp.get("parking") === "1") where.parking = true;
  if (sp.get("outdoorArea") === "1") where.outdoorArea = true;
  if (sp.get("vipRoom") === "1") where.vipRoom = true;
  if (sp.get("halal") === "1") where.halal = true;
  if (sp.get("luxury") === "1") where.luxury = true;
  if (sp.get("budget") === "1") where.budget = true;
  if (category) where.categories = { some: { slug: category } };

  const sort = sp.get("sort") ?? "recommended";
  const orderBy: Prisma.VenueOrderByWithRelationInput =
    sort === "priceAsc" ? { priceMin: "asc" } :
    sort === "priceDesc" ? { priceMax: "desc" } :
    sort === "rating" ? { rating: "desc" } :
    sort === "newest" ? { createdAt: "desc" } :
    { featured: "desc" };

  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const pageSize = DEFAULT_PAGE_SIZE;

  const [total, venues] = await Promise.all([
    prisma.venue.count({ where }),
    prisma.venue.findMany({
      where,
      include: venueInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return { total, page, pageSize, venues: venues.map(serializeVenue) };
}
