import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "OWNER" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.dataUrl || typeof body.dataUrl !== "string") {
    return NextResponse.json({ error: "dataUrl required" }, { status: 400 });
  }

  const url = await uploadImage(body.dataUrl, "toyxonatop/venues");
  return NextResponse.json({ url });
}
