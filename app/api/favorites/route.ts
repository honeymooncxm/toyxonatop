import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ids: [] });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.sub },
    select: { venueId: true },
  });
  return NextResponse.json({ ids: favorites.map((f) => f.venueId) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.venueId) return NextResponse.json({ error: "venueId required" }, { status: 400 });

  await prisma.favorite.upsert({
    where: { userId_venueId: { userId: session.sub, venueId: body.venueId } },
    update: {},
    create: { userId: session.sub, venueId: body.venueId },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const venueId = req.nextUrl.searchParams.get("venueId");
  if (!venueId) return NextResponse.json({ error: "venueId required" }, { status: 400 });

  await prisma.favorite.deleteMany({ where: { userId: session.sub, venueId } });
  return NextResponse.json({ ok: true });
}
