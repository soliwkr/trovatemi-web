import type { PublicCheck } from "./types.ts";

function esc(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toneClass(tone: PublicCheck["journey"][number]["tone"]): string {
  return tone === "good" ? " good" : tone === "watch" ? " watch" : "";
}

export function renderPublicCheck(check: PublicCheck): string {
  const expiry = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(check.expiresAt));

  const journey = check.journey.map((step, index) => \`
    <section class="screen journey\${toneClass(step.tone)}">
      <div class="inner">
        <p class="eyebrow">\${esc(step.eyebrow)}</p>
        <span class="ghost">0\${index + 1}</span>
        <h2>\${esc(step.title)}</h2>
        \${step.proof ? \`<div class="proof">\${esc(step.proof)}</div>\` : ""}
        <p class="copy">\${esc(step.body)}</p>
      </div>
    </section>
  \`).join("");

  const actions = check.actions.map((action, index) => \`
    <article class="fix">
      <span>0\${index + 1}</span>
      <div>
        <h3>\${esc(action.title)}</h3>
        <p>\${esc(action.body)}</p>
      </div>
    </article>
  \`).join("");

  return \`<!doctype html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="color-scheme" content="light only">
  <meta name="theme-color" content="#111214">
  <title>\${esc(check.business.name)} · Trovatemi</title>
  <style>
    :root{--ink:#111214;--paper:#fffdf8;--line:#e3e3e0;--muted:#666b70;--yellow:#ffd900;--blue:#1a73e8}
    *{box-sizing:border-box}html{background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%}
    body{margin:0;background:var(--paper)}a{-webkit-tap-highlight-color:transparent}
    .brand{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;min-height:62px;padding:0 max(18px,env(safe-area-inset-left)) 0 max(18px,env(safe-area-inset-right));background:var(--ink);color:#fff;font-size:.75rem;font-weight:900;letter-spacing:.06em}
    .brand b i{color:var(--yellow);font-style:normal}.brand span{font-size:.55rem;color:#bfc2c5}
    .screen{display:flex;align-items:center;min-height:calc(100svh - 62px);padding:64px 0;border-bottom:1px solid var(--line);overflow:hidden}
    .inner{position:relative;width:min(920px,calc(100% - 36px));margin:0 auto}
    .eyebrow{margin:0 0 18px;color:var(--blue);font-size:.68rem;font-weight:900;letter-spacing:.11em}
    .hero h1{max-width:13ch;margin:0;font-size:clamp(3.6rem,10vw,8rem);line-height:.87;letter-spacing:-.06em;overflow-wrap:anywhere}
    .lead,.copy,.verdict p,.final-copy{max-width:740px;color:var(--muted);font-size:clamp(1rem,2.2vw,1.2rem);line-height:1.62}
    .search{display:flex;align-items:center;gap:12px;width:min(680px,100%);margin-top:28px;padding:15px 18px;border:1px solid var(--line);border-radius:999px;background:#fff;box-shadow:0 14px 40px rgba(0,0,0,.06)}
    .search span{font-size:1.5rem;color:#5f6368}.cue{margin-top:24px;color:#9a9ca0;font-size:.6rem;font-weight:900;letter-spacing:.08em}
    .journey h2,.fixes h2,.final h2,.verdict h2{position:relative;margin:0;font-size:clamp(3.4rem,9vw,7.4rem);line-height:.88;letter-spacing:-.055em}
    .journey h2{max-width:12ch}.ghost{position:absolute;right:-2vw;top:50%;transform:translateY(-50%);font-size:clamp(9rem,28vw,24rem);font-weight:900;letter-spacing:-.09em;color:rgba(17,18,20,.04);pointer-events:none}
    .proof{position:relative;display:inline-block;margin:28px 0 8px;padding:12px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;font-size:clamp(1.05rem,3vw,1.7rem);font-weight:900}
    .good .proof{border-left:6px solid #188038}.watch .proof{border-left:6px solid var(--yellow)}
    .verdict{background:var(--ink);color:#fff}.verdict .eyebrow{color:var(--yellow)}.verdict h2{max-width:11ch}.verdict p{color:#c5c7c9}
    .fixes h2{max-width:14ch;margin-bottom:34px}.fixes-list{display:grid;gap:10px}
    .fix{display:grid;grid-template-columns:72px 1fr;gap:18px;padding:20px;border:1px solid var(--line);border-radius:15px;background:#fff}
    .fix>span{font-size:1.8rem;font-weight:900;color:#c3c5c8}.fix h3{margin:0 0 6px;font-size:1.08rem}.fix p{margin:0;color:var(--muted);line-height:1.55}
    .final{background:var(--yellow);border-bottom:0}.final .eyebrow{color:var(--ink)}.final h2{max-width:12ch}.final h2 em{font-style:normal;text-decoration:underline;text-decoration-thickness:.08em;text-underline-offset:.08em}
    .cta{display:inline-flex;align-items:center;justify-content:center;min-height:58px;margin-top:10px;padding:0 24px;border-radius:12px;background:var(--ink);color:#fff;text-decoration:none;font-weight:900}
    .note{display:block;max-width:680px;margin-top:14px;color:#514715;font-size:.68rem;line-height:1.45}
    footer{width:min(920px,calc(100% - 36px));margin:0 auto;padding:24px 0 38px;color:#888d91;font-size:.64rem;line-height:1.5}
    footer span{display:block}
    @media(max-width:720px){
      .brand span{display:none}.screen{min-height:auto;padding:68px 0}.hero{min-height:calc(100svh - 62px)}
      .ghost{right:-18px;top:12px;transform:none;font-size:10rem}.fix{grid-template-columns:46px 1fr;padding:16px}
      .cta{width:100%}.hero h1{font-size:clamp(3.25rem,17vw,6.2rem)}
    }
  </style>
</head>
<body data-trovatemi-check="\${esc(check.token)}">
  <header class="brand"><b>TROVATEMI.IT <i>★</i></b><span>CHECK PRIVATO</span></header>
  <main>
    <section class="screen hero">
      <div class="inner">
        <p class="eyebrow">\${esc(check.headline.toUpperCase())}</p>
        <h1>\${esc(check.business.name.toUpperCase())}</h1>
        <p class="lead">Ho fatto una cosa semplice: ho cercato <strong>“\${esc(check.query)}”</strong> e ho seguito lo stesso percorso che potrebbe fare una persona prima di chiamarti.</p>
        <div class="search"><span>⌕</span><b>\${esc(check.query)}</b></div>
        <p class="cue">SCORRI · CI METTI MENO DI UN MINUTO ↓</p>
      </div>
    </section>

    \${journey}

    <section class="screen verdict">
      <div class="inner">
        <p class="eyebrow">\${esc(check.verdict.eyebrow)}</p>
        <h2>\${esc(check.verdict.title)}</h2>
        <p>\${esc(check.verdict.body)}</p>
      </div>
    </section>

    <section class="screen fixes">
      <div class="inner">
        <p class="eyebrow">LE 3 COSE CHE SISTEMEREI</p>
        <h2>NON RIFAREI TUTTO.<br>SISTEMEREI IL PERCORSO.</h2>
        <div class="fixes-list">\${actions}</div>
      </div>
    </section>

    <section class="screen final">
      <div class="inner">
        <p class="eyebrow">TROVATEMI.IT ★</p>
        <h2>FATTI TROVARE.<br>FATTI SCEGLIERE.<br><em>FATTI CONTATTARE.</em></h2>
        <p class="final-copy">Se vuoi, questo non resta un check. Lo trasformiamo in un sistema acceso sulla tua attività.</p>
        <a class="cta" href="\${esc(check.cta.href)}">\${esc(check.cta.label)} →</a>
        <small class="note">\${esc(check.offer.label)} · €\${esc(check.offer.priceEur)} una tantum. \${esc(check.offer.note)}</small>
      </div>
    </section>
  </main>
  <footer>
    <span>Check generato da segnali pubblici · valido fino al \${esc(expiry)}</span>
    <span>\${esc(check.claimRule)}</span>
  </footer>
</body>
</html>\`;
}
