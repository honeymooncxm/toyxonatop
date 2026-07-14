"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ShieldCheck, ShieldAlert, LogOut } from "lucide-react";

export function SecurityPanel({ twoFactorEnabled }: { twoFactorEnabled: boolean }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogoutAll() {
    if (!confirm(t("logoutAllConfirm"))) return;
    setLoading(true);
    try {
      await fetch("/api/auth/logout-all", { method: "POST" });
      alert(t("logoutAllDone"));
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-5 card-shadow">
      <h3 className="font-display text-lg font-semibold text-charcoal-900">{t("securityTitle")}</h3>

      <div className="mt-3 flex items-center gap-2 text-sm">
        {twoFactorEnabled ? (
          <>
            <ShieldCheck size={16} className="text-green-600" />
            <span className="text-charcoal-700">{t("twoFactorStatusOn")}</span>
          </>
        ) : (
          <>
            <ShieldAlert size={16} className="text-amber-600" />
            <span className="text-charcoal-700">{t("twoFactorStatusOff")}</span>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onLogoutAll}
        disabled={loading}
        className="mt-4 flex items-center gap-1.5 rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
      >
        <LogOut size={15} />
        {t("logoutAllDevices")}
      </button>
    </div>
  );
}
