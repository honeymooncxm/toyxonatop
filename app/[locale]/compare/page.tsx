"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Scale, X, Check, Minus } from "lucide-react";
import { useCompareStore } from "@/store/compare";
import { RatingStars } from "@/components/ui/RatingStars";
import { regionName, districtName } from "@/lib/regions";
import { formatNumber } from "@/lib/format";

type CompareVenue = {
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
  parking: boolean;
  outdoorArea: boolean;
  vipRoom: boolean;
  halal: boolean;
  hasKitchen: boolean;
  kitchenType: string | null;
  photos: { url: string; kind: string }[];
};

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <Check size={18} className="mx-auto text-gold-600" />
  ) : (
    <Minus size={18} className="mx-auto text-charcoal-300" />
  );
}

export default function ComparePage() {
  const t = useTranslations("compare");
  const common = useTranslations("common");
  const search = useTranslations("search");
  const locale = useLocale();
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const [venues, setVenues] = useState<CompareVenue[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setVenues([]);
      return;
    }
    fetch(`/api/venues/by-ids?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => setVenues(data.venues ?? []));
  }, [ids]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-1 text-sm text-charcoal-500">{t("subtitle")}</p>

      {venues && venues.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-200 py-24 text-center">
          <Scale size={40} className="text-charcoal-300" />
          <p className="mt-4 max-w-sm text-sm text-charcoal-500">{t("empty")}</p>
          <Link href="/search" className="gold-gradient mt-5 rounded-full px-6 py-2.5 text-sm font-semibold text-white">
            {t("browseCta")}
          </Link>
        </div>
      ) : venues ? (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40"></th>
                {venues.map((v) => (
                  <th key={v.id} className="p-3 text-left">
                    <div className="relative">
                      <button
                        onClick={() => remove(v.id)}
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-charcoal-600 card-shadow"
                      >
                        <X size={14} />
                      </button>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.photos[0]?.url ?? ""}
                          alt={v.hallName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Link href={`/venue/${v.slug}`} className="mt-2 block font-display text-base font-semibold text-charcoal-900 hover:text-gold-600">
                        {v.hallName}
                      </Link>
                      <div className="text-xs text-charcoal-400">
                        {districtName(v.region, v.district, locale)}, {regionName(v.region, locale)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                {
                  label: common("rating"),
                  render: (v: CompareVenue) =>
                    v.reviewCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <RatingStars rating={v.rating} size={13} /> {v.rating} ({v.reviewCount})
                      </div>
                    ) : (
                      <Minus size={16} className="text-charcoal-300" />
                    ),
                },
                { label: search("capacity"), render: (v: CompareVenue) => `${v.capacityMin}–${v.capacityMax}` },
                {
                  label: common("price"),
                  render: (v: CompareVenue) => `${formatNumber(v.priceMin)} – ${formatNumber(v.priceMax)} ${common("currency")}`,
                },
                { label: search("kitchenType"), render: (v: CompareVenue) => v.kitchenType ?? "—" },
                { label: search("parking"), render: (v: CompareVenue) => <BoolCell value={v.parking} /> },
                { label: search("outdoorArea"), render: (v: CompareVenue) => <BoolCell value={v.outdoorArea} /> },
                { label: search("vipRoom"), render: (v: CompareVenue) => <BoolCell value={v.vipRoom} /> },
                { label: search("halal"), render: (v: CompareVenue) => <BoolCell value={v.halal} /> },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-charcoal-50/50"}>
                  <td className="p-3 text-xs font-semibold uppercase tracking-wide text-charcoal-400">{row.label}</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-3 text-center text-charcoal-800">
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
