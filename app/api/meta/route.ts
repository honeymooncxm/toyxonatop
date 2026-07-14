import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [services, categories] = await Promise.all([
    prisma.service.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);
  return NextResponse.json({ services, categories });
}
