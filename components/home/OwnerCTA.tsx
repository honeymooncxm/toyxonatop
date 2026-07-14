"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";

export function OwnerCTA() {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="gold-gradient relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-16"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-white/10" />
        <Building2 className="mx-auto mb-4 opacity-90" size={32} />
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t("ctaBannerTitle")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/90 sm:text-base">{t("ctaBannerSubtitle")}</p>
        <Link
          href="/register-venue"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gold-700 shadow-md transition-transform hover:scale-105"
        >
          {t("ctaBannerButton")}
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
