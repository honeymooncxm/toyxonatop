import "server-only";
import { prisma } from "@/lib/prisma";

export async function getActiveAds(placement: "HOME_TOP" | "SEARCH_SIDEBAR" | "HOME_BANNER") {
  return prisma.advertisement.findMany({
    where: { placement, active: true },
    orderBy: { createdAt: "desc" },
  });
}
