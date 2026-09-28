"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { postJson } from "@/lib/client-api";
import { useShop } from "./ShopProvider";

type Status = "idle" | "sending" | "done" | "error";

/** Fenêtre partagée : « Commander » (produit du catalogue) et « Demander cette création » (sur mesure). */
export default function RequestDialog() {
  const { locale, t, draft, closeRequest } = useShop();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft) return;
    setStatus("idle");
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRequest();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, closeRequest]);

  if (!draft) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await postJson("/requests", {
        type: draft.type,
        name: form.name,
        phone: form.phone,
        message: form.message || null,
        productId: draft.product?.id ?? null,
        piece: draft.piece ?? null,
        color: draft.color ?? null,
        locale,
      });
      setStatus("done");
      setForm((f) => ({ ...f, message: "" }));
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-bg" onClick={closeRequest}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reqTitle" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={closeRequest} aria-label={t("ui.close")}>×</button>
        <h3 id="reqTitle">{draft.type === "order" ? t("req.orderTitle") : t("req.customTitle")}</h3>
        <p className="modal-item"><b>{t("req.item")} :</b> {draft.label}</p>

        {status === "done" ? (
          <>
            <p className="form-msg" role="status" style={{ marginBottom: 16 }}>{t("req.success")}</p>
            <button className="btn" onClick={closeRequest}>{t("ui.close")}</button>
          </>
        ) : (
          <form className="mform" onSubmit={submit}>
            <input
              ref={firstField}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("req.name")} aria-label={t("req.name")}
              autoComplete="name" minLength={2} maxLength={80} required
            />
            <input
              type="tel" inputMode="tel" dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t("req.phone")} aria-label={t("req.phone")}
              autoComplete="tel" pattern="[0-9+()\s.\-]{8,20}" required
            />
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t("req.message")} aria-label={t("req.message")}
              maxLength={1000}
            />
            <button className="btn" disabled={status === "sending"}>
              {status === "sending" ? t("req.sending") : t("req.send")}
            </button>
            {status === "error" && <p className="form-msg err" role="alert">{t("req.error")}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
