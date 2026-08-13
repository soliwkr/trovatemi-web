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
  { id: 'hair-style-formia', name: 'Hair Style Formia', city: 'Formia', category: 'Hair salon', address: 'Via Vitruvio, Formia LT', rating: 4.6, reviews: 73, cohortMedianReviews: 118, cohortMedianRating: 4.5 },
  { id: 'barber-lab-formia', name: 'Barber Lab Formia', city: 'Formia', category: 'Barber shop', address: 'Centro, Formia LT', rating: 4.8, reviews: 46, cohortMedianReviews: 91, cohortMedianRating: 4.6 },
  { id: 'beauty-room-fondi', name: 'Beauty Room Fondi', city: 'Fondi', category: 'Centro estetico', address: 'Centro, Fondi LT', rating: 4.7, reviews: 88, cohortMedianReviews: 104, cohortMedianRating: 4.6 },
  { id: 'studio-armonia-massaggi', name: 'Studio Armonia Massaggi', city: 'Formia', category: 'Studio massaggi', address: 'Formia LT', rating: 4.9, reviews: 39, cohortMedianReviews: 67, cohortMedianRating: 4.7 },
  { id: 'wellness-spa-gaeta', name: 'Wellness Spa Gaeta', city: 'Gaeta', category: 'Spa e centro benessere', address: 'Gaeta LT', rating: 4.7, reviews: 112, cohortMedianReviews: 136, cohortMedianRating: 4.6 },
];

export type AuditAnswers = Record<string, string>;

export const auditQuestions = [
  { id: 'reviewAsk', title: 'Il cliente esce contento. E dopo?', options: [['never', 'Ci salutiamo e finisce lì'], ['sometimes', 'Ogni tanto chiedo la recensione'], ['physical', 'Ho già QR o NFC'], ['systematic', 'La richiesta fa parte del servizio']] },
  { id: 'replies', title: 'Arriva una recensione la sera. Chi risponde?', options: [['never', 'Nessuno'], ['sometimes', 'Quando abbiamo tempo'], ['always', 'Rispondiamo quasi sempre'], ['automated', 'Lo gestisce già un sistema']] },
  { id: 'reuse', title: 'Ti lasciano 5 stelle e scrivono una cosa bellissima. Poi?', options: [['nothing', 'Resta lì su Google'], ['reshare', 'La ricondivido ogni tanto'], ['manual', 'Ci faccio un post a mano'], ['automatic', 'Ho già un sistema che la riutilizza']] },
  { id: 'channels', title: 'Dove fai vedere davvero quello che dicono di te?', options: [['none', 'Da nessuna parte con costanza'], ['one', 'Un canale'], ['two', 'Due canali'], ['many', 'Instagram, TikTok, Facebook o più']] },
  { id: 'weeklyClients', title: 'In una settimana normale quante persone passano da te?', options: [['low', 'Fino a 20'], ['medium', '21–50'], ['high', '51–100'], ['veryHigh', 'Più di 100']] },
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
  const pillars = [['Reputazione Google', reputation], ['Sistema recensioni', collection], ['Risposte', replies], ['Social proof', socialProof]] as const;
  const ordered = [...pillars].sort((a, b) => a[1] - b[1]);
  const actions: string[] = [];
  if (reviewGap < 0) actions.push(`Recupera il gap di ${Math.abs(reviewGap)} recensioni rispetto alla mediana demo della zona.`);
  if (collection < 70) actions.push('Rendi la richiesta recensione un passaggio fisso subito dopo il servizio.');
  if (replies < 70) actions.push('Porta le risposte a una routine costante, non occasionale.');
  if (socialProof < 70) actions.push('Riutilizza le recensioni migliori come contenuti sui canali che già usi.');
  return { reputation, collection, replies, socialProof, weakestPillar: ordered[0][0], strongestPillar: ordered[ordered.length - 1][0], reviewGap, actions: actions.slice(0, 3) };
}
