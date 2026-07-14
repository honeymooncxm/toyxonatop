"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Check, Trash2, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import clsx from "clsx";
import { REGIONS } from "@/lib/regions";
import { PhotoUploadInput } from "@/components/owner/PhotoUploadInput";
import { VideoLinkInput } from "@/components/owner/VideoLinkInput";

type MetaItem = { slug: string; nameUz: string; nameRu: string; nameEn: string };

type FormState = {
  businessName: string;
  hallName: string;
  ownerName: string;
  phones: string[];
  telegram: string;
  email: string;
  website: string;
  instagram: string;
  region: string;
  district: string;
  address: string;
  lat: string;
  lng: string;
  capacityMin: string;
  capacityMax: string;
  priceMin: string;
  priceMax: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  parking: boolean;
  outdoorArea: boolean;
  vipRoom: boolean;
  halal: boolean;
  luxury: boolean;
  budget: boolean;
  hasKitchen: boolean;
  kitchenType: string;
  virtualTourUrl: string;
  serviceSlugs: string[];
  categorySlugs: string[];
  photosInterior: string[];
  photosExterior: string[];
  videos: string[];
};

const initialState: FormState = {
  businessName: "",
  hallName: "",
  ownerName: "",
  phones: [""],
  telegram: "",
  email: "",
  website: "",
  instagram: "",
  region: "",
  district: "",
  address: "",
  lat: "",
  lng: "",
  capacityMin: "",
  capacityMax: "",
  priceMin: "",
  priceMax: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  parking: false,
  outdoorArea: false,
  vipRoom: false,
  halal: true,
  luxury: false,
  budget: false,
  hasKitchen: true,
  kitchenType: "",
  virtualTourUrl: "",
  serviceSlugs: [],
  categorySlugs: [],
  photosInterior: [],
  photosExterior: [],
  videos: [],
};

const STEPS = 5;

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-800 outline-none focus:border-gold-400"
      />
    </div>
  );
}


export function OwnerWizard({ ownerName }: { ownerName: string }) {
  const t = useTranslations("ownerWizard");
  const common = useTranslations("common");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...initialState, ownerName });
  const [meta, setMeta] = useState<{ services: MetaItem[]; categories: MetaItem[] }>({ services: [], categories: [] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/meta").then((r) => r.json()).then(setMeta);
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const selectedRegion = REGIONS.find((r) => r.slug === form.region);

  async function submit() {
    setSubmitting(true);
    setError(null);
    const payload = {
      ...form,
      phones: form.phones.filter(Boolean),
      lat: form.lat ? Number(form.lat) : undefined,
      lng: form.lng ? Number(form.lng) : undefined,
      capacityMin: Number(form.capacityMin),
      capacityMax: Number(form.capacityMax),
      priceMin: Number(form.priceMin),
      priceMax: Number(form.priceMax),
    };
    const res = await fetch("/api/venues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-charcoal-100 bg-white p-10 text-center card-shadow">
        <PartyPopper size={40} className="text-gold-500" />
        <p className="mt-4 max-w-sm text-sm text-charcoal-600">{t("submitSuccess")}</p>
        <button
          onClick={() => router.push("/owner/dashboard")}
          className="gold-gradient mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
        >
          {t("goToDashboard")}
        </button>
      </div>
    );
  }

  const stepTitles = [t("step1Title"), t("step2Title"), t("step3Title"), t("step4Title"), t("step5Title")];

  return (
    <div>
      <div className="mb-8 flex items-center gap-2">
        {stepTitles.map((title, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                i < step ? "gold-gradient text-white" : i === step ? "border-2 border-gold-500 text-gold-600" : "bg-charcoal-100 text-charcoal-400",
              )}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < stepTitles.length - 1 && <div className={clsx("h-0.5 flex-1", i < step ? "bg-gold-500" : "bg-charcoal-100")} />}
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold text-charcoal-900">{stepTitles[step]}</h2>

      <div className="mt-5 space-y-4 rounded-2xl border border-charcoal-100 bg-white p-6 card-shadow">
        {step === 0 && (
          <>
            <TextInput label={t("businessName")} value={form.businessName} onChange={(v) => set("businessName", v)} />
            <TextInput label={t("hallName")} value={form.hallName} onChange={(v) => set("hallName", v)} />
            <TextInput label={t("ownerName")} value={form.ownerName} onChange={(v) => set("ownerName", v)} />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("phones")}</label>
              {form.phones.map((p, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <input
                    value={p}
                    onChange={(e) => {
                      const next = [...form.phones];
                      next[i] = e.target.value;
                      set("phones", next);
                    }}
                    placeholder="+998 90 123 45 67"
                    className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                  />
                  {form.phones.length > 1 && (
                    <button type="button" onClick={() => set("phones", form.phones.filter((_, idx) => idx !== i))}>
                      <Trash2 size={16} className="text-charcoal-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("phones", [...form.phones, ""])}
                className="text-xs font-medium text-gold-600 hover:text-gold-700"
              >
                + {t("addPhone")}
              </button>
            </div>
            <TextInput label={t("telegram")} value={form.telegram} onChange={(v) => set("telegram", v)} placeholder="@username" />
            <TextInput label={t("email")} value={form.email} onChange={(v) => set("email", v)} type="email" />
            <TextInput label={t("website")} value={form.website} onChange={(v) => set("website", v)} placeholder="https://" />
            <TextInput label={t("instagram")} value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="@username" />
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("region")}</label>
              <select
                value={form.region}
                onChange={(e) => {
                  set("region", e.target.value);
                  set("district", "");
                }}
                className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-400"
              >
                <option value="">—</option>
                {REGIONS.map((r) => (
                  <option key={r.slug} value={r.slug}>{r.nameUz}</option>
                ))}
              </select>
            </div>
            {selectedRegion && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("district")}</label>
                <select
                  value={form.district}
                  onChange={(e) => set("district", e.target.value)}
                  className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                >
                  <option value="">—</option>
                  {selectedRegion.districts.map((d) => (
                    <option key={d.slug} value={d.slug}>{d.nameUz}</option>
                  ))}
                </select>
              </div>
            )}
            <TextInput label={t("address")} value={form.address} onChange={(v) => set("address", v)} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label={t("mapLat")} value={form.lat} onChange={(v) => set("lat", v)} placeholder="41.31" type="number" />
              <TextInput label={t("mapLng")} value={form.lng} onChange={(v) => set("lng", v)} placeholder="69.28" type="number" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label={t("capacityMin")} value={form.capacityMin} onChange={(v) => set("capacityMin", v)} type="number" />
              <TextInput label={t("capacityMax")} value={form.capacityMax} onChange={(v) => set("capacityMax", v)} type="number" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label={t("priceMin")} value={form.priceMin} onChange={(v) => set("priceMin", v)} type="number" />
              <TextInput label={t("priceMax")} value={form.priceMax} onChange={(v) => set("priceMax", v)} type="number" />
            </div>
            <TextInput label={t("kitchenType")} value={form.kitchenType} onChange={(v) => set("kitchenType", v)} placeholder="Milliy, Turk, Yevropa..." />

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("services")}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {meta.services.map((s) => (
                  <label key={s.slug} className="flex items-center gap-2 text-sm text-charcoal-700">
                    <input
                      type="checkbox"
                      checked={form.serviceSlugs.includes(s.slug)}
                      onChange={(e) =>
                        set("serviceSlugs", e.target.checked ? [...form.serviceSlugs, s.slug] : form.serviceSlugs.filter((x) => x !== s.slug))
                      }
                      className="h-4 w-4 rounded border-charcoal-300 text-gold-500"
                    />
                    {s.nameUz}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("categories")}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {meta.categories.map((c) => (
                  <label key={c.slug} className="flex items-center gap-2 text-sm text-charcoal-700">
                    <input
                      type="checkbox"
                      checked={form.categorySlugs.includes(c.slug)}
                      onChange={(e) =>
                        set("categorySlugs", e.target.checked ? [...form.categorySlugs, c.slug] : form.categorySlugs.filter((x) => x !== c.slug))
                      }
                      className="h-4 w-4 rounded border-charcoal-300 text-gold-500"
                    />
                    {c.nameUz}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {([
                ["parking", t("parking")],
                ["outdoorArea", t("outdoorArea")],
                ["vipRoom", t("vipRoom")],
                ["halal", t("halal")],
                ["luxury", t("luxury")],
                ["budget", t("budget")],
                ["hasKitchen", t("hasKitchen")],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-charcoal-700">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={(e) => set(key, e.target.checked as never)}
                    className="h-4 w-4 rounded border-charcoal-300 text-gold-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("descriptionUz")}</label>
              <textarea rows={3} value={form.descriptionUz} onChange={(e) => set("descriptionUz", e.target.value)} className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("descriptionRu")}</label>
              <textarea rows={3} value={form.descriptionRu} onChange={(e) => set("descriptionRu", e.target.value)} className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("descriptionEn")}</label>
              <textarea rows={3} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400" />
            </div>
            <PhotoUploadInput label={t("photosInterior")} values={form.photosInterior} onChange={(v) => set("photosInterior", v)} />
            <PhotoUploadInput label={t("photosExterior")} values={form.photosExterior} onChange={(v) => set("photosExterior", v)} />
            <VideoLinkInput label={t("videos")} values={form.videos} onChange={(v) => set("videos", v)} />
            <TextInput label={t("virtualTourUrl")} value={form.virtualTourUrl} onChange={(v) => set("virtualTourUrl", v)} placeholder="https://kuula.co/..." />
          </>
        )}

        {step === 4 && (
          <div className="space-y-3 text-sm text-charcoal-700">
            <p className="rounded-xl bg-gold-50 px-4 py-3 text-gold-700">{t("reviewNotice")}</p>
            <dl className="grid grid-cols-2 gap-3">
              <div><dt className="text-xs text-charcoal-400">{t("businessName")}</dt><dd>{form.businessName || "—"}</dd></div>
              <div><dt className="text-xs text-charcoal-400">{t("hallName")}</dt><dd>{form.hallName || "—"}</dd></div>
              <div><dt className="text-xs text-charcoal-400">{t("region")}</dt><dd>{form.region || "—"}</dd></div>
              <div><dt className="text-xs text-charcoal-400">{t("address")}</dt><dd>{form.address || "—"}</dd></div>
              <div><dt className="text-xs text-charcoal-400">{t("capacityMin")}/{t("capacityMax")}</dt><dd>{form.capacityMin}–{form.capacityMax}</dd></div>
              <div><dt className="text-xs text-charcoal-400">{t("priceMin")}/{t("priceMax")}</dt><dd>{form.priceMin}–{form.priceMax}</dd></div>
            </dl>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={submit}
              disabled={submitting}
              className="gold-gradient w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {t("submitButton")}
            </button>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="mt-5 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-full border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 disabled:opacity-40"
          >
            <ArrowLeft size={15} />
            {common("back")}
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS - 1, s + 1))}
            className="gold-gradient flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          >
            {common("next")}
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
