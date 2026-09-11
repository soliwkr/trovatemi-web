import { FormEvent, useMemo, useState } from "react";
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
  checkBrief: {
    headline: string;
    query: string;
    publicScoreAllowed: false;
    threeThingsToShow: Array<{ label: string; reason: string }>;
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

function App() {
  const [category, setCategory] = useState("parrucchiere");
  const [city, setCity] = useState("Formia");
  const [run, setRun] = useState<RadarRun | null>(null);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priorityCount = useMemo(
    () => run?.prospects.filter((p) => p.band === "hot" || p.band === "priority").length ?? 0,
    [run],
  );

  async function scan(event: FormEvent) {
    event.preventDefault();
    setError("");
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
                  <button type="button" onClick={() => setSelected(p)}>Apri check</button>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

      {selected && (
        <div className="backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="modal" role="dialog" aria-modal="true" aria-label="Check brief" onClick={(e) => e.stopPropagation()}>
            <small>CHECK BRIEF</small>
            <h3>{selected.name}</h3>
            <p>{selected.checkBrief.headline} Query: <b>{selected.checkBrief.query}</b></p>
            <div className="proof">
              {selected.checkBrief.threeThingsToShow.map((item) => (
                <div key={item.label}><b>{item.label}</b><span>{item.reason}</span></div>
              ))}
            </div>
            <p className="rule">{selected.checkBrief.claimRule}</p>
            <button type="button" onClick={() => setSelected(null)}>Chiudi</button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
