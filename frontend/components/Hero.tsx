"use client";

import { useRef } from "react";
import { useShop } from "./ShopProvider";

export default function Hero() {
  const { t } = useShop();
  const tilt = useRef<HTMLDivElement>(null);

  return (
    <div
      className="hero"
      onPointerMove={(e) => {
        const el = tilt.current;
        if (!el) return;
        const r = e.currentTarget.getBoundingClientRect();
        el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 22 + "deg");
        el.style.setProperty("--rx", -((e.clientY - r.top) / r.height - 0.5) * 16 + "deg");
      }}
    >
      <div className="wrap">
        <div>
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          {/* Texte statique de confiance (messages.ts) contenant <em> */}
          <h1 dangerouslySetInnerHTML={{ __html: t("hero.title") }} />
          <p>{t("hero.text")}</p>
          <div className="cta">
            <a className="btn" href="#collection">{t("hero.cta1")}</a>
            <a className="btn ghost" href="#surmesure">{t("hero.cta2")}</a>
          </div>
        </div>
        <div className="hv3">
          <div className="tilt" ref={tilt}>
            <div className="layers">
              <div className="l1 ph" role="img" aria-label={t("gal.1")} />
              <div className="l2 ph" role="img" aria-label={t("gal.2")} />
              <div className="l3">{t("hero.tag")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
