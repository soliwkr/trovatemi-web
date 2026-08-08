export type ClimboDemo = {
  id: string;
  category: string;
  name: string;
  shortName: string;
  sector: string;
  icon: string;
  accent: string;
  accentSoft: string;
  hero: string;
  summary: string;
  moment: string;
  friction: string;
  bio: string;
  features: string[];
  walkthrough: Array<{
    label: string;
    title: string;
    body: string;
  }>;
  searchIntents: string[];
};

const playgroundBase = 'https://app.trovatemi.it/try/#/home?category=';

export const climboDemos: ClimboDemo[] = [
  {
    id: 'luxury-watches',
    category: 'luxury-watches',
    name: 'Orologeria di fascia alta',
    shortName: 'Orologeria',
    sector: 'Retail premium',
    icon: '◷',
    accent: '#d8b56c',
    accentSoft: '#332b20',
    hero: 'La fiducia comincia prima che il cliente entri in boutique.',
    summary: 'Un ambiente demo per vedere come recensioni, risposte e contenuti sostengono una scelta ad alto valore.',
    moment: 'Dopo la consulenza, il ritiro o l’assistenza sul prodotto.',
    friction: 'La qualità del servizio è difficile da valutare prima dell’acquisto e la fiducia online pesa molto.',
    bio: 'Scopri il pannello che trasforma esperienze di acquisto e assistenza in fiducia visibile.',
    features: ['Recensioni e sentiment', 'Risposte assistite', 'Contenuti da prove reali'],
    walkthrough: [
      { label: 'Home', title: 'Leggi il quadro generale', body: 'Osserva i segnali di fiducia, presenza e attività raccolti nella dashboard.' },
      { label: 'Recensioni', title: 'Apri la voce dei clienti', body: 'Guarda recensioni, fonti, risposte e storico in un unico spazio.' },
      { label: 'AI Agents', title: 'Controlla cosa viene preparato', body: 'Esplora risposte, social proof e contenuti locali generati dai tre agenti.' },
      { label: 'Contenuti', title: 'Segui la prova oltre la recensione', body: 'Verifica come una testimonianza può alimentare contenuti e aggiornamenti.' },
    ],
    searchIntents: ['recensioni per negozi', 'reputazione retail premium', 'presenza locale boutique'],
  },
  {
    id: 'wellness-spa',
    category: 'wellness-spa',
    name: 'Spa e centro benessere',
    shortName: 'Wellness Spa',
    sector: 'Benessere',
    icon: '✦',
    accent: '#a7d3c5',
    accentSoft: '#17302c',
    hero: 'Il benessere finisce. Il ricordo può continuare a lavorare.',
    summary: 'Una demo reale per seguire il percorso dall’appuntamento alla recensione, fino alla risposta e ai contenuti.',
    moment: 'Dopo il trattamento, quando l’esperienza è ancora precisa e personale.',
    friction: 'Il cliente è soddisfatto ma torna alla giornata; la richiesta arriva tardi o non arriva affatto.',
    bio: 'Entra nel pannello demo pensato per spa, beauty e attività su appuntamento.',
    features: ['Richieste post-appuntamento', 'Risposte coerenti col servizio', 'Contenuti wellness locali'],
    walkthrough: [
      { label: 'Home', title: 'Parti dai segnali', body: 'La dashboard riunisce recensioni, andamento e attività del sistema.' },
      { label: 'Campagne', title: 'Guarda come parte la richiesta', body: 'Esplora email, SMS e WhatsApp dimostrativi e il loro stato.' },
      { label: 'Recensioni', title: 'Leggi esperienza e risposta', body: 'Controlla come feedback specifici vengono organizzati e gestiti.' },
      { label: 'AI Agents', title: 'Vedi cosa continua a lavorare', body: 'Apri gli output preparati per risposte, social e presenza locale.' },
    ],
    searchIntents: ['recensioni spa', 'marketing centro benessere', 'recensioni beauty'],
  },
  {
    id: 'sunny-cafe',
    category: 'sunny-cafe',
    name: 'Bar e caffetteria',
    shortName: 'Sunny Café',
    sector: 'Bar e ristorazione',
    icon: '☕',
    accent: '#f3c400',
    accentSoft: '#302908',
    hero: 'Il momento migliore è quando il cliente è ancora al bancone.',
    summary: 'Il tenant più immediato per mostrare recensioni, campagne, risposte e contenuti in un’attività ad alta frequenza.',
    moment: 'Al tavolo, al bancone o subito dopo il pagamento, con QR e NFC.',
    friction: 'Molti clienti abituali sono soddisfatti, ma online la frequenza delle recensioni non lo racconta.',
    bio: 'Guarda dal vivo il sistema Trovatemi per bar, café e ristorazione veloce.',
    features: ['QR e NFC al banco', 'Campagne di richiesta', 'Recensioni trasformate in post'],
    walkthrough: [
      { label: 'Home', title: 'Guarda il contatore', body: 'Apri la dashboard e osserva fiducia, trovabilità e attività recenti.' },
      { label: 'Campagne', title: 'Segui la richiesta', body: 'Vedi come sono strutturati messaggi e promemoria nei canali disponibili.' },
      { label: 'Recensioni', title: 'Apri una recensione', body: 'Controlla fonte, testo, rating e risposta preparata.' },
      { label: 'Contenuti', title: 'Portala oltre Google', body: 'Esplora i post e gli output dimostrativi generati dalla voce dei clienti.' },
    ],
    searchIntents: ['recensioni bar', 'recensioni ristorante', 'QR recensioni Google'],
  },
  {
    id: 'fitness-club',
    category: 'fitness-club',
    name: 'Palestra e fitness club',
    shortName: 'Fitness Club',
    sector: 'Fitness',
    icon: '↗',
    accent: '#ff7b5c',
    accentSoft: '#381c17',
    hero: 'I risultati degli iscritti sono la prova che il prossimo cerca.',
    summary: 'Una demo per capire come una palestra può raccogliere esperienze, rispondere e mantenere viva la presenza locale.',
    moment: 'Dopo una milestone, una lezione, un percorso o un confronto con il trainer.',
    friction: 'Le trasformazioni sono reali ma restano nelle conversazioni, mentre chi confronta le palestre vede poco.',
    bio: 'Prova il pannello Trovatemi per palestra, studio PT e fitness club.',
    features: ['Feedback lungo il percorso', 'Risposte per servizio e trainer', 'Presenza locale continuativa'],
    walkthrough: [
      { label: 'Home', title: 'Leggi il ritmo dell’attività', body: 'Osserva i segnali di fiducia, presenza e andamento nel tenant fitness.' },
      { label: 'Recensioni', title: 'Trova i risultati raccontati', body: 'Apri feedback legati a staff, corsi, struttura ed esperienza.' },
      { label: 'AI Agents', title: 'Guarda gli output', body: 'Esplora risposte e contenuti costruiti dal contesto della recensione.' },
      { label: 'Analytics', title: 'Torna ai dati', body: 'Controlla come le attività del sistema restano leggibili nel tempo.' },
    ],
    searchIntents: ['recensioni palestra', 'marketing fitness club', 'reputazione palestra'],
  },
  {
    id: 'grand-hotel-riviera',
    category: 'grand-hotel-riviera',
    name: 'Hotel e ospitalità',
    shortName: 'Grand Hotel Riviera',
    sector: 'Hospitality',
    icon: '◇',
    accent: '#7f9dff',
    accentSoft: '#1a2344',
    hero: 'Ogni soggiorno produce segnali. Il sistema li tiene insieme.',
    summary: 'Un tenant hospitality completo per esplorare recensioni, campagne, risposte, contenuti e lettura della reputazione.',
    moment: 'Dopo il check-out, ma anche dopo ristorante, spa, evento o servizio concierge.',
    friction: 'L’esperienza ha molti touchpoint, molte piattaforme e responsabilità diverse da coordinare.',
    bio: 'Esplora il pannello Trovatemi per hotel, resort e strutture ricettive.',
    features: ['Più touchpoint e fonti', 'Campagne post-soggiorno', 'Contenuti e analisi della reputazione'],
    walkthrough: [
      { label: 'Home', title: 'Apri la regia', body: 'Parti dalla vista sintetica e dai segnali che riuniscono l’esperienza ospite.' },
      { label: 'Recensioni', title: 'Confronta fonti e temi', body: 'Esplora feedback dimostrativi provenienti da più piattaforme.' },
      { label: 'Campagne', title: 'Segui il post-soggiorno', body: 'Guarda template e canali per la richiesta dopo il check-out.' },
      { label: 'AI Agents', title: 'Trasforma la voce degli ospiti', body: 'Apri risposte, social proof e contenuti locali preparati dal sistema.' },
    ],
    searchIntents: ['recensioni hotel', 'reputazione alberghiera', 'recensioni strutture ricettive'],
  },
];

export const getClimboDemo = (id: string) => climboDemos.find((demo) => demo.id === id);

export const getClimboDemoUrl = (demo: Pick<ClimboDemo, 'category'>) => `${playgroundBase}${encodeURIComponent(demo.category)}`;

export const getDemoEmbedCode = (demo: ClimboDemo) => `<iframe
  src="${getClimboDemoUrl(demo)}"
  title="Demo Trovatemi — ${demo.name}"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
  allow="clipboard-read; clipboard-write; fullscreen"
  style="width:100%;min-height:760px;border:0;border-radius:24px"
></iframe>`;

