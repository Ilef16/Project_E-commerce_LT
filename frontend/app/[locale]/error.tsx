"use client";

import { useParams } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const { locale } = useParams<{ locale: string }>();
  const l = isLocale(locale) ? locale : "fr";
  return (
    <div className="wrap" style={{ padding: "120px 5vw", textAlign: "center" }}>
      <h2 style={{ marginBottom: 24 }}>{t(l, "err.title")}</h2>
      <button className="btn" onClick={reset}>{t(l, "err.retry")}</button>
    </div>
  );
}
