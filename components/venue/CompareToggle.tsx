"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Scale } from "lucide-react";
import clsx from "clsx";
import { useCompareStore, MAX_COMPARE } from "@/store/compare";

export function CompareToggle({ venueId, size = "md" }: { venueId: string; size?: "sm" | "md" }) {
  const t = useTranslations("compare");
  const has = useCompareStore((s) => s.ids.includes(venueId));
  const count = useCompareStore((s) => s.ids.length);
  const toggle = useCompareStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(venueId);
  }

  const disabled = mounted && !has && count >= MAX_COMPARE;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? t("maxReached", { count: MAX_COMPARE }) : undefined}
      className={clsx(
        "flex items-center justify-center rounded-full transition-all",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        "bg-white/90 backdrop-blur hover:scale-110 card-shadow disabled:opacity-40 disabled:hover:scale-100",
      )}
    >
      <Scale size={size === "sm" ? 15 : 17} className={mounted && has ? "text-gold-600" : "text-charcoal-600"} />
    </button>
  );
}
