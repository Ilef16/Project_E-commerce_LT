import { t, type Locale, type MessageKey } from "@/lib/i18n";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";

type P = { locale: Locale };

export function Strip({ locale: l }: P) {
  return (
    <div className="strip">
      <div className="wrap">
        <span>{t(l, "strip.1")}</span>
        <span>{t(l, "strip.2")}</span>
        <span>{t(l, "strip.3")}</span>
      </div>
    </div>
  );
}

const STEPS = [1, 2, 3] as const;

export function About({ locale: l }: P) {
  return (
    <section id="apropos">
      <div className="wrap">
        <div className="ctr">
          <span className="eyebrow">{t(l, "nav.about")}</span>
          <h2>{t(l, "about.title")}</h2>
        </div>
        <div className="ab">
          <div>
            <p>{t(l, "about.p1")}</p>
            <div className="quote">{t(l, "about.quote")}</div>
            <p>{t(l, "about.p2")}</p>
          </div>
          <Tilt3D className="t3">
            <div className="stk">
              <div className="s1 ph" />
              <div className="s2 ph" />
              <div className="s3 ph" />
              <div className="s4">{t(l, "about.since")}</div>
            </div>
          </Tilt3D>
        </div>
        <div className="stats">
          <div className="stat"><b>100 %</b><span>{t(l, "stat.1.label")}</span></div>
          <div className="stat"><b>2025</b><span>{t(l, "stat.2.label")}</span></div>
          <div className="stat"><b>{t(l, "stat.3.value")}</b><span>{t(l, "stat.3.label")}</span></div>
          <div className="stat"><b>{t(l, "stat.4.value")}</b><span>{t(l, "stat.4.label")}</span></div>
        </div>
        <div className="svc">
          {STEPS.map((n) => (
            <Reveal key={n} className="sv">
              <i>{String(n).padStart(2, "0")}</i>
              <h3>{t(l, `step.${n}.title` as MessageKey)}</h3>
              <p>{t(l, `step.${n}.text` as MessageKey)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const CREATIONS = ["cat.keys", "cat.acc", "cat.chain", "cat.bag", "cat.more"] as const;

export function Creations({ locale: l }: P) {
  return (
    <section className="about" id="creations">
      <div className="wrap">
        <span className="eyebrow">{t(l, "creations.eyebrow")}</span>
        <h2>{t(l, "creations.title")}</h2>
        <p>{t(l, "creations.text")}</p>
        <div className="cats">
          {CREATIONS.map((k) => (
            <Reveal key={k} className="cat">
              <i />
              <span>{t(l, k)}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Universe({ locale: l }: P) {
  return (
    <section id="univers">
      <div className="wrap">
        <div className="ctr">
          <span className="eyebrow">{t(l, "universe.eyebrow")}</span>
          <h2>{t(l, "universe.title")}</h2>
        </div>
        <div className="gal">
          <Reveal as="figure" className="g g1 ph"><figcaption>{t(l, "gal.1")}</figcaption></Reveal>
          <Reveal as="figure" className="g g2 ph"><figcaption>{t(l, "gal.2")}</figcaption></Reveal>
          <Reveal as="figure" className="g g3 ph"><figcaption>{t(l, "gal.3")}</figcaption></Reveal>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [1, 2, 3, 4] as const;

export function Services({ locale: l }: P) {
  return (
    <section id="services">
      <div className="wrap">
        <div className="ctr">
          <span className="eyebrow">{t(l, "services.eyebrow")}</span>
          <h2>{t(l, "nav.services")}</h2>
        </div>
        <div className="svc">
          {SERVICES.map((n) => (
            <Reveal key={n} className="sv">
              <i>{String(n).padStart(2, "0")}</i>
              <h3>{t(l, `svc.${n}.title` as MessageKey)}</h3>
              <p>{t(l, `svc.${n}.text` as MessageKey)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ locale: l }: P) {
  return (
    <footer>
      <div className="wrap">
        <strong>Louli’s Touch</strong>
        <span>{t(l, "footer.tagline")}</span>
      </div>
    </footer>
  );
}
