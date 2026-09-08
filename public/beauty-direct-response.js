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

  const patchIntro = () => {
    setText('.intro-copy .eyebrow', '60 secondi · il tuo business · nessun punteggio inventato');
    setHTML('.intro-copy h1', 'Quante clienti felici<br>stai lasciando uscire<br><em>senza lasciare una traccia?</em>');
    setText('.intro-copy .lede', 'Cerca la tua attività. In meno di un minuto ti mostro il primo punto dove il passaparola che hai già smette di lavorare per te.');
    setHTML('.intro-copy .primary-action', 'Fammi vedere il mio caso <span aria-hidden="true">↗</span>');
    setText('.intro-note span', 'Succede ogni giorno');
    setText('.intro-note p', '“Mi sono trovata benissimo.” Paga. Saluta. Esce. Se nessuno trasforma quel complimento in prova, muore lì. Peccato che Google non era lì.');
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
    setText('.confirm-copy .eyebrow', 'Fermati un secondo. Questa è la prova che lavora mentre tu sei occupata.');
    setHTML('.confirm-copy h1', 'Questa è<br><em>la tua vetrina.</em>');
    setText('.plain-clarifier', 'Non stiamo giudicando quanto sei brava. Stiamo guardando quanta prova resta visibile dopo che una cliente è uscita contenta.');
    setHTML('.action-pair .primary-action', 'Sì. Fammi vedere dove si perde <span aria-hidden="true">↗</span>');
    setText('.stage-confirm blockquote', 'Il problema non è avere clienti felici. È far sì che resti qualcosa dopo il complimento.');
  };

  const patchQuiz = () => {
    setText('.quiz-copy .eyebrow', '5 domande. Niente teoria.');
    setText('.private-note', 'Scegli ciò che succede davvero nel tuo centro. La risposta giusta è quella vera.');
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