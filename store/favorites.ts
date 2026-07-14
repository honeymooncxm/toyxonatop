"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: string[];
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  setAll: (ids: string[]) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      add: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids : [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
      setAll: (ids) => set({ ids }),
    }),
    { name: "toyxonatop-favorites" },
  ),
);
