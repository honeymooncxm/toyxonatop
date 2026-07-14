"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const KEYS = [1, 2, 3, 4, 5];

export function FAQ() {
  const t = useTranslations("home");
  const faq = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">
        {t("faqTitle")}
      </h2>
      <div className="mt-8 space-y-3">
        {KEYS.map((i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-charcoal-900 sm:text-base">{faq(`q${i}`)}</span>
                <ChevronDown
                  size={18}
                  className={clsx("shrink-0 text-charcoal-400 transition-transform", isOpen && "rotate-180 text-gold-500")}
                />
              </button>
              <div
                className={clsx(
                  "grid transition-all duration-300",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-charcoal-500">{faq(`a${i}`)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
