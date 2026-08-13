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
