import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { venueSchema } from "@/lib/validations";
import { toJsonList } from "@/lib/serialize";
import { searchVenues } from "@/lib/data/search-venues";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  const result = await searchVenues(req.nextUrl.searchParams);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "OWNER" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = venueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const baseSlug = slugify(data.hallName);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.venue.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const venue = await prisma.venue.create({
    data: {
      slug,
      ownerId: session.sub,
      businessName: data.businessName,
      hallName: data.hallName,
      ownerName: data.ownerName,
      phones: toJsonList(data.phones),
      telegram: data.telegram || null,
      email: data.email || null,
      website: data.website || null,
      instagram: data.instagram || null,
      region: data.region,
      district: data.district,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      capacityMin: data.capacityMin,
      capacityMax: data.capacityMax,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      descriptionUz: data.descriptionUz,
      descriptionRu: data.descriptionRu,
      descriptionEn: data.descriptionEn,
      parking: data.parking,
      outdoorArea: data.outdoorArea,
      vipRoom: data.vipRoom,
      halal: data.halal,
      luxury: data.luxury,
      budget: data.budget,
      hasKitchen: data.hasKitchen,
      kitchenType: data.kitchenType || null,
      virtualTourUrl: data.virtualTourUrl || null,
      status: "PENDING",
      services: { connect: data.serviceSlugs.map((s) => ({ slug: s })) },
      categories: { connect: data.categorySlugs.map((c) => ({ slug: c })) },
      photos: {
        create: [
          ...data.photosInterior.map((url, i) => ({ url, kind: "INTERIOR", order: i })),
          ...data.photosExterior.map((url, i) => ({ url, kind: "EXTERIOR", order: i })),
        ],
      },
      videos: { create: data.videos.map((url) => ({ url })) },
    },
  });

  return NextResponse.json({ id: venue.id, slug: venue.slug }, { status: 201 });
}
