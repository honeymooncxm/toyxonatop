import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

  await Promise.all(
    ids.map((venueId) =>
      prisma.favorite.upsert({
        where: { userId_venueId: { userId: session.sub, venueId } },
        update: {},
        create: { userId: session.sub, venueId },
      }),
    ),
  );

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.sub },
    select: { venueId: true },
  });
  return NextResponse.json({ ids: favorites.map((f) => f.venueId) });
}
