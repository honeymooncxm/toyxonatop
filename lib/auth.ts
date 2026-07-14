import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type Role = "CUSTOMER" | "OWNER" | "ADMIN";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: Role;
  tokenVersion: number;
};

const COOKIE_NAME = "toyxonatop_token";
const PENDING_2FA_COOKIE = "toyxonatop_2fa_pending";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-only-secret-change-me",
);

// Regular sessions last 30 days; admin sessions are deliberately short-lived
// (re-login required hourly) since that account can do the most damage.
const SESSION_TTL: Record<Role, string> = {
  CUSTOMER: "30d",
  OWNER: "30d",
  ADMIN: "1h",
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload, purpose: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL[payload.role])
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "session") return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string, role: Role) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: role === "ADMIN" ? 60 * 60 : 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Admin-only session check. Unlike getSession() (a fast JWT-only check used
 * on every page), this also confirms against the database that the account
 * still exists, is still an admin, and that the session hasn't been revoked
 * via "log out everywhere" (tokenVersion bump) — worth the extra query given
 * how sensitive this role is.
 */
export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { role: true, tokenVersion: true },
  });
  if (!user || user.role !== "ADMIN" || user.tokenVersion !== session.tokenVersion) {
    return null;
  }
  return session;
}

/** Bumps tokenVersion so every previously issued JWT for this user stops verifying as valid. */
export async function invalidateAllSessions(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });
}

// --- Two-factor "pending" token: issued right after a correct password for
// an admin account that has 2FA enabled, before the real session exists. ---

export async function signPending2FAToken(userId: string) {
  return new SignJWT({ sub: userId, purpose: "2fa_pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

export async function verifyPending2FAToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "2fa_pending") return null;
    return { sub: payload.sub as string };
  } catch {
    return null;
  }
}

export async function setPending2FACookie(token: string) {
  const store = await cookies();
  store.set(PENDING_2FA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });
}

export async function getPending2FACookie() {
  const store = await cookies();
  return store.get(PENDING_2FA_COOKIE)?.value ?? null;
}

export async function clearPending2FACookie() {
  const store = await cookies();
  store.delete(PENDING_2FA_COOKIE);
}

/** Best-effort real client IP, trusting the standard proxy headers Vercel sets. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
