(() => {
  if (!document.querySelector('link[data-beauty-direct-response]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/beauty-direct-response.css';
    stylesheet.dataset.beautyDirectResponse = 'true';
    document.head.appendChild(stylesheet);
  }

  document.title = 'Trovatemi | Guarda il tuo caso';
  const campaignLabel = document.querySelector('.wordmark i');
  if (campaignLabel) campaignLabel.textContent = 'guarda il tuo caso';

  const stage = document.querySelector('#funnel-stage');
  if (!stage) return;

  let selectedBusinessName = '';
  let lastSearchQuery = sessionStorage.getItem('trovatemi:last-search-query') || '';
  const comparisonCache = new Map();
  let comparisonRequestKey = '';

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('it').replace(/\s+/g, ' ');

  const setText = (selector, value) => {
    const node = stage.querySelector(selector);
    if (node && node.textContent !== value) node.textContent = value;
  };

  const setHTML = (selector, value) => {
    const node = stage.querySelector(selector);
    if (node && node.innerHTML !== value) node.innerHTML = value;
  };

  const setPlaceholder = (selector, value) => {
    const node = stage.querySelector(selector);
    if (node instanceof HTMLInputElement && node.placeholder !== value) node.placeholder = value;
  };

  const proofStyles = `
    <style data-same-query-proof-style>
      .same-query-proof{margin:2.2rem 0 1.6rem;border:2px solid #f6bd00;background:#050505;color:#f7f7f2;box-shadow:10px 10px 0 rgba(246,189,0,.16)}
      .same-query-proof__head{padding:1rem 1rem 1.25rem;border-bottom:2px solid #f6bd00}
      .same-query-proof__head>span{display:inline-block;margin-bottom:.65rem;background:#f6bd00;color:#050505;padding:.3rem .45rem;font:900 .62rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
      .same-query-proof__head strong{display:block;max-width:12ch;font:900 clamp(2rem,8vw,4.2rem)/.88 "Archivo Variable",Arial,sans-serif;letter-spacing:-.055em;text-transform:uppercase}
      .same-query-proof__head p{max-width:36rem;margin:.8rem 0 0;color:rgba(247,247,242,.66);font:650 .78rem/1.35 "Archivo Variable",Arial,sans-serif}
      .same-query-proof__grid{display:grid}
      .same-query-proof__card{position:relative;min-height:10rem;padding:1rem;border-bottom:1px solid rgba(247,247,242,.2);background:#0c0c0c}
      .same-query-proof__card:last-child{border-bottom:0}
      .same-query-proof__index{position:absolute;top:.7rem;right:.85rem;color:rgba(246,189,0,.34);font:900 2.4rem/1 "Archivo Variable",Arial,sans-serif}
      .same-query-proof__card h3{max-width:17ch;margin:0 2rem .35rem 0;color:#f7f7f2;font:900 1.18rem/1.02 "Archivo Variable",Arial,sans-serif;letter-spacing:-.03em;text-transform:uppercase}
      .same-query-proof__card>p{margin:0;color:rgba(247,247,242,.5);font:700 .66rem/1.3 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}
      .same-query-proof__numbers{display:grid;grid-template-columns:auto 1fr;gap:.15rem .7rem;align-items:end;margin-top:1.1rem;padding-top:.8rem;border-top:1px solid rgba(246,189,0,.36)}
      .same-query-proof__numbers b{color:#f6bd00;font:900 1.15rem/1 "Archivo Variable",Arial,sans-serif}
      .same-query-proof__numbers strong{justify-self:end;color:#f7f7f2;font:900 2.35rem/.85 "Archivo Variable",Arial,sans-serif;letter-spacing:-.05em}
      .same-query-proof__numbers small{grid-column:2;justify-self:end;color:rgba(247,247,242,.5);font:800 .55rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}
      .same-query-proof footer{display:flex;justify-content:space-between;gap:1rem;padding:.7rem 1rem;border-top:2px solid #f6bd00;color:rgba(247,247,242,.52);font:700 .56rem/1.25 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}
      .same-query-proof footer span{color:#f6bd00;white-space:nowrap}
      .same-query-proof footer p{margin:0;text-align:right}
      .same-query-proof--loading{padding:1rem;color:#f6bd00;font:850 .72rem/1.25 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}
      @media(min-width:58rem){.same-query-proof__grid{grid-template-columns:repeat(3,1fr)}.same-query-proof__card{border-right:1px solid rgba(247,247,242,.2);border-bottom:0}.same-query-proof__card:last-child{border-right:0}}
    </style>`;

  const missingMomentStyles = `
    <style data-missing-moment-style>
      .missing-moment{position:relative;margin:2.6rem 0 1.6rem;overflow:hidden;border:2px solid #f7f7f2;background:#f7f7f2;color:#050505;box-shadow:12px 12px 0 #f6bd00}
      .missing-moment__label{display:inline-block;margin:1rem 1rem 0;background:#050505;color:#f7f7f2;padding:.38rem .55rem;font:900 .62rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase}
      .missing-moment__scene{padding:1.1rem 1rem 1.25rem}
      .missing-moment__scene blockquote{max-width:24rem;margin:0 0 1rem!important;border:0!important;background:#e8f8df!important;padding:.85rem 1rem!important;color:#050505!important;box-shadow:none!important;transform:rotate(-1deg);font:850 clamp(1.25rem,5vw,2rem)/1.05 "Archivo Variable",Arial,sans-serif!important}
      .missing-moment__scene blockquote span{font-size:.85em}
      .missing-moment__beats{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;border-top:2px solid #050505;padding-top:.85rem}
      .missing-moment__beats strong{font:900 clamp(1.15rem,4.8vw,1.85rem)/1 "Archivo Variable",Arial,sans-serif;letter-spacing:-.04em}
      .missing-moment__beats i{color:#f6bd00;font:900 1.35rem/1 Arial,sans-serif;font-style:normal}
      .missing-moment__punch{background:#050505;padding:1.1rem 1rem 1.3rem;color:#f7f7f2}
      .missing-moment__punch>span{display:block;margin-bottom:.6rem;color:#f6bd00;font:900 .62rem/1.1 "Archivo Variable",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
      .missing-moment__punch h2{max-width:12ch;margin:0;color:#f7f7f2!important;font:900 clamp(2.6rem,10vw,5.6rem)/.86 "Archivo Variable",Arial,sans-serif!important;letter-spacing:-.06em!important;text-transform:uppercase}
      .missing-moment__punch h2 em{color:#ffc400!important;font-style:normal!important}
      .missing-moment__punch p{max-width:34rem;margin:1rem 0 0;color:rgba(247,247,242,.7);font:650 .92rem/1.4 "Archivo Variable",Arial,sans-serif}
      @media(max-width:41.99rem){.missing-moment{box-shadow:7px 7px 0 #f6bd00}.missing-moment__beats{gap:.35rem}.missing-moment__punch h2{font-size:clamp(2.45rem,13vw,4.4rem)}}
    </style>`;

  const reportStoryStyles = `
    <style data-report-proof-story-style>
      .proof-moves{margin:2.5rem 0 0;border-top:2px solid #ffc400;background:#050505;color:#f7f7f2}
      .proof-moves__head{padding:1.2rem 1rem 1rem;border-bottom:1px solid rgba(255,255,255,.15)}
      .proof-moves__head span{display:inline-block;background:#ffc400;color:#050505;padding:.35rem .55rem;font:900 .62rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
      .proof-moves__head h2{max-width:11ch;margin:.7rem 0 .4rem;color:#f7f7f2!important;font:900 clamp(2.8rem,10vw,6rem)/.86 "Archivo Variable",Arial,sans-serif!important;letter-spacing:-.06em!important;text-transform:uppercase}
      .proof-moves__head p{max-width:34rem;margin:0;color:rgba(247,247,242,.66);font:650 .9rem/1.4 "Archivo Variable",Arial,sans-serif}
      .proof-moves__grid{display:grid}
      .proof-move{position:relative;min-height:18rem;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.18);padding:1rem;background:#0b0b0b}
      .proof-move__n{position:absolute;top:.6rem;right:.8rem;color:rgba(255,196,0,.2);font:900 4rem/1 "Archivo Variable",Arial,sans-serif}
      .proof-move__tag{display:inline-block;margin-bottom:.9rem;color:#ffc400;font:900 .66rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase}
      .proof-move h3{max-width:10ch;margin:0 0 .65rem;color:#f7f7f2;font:900 clamp(2.2rem,8vw,4.4rem)/.86 "Archivo Variable",Arial,sans-serif;letter-spacing:-.055em;text-transform:uppercase}
      .proof-move>p{max-width:28rem;margin:0 0 1rem;color:rgba(247,247,242,.68);font:650 .86rem/1.4 "Archivo Variable",Arial,sans-serif}
      .proof-visual{margin-top:1.1rem;border:2px solid #ffc400;background:#f7f7f2;color:#050505;box-shadow:7px 7px 0 rgba(255,196,0,.18)}
      .proof-visual__qr{display:grid;grid-template-columns:5.5rem 1fr;gap:.8rem;align-items:center;padding:.8rem}
      .fake-qr{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;aspect-ratio:1;background:#fff;padding:.35rem;border:2px solid #050505}
      .fake-qr i{background:#050505}.fake-qr i:nth-child(2n),.fake-qr i:nth-child(5n){background:transparent}
      .proof-visual b{display:block;font:900 1rem/1.05 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}.proof-visual small{font:700 .7rem/1.3 "Archivo Variable",Arial,sans-serif;color:#555}
      .proof-review{padding:.8rem}.proof-review__stars{color:#f6bd00;font-size:1.15rem;letter-spacing:.08em}.proof-review__quote{margin:.45rem 0;padding:.65rem;background:#fff;border:1px solid #ddd;font:750 .86rem/1.3 "Archivo Variable",Arial,sans-serif}.proof-review__reply{margin-left:1.2rem;padding:.65rem;background:#e8f8df;border-left:4px solid #2ea44f;font:700 .78rem/1.3 "Archivo Variable",Arial,sans-serif}
      .proof-social{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;padding:.6rem;background:#050505}.proof-social article{min-height:7rem;padding:.55rem;background:#f7f7f2;color:#050505}.proof-social article:nth-child(2){background:#ffc400}.proof-social b{font-size:.75rem}.proof-social p{margin:.55rem 0 0;font:850 .7rem/1.1 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}
      .manual-vs-system{margin:0;background:#f7f7f2;color:#050505}
      .manual-vs-system__manual{padding:1.2rem 1rem}.manual-vs-system__manual>span{font:900 .66rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}.manual-vs-system__manual h2{max-width:12ch;margin:.55rem 0 1rem;color:#050505!important;font:900 clamp(2.7rem,10vw,6rem)/.86 "Archivo Variable",Arial,sans-serif!important;letter-spacing:-.06em!important;text-transform:uppercase}
      .manual-chain{display:flex;flex-wrap:wrap;gap:.4rem}.manual-chain span{border:2px solid #050505;padding:.5rem .65rem;font:900 .68rem/1 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}.manual-chain i{align-self:center;font-style:normal;font-weight:900;color:#f6bd00}
      .system-slab{background:#ffc400;padding:1.25rem 1rem 1.35rem;color:#050505}.system-slab>span{font:900 .66rem/1 "Archivo Variable",Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase}.system-slab h2{max-width:11ch;margin:.6rem 0;color:#050505!important;font:900 clamp(3rem,11vw,6.5rem)/.84 "Archivo Variable",Arial,sans-serif!important;letter-spacing:-.065em!important;text-transform:uppercase}.system-slab p{max-width:32rem;margin:.8rem 0 0;font:750 .94rem/1.38 "Archivo Variable",Arial,sans-serif}.system-slab strong{display:block;margin-top:1rem;border-top:2px solid #050505;padding-top:.8rem;font:900 1rem/1.15 "Archivo Variable",Arial,sans-serif;text-transform:uppercase}
      @media(min-width:58rem){.proof-moves__grid{grid-template-columns:repeat(3,1fr)}.proof-move{border-right:1px solid rgba(255,255,255,.18);border-bottom:0}.proof-move:last-child{border-right:0}.manual-vs-system{display:grid;grid-template-columns:1fr 1fr}}
    </style>`;

  const renderSameQueryProof = (places, selectedName, query) => {
    const rows = places
      .filter((place) => normalize(place.name) !== normalize(selectedName))
      .slice(0, 3);

    if (!rows.length) return '';

    return `${proofStyles}
      <section class="same-query-proof" data-same-query-proof>
        <div class="same-query-proof__head">
          <span>STESSA RICERCA · ${escapeHtml(query)}</span>
          <strong>Una cliente vede anche questi.</strong>
          <p>Non è una classifica. Sono altri risultati reali emersi dalla stessa ricerca.</p>
        </div>
        <div class="same-query-proof__grid">
          ${rows.map((place, index) => `
            <article class="same-query-proof__card">
              <span class="same-query-proof__index">0${index + 1}</span>
              <h3>${escapeHtml(place.name)}</h3>
              <p>${escapeHtml(place.category || 'Attività locale')}</p>
              <div class="same-query-proof__numbers">
                <b>${place.rating === null ? '—' : Number(place.rating).toFixed(1)} ★</b>
                <strong>${place.reviews === null ? '—' : escapeHtml(place.reviews)}</strong>
                <small>recensioni visibili</small>
              </div>
            </article>`).join('')}
        </div>
        <footer><span translate="no">Google Maps</span><p>Dati correnti mostrati al momento · nessuna inferenza sul ranking.</p></footer>
      </section>`;
  };

  const ensureMissingMoment = () => {
    if (stage.querySelector('[data-missing-moment]')) return;
    const clarifier = stage.querySelector('.plain-clarifier');
    if (!clarifier) return;

    clarifier.insertAdjacentHTML('beforebegin', `${missingMomentStyles}
      <section class="missing-moment" data-missing-moment>
        <div class="missing-moment__label">POI SUCCEDE QUESTO</div>
        <div class="missing-moment__scene">
          <blockquote>“Mi sono trovata benissimo.” <span>❤️</span></blockquote>
          <div class="missing-moment__beats" aria-label="La cliente paga, esce e il complimento rischia di finire lì">
            <strong>PAGA.</strong><i>→</i><strong>ESCE.</strong><i>→</i><strong>FINE?</strong>
          </div>
        </div>
        <div class="missing-moment__punch">
          <span>IL MOMENTO CHE NON SI VEDE ONLINE</span>
          <h2>PECCATO CHE<br><em>GOOGLE NON ERA LÌ.</em></h2>
          <p>Google può vedere ciò che resta pubblico. Adesso dimmi cosa fate davvero quando una cliente esce felice.</p>
        </div>
      </section>`);
  };

  const loadSameQueryProof = async () => {
    const confirmation = stage.querySelector('.business-confirmation');
    const selectedName = confirmation?.querySelector('h2')?.textContent?.trim() || '';
    const query = lastSearchQuery.trim();
    if (!confirmation || !selectedName || query.length < 3) return;

    const key = `${query}::${selectedName}`;
    if (stage.querySelector('[data-same-query-proof]')) return;

    const cached = comparisonCache.get(key);
    if (cached) {
      confirmation.insertAdjacentHTML('afterend', cached);
      return;
    }

    if (comparisonRequestKey === key) return;
    comparisonRequestKey = key;

    const loading = document.createElement('div');
    loading.className = 'same-query-proof same-query-proof--loading';
    loading.dataset.sameQueryProof = 'loading';
    loading.innerHTML = '<span>Sto guardando cosa vede anche una cliente nella stessa ricerca…</span>';
    confirmation.insertAdjacentElement('afterend', loading);

    try {
      const response = await fetch(`/api/places/context?q=${encodeURIComponent(query)}`, {
        headers: { accept: 'application/json' },
      });
      if (!response.ok) throw new Error('context_failed');
      const payload = await response.json();
      const html = renderSameQueryProof(Array.isArray(payload.places) ? payload.places : [], selectedName, query);
      loading.remove();
      if (!html) return;
      comparisonCache.set(key, html);
      confirmation.insertAdjacentHTML('afterend', html);
    } catch {
      loading.remove();
    } finally {
      comparisonRequestKey = '';
    }
  };

  const ensureReportProofStory = () => {
    if (stage.querySelector('[data-proof-moves]')) return;
    const actions = stage.querySelector('.report-actions');
    const mechanism = stage.querySelector('.report-mechanism');
    if (!actions || !mechanism) return;

    actions.insertAdjacentHTML('afterend', `${reportStoryStyles}
      <section class="proof-moves" data-proof-moves>
        <header class="proof-moves__head">
          <span>LE 3 MOSSE · VISTE, NON SPIEGATE</span>
          <h2>Raccogli. Rispondi. Riusa.</h2>
          <p>Il passaparola diventa prova quando smette di dipendere dalla memoria e comincia a lasciare tracce visibili.</p>
        </header>
        <div class="proof-moves__grid">
          <article class="proof-move">
            <span class="proof-move__n">01</span><span class="proof-move__tag">RACCOGLI</span>
            <h3>Prendilo quando è caldo.</h3>
            <p>Il momento migliore è quando la cliente è ancora lì e l’esperienza è fresca.</p>
            <div class="proof-visual proof-visual__qr">
              <div class="fake-qr" aria-hidden="true">${'<i></i>'.repeat(25)}</div>
              <div><b>Lascia la tua recensione</b><small>QR / tap NFC come punto fisico di raccolta. Il kit fisico completo resta post-payment.</small></div>
            </div>
          </article>
          <article class="proof-move">
            <span class="proof-move__n">02</span><span class="proof-move__tag">RISPONDI</span>
            <h3>Non lasciarla sola.</h3>
            <p>Una recensione è una conversazione pubblica. La risposta fa vedere che dietro il profilo c’è un’attività viva.</p>
            <div class="proof-visual proof-review">
              <div class="proof-review__stars">★★★★★</div>
              <div class="proof-review__quote">“Mi sono trovata benissimo. Tornerò sicuramente.”</div>
              <div class="proof-review__reply">Grazie di cuore. Ti aspettiamo presto 💛</div>
            </div>
          </article>
          <article class="proof-move">
            <span class="proof-move__n">03</span><span class="proof-move__tag">RIUSA</span>
            <h3>Falla girare di nuovo.</h3>
            <p>Quando operativo e verificato, la prova migliore non deve morire dove è nata: può diventare materiale per i canali che usi già.</p>
            <div class="proof-visual proof-social">
              <article><b>IG STORY</b><p>“Servizio fantastico” ★★★★★</p></article>
              <article><b>POST</b><p>La cliente l’ha già detto meglio di noi.</p></article>
              <article><b>STATUS</b><p>Prova sociale, non un altro post da inventare.</p></article>
            </div>
          </article>
        </div>
      </section>
      <section class="manual-vs-system" data-manual-system>
        <div class="manual-vs-system__manual">
          <span>PUOI FARLO A MANO. OGNI VOLTA.</span>
          <h2>E ricordarti tutto domani.</h2>
          <div class="manual-chain"><span>CHIEDI</span><i>→</i><span>INSEGUI</span><i>→</i><span>RISPONDI</span><i>→</i><span>COPIA</span><i>→</i><span>PUBBLICA</span><i>→</i><span>RICOMINCIA</span></div>
        </div>
        <div class="system-slab">
          <span>OPPURE LO METTI A SISTEMA.</span>
          <h2>Qui entra Trovatemi.</h2>
          <p>Richieste, reminder, routine di risposta e riuso dove effettivamente supportato: non un altro software da imparare, ma meno passaggi da tenere in testa.</p>
          <strong>Tu pensa alle clienti. Il passaparola continua a lavorare. ★</strong>
        </div>
      </section>`);

    mechanism.hidden = true;
  };

  const patchIntro = () => {
    setText('.intro-copy .eyebrow', 'IL TUO BUSINESS · DATI REALI · ZERO PUNTEGGI INVENTATI');
    setHTML('.intro-copy h1', 'Ti cercano.<br>Ti confrontano.<br><em>Scelgono in pochi secondi.</em>');
    setText('.intro-copy .lede', 'Cerca la tua attività. Ti faccio vedere cosa può vedere una nuova cliente e dove il passaparola che hai già smette di diventare prova.');
    setHTML('.intro-copy .primary-action', 'Guarda il mio caso <span aria-hidden="true">↗</span>');
    setText('.intro-note span', 'La scena che conosci');
    setText('.intro-note p', '“Mi sono trovata benissimo.” Paga. Saluta. Esce. Peccato che Google non era lì.');
  };

  const patchSearch = () => {
    setText('.stage-copy .eyebrow', 'NON TEORIA. IL TUO NOME.');
    setHTML('.stage-copy h1', 'Scrivi il nome<br><em>del tuo centro.</em>');
    setText('.stage-explainer', 'Ti mostro quello che una nuova cliente può vedere prima ancora di chiamarti o prenotare.');
    setPlaceholder('[data-search-input]', 'Es. Nails Formia');
    const idle = stage.querySelector('.lookup-status');
    if (idle && !idle.classList.contains('lookup-status--loading') && !idle.classList.contains('lookup-status--error')) {
      if (idle.textContent !== 'Nome + città. Poi scegli il tuo risultato.') idle.textContent = 'Nome + città. Poi scegli il tuo risultato.';
    }
  };

  const patchConfirm = () => {
    const name = stage.querySelector('.business-confirmation h2')?.textContent?.trim();
    if (name) selectedBusinessName = name;
    setText('.confirm-copy .eyebrow', 'QUESTO È QUELLO CHE UNA CLIENTE PUÒ VEDERE PRIMA DI SCEGLIERE.');
    setHTML('.confirm-copy h1', 'Questa è<br><em>la tua vetrina.</em>');
    setText('.plain-clarifier', 'Non stiamo giudicando quanto sei brava. Stiamo guardando quanta prova resta visibile dopo che una cliente è uscita contenta.');
    setHTML('.action-pair .primary-action', 'Ora dimmi cosa succede dopo <span aria-hidden="true">↗</span>');
    setText('.stage-confirm blockquote', 'Ti cercano. Ti confrontano. Poi scelgono con quello che riescono a vedere.');
    ensureMissingMoment();
    void loadSameQueryProof();
  };

  const patchQuiz = () => {
    setText('.quiz-copy .eyebrow', 'GOOGLE VEDE IL PRIMA. ORA DIMMI IL DOPO.');
    setText('.private-note', '5 scene vere. Scegli ciò che succede davvero nel tuo centro. La risposta giusta è quella vera.');
  };

  const patchFlash = () => {
    setText('.flash-heading .eyebrow', 'ECCOLO.');
    setText('.flash-score > span', 'IL PRIMO PUNTO DOVE STAI PERDENDO PROVA');
    setText('.flash-cta p', 'Hai già la materia prima: clienti soddisfatte. Questo è il punto dove smette di trasformarsi in prova visibile.');
    setHTML('.flash-cta .primary-action', 'Dammi le 3 mosse <span aria-hidden="true">↗</span>');
  };

  const patchCapture = () => {
    setText('.capture-copy .eyebrow', 'ORA SAI DOVE PERDE.');
    setHTML('.capture-copy h1', 'Vuoi sapere<br><em>cosa fare domani?</em>');
    if (selectedBusinessName) {
      setText('.capture-copy > p:not(.eyebrow)', `Ti preparo le 3 mosse in ordine per ${selectedBusinessName}. Zero teoria: prima, seconda, terza.`);
    } else {
      setText('.capture-copy > p:not(.eyebrow)', 'Ti preparo le 3 mosse in ordine. Zero teoria: prima, seconda, terza.');
    }
    setHTML('.capture-form .primary-action', 'Mandami le 3 mosse <span aria-hidden="true">↗</span>');
    setText('.capture-aside span', 'Nessuna demo obbligatoria.');
    setText('.capture-aside p', 'Prima vedi il problema e le mosse. Poi decidi se vuoi che Trovatemi tolga quei passaggi dalla tua testa.');
  };

  const patchReport = () => {
    setText('.report-actions .eyebrow', 'BAM. BAM. BAM.');
    setHTML('.report-actions h2', 'Fai queste tre cose.<br><em>In quest’ordine.</em>');
    setText('.report-mechanism .eyebrow', 'PUOI FARLO A MANO. OGNI VOLTA.');
    setHTML('.report-mechanism h2', 'Oppure smetti di lasciare<br><em>il passaparola al caso.</em>');
    ensureReportProofStory();
    const restart = stage.querySelector('[data-restart]');
    if (restart) restart.textContent = 'Rivedi dall’inizio ↻';
  };

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('[data-search-form]')) return;
    const input = form.querySelector('[data-search-input]');
    if (!(input instanceof HTMLInputElement)) return;
    const value = input.value.trim();
    if (value.length < 3) return;
    lastSearchQuery = value;
    sessionStorage.setItem('trovatemi:last-search-query', value);
  }, true);

  const patch = () => {
    const state = stage.querySelector('[data-state]')?.getAttribute('data-state');
    if (state === 'intro') patchIntro();
    if (state === 'search') patchSearch();
    if (state === 'confirm') patchConfirm();
    if (state === 'quiz') patchQuiz();
    if (state === 'flash') patchFlash();
    if (state === 'capture') patchCapture();
    if (state === 'report') patchReport();
  };

  let queued = false;
  const queuePatch = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      patch();
    });
  };

  new MutationObserver(queuePatch).observe(stage, { childList: true, subtree: true });
  queuePatch();
})();