"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Trash2, Link2, Loader2 } from "lucide-react";
import { resizeImageToDataUrl } from "@/lib/resize-image";

export function PhotoUploadInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const t = useTranslations("ownerWizard");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const dataUrl = await resizeImageToDataUrl(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        if (!res.ok) throw new Error("upload failed");
        const { url } = await res.json();
        onChange([...values, url]);
      } catch {
        setError(t("photoUploadError"));
      } finally {
        setUploading((n) => Math.max(0, n - 1));
      }
    }
  }

  function addLink() {
    if (!linkDraft.trim()) return;
    onChange([...values, linkDraft.trim()]);
    setLinkDraft("");
    setShowLinkInput(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal-400">{label}</label>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {values.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-charcoal-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-charcoal-200 text-charcoal-400 hover:border-gold-400 hover:text-gold-600"
        >
          {uploading > 0 ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          <span className="text-[11px]">{uploading > 0 ? t("uploading") : t("choosePhotos")}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      <div className="mt-2">
        {showLinkInput ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={linkDraft}
              onChange={(e) => setLinkDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
              placeholder="https://..."
              className="w-full rounded-xl border border-charcoal-200 bg-white px-3 py-2 text-sm outline-none focus:border-gold-400"
            />
            <button type="button" onClick={addLink} className="shrink-0 rounded-xl gold-gradient px-3 text-sm font-medium text-white">
              {t("addPhoto")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowLinkInput(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-charcoal-500 hover:text-gold-600"
          >
            <Link2 size={13} />
            {t("orPasteLink")}
          </button>
        )}
      </div>
    </div>
  );
}
