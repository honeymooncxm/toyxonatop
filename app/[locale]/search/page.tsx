import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { searchVenues } from "@/lib/data/search-venues";
import { VenueCard } from "@/components/venue/VenueCard";
import { VenueCardSkeleton } from "@/components/venue/VenueCardSkeleton";
import { SearchFilters } from "@/components/search/SearchFilters";
import { FilterDrawer } from "@/components/search/FilterDrawer";
import { SortBar } from "@/components/search/SortBar";
import { Pagination } from "@/components/search/Pagination";
import { AdBanner } from "@/components/ads/AdBanner";
import { getActiveAds } from "@/lib/data/ads";
import { SearchX } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const t = await getTranslations("search");

  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }

  const [{ total, page, pageSize, venues }, sidebarAds] = await Promise.all([
    searchVenues(usp),
    getActiveAds("SEARCH_SIDEBAR"),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-charcoal-500">{t("resultsCount", { count: total })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={null}>
            <FilterDrawer />
          </Suspense>
          <Suspense fallback={null}>
            <SortBar />
          </Suspense>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-2xl border border-charcoal-100 bg-white p-5 card-shadow">
              <Suspense fallback={null}>
                <SearchFilters />
              </Suspense>
            </div>
            {sidebarAds.length > 0 && <AdBanner ads={sidebarAds} variant="sidebar" />}
          </div>
        </aside>

        <div>
          {venues.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-200 py-24 text-center">
              <SearchX size={40} className="text-charcoal-300" />
              <h3 className="mt-4 font-display text-lg font-semibold text-charcoal-800">{t("noResultsTitle")}</h3>
              <p className="mt-1.5 text-sm text-charcoal-500">{t("noResultsSubtitle")}</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <VenueCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {venues.map((v, i) => (
                  <VenueCard key={v.id} venue={v} index={i} />
                ))}
              </div>
            </Suspense>
          )}

          <Pagination page={page} totalPages={totalPages} searchParams={params} />
        </div>
      </div>
    </div>
  );
}
