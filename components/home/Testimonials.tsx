"use client";

import { useTranslations, useMessages } from "next-intl";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";

type Testimonial = { name: string; city: string; quote: string; rating: number };

export function Testimonials() {
  const t = useTranslations("home");
  const messages = useMessages() as unknown as { testimonials: { items: Testimonial[] } };
  const items = messages.testimonials.items;

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("testimonialsTitle")}</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-charcoal-100 bg-background p-5"
            >
              <Quote size={20} className="text-gold-400" />
              <p className="mt-3 text-sm leading-relaxed text-charcoal-700">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-charcoal-900">{item.name}</div>
                  <div className="text-xs text-charcoal-400">{item.city}</div>
                </div>
                <RatingStars rating={item.rating} size={13} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
