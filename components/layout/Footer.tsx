import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { AtSign, Send, Globe, Phone, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="mt-24 border-t border-charcoal-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal-500">{t("aboutText")}</p>
            <div className="mt-5 flex gap-3">
              {[AtSign, Send, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal-200 text-charcoal-600 transition-colors hover:border-gold-400 hover:text-gold-600"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-charcoal-900">{t("quickLinks")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-charcoal-500">
              <li><Link href="/" className="hover:text-gold-600">{nav("home")}</Link></li>
              <li><Link href="/search" className="hover:text-gold-600">{nav("search")}</Link></li>
              <li><Link href="/favorites" className="hover:text-gold-600">{nav("favorites")}</Link></li>
              <li><Link href="/compare" className="hover:text-gold-600">{nav("compare")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-charcoal-900">{t("forOwners")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-charcoal-500">
              <li><Link href="/register-venue" className="hover:text-gold-600">{nav("registerVenue")}</Link></li>
              <li><Link href="/login" className="hover:text-gold-600">{nav("login")}</Link></li>
              <li><Link href="/owner/dashboard" className="hover:text-gold-600">{nav("ownerDashboard")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-charcoal-900">{t("contact")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-charcoal-500">
              <li className="flex items-center gap-2"><Phone size={14} /> +998 71 200 00 00</li>
              <li className="flex items-center gap-2"><Mail size={14} /> hello@toyxonatop.uz</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-charcoal-100 pt-6 text-xs text-charcoal-400 sm:flex-row">
          <span>© {new Date().getFullYear()} To&apos;yxonaTop. {t("allRightsReserved")}</span>
        </div>
      </div>
    </footer>
  );
}
