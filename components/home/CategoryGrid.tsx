"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Building2, UtensilsCrossed, TreePine, Crown, Wallet, Sparkles } from "lucide-react";

const CATEGORIES = [
  { slug: "wedding-hall", icon: Building2 },
  { slug: "restaurant", icon: UtensilsCrossed },
  { slug: "garden", icon: TreePine },
  { slug: "vip", icon: Crown },
  { slug: "budget", icon: Wallet },
  { slug: "luxury", icon: Sparkles },
];

export function CategoryGrid() {
  const t = useTranslations("home");
  const cat = useTranslations("categories");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("categoriesTitle")}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map(({ slug, icon: Icon }, i) => (
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/search?category=${slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-charcoal-100 bg-white p-6 text-center card-shadow transition-all hover:-translate-y-1 hover:border-gold-300 hover:card-shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-colors group-hover:gold-gradient group-hover:text-white">
                <Icon size={22} />
              </div>
              <span className="text-sm font-medium text-charcoal-800">{cat(slug)}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
