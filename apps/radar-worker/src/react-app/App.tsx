import { FormEvent, useEffect, useMemo, useState } from "react";
import "./App.css";

type CheckItem = { label: string; reason: string };

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
  checkBrief: {
    headline: string;
    query: string;
    publicScoreAllowed: false;
    threeThingsToShow: CheckItem[];
    claimRule: string;
  };
};

type RadarRun = {
  id: string;
  query: string;
  cached?: boolean;
  medianReviews: number | null;
  prospects: Prospect[];
};

type SharePack = {
  shareUrl: string;
  expiresAt: string;
  outreachMessage: string;
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
  query: string;
  headline: string;
  threeThingsToShow: CheckItem[];
  evidence: string[];
  claimRule: string;
  cta: {
    label: string;
    href: string;
  };
};

function PublicCheckPage({ token }: { token: string }) {
  const [check, setCheck] = useState<PublicCheck | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/checks/${encodeURIComponent(token)}`)
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

  if (error) {
    return (
      <div className="public-check-shell">
        <header className="public-brand">TROVATEMI.IT <i>★</i></header>
        <main className="public-check error-card">
          <p className="eyebrow">CHECK NON DISPONIBILE</p>
          <h1>QUESTO LINK<br />NON È PIÙ ATTIVO.</h1>
          <p>{error}</p>
        </main>
      </div>
    );
  }

  if (!check) {
    return (
      <div className="public-check-shell">
        <header className="public-brand">TROVATEMI.IT <i>★</i></header>
        <main className="public-check loading-check">Sto ricostruendo quello che vede un cliente…</main>
      </div>
    );
  }

  const expiry = new Date(check.expiresAt).toLocaleDateString("it-IT");

  return (
    <div className="public-check-shell">
      <header className="public-brand">TROVATEMI.IT <i>★</i></header>

      <main className="public-check">
        <p className="eyebrow">TI HO CERCATO COME TI CERCHEREBBE UN CLIENTE.</p>
        <h1>{check.business.name.toUpperCase()}</h1>
        <p className="public-lead">
          Ho cercato <strong>“{check.query}”</strong>. Non è una pagella SEO:
          è una fotografia dei segnali pubblici che una persona può incontrare prima di scegliere.
        </p>

        <div className="query-strip">
          <span>⌕</span><b>{check.query}</b>
        </div>

        <section className="public-snapshot">
          <article>
            <small>VALUTAZIONE</small>
            <strong>{check.business.rating === null ? "—" : `${check.business.rating.toFixed(1)} ★`}</strong>
          </article>
          <article>
            <small>RECENSIONI</small>
            <strong>{check.business.reviews ?? "—"}</strong>
          </article>
          <article>
            <small>NELLA RICERCA OSSERVATA</small>
            <strong>#{check.business.positionSignal}</strong>
          </article>
        </section>

        <section className="public-section">
          <p className="section-no">01 · COSA HO TROVATO</p>
          <h2>TRE COSE CHE<br />GUARDEREI SUBITO.</h2>
          <div className="public-issues">
            {check.threeThingsToShow.map((item, index) => (
              <article key={`${item.label}-${index}`}>
                <span>0{index + 1}</span>
                <div><small>{item.label}</small><b>{item.reason}</b></div>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section proof-section">
          <p className="section-no">02 · LE PROVE</p>
          <h2>NIENTE FUMO.<br />SOLO COSE OSSERVATE.</h2>
          <div className="evidence-list">
            {check.evidence.map((item) => <div key={item}>✓ {item}</div>)}
          </div>
        </section>

        <section className="choice-card">
          <p>IL PUNTO NON È “FARE PIÙ MARKETING”.</p>
          <h2>È ESSERE PIÙ FACILE<br /><em>DA TROVARE, SCEGLIERE E CONTATTARE.</em></h2>
          <p className="choice-copy">
            Se queste differenze raccontano peggio la tua attività di quanto meriti,
            Trovatemi serve esattamente a sistemare quel gap.
          </p>
          <a href={check.cta.href} target="_blank" rel="noreferrer">{check.cta.label} →</a>
        </section>

        <footer className="public-footer">
          <span>Check generato da segnali pubblici · valido fino al {expiry}</span>
          <span>{check.claimRule}</span>
        </footer>
      </main>
    </div>
  );
}

function RadarApp() {
  const [category, setCategory] = useState("parrucchiere");
  const [city, setCity] = useState("Formia");
  const [run, setRun] = useState<RadarRun | null>(null);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [share, setShare] = useState<SharePack | null>(null);
  const [loading, setLoading] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);
  const [error, setError] = useState("");

  const priorityCount = useMemo(
    () => run?.prospects.filter((p) => p.band === "hot" || p.band === "priority").length ?? 0,
    [run],
  );

  async function scan(event: FormEvent) {
    event.preventDefault();
    setError("");
    setRun(null);
    setShare(null);
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
        `/api/runs/${encodeURIComponent(run.id)}/prospects/${encodeURIComponent(prospect.id)}/share`,
        { method: "POST" },
      );
      const payload = await response.json() as SharePack | { error: string };
      if (!response.ok) throw new Error("error" in payload ? payload.error : "share_failed");
      setSelected(prospect);
      setShare(payload as SharePack);
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
    setCopied(null);
  }

  return (
    <div className="app">
      <header className="topbar">
        <strong>TROVATEMI RADAR <i>★</i></strong>
        <span>INTERNAL PREVIEW · PUBLIC BUSINESS DATA</span>
      </header>

      <main className="wrap">
        <p className="kicker">PROSPECTING → PROVA → CONVERSAZIONE</p>
        <h1>CHI VALE LA PENA<br />CONTATTARE OGGI?</h1>
        <p className="lead">
          Trova attività locali buone ma sottorappresentate. Il punteggio resta interno:
          al titolare mostriamo soltanto ciò che possiamo provare.
        </p>

        <form className="search" onSubmit={scan}>
          <label>Categoria<input value={category} onChange={(e) => setCategory(e.target.value)} required /></label>
          <label>Città<input value={city} onChange={(e) => setCity(e.target.value)} required /></label>
          <button disabled={loading}>{loading ? "Scansiono…" : "Scansiona zona →"}</button>
        </form>
        <p className="meta">Google Places + homepage pubblica · max 12 attività · cache 6h · nessun outreach automatico.</p>

        {error && <div className="error">{error}</div>}

        {run && (
          <>
            <section className="summary">
              <div><small>Trovati</small><b>{run.prospects.length}</b></div>
              <div><small>Priority / hot</small><b>{priorityCount}</b></div>
              <div><small>Mediana recensioni</small><b>{run.medianReviews === null ? "—" : Math.round(run.medianReviews)}</b></div>
              <div><small>Fonte</small><b className="source">Google Places</b></div>
            </section>

            <div className="toolbar">
              <h2>{run.query}{run.cached ? " · cache" : ""}</h2>
              <a href={`/api/runs/${encodeURIComponent(run.id)}/export.csv`}>Esporta CSV ↓</a>
            </div>

            <section className="table">
              {run.prospects.map((p) => (
                <article className={`prospect ${p.band}`} key={p.id}>
                  <div className="score">{p.score}</div>
                  <div className="name">
                    <b>{p.name}</b>
                    <small>{p.address}</small>
                    <span className="band">{p.band}</span>
                  </div>
                  <div className="cell"><b>{p.rating ?? "—"}{p.rating !== null ? " ★" : ""}</b><small>rating</small></div>
                  <div className="cell"><b>{p.reviews ?? "—"}</b><small>recensioni</small></div>
                  <div className="cell"><b>{[p.instagram && "IG", p.facebook && "FB", p.email && "EMAIL"].filter(Boolean).join(" ") || "—"}</b><small>{p.website ? "sito trovato" : "no sito"}</small></div>
                  <button
                    type="button"
                    disabled={!p.eligible || sharingId === p.id}
                    onClick={() => generateCheck(p)}
                  >
                    {sharingId === p.id ? "Genero…" : p.eligible ? "Genera check →" : "Non idoneo"}
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
            <small>CHECK PRONTO</small>
            <h3>{selected.name}</h3>
            <p>{selected.checkBrief.headline}</p>

            <div className="proof">
              {selected.checkBrief.threeThingsToShow.map((item) => (
                <div key={item.label}><b>{item.label}</b><span>{item.reason}</span></div>
              ))}
            </div>

            <div className="share-box">
              <small>LINK PUBBLICO · 30 GIORNI</small>
              <a href={share.shareUrl} target="_blank" rel="noreferrer">{share.shareUrl}</a>
              <div className="share-actions">
                <button type="button" onClick={() => copy(share.shareUrl, "link")}>
                  {copied === "link" ? "Copiato ✓" : "Copia link"}
                </button>
                <a className="open-check" href={share.shareUrl} target="_blank" rel="noreferrer">Apri check ↗</a>
              </div>
            </div>

            <div className="message-box">
              <small>MESSAGGIO PRONTO</small>
              <p>{share.outreachMessage}</p>
              <button type="button" onClick={() => copy(share.outreachMessage, "message")}>
                {copied === "message" ? "Copiato ✓" : "Copia messaggio"}
              </button>
            </div>

            <p className="rule">
              Lo score resta interno. Il link pubblico contiene solo evidenze minimizzate e scade il {new Date(share.expiresAt).toLocaleDateString("it-IT")}.
            </p>
            <button className="close-button" type="button" onClick={closeShare}>Chiudi</button>
          </section>
        </div>
      )}
    </div>
  );
}

function App() {
  const match = window.location.pathname.match(/^\/c\/([a-f0-9]{32})\/?$/);
  return match ? <PublicCheckPage token={match[1]} /> : <RadarApp />;
}

export default App;
