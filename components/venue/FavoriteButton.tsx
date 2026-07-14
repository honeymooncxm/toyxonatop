"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { useFavoritesStore } from "@/store/favorites";
import { useAuth } from "@/components/providers/AuthProvider";

export function FavoriteButton({
  venueId,
  size = "md",
  className,
}: {
  venueId: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const user = useAuth();
  const has = useFavoritesStore((s) => s.ids.includes(venueId));
  const toggle = useFavoritesStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowActive = !has;
    toggle(venueId);
    if (user) {
      try {
        if (nowActive) {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ venueId }),
          });
        } else {
          await fetch(`/api/favorites?venueId=${venueId}`, { method: "DELETE" });
        }
      } catch {
        // best-effort sync; local state already updated
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Favorite"
      className={clsx(
        "flex items-center justify-center rounded-full transition-all",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        "bg-white/90 backdrop-blur hover:scale-110 card-shadow",
        className,
      )}
    >
      <Heart
        size={size === "sm" ? 16 : 18}
        className={mounted && has ? "fill-gold-500 text-gold-500" : "fill-none text-charcoal-600"}
      />
    </button>
  );
}
