import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { VenueCard, type VenueCardData } from "@/components/venue/VenueCard";

export function VenueSection({
  title,
  subtitle,
  venues,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  subtitle?: string;
  venues: VenueCardData[];
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  if (venues.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1.5 text-sm text-charcoal-500 sm:text-base">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700 sm:flex"
          >
            {viewAllLabel}
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {venues.map((v, i) => (
          <VenueCard key={v.id} venue={v} index={i} />
        ))}
      </div>
    </section>
  );
}
