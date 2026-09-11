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
    Math.max(12, Math.round((a / max) * 100)),
    Math.max(12, Math.round((b / max) * 100)),
  ];
}

function signalRow(label: string, present: boolean, detail: string): string {
  return '<div class="signal-row">' +
    '<div><strong>' + esc(label) + '</strong><small>' + esc(detail) + '</small></div>' +
    '<span class="signal-state ' + (present ? 'yes' : 'no') + '">' + (present ? '✓' : '—') + '</span>' +
  '</div>';
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
  const widths = comparisonWidths(reviews, medianReviews);
  const mineWidth = widths[0];
  const medianWidth = widths[1];
  const comparisonAvailable = reviews !== null && medianReviews !== null;
  const reviewGap = comparisonAvailable && reviews < medianReviews;
  const strongVerdict = check.verdict.title.toUpperCase().includes("SEI MEGLIO DI COME APPARI");
  const needsContactWork = !check.signals.websitePresent || !check.signals.directActionPresent;

  const comparisonCopy = comparisonAvailable
    ? reviewGap
      ? "Le recensioni non dicono chi lavora meglio. Però sono una delle prove che un cliente vede prima di scegliere."
      : "Sulle recensioni sei già in linea o sopra la mediana osservata. Qui il lavoro è far pesare meglio la prova che hai già."
    : "Non invento numeri che non ho: qui mostro solo i segnali osservati.";

  const verdictPunch = strongVerdict ? "FALLO VEDERE." : "RENDILO PIÙ CHIARO.";
  const directActionLabel = /officina|gomm|carroz|serrament|infiss/i.test(check.searchCategory)
    ? "Chiedi preventivo"
    : "Contattami";

  const labels = ["PROVE", "PRESENZA", "CONTATTO"];
  const fixes = check.actions.map((action, index) =>
    '<article class="module-card">' +
      '<span class="module-index">0' + (index + 1) + '</span>' +
      '<small>' + esc(labels[index] ?? "AZIONE") + '</small>' +
      '<h3>' + esc(action.title) + '</h3>' +
      '<p>' + esc(action.body) + '</p>' +
    '</article>'
  ).join("");

  const mapsLink = check.business.googleMapsUri
    ? '<a class="maps-link" href="' + esc(check.business.googleMapsUri) + '" rel="noreferrer">Apri la scheda osservata ↗</a>'
    : "";

  const css = [
    ':root{--ink:#111214;--paper:#fff;--soft:#f6f7f8;--line:#dadce0;--muted:#687078;--blue:#1a73e8;--yellow:#f6bd16;--green:#188038}',
    '*{box-sizing:border-box}html{background:#fff;color:var(--ink);font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;scroll-behavior:smooth}body{margin:0;background:#fff}a{-webkit-tap-highlight-color:transparent}',
    '.brand{position:sticky;top:0;z-index:60;min-height:58px;padding:0 max(18px,env(safe-area-inset-left));display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(8px)}',
    '.brand strong{font-size:.8rem;letter-spacing:.035em}.brand i{font-style:normal;color:#e9a900}.brand span{font-size:.58rem;font-weight:800;letter-spacing:.1em;color:#8a8f94}',
    '.section{position:relative;min-height:calc(100svh - 58px);display:flex;align-items:center;padding:56px 0;border-bottom:1px solid var(--line);overflow:hidden}.section.dark{background:var(--ink);color:#fff;border-color:#252629}.section.yellow{background:var(--yellow);color:var(--ink);border-color:#dba700}',
    '.inner{width:min(1040px,calc(100% - 34px));margin:0 auto}.eyebrow{margin:0 0 18px;font-size:.62rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#7e848a}.eyebrow b{color:var(--blue)}.dark .eyebrow{color:#8a8d91}.dark .eyebrow b{color:var(--yellow)}.yellow .eyebrow{color:#5a4600}.yellow .eyebrow b{color:var(--ink)}',
    'h1,h2,h3{margin:0}.title{max-width:13ch;font-size:clamp(3.1rem,8.5vw,6.8rem);line-height:.9;letter-spacing:-.055em}.yellow-word{color:#dca600}.dark .yellow-word{color:var(--yellow)}.lead{max-width:720px;margin:22px 0 0;font-size:clamp(1rem,2.2vw,1.18rem);line-height:1.58;color:var(--muted)}.dark .lead{color:#b9bdc1}',
    '.search-shell{margin-top:30px;border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 18px 50px rgba(60,64,67,.12)}.search-top{padding:18px;border-bottom:1px solid var(--line)}.search-box{display:flex;align-items:center;gap:12px;min-height:50px;padding:0 17px;border:1px solid #dfe1e5;border-radius:28px;box-shadow:0 1px 6px rgba(32,33,36,.12);color:#202124}.search-box span{font-size:1.35rem;color:#5f6368}.search-box b{font-size:.98rem}',
    '.results-label{padding:14px 18px 4px;color:#70757a;font-size:.68rem;font-weight:700}.result-row{display:grid;grid-template-columns:54px 1fr auto;gap:14px;align-items:center;padding:16px 18px;border-top:1px solid #eef0f2}.result-row.you{background:#fff9df;border-left:5px solid var(--yellow)}.result-icon{width:48px;height:48px;border-radius:12px;background:#eef1f4;display:grid;place-items:center;font-weight:900;color:#5f6368}.result-row.you .result-icon{background:var(--yellow);color:var(--ink)}',
    '.result-copy b{display:block;font-size:1rem;color:#202124}.result-copy span{display:block;margin-top:5px;color:#70757a;font-size:.78rem}.result-meta{text-align:right}.result-meta strong{display:block;font-size:.95rem;color:#202124}.result-meta small{display:block;margin-top:4px;color:#70757a;font-size:.67rem}.skeleton{height:9px;border-radius:99px;background:#e9ecef;margin:5px 0}.skeleton.w1{width:76%}.skeleton.w2{width:48%}',
    '.evidence-note{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:12px 18px;border-top:1px solid var(--line);background:#fafafa;color:#6d7277;font-size:.66rem;line-height:1.35}.maps-link{color:var(--blue);text-decoration:none;font-weight:700;white-space:nowrap}',
    '.compare-layout{display:grid;grid-template-columns:.88fr 1.12fr;gap:32px;align-items:center}.metric-card{padding:24px;border:1px solid var(--line);border-radius:18px;background:#fff}.metric-card.you{box-shadow:0 14px 35px rgba(60,64,67,.1)}.metric-card small{display:block;color:#70757a;font-size:.68rem;font-weight:800;letter-spacing:.08em}.metric-big{margin-top:10px;font-size:clamp(4rem,10vw,7rem);line-height:.85;font-weight:800;letter-spacing:-.06em}.metric-caption{margin-top:10px;color:#5f6368;font-weight:700}',
    '.bar-list{display:grid;gap:18px;margin-top:26px}.bar-row{display:grid;grid-template-columns:88px 1fr 64px;gap:12px;align-items:center}.bar-row b{font-size:.75rem}.bar-row strong{text-align:right;font-size:1.2rem}.track{height:16px;border-radius:99px;background:#edf0f2;overflow:hidden}.fill{height:100%;background:#202124;border-radius:99px}.fill.you{background:var(--yellow)}.compare-copy{max-width:700px;margin:24px 0 0;color:#5f6368;line-height:1.55}',
    '.journey-card{margin-top:28px;border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}.signal-row{min-height:72px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #eceff1}.signal-row:first-child{border-top:0}.signal-row strong{display:block}.signal-row small{display:block;margin-top:4px;color:#7b8085}.signal-state{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#e7f4ea;color:var(--green);font-weight:900}.signal-state.no{background:#f1f3f4;color:#8a8f94}.journey-verdict{margin-top:20px;display:inline-block;padding:10px 13px;border-radius:9px;font-weight:900}',
    '.verdict-title{max-width:12ch;font-size:clamp(4.1rem,12vw,9.3rem);line-height:.82;letter-spacing:-.065em}.verdict-title span{color:var(--yellow)}',
    '.mockup-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:34px;align-items:center}.mockup-label{display:inline-block;margin-bottom:16px;padding:6px 9px;border:1px solid #3b3c40;color:#a8abb0;font-size:.56rem;font-weight:900;letter-spacing:.12em}.mockup-copy h2{max-width:12ch;font-size:clamp(3.4rem,8vw,6.3rem);line-height:.9;letter-spacing:-.055em}.mockup-copy p{max-width:620px;margin:20px 0 0;color:#b9bdc1;line-height:1.58}.mockup-disclaimer{margin-top:12px;color:#7f8388;font-size:.62rem;line-height:1.45}',
    '.phone{width:min(330px,88vw);margin:0 auto;padding:12px;border-radius:34px;background:#050505;box-shadow:0 28px 70px rgba(0,0,0,.35)}.phone-screen{background:#fff;color:#202124;border-radius:25px;overflow:hidden}.phone-status{height:28px;background:#f8f9fa}.phone-hero{padding:20px 18px;background:linear-gradient(140deg,#f5f6f7,#e8eaed)}.phone-hero small{color:#70757a;font-weight:700}.phone-hero h3{margin:6px 0 5px;font-size:1.2rem}.phone-rating{font-weight:900}.phone-rating i{font-style:normal;color:#e4a900}.phone-proof{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:13px 14px;border-bottom:1px solid #eceff1}.phone-proof div{padding:9px 6px;border-radius:9px;background:#f7f8f9;text-align:center;font-size:.63rem;font-weight:800}.phone-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:14px}.phone-actions span{padding:12px 8px;border-radius:20px;text-align:center;background:#eef3fd;color:#185abc;font-size:.69rem;font-weight:900}.phone-actions span.primary{background:#202124;color:#fff}.phone-copy{padding:0 14px 18px;color:#5f6368;font-size:.72rem;line-height:1.45}',
    '.kit-stage{display:grid;grid-template-columns:1fr .68fr;gap:18px;align-items:end;padding:32px;border-radius:24px;background:linear-gradient(145deg,#232323,#101010);box-shadow:inset 0 0 0 1px #343434}.desk-card{min-height:330px;padding:28px 22px;background:#0d0d0d;border:1px solid #555;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transform:perspective(700px) rotateY(-5deg);box-shadow:15px 20px 35px rgba(0,0,0,.35)}.desk-card h3{font-size:2rem;color:#fff;line-height:.95}.desk-card h3 span{color:var(--yellow)}.qr{width:128px;height:128px;margin:24px 0;background:repeating-conic-gradient(#111 0 25%,#fff 0 50%) 0/24px 24px;border:10px solid #fff;box-shadow:0 0 0 1px #555}.desk-card small{color:#ccc}.desk-card strong{margin-top:14px;color:#fff;letter-spacing:.04em}.nfc-disc{aspect-ratio:1;border-radius:50%;background:#0c0c0c;border:1px solid #555;display:grid;place-items:center;text-align:center;padding:18px;box-shadow:0 20px 30px rgba(0,0,0,.3)}.nfc-disc span{font-size:2.4rem;color:var(--yellow)}.nfc-disc b{display:block;margin-top:8px;color:#fff;font-size:.78rem}.nfc-disc small{display:block;margin-top:5px;color:#aaa;font-size:.6rem}',
    '.module-title{max-width:12ch;font-size:clamp(3.2rem,8vw,6.2rem);line-height:.9;letter-spacing:-.05em}.modules{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}.module-card{padding:22px;border:2px solid var(--ink);background:#fff;min-height:270px}.module-index{display:block;font-size:2.8rem;font-weight:900;color:#d7ae24}.module-card small{display:inline-block;margin-top:10px;padding:5px 8px;background:var(--ink);color:var(--yellow);font-weight:900;letter-spacing:.1em}.module-card h3{margin-top:15px;font-size:1.55rem;line-height:1.02}.module-card p{margin:14px 0 0;color:#5d6165;line-height:1.48}',
    '.final-layout{display:grid;grid-template-columns:1fr .62fr;gap:34px;align-items:end}.final-title{max-width:10ch;font-size:clamp(4rem,11vw,8.5rem);line-height:.82;letter-spacing:-.06em}.final-copy{max-width:620px;margin:22px 0 0;color:#b7bbc0;line-height:1.55}.price-panel{border-left:6px solid var(--yellow);padding-left:20px}.price-panel small{font-weight:900;letter-spacing:.1em;color:#8a8d91}.price{display:block;margin:4px 0;font-size:clamp(4.4rem,10vw,7.5rem);font-weight:900;letter-spacing:-.06em}.once{font-size:.7rem;font-weight:900;letter-spacing:.13em;color:var(--yellow)}.cta{display:flex;align-items:center;justify-content:space-between;min-height:64px;margin-top:26px;padding:0 20px;background:var(--yellow);color:var(--ink);text-decoration:none;font-weight:950}.cta span{font-size:1.45rem}.fine{display:block;margin-top:12px;color:#777;font-size:.63rem;line-height:1.45}',
    'footer{padding:24px max(18px,calc((100% - 1040px)/2));background:#0a0a0a;color:#777;font-size:.62rem;line-height:1.5}footer span{display:block}',
    '@media(max-width:780px){.brand span{display:none}.section{padding:44px 0;min-height:auto}.section:first-of-type{min-height:calc(100svh - 58px)}.compare-layout,.mockup-grid,.final-layout{grid-template-columns:1fr}.modules{grid-template-columns:1fr}.module-card{min-height:0}.result-row{grid-template-columns:48px 1fr}.result-meta{grid-column:2;text-align:left}.result-row:not(.you) .result-meta{display:none}.evidence-note{align-items:flex-start;flex-direction:column}.kit-stage{padding:20px;grid-template-columns:1fr .58fr}.desk-card{min-height:280px;padding:20px 14px}.qr{width:105px;height:105px}}',
    '@media(max-width:430px){.inner{width:calc(100% - 26px)}.title{font-size:clamp(3rem,14vw,5.2rem)}.bar-row{grid-template-columns:64px 1fr 48px}.bar-row strong{font-size:1rem}.kit-stage{grid-template-columns:1fr}.nfc-disc{width:150px;margin:0 auto}.phone{width:100%}}'
  ].join("");

  const html = [
    '<!doctype html><html lang="it"><head>',
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    '<meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#ffffff">',
    '<title>' + esc(check.business.name) + ' · Trovatemi</title><style>' + css + '</style></head>',
    '<body data-trovatemi-check="' + esc(check.token) + '">',
    '<header class="brand"><strong>TROVATEMI.IT <i>★</i></strong><span>CHECK PRIVATO · SEGNALI PUBBLICI OSSERVATI</span></header><main>',

    '<section class="section"><div class="inner">',
    '<p class="eyebrow"><b>01</b> · TI HO CERCATO COME TI CERCHEREBBE UN CLIENTE</p>',
    '<h1 class="title">HO CERCATO<br><span class="yellow-word">' + esc(check.query.toUpperCase()) + '</span></h1>',
    '<p class="lead">Prima di parlare di marketing, guardiamo semplicemente cosa incontra una persona quando ti cerca.</p>',
    '<div class="search-shell"><div class="search-top"><div class="search-box"><span>⌕</span><b>' + esc(check.query) + '</b></div></div>',
    '<div class="results-label">Risultati osservati · ricostruzione visiva</div>',
    '<div class="result-row"><div class="result-icon">•</div><div class="result-copy"><div class="skeleton w1"></div><div class="skeleton w2"></div></div><div class="result-meta"><small>altro risultato</small></div></div>',
    '<div class="result-row you"><div class="result-icon">★</div><div class="result-copy"><b>' + esc(check.business.name) + '</b><span>' + esc(formatRating(check.business.rating)) + ' ★ · ' + esc(formatNumber(check.business.reviews)) + ' recensioni</span></div><div class="result-meta"><strong>#' + esc(check.business.positionSignal) + '</strong><small>nella ricerca osservata*</small></div></div>',
    '<div class="result-row"><div class="result-icon">•</div><div class="result-copy"><div class="skeleton w1"></div><div class="skeleton w2"></div></div><div class="result-meta"><small>altro risultato</small></div></div>',
    '<div class="evidence-note"><span>*Segnale della specifica ricerca osservata. Non è un ranking Google assoluto.</span>' + mapsLink + '</div></div></div></section>',

    '<section class="section"><div class="inner compare-layout"><div><p class="eyebrow"><b>02</b> · POI CONFRONTO</p>',
    '<h2 class="title">TU NON VIENI LETTO.<br><span class="yellow-word">VIENI CONFRONTATO.</span></h2><p class="lead">' + esc(comparisonCopy) + '</p></div>',
    '<div><div class="metric-card you"><small>LA TUA ATTIVITÀ</small><div class="metric-big">' + esc(formatNumber(reviews)) + '</div><div class="metric-caption">recensioni osservate</div></div>',
    '<div class="bar-list"><div class="bar-row"><b>TU</b><div class="track"><div class="fill you" style="width:' + mineWidth + '%"></div></div><strong>' + esc(formatNumber(reviews)) + '</strong></div>',
    '<div class="bar-row"><b>MEDIANA</b><div class="track"><div class="fill" style="width:' + medianWidth + '%"></div></div><strong>~' + esc(formatNumber(medianReviews)) + '</strong></div></div></div></div></section>',

    '<section class="section"><div class="inner"><p class="eyebrow"><b>03</b> · POI PROVO A MUOVERMI</p>',
    '<h2 class="title">VOGLIO SOLO CAPIRE<br><span class="yellow-word">COME CONTATTARTI.</span></h2>',
    '<p class="lead">Quando una persona ha già deciso di approfondire, ogni passaggio in più è lavoro che le stai chiedendo.</p>',
    '<div class="journey-card">' +
      signalRow("Telefono", check.signals.phonePresent, "Numero pubblico osservato") +
      signalRow("Sito", check.signals.websitePresent, check.signals.websitePresent ? "Sito pubblico collegato" : "Non osservato") +
      signalRow("Contatto diretto", check.signals.directActionPresent, check.signals.directActionPresent ? "WhatsApp o percorso diretto osservato" : "Non osservato sulla homepage") +
    '</div><div class="journey-verdict" style="background:' + (needsContactWork ? '#fff1b8;color:#624b00' : '#e7f4ea;color:#166534') + '">' +
      (needsContactWork ? "Qui il percorso può essere più semplice." : "Qui il percorso è già abbastanza diretto.") +
    '</div></div></section>',

    '<section class="section dark"><div class="inner"><p class="eyebrow"><b>04</b> · QUELLO CHE VEDO</p>',
    '<h2 class="verdict-title">' + esc(check.verdict.title) + '<br><span>' + esc(verdictPunch) + '</span></h2><p class="lead">' + esc(check.verdict.body) + '</p></div></section>',

    '<section class="section dark"><div class="inner mockup-grid"><div class="phone"><div class="phone-screen"><div class="phone-status"></div>',
    '<div class="phone-hero"><small>' + esc(check.business.city) + ' · ' + esc(check.searchCategory) + '</small><h3>' + esc(check.business.name) + '</h3><div class="phone-rating">' + esc(formatRating(check.business.rating)) + ' <i>★</i> · prove visibili</div></div>',
    '<div class="phone-proof"><div>Recensioni</div><div>Foto lavori</div><div>Servizi</div></div><div class="phone-actions"><span class="primary">Chiama</span><span>' + esc(directActionLabel) + '</span></div><div class="phone-copy">Un percorso più chiaro: prove, presenza e prossimo passo nello stesso posto.</div></div></div>',
    '<div class="mockup-copy"><span class="mockup-label">ESEMPIO ILLUSTRATIVO · NON È LA TUA SCHEDA ATTUALE</span><h2>COME POTREBBE<br><span class="yellow-word">APPARIRE IL PERCORSO.</span></h2>',
    '<p>Non rifarei tutto. Renderei più evidente ciò che aiuta una persona a fidarsi e a muoversi: prove, servizi e contatto.</p><div class="mockup-disclaimer">Il mockup visualizza la direzione proposta. Non rappresenta una futura posizione, quantità di recensioni o risultato garantito.</div></div></div></section>',

    '<section class="section dark"><div class="inner mockup-grid"><div class="kit-stage"><div class="desk-card"><h3>TI È PIACIUTO?<br><span>FALLO VEDERE.</span></h3><div class="qr" aria-hidden="true"></div><small>SCANSIONA · LASCIA UNA RECENSIONE</small><strong>TROVATEMI.IT ★</strong></div>',
    '<div class="nfc-disc"><div><span>★</span><b>IL TUO PARERE CONTA</b><small>TAP / QR · MOCKUP</small></div></div></div>',
    '<div class="mockup-copy"><span class="mockup-label">ESEMPIO ILLUSTRATIVO · KIT FISICO</span><h2>IL CLIENTE È GIÀ SODDISFATTO.<br><span class="yellow-word">FACCIAMOLO VEDERE.</span></h2><p>QR, NFC e messaggi di richiesta trasformano un momento reale — la fine del lavoro — in una prova pubblica facile da lasciare.</p><div class="mockup-disclaimer">Il QR mostrato è grafico e non scansionabile. Il kit definitivo viene generato per l’attività attivata.</div></div></div></section>',

    '<section class="section yellow"><div class="inner"><p class="eyebrow"><b>07</b> · COSA ACCENDIAMO</p><h2 class="module-title">TRE MODULI.<br>UN SOLO PERCORSO.</h2><div class="modules">' + fixes + '</div></div></section>',

    '<section class="section dark"><div class="inner final-layout"><div><p class="eyebrow"><b>08</b> · SE VUOI CHE LO SISTEMI</p><h2 class="final-title">ACCENDI<br><span class="yellow-word">TROVATEMI.</span></h2><p class="final-copy">Colleghiamo la tua attività, prepariamo il sistema iniziale e ti accompagniamo nei passaggi che richiedono il tuo consenso.</p>',
    '<a class="cta" href="' + esc(check.cta.href) + '"><strong>' + esc(check.cta.label) + '</strong><span>→</span></a><small class="fine">' + esc(check.offer.note) + '</small></div>',
    '<div class="price-panel"><small>' + esc(check.offer.label.toUpperCase()) + '</small><span class="price">€' + esc(check.offer.priceEur) + '</span><span class="once">UNA TANTUM</span></div></div></section>',

    '</main><footer><span>Check costruito da segnali pubblici osservati · valido fino al ' + esc(expiry) + '</span><span>' + esc(check.claimRule) + '</span></footer></body></html>'
  ].join("");

  return html;
}
