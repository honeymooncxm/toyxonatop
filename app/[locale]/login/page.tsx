"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"password" | "code">("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goNext() {
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/");
    router.refresh();
  }

  async function onSubmitPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          setError(t("tooManyAttempts", { minutes: data.retryAfterMinutes ?? 30 }));
        } else {
          setError(t("invalidCredentials"));
        }
        return;
      }
      if (data.requires2FA) {
        setStep("code");
        return;
      }
      if (data.requiresTwoFactorSetup) {
        router.push("/two-factor-setup");
        return;
      }
      goNext();
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setError(t("twoFactorInvalid"));
        return;
      }
      goNext();
    } catch {
      setError(t("twoFactorInvalid"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      {step === "password" ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("loginTitle")}</h1>
          <p className="mt-1.5 text-sm text-charcoal-500">{t("loginSubtitle")}</p>

          <form onSubmit={onSubmitPassword} className="mt-8 space-y-4 rounded-2xl border border-charcoal-100 bg-white p-6 card-shadow">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("email")}</label>
              <div className="flex items-center gap-2 rounded-xl border border-charcoal-200 px-3 py-2.5 focus-within:border-gold-400">
                <Mail size={16} className="text-charcoal-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("password")}</label>
              <div className="flex items-center gap-2 rounded-xl border border-charcoal-200 px-3 py-2.5 focus-within:border-gold-400">
                <Lock size={16} className="text-charcoal-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-gradient w-full rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {t("loginButton")}
            </button>

            <p className="text-center text-sm text-charcoal-500">
              {t("dontHaveAccount")}{" "}
              <Link href="/register" className="font-medium text-gold-600 hover:text-gold-700">
                {t("registerButton")}
              </Link>
            </p>
          </form>
        </>
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
            <ShieldCheck size={26} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("twoFactorTitle")}</h1>
          <p className="mt-1.5 text-sm text-charcoal-500">{t("twoFactorSubtitle")}</p>

          <form onSubmit={onSubmitCode} className="mt-8 space-y-4 rounded-2xl border border-charcoal-100 bg-white p-6 card-shadow">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("twoFactorCode")}</label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
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
              {t("twoFactorVerify")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
