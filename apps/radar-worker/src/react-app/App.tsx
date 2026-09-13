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
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  if (error) {
    return (
      <div className="activation-shell">
        <BrandBar suffix="ATTIVAZIONE" />
        <main className="activation-error">
          <span>LINK NON DISPONIBILE</span>
          <h1>Questo check non è più attivo.</h1>
          <p>{error}</p>
        </main>
      </div>
    );
  }

  if (!check) return <LoadingCheck />;

  async function activate() {
    setSending(true);
    setStatus("");
    try {
      const response = await fetch("/api/checks/" + encodeURIComponent(token) + "/activation-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ownerName, email }),
      });
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

      setStatus("Richiesta registrata. Ti portiamo al pagamento appena il checkout è collegato.");
    } catch {
      setStatus("Non sono riuscito ad avviare l'attivazione. Riprova.");
    } finally {
      setSending(false);
    }
  }

  const validIdentity = ownerName.trim().length >= 2 && email.includes("@");

  return (
    <div className="activation-shell">
      <header className="activation-header">
        <strong>TROVATEMI.IT <i>★</i></strong>
        <span>ATTIVAZIONE SICURA</span>
      </header>

      <main className="activation-page">
        <section className="activation-intro">
          <div className="activation-kicker">PER {check.business.name.toUpperCase()}</div>
          <h1>HAI VISTO IL PROBLEMA.<br /><em>ORA LO SISTEMIAMO.</em></h1>
          <p>
            L'attivazione mette in funzione il primo sistema Trovatemi sulla tua attività.
            Niente rifacimenti inutili: partiamo da prove, presenza e contatto.
          </p>

          <div className="activation-trust">
            <span>✓ Una tantum</span>
            <span>✓ Nessun abbonamento nascosto</span>
            <span>✓ Setup guidato</span>
          </div>
        </section>

        <section className="activation-grid">
          <aside className="order-card">
            <div className="order-head">
              <div>
                <small>{check.offer.label.toUpperCase()}</small>
                <h2>Accendi Trovatemi</h2>
              </div>
              <div className="order-price">
                <strong>€{check.offer.priceEur}</strong>
                <span>una tantum</span>
              </div>
            </div>

            <div className="order-list">
              <article><b>01</b><div><strong>Presenza collegata</strong><span>Partiamo dalla tua situazione reale e salviamo il punto zero.</span></div></article>
              <article><b>02</b><div><strong>Sistema recensioni</strong><span>Link, QR e messaggi pronti per trasformare clienti soddisfatti in prove.</span></div></article>
              <article><b>03</b><div><strong>Percorso di contatto</strong><span>Rendiamo più chiaro il prossimo passo per chi ti sta scegliendo.</span></div></article>
              <article><b>04</b><div><strong>Setup accompagnato</strong><span>Tu fai solo i passaggi che richiedono il tuo consenso.</span></div></article>
            </div>

            <div className="order-note">
              Eventuali servizi ricorrenti vengono proposti separatamente. Questo importo non nasconde un abbonamento.
            </div>
          </aside>

          <section className="activation-form-card">
            <div className="form-head">
              <small>ULTIMO PASSO</small>
              <h2>Dove ti mandiamo l'accesso?</h2>
              <p>Ci servono solo i dati minimi per preparare l'attivazione.</p>
            </div>

            <div className="activation-form">
              <label>
                <span>IL TUO NOME</span>
                <input
                  value={ownerName}
                  onChange={(event) => setOwnerName(event.target.value)}
                  placeholder="Mario Rossi"
                  autoComplete="name"
                />
              </label>

              <label>
                <span>EMAIL DI LAVORO</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="mario@officina.it"
                  type="email"
                  autoComplete="email"
                />
              </label>
            </div>

            <button
              className="activation-button"
              type="button"
              onClick={activate}
              disabled={sending || !validIdentity}
            >
              <span>{sending ? "PREPARO L'ATTIVAZIONE…" : "ATTIVA TROVATEMI · €" + check.offer.priceEur}</span>
              <b>→</b>
            </button>

            <p className="activation-fineprint">
              Pagamento e provisioning partono solo dal checkout reale. Nessun addebito viene simulato.
            </p>

            {status && <div className="activation-status">{status}</div>}
          </section>
        </section>
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
    const token = share.token;
    let stopped = false;

    async function refresh() {
      try {
        const response = await fetch("/api/checks/" + encodeURIComponent(token) + "/stats");
        if (!response.ok) return;
        const body = await response.json() as CheckStats;
        if (!stopped) setStats(body);
      } catch {
        // Non-blocking telemetry.
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
    <div className="ops-app">
      <header className="ops-header">
        <div className="ops-brand">
          <strong>TROVATEMI</strong><i>★</i>
          <span>RADAR</span>
        </div>
        <div className="ops-header-right">
          <span className="live-dot"></span>
          <span>Google Places live</span>
          <b>INTERNO</b>
        </div>
      </header>

      <main className="ops-main">
        <section className="ops-hero">
          <div>
            <div className="ops-kicker">PROSPECTING CONTROL ROOM</div>
            <h1>Chi vale la pena<br />chiamare <em>oggi?</em></h1>
            <p>
              Trova attività che sembrano solide nella realtà ma lasciano valore per strada
              prima che il cliente scelga.
            </p>
          </div>

          <div className="ops-principle">
            <small>REGOLA</small>
            <strong>Non cerchiamo “aziende brutte”.</strong>
            <span>Cerchiamo aziende migliori di come appaiono.</span>
          </div>
        </section>

        <form className="ops-search" onSubmit={scan}>
          <label>
            <span>COSA CERCHIAMO</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)} required />
          </label>
          <label>
            <span>DOVE</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>
          <button disabled={loading}>
            <span>{loading ? "SCANSIONE…" : "SCANSIONA MERCATO"}</span>
            <b>→</b>
          </button>
        </form>

        <div className="ops-meta">
          <span>Google Places + homepage pubblica</span>
          <span>Score solo interno</span>
          <span>Nessun outreach automatico</span>
        </div>

        {error && <div className="ops-error"><b>ATTENZIONE</b><span>{error}</span></div>}

        {run && (
          <>
            <section className="kpi-grid">
              <article>
                <div className="kpi-icon">◎</div>
                <div><small>ATTIVITÀ OSSERVATE</small><strong>{run.prospects.length}</strong></div>
              </article>
              <article>
                <div className="kpi-icon yellow">↗</div>
                <div><small>DA CHIAMARE PRIMA</small><strong>{priorityCount}</strong></div>
              </article>
              <article>
                <div className="kpi-icon">★</div>
                <div><small>RECENSIONI MEDIANE</small><strong>{run.medianReviews === null ? "—" : Math.round(run.medianReviews)}</strong></div>
              </article>
              <article className="query-kpi">
                <div className="kpi-icon">⌕</div>
                <div><small>RICERCA</small><strong>{run.query}</strong></div>
              </article>
            </section>

            <section className="results-panel">
              <div className="results-panel-head">
                <div>
                  <small>{run.cached ? "CACHE ATTIVA" : "SCANSIONE LIVE"}</small>
                  <h2>{run.query}</h2>
                </div>
                <a href={"/api/runs/" + encodeURIComponent(run.id) + "/export.csv"}>Esporta CSV ↓</a>
              </div>

              <div className="prospect-table-head">
                <span>PRIORITÀ</span>
                <span>ATTIVITÀ</span>
                <span>RATING</span>
                <span>RECENSIONI</span>
                <span>SEGNALI</span>
                <span></span>
              </div>

              <div className="prospect-list">
                {run.prospects.map((p) => (
                  <article className={"prospect-row " + p.band} key={p.id}>
                    <div className="priority-cell">
                      <div className="score-pill"><strong>{p.score}</strong><span>/100</span></div>
                      <span className={"band-chip " + p.band}>{bandLabel(p.band)}</span>
                    </div>

                    <div className="business-cell">
                      <strong>{p.name}</strong>
                      <span>{p.address}</span>
                    </div>

                    <div className="data-cell">
                      <strong>{p.rating ?? "—"}{p.rating !== null ? " ★" : ""}</strong>
                      <span>rating</span>
                    </div>

                    <div className="data-cell">
                      <strong>{p.reviews ?? "—"}</strong>
                      <span>prove</span>
                    </div>

                    <div className="signals-cell">
                      {p.website && <span>SITO</span>}
                      {p.whatsapp && <span>WA</span>}
                      {(p.instagram || p.facebook) && <span>SOCIAL</span>}
                      {!p.website && !p.whatsapp && !p.instagram && !p.facebook && <span className="empty-signal">—</span>}
                    </div>

                    <button
                      className="row-action"
                      type="button"
                      disabled={!p.eligible || sharingId === p.id}
                      onClick={() => generateCheck(p)}
                    >
                      {sharingId === p.id ? "Creo…" : p.eligible ? "Genera check →" : "Passa"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {selected && share && (
        <div className="backdrop" role="presentation" onClick={closeShare}>
          <section className="share-drawer" role="dialog" aria-modal="true" aria-label="Check condivisibile" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <small>CHECK PRONTO</small>
                <h3>{selected.name}</h3>
                <p>Il prospect vede la storia. Tu vedi il comportamento.</p>
              </div>
              <button className="icon-close" type="button" onClick={closeShare}>×</button>
            </div>

            <div className="live-stats modern">
              <article><small>APERTO</small><strong>{stats?.views ?? 0}</strong><span>view</span></article>
              <article><small>SISTEMAMELO</small><strong>{stats?.ctaClicks ?? 0}</strong><span>click</span></article>
              <article><small>ATTIVAZIONE</small><strong>{stats?.activationIntents ?? 0}</strong><span>intent</span></article>
            </div>

            <section className="drawer-block">
              <div className="drawer-block-head">
                <span>LINK PRIVATO</span>
                <small>30 giorni</small>
              </div>
              <a className="share-url" href={share.shareUrl} target="_blank" rel="noreferrer">{share.shareUrl}</a>
              <div className="drawer-actions">
                <button type="button" onClick={() => copy(share.shareUrl, "link")}>
                  {copied === "link" ? "Copiato ✓" : "Copia link"}
                </button>
                <a href={share.shareUrl} target="_blank" rel="noreferrer">Apri check ↗</a>
              </div>
            </section>

            <section className="drawer-block message">
              <div className="drawer-block-head">
                <span>MESSAGGIO PRONTO</span>
                <small>WhatsApp</small>
              </div>
              <p>{share.outreachMessage}</p>
              <div className="drawer-actions">
                <button type="button" onClick={() => copy(share.outreachMessage, "message")}>
                  {copied === "message" ? "Copiato ✓" : "Copia messaggio"}
                </button>
                <a href={"https://wa.me/?text=" + encodeURIComponent(share.outreachMessage)} target="_blank" rel="noreferrer">Apri WhatsApp ↗</a>
              </div>
            </section>

            <div className="drawer-foot">
              Link valido fino al {new Date(share.expiresAt).toLocaleDateString("it-IT")} · telemetria aggiornata ogni 5 secondi.
            </div>
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
