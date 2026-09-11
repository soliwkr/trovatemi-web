export type Bindings = {
  GOOGLE_PLACES_API_KEY?: string;
  RADAR_STORE: DurableObjectNamespace;
  APP_ENV?: string;
  RUN_LIMIT?: string;
  ACTIVATION_CHECKOUT_URL?: string;
  ACTIVATION_PRICE_EUR?: string;
  CLIMBO_API_KEY?: string;
  CLIMBO_PLAN_ID?: string;
  PROVISIONING_SECRET?: string;
};

export type PlaceRecord = {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number | null;
  reviews: number | null;
  website: string | null;
  phone: string | null;
  googleMapsUri: string | null;
  positionSignal: number;
};

export type WebsiteSignals = {
  status: "ok" | "missing" | "failed" | "blocked";
  observedAt: string;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  bookingUrl: string | null;
};

export type ScoreComponent = {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  reason: string;
};

export type ProspectResult = PlaceRecord & WebsiteSignals & {
  sourceConfidence: number;
  eligible: boolean;
  eligibilityReason: string;
  score: number;
  band: "hot" | "priority" | "watch" | "low" | "skip";
  components: ScoreComponent[];
  evidence: string[];
  checkBrief: {
    headline: string;
    publicScoreAllowed: false;
    query: string;
    threeThingsToShow: Array<{ label: string; reason: string }>;
    claimRule: string;
  };
};

export type RadarRun = {
  id: string;
  category: string;
  city: string;
  query: string;
  createdAt: string;
  source: "google_places";
  cached?: boolean;
  medianReviews: number | null;
  medianRating: number | null;
  prospects: ProspectResult[];
};

export type PublicCheckJourneyStep = {
  eyebrow: string;
  title: string;
  body: string;
  proof: string | null;
  tone: "good" | "watch" | "neutral";
};

export type PublicCheckAction = {
  title: string;
  body: string;
};

export type PublicCheck = {
  token: string;
  createdAt: string;
  expiresAt: string;
  business: {
    name: string;
    category: string;
    city: string;
    address: string;
    rating: number | null;
    reviews: number | null;
    positionSignal: number;
    googleMapsUri: string | null;
  };
  benchmark: {
    observedBusinesses: number;
    medianReviews: number | null;
    medianRating: number | null;
  };
  signals: {
    websitePresent: boolean;
    socialLinked: boolean;
    directActionPresent: boolean;
  };
  query: string;
  searchCategory: string;
  headline: string;
  journey: PublicCheckJourneyStep[];
  actions: PublicCheckAction[];
  verdict: {
    eyebrow: string;
    title: string;
    body: string;
  };
  evidence: string[];
  claimRule: string;
  offer: {
    label: string;
    priceEur: number;
    note: string;
  };
  cta: {
    label: string;
    href: string;
  };
};

export type CheckStats = {
  views: number;
  ctaClicks: number;
  activationIntents: number;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  lastCtaAt: string | null;
  lastActivationAt: string | null;
};


export type ActivationDraft = {
  token: string;
  businessName: string;
  ownerName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: "intent" | "checkout_ready" | "provisioned";
  providerRef: string | null;
};
