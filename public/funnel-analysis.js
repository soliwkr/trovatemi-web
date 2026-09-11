function numeric(values) {
  return values.filter((value) => Number.isFinite(value));
}

function median(values) {
  const list = numeric(values).sort((a, b) => a - b);
  if (!list.length) return null;
  const middle = Math.floor(list.length / 2);
  return list.length % 2 ? list[middle] : (list[middle - 1] + list[middle]) / 2;
}

function formatNumber(value) {
  return Number.isFinite(value) ? new Intl.NumberFormat('it-IT').format(Math.round(value)) : '—';
}

export function buildLocalAnalysis(business, places) {
  const safePlaces = Array.isArray(places) ? places.filter((place) => place?.id && place?.name) : [];
  const targetId = business?.id ?? '';
  const targetIndex = safePlaces.findIndex((place) => place.id === targetId);
  const rank = targetIndex >= 0 ? targetIndex + 1 : null;
  const competitors = safePlaces.filter((place) => place.id !== targetId);
  const visibleCompetitors = competitors.slice(0, 5);
  const leader = visibleCompetitors[0] ?? null;
  const comparisonPool = visibleCompetitors.slice(0, 3);

  const medianReviews = median(comparisonPool.map((place) => place.reviews));
  const medianRating = median(comparisonPool.map((place) => place.rating));
  const businessReviews = Number.isFinite(business?.reviews) ? business.reviews : null;
  const businessRating = Number.isFinite(business?.rating) ? business.rating : null;

  const reviewRatio = businessReviews !== null && medianReviews && medianReviews > 0
    ? businessReviews / medianReviews
    : null;
  const ratingGap = businessRating !== null && Number.isFinite(medianRating)
    ? medianRating - businessRating
    : null;

  let verdict = 'Ti trovano. Adesso devi farti scegliere.';
  let verdictDetail = 'Sei dentro il gruppo visibile. La domanda successiva è quanto rassicuri rispetto alle alternative vicine.';

  if (rank === null) {
    verdict = 'In questa ricerca, non sei entrato nel primo gruppo.';
    verdictDetail = 'Non significa che tu sia invisibile su Google: significa che questa ricerca locale ha restituito altre attività prima di arrivare a te.';
  } else if (rank > 3) {
    verdict = 'Ti trovano. Ma prima vedono altri.';
    verdictDetail = 'Sei comparso al posto ' + rank + ' nell’insieme restituito da questa ricerca locale.';
  } else if (reviewRatio !== null && reviewRatio < 0.55) {
    verdict = 'Ti trovano. Ma gli altri sembrano più scelti.';
    verdictDetail = 'La tua posizione regge, ma il volume di prova pubblica è molto più basso rispetto alle attività vicine mostrate qui.';
  }

  const issues = [];

  if (rank === null) {
    issues.push({
      label: 'Visibilità',
      tone: 'danger',
      priority: 'Alta',
      title: 'Non sei rientrato nei primi risultati restituiti',
      detail: 'La ricerca locale usata da Trovatemi ha mostrato prima altre attività. Va capito su quali query realistiche vuoi essere competitivo.',
    });
  } else if (rank > 3) {
    issues.push({
      label: 'Visibilità',
      tone: 'danger',
      priority: 'Alta',
      title: 'In questa ricerca sei apparso al posto ' + rank,
      detail: 'È un segnale da verificare su più ricerche reali, senza confonderlo con una promessa di ranking.',
    });
  } else {
    issues.push({
      label: 'Visibilità',
      tone: 'good',
      priority: 'Da proteggere',
      title: 'Sei già nel primo gruppo restituito',
      detail: 'Qui il problema non è “esistere”: è trasformare la presenza in una scelta più facile.',
    });
  }

  if (businessReviews !== null && Number.isFinite(medianReviews)) {
    const tone = businessReviews < medianReviews * 0.7 ? 'danger' : businessReviews < medianReviews ? 'watch' : 'good';
    issues.push({
      label: 'Prova sociale',
      tone,
      priority: tone === 'danger' ? 'Alta' : tone === 'watch' ? 'Media' : 'Da proteggere',
      title: formatNumber(businessReviews) + ' recensioni vs mediana ' + formatNumber(medianReviews),
      detail: tone === 'good'
        ? 'Il volume recensioni regge il confronto con le attività vicine mostrate qui.'
        : 'A parità di bisogno, una differenza visibile nel numero di recensioni può spostare la fiducia iniziale.',
    });
  } else {
    issues.push({
      label: 'Prova sociale',
      tone: 'watch',
      priority: 'Da verificare',
      title: 'Volume recensioni non confrontabile',
      detail: 'Google non ha restituito abbastanza dati coerenti per un confronto pulito.',
    });
  }

  if (businessRating !== null && Number.isFinite(medianRating)) {
    const tone = ratingGap > 0.25 ? 'danger' : ratingGap > 0.1 ? 'watch' : 'good';
    issues.push({
      label: 'Fiducia',
      tone,
      priority: tone === 'danger' ? 'Alta' : tone === 'watch' ? 'Media' : 'Da proteggere',
      title: businessRating.toFixed(1).replace('.', ',') + ' ★ vs mediana ' + medianRating.toFixed(1).replace('.', ',') + ' ★',
      detail: tone === 'good'
        ? 'La valutazione è competitiva. Qui conviene lavorare su quantità, freschezza e conversione della prova.'
        : 'Una differenza piccola sembra innocua, ma nella scelta rapida può diventare un segnale di sicurezza.',
    });
  } else {
    issues.push({
      label: 'Fiducia',
      tone: 'watch',
      priority: 'Da verificare',
      title: 'Valutazione non confrontabile',
      detail: 'Non abbiamo abbastanza dati per attribuire un vantaggio o uno svantaggio credibile.',
    });
  }

  return {
    rank,
    leader,
    competitors,
    comparisonPool,
    medianReviews,
    medianRating,
    verdict,
    verdictDetail,
    issues,
  };
}
