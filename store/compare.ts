"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_COMPARE = 3;

type CompareState = {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => {
          if (s.ids.includes(id)) return { ids: s.ids.filter((x) => x !== id) };
          if (s.ids.length >= MAX_COMPARE) return s;
          return { ids: [...s.ids, id] };
        }),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "toyxonatop-compare" },
  ),
);
