"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed; fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-800 hover:border-gold-300"
    >
      {copied ? <Check size={16} className="text-gold-600" /> : <Share2 size={16} />}
      {t("share")}
    </button>
  );
}
