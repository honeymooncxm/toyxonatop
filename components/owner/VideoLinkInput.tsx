"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2, Video, Plus } from "lucide-react";
import { toEmbedUrl } from "@/lib/video";

export function VideoLinkInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const t = useTranslations("ownerWizard");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add() {
    if (!draft.trim()) return;
    const embed = toEmbedUrl(draft.trim());
    if (!embed) {
      setError(t("videoInvalid"));
      return;
    }
    onChange([...values, embed]);
    setDraft("");
    setError(null);
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{label}</label>
      <p className="mb-2 text-xs text-charcoal-400">{t("videoHelp")}</p>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-400"
        />
        <button
          type="button"
          onClick={add}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gold-gradient text-white"
        >
          <Plus size={18} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      {values.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {values.map((v, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-charcoal-50 px-3 py-2 text-xs text-charcoal-600">
              <span className="flex min-w-0 items-center gap-1.5">
                <Video size={13} className="shrink-0 text-gold-500" />
                <span className="truncate">{v}</span>
              </span>
              <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}>
                <Trash2 size={14} className="shrink-0 text-charcoal-400 hover:text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
