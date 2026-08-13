export const beautyScoreVersion = 'v1';

export const beautyQuestions = [
  {
    id: 'businessType',
    title: 'Che tipo di attività hai?',
    options: [
      ['salon', 'Parrucchiere / hair salon'],
      ['barber', 'Barber shop'],
      ['beauty', 'Centro estetico'],
      ['nails', 'Nail / lashes / beauty specialist'],
    ],
  },
  {
    id: 'weeklyClients',
    title: 'Quanti clienti servi in una settimana normale?',
    options: [
      ['low', 'Fino a 20'],
      ['medium', '21–50'],
      ['high', '51–100'],
      ['veryHigh', 'Più di 100'],
    ],
  },
  {
    id: 'reviewAsk',
    title: 'Quanto spesso chiedi una recensione Google?',
    options: [
      ['never', 'Quasi mai'],
      ['sometimes', 'Quando me ne ricordo'],
      ['often', 'Spesso'],
      ['systematic', 'È parte del servizio'],
    ],
  },
  {
    id: 'freshReviews',
    title: 'Quante nuove recensioni hai ricevuto negli ultimi 30 giorni?',
    options: [
      ['zero', '0'],
      ['few', '1–3'],
      ['several', '4–9'],
      ['many', '10 o più'],
    ],
  },
  {
    id: 'replies',
    title: 'Quanto sei costante nel rispondere alle recensioni?',
    options: [
      ['never', 'Quasi mai'],
      ['sometimes', 'Ad alcune'],
      ['most', 'Alla maggior parte'],
      ['all', 'A tutte'],
    ],
  },
  {
    id: 'reuse',
    title: 'Riutilizzi le recensioni come contenuti?',
    options: [
      ['never', 'Mai'],
      ['manual', 'Copio qualcosa a mano'],
      ['sometimes', 'Ogni tanto'],
      ['systematic', 'Sì, con un processo'],
    ],
  },
  {
    id: 'channels',
    title: 'Su quanti canali pubblichi con continuità?',
    options: [
      ['zero', 'Nessuno'],
      ['one', 'Uno'],
      ['two', 'Due'],
      ['many', 'Tre o più'],
    ],
  },
] as const;

export type BeautyAnswers = Record<string, string>;

const scoring: Record<string, Record<string, number>> = {
  reviewAsk: { never: 0, sometimes: 12, often: 24, systematic: 35 },
  freshReviews: { zero: 0, few: 7, several: 14, many: 20 },
  replies: { never: 0, sometimes: 5, most: 10, all: 15 },
  reuse: { never: 0, manual: 5, sometimes: 10, systematic: 15 },
  channels: { zero: 0, one: 5, two: 10, many: 15 },
};

export function calculateBeautyScore(answers: BeautyAnswers) {
  const collection = (scoring.reviewAsk[answers.reviewAsk] ?? 0) + (scoring.freshReviews[answers.freshReviews] ?? 0);
  const replies = scoring.replies[answers.replies] ?? 0;
  const reuse = scoring.reuse[answers.reuse] ?? 0;
  const distribution = scoring.channels[answers.channels] ?? 0;
  const pillars = [
    ['Raccolta recensioni', collection],
    ['Risposte', replies],
    ['Riutilizzo', reuse],
    ['Distribuzione', distribution],
  ] as const;
  const ordered = [...pillars].sort((a, b) => a[1] - b[1]);
  const score = collection + replies + reuse + distribution;

  const volume = { low: 1, medium: 2, high: 3, veryHigh: 4 }[answers.weeklyClients] ?? 1;
  const gap = { never: 4, sometimes: 3, often: 2, systematic: 1 }[answers.reviewAsk] ?? 1;
  const pressure = volume * gap;
  const opportunity = pressure >= 9 ? 'alta' : pressure >= 5 ? 'media' : 'bassa';

  const actions: string[] = [];
  if (answers.reviewAsk !== 'systematic') actions.push('Rendi la richiesta recensione un momento fisso del servizio.');
  if (answers.replies !== 'all') actions.push('Rispondi con continuità alle nuove recensioni.');
  if (answers.reuse !== 'systematic') actions.push('Riutilizza le recensioni migliori come contenuti.');
  if (answers.channels !== 'many') actions.push('Distribuisci la prova sui canali che già usi.');
  if (actions.length < 3) actions.push('Controlla ogni 30 giorni la velocità con cui arrivano nuove recensioni.');

  return {
    score,
    opportunity,
    weakestPillar: ordered[0][0],
    strongestPillar: ordered[ordered.length - 1][0],
    actions: actions.slice(0, 3),
  };
}
