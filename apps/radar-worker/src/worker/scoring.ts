import type { PlaceRecord, ProspectResult, ScoreComponent, WebsiteSignals } from "./types.ts";

function clamp(value: number, low = 0, high = 1) {
  return Math.max(low, Math.min(high, value));
}

export function median(values: Array<number | null>): number | null {
  const list = values.filter((value): value is number => Number.isFinite(value)).sort((a, b) => a - b);
  if (!list.length) return null;
  const middle = Math.floor(list.length / 2);
  return list.length % 2 ? list[middle] : (list[middle - 1] + list[middle]) / 2;
}

function component(key: string, label: string, score: number, maxScore: number, reason: string): ScoreComponent {
  return { key, label, score: Math.round(score), maxScore, reason };
}

function reviewGap(place: PlaceRecord, medianReviews: number | null) {
  if (place.reviews === null || !medianReviews) return component("review_gap", "Gap recensioni", 4, 25, "Dati insufficienti per un confronto pulito.");
  const ratio = place.reviews / Math.max(medianReviews, 1);
  const score = 25 * clamp((1 - ratio) / 0.85);
  return component(
    "review_gap",
    "Gap recensioni",
    score,
    25,
    ratio >= 1
      ? `${place.reviews} recensioni: nessun gap rispetto alla mediana locale ${Math.round(medianReviews)}.`
      : `${place.reviews} recensioni vs mediana locale ${Math.round(medianReviews)}.`,
  );
}

function qualityMismatch(place: PlaceRecord) {
  if (place.rating === null) return component("quality_mismatch", "Qualità vs presenza", 4, 20, "Rating non disponibile.");
  const score = 20 * clamp((place.rating - 4.0) / 0.8);
  return component(
    "quality_mismatch",
    "Qualità vs presenza",
    score,
    20,
    place.rating >= 4.4
      ? `Rating ${place.rating.toFixed(1)}: attività abbastanza apprezzata da meritare più prova visibile.`
      : `Rating ${place.rating.toFixed(1)}: qualità pubblica ancora da verificare.`,
  );
}

function activityGap(signals: WebsiteSignals) {
  const foundSocial = Boolean(signals.instagram || signals.facebook);
  return component(
    "activity_gap",
    "Freschezza social",
    foundSocial ? 5 : 3,
    15,
    foundSocial
      ? "Profili social trovati dal sito; la freschezza non è ancora verificata nel Radar v1."
      : "Freschezza social non verificata nel Radar v1.",
  );
}

function contactability(place: PlaceRecord, signals: WebsiteSignals) {
  const channels = {
    telefono: Boolean(place.phone),
    sito: Boolean(place.website),
    email: Boolean(signals.email),
    social: Boolean(signals.instagram || signals.facebook),
  };
  const score = Object.values(channels).filter(Boolean).length * 5;
  const present = Object.entries(channels).filter(([, ok]) => ok).map(([name]) => name);
  return component("contactability", "Contattabilità", score, 20, `Canali trovati: ${present.join(", ") || "nessuno"}.`);
}

function conversionFriction(place: PlaceRecord, signals: WebsiteSignals) {
  let score = 0;
  const reasons: string[] = [];
  if (place.website && !signals.bookingUrl && !signals.whatsapp) {
    score += 5;
    reasons.push("sito presente ma nessun booking/WhatsApp osservato sulla homepage");
  }
  if (place.positionSignal > 3) {
    score += 5;
    reasons.push(`posizione-segnale ${place.positionSignal} nell'insieme Places osservato`);
  }
  if (!reasons.length) reasons.push("nessun attrito forte provato dai dati disponibili");
  return component("conversion_friction", "Attrito di scelta", score, 10, reasons.join("; ") + ".");
}

function evidenceConfidence(place: PlaceRecord, signals: WebsiteSignals) {
  const value = signals.status === "ok" ? 0.92 : place.website ? 0.76 : 0.72;
  return component("evidence_confidence", "Confidenza evidenze", value * 10, 10, `Confidenza ${Math.round(value * 100)}%: Places${signals.status === "ok" ? " + homepage" : ""}.`);
}

function eligible(place: PlaceRecord) {
  if (place.rating !== null && place.rating < 4.0) return { ok: false, reason: "Rating sotto 4.0: non è il prospect ideale Trovatemi." };
  if (!place.phone && !place.website) return { ok: false, reason: "Nessun telefono o sito pubblico: contattabilità insufficiente." };
  return { ok: true, reason: "Attività verificabile e contattabile con qualità pubblica sufficiente." };
}

function band(score: number, ok: boolean): ProspectResult["band"] {
  if (!ok) return "skip";
  if (score >= 85) return "hot";
  if (score >= 70) return "priority";
  if (score >= 55) return "watch";
  return "low";
}

export function scoreProspect(
  place: PlaceRecord,
  signals: WebsiteSignals,
  query: string,
  medianReviews: number | null,
): ProspectResult {
  const components = [
    reviewGap(place, medianReviews),
    qualityMismatch(place),
    activityGap(signals),
    contactability(place, signals),
    conversionFriction(place, signals),
    evidenceConfidence(place, signals),
  ];

  const gate = eligible(place);
  const score = gate.ok ? components.reduce((sum, item) => sum + item.score, 0) : 0;
  const strongest = [...components].sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore)).slice(0, 3);
  const evidence = [
    place.rating !== null ? `Google Places: rating ${place.rating.toFixed(1)}` : null,
    place.reviews !== null ? `Google Places: ${place.reviews} recensioni` : null,
    `Ricerca osservata: posizione-segnale ${place.positionSignal} (non ranking Google assoluto)`,
    place.website ? "Sito pubblico trovato" : null,
    signals.email ? "Email pubblica trovata sulla homepage" : null,
    signals.instagram ? "Instagram collegato dal sito" : null,
    signals.facebook ? "Facebook collegato dal sito" : null,
    signals.whatsapp ? "WhatsApp collegato dalla homepage" : null,
    signals.bookingUrl ? "Percorso booking osservato sulla homepage" : null,
  ].filter((item): item is string => Boolean(item));

  return {
    ...place,
    ...signals,
    sourceConfidence: signals.status === "ok" ? 0.92 : place.website ? 0.76 : 0.72,
    eligible: gate.ok,
    eligibilityReason: gate.reason,
    score,
    band: band(score, gate.ok),
    components,
    evidence,
    checkBrief: {
      headline: "Ti ho cercato come ti cercherebbe un cliente.",
      publicScoreAllowed: false,
      query,
      threeThingsToShow: strongest.map((item) => ({ label: item.label, reason: item.reason })),
      claimRule: "Mostrare solo evidenze osservate. positionSignal non è un ranking Google assoluto.",
    },
  };
}
