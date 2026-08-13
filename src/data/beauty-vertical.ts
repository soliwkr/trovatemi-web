export type BeautyVerticalKind = 'hair' | 'barber' | 'beauty' | 'nails' | 'massage' | 'wellness';

export const beautyVerticalLabels: Record<BeautyVerticalKind, { place: string; service: string }> = {
  hair: { place: 'salone', service: 'taglio, colore o piega' },
  barber: { place: 'barber shop', service: 'taglio o barba' },
  beauty: { place: 'centro estetico', service: 'trattamento estetico' },
  nails: { place: 'studio', service: 'servizio nails o lashes' },
  massage: { place: 'studio massaggi', service: 'massaggio o trattamento' },
  wellness: { place: 'centro benessere', service: 'trattamento o percorso wellness' },
};

export const beautyVerticalScope = [
  'parrucchieri e hair salon',
  'barber shop',
  'centri estetici',
  'nail, lashes e brows',
  'massaggiatrici e studi massaggi',
  'spa e centri benessere',
  'specialisti beauty su appuntamento',
] as const;
