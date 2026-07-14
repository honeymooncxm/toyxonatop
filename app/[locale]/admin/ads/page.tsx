"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2, Plus } from "lucide-react";

type Ad = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  placement: string;
  active: boolean;
};

const PLACEMENTS = ["HOME_TOP", "SEARCH_SIDEBAR", "HOME_BANNER"] as const;

export default function AdminAdsPage() {
  const t = useTranslations("admin");
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [form, setForm] = useState({ title: "", imageUrl: "", linkUrl: "", placement: "HOME_BANNER" as (typeof PLACEMENTS)[number] });

  const placementLabel = (p: string) =>
    p === "HOME_TOP" ? t("adPlacementHomeTop") :
    p === "SEARCH_SIDEBAR" ? t("adPlacementSearchSidebar") :
    t("adPlacementHomeBanner");

  function load() {
    fetch("/api/admin/ads").then((r) => r.json()).then((d) => setAds(d.ads ?? []));
  }
  useEffect(load, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, active: true }),
    });
    setForm({ title: "", imageUrl: "", linkUrl: "", placement: "HOME_BANNER" });
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/ads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="grid grid-cols-1 gap-3 rounded-2xl border border-charcoal-100 bg-white p-5 card-shadow sm:grid-cols-2">
        <input required placeholder={t("adTitle")} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
        <select value={form.placement} onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value as typeof form.placement }))} className="rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400">
          {PLACEMENTS.map((p) => <option key={p} value={p}>{placementLabel(p)}</option>)}
        </select>
        <input required placeholder={t("adImage")} value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400 sm:col-span-2" />
        <input required placeholder={t("adLink")} value={form.linkUrl} onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))} className="rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400 sm:col-span-2" />
        <button type="submit" className="gold-gradient flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white sm:col-span-2">
          <Plus size={16} />
          {t("createAd")}
        </button>
      </form>

      <div className="space-y-3">
        {ads?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-charcoal-200 py-16 text-center text-sm text-charcoal-500">
            {t("adsEmpty")}
          </p>
        )}
        {ads?.map((ad) => (
          <div key={ad.id} className="flex items-center gap-4 rounded-2xl border border-charcoal-100 bg-white p-4 card-shadow">
            <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ad.imageUrl} alt={ad.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-charcoal-900">{ad.title}</div>
              <div className="text-xs text-charcoal-400">{placementLabel(ad.placement)}</div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={ad.active} onChange={(e) => toggleActive(ad.id, e.target.checked)} className="h-4 w-4 rounded border-charcoal-300 text-gold-500" />
              {t("adActive")}
            </label>
            <button onClick={() => remove(ad.id)}>
              <Trash2 size={16} className="text-charcoal-400 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
