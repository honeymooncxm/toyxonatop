"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { User, Mail, Lock, Phone, AlertCircle } from "lucide-react";
import clsx from "clsx";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "CUSTOMER" as "CUSTOMER" | "OWNER" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "emailTaken" ? t("emailTaken") : t("invalidCredentials"));
        return;
      }
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : form.role === "OWNER" ? "/register-venue" : "/");
      router.refresh();
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("registerTitle")}</h1>
      <p className="mt-1.5 text-sm text-charcoal-500">{t("registerSubtitle")}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-charcoal-100 bg-white p-6 card-shadow">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("role")}</label>
          <div className="grid grid-cols-2 gap-2">
            {(["CUSTOMER", "OWNER"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role }))}
                className={clsx(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  form.role === role ? "border-gold-500 bg-gold-50 text-gold-700" : "border-charcoal-200 text-charcoal-600",
                )}
              >
                {role === "CUSTOMER" ? t("roleCustomer") : t("roleOwner")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("name")}</label>
          <div className="flex items-center gap-2 rounded-xl border border-charcoal-200 px-3 py-2.5 focus-within:border-gold-400">
            <User size={16} className="text-charcoal-400" />
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("email")}</label>
          <div className="flex items-center gap-2 rounded-xl border border-charcoal-200 px-3 py-2.5 focus-within:border-gold-400">
            <Mail size={16} className="text-charcoal-400" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{t("phone")}</label>
          <div className="flex items-center gap-2 rounded-xl border border-charcoal-200 px-3 py-2.5 focus-within:border-gold-400">
            <Phone size={16} className="text-charcoal-400" />
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+998 90 123 45 67"
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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gold-gradient w-full rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {t("registerButton")}
        </button>

        <p className="text-center text-sm text-charcoal-500">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-medium text-gold-600 hover:text-gold-700">
            {t("loginButton")}
          </Link>
        </p>
      </form>
    </div>
  );
}
