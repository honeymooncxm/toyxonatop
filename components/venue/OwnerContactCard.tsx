import { useTranslations } from "next-intl";
import { Phone, Send, Globe, User } from "lucide-react";

export function OwnerContactCard({
  ownerName,
  phones,
  telegram,
  website,
}: {
  ownerName: string;
  phones: string[];
  telegram: string | null;
  website: string | null;
}) {
  const t = useTranslations("venue");

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-5 card-shadow">
      <h3 className="font-display text-lg font-semibold text-charcoal-900">{t("ownerContact")}</h3>

      <div className="mt-3 flex items-center gap-2 text-sm text-charcoal-600">
        <User size={15} />
        {ownerName}
      </div>

      <div className="mt-4 space-y-2.5">
        {phones.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="gold-gradient flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            <Phone size={16} />
            {phone}
          </a>
        ))}

        {telegram && (
          <a
            href={`https://t.me/${telegram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-charcoal-200 py-3 text-sm font-medium text-charcoal-800 hover:border-gold-300"
          >
            <Send size={15} />
            {t("sendTelegram")}
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-charcoal-200 py-3 text-sm font-medium text-charcoal-800 hover:border-gold-300"
          >
            <Globe size={15} />
            {t("visitWebsite")}
          </a>
        )}
      </div>
    </div>
  );
}
