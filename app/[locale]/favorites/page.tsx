"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites";
import { VenueCard, type VenueCardData } from "@/components/venue/VenueCard";
import { VenueCardSkeleton } from "@/components/venue/VenueCardSkeleton";

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const ids = useFavoritesStore((s) => s.ids);
  const [venues, setVenues] = useState<VenueCardData[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setVenues([]);
      return;
    }
    setVenues(null);
    fetch(`/api/venues/by-ids?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => setVenues(data.venues ?? []));
  }, [ids]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-1 text-sm text-charcoal-500">{t("subtitle")}</p>

      {venues === null ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <VenueCardSkeleton key={i} />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-200 py-24 text-center">
          <Heart size={40} className="text-charcoal-300" />
          <p className="mt-4 text-sm text-charcoal-500">{t("empty")}</p>
          <Link
            href="/search"
            className="gold-gradient mt-5 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          >
            {t("browseCta")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {venues.map((v, i) => (
            <VenueCard key={v.id} venue={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
