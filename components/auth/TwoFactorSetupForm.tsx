"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { ADMIN_PATH } from "@/lib/admin-path";

export function TwoFactorSetupForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/2fa/setup", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setSecret(data.secret);
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/2fa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setError(t("twoFactorInvalid"));
        return;
      }
      router.push(`/${ADMIN_PATH}`);
      router.refresh();
    } catch {
      setError(t("twoFactorInvalid"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <ShieldCheck size={26} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("twoFactorSetupTitle")}</h1>
      <p className="mt-1.5 text-sm text-charcoal-500">{t("twoFactorSetupSubtitle")}</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-charcoal-100 bg-white p-6 card-shadow">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {qrCodeDataUrl ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeDataUrl} alt="TOTP QR code" className="h-48 w-48 rounded-xl border border-charcoal-100" />
            {secret && (
              <p className="text-center text-xs text-charcoal-500">
                {t("twoFactorSetupManual")}
                <br />
                <code className="font-mono text-sm font-semibold tracking-wider text-charcoal-800">{secret}</code>
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-charcoal-400">…</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("twoFactorCode")}</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-charcoal-200 px-3 py-2.5 text-center text-lg tracking-[0.5em] outline-none focus:border-gold-400"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="gold-gradient w-full rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {t("twoFactorEnable")}
          </button>
        </form>
      </div>
    </>
  );
}
