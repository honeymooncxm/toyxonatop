"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check, X, Star, Trash2, Eye } from "lucide-react";
import clsx from "clsx";
import { regionName, districtName } from "@/lib/regions";
import { formatNumber } from "@/lib/format";

type AdminVenue = {
  id: string;
  slug: string;
  hallName: string;
  region: string;
  district: string;
  status: string;
  featured: boolean;
  capacityMin: number;
  capacityMax: number;
  priceMin: number;
  priceMax: number;
  photos: { url: string }[];
  owner: { name: string; email: string };
};

const TABS = ["PENDING", "APPROVED", "REJECTED", "ALL"] as const;

export default function AdminListingsPage() {
  const t = useTranslations("admin");
  const common = useTranslations("common");
  const locale = useLocale();
  const [tab, setTab] = useState<(typeof TABS)[number]>("PENDING");
  const [venues, setVenues] = useState<AdminVenue[] | null>(null);

  const tabLabel = (tb: (typeof TABS)[number]) =>
    tb === "PENDING" ? t("statusPending") :
    tb === "APPROVED" ? t("statusApproved") :
    tb === "REJECTED" ? t("statusRejected") :
    t("tabAll");

  const load = useCallback(() => {
    setVenues(null);
    const qs = tab === "ALL" ? "" : `?status=${tab}`;
    fetch(`/api/admin/venues${qs}`).then((r) => r.json()).then((d) => setVenues(d.venues ?? []));
  }, [tab]);

  useEffect(() => load(), [load]);

  async function patch(id: string, body: object) {
    await fetch(`/api/admin/venues/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/admin/venues/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={clsx(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === tb ? "gold-gradient text-white" : "bg-charcoal-100 text-charcoal-600",
            )}
          >
            {tabLabel(tb)}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {venues === null ? (
          <p className="text-sm text-charcoal-400">…</p>
        ) : venues.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-charcoal-200 py-16 text-center text-sm text-charcoal-500">
            {t("noPending")}
          </p>
        ) : (
          venues.map((v) => (
            <div key={v.id} className="flex flex-col gap-4 rounded-2xl border border-charcoal-100 bg-white p-4 card-shadow sm:flex-row sm:items-center">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {v.photos[0] && <img src={v.photos[0].url} alt={v.hallName} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-charcoal-900">{v.hallName}</h3>
                  <span
                    className={clsx(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      v.status === "APPROVED" && "bg-green-100 text-green-700",
                      v.status === "PENDING" && "bg-amber-100 text-amber-700",
                      v.status === "REJECTED" && "bg-red-100 text-red-700",
                    )}
                  >
                    {tabLabel(v.status as (typeof TABS)[number])}
                  </span>
                  {v.featured && <Star size={14} className="fill-gold-500 text-gold-500" />}
                </div>
                <p className="mt-1 text-xs text-charcoal-500">
                  {districtName(v.region, v.district, locale)}, {regionName(v.region, locale)} · {v.capacityMin}–{v.capacityMax} ·{" "}
                  {formatNumber(v.priceMin)}–{formatNumber(v.priceMax)}
                </p>
                <p className="text-xs text-charcoal-400">{v.owner.name} · {v.owner.email}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {v.status !== "APPROVED" && (
                  <button onClick={() => patch(v.id, { status: "APPROVED" })} className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-medium text-white">
                    <Check size={13} />
                    {common("approve")}
                  </button>
                )}
                {v.status !== "REJECTED" && (
                  <button onClick={() => patch(v.id, { status: "REJECTED" })} className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
                    <X size={13} />
                    {common("reject")}
                  </button>
                )}
                <button
                  onClick={() => patch(v.id, { featured: !v.featured })}
                  className="flex items-center gap-1 rounded-full border border-charcoal-200 px-3 py-1.5 text-xs font-medium text-charcoal-700"
                >
                  <Star size={13} />
                  {v.featured ? t("unfeatureVenue") : t("featureVenue")}
                </button>
                <Link href={`/venue/${v.slug}`} className="flex items-center gap-1 rounded-full border border-charcoal-200 px-3 py-1.5 text-xs font-medium text-charcoal-700">
                  <Eye size={13} />
                </Link>
                <button onClick={() => remove(v.id)} className="flex items-center gap-1 rounded-full border border-charcoal-200 px-3 py-1.5 text-xs font-medium text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
