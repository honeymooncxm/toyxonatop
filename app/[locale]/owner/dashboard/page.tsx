import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Eye, Star, Plus } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeVenue, venueInclude } from "@/lib/venue-dto";
import { regionName, districtName } from "@/lib/regions";
import { formatNumber } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export default async function OwnerDashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "OWNER" && session.role !== "ADMIN")) {
    redirect("/login?next=/owner/dashboard");
  }

  const t = await getTranslations("ownerDashboard");
  const locale = await getLocale();

  const rows = await prisma.venue.findMany({
    where: { ownerId: session.sub },
    include: venueInclude,
    orderBy: { createdAt: "desc" },
  });
  const venues = rows.map(serializeVenue);

  const statusBadge = (status: string) => {
    if (status === "APPROVED") return <Badge variant="gold">{t("statusApproved")}</Badge>;
    if (status === "REJECTED") return <Badge variant="outline">{t("statusRejected")}</Badge>;
    return <Badge variant="charcoal">{t("statusPending")}</Badge>;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-charcoal-500">{t("subtitle")}</p>
        </div>
        <Link
          href="/register-venue"
          className="gold-gradient flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {t("addNew")}
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-charcoal-200 py-20 text-center text-sm text-charcoal-500">
          {t("empty")}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {venues.map((v) => (
            <div key={v.id} className="flex flex-col gap-4 rounded-2xl border border-charcoal-100 bg-white p-4 card-shadow sm:flex-row sm:items-center">
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-32">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {v.photos[0] && <img src={v.photos[0].url} alt={v.hallName} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-charcoal-900">{v.hallName}</h3>
                  {statusBadge(v.status)}
                  {v.featured && <Star size={14} className="fill-gold-500 text-gold-500" />}
                </div>
                <p className="mt-1 text-xs text-charcoal-500">
                  {districtName(v.region, v.district, locale)}, {regionName(v.region, locale)} · {v.capacityMin}–{v.capacityMax}{" "}
                  · {formatNumber(v.priceMin)}–{formatNumber(v.priceMax)} so&apos;m
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-400">
                  <Eye size={12} />
                  {v.viewCount}
                </p>
              </div>
              {v.status === "APPROVED" && (
                <Link
                  href={`/venue/${v.slug}`}
                  className="shrink-0 rounded-full border border-charcoal-200 px-4 py-2 text-center text-xs font-medium text-charcoal-700 hover:border-gold-300"
                >
                  {t("viewListing")}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
