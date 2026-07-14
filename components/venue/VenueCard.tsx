"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/venue/FavoriteButton";
import { CompareToggle } from "@/components/venue/CompareToggle";
import { regionName, districtName } from "@/lib/regions";
import { formatNumber } from "@/lib/format";
import { placeholderImageUrl } from "@/lib/placeholder";

export type VenueCardData = {
  id: string;
  slug: string;
  hallName: string;
  region: string;
  district: string;
  capacityMin: number;
  capacityMax: number;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  luxury: boolean;
  budget: boolean;
  photos: { url: string; kind: string; order: number }[];
};

export function VenueCard({ venue, index = 0 }: { venue: VenueCardData; index?: number }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const cover =
    venue.photos.find((p) => p.kind === "EXTERIOR")?.url ??
    venue.photos[0]?.url ??
    placeholderImageUrl(venue.slug, 800, 600, venue.hallName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        href={`/venue/${venue.slug}`}
        className="group block overflow-hidden rounded-[1.25rem] bg-white card-shadow transition-shadow hover:card-shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={venue.hallName}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-wrap gap-1.5">
              {venue.featured && <Badge variant="gold">★ {t("featured")}</Badge>}
              {venue.luxury && <Badge variant="charcoal">{t("luxury")}</Badge>}
              {venue.budget && <Badge variant="outline" className="bg-white/90">{t("budget")}</Badge>}
            </div>
            <div className="flex flex-col gap-1.5">
              <FavoriteButton venueId={venue.id} size="sm" />
              <CompareToggle venueId={venue.id} size="sm" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug text-charcoal-900 group-hover:text-gold-600">
              {venue.hallName}
            </h3>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-sm text-charcoal-500">
            <MapPin size={14} />
            <span>
              {districtName(venue.region, venue.district, locale)}, {regionName(venue.region, locale)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-sm text-charcoal-500">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {venue.capacityMin}–{venue.capacityMax}
            </span>
            {venue.reviewCount > 0 ? (
              <span className="flex items-center gap-1">
                <RatingStars rating={venue.rating} size={13} />
                <span className="text-charcoal-700">{venue.rating}</span>
                <span>({venue.reviewCount})</span>
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-baseline justify-between border-t border-charcoal-100 pt-3">
            <span className="font-display text-base font-semibold text-charcoal-900">
              {formatNumber(venue.priceMin)} – {formatNumber(venue.priceMax)}
            </span>
            <span className="text-xs text-charcoal-400">{t("currency")}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
