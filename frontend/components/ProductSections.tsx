import type { CSSProperties } from "react";
import { t, type Locale } from "@/lib/i18n";
import type { Collection, Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export function CollectionSection({ locale: l, collection: c }: { locale: Locale; collection: Collection }) {
  const style = { "--c1": c.theme.from, "--c2": c.theme.to } as CSSProperties;
  return (
    <section id="collection" style={style}>
      <div className="wrap">
        <span className="badge">{t(l, "ui.badge")}</span>
        <h2>{c.name[l]}</h2>
        <p className="lead">{c.desc[l]}</p>
        <h3 className="sub">{t(l, "collection.sub")}</h3>
        <p className="note">{t(l, "collection.note")}</p>
        <div className="grid">
          {c.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function PromoSection({ locale: l, products }: { locale: Locale; products: Product[] }) {
  const promos = products.filter((p) => p.discount);
  if (promos.length === 0) return null;
  return (
    <section id="promo">
      <div className="wrap">
        <div className="ctr">
          <span className="eyebrow">{t(l, "promo.eyebrow")}</span>
          <h2>{t(l, "promo.title")}</h2>
        </div>
        <div className="grid mt">
          {promos.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
