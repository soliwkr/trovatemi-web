export const brand = {
  name: 'Trovatemi.it ★',
  logoUrl: 'https://cdn.mylocalbusiness.io/assets/default/logo.png',
  faviconUrl: 'https://cdn.mylocalbusiness.io/assets/default/favicon.png',
  primaryColor: '#000000',
  font: 'Inter',
  borderRadius: 0,
} as const;

export type PricingPlan = {
  id: string;
  name: string;
  source: 'stripe' | 'free';
  maxLocations: number | null;
  amount?: number;
  currency?: string;
  interval?: 'month' | 'year';
  checkoutUrl?: string;
  trial?: { days: number; cardRequired: boolean };
  capabilities: string[];
  recommended?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'prod_UtcM7mhuGf8XZs',
    name: '★ TROVATO',
    source: 'stripe',
    maxLocations: null,
    amount: 100,
    currency: 'EUR',
    interval: 'month',
    checkoutUrl: 'https://buy.stripe.com/6oUdRb3ut4rRa0Idro2kw00',
    capabilities: [
      'Monitoraggio recensioni Google e Facebook',
      'Richieste di recensione automatizzate',
      'Contenuti social per Facebook e Instagram',
      'Presenza Google sempre attiva',
    ],
    recommended: true,
  },
  {
    id: '6a489ecc0d62c86c88b2d3e4',
    name: 'Demo Plan',
    source: 'free',
    maxLocations: 3,
    amount: 0,
    capabilities: [
      'Ambiente dimostrativo fino a 3 sedi',
      'Panoramica completa della piattaforma',
      'Automazioni recensioni e social',
    ],
  },
];

export const benefits = [
  { icon: 'reviews', title: 'Più recensioni', text: 'Un flusso semplice e costante che trasforma ogni esperienza positiva in fiducia visibile.' },
  { icon: 'pin', title: 'Più presenza su Google', text: 'Profili più attivi, segnali locali più chiari e una presenza che lavora ogni giorno.' },
  { icon: 'trust', title: 'Più fiducia', text: 'Risposte puntuali e social proof autentica aiutano le persone a scegliere con sicurezza.' },
  { icon: 'share', title: 'Social proof automatica', text: 'Le recensioni migliori diventano contenuti pronti per Facebook e Instagram.' },
  { icon: 'spark', title: 'Visibilità nella ricerca AI', text: 'I contenuti aiutano motori e assistenti AI a capire meglio cosa fai e dove operi.' },
  { icon: 'flow', title: 'Meno lavoro manuale', text: 'Le attività ripetitive scorrono in automatico, mentre tu continui a gestire il business.' },
] as const;
