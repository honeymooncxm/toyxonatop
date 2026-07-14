import "server-only";
import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/auth";

export async function logAdminAction(
  admin: SessionPayload,
  action: string,
  opts: { targetType?: string; targetId?: string; metadata?: Record<string, unknown>; ip?: string } = {},
) {
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.sub,
      adminEmail: admin.email,
      action,
      targetType: opts.targetType,
      targetId: opts.targetId,
      metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
      ip: opts.ip,
    },
  });
}
