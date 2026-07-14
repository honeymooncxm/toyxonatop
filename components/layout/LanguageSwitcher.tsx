"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, ChevronDown } from "lucide-react";
import clsx from "clsx";

const LOCALES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
] as const;

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
          variant === "light"
            ? "text-charcoal-700 hover:bg-charcoal-100"
            : "text-white/90 hover:bg-white/10",
        )}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={14} className={clsx("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-charcoal-100 bg-white py-1 card-shadow-lg animate-fade-in">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: l.code });
              }}
              className={clsx(
                "flex w-full items-center px-4 py-2 text-sm hover:bg-gold-50",
                l.code === locale ? "font-semibold text-gold-600" : "text-charcoal-700",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
