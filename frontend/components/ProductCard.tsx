"use client";

import type { CSSProperties } from "react";
import { artFor } from "@/lib/art";
import type { Product } from "@/lib/types";
import { useShop } from "./ShopProvider";
import Reveal from "./Reveal";
import Heart from "./Heart";

export default function ProductCard({ product: p }: { product: Product }) {
  const { locale, t, favs, toggleFav, openRequest } = useShop();
  const [img, size, pos] = artFor(p);
  const isFav = favs.includes(p.id);
  const cur = t("ui.currency");

  const imageStyle: CSSProperties = {
    backgroundImage: `var(--${img})`,
    backgroundSize: size,
    backgroundPosition: pos,
  };

  return (
    <Reveal className="card">
      <div className="pic">
        <div className="im" style={imageStyle} />
        {p.discount ? <span className="off">-{p.discount}%</span> : null}
        <button
          className={`fav${isFav ? " on" : ""}`}
          onClick={() => toggleFav(p.id)}
          aria-label={t("aria.favToggle")}
          aria-pressed={isFav}
        >
          <Heart />
        </button>
      </div>
      <div className="body">
        <span className="tag">{t("ui.tag")}</span>
        <h3>{p.name[locale]}</h3>
        <div className="price">
          {p.discount ? <s>{p.price.toFixed(2)}</s> : null}
          {p.finalPrice.toFixed(2)} {cur}
        </div>
        <button className="btn" onClick={() => openRequest({ type: "order", product: p, label: p.name[locale] })}>
          {t("ui.buy")}
        </button>
      </div>
    </Reveal>
  );
}
