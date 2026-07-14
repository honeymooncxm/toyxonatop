"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ScrollText } from "lucide-react";

type AuditEntry = {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: string;
};

export function AuditLogPanel() {
  const t = useTranslations("admin");
  const format = useFormatter();
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/audit-log")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []));
  }, []);

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-5 card-shadow">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-charcoal-900">
        <ScrollText size={18} className="text-gold-500" />
        {t("auditLog")}
      </h3>

      <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
        {entries?.length === 0 && <p className="text-sm text-charcoal-400">{t("auditLogEmpty")}</p>}
        {entries?.map((e) => (
          <div key={e.id} className="flex items-center justify-between gap-3 border-b border-charcoal-50 pb-2 text-xs last:border-0">
            <div className="min-w-0">
              <span className="font-medium text-charcoal-800">{e.adminEmail}</span>
              <span className="text-charcoal-500"> — {e.action}</span>
              {e.targetType && <span className="text-charcoal-400"> ({e.targetType}{e.targetId ? `:${e.targetId.slice(0, 8)}` : ""})</span>}
            </div>
            <span className="shrink-0 text-charcoal-400">
              {format.dateTime(new Date(e.createdAt), { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
