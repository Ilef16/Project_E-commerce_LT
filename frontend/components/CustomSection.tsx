"use client";

import { useState, type CSSProperties } from "react";
import { COLORS, PIECES } from "@/lib/customization";
import { useShop } from "./ShopProvider";

export default function CustomSection() {
  const { locale, t, openRequest } = useShop();
  const [sp, setSp] = useState(0); // pièce choisie
  const [sc, setSc] = useState(1); // couleur choisie
  const piece = PIECES[sp];
  const color = COLORS[sc];
  const summary = `${t("custom.summary")}${piece[locale]} · ${color[locale]}`;

  return (
    <section className="custom" id="surmesure">
      <div className="wrap cust">
        <div>
          <span className="eyebrow">{t("nav.custom")}</span>
          <h2>{t("custom.title")}</h2>
          <p>{t("custom.text")}</p>

          <div className="lbl">{t("custom.piece")}</div>
          <div>
            {PIECES.map((p, i) => (
              <button key={p.fr} className={`chip${i === sp ? " on" : ""}`} aria-pressed={i === sp} onClick={() => setSp(i)}>
                {p[locale]}
              </button>
            ))}
          </div>

          <div className="lbl">{t("custom.color")}</div>
          <div>
            {COLORS.map((c, i) => (
              <button
                key={c.hex}
                className={`sw${i === sc ? " on" : ""}`}
                style={{ background: c.hex }}
                aria-label={c[locale]}
                aria-pressed={i === sc}
                onClick={() => setSc(i)}
              />
            ))}
          </div>

          <div id="sum">{summary}</div>
          <button
            className="btn"
            onClick={() => openRequest({ type: "custom", piece: piece.fr, color: color.fr, label: `${piece[locale]} · ${color[locale]}` })}
          >
            {t("custom.cta")}
          </button>
        </div>

        <div className="pv" aria-hidden="true" style={{ "--pc": color.hex } as CSSProperties}>
          <div className="pvin ph"><div className="pvc" /></div>
        </div>
      </div>
    </section>
  );
}
