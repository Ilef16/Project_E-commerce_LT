"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "./ShopProvider";
import Heart from "./Heart";

const NAV = [
  ["apropos", "nav.about"],
  ["collection", "nav.collection"],
  ["promo", "nav.promo"],
  ["catalogue", "nav.products"],
  ["services", "nav.services"],
  ["surmesure", "nav.custom"],
  ["avis", "nav.reviews"],
] as const;

export default function Header() {
  const { locale, t, favs, favOpen, setFavOpen } = useShop();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const other = locale === "fr" ? "ar" : "fr";

  const switchLang = () => {
    document.cookie = `lang=${other}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${other}`);
  };

  return (
    <>
      <div className="topbar">{t("topbar")}</div>
      <header>
        <div className="wrap">
          <a href="#top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/images/logo.png" width={686} height={686} style={{ width: "auto" }} alt="Louli’s Touch" />
          </a>
          <nav id="mainNav" className={open ? "open" : undefined} onClick={(e) => (e.target as HTMLElement).tagName === "A" && setOpen(false)}>
            {NAV.map(([id, key]) => (
              <a key={id} href={`#${id}`}>{t(key)}</a>
            ))}
          </nav>
          <div className="tools">
            <button className="favbtn" onClick={() => setFavOpen(!favOpen)} aria-label={t("aria.fav")} aria-expanded={favOpen}>
              <Heart />
              <span>{favs.length}</span>
            </button>
            <button className="lang" onClick={switchLang} lang={other} aria-label={t("lang.switch")}>
              {t("lang.switch")}
            </button>
            <button className="menu" onClick={() => setOpen(!open)} aria-label={t("aria.menu")} aria-expanded={open}>
              ☰
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
