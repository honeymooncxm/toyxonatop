"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { regionName } from "@/lib/regions";
import { placeholderImageUrl } from "@/lib/placeholder";

export function PopularCities({ cities }: { cities: { region: string; count: number }[] }) {
  const t = useTranslations("home");
  const locale = useLocale();

  if (cities.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("popularCitiesTitle")}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cities.map((c, i) => (
          <motion.div
            key={c.region}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/search?region=${c.region}`}
              className="group relative block overflow-hidden rounded-2xl card-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={placeholderImageUrl(`city-${c.region}`, 500, 500)}
                  alt={regionName(c.region, locale)}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="font-display text-sm font-semibold sm:text-base">{regionName(c.region, locale)}</div>
                <div className="text-xs text-white/80">{t("cityVenuesCount", { count: c.count })}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
