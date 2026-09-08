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

    actions.insertAdjacentHTML('afterend', `
      <section class="proof-moves" data-proof-moves>
        <header class="proof-moves__head">
          <div class="proof-moves__kicker">LE 3 MOSSE · VISTE, NON SPIEGATE</div>
          <h2>Raccogli.<br>Rispondi.<br><mark>Riusa.</mark></h2>
          <p>Un complimento diventa prova solo quando passa da un gesto concreto a una traccia pubblica che puoi continuare a usare.</p>
          <div class="proof-loop" aria-label="Cliente felice, raccogli, recensione, rispondi, riusa, più prova visibile">
            <span>CLIENTE FELICE</span><i>→</i><span>RACCOGLI</span><i>→</i><span>RECENSIONE</span><i>→</i><span>RISPONDI</span><i>→</i><span>RIUSA</span><i>→</i><span>PIÙ PROVA VISIBILE</span>
          </div>
        </header>
        <div class="proof-moves__stack">
          <article class="proof-scene proof-scene--collect">
            <header class="proof-scene__header">
              <span class="proof-scene__n">01</span>
              <div><span class="proof-scene__tag">RACCOGLI</span><h3>Chiedilo nel momento giusto.</h3></div>
            </header>
            <div class="proof-scene__body">
              <div class="proof-scene__copy">
                <p>La cliente è ancora lì. Il risultato è fresco. La richiesta smette di essere un “poi” e diventa un gesto.</p>
                <div class="scene-beats"><span>CLIENTE FELICE</span><i>→</i><span>GESTO CONCRETO</span><i>→</i><span>RECENSIONE</span></div>
              </div>
              <div class="collect-stage" aria-label="Esempio visivo di richiesta recensione tramite QR, NFC o link">
                <div class="collect-stage__photo">
                  <img src="/images/proof-beauty-nfc-v1.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Una cliente soddisfatta avvicina il telefono a un supporto NFC mentre la professionista la saluta" />
                  <div class="collect-stage__moment">
                    <span>APPUNTAMENTO FINITO</span>
                    <strong>“Mi sono trovata<br>benissimo.”</strong>
                    <small>IL MOMENTO È ADESSO ↓</small>
                  </div>
                  <span class="collect-stage__scribble" aria-hidden="true">Finché è qui. ♡</span>
                </div>
                <div class="review-touchpoint">
                  <span class="review-touchpoint__pin">IL GESTO</span>
                  <div class="nfc-mark" aria-hidden="true"><i></i><i></i><i></i><b>NFC</b></div>
                  <div class="fake-qr" aria-hidden="true">${'<i></i>'.repeat(49)}</div>
                  <div class="review-touchpoint__copy">
                    <small>GRAZIE PER ESSERE STATA QUI</small>
                    <b>Ti va di lasciare la tua recensione?</b>
                    <span>INQUADRA · APPOGGIA · APRI IL LINK</span>
                  </div>
                </div>
                <small class="visual-disclaimer">SCENA DI FLUSSO · QR NON SCANSIONABILE</small>
              </div>
            </div>
          </article>
          <article class="proof-scene proof-scene--reply">
            <header class="proof-scene__header">
              <span class="proof-scene__n">02</span>
              <div><span class="proof-scene__tag">RISPONDI</span><h3>Fai vedere che ci sei.</h3></div>
            </header>
            <div class="proof-scene__body">
              <div class="proof-scene__copy">
                <p>La recensione è pubblica. Anche la cura nella risposta lo è. Il flusso resta leggibile: apri, prepara, controlla, pubblica.</p>
                <div class="scene-beats"><span>APRI</span><i>→</i><span>PREPARA</span><i>→</i><span>CONTROLLA</span><i>→</i><span>PUBBLICA</span></div>
              </div>
              <div class="reply-workflow" aria-label="Esempio visivo del flusso recensione e risposta">
                <div class="review-inbox">
                  <header><span class="review-inbox__avatar" aria-hidden="true"></span><span>RECENSIONE RICEVUTA · ESEMPIO</span><b>ORA</b></header>
                  <div class="review-inbox__stars" aria-label="Cinque stelle illustrative">★★★★★</div>
                  <blockquote>“Cura, gentilezza e un risultato bellissimo.”</blockquote>
                  <footer><span>UNA CLIENTE</span><i>PROVA PUBBLICA</i></footer>
                </div>
                <div class="reply-connector" aria-hidden="true"><span></span><b>RISPONDI</b><span></span></div>
                <div class="reply-composer">
                  <header><span>RISPOSTA DA RIVEDERE</span><b>TONO DEL CENTRO</b></header>
                  <p>Grazie di cuore. Siamo felici che tu abbia sentito la cura che mettiamo in ogni appuntamento.</p>
                  <footer><span>CONTROLLA PRIMA</span><b>PUBBLICA RISPOSTA ↗</b></footer>
                </div>
                <small class="visual-disclaimer">WORKFLOW VISIVO · NESSUN AUTOPILOTA PROMESSO</small>
              </div>
            </div>
          </article>
          <article class="proof-scene proof-scene--reuse">
            <header class="proof-scene__header">
              <span class="proof-scene__n">03</span>
              <div><span class="proof-scene__tag">RIUSA</span><h3>Trasforma la prova. Non il senso.</h3></div>
            </header>
            <div class="proof-scene__body">
              <div class="proof-scene__copy">
                <p>Dove il canale è operativo e testato, la stessa recensione può diventare una bozza di prova sociale da rivedere prima di pubblicare.</p>
                <div class="scene-beats"><span>RECENSIONE</span><i>→</i><span>FORMATO</span><i>→</i><span>REVISIONE</span><i>→</i><span>CANALE ATTIVO</span></div>
              </div>
              <div class="reuse-workflow" aria-label="Esempio di recensione trasformata in formati social solo dove operativo">
                <div class="reuse-source">
                  <span>LA PROVA DI PARTENZA</span>
                  <div class="reuse-source__stars">★★★★★</div>
                  <blockquote>“Cura, gentilezza e un risultato bellissimo.”</blockquote>
                  <small>RECENSIONE · ESEMPIO</small>
                </div>
                <div class="reuse-transform" aria-hidden="true"><span>UNA PROVA</span><i>↗</i><i>→</i><i>↘</i><b>PIÙ FORMATI</b></div>
                <div class="social-stack">
                  <article class="social-card social-card--story"><header><span>STORY</span><b>BOZZA</b></header><p>“Un risultato<br>bellissimo.”</p><footer>★★★★★</footer></article>
                  <article class="social-card social-card--post"><header><span>POST</span><b>BOZZA</b></header><p>La cura si vede.<br>Le clienti la raccontano.</p><footer>PROVA SOCIALE</footer></article>
                  <article class="social-card social-card--card"><header><span>CARD</span><b>BOZZA</b></header><p>“Gentilezza<br>e cura.”</p><footer>DA RIVEDERE</footer></article>
                </div>
                <div class="reuse-gate"><span>DOVE OPERATIVO E TESTATO</span><strong>PUBBLICAZIONE SOLO DOVE IL CANALE È OPERATIVO E TESTATO.</strong></div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section class="manual-vs-system" data-manual-system>
        <div class="manual-vs-system__manual">
          <span class="manual-vs-system__label">PUOI FARLO A MANO. OGNI VOLTA.</span>
          <h2>Ogni passaggio<br>torna da te.</h2>
          <div class="manual-chain" aria-label="Chiedi, insegui, rispondi, copia, pubblica, ricomincia">
            <div><small>01 · TOCCA A TE</small><span>CHIEDI</span></div><i>→</i>
            <div><small>02 · TOCCA A TE</small><span>INSEGUI</span></div><i>→</i>
            <div><small>03 · TOCCA A TE</small><span>RISPONDI</span></div><i>→</i>
            <div><small>04 · TOCCA A TE</small><span>COPIA</span></div><i>→</i>
            <div><small>05 · TOCCA A TE</small><span>PUBBLICA</span></div><i>→</i>
            <div class="manual-chain__again"><small>DOMANI · DA CAPO</small><span>RICOMINCIA</span></div>
          </div>
          <strong class="manual-loopline">CHIEDI → INSEGUI → RISPONDI → COPIA → PUBBLICA → RICOMINCIA</strong>
        </div>
        <div class="system-slab">
          <span class="system-slab__eyebrow">QUI ENTRA TROVATEMI</span>
          <h2>OPPURE LO METTI A SISTEMA</h2>
          <div class="system-rails" aria-label="Cosa viene messo a sistema">
            <div><span>RACCOGLI</span><b>RICHIESTA + PROMEMORIA</b><small>DA CONFIGURARE SUL FLUSSO</small></div>
            <div><span>RISPONDI</span><b>ROUTINE DI RISPOSTA</b><small>WORKFLOW, NON MAGIA</small></div>
            <div><span>RIUSA</span><b>SOLO DOVE ATTIVO</b><small>CANALE OPERATIVO E TESTATO</small></div>
          </div>
          <p>Non un altro cruscotto da guardare. Meno passaggi da ricordare, con i confini operativi dichiarati.</p>
          <strong class="system-slab__close">TU PENSA ALLE CLIENTI. IL PASSAPAROLA CONTINUA A LAVORARE. ★</strong>
        </div>
      </section>`);

    mechanism.remove();
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
    setText('.stage-confirm > blockquote', 'Ti cercano. Ti confrontano. Poi scelgono con quello che riescono a vedere.');
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
