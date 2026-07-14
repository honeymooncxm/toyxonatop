"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function SortBar() {
  const t = useTranslations("search");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "recommended";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recommended") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={sort}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-charcoal-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-800 outline-none focus:border-gold-400"
    >
      <option value="recommended">{t("sortRecommended")}</option>
      <option value="priceAsc">{t("sortPriceAsc")}</option>
      <option value="priceDesc">{t("sortPriceDesc")}</option>
      <option value="rating">{t("sortRating")}</option>
      <option value="newest">{t("sortNewest")}</option>
    </select>
  );
}
