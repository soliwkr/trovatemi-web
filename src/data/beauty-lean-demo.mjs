export const demoBusinesses = [
  {
    id: 'taglio-studio-formia',
    name: 'Taglio Studio',
    city: 'Formia',
    category: 'Hair salon',
    address: 'Via Vitruvio 118, Formia LT',
    rating: 4.6,
    reviews: 73,
    cohortMedianReviews: 118,
  },
  {
    id: 'barberia-19-formia',
    name: 'Barberia 19',
    city: 'Formia',
    category: 'Barber shop',
    address: 'Via Rubino 19, Formia LT',
    rating: 4.8,
    reviews: 46,
    cohortMedianReviews: 91,
  },
  {
    id: 'luce-estetica-fondi',
    name: 'Luce Estetica',
    city: 'Fondi',
    category: 'Centro estetico',
    address: 'Corso Appio Claudio 42, Fondi LT',
    rating: 4.7,
    reviews: 88,
    cohortMedianReviews: 104,
  },
  {
    id: 'gloss-nails-gaeta',
    name: 'Gloss Nails & Lashes',
    city: 'Gaeta',
    category: 'Nails & lashes',
    address: 'Via Indipendenza 27, Gaeta LT',
    rating: 4.9,
    reviews: 61,
    cohortMedianReviews: 96,
  },
  {
    id: 'spazio-armonia-formia',
    name: 'Spazio Armonia',
    city: 'Formia',
    category: 'Studio massaggi',
    address: 'Via Lavanga 8, Formia LT',
    rating: 4.9,
    reviews: 39,
    cohortMedianReviews: 67,
  },
  {
    id: 'sale-spa-sperlonga',
    name: 'Sale Spa',
    city: 'Sperlonga',
    category: 'Spa & wellness',
    address: 'Via Cristoforo Colombo 54, Sperlonga LT',
    rating: 4.7,
    reviews: 112,
    cohortMedianReviews: 136,
  },
];

export const auditQuestions = [
  {
    id: 'reviewAsk',
    title: 'Il cliente esce contento. E dopo?',
    eyebrow: 'Il momento che conta',
    options: [
      ['never', 'Ci salutiamo e finisce lì'],
      ['sometimes', 'Ogni tanto chiedo la recensione'],
      ['physical', 'Ho già QR o NFC'],
      ['systematic', 'La richiesta fa parte del servizio'],
    ],
  },
  {
    id: 'replies',
    title: 'Arriva una recensione la sera. Chi risponde?',
    eyebrow: 'Dopo le cinque stelle',
    options: [
      ['never', 'Nessuno'],
      ['sometimes', 'Quando abbiamo tempo'],
      ['always', 'Rispondiamo quasi sempre'],
      ['automated', 'Lo gestisce già un sistema'],
    ],
  },
  {
    id: 'reuse',
    title: 'Scrivono una cosa bellissima. Poi?',
    eyebrow: 'Quello che non si vede',
    options: [
      ['nothing', 'Resta lì su Google'],
      ['reshare', 'La ricondivido ogni tanto'],
      ['manual', 'Ci faccio un post a mano'],
      ['automatic', 'Ho già un sistema che la riutilizza'],
    ],
  },
  {
    id: 'channels',
    title: 'Dove fai vedere davvero quello che dicono di te?',
    eyebrow: 'La prova deve girare',
    options: [
      ['none', 'Da nessuna parte con costanza'],
      ['one', 'Su un canale'],
      ['two', 'Su due canali'],
      ['many', 'Instagram, TikTok, Facebook o più'],
    ],
  },
  {
    id: 'weeklyClients',
    title: 'In una settimana normale quante persone passano da te?',
    eyebrow: 'Facciamo due conti',
    options: [
      ['low', 'Fino a 20'],
      ['medium', '21–50'],
      ['high', '51–100'],
      ['veryHigh', 'Più di 100'],
    ],
  },
];

const answerScore = {
  reviewAsk: { never: 10, sometimes: 30, physical: 60, systematic: 90 },
  replies: { never: 10, sometimes: 35, always: 80, automated: 95 },
  reuse: { nothing: 5, reshare: 35, manual: 65, automatic: 95 },
  channels: { none: 10, one: 35, two: 65, many: 90 },
};

const actionForPillar = {
  'Reputazione Google': 'Recupera il divario di recensioni rispetto alle attività simili della zona.',
  'Sistema recensioni': 'Rendi la richiesta recensione un passaggio fisso subito dopo il servizio.',
  Risposte: 'Porta le risposte a una routine costante, non alla serata in cui avanza tempo.',
  'Social proof': 'Trasforma le recensioni migliori in contenuti sui canali che usi già.',
};

const weeklyClientReadings = {
  low: {
    range: 'Fino a 20 clienti a settimana',
    insight: 'Il ritmo conta più del volume: ogni richiesta recensione saltata pesa.',
  },
  medium: {
    range: '21–50 clienti a settimana',
    insight: 'Una routine semplice può già creare un flusso regolare di nuove prove pubbliche.',
  },
  high: {
    range: '51–100 clienti a settimana',
    insight: 'La materia prima non manca: il rischio è quanta ne lasci evaporare ogni settimana.',
  },
  veryHigh: {
    range: 'Più di 100 clienti a settimana',
    insight: 'Gestire richieste, risposte e riuso a mano diventa subito un collo di bottiglia.',
  },
};

export function buildAuditReport(business, answers) {
  const ratingScore = Math.max(0, Math.min(100, Math.round(((business.rating - 3.8) / 1.2) * 100)));
  const volumeScore = Math.max(0, Math.min(100, Math.round((business.reviews / Math.max(1, business.cohortMedianReviews)) * 70)));
  const reputation = Math.round(ratingScore * 0.45 + volumeScore * 0.55);
  const collection = answerScore.reviewAsk[answers.reviewAsk] ?? 0;
  const replies = answerScore.replies[answers.replies] ?? 0;
  const socialProof = Math.round(((answerScore.reuse[answers.reuse] ?? 0) + (answerScore.channels[answers.channels] ?? 0)) / 2);
  const reviewGap = business.reviews - business.cohortMedianReviews;
  const weeklyClientReading = weeklyClientReadings[answers.weeklyClients] ?? {
    range: 'Volume settimanale non indicato',
    insight: 'Serve il volume clienti per stimare quanto passaparola può diventare prova pubblica.',
  };

  const pillars = [
    ['Reputazione Google', reputation],
    ['Sistema recensioni', collection],
    ['Risposte', replies],
    ['Social proof', socialProof],
  ].sort((a, b) => a[1] - b[1]);

  const actions = pillars.slice(0, 3).map(([pillar]) => actionForPillar[pillar]);

  return {
    reputation,
    collection,
    replies,
    socialProof,
    weakestPillar: pillars[0][0],
    strongestPillar: pillars[pillars.length - 1][0],
    reviewGap,
    weeklyClientReading,
    actions,
  };
}
