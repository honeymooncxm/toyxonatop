import { getTranslations } from "next-intl/server";

type Ad = { id: string; title: string; imageUrl: string; linkUrl: string };

// Ad creatives are admin-entered URLs from arbitrary external hosts, so we use a
// plain <img> here instead of next/image (which requires every host to be
// allow-listed in next.config.ts ahead of time and otherwise throws).

export async function AdBanner({
  ads,
  variant = "strip",
}: {
  ads: Ad[];
  variant?: "strip" | "sidebar";
}) {
  if (ads.length === 0) return null;
  const t = await getTranslations("common");
  const ad = ads[0];

  if (variant === "sidebar") {
    return (
      <a
        href={ad.linkUrl}
        className="group relative block overflow-hidden rounded-2xl card-shadow"
      >
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
          {t("sponsored")}
        </span>
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="bg-white p-3 text-sm font-medium text-charcoal-800">{ad.title}</div>
      </a>
    );
  }

  return (
    <a
      href={ad.linkUrl}
      className="group relative block overflow-hidden rounded-2xl card-shadow"
    >
      <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
        {t("sponsored")}
      </span>
      <div className="relative aspect-[16/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 text-lg font-semibold text-white sm:p-6 sm:text-xl">{ad.title}</div>
    </a>
  );
}
