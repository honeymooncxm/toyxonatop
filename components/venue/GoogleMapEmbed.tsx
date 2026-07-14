import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { mapEmbedUrl, mapLinkUrl } from "@/lib/maps";

export function GoogleMapEmbed({
  lat,
  lng,
  address,
}: {
  lat: number | null;
  lng: number | null;
  address: string;
}) {
  const t = useTranslations("common");

  return (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100">
      <iframe
        title="map"
        src={mapEmbedUrl(lat, lng, address)}
        width="100%"
        height="320"
        loading="lazy"
        className="border-0"
      />
      <a
        href={mapLinkUrl(lat, lng, address)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-charcoal-100 bg-white py-3 text-sm font-medium text-gold-600 hover:bg-gold-50"
      >
        <ExternalLink size={15} />
        {t("openInMaps")}
      </a>
    </div>
  );
}
