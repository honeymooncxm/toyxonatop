"use client";

import { useState } from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Star, MessageSquarePlus } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import { useAuth } from "@/components/providers/AuthProvider";

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
  name: string;
};

export function ReviewsSection({
  venueSlug,
  initialReviews,
  rating,
  reviewCount,
}: {
  venueSlug: string;
  initialReviews: ReviewItem[];
  rating: number;
  reviewCount: number;
}) {
  const t = useTranslations("venue");
  const format = useFormatter();
  const user = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rform, setRForm] = useState({ rating: 5, comment: "", guestName: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/venues/${venueSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: rform.rating,
          comment: rform.comment,
          guestName: user ? undefined : rform.guestName,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setRForm({ rating: 5, comment: "", guestName: "" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-charcoal-900">
            {t("reviews")} {reviewCount > 0 && `(${reviewCount})`}
          </h2>
          {reviewCount > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <RatingStars rating={rating} />
              <span className="text-sm font-medium text-charcoal-700">{rating}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-800 hover:border-gold-300"
        >
          <MessageSquarePlus size={15} />
          {t("writeReview")}
        </button>
      </div>

      {submitted && (
        <div className="mt-4 rounded-xl bg-gold-50 px-4 py-3 text-sm text-gold-700">{t("reviewSubmitted")}</div>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl border border-charcoal-100 bg-white p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              {t("yourRating")}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRForm((f) => ({ ...f, rating: n }))}>
                  <Star
                    size={26}
                    className={n <= rform.rating ? "fill-gold-500 text-gold-500" : "fill-none text-charcoal-200"}
                  />
                </button>
              ))}
            </div>
          </div>

          {!user && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                {t("yourName")}
              </label>
              <input
                required
                value={rform.guestName}
                onChange={(e) => setRForm((f) => ({ ...f, guestName: e.target.value }))}
                className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              {t("yourComment")}
            </label>
            <textarea
              required
              minLength={3}
              rows={3}
              value={rform.comment}
              onChange={(e) => setRForm((f) => ({ ...f, comment: e.target.value }))}
              className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="gold-gradient rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {t("submitReview")}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-5">
        {reviews.length === 0 ? (
          <p className="text-sm text-charcoal-500">{t("noReviewsYet")}</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-charcoal-100 pb-5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-charcoal-900">{r.name}</span>
                <span className="text-xs text-charcoal-400">
                  {format.dateTime(new Date(r.createdAt), { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <RatingStars rating={r.rating} size={14} className="mt-1.5" />
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
