"use client";

import { useState, type FormEvent } from "react";
import type { ReviewsResponse } from "@/lib/types";
import { getJson, postJson } from "@/lib/client-api";
import { useShop } from "./ShopProvider";
import Reveal from "./Reveal";

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

type Status = "idle" | "sending" | "pending" | "published" | "error";

export default function ReviewsSection({ initial }: { initial: ReviewsResponse }) {
  const { locale, t } = useShop();
  const [data, setData] = useState(initial);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setStatus("sending");
    try {
      const res = await postJson<{ status: "pending" | "published" }>("/reviews", form);
      setStatus(res.status);
      setForm({ name: "", rating: 5, text: "" });
      if (res.status === "published") setData(await getJson<ReviewsResponse>("/reviews"));
    } catch {
      setStatus("error");
    }
  };

  const message =
    status === "pending" ? t("reviews.pending")
    : status === "published" ? t("reviews.published")
    : status === "error" ? t("reviews.error")
    : null;

  return (
    <section id="avis">
      <div className="wrap">
        <div className="ctr">
          <span className="eyebrow">{t("reviews.eyebrow")}</span>
          <h2>{t("reviews.title")}</h2>
        </div>

        {data.count > 0 && (
          <div className="sumr">
            <b>{data.average.toFixed(1)}</b>
            <span className="stars" aria-hidden="true">{stars(Math.round(data.average))}</span>
            <span>{data.count} {t("reviews.count")}</span>
          </div>
        )}

        <div className="revs">
          {data.items.map((r) => (
            <Reveal key={r.id} className="rev">
              <div className="stars" role="img" aria-label={`${r.rating}/5`}>{stars(r.rating)}</div>
              <p>{r.text[locale]}</p>
              <div className="who">
                <span className="av">{[...r.name[locale]][0]}</span>
                <div>
                  <strong>{r.name[locale]}</strong>
                  <small>{[r.city?.[locale], r.product?.[locale]].filter(Boolean).join(" · ")}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <form className="rform" onSubmit={submit}>
          <h3>{t("reviews.formTitle")}</h3>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t("reviews.name")}
            aria-label={t("reviews.name")}
            minLength={2} maxLength={60} required
          />
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            aria-label="Note"
          >
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{stars(n)}</option>)}
          </select>
          <textarea
            rows={3}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder={t("reviews.text")}
            aria-label={t("reviews.text")}
            minLength={5} maxLength={1000} required
          />
          <button className="btn" disabled={status === "sending"}>{t("reviews.send")}</button>
          {message && <p className={`form-msg${status === "error" ? " err" : ""}`} role="status">{message}</p>}
        </form>
      </div>
    </section>
  );
}
