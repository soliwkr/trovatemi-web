(() => {
  if (!document.querySelector('link[data-beauty-direct-response]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/beauty-direct-response.css';
    stylesheet.dataset.beautyDirectResponse = 'true';
    document.head.appendChild(stylesheet);
  }

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

  const renderSameQueryProof = (places, selectedName, query) => {
    const rows = places
      .filter((place) => normalize(place.name) !== normalize(selectedName))
      .slice(0, 3);

    if (!rows.length) return '';

    return `
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
        <footer><span translate="no">Google Maps</span><p>Dati correnti mostrati al momento del Check · nessuna inferenza sul ranking.</p></footer>
      </section>`;
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

  const patchIntro = () => {
    setText('.intro-copy .eyebrow', '60 secondi · il tuo business · nessun punteggio inventato');
    setHTML('.intro-copy h1', 'Ti cercano.<br>Ti confrontano.<br><em>Scelgono in pochi secondi.</em>');
    setText('.intro-copy .lede', 'Cerca la tua attività. Ti faccio vedere la tua vetrina reale e il primo punto dove il passaparola che hai già smette di lavorare per te.');
    setHTML('.intro-copy .primary-action', 'Fammi vedere il mio caso <span aria-hidden="true">↗</span>');
    setText('.intro-note span', 'La scena che conosci');
    setText('.intro-note p', '“Mi sono trovata benissimo.” Paga. Saluta. Esce. Peccato che Google non era lì.');
  };

  const patchSearch = () => {
    setText('.stage-copy .eyebrow', 'Non teoria. Il tuo nome.');
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
    setText('.confirm-copy .eyebrow', 'Questo è quello che una cliente può vedere prima di scegliere.');
    setHTML('.confirm-copy h1', 'Questa è<br><em>la tua vetrina.</em>');
    setText('.plain-clarifier', 'Non stiamo giudicando quanto sei brava. Stiamo guardando quanta prova resta visibile dopo che una cliente è uscita contenta.');
    setHTML('.action-pair .primary-action', 'Sì. Fammi vedere dove si perde <span aria-hidden="true">↗</span>');
    setText('.stage-confirm blockquote', 'Il cliente non legge il tuo curriculum. Guarda prove, confronta al volo e sceglie ciò che sembra più sicuro.');
    void loadSameQueryProof();
  };

  const patchQuiz = () => {
    setText('.quiz-copy .eyebrow', 'Google vede questo. Ora dimmi cosa succede davvero.');
    setText('.private-note', '5 domande. Scegli ciò che succede davvero nel tuo centro. La risposta giusta è quella vera.');
  };

  const patchFlash = () => {
    setText('.flash-heading .eyebrow', 'Eccolo.');
    setText('.flash-score > span', 'IL PRIMO PUNTO DOVE STAI PERDENDO PROVA');
    setText('.flash-cta p', 'Hai già la materia prima: clienti soddisfatte. Questo è il punto dove smette di trasformarsi in prova visibile.');
    setHTML('.flash-cta .primary-action', 'Dammi le 3 mosse <span aria-hidden="true">↗</span>');
  };

  const patchCapture = () => {
    setText('.capture-copy .eyebrow', 'Ora sai dove perde.');
    setHTML('.capture-copy h1', 'Vuoi sapere<br><em>cosa fare domani?</em>');
    if (selectedBusinessName) {
      setText('.capture-copy > p:not(.eyebrow)', `Ti preparo le 3 mosse in ordine per ${selectedBusinessName}. Zero teoria: prima, seconda, terza.`);
    } else {
      setText('.capture-copy > p:not(.eyebrow)', 'Ti preparo le 3 mosse in ordine. Zero teoria: prima, seconda, terza.');
    }
    setHTML('.capture-form .primary-action', 'Mandami le 3 mosse <span aria-hidden="true">↗</span>');
    setText('.capture-aside span', 'Nessuna demo obbligatoria.');
    setText('.capture-aside p', 'Prima vedi il problema e le mosse. Poi decidi se vuoi che Trovatemi faccia il lavoro con te.');
  };

  const patchReport = () => {
    setText('.report-actions .eyebrow', 'Niente lista infinita.');
    setHTML('.report-actions h2', 'Fai queste tre cose.<br><em>In quest’ordine.</em>');
    setText('.report-mechanism .eyebrow', 'Il punto non è lavorare di più');
    setHTML('.report-mechanism h2', 'È smettere di lasciare<br><em>il passaparola al caso.</em>');
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