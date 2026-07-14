"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LayoutDashboard, ClipboardList, Users, Megaphone, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { ADMIN_PATH } from "@/lib/admin-path";

const ITEMS = [
  { href: `/${ADMIN_PATH}`, key: "dashboard", icon: LayoutDashboard },
  { href: `/${ADMIN_PATH}/listings`, key: "listings", icon: ClipboardList },
  { href: `/${ADMIN_PATH}/users`, key: "users", icon: Users },
  { href: `/${ADMIN_PATH}/ads`, key: "ads", icon: Megaphone },
  { href: `/${ADMIN_PATH}/reviews`, key: "reviewsModeration", icon: MessageSquare },
] as const;

export function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
      {ITEMS.map(({ href, key, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "gold-gradient text-white" : "text-charcoal-600 hover:bg-charcoal-100",
            )}
          >
            <Icon size={16} />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
