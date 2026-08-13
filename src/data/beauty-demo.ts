export type BeautyDemoBusiness = {
  slug: string;
  name: string;
  category: string;
  city: string;
  address: string;
  rating: number;
  reviews: number;
  unanswered: number;
  latestReviewDays: number;
  photoCount: number;
  profileScore: number;
  visibilityScore: number;
  responseScore: number;
  accent: string;
  insight: string;
  priorities: Array<{ title: string; copy: string; impact: 'alto' | 'medio' }>;
};

export const beautyDemoBusinesses: BeautyDemoBusiness[] = [
  {
    slug: 'studio-armonia-massaggi',
    name: 'Studio Armonia Massaggi',
    category: 'Studio massaggi',
    city: 'Roma',
    address: 'Via dei Gelsi 18',
    rating: 4.8,
    reviews: 47,
    unanswered: 19,
    latestReviewDays: 34,
    photoCount: 12,
    profileScore: 62,
    visibilityScore: 58,
    responseScore: 41,
    accent: '#d86f52',
    insight: 'La reputazione è ottima, ma il profilo sembra meno attivo del servizio reale: le recensioni recenti e le risposte sono il margine più veloce.',
    priorities: [
      { title: 'Riprendi il ritmo delle recensioni', copy: 'L’ultima recensione risale a oltre un mese fa. Chiedile nel momento di massimo benessere, subito dopo il trattamento.', impact: 'alto' },
      { title: 'Rispondi alle 19 recensioni aperte', copy: 'Le risposte mostrano cura anche a chi sta ancora confrontando gli studi.', impact: 'alto' },
      { title: 'Mostra ambienti e rituali', copy: 'Dodici foto non raccontano ancora bene atmosfera, cabine e differenze tra i trattamenti.', impact: 'medio' },
    ],
  },
  {
    slug: 'wellness-spa-gaeta',
    name: 'Wellness Spa Gaeta',
    category: 'Spa e centro benessere',
    city: 'Gaeta',
    address: 'Lungomare Caboto 42',
    rating: 4.6,
    reviews: 128,
    unanswered: 8,
    latestReviewDays: 9,
    photoCount: 38,
    profileScore: 81,
    visibilityScore: 76,
    responseScore: 72,
    accent: '#4c8278',
    insight: 'Il profilo parte da una base forte. La prossima crescita viene dal trasformare l’esperienza stagionale in prove fresche e costanti tutto l’anno.',
    priorities: [
      { title: 'Proteggi la continuità fuori stagione', copy: 'Programma richieste leggere e costanti per evitare lunghi vuoti tra estate e inverno.', impact: 'alto' },
      { title: 'Completa le risposte mancanti', copy: 'Solo otto recensioni sono senza risposta: chiudere il divario rende il profilo più curato.', impact: 'medio' },
      { title: 'Aggiorna i servizi in evidenza', copy: 'Porta massaggi di coppia e percorsi spa nelle foto e nei contenuti più recenti.', impact: 'medio' },
    ],
  },
  {
    slug: 'atelier-luce-hair',
    name: 'Atelier Luce Hair',
    category: 'Parrucchiere',
    city: 'Milano',
    address: 'Via Savona 31',
    rating: 4.9,
    reviews: 83,
    unanswered: 27,
    latestReviewDays: 16,
    photoCount: 24,
    profileScore: 69,
    visibilityScore: 73,
    responseScore: 35,
    accent: '#b28853',
    insight: 'I clienti raccontano risultati eccellenti. Il collo di bottiglia non è la soddisfazione: è far vedere che il salone ascolta e risponde.',
    priorities: [
      { title: 'Recupera le risposte arretrate', copy: 'Ventisette clienti hanno lasciato una prova pubblica senza ricevere una risposta visibile.', impact: 'alto' },
      { title: 'Rendi riconoscibili le specialità', copy: 'Balayage, colore e taglio riccio meritano raccolte fotografiche più facili da capire.', impact: 'alto' },
      { title: 'Mantieni recensioni quindicinali', copy: 'Il ritmo è buono: una routine semplice evita che si interrompa nei periodi pieni.', impact: 'medio' },
    ],
  },
  {
    slug: 'nude-nail-lab',
    name: 'Nude Nail Lab',
    category: 'Nails & lashes',
    city: 'Bologna',
    address: 'Via San Felice 76',
    rating: 4.7,
    reviews: 31,
    unanswered: 14,
    latestReviewDays: 52,
    photoCount: 9,
    profileScore: 49,
    visibilityScore: 46,
    responseScore: 38,
    accent: '#9a6f86',
    insight: 'Il lavoro visivo è il punto forte, ma online ci sono poche prove recenti. Il profilo non restituisce ancora l’energia reale del nail lab.',
    priorities: [
      { title: 'Riattiva le recensioni recenti', copy: 'Cinquantadue giorni di silenzio fanno sembrare il profilo meno vivo di quanto sia.', impact: 'alto' },
      { title: 'Pubblica un portfolio essenziale', copy: 'Nove foto sono poche per un servizio scelto soprattutto con gli occhi.', impact: 'alto' },
      { title: 'Rispondi con una voce riconoscibile', copy: 'Le risposte possono raccontare stile, cura e specializzazioni senza sembrare promozionali.', impact: 'medio' },
    ],
  },
];

export function getBeautyBusiness(slug: string) {
  return beautyDemoBusinesses.find((business) => business.slug === slug);
}
