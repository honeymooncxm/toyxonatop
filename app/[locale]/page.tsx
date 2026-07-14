import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { VenueSection } from "@/components/home/VenueSection";
import { PopularCities } from "@/components/home/PopularCities";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { OwnerCTA } from "@/components/home/OwnerCTA";
import { AdBanner } from "@/components/ads/AdBanner";
import {
  getFeaturedVenues,
  getPremiumVenues,
  getPopularVenues,
  getLatestVenues,
  getPopularCities,
  getHomeStats,
} from "@/lib/data/venues";
import { getActiveAds } from "@/lib/data/ads";

export default async function HomePage() {
  const t = await getTranslations("home");
  const common = await getTranslations("common");

  const [featured, premium, popular, latest, cities, stats, topAds, bannerAds] = await Promise.all([
    getFeaturedVenues(),
    getPremiumVenues(),
    getPopularVenues(),
    getLatestVenues(),
    getPopularCities(),
    getHomeStats(),
    getActiveAds("HOME_TOP"),
    getActiveAds("HOME_BANNER"),
  ]);

  return (
    <div>
      <Hero stats={stats} />

      {topAds.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
          <AdBanner ads={topAds} variant="strip" />
        </div>
      )}

      <VenueSection
        title={t("featuredTitle")}
        subtitle={t("featuredSubtitle")}
        venues={featured}
        viewAllHref="/search"
        viewAllLabel={common("viewAll")}
      />

      <PopularCities cities={cities} />

      <VenueSection
        title={t("popularVenuesTitle")}
        venues={popular}
        viewAllHref="/search?sort=rating"
        viewAllLabel={common("viewAll")}
      />

      <CategoryGrid />

      <VenueSection
        title={t("premiumTitle")}
        subtitle={t("premiumSubtitle")}
        venues={premium}
        viewAllHref="/search?luxury=1"
        viewAllLabel={common("viewAll")}
      />

      <VenueSection
        title={t("latestTitle")}
        venues={latest}
        viewAllHref="/search?sort=newest"
        viewAllLabel={common("viewAll")}
      />

      <OwnerCTA />

      {bannerAds.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner ads={bannerAds} variant="strip" />
        </div>
      )}

      <Testimonials />

      <FAQ />
    </div>
  );
}
