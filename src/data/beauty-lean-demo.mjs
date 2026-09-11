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
];

export const diagnosticQuestions = [
  {
    id: 'reviewAsk',
    eyebrow: 'Raccolta',
    title: 'Quando un cliente è soddisfatto, come chiedete la recensione?',
    options: [
      ['never', 'Non la chiediamo in modo abituale'],
      ['sometimes', 'La chiediamo solo in alcuni casi'],
      ['physical', 'Usiamo già QR o NFC, ma dipende dalla persona'],
      ['systematic', 'La richiesta fa parte del processo'],
    ],
  },
  {
    id: 'replies',
    eyebrow: 'Risposta',
    title: 'Quando arriva una recensione, cosa succede?',
    options: [
      ['never', 'Spesso resta senza risposta'],
      ['sometimes', 'Rispondiamo quando c’è tempo'],
      ['always', 'Rispondiamo quasi sempre'],
      ['structured', 'Abbiamo già un processo strutturato'],
    ],
  },
  {
    id: 'reuse',
    eyebrow: 'Riuso',
    title: 'Una recensione molto forte quanto lavora?',
    options: [
      ['nothing', 'Resta quasi sempre su Google'],
      ['reshare', 'La ricondividiamo occasionalmente'],
      ['manual', 'La trasformiamo manualmente in contenuto'],
      ['systematic', 'Abbiamo già un processo di riuso'],
    ],
  },
];
