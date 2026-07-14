"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check, X } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";

type AdminReview = {
  id: string;
  rating: number;
  comment: string;
  name: string;
  status: string;
  venue: { hallName: string; slug: string };
};

export default function AdminReviewsPage() {
  const t = useTranslations("admin");
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);

  function load() {
    fetch("/api/admin/reviews?status=PENDING").then((r) => r.json()).then((d) => setReviews(d.reviews ?? []));
  }
  useEffect(load, []);

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="space-y-3">
      {reviews === null ? (
        <p className="text-sm text-charcoal-400">…</p>
      ) : reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-charcoal-200 py-16 text-center text-sm text-charcoal-500">{t("noPending")}</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-charcoal-100 bg-white p-4 card-shadow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Link href={`/venue/${r.venue.slug}`} className="font-medium text-charcoal-900 hover:text-gold-600">
                  {r.venue.hallName}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <RatingStars rating={r.rating} size={13} />
                  <span className="text-xs text-charcoal-400">{r.name}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => decide(r.id, "APPROVED")} className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium text-white">
                  <Check size={13} />
                </button>
                <button onClick={() => decide(r.id, "REJECTED")} className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
                  <X size={13} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-charcoal-600">{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
