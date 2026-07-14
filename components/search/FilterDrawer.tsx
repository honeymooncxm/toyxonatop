"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchFilters } from "@/components/search/SearchFilters";

export function FilterDrawer() {
  const t = useTranslations("search");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-800 lg:hidden"
      >
        <SlidersHorizontal size={15} />
        {t("filters")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal-900/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-background p-5 shadow-2xl animate-fade-in">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-charcoal-600 card-shadow"
            >
              <X size={18} />
            </button>
            <SearchFilters onApplied={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
