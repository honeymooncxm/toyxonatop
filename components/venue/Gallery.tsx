"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

// Venue photos can be owner-uploaded (data: URIs when Cloudinary isn't
// configured) or pasted links from any external host, so we use plain <img>
// instead of next/image (which requires every host to be allow-listed ahead
// of time and would otherwise crash the page).

export function Gallery({ photos, title }: { photos: { url: string; kind: string }[]; title: string }) {
  const t = useTranslations("venue");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const main = photos[0];
  const rest = photos.slice(1, 5);

  return (
    <div>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:rounded-3xl" style={{ height: "min(60vw, 480px)" }}>
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative col-span-4 row-span-2 sm:col-span-2"
        >
          {main && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={main.url} alt={title} className="h-full w-full object-cover" />
          )}
        </button>
        {rest.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i + 1)}
            className="relative col-span-1 row-span-1 hidden sm:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={title} className="h-full w-full object-cover" />
            {i === 3 && photos.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 text-sm font-medium text-white">
                <Images size={16} />+{photos.length - 5}
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setLightboxIndex(0)}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-charcoal-700 hover:text-gold-600 sm:hidden"
      >
        <Images size={15} />
        {t("gallery")} ({photos.length})
      </button>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={() => setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length)}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="relative h-[80vh] w-full max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[lightboxIndex].url} alt={title} className="h-full w-full object-contain" />
          </div>

          <button
            type="button"
            onClick={() => setLightboxIndex((i) => (i! + 1) % photos.length)}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 text-sm text-white/70">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
