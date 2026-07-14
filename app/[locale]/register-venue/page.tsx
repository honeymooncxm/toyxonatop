import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Building2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { OwnerWizard } from "@/components/owner/OwnerWizard";

export default async function RegisterVenuePage() {
  const session = await getSession();
  const t = await getTranslations("ownerWizard");
  const auth = await getTranslations("auth");

  if (!session || (session.role !== "OWNER" && session.role !== "ADMIN")) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
          <Building2 size={26} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-charcoal-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-charcoal-500">{t("subtitle")}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/register?next=/register-venue" className="gold-gradient rounded-full px-6 py-2.5 text-sm font-semibold text-white">
            {auth("registerButton")}
          </Link>
          <Link href="/login?next=/register-venue" className="rounded-full border border-charcoal-200 px-6 py-2.5 text-sm font-medium text-charcoal-800">
            {auth("loginButton")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{t("title")}</h1>
      <p className="mt-1.5 text-sm text-charcoal-500">{t("subtitle")}</p>
      <div className="mt-8">
        <OwnerWizard ownerName={session.name} />
      </div>
    </div>
  );
}
