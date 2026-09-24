export type PilotPreview = {
  token: string;
  reference: string;
  status: 'ready';
  observedAt: string;
  business: {
    name: string;
    category: string;
    city: string;
    address: string;
    rating?: number;
    reviewCount?: number;
  };
  diagnosis: {
    headline: string;
    evidence: string[];
    priorities: string[];
  };
  after: {
    promise: string;
    services: string[];
  };
  activationPath: string;
};

export type PilotPreviewResolution =
  | { status: 'found'; preview: PilotPreview }
  | { status: 'not_found' }
  | { status: 'configuration_error' };

export type CheckoutResolution =
  | { status: 'ready'; url: string }
  | { status: 'unconfigured' }
  | { status: 'configuration_error' };

export type FounderOffer = {
  name: string;
  priceCents: number;
  formattedPrice: string;
  currency: 'EUR';
  durationDays: number;
  capacity: number;
  taxLabel: string;
  renewalLabel: string;
  day91: string;
  refundPolicy: string;
  seller: {
    legalName: string;
    vatId: string;
  };
  termsUrl: string;
  privacyUrl: string;
};

export type FounderOfferResolution =
  | { status: 'ready'; offer: FounderOffer }
  | { status: 'unconfigured' }
  | { status: 'configuration_error' };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFinalizedString(value: unknown): value is string {
  return isNonEmptyString(value) && !/(?:sostituire|replace(?:-|_|\s)?me)/i.test(value);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function isPilotPreview(value: unknown): value is Omit<PilotPreview, 'activationPath'> {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Record<string, unknown>;
  const business = candidate.business as Record<string, unknown> | undefined;
  const diagnosis = candidate.diagnosis as Record<string, unknown> | undefined;
  const after = candidate.after as Record<string, unknown> | undefined;

  return (
    isNonEmptyString(candidate.token)
    && isNonEmptyString(candidate.reference)
    && candidate.status === 'ready'
    && isNonEmptyString(candidate.observedAt)
    && !Number.isNaN(Date.parse(candidate.observedAt))
    && !!business
    && isNonEmptyString(business.name)
    && isNonEmptyString(business.category)
    && isNonEmptyString(business.city)
    && isNonEmptyString(business.address)
    && !!diagnosis
    && isNonEmptyString(diagnosis.headline)
    && isStringList(diagnosis.evidence)
    && isStringList(diagnosis.priorities)
    && !!after
    && isNonEmptyString(after.promise)
    && isStringList(after.services)
  );
}

function isHttpsUrl(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function resolvePilotPreview(
  serializedCatalog: string | undefined,
  token: string,
): PilotPreviewResolution {
  if (!serializedCatalog) return { status: 'not_found' };

  let previews: unknown;

  try {
    previews = JSON.parse(serializedCatalog);
  } catch {
    return { status: 'configuration_error' };
  }

  if (!Array.isArray(previews)) return { status: 'configuration_error' };

  const preview = previews.find((candidate) => (
    !!candidate
    && typeof candidate === 'object'
    && (candidate as Record<string, unknown>).status === 'ready'
    && (candidate as Record<string, unknown>).token === token
  ));

  if (!preview) return { status: 'not_found' };
  if (!isPilotPreview(preview)) return { status: 'configuration_error' };

  return {
    status: 'found',
    preview: {
      ...preview,
      activationPath: `/attiva/${encodeURIComponent(token)}`,
    },
  };
}

export function buildCheckoutUrl(
  checkoutBaseUrl: string | undefined,
  pilotReference: string,
): CheckoutResolution {
  if (!checkoutBaseUrl) return { status: 'unconfigured' };

  try {
    if (!isFinalizedString(checkoutBaseUrl)) return { status: 'configuration_error' };

    const checkoutUrl = new URL(checkoutBaseUrl);
    if (checkoutUrl.protocol !== 'https:' || checkoutUrl.hostname !== 'buy.stripe.com') {
      return { status: 'configuration_error' };
    }
    checkoutUrl.searchParams.set('client_reference_id', pilotReference);
    return { status: 'ready', url: checkoutUrl.toString() };
  } catch {
    return { status: 'configuration_error' };
  }
}

export function resolveFounderOffer(
  serializedOffer: string | undefined,
): FounderOfferResolution {
  if (!serializedOffer) return { status: 'unconfigured' };

  let value: unknown;
  try {
    value = JSON.parse(serializedOffer);
  } catch {
    return { status: 'configuration_error' };
  }

  if (!value || typeof value !== 'object') return { status: 'configuration_error' };

  const candidate = value as Record<string, unknown>;
  const seller = candidate.seller as Record<string, unknown> | undefined;
  const isComplete = (
    isFinalizedString(candidate.name)
    && Number.isInteger(candidate.priceCents)
    && (candidate.priceCents as number) > 0
    && candidate.currency === 'EUR'
    && Number.isInteger(candidate.durationDays)
    && (candidate.durationDays as number) > 0
    && Number.isInteger(candidate.capacity)
    && (candidate.capacity as number) > 0
    && isFinalizedString(candidate.taxLabel)
    && isFinalizedString(candidate.renewalLabel)
    && isFinalizedString(candidate.day91)
    && isFinalizedString(candidate.refundPolicy)
    && !!seller
    && isFinalizedString(seller.legalName)
    && isFinalizedString(seller.vatId)
    && isHttpsUrl(candidate.termsUrl)
    && isHttpsUrl(candidate.privacyUrl)
  );

  if (!isComplete) return { status: 'configuration_error' };

  const offer = candidate as Omit<FounderOffer, 'formattedPrice'>;
  return {
    status: 'ready',
    offer: {
      ...offer,
      formattedPrice: new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: offer.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(offer.priceCents / 100),
    },
  };
}
