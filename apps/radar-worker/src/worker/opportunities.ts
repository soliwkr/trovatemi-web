import type { Bindings, ProspectResult, RadarRun } from "./types.ts";

export type OpportunityType =
  | "review_acquisition"
  | "contact_friction"
  | "local_visibility"
  | "profile_proof"
  | "monitor";

export type Opportunity = {
  id: string;
  type: OpportunityType;
  title: string;
  severity: "high" | "medium" | "monitor";
  impact: number;
  confidence: number;
  reason: string;
  action: string;
  actionType: "start_review_campaign" | "fix_contact_path" | "improve_local_presence" | "strengthen_proof" | "monitor";
  decisionSource: "rules" | "jev";
};

export type OpportunityDecision = {
  decisionMode: "rules" | "jev";
  business: {
    id: string;
    name: string;
    category: string;
    city: string;
  };
  opportunities: Opportunity[];
};

function clamp(value: number, low = 0, high = 1) {
  return Math.max(low, Math.min(high, value));
}

function reviewOpportunity(run: RadarRun, prospect: ProspectResult): Opportunity | null {
  if (prospect.reviews === null || run.medianReviews === null || run.medianReviews <= 0) return null;
  const ratio = prospect.reviews / run.medianReviews;
  if (ratio >= 0.92) return null;

  const gap = Math.max(0, Math.round(run.medianReviews - prospect.reviews));
  const impact = Math.round(55 + 40 * clamp((0.92 - ratio) / 0.92));
  return {
    id: "review-gap",
    type: "review_acquisition",
    title: "Recensioni: c'è spazio per recuperare",
    severity: ratio < 0.55 ? "high" : "medium",
    impact,
    confidence: 0.94,
    reason: `${prospect.reviews} recensioni contro una mediana osservata di circa ${Math.round(run.medianReviews)}. Il gap è di circa ${gap} recensioni.`,
    action: "Avvia una raccolta recensioni semplice e misurabile.",
    actionType: "start_review_campaign",
    decisionSource: "rules",
  };
}

function contactOpportunity(prospect: ProspectResult): Opportunity | null {
  if (!prospect.website) {
    return {
      id: "contact-path",
      type: "contact_friction",
      title: "Percorso di contatto troppo fragile",
      severity: "high",
      impact: 88,
      confidence: 0.9,
      reason: "Nella ricerca osservata non è stato trovato un sito pubblico collegato all'attività.",
      action: "Crea un percorso diretto e verificabile da ricerca a contatto.",
      actionType: "fix_contact_path",
      decisionSource: "rules",
    };
  }

  if (!prospect.whatsapp && !prospect.bookingUrl) {
    return {
      id: "contact-path",
      type: "contact_friction",
      title: "Il contatto richiede troppi passaggi",
      severity: "medium",
      impact: 68,
      confidence: prospect.status === "ok" ? 0.9 : 0.74,
      reason: "Il sito è presente, ma sulla homepage non abbiamo osservato WhatsApp o un percorso di prenotazione diretto.",
      action: "Riduci il percorso tra interesse e richiesta.",
      actionType: "fix_contact_path",
      decisionSource: "rules",
    };
  }

  return null;
}

function visibilityOpportunity(prospect: ProspectResult): Opportunity | null {
  if (prospect.positionSignal <= 3) return null;
  const impact = Math.min(86, 52 + prospect.positionSignal * 5);
  return {
    id: "local-visibility",
    type: "local_visibility",
    title: "Visibilità locale da osservare",
    severity: prospect.positionSignal >= 6 ? "high" : "medium",
    impact,
    confidence: 0.72,
    reason: `Nell'insieme Places osservato l'attività è comparsa come segnale #${prospect.positionSignal}. Non è un ranking Google assoluto, ma è un segnale da verificare.`,
    action: "Rafforza completezza, prove pubbliche e coerenza locale.",
    actionType: "improve_local_presence",
    decisionSource: "rules",
  };
}

function proofOpportunity(run: RadarRun, prospect: ProspectResult): Opportunity | null {
  if (prospect.rating === null || prospect.rating < 4.4) return null;
  const isUnderMedian = prospect.reviews !== null && run.medianReviews !== null && prospect.reviews < run.medianReviews;
  if (isUnderMedian) return null;

  return {
    id: "proof-strength",
    type: "profile_proof",
    title: "Hai già prova: falla pesare meglio",
    severity: "medium",
    impact: 60,
    confidence: 0.86,
    reason: `Rating osservato ${prospect.rating.toFixed(1)}: la credibilità pubblica c'è già, ma va resa più evidente nel percorso di scelta.`,
    action: "Porta recensioni, servizi e prossimo passo nello stesso percorso.",
    actionType: "strengthen_proof",
    decisionSource: "rules",
  };
}

function fallbackOpportunity(prospect: ProspectResult): Opportunity {
  return {
    id: "monitor",
    type: "monitor",
    title: "Nessuna criticità forte nei segnali base",
    severity: "monitor",
    impact: 28,
    confidence: prospect.sourceConfidence,
    reason: "I segnali osservati non mostrano un gap evidente abbastanza forte da meritare un intervento automatico.",
    action: "Continua a monitorare e raccogli più dati prima di intervenire.",
    actionType: "monitor",
    decisionSource: "rules",
  };
}

export function buildRuleOpportunities(run: RadarRun, prospect: ProspectResult): Opportunity[] {
  const candidates = [
    reviewOpportunity(run, prospect),
    contactOpportunity(prospect),
    visibilityOpportunity(prospect),
    proofOpportunity(run, prospect),
  ].filter((item): item is Opportunity => Boolean(item));

  if (!candidates.length) candidates.push(fallbackOpportunity(prospect));

  return candidates
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3);
}

type JevAnswer = {
  choice?: string;
  score?: number;
  noul?: number;
  confidence?: number;
};

type JevResponse = {
  answers?: Record<string, JevAnswer>;
};

async function applyJevDecision(
  env: Bindings,
  run: RadarRun,
  prospect: ProspectResult,
  opportunities: Opportunity[],
): Promise<Opportunity[]> {
  if (!env.JEV_API_KEY || opportunities.length < 2) return opportunities;

  const criteria = Object.fromEntries(opportunities.map((item) => [
    item.id,
    `${item.title}. Evidence: ${item.reason}. Proposed action: ${item.action}`,
  ]));

  const state = {
    business: {
      name: prospect.name,
      category: prospect.category,
      city: run.city,
      rating: prospect.rating,
      reviews: prospect.reviews,
      observedMedianReviews: run.medianReviews,
      positionSignal: prospect.positionSignal,
      websitePresent: Boolean(prospect.website),
      phonePresent: Boolean(prospect.phone),
      whatsappPresent: Boolean(prospect.whatsapp),
      bookingPresent: Boolean(prospect.bookingUrl),
    },
    candidateOpportunities: opportunities.map((item) => ({
      id: item.id,
      title: item.title,
      evidence: item.reason,
      ruleImpact: item.impact,
    })),
    claimRule: "Use only the observed business data. positionSignal is not an absolute Google ranking.",
  };

  try {
    const response = await fetch("https://jevtypesafeai.com/api/v1/decide", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.JEV_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.JEV_MODEL || "jev-latest",
        state,
        questions: {
          primary_opportunity: {
            type: "choice",
            instructions: "Which candidate opportunity should this local business owner see first if the goal is one concrete, defensible next action?",
            criteria,
          },
          urgency: {
            type: "score",
            instructions: "How urgent is it to act on the primary opportunity?",
            criteria: ["monitor", "useful", "important", "urgent"],
          },
          worth_alerting: {
            type: "noul",
            instructions: "Is the primary opportunity strong enough to alert the business owner now rather than merely monitor it?",
          },
        },
      }),
    });

    if (!response.ok) return opportunities;
    const payload = await response.json() as JevResponse;
    const primary = payload.answers?.primary_opportunity;
    const selectedId = primary?.choice;
    if (!selectedId || !opportunities.some((item) => item.id === selectedId)) return opportunities;

    const confidence = typeof primary.confidence === "number"
      ? clamp(primary.confidence)
      : opportunities.find((item) => item.id === selectedId)?.confidence ?? 0.7;

    return opportunities
      .map((item) => item.id === selectedId
        ? { ...item, confidence, decisionSource: "jev" as const }
        : item)
      .sort((a, b) => {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        return b.impact - a.impact;
      });
  } catch (error) {
    console.warn(JSON.stringify({
      event: "opportunity.jev.fallback",
      businessId: prospect.id,
      message: error instanceof Error ? error.message : "unknown",
    }));
    return opportunities;
  }
}

export async function decideOpportunities(
  env: Bindings,
  run: RadarRun,
  prospect: ProspectResult,
): Promise<OpportunityDecision> {
  const rules = buildRuleOpportunities(run, prospect);
  const decided = await applyJevDecision(env, run, prospect, rules);
  return {
    decisionMode: decided.some((item) => item.decisionSource === "jev") ? "jev" : "rules",
    business: {
      id: prospect.id,
      name: prospect.name,
      category: prospect.category,
      city: run.city,
    },
    opportunities: decided,
  };
}
