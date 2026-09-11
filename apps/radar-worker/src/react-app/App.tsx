import { FormEvent, useEffect, useMemo, useState } from "react";
import "./App.css";

type Prospect = {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number | null;
  reviews: number | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  bookingUrl: string | null;
  score: number;
  band: "hot" | "priority" | "watch" | "low" | "skip";
  eligible: boolean;
};

type RadarRun = {
  id: string;
  query: string;
  cached?: boolean;
  medianReviews: number | null;
  prospects: Prospect[];
};

type CheckStats = {
  views: number;
  ctaClicks: number;
  activationIntents: number;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  lastCtaAt: string | null;
  lastActivationAt: string | null;
};

type SharePack = {
  token: string;
  shareUrl: string;
  expiresAt: string;
  outreachMessage: string;
  stats: Pick<CheckStats, "views" | "ctaClicks" | "activationIntents">;
};

type PublicCheck = {
  token: string;
  createdAt: string;
  expiresAt: string;
  business: {
    name: string;
    category: string;
    city: string;
    address: string;
    rating: number | null;
    reviews: number | null;
    positionSignal: number;
    googleMapsUri: string | null;
  };
  benchmark: {
    observedBusinesses: number;
    medianReviews: number | null;
    medianRating: number | null;
  };
  signals: {
    websitePresent: boolean;
    socialLinked: boolean;
    directActionPresent: boolean;
  };
  query: string;
  headline: string;
  journey: Array<{
    eyebrow: string;
    title: string;
    body: string;
    proof: string | null;
    tone: "good" | "watch" | "neutral";
  }>;
  actions: Array<{ title: string; body: string }>;
  verdict: {
    eyebrow: string;
    title: string;
    body: string;
  };
  evidence: string[];
  claimRule: string;
  offer: {
    label: string;
    priceEur: number;
    note: string;
  };
  cta: {
    label: string;
    href: string;
  };
};

function usePublicCheck(token: string) {
  const [check, setCheck] = useState<PublicCheck | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checks/" + encodeURIComponent(token))
      .then(async (response) => {
        const body = await response.json() as PublicCheck | { error: string };
        if (!response.ok) throw new Error("error" in body ? body.error : "check_failed");
        if (!cancelled) setCheck(body as PublicCheck);
      })
      .catch(() => {
        if (!cancelled) setError("Questo check non è disponibile o è scaduto.");
      });
    return () => { cancelled = true; };
  }, [token]);

  return { check, error };
}

function BrandBar({ suffix = "CHECK PRIVATO" }: { suffix?: string }) {
  return (
    <header className="public-brand">
      <strong>TROVATEMI.IT <i>★</i></strong>
      <span>{suffix}</span>
    </header>
  );
}

function LoadingCheck() {
  return (
    <div className="public-check-shell">
      <BrandBar />
      <main className="public-check loading-check">Sto guardando quello che vede un cliente…</main>
    </div>
  );
}

function PublicCheckPage({ token }: { token: string }) {
  const { check, error } = usePublicCheck(token);

  useEffect(() => {
    const key = "trovatemi-view-" + token;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/checks/" + encodeURIComponent(token) + "/events/view", { method: "POST" });
  }, [token]);

  if (error) {
    return (
      <div className="public-check-shell">
        <BrandBar />
        <main className="public-check error-card">
          <p className="eyebrow">CHECK NON DISPONIBILE</p>
          <h1>QUESTO LINK<br />NON È PIÙ ATTIVO.</h1>
          <p>{error}</p>
        </main>
      </div>
    );
  }

  if (!check) return <LoadingCheck />;

  const expiry = new Date(check.expiresAt).toLocaleDateString("it-IT");

  return (
    <div className="public-check-shell">
      <BrandBar />

      <main className="story">
        <section className="story-screen story-hero">
          <div className="story-inner">
            <p className="eyebrow">{check.headline.toUpperCase()}</p>
            <h1>{check.business.name.toUpperCase()}</h1>
            <p className="story-lead">
              Ho fatto una cosa semplice: ho cercato <strong>“{check.query}”</strong> e ho seguito
              lo stesso percorso che potrebbe fare una persona prima di chiamarti.
            </p>
            <div className="search-pill"><span>⌕</span><b>{check.query}</b></div>
            <p className="scroll-cue">SCORRI · CI METTI MENO DI UN MINUTO ↓</p>
          </div>
        </section>

        {check.journey.map((step, index) => (
          <section className={"story-screen journey-screen tone-" + step.tone} key={step.eyebrow + "-" + index}>
            <div className="story-inner">
              <p className="eyebrow">{step.eyebrow}</p>
              <div className="journey-number">0{index + 1}</div>
              <h2>{step.title}</h2>
              {step.proof && <div className="big-proof">{step.proof}</div>}
              <p className="journey-copy">{step.body}</p>
            </div>
          </section>
        ))}

        <section className="story-screen verdict-screen">
          <div className="story-inner">
            <p className="eyebrow">{check.verdict.eyebrow}</p>
            <h2>{check.verdict.title}</h2>
            <p>{check.verdict.body}</p>
          </div>
        </section>

        <section className="story-screen fixes-screen">
          <div className="story-inner">
            <p className="eyebrow">LE 3 COSE CHE SISTEMEREI</p>
            <h2>NON RIFAREI TUTTO.<br />SISTEMEREI IL PERCORSO.</h2>
            <div className="fix-list">
              {check.actions.map((action, index) => (
                <article key={action.title}>
                  <span>0{index + 1}</span>
                  <div><h3>{action.title}</h3><p>{action.body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-screen final-screen">
          <div className="story-inner">
            <p className="eyebrow">TROVATEMI.IT ★</p>
            <h2>FATTI TROVARE.<br />FATTI SCEGLIERE.<br /><em>FATTI CONTATTARE.</em></h2>
            <p className="final-copy">
              Se vuoi, questo non resta un check. Lo trasformiamo in un sistema acceso sulla tua attività.
            </p>
            <a className="hero-cta" href={check.cta.href}>{check.cta.label} →</a>
            <small className="final-note">
              {check.offer.label} · €{check.offer.priceEur} una tantum. {check.offer.note}
            </small>
          </div>
        </section>

        <footer className="public-footer story-footer">
          <span>Check generato da segnali pubblici · valido fino al {expiry}</span>
          <span>{check.claimRule}</span>
        </footer>
      </main>
    </div>
  );
}

function ActivationPage({ token }: { token: string }) {
  const { check, error } = usePublicCheck(token);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  if (error) {
    return (
      <div className="activation-shell">
        <BrandBar suffix="ATTIVAZIONE" />
        <main className="activation-wrap"><h1>LINK NON DISPONIBILE.</h1><p>{error}</p></main>
      </div>
    );
  }

  if (!check) return <LoadingCheck />;

  async function activate() {
    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/checks/" + encodeURIComponent(token) + "/activation-intent", { method: "POST" });
      const body = await response.json() as {
        ok?: boolean;
        checkoutReady?: boolean;
        checkoutUrl?: string;
        status?: string;
      };
      if (!response.ok) throw new Error("activation_failed");

      if (body.checkoutReady && body.checkoutUrl) {
        window.location.assign(body.checkoutUrl);
        return;
      }

      setStatus("Richiesta registrata. Il checkout automatico non è ancora collegato in questa preview.");
    } catch {
      setStatus("Non sono riuscito ad avviare l'attivazione. Riprova.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="activation-shell">
      <BrandBar suffix="ATTIVAZIONE" />
      <main className="activation-wrap">
        <p className="eyebrow">PER {check.business.name.toUpperCase()}</p>
        <h1>ACCENDI<br />TROVATEMI.</h1>
        <p className="activation-lead">
          Il check ti ha fatto vedere dove il percorso si indebolisce. L'attivazione mette in funzione il sistema iniziale.
        </p>

        <section className="price-card">
          <div>
            <small>{check.offer.label.toUpperCase()}</small>
            <strong>€{check.offer.priceEur}</strong>
            <span>UNA TANTUM</span>
          </div>
          <ul>
            <li>Colleghiamo la tua presenza Google e salviamo il punto di partenza.</li>
            <li>Accendiamo il sistema per raccogliere recensioni reali.</li>
            <li>Prepariamo link, QR e messaggi di richiesta.</li>
            <li>Ti accompagniamo nei passaggi che richiedono il tuo consenso.</li>
            <li>Eventuali servizi ricorrenti sono separati: niente abbonamenti nascosti.</li>
          </ul>
        </section>

        <button className="activation-button" type="button" onClick={activate} disabled={sending}>
          {sending ? "PREPARO…" : "ATTIVA TROVATEMI · €" + check.offer.priceEur + " →"}
        </button>
        {status && <p className="activation-status">{status}</p>}

        <p className="activation-fineprint">
          In questa preview il pagamento parte solo quando è configurato un checkout reale. Nessun addebito viene simulato.
        </p>
      </main>
    </div>
  );
}

function bandLabel(band: Prospect["band"]) {
  if (band === "hot") return "CHIAMA ORA";
  if (band === "priority") return "CHIAMA";
  if (band === "watch") return "TIENI D'OCCHIO";
  if (band === "low") return "BASSA PRIORITÀ";
  return "LASCIA STARE";
}

function RadarApp() {
  const [category, setCategory] = useState("officina");
  const [city, setCity] = useState("Formia");
  const [run, setRun] = useState<RadarRun | null>(null);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [share, setShare] = useState<SharePack | null>(null);
  const [stats, setStats] = useState<CheckStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);
  const [error, setError] = useState("");

  const priorityCount = useMemo(
    () => run?.prospects.filter((p) => p.band === "hot" || p.band === "priority").length ?? 0,
    [run],
  );

  useEffect(() => {
    if (!share) return;
    let stopped = false;

    async function refresh() {
      try {
        const response = await fetch("/api/checks/" + encodeURIComponent(share.token) + "/stats");
        if (!response.ok) return;
        const body = await response.json() as CheckStats;
        if (!stopped) setStats(body);
      } catch {
        // Stats are helpful, never blocking.
      }
    }

    void refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [share]);

  async function scan(event: FormEvent) {
    event.preventDefault();
    setError("");
    setRun(null);
    setShare(null);
    setStats(null);
    setLoading(true);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category, city, limit: 10 }),
      });
      const payload = await response.json() as RadarRun | { error: string };
      if (!response.ok) throw new Error("error" in payload ? payload.error : "radar_failed");
      setRun(payload as RadarRun);
    } catch (err) {
      setError(err instanceof Error && err.message === "rate_limited"
        ? "Limite preview raggiunto per oggi."
        : err instanceof Error ? err.message : "Errore Radar");
    } finally {
      setLoading(false);
    }
  }

  async function generateCheck(prospect: Prospect) {
    if (!run || !prospect.eligible) return;
    setSharingId(prospect.id);
    setError("");
    try {
      const response = await fetch(
        "/api/runs/" + encodeURIComponent(run.id) + "/prospects/" + encodeURIComponent(prospect.id) + "/share",
        { method: "POST" },
      );
      const payload = await response.json() as SharePack | { error: string };
      if (!response.ok) throw new Error("error" in payload ? payload.error : "share_failed");
      setSelected(prospect);
      setShare(payload as SharePack);
      setStats(null);
      setCopied(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossibile generare il check.");
    } finally {
      setSharingId(null);
    }
  }

  async function copy(value: string, kind: "link" | "message") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError("Copia automatica non disponibile su questo browser.");
    }
  }

  function closeShare() {
    setSelected(null);
    setShare(null);
    setStats(null);
    setCopied(null);
  }

  return (
    <div className="app">
      <header className="topbar">
        <strong>TROVATEMI RADAR <i>★</i></strong>
        <span>INTERNO · TROVA CHI VALE LA PENA CHIAMARE</span>
      </header>

      <main className="wrap">
        <p className="kicker">CERCA → CAPIRE → MOSTRARE → CHIAMARE</p>
        <h1>CHI CHIAMERESTI<br />PER PRIMO?</h1>
        <p className="lead">
          Trovo attività che sembrano valide nella realtà ma lasciano valore per strada prima che il cliente scelga.
        </p>

        <form className="search" onSubmit={scan}>
          <label>Cosa cerchiamo<input value={category} onChange={(e) => setCategory(e.target.value)} required /></label>
          <label>Dove<input value={city} onChange={(e) => setCity(e.target.value)} required /></label>
          <button disabled={loading}>{loading ? "Cerco…" : "Trova attività →"}</button>
        </form>
        <p className="meta">Google Places + homepage pubblica · il punteggio è solo interno · nessun messaggio parte da solo.</p>

        {error && <div className="error">{error}</div>}

        {run && (
          <>
            <section className="summary">
              <div><small>ATTIVITÀ VISTE</small><b>{run.prospects.length}</b></div>
              <div><small>DA CHIAMARE PRIMA</small><b>{priorityCount}</b></div>
              <div><small>RECENSIONI MEDIANE</small><b>{run.medianReviews === null ? "—" : Math.round(run.medianReviews)}</b></div>
              <div><small>RICERCA</small><b className="source">{run.query}</b></div>
            </section>

            <div className="toolbar">
              <h2>{run.cached ? "Risultati salvati · " : ""}{run.query}</h2>
              <a href={"/api/runs/" + encodeURIComponent(run.id) + "/export.csv"}>Esporta CSV ↓</a>
            </div>

            <section className="table">
              {run.prospects.map((p) => (
                <article className={"prospect " + p.band} key={p.id}>
                  <div className="score"><span>{p.score}</span><small>priorità</small></div>
                  <div className="name">
                    <b>{p.name}</b>
                    <small>{p.address}</small>
                    <span className="band">{bandLabel(p.band)}</span>
                  </div>
                  <div className="cell"><b>{p.rating ?? "—"}{p.rating !== null ? " ★" : ""}</b><small>come ne parlano</small></div>
                  <div className="cell"><b>{p.reviews ?? "—"}</b><small>quante prove</small></div>
                  <div className="cell">
                    <b>{[p.website && "SITO", p.whatsapp && "WA", (p.instagram || p.facebook) && "SOCIAL"].filter(Boolean).join(" · ") || "—"}</b>
                    <small>cosa ho trovato</small>
                  </div>
                  <button
                    type="button"
                    disabled={!p.eligible || sharingId === p.id}
                    onClick={() => generateCheck(p)}
                  >
                    {sharingId === p.id ? "Creo…" : p.eligible ? "Fammi vedere →" : "Passa oltre"}
                  </button>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

      {selected && share && (
        <div className="backdrop" role="presentation" onClick={closeShare}>
          <section className="modal share-modal" role="dialog" aria-modal="true" aria-label="Check condivisibile" onClick={(e) => e.stopPropagation()}>
            <small>PRONTO DA MANDARE</small>
            <h3>{selected.name}</h3>
            <p>Il check pubblico racconta il percorso come lo vivrebbe un cliente. Nessuno score interno esce da qui.</p>

            <div className="live-stats">
              <div><small>APERTO</small><b>{stats?.views ?? 0}</b></div>
              <div><small>SISTEMAMELO</small><b>{stats?.ctaClicks ?? 0}</b></div>
              <div><small>ATTIVAZIONE</small><b>{stats?.activationIntents ?? 0}</b></div>
            </div>

            <div className="share-box">
              <small>LINK PRIVATO · 30 GIORNI</small>
              <a href={share.shareUrl} target="_blank" rel="noreferrer">{share.shareUrl}</a>
              <div className="share-actions">
                <button type="button" onClick={() => copy(share.shareUrl, "link")}>
                  {copied === "link" ? "Copiato ✓" : "Copia link"}
                </button>
                <a className="open-check" href={share.shareUrl} target="_blank" rel="noreferrer">Vedi come lo vede lui ↗</a>
              </div>
            </div>

            <div className="message-box">
              <small>MESSAGGIO PRONTO</small>
              <p>{share.outreachMessage}</p>
              <div className="share-actions">
                <button type="button" onClick={() => copy(share.outreachMessage, "message")}>
                  {copied === "message" ? "Copiato ✓" : "Copia messaggio"}
                </button>
                <a
                  className="open-check"
                  href={"https://wa.me/?text=" + encodeURIComponent(share.outreachMessage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Apri WhatsApp ↗
                </a>
              </div>
            </div>

            <p className="rule">
              Link valido fino al {new Date(share.expiresAt).toLocaleDateString("it-IT")}. Aperture e CTA si aggiornano automaticamente.
            </p>
            <button className="close-button" type="button" onClick={closeShare}>Chiudi</button>
          </section>
        </div>
      )}
    </div>
  );
}

function App() {
  const checkMatch = window.location.pathname.match(/^\/c\/([a-f0-9]{32})\/?$/);
  if (checkMatch) return <PublicCheckPage token={checkMatch[1]} />;

  const activationMatch = window.location.pathname.match(/^\/a\/([a-f0-9]{32})\/?$/);
  if (activationMatch) return <ActivationPage token={activationMatch[1]} />;

  return <RadarApp />;
}

export default App;
