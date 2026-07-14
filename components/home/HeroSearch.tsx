"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import { REGIONS } from "@/lib/regions";

export function HeroSearch() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  function nameFor(r: (typeof REGIONS)[number]) {
    return locale === "ru" ? r.nameRu : locale === "en" ? r.nameEn : r.nameUz;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (guests) params.set("guests", guests);
    if (date) params.set("date", date);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass mx-auto flex w-full max-w-4xl flex-col gap-2 rounded-3xl border border-white/40 p-3 card-shadow-lg sm:flex-row sm:items-stretch sm:rounded-full sm:p-2"
    >
      <label className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 sm:rounded-full sm:py-2">
        <MapPin size={18} className="shrink-0 text-gold-500" />
        <div className="flex min-w-0 flex-col text-left">
          <span className="text-[11px] font-medium text-charcoal-400">{t("searchLocationLabel")}</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full truncate bg-transparent text-sm font-medium text-charcoal-900 outline-none"
          >
            <option value="">{t("searchLocationPlaceholder")}</option>
            {REGIONS.map((r) => (
              <option key={r.slug} value={r.slug}>
                {nameFor(r)}
              </option>
            ))}
          </select>
        </div>
      </label>

      <div className="hidden w-px bg-charcoal-100 sm:block" />

      <label className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 sm:rounded-full sm:py-2">
        <Calendar size={18} className="shrink-0 text-gold-500" />
        <div className="flex min-w-0 flex-col text-left">
          <span className="text-[11px] font-medium text-charcoal-400">{t("searchDateLabel")}</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-charcoal-900 outline-none"
          />
        </div>
      </label>

      <div className="hidden w-px bg-charcoal-100 sm:block" />

      <label className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 sm:rounded-full sm:py-2">
        <Users size={18} className="shrink-0 text-gold-500" />
        <div className="flex min-w-0 flex-col text-left">
          <span className="text-[11px] font-medium text-charcoal-400">{t("searchGuestsLabel")}</span>
          <input
            type="number"
            min={0}
            placeholder={t("searchGuestsPlaceholder")}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-charcoal-900 outline-none placeholder:text-charcoal-300"
          />
        </div>
      </label>

      <button
        type="submit"
        className="gold-gradient flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] sm:rounded-full"
      >
        <Search size={16} />
        <span className="sm:hidden">{t("ctaButton")}</span>
      </button>
    </form>
  );
}
