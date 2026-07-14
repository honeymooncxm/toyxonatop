"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFavoritesStore } from "@/store/favorites";

export function FavoritesSync() {
  const user = useAuth();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user || syncedFor.current === user.sub) return;
    syncedFor.current = user.sub;

    const localIds = useFavoritesStore.getState().ids;
    fetch("/api/favorites/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: localIds }),
    })
      .then((res) => res.json())
      .then((data: { ids?: string[] }) => {
        if (data.ids) useFavoritesStore.getState().setAll(data.ids);
      })
      .catch(() => {});
  }, [user]);

  return null;
}
