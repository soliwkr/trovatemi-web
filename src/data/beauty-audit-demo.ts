export type AuditBusiness = {
  id: string;
  name: string;
  city: string;
  category: string;
  address: string;
  rating: number;
  reviews: number;
  cohortMedianReviews: number;
  cohortMedianRating: number;
};

export const auditDemoBusinesses: AuditBusiness[] = [
  {
    id: 'hair-style-formia',
    name: 'Hair Style Formia',
    city: 'Formia',
    category: 'Hair salon',
    address: 'Via Vitruvio, Formia LT',
    rating: 4.6,
    reviews: 73,
    cohortMedianReviews: 118,
    cohortMedianRating: 4.5,
  },
  {
    id: 'barber-lab-formia',
    name: 'Barber Lab Formia',
    city: 'Formia',
    category: 'Barber shop',
    address: 'Centro, Formia LT',
    rating: 4.8,
    reviews: 46,
    cohortMedianReviews: 91,
    cohortMedianRating: 4.6,
  },
  {
    id: 'beauty-room-fondi',
    name: 'Beauty Room Fondi',
    city: 'Fondi',
    category: 'Beauty salon',
    address: 'Centro, Fondi LT',
    rating: 4.7,
    reviews: 88,
    cohortMedianReviews: 104,
    cohortMedianRating: 4.6,
  },
];

export type AuditAnswers = Record<string, string>;

export const auditQuestions = [
  {
    id: 'reviewAsk',
    title: 'Come chiedi oggi una recensione?',
    options: [
      ['never', 'Non la chiediamo quasi mai'],
      ['sometimes', 'Quando ci ricordiamo'],
      ['physical', 'Abbiamo già QR o NFC'],
      ['systematic', 'È già parte del servizio'],
    ],
  },
  {
    id: 'replies',
    title: 'Chi risponde alle recensioni?',
    options: [
      ['never', 'Nessuno'],
      ['sometimes', 'Ogni tanto'],
      ['always', 'Rispondiamo sempre'],
      ['automated', 'È già automatizzato'],
    ],
  },
  {
    id: 'reuse',
    title: 'Cosa fai oggi con una bella recensione?',
    options: [
      ['nothing', 'Nulla'],
      ['reshare', 'La ricondivido ogni tanto'],
      ['manual', 'Creo manualmente un post'],
      ['automatic', 'Ho già un sistema automatico'],
    ],
  },
  {
    id: 'channels',
    title: 'Dove pubblichi con continuità?',
    options: [
      ['none', 'Nessun canale'],
      ['one', 'Un canale'],
      ['two', 'Due canali'],
      ['many', 'Instagram, TikTok, Facebook o più'],
    ],
  },
  {
    id: 'weeklyClients',
    title: 'Quanti clienti servi circa ogni settimana?',
    options: [
      ['low', 'Fino a 20'],
      ['medium', '21–50'],
      ['high', '51–100'],
      ['veryHigh', 'Più di 100'],
    ],
  },
] as const;

const answerScore: Record<string, Record<string, number>> = {
  reviewAsk: { never: 10, sometimes: 30, physical: 60, systematic: 90 },
  replies: { never: 10, sometimes: 35, always: 80, automated: 95 },
  reuse: { nothing: 5, reshare: 35, manual: 65, automatic: 95 },
  channels: { none: 10, one: 35, two: 65, many: 90 },
};

export function buildAuditReport(business: AuditBusiness, answers: AuditAnswers) {
  const ratingScore = Math.max(0, Math.min(100, Math.round(((business.rating - 3.8) / 1.2) * 100)));
  const volumeScore = Math.max(0, Math.min(100, Math.round((business.reviews / Math.max(1, business.cohortMedianReviews)) * 70)));
  const reputation = Math.round(ratingScore * 0.45 + volumeScore * 0.55);
  const collection = answerScore.reviewAsk[answers.reviewAsk] ?? 0;
  const replies = answerScore.replies[answers.replies] ?? 0;
  const socialProof = Math.round(((answerScore.reuse[answers.reuse] ?? 0) + (answerScore.channels[answers.channels] ?? 0)) / 2);
  const reviewGap = business.reviews - business.cohortMedianReviews;

  const pillars = [
    ['Reputazione Google', reputation],
    ['Sistema recensioni', collection],
    ['Risposte', replies],
    ['Social proof', socialProof],
  ] as const;
  const ordered = [...pillars].sort((a, b) => a[1] - b[1]);

  const actions: string[] = [];
  if (reviewGap < 0) actions.push(`Colma il gap di ${Math.abs(reviewGap)} recensioni rispetto alla mediana demo della cohort locale.`);
  if (collection < 70) actions.push('Rendi la richiesta recensione un passaggio fisso subito dopo il servizio.');
  if (replies < 70) actions.push('Porta le risposte a una routine costante, non occasionale.');
  if (socialProof < 70) actions.push('Riutilizza le recensioni migliori come contenuti sui canali che già usi.');

  return {
    reputation,
    collection,
    replies,
    socialProof,
    weakestPillar: ordered[0][0],
    strongestPillar: ordered[ordered.length - 1][0],
    reviewGap,
    actions: actions.slice(0, 3),
  };
}
