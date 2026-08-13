export type DemoWalkthroughStep = {
  label: string;
  title: string;
  body: string;
};

export type DemoTenant = {
  id: string;
  category: string;
  name: string;
  shortName: string;
  sectorLabel: string;
  icon: string;
  walkthrough: DemoWalkthroughStep[];
};

const demoBaseUrl = 'https://app.trovatemi.it/try/#/home?category=';

export const demoTenants: DemoTenant[] = [
  {
    id: 'luxury-watches',
    category: 'luxury-watches',
    name: 'Orologeria di fascia alta',
    shortName: 'Orologeria',
    sectorLabel: 'Orologeria e retail premium',
    icon: '◷',
    walkthrough: [
      { label: 'Home', title: 'Parti da ciò che è successo', body: 'Leggi le attività recenti e il quadro generale della dimostrazione.' },
      { label: 'Recensioni', title: 'Apri un’esperienza completa', body: 'Guarda fonte, testo, tema e risposta nello stesso punto.' },
      { label: 'Contenuti', title: 'Segui la prova oltre le stelle', body: 'Osserva come le parole del cliente possono alimentare altri contenuti.' },
    ],
  },
  {
    id: 'wellness-spa',
    category: 'wellness-spa',
    name: 'Spa e centro benessere',
    shortName: 'Wellness Spa',
    sectorLabel: 'Spa e attività su appuntamento',
    icon: '✦',
    walkthrough: [
      { label: 'Home', title: 'Leggi le attività recenti', body: 'Parti dalla vista generale e dai segnali raccolti nella dimostrazione.' },
      { label: 'Campagne', title: 'Guarda come parte la richiesta', body: 'Apri messaggi, canali e stato delle richieste post-appuntamento.' },
      { label: 'Recensioni', title: 'Collega servizio e risposta', body: 'Apri un feedback e osserva come il contesto resta leggibile.' },
    ],
  },
  {
    id: 'sunny-cafe',
    category: 'sunny-cafe',
    name: 'Bar e caffetteria',
    shortName: 'Sunny Café',
    sectorLabel: 'Bar e caffetteria',
    icon: '☕',
    walkthrough: [
      { label: 'Home', title: 'Guarda il ritmo dell’attività', body: 'Parti dalle richieste e dalle attività più recenti.' },
      { label: 'Campagne', title: 'Segui una richiesta', body: 'Osserva il percorso dal messaggio allo stato della campagna.' },
      { label: 'Recensioni', title: 'Apri la voce del cliente', body: 'Leggi la recensione, la fonte e la risposta preparata.' },
    ],
  },
  {
    id: 'fitness-club',
    category: 'fitness-club',
    name: 'Palestra e fitness club',
    shortName: 'Fitness Club',
    sectorLabel: 'Palestra e fitness',
    icon: '↗',
    walkthrough: [
      { label: 'Home', title: 'Parti dal quadro generale', body: 'Leggi attività, recensioni e segnali recenti della dimostrazione.' },
      { label: 'Recensioni', title: 'Trova i risultati raccontati', body: 'Apri feedback legati a staff, corsi, struttura e percorso.' },
      { label: 'AI Agents', title: 'Guarda ciò che viene preparato', body: 'Osserva risposta e contenuti costruiti dal contesto della recensione.' },
    ],
  },
  {
    id: 'grand-hotel-riviera',
    category: 'grand-hotel-riviera',
    name: 'Hotel e ospitalità',
    shortName: 'Grand Hotel Riviera',
    sectorLabel: 'Hotel e ospitalità',
    icon: '◇',
    walkthrough: [
      { label: 'Home', title: 'Apri la regia', body: 'Parti dalla vista che riunisce le attività dell’esperienza ospite.' },
      { label: 'Recensioni', title: 'Confronta fonti e temi', body: 'Apri feedback dimostrativi e osserva come vengono organizzati.' },
      { label: 'Campagne', title: 'Segui il post-soggiorno', body: 'Guarda template, canali e stato delle richieste dopo il check-out.' },
    ],
  },
];

export const getDemoTenant = (id: string) => demoTenants.find((demo) => demo.id === id);

export const getDemoUrl = (demo: Pick<DemoTenant, 'category'>) => `${demoBaseUrl}${encodeURIComponent(demo.category)}`;

export const getDemoEmbedCode = (demo: DemoTenant) => `<iframe
  src="${getDemoUrl(demo)}"
  title="Demo Trovatemi — ${demo.name}"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
  allow="clipboard-read; clipboard-write; fullscreen"
  style="width:100%;min-height:760px;border:0;border-radius:24px"
></iframe>`;
