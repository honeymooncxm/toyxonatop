"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { REGIONS } from "@/lib/regions";

type Filters = {
  region: string;
  district: string;
  guests: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  kitchenType: string;
  parking: boolean;
  outdoorArea: boolean;
  vipRoom: boolean;
  halal: boolean;
  luxury: boolean;
  budget: boolean;
};

function readFilters(sp: URLSearchParams): Filters {
  return {
    region: sp.get("region") ?? "",
    district: sp.get("district") ?? "",
    guests: sp.get("guests") ?? "",
    minPrice: sp.get("minPrice") ?? "",
    maxPrice: sp.get("maxPrice") ?? "",
    minRating: sp.get("minRating") ?? "",
    kitchenType: sp.get("kitchenType") ?? "",
    parking: sp.get("parking") === "1",
    outdoorArea: sp.get("outdoorArea") === "1",
    vipRoom: sp.get("vipRoom") === "1",
    halal: sp.get("halal") === "1",
    luxury: sp.get("luxury") === "1",
    budget: sp.get("budget") === "1",
  };
}

export function SearchFilters({ onApplied }: { onApplied?: () => void }) {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => readFilters(searchParams));

  function nameFor(r: (typeof REGIONS)[number]) {
    return locale === "ru" ? r.nameRu : locale === "en" ? r.nameEn : r.nameUz;
  }

  const selectedRegion = REGIONS.find((r) => r.slug === filters.region);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value, ...(key === "region" ? { district: "" } : {}) }));
  }

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const entries: [keyof Filters, string][] = [
      ["region", filters.region],
      ["district", filters.district],
      ["guests", filters.guests],
      ["minPrice", filters.minPrice],
      ["maxPrice", filters.maxPrice],
      ["minRating", filters.minRating],
      ["kitchenType", filters.kitchenType],
    ];
    for (const [key, value] of entries) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    for (const key of ["parking", "outdoorArea", "vipRoom", "halal", "luxury", "budget"] as const) {
      if (filters[key]) params.set(key, "1");
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
    onApplied?.();
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of [
      "region", "district", "guests", "minPrice", "maxPrice", "minRating",
      "kitchenType", "parking", "outdoorArea", "vipRoom", "halal", "luxury", "budget", "page",
    ]) {
      params.delete(key);
    }
    setFilters(readFilters(params));
    router.push(`${pathname}?${params.toString()}`);
    onApplied?.();
  }

  const checkboxes: { key: keyof Filters; label: string }[] = [
    { key: "parking", label: t("parking") },
    { key: "outdoorArea", label: t("outdoorArea") },
    { key: "vipRoom", label: t("vipRoom") },
    { key: "halal", label: t("halal") },
    { key: "luxury", label: t("luxury") },
    { key: "budget", label: t("budget") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-charcoal-900">{t("filters")}</h3>
        <button type="button" onClick={clearAll} className="flex items-center gap-1 text-xs font-medium text-charcoal-400 hover:text-gold-600">
          <X size={13} />
          {t("clearAll")}
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("region")}</label>
        <select
          value={filters.region}
          onChange={(e) => update("region", e.target.value)}
          className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
        >
          <option value="">{t("allRegions")}</option>
          {REGIONS.map((r) => (
            <option key={r.slug} value={r.slug}>{nameFor(r)}</option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("district")}</label>
          <select
            value={filters.district}
            onChange={(e) => update("district", e.target.value)}
            className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
          >
            <option value="">{t("allDistricts")}</option>
            {selectedRegion.districts.map((d) => (
              <option key={d.slug} value={d.slug}>
                {locale === "ru" ? d.nameRu : locale === "en" ? d.nameEn : d.nameUz}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("capacity")}</label>
        <input
          type="number"
          min={0}
          value={filters.guests}
          onChange={(e) => update("guests", e.target.value)}
          placeholder="200"
          className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("priceRange")}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder={t("minPrice")}
            className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
          />
          <span className="text-charcoal-300">–</span>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder={t("maxPrice")}
            className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("kitchenType")}</label>
        <input
          type="text"
          value={filters.kitchenType}
          onChange={(e) => update("kitchenType", e.target.value)}
          placeholder="Milliy, Turk, Yevropa..."
          className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("minRating")}</label>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update("minRating", filters.minRating === String(r) ? "" : String(r))}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.minRating === String(r)
                  ? "border-gold-500 bg-gold-50 text-gold-700"
                  : "border-charcoal-200 text-charcoal-600 hover:border-gold-300"
              }`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("amenities")}</label>
        <div className="space-y-2.5">
          {checkboxes.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-700">
              <input
                type="checkbox"
                checked={Boolean(filters[key])}
                onChange={(e) => update(key, e.target.checked as never)}
                className="h-4 w-4 rounded border-charcoal-300 text-gold-500 focus:ring-gold-400"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={apply}
        className="gold-gradient w-full rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        {t("applyFilters")}
      </button>
    </div>
  );
}
