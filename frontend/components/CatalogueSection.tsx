"use client";

import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { useShop } from "./ShopProvider";
import ProductCard from "./ProductCard";

const TABS = [
  ["all", "cat.all"],
  ["keys", "cat.keys"],
  ["acc", "cat.acc"],
  ["chain", "cat.chain"],
  ["bag", "cat.bag"],
] as const;

export default function CatalogueSection({ products }: { products: Product[] }) {
  const { t } = useShop();
  const [cat, setCat] = useState<"all" | Category>("all");
  const list = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <section id="catalogue">
      <div className="wrap">
        <div className="ctr">
          <span className="eyebrow">{t("catalogue.eyebrow")}</span>
          <h2>{t("nav.products")}</h2>
        </div>
        <div className="ctr" id="catTabs">
          {TABS.map(([k, label]) => (
            <button key={k} className={`chip${k === cat ? " on" : ""}`} aria-pressed={k === cat} onClick={() => setCat(k)}>
              {t(label)}
            </button>
          ))}
        </div>
        <div className="grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
