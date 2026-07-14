"use client";

import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { venues: number; reviews: number };
};

export default function AdminUsersPage() {
  const t = useTranslations("admin");
  const auth = useTranslations("auth");
  const format = useFormatter();
  const [users, setUsers] = useState<AdminUser[] | null>(null);

  const roleLabel = (role: string) =>
    role === "ADMIN" ? auth("roleAdmin") : role === "OWNER" ? auth("roleOwner") : auth("roleCustomer");

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.users ?? []));
  }, []);

  return (
    <div className="overflow-x-auto rounded-2xl border border-charcoal-100 bg-white card-shadow">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-400">
            <th className="p-4">{t("userName")}</th>
            <th className="p-4">{t("userEmail")}</th>
            <th className="p-4">{t("userRole")}</th>
            <th className="p-4">{t("userVenues")}</th>
            <th className="p-4">{t("userJoined")}</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id} className="border-b border-charcoal-50 last:border-0">
              <td className="p-4 font-medium text-charcoal-900">{u.name}</td>
              <td className="p-4 text-charcoal-600">{u.email}</td>
              <td className="p-4">
                <Badge variant={u.role === "ADMIN" ? "charcoal" : u.role === "OWNER" ? "gold" : "outline"}>{roleLabel(u.role)}</Badge>
              </td>
              <td className="p-4 text-charcoal-600">{u._count.venues}</td>
              <td className="p-4 text-charcoal-500">
                {format.dateTime(new Date(u.createdAt), { year: "numeric", month: "short", day: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
