"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { formatNumber } from "@/lib/format";

export function Hero({ stats }: { stats: { venues: number; cities: number; reviews: number } }) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-40 h-72 w-72 rounded-full bg-gold-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-1.5 text-xs font-semibold text-gold-700"
        >
          <Sparkles size={14} />
          {t("heroBadge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto max-w-3xl text-balance font-display text-4xl font-semibold leading-tight text-charcoal-900 sm:text-5xl lg:text-6xl"
        >
          {t("heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-balance text-base text-charcoal-500 sm:text-lg"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10"
        >
          <HeroSearch />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-8"
        >
          <Link
            href="/search"
            className="gold-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            {t("ctaButton")}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-charcoal-100 pt-8"
        >
          <div>
            <div className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{formatNumber(stats.venues)}+</div>
            <div className="mt-1 text-xs text-charcoal-500 sm:text-sm">{t("statsVenues")}</div>
          </div>
          <div>
            <div className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{stats.cities}+</div>
            <div className="mt-1 text-xs text-charcoal-500 sm:text-sm">{t("statsCities")}</div>
          </div>
          <div>
            <div className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{formatNumber(stats.reviews * 37)}+</div>
            <div className="mt-1 text-xs text-charcoal-500 sm:text-sm">{t("statsCustomers")}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
