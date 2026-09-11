import type { PublicCheck } from "./types.ts";

function esc(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatNumber(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(value);
}

function formatRating(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function comparisonWidths(a: number | null, b: number | null): [number, number] {
  if (a === null || b === null || (a <= 0 && b <= 0)) return [50, 50];
  const max = Math.max(a, b, 1);
  return [
    Math.max(10, Math.round((a / max) * 100)),
    Math.max(10, Math.round((b / max) * 100)),
  ];
}

function signalRow(label: string, present: boolean): string {
  return `
    <div class="signal-row">
      <span class="signal-label">${esc(label)}</span>
      <span class="signal-state ${present ? "yes" : "no"}">${present ? "✓" : "—"}</span>
    </div>
  `;
}

export function renderPublicCheck(check: PublicCheck): string {
  const expiry = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(check.expiresAt));

  const reviews = check.business.reviews;
  const medianReviews = check.benchmark.medianReviews;
  const [mineWidth, medianWidth] = comparisonWidths(reviews, medianReviews);
  const reviewComparisonAvailable = reviews !== null && medianReviews !== null;

  const reviewGap = reviewComparisonAvailable && reviews < medianReviews;
  const strongVerdict = check.verdict.title.toUpperCase().includes("SEI MEGLIO DI COME APPARI");
  const contactNeedsWork = !check.signals.websitePresent || !check.signals.directActionPresent;

  const comparisonCaption = reviewComparisonAvailable
    ? reviewGap
      ? "Non dice chi lavora meglio. Dice chi, a colpo d’occhio, sembra più scelto."
      : "Sulle recensioni sei già in linea o sopra la mediana osservata. Qui il problema è far pesare meglio quello che hai."
    : "Qui non invento un confronto: mostro solo ciò che ho potuto osservare.";

  const contactPunch = contactNeedsWork
    ? "QUI MI FAI LAVORARE."
    : "QUI È GIÀ FACILE.";

  const verdictPunch = strongVerdict
    ? "FALLO VEDERE."
    : "RENDILO PIÙ CHIARO.";

  const fixes = check.actions.map((action, index) => {
    const labels = ["PROVE", "PRESENZA", "CONTATTO"];
    return `
      <article class="fix-card">
        <div class="fix-num">0${index + 1}</div>
        <div class="fix-label">${labels[index] ?? "AZIONE"}</div>
        <h3>${esc(action.title)}</h3>
        <p>${esc(action.body)}</p>
      </article>
    `;
  }).join("");

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="color-scheme" content="light only">
  <meta name="theme-color" content="#0b0b0b">
  <title>${esc(check.business.name)} · Trovatemi</title>
  <style>
    :root{
      --ink:#0b0b0b;
      --paper:#f5f3ed;
      --white:#ffffff;
      --yellow:#f5b900;
      --yellow2:#ffd21a;
      --muted:#b7b7b7;
      --line:#2a2a2a;
      --soft:#e8e4d9;
    }
    *{box-sizing:border-box}
    html{
      background:var(--ink);
      color:var(--white);
      font-family:Arial,Helvetica,sans-serif;
      -webkit-text-size-adjust:100%;
      scroll-snap-type:y proximity;
      scroll-behavior:smooth;
    }
    body{margin:0;background:var(--ink)}
    a{-webkit-tap-highlight-color:transparent}
    .brand{
      position:sticky;top:0;z-index:50;
      display:flex;align-items:center;justify-content:space-between;
      min-height:56px;
      padding:0 max(18px,env(safe-area-inset-left)) 0 max(18px,env(safe-area-inset-right));
      background:rgba(11,11,11,.96);
      border-bottom:1px solid #252525;
      color:#fff;
      backdrop-filter:blur(8px);
    }
    .brand strong{font-size:.78rem;letter-spacing:.045em}
    .brand strong i{font-style:normal;color:var(--yellow)}
    .brand span{font-size:.58rem;letter-spacing:.12em;color:#8f8f8f;font-weight:800}
    .story{
      position:relative;
      min-height:calc(100svh - 56px);
      display:flex;align-items:center;
      padding:clamp(40px,8vw,86px) 0;
      overflow:hidden;
      scroll-snap-align:start;
      border-bottom:1px solid #202020;
    }
    .story.light{background:var(--paper);color:var(--ink);border-color:#d8d3c7}
    .story.yellow{background:var(--yellow);color:var(--ink);border-color:#cf9d00}
    .inner{position:relative;width:min(1000px,calc(100% - 36px));margin:0 auto}
    .step{
      display:inline-flex;align-items:center;gap:8px;
      margin:0 0 20px;
      font-size:.62rem;font-weight:900;letter-spacing:.14em;
      text-transform:uppercase;color:#8c8c8c;
    }
    .step b{color:var(--yellow)}
    .light .step,.yellow .step{color:#706d65}
    .light .step b,.yellow .step b{color:var(--ink)}
    .kicker{
      margin:0 0 16px;
      font-size:.72rem;font-weight:900;letter-spacing:.12em;
      text-transform:uppercase;color:var(--yellow);
    }
    .light .kicker{color:#8b6900}.yellow .kicker{color:var(--ink)}
    h1,h2,h3,.display{
      font-family:Impact,Haettenschweiler,"Arial Narrow Bold","Arial Black",Arial,sans-serif;
      font-weight:900;text-transform:uppercase;
      letter-spacing:-.025em;
    }
    .mega{
      margin:0;
      max-width:11ch;
      font-size:clamp(4rem,12vw,10rem);
      line-height:.82;
    }
    .mega .yellow-text{color:var(--yellow)}
    .query-chip{
      display:inline-flex;align-items:center;gap:12px;
      margin-top:30px;
      padding:13px 18px;
      border:2px solid #3a3a3a;border-radius:999px;
      color:#fff;background:#161616;
      font-weight:800;
      max-width:100%;
    }
    .query-chip span{font-size:1.35rem;color:var(--yellow)}
    .query-chip b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .subline{
      max-width:680px;margin:24px 0 0;
      font-size:clamp(1rem,2.4vw,1.22rem);
      line-height:1.5;color:#bdbdbd;
    }
    .light .subline{color:#5c5a55}.yellow .subline{color:#3e3300}
    .swipe{
      margin-top:32px;font-size:.58rem;font-weight:900;
      letter-spacing:.1em;color:#777;
    }
    .rating-layout{
      display:grid;grid-template-columns:1.08fr .92fr;gap:30px;align-items:center;
    }
    .rating-big{
      font-family:Impact,Haettenschweiler,"Arial Black",sans-serif;
      font-size:clamp(6.2rem,20vw,15rem);
      line-height:.74;color:var(--ink);letter-spacing:-.05em;
    }
    .rating-star{font-size:.46em;vertical-align:top;color:#8c6600}
    .review-count{
      margin-top:14px;font-size:clamp(1.5rem,4vw,2.8rem);
      font-weight:900;text-transform:uppercase;
    }
    .rating-note{
      border-left:8px solid var(--ink);padding-left:20px;
    }
    .rating-note h2{
      margin:0;font-size:clamp(2.5rem,7vw,5.4rem);line-height:.9;
    }
    .rating-note p{max-width:500px;margin:16px 0 0;font-size:1.04rem;line-height:1.55}
    .compare-title{
      margin:0;max-width:12ch;
      font-size:clamp(3.6rem,10vw,8rem);line-height:.85;
    }
    .compare-title em{font-style:normal;color:var(--yellow)}
    .compare-grid{display:grid;grid-template-columns:1fr;gap:18px;margin-top:36px;max-width:820px}
    .bar-card{display:grid;grid-template-columns:100px 1fr 82px;align-items:center;gap:14px}
    .bar-card strong{font-size:.78rem;letter-spacing:.08em}
    .bar-track{height:22px;background:#272727;border-radius:2px;overflow:hidden}
    .bar-fill{height:100%;background:var(--yellow)}
    .bar-card.peer .bar-fill{background:#fff}
    .bar-card b{font-family:Impact,"Arial Black",sans-serif;font-size:2rem;text-align:right}
    .compare-note{
      max-width:720px;margin:24px 0 0;padding-top:18px;border-top:1px solid #343434;
      color:#c3c3c3;line-height:1.5;font-size:.96rem;
    }
    .contact-head{
      margin:0;max-width:11ch;
      font-size:clamp(3.4rem,9.5vw,7.6rem);line-height:.86;
    }
    .contact-head em{font-style:normal;color:#8a6700}
    .signals{margin-top:32px;display:grid;gap:10px;max-width:720px}
    .signal-row{
      display:flex;align-items:center;justify-content:space-between;
      min-height:64px;padding:0 18px;
      border:2px solid var(--ink);background:#fff;
      font-weight:900;text-transform:uppercase;
    }
    .signal-label{font-size:clamp(1rem,3vw,1.35rem)}
    .signal-state{
      display:grid;place-items:center;width:36px;height:36px;border-radius:50%;
      font-size:1.2rem;background:var(--ink);color:var(--yellow)
    }
    .signal-state.no{background:#d7d2c5;color:#777}
    .contact-punch{
      display:inline-block;margin-top:26px;
      padding:11px 14px;background:var(--ink);color:var(--yellow);
      font-family:Impact,"Arial Black",sans-serif;
      font-size:clamp(2.1rem,6vw,4.2rem);line-height:1;
      text-transform:uppercase;
    }
    .decision-title{
      margin:0;max-width:12ch;
      font-size:clamp(3.5rem,9vw,7.2rem);line-height:.86;
    }
    .decision-title em{font-style:normal;color:#9b7200}
    .decision-grid{
      margin-top:34px;display:grid;grid-template-columns:1fr 1fr;gap:18px;
    }
    .decision-card{padding:24px;border:2px solid var(--ink);min-height:260px}
    .decision-card.good{background:var(--ink);color:#fff;box-shadow:10px 10px 0 var(--yellow)}
    .decision-card.bad{background:#fff;color:#777;border-color:#b8b3a8}
    .decision-card small{font-weight:900;letter-spacing:.1em}
    .decision-card h3{margin:14px 0 20px;font-size:clamp(2rem,5vw,3.6rem);line-height:.95}
    .decision-card ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
    .decision-card li{display:flex;gap:9px;font-weight:800;line-height:1.3}
    .decision-card.good li::before{content:"★";color:var(--yellow)}
    .decision-card.bad li::before{content:"×";color:#aaa}
    .decision-bottom{margin-top:28px;font-size:1rem;line-height:1.55;font-weight:800;max-width:760px}
    .verdict-wrap{max-width:950px}
    .verdict-main{
      margin:0;
      font-size:clamp(4.6rem,13vw,11rem);
      line-height:.79;
    }
    .verdict-main .accent{color:var(--yellow)}
    .verdict-sub{
      margin:28px 0 0;max-width:660px;
      color:#bdbdbd;font-size:clamp(1rem,2.4vw,1.25rem);line-height:1.55
    }
    .fixes-title{
      margin:0;max-width:12ch;
      font-size:clamp(3.4rem,9vw,7.2rem);line-height:.86;
    }
    .fixes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:32px}
    .fix-card{background:var(--ink);color:#fff;padding:22px;min-height:310px;position:relative}
    .fix-num{font-family:Impact,"Arial Black",sans-serif;font-size:4rem;line-height:1;color:#3b3b3b}
    .fix-label{display:inline-block;margin:12px 0 14px;padding:5px 8px;background:var(--yellow);color:var(--ink);font-size:.64rem;font-weight:900;letter-spacing:.09em}
    .fix-card h3{margin:0;font-size:clamp(1.8rem,4vw,3rem);line-height:.94}
    .fix-card p{margin:16px 0 0;color:#c4c4c4;line-height:1.48}
    .final-grid{display:grid;grid-template-columns:1fr .7fr;gap:30px;align-items:end}
    .final-title{margin:0;font-size:clamp(4.3rem,12vw,10rem);line-height:.8}
    .price-block{border-left:6px solid var(--yellow);padding-left:18px}
    .price-label{font-size:.68rem;font-weight:900;letter-spacing:.1em;color:#8c8c8c;text-transform:uppercase}
    .price{display:block;margin:4px 0 0;font-family:Impact,"Arial Black",sans-serif;font-size:clamp(4.8rem,13vw,9rem);line-height:.9;color:#fff}
    .once{font-size:.72rem;font-weight:900;letter-spacing:.12em;color:var(--yellow)}
    .final-copy{max-width:620px;margin:24px 0 0;color:#bcbcbc;line-height:1.55}
    .cta{
      display:flex;align-items:center;justify-content:space-between;
      width:100%;min-height:66px;margin-top:28px;padding:0 20px;
      background:var(--yellow);color:var(--ink);
      text-decoration:none;text-transform:uppercase;font-weight:950;
      border:2px solid var(--yellow);
      box-shadow:0 0 0 1px #000;
    }
    .cta strong{font-size:1.05rem;letter-spacing:.04em}.cta span{font-size:1.5rem}
    .fine{display:block;margin-top:12px;color:#777;font-size:.64rem;line-height:1.45}
    footer{
      background:#080808;color:#777;
      padding:24px max(18px,calc((100% - 1000px)/2));
      font-size:.62rem;line-height:1.5;border-top:1px solid #1f1f1f
    }
    footer span{display:block}
    @media(max-width:760px){
      .brand span{display:none}
      .story{min-height:calc(100svh - 56px);padding:48px 0}
      .mega{font-size:clamp(4rem,19vw,7.2rem)}
      .rating-layout,.final-grid{grid-template-columns:1fr;gap:28px}
      .rating-big{font-size:clamp(7rem,33vw,12rem)}
      .decision-grid,.fixes-grid{grid-template-columns:1fr}
      .decision-card{min-height:auto}
      .fix-card{min-height:0}
      .bar-card{grid-template-columns:72px 1fr 58px;gap:10px}
      .bar-card b{font-size:1.5rem}
      .compare-title,.contact-head,.decision-title,.fixes-title{font-size:clamp(3.5rem,16vw,6rem)}
      .verdict-main{font-size:clamp(4rem,18vw,7rem)}
      .final-title{font-size:clamp(4.2rem,19vw,7rem)}
    }
    @media(max-width:390px){
      .inner{width:min(100% - 26px,1000px)}
      .query-chip{width:100%}
      .signal-row{min-height:56px}
      .decision-card{padding:18px}
      .fix-card{padding:18px}
    }
  </style>
</head>
<body data-trovatemi-check="${esc(check.token)}">
  <header class="brand">
    <strong>TROVATEMI.IT <i>★</i></strong>
    <span>CHECK PRIVATO · FATTO SUI TUOI SEGNALI PUBBLICI</span>
  </header>

  <main>
    <section class="story">
      <div class="inner">
        <div class="step"><b>01</b> · TI HO CERCATO</div>
        <p class="kicker">COME FAREBBE UN CLIENTE</p>
        <h1 class="mega">${esc(check.searchCategory)}<br><span class="yellow-text">${esc(check.business.city)}.</span></h1>
        <div class="query-chip"><span>⌕</span><b>${esc(check.query)}</b></div>
        <p class="subline">Non è un audit SEO. È una fotografia di quello che una persona può vedere prima di scegliere.</p>
        <p class="swipe">SCORRI ↓ · 30 SECONDI</p>
      </div>
    </section>

    <section class="story yellow">
      <div class="inner rating-layout">
        <div>
          <div class="step"><b>02</b> · PRIMA IMPRESSIONE</div>
          <div class="rating-big">${esc(formatRating(check.business.rating))}<span class="rating-star">★</span></div>
          <div class="review-count">${esc(formatNumber(check.business.reviews))} recensioni</div>
        </div>
        <div class="rating-note">
          <h2>IL PROBLEMA NON SEMBRA ESSERE COME LAVORI.</h2>
          <p>${check.business.rating !== null && check.business.rating >= 4.4
            ? "Chi ti ha già scelto sembra apprezzarti. Questo è un buon segnale."
            : "Ci sono segnali utili, ma un cliente nuovo deve ancora capire velocemente perché scegliere te."}</p>
        </div>
      </div>
    </section>

    <section class="story">
      <div class="inner">
        <div class="step"><b>03</b> · POI CONFRONTO</div>
        <h2 class="compare-title">IL CLIENTE NON SA QUANTO SEI <em>BRAVO.</em></h2>
        <div class="compare-grid">
          <div class="bar-card">
            <strong>TU</strong>
            <div class="bar-track"><div class="bar-fill" style="width:${mineWidth}%"></div></div>
            <b>${esc(formatNumber(reviews))}</b>
          </div>
          <div class="bar-card peer">
            <strong>QUI</strong>
            <div class="bar-track"><div class="bar-fill" style="width:${medianWidth}%"></div></div>
            <b>~${esc(formatNumber(medianReviews))}</b>
          </div>
        </div>
        <p class="compare-note">${esc(comparisonCaption)}</p>
      </div>
    </section>

    <section class="story light">
      <div class="inner">
        <div class="step"><b>04</b> · ADESSO VOGLIO MUOVERMI</div>
        <h2 class="contact-head">POI PROVO A <em>CONTATTARTI.</em></h2>
        <div class="signals">
          ${signalRow("Telefono", check.signals.phonePresent)}
          ${signalRow("Sito", check.signals.websitePresent)}
          ${signalRow("Contatto diretto", check.signals.directActionPresent)}
        </div>
        <div class="contact-punch">${esc(contactPunch)}</div>
      </div>
    </section>

    <section class="story light">
      <div class="inner">
        <div class="step"><b>05</b> · COME DECIDE UNA PERSONA</div>
        <h2 class="decision-title">IL CLIENTE NON LEGGE IL TUO <em>CURRICULUM.</em></h2>
        <div class="decision-grid">
          <article class="decision-card good">
            <small>QUELLO CHE SEMBRA</small>
            <h3>UNA SCELTA FACILE.</h3>
            <ul>
              <li>Prove visibili</li>
              <li>Presenza chiara</li>
              <li>Prossimo passo ovvio</li>
            </ul>
          </article>
          <article class="decision-card bad">
            <small>QUELLO CHE RICHIEDE</small>
            <h3>PIÙ FIDUCIA.</h3>
            <ul>
              <li>Prove da cercare</li>
              <li>Presenza da interpretare</li>
              <li>Contatto da capire</li>
            </ul>
          </article>
        </div>
        <p class="decision-bottom">Non sto dicendo chi lavora meglio. Sto dicendo chi è più facile da capire prima della telefonata.</p>
      </div>
    </section>

    <section class="story">
      <div class="inner verdict-wrap">
        <div class="step"><b>06</b> · IL VERDETTO</div>
        <h2 class="verdict-main">${esc(check.verdict.title)}<br><span class="accent">${esc(verdictPunch)}</span></h2>
        <p class="verdict-sub">${esc(check.verdict.body)}</p>
      </div>
    </section>

    <section class="story yellow">
      <div class="inner">
        <div class="step"><b>07</b> · COSA SISTEMEREI</div>
        <h2 class="fixes-title">TRE COSE.<br>NON TRENTA.</h2>
        <div class="fixes-grid">${fixes}</div>
      </div>
    </section>

    <section class="story">
      <div class="inner final-grid">
        <div>
          <div class="step"><b>08</b> · SE VUOI CHE LO SISTEMI</div>
          <h2 class="final-title">ACCENDI<br><span style="color:var(--yellow)">TROVATEMI.</span></h2>
          <p class="final-copy">Colleghiamo la tua attività, mettiamo in funzione il sistema iniziale e ti accompagniamo nei passaggi che richiedono il tuo consenso.</p>
          <a class="cta" href="${esc(check.cta.href)}"><strong>${esc(check.cta.label)}</strong><span>→</span></a>
          <small class="fine">${esc(check.offer.note)}</small>
        </div>
        <div class="price-block">
          <div class="price-label">${esc(check.offer.label)}</div>
          <span class="price">€${esc(check.offer.priceEur)}</span>
          <span class="once">UNA TANTUM</span>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <span>Check generato da segnali pubblici · valido fino al ${esc(expiry)}</span>
    <span>${esc(check.claimRule)}</span>
  </footer>
</body>
</html>`;
}
