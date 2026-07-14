import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Users, Wallet, MapPin, Calendar, Eye } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getVenueForViewer } from "@/lib/data/venue-detail";
import { getSimilarVenues } from "@/lib/data/venues";
import { prisma } from "@/lib/prisma";
import { fromJsonList } from "@/lib/serialize";
import { regionName, districtName } from "@/lib/regions";
import { formatNumber } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Gallery } from "@/components/venue/Gallery";
import { GoogleMapEmbed } from "@/components/venue/GoogleMapEmbed";
import { OwnerContactCard } from "@/components/venue/OwnerContactCard";
import { ShareButton } from "@/components/venue/ShareButton";
import { FavoriteButton } from "@/components/venue/FavoriteButton";
import { ReviewsSection, type ReviewItem } from "@/components/venue/ReviewsSection";
import { VenueSection } from "@/components/home/VenueSection";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("venue");
  const common = await getTranslations("common");

  const session = await getSession();
  const venue = await getVenueForViewer(slug, session);
  if (!venue) notFound();

  const [reviewRows, similar] = await Promise.all([
    prisma.review.findMany({
      where: { venueId: venue.id, status: "APPROVED" },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getSimilarVenues(venue.id, venue.region),
  ]);

  const reviews: ReviewItem[] = reviewRows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    photos: fromJsonList(r.photos),
    createdAt: r.createdAt.toISOString(),
    name: r.user?.name ?? r.guestName ?? "Mehmon",
  }));

  const description =
    locale === "ru" ? venue.descriptionRu : locale === "en" ? venue.descriptionEn : venue.descriptionUz;

  const services = venue.services.map((s) =>
    locale === "ru" ? s.nameRu : locale === "en" ? s.nameEn : s.nameUz,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {venue.status !== "APPROVED" && (
        <div className="mb-4 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3 text-sm font-medium text-gold-700">
          {t("pendingNotice")}
        </div>
      )}

      <Gallery photos={venue.photos} title={venue.hallName} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-1.5">
                {venue.featured && <Badge variant="gold">★ {common("featured")}</Badge>}
                {venue.luxury && <Badge variant="charcoal">{common("luxury")}</Badge>}
                {venue.budget && <Badge variant="outline">{common("budget")}</Badge>}
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold text-charcoal-900">{venue.hallName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-charcoal-500">
                <span className="flex items-center gap-1">
                  <MapPin size={15} />
                  {venue.address}, {districtName(venue.region, venue.district, locale)},{" "}
                  {regionName(venue.region, locale)}
                </span>
                {venue.reviewCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <RatingStars rating={venue.rating} size={14} />
                    <span className="font-medium text-charcoal-700">{venue.rating}</span>({venue.reviewCount})
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {t("viewCount", { count: venue.viewCount })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title={venue.hallName} />
              <FavoriteButton venueId={venue.id} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-charcoal-100 bg-white p-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Users className="text-gold-500" size={20} />
              <div>
                <div className="text-xs text-charcoal-400">{common("capacity")}</div>
                <div className="text-sm font-semibold text-charcoal-900">
                  {venue.capacityMin}–{venue.capacityMax} {common("guests")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="text-gold-500" size={20} />
              <div>
                <div className="text-xs text-charcoal-400">{common("price")}</div>
                <div className="text-sm font-semibold text-charcoal-900">
                  {formatNumber(venue.priceMin)}–{formatNumber(venue.priceMax)} {common("currency")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-gold-500" size={20} />
              <div>
                <div className="text-xs text-charcoal-400">{t("kitchen")}</div>
                <div className="text-sm font-semibold text-charcoal-900">{venue.kitchenType ?? "—"}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-charcoal-900">{t("description")}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-charcoal-600">{description}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-charcoal-900">{t("services")}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {venue.parking && <Badge variant="outline">{t("parking")}</Badge>}
              {venue.outdoorArea && <Badge variant="outline">{t("outdoorArea")}</Badge>}
              {venue.vipRoom && <Badge variant="outline">{t("vipRoom")}</Badge>}
              {venue.halal && <Badge variant="outline">{t("halalFood")}</Badge>}
              {services.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
          </div>

          {venue.videos.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-charcoal-900">{t("videoGallery")}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {venue.videos.map((v) => (
                  <div key={v.id} className="aspect-video overflow-hidden rounded-xl">
                    <iframe
                      src={v.url}
                      title={v.title ?? venue.hallName}
                      className="h-full w-full border-0"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-charcoal-900">{t("location")}</h2>
            <div className="mt-3">
              <GoogleMapEmbed lat={venue.lat} lng={venue.lng} address={venue.address} />
            </div>
          </div>

          <div className="mt-8">
            <ReviewsSection
              venueSlug={venue.slug}
              initialReviews={reviews}
              rating={venue.rating}
              reviewCount={venue.reviewCount}
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <OwnerContactCard
            ownerName={venue.ownerName}
            phones={venue.phones}
            telegram={venue.telegram}
            website={venue.website}
          />
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="mt-4">
          <VenueSection title={t("similarVenues")} venues={similar} />
        </div>
      )}
    </div>
  );
}
