"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Heart, Menu, Scale, X, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useFavoritesStore } from "@/store/favorites";
import { useCompareStore } from "@/store/compare";
import type { SessionPayload } from "@/lib/auth";
import { ADMIN_PATH } from "@/lib/admin-path";
import clsx from "clsx";

export function Navbar({ user }: { user: SessionPayload | null }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const favCount = useFavoritesStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const links = [
    { href: "/", label: t("home") },
    { href: "/search", label: t("search") },
  ];

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all",
        scrolled ? "glass border-b border-charcoal-100/60" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-charcoal-100",
                pathname === l.href ? "text-gold-600" : "text-charcoal-700",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/compare"
            className="relative hidden rounded-full p-2.5 text-charcoal-700 hover:bg-charcoal-100 sm:flex"
            aria-label={t("compare")}
          >
            <Scale size={20} />
            {mounted && compareCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </Link>
          <Link
            href="/favorites"
            className="relative rounded-full p-2.5 text-charcoal-700 hover:bg-charcoal-100"
            aria-label={t("favorites")}
          >
            <Heart size={20} />
            {mounted && favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {user?.role === "ADMIN" && (
            <Link
              href={`/${ADMIN_PATH}`}
              className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-100 md:flex"
            >
              <ShieldCheck size={16} />
              {t("adminPanel")}
            </Link>
          )}
          {user?.role === "OWNER" && (
            <Link
              href="/owner/dashboard"
              className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-100 md:flex"
            >
              <LayoutDashboard size={16} />
              {t("ownerDashboard")}
            </Link>
          )}

          <Link
            href="/register-venue"
            className="hidden gold-gradient rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03] md:inline-flex"
          >
            {t("registerVenue")}
          </Link>

          {!user ? (
            <Link
              href="/login"
              className="hidden rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-800 hover:bg-charcoal-50 sm:inline-flex"
            >
              {t("login")}
            </Link>
          ) : (
            <form action="/api/auth/logout" method="post" className="hidden sm:inline-flex">
              <button
                type="submit"
                className="rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-800 hover:bg-charcoal-50"
              >
                {t("logout")}
              </button>
            </form>
          )}

          <button
            className="rounded-full p-2.5 text-charcoal-700 hover:bg-charcoal-100 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="glass border-t border-charcoal-100/60 px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal-800 hover:bg-charcoal-100"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/compare" className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal-800 hover:bg-charcoal-100">
              {t("compare")}
            </Link>
            {user?.role === "ADMIN" && (
              <Link href={`/${ADMIN_PATH}`} className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal-800 hover:bg-charcoal-100">
                {t("adminPanel")}
              </Link>
            )}
            {user?.role === "OWNER" && (
              <Link href="/owner/dashboard" className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal-800 hover:bg-charcoal-100">
                {t("ownerDashboard")}
              </Link>
            )}
            <Link
              href="/register-venue"
              className="gold-gradient mt-2 rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t("registerVenue")}
            </Link>
            {!user ? (
              <Link
                href="/login"
                className="rounded-xl border border-charcoal-200 px-4 py-3 text-center text-sm font-medium text-charcoal-800"
              >
                {t("login")}
              </Link>
            ) : (
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full rounded-xl border border-charcoal-200 px-4 py-3 text-center text-sm font-medium text-charcoal-800"
                >
                  {t("logout")}
                </button>
              </form>
            )}
            <div className="mt-2 flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
