import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border border-charcoal-200 text-charcoal-600",
          page === 1 ? "pointer-events-none opacity-40" : "hover:border-gold-400 hover:text-gold-600",
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-charcoal-300">…</span>}
          <Link
            href={hrefFor(p)}
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
              p === page ? "gold-gradient text-white" : "text-charcoal-600 hover:bg-charcoal-100",
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border border-charcoal-200 text-charcoal-600",
          page === totalPages ? "pointer-events-none opacity-40" : "hover:border-gold-400 hover:text-gold-600",
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
