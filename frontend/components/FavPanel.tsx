"use client";

import type { Product } from "@/lib/types";
import { useShop } from "./ShopProvider";

export default function FavPanel() {
  const { locale, t, products, favs, toggleFav, favOpen, setFavOpen } = useShop();
  const items = favs.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);

  return (
    <aside id="favPanel" hidden={!favOpen} aria-label={t("fav.title")}>
      <button className="x" onClick={() => setFavOpen(false)} aria-label={t("ui.close")}>×</button>
      <h3>{t("fav.title")}</h3>
      <div>
        {items.length === 0 ? (
          <p>{t("fav.empty")}</p>
        ) : (
          items.map((p) => (
            <div className="fi" key={p.id}>
              <span>{p.name[locale]}</span>
              <b>{p.finalPrice.toFixed(2)} {t("ui.currency")}</b>
              <button onClick={() => toggleFav(p.id)} aria-label={t("ui.close")}>×</button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
