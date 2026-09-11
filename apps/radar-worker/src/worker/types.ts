export type Bindings = {
  GOOGLE_PLACES_API_KEY?: string;
  RADAR_STORE: DurableObjectNamespace;
  APP_ENV?: string;
  RUN_LIMIT?: string;
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
  query: string;
  headline: string;
  threeThingsToShow: Array<{ label: string; reason: string }>;
  evidence: string[];
  claimRule: string;
  cta: {
    label: string;
    href: string;
  };
};
