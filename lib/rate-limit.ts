import "server-only";
import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

/**
 * DB-backed (not in-memory) so lockout state survives across serverless
 * function instances — an in-memory counter would silently reset on every
 * cold start on Vercel and never actually lock anyone out.
 */
export async function isLoginLocked(ip: string, email: string): Promise<{ locked: boolean; retryAfterMinutes: number }> {
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS);
  const recentFailures = await prisma.loginAttempt.count({
    where: { ip, email, success: false, createdAt: { gte: since } },
  });

  if (recentFailures < MAX_FAILED_ATTEMPTS) {
    return { locked: false, retryAfterMinutes: 0 };
  }

  const oldestRecentFailure = await prisma.loginAttempt.findFirst({
    where: { ip, email, success: false, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });
  const unlocksAt = (oldestRecentFailure?.createdAt.getTime() ?? Date.now()) + LOCKOUT_WINDOW_MS;
  const retryAfterMinutes = Math.max(1, Math.ceil((unlocksAt - Date.now()) / 60000));
  return { locked: true, retryAfterMinutes };
}

export async function recordLoginAttempt(ip: string, email: string, success: boolean) {
  await prisma.loginAttempt.create({ data: { ip, email, success } });
}

/** Counts consecutive recent failures for alerting (task: failed-login email notice). */
export async function countRecentFailures(email: string, withinMs: number): Promise<number> {
  const since = new Date(Date.now() - withinMs);
  return prisma.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } });
}
