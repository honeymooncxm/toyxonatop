import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  const referer = req.headers.get("referer");
  return NextResponse.redirect(referer ?? new URL("/", req.url));
}
