"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { t as translate, type Locale, type MessageKey } from "@/lib/i18n";
import type { Product } from "@/lib/types";

/** Contenu de la fenêtre « Commander / Demander cette création ». */
export type RequestDraft = {
  type: "order" | "custom";
  label: string; // texte affiché : nom du produit ou « pièce · couleur »
  product?: Product;
  piece?: string;
  color?: string;
};

interface ShopCtx {
  locale: Locale;
  t: (key: MessageKey) => string;
  products: Product[];
  favs: number[];
  toggleFav: (id: number) => void;
  favOpen: boolean;
  setFavOpen: (open: boolean) => void;
  draft: RequestDraft | null;
  openRequest: (d: RequestDraft) => void;
  closeRequest: () => void;
}

const Ctx = createContext<ShopCtx | null>(null);

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShop doit être utilisé dans <ShopProvider>");
  return v;
}

export default function ShopProvider({
  locale,
  products,
  children,
}: {
  locale: Locale;
  products: Product[];
  children: React.ReactNode;
}) {
  const [favs, setFavs] = useState<number[]>([]);
  const [favOpen, setFavOpen] = useState(false);
  const [draft, setDraft] = useState<RequestDraft | null>(null);

  // Favoris : stockés dans le navigateur (clé "fav"), lus après l'hydratation pour éviter tout décalage SSR.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("fav") || "[]");
      if (Array.isArray(saved)) setFavs(saved.filter((x) => typeof x === "number"));
    } catch {}
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("fav", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const closeRequest = useCallback(() => setDraft(null), []);

  const value = useMemo<ShopCtx>(
    () => ({
      locale,
      t: (key) => translate(locale, key),
      products,
      favs,
      toggleFav,
      favOpen,
      setFavOpen,
      draft,
      openRequest: setDraft,
      closeRequest,
    }),
    [locale, products, favs, toggleFav, favOpen, draft, closeRequest],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
