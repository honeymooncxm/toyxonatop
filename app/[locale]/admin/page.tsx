import { getTranslations } from "next-intl/server";
import { Building2, Clock, CheckCircle2, Users, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SecurityPanel } from "@/components/admin/SecurityPanel";
import { AuditLogPanel } from "@/components/admin/AuditLogPanel";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const session = await requireAdmin();

  const [totalVenues, pending, approved, users, reviews, me] = await Promise.all([
    prisma.venue.count(),
    prisma.venue.count({ where: { status: "PENDING" } }),
    prisma.venue.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
    prisma.review.count(),
    session ? prisma.user.findUnique({ where: { id: session.sub }, select: { twoFactorEnabled: true } }) : null,
  ]);

  const cards = [
    { label: t("statTotalVenues"), value: totalVenues, icon: Building2 },
    { label: t("statPending"), value: pending, icon: Clock },
    { label: t("statApproved"), value: approved, icon: CheckCircle2 },
    { label: t("statUsers"), value: users, icon: Users },
    { label: t("statReviews"), value: reviews, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-charcoal-100 bg-white p-5 card-shadow">
            <Icon size={20} className="text-gold-500" />
            <div className="mt-3 font-display text-2xl font-semibold text-charcoal-900">{value}</div>
            <div className="mt-1 text-xs text-charcoal-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SecurityPanel twoFactorEnabled={me?.twoFactorEnabled ?? false} />
        <AuditLogPanel />
      </div>
    </div>
  );
}
