import type { Prisma } from "@/generated/prisma/client";
import { fromJsonList } from "./serialize";

const venueWithRelations = {
  include: {
    photos: true,
    videos: true,
    services: true,
    categories: true,
    owner: { select: { id: true, name: true, email: true, phone: true, telegram: true } },
  },
} satisfies Prisma.VenueDefaultArgs;

export type VenueWithRelations = Prisma.VenueGetPayload<typeof venueWithRelations>;

export function serializeVenue(venue: VenueWithRelations) {
  return {
    ...venue,
    phones: fromJsonList(venue.phones),
  };
}

export type VenueDTO = ReturnType<typeof serializeVenue>;

export const venueInclude = venueWithRelations.include;
