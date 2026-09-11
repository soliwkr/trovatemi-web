import type {
  ProspectResult,
  PublicCheck,
  PublicCheckAction,
  PublicCheckJourneyStep,
  RadarRun,
} from "./types.ts";

export function createShareToken(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

function directActionLabel(category: string): string {
  const value = category.toLowerCase();
  if (/(parruc|salon|beauty|estet|barber)/.test(value)) return "prenotazione";
  if (/(officina|gomm|carroz|serrament|infiss|impiant|idraul|elettric)/.test(value)) return "preventivo o contatto";
  return "contatto";
}

function buildJourney(run: RadarRun, prospect: ProspectResult): PublicCheckJourneyStep[] {
  const ratingProof = prospect.rating === null
    ? null
    : `${prospect.rating.toFixed(1)} ★${prospect.reviews === null ? "" : ` · ${prospect.reviews} recensioni`}`;

  const searchBody = prospect.rating !== null && prospect.rating >= 4.4
    ? "Il primo segnale è buono: chi ti ha già scelto sembra apprezzarti. Quindi il problema non parte dalla qualità percepita del servizio."
    : "Ci sono segnali sufficienti per prenderti sul serio, ma un cliente nuovo deve ancora capire velocemente perché scegliere te.";

  let compareBody = "Ti confronto con le altre attività che compaiono nella stessa ricerca.";
  if (prospect.reviews !== null && run.medianReviews !== null) {
    if (prospect.reviews < run.medianReviews) {
      compareBody = `Nella ricerca osservata, le attività hanno una mediana di circa ${Math.round(run.medianReviews)} recensioni. Tu ne hai ${prospect.reviews}. Non dice chi lavora meglio: dice chi, a colpo d'occhio, sembra più scelto.`;
    } else {
      compareBody = `Sul numero di recensioni sei già almeno in linea con la mediana osservata di circa ${Math.round(run.medianReviews)}. Qui il punto non è raccogliere numeri a caso: è rendere più evidente il motivo per cui sceglierti.`;
    }
  }

  const earlier = Math.max(0, prospect.positionSignal - 1);
  const compareProof = earlier > 0
    ? `Prima di arrivare a te, in questa specifica ricerca osservata, ho incontrato ${earlier} attività.`
    : "Sei comparso molto presto nella specifica ricerca osservata.";

  const action = directActionLabel(run.category);
  let contactBody: string;
  if (!prospect.website) {
    contactBody = `Quando decido di approfondire, non ho trovato un sito collegato. Per un cliente nuovo significa avere meno spazio per capire servizi, prove e prossimo passo.`;
  } else if (!prospect.whatsapp && !prospect.bookingUrl) {
    contactBody = `Il sito c'è. Però sulla homepage non ho trovato un percorso immediato per ${action}. Io cliente devo ancora capire da solo cosa fare dopo.`;
  } else {
    contactBody = `Quando decido di muovermi, trovo già un percorso diretto per ${action}. Questo è un buon segnale: qui lavorerei soprattutto per renderlo ancora più evidente.`;
  }

  return [
    {
      eyebrow: "01 · TI CERCO",
      title: "TI TROVO.",
      body: searchBody,
      proof: ratingProof,
      tone: prospect.rating !== null && prospect.rating >= 4.4 ? "good" : "neutral",
    },
    {
      eyebrow: "02 · TI CONFRONTO",
      title: "POI GUARDO GLI ALTRI.",
      body: compareBody,
      proof: compareProof,
      tone: prospect.reviews !== null && run.medianReviews !== null && prospect.reviews < run.medianReviews ? "watch" : "neutral",
    },
    {
      eyebrow: "03 · PROVO A MUOVERMI",
      title: "ADESSO VOGLIO CONTATTARTI.",
      body: contactBody,
      proof: prospect.website ? "Sito pubblico trovato." : "Nessun sito pubblico collegato osservato.",
      tone: prospect.website && (prospect.whatsapp || prospect.bookingUrl) ? "good" : "watch",
    },
  ];
}

function buildActions(run: RadarRun, prospect: ProspectResult): PublicCheckAction[] {
  const actions: PublicCheckAction[] = [];
  const reviewGap = prospect.reviews !== null && run.medianReviews !== null && prospect.reviews < run.medianReviews;

  actions.push(reviewGap
    ? {
        title: "Farei vedere più clienti felici.",
        body: "Non recensioni comprate e non trucchi: metterei in funzione un sistema semplice perché più esperienze reali diventino prova pubblica.",
      }
    : {
        title: "Userei meglio la prova che hai già.",
        body: "Hai già una base di fiducia. La renderei più visibile nel momento esatto in cui un nuovo cliente sta decidendo.",
      });

  actions.push(prospect.website
    ? {
        title: "Renderei il primo impatto più forte.",
        body: "Chi arriva deve capire in pochi secondi cosa fai, perché fidarsi e qual è il prossimo passo. Senza dover interpretare.",
      }
    : {
        title: "Darei al cliente una destinazione chiara.",
        body: "Una pagina semplice, credibile e utile: servizi, prove, zona servita e un prossimo passo evidente.",
      });

  const action = directActionLabel(run.category);
  actions.push(prospect.whatsapp || prospect.bookingUrl
    ? {
        title: "Metterei il prossimo passo davanti agli occhi.",
        body: `Il percorso per ${action} esiste già. Lo renderei impossibile da non vedere.`,
      }
    : {
        title: "Toglierei attrito al contatto.",
        body: `Quando uno decide di sentirti, il percorso per ${action} deve richiedere un gesto. Non una ricerca.`,
      });

  return actions;
}

export function buildPublicCheck(
  run: RadarRun,
  prospect: ProspectResult,
  token: string,
  priceEur = 197,
): PublicCheck {
  const strongQuality = prospect.rating !== null && prospect.rating >= 4.4;
  const verdictTitle = strongQuality ? "SEI MEGLIO DI COME APPARI." : "PUOI ESSERE PIÙ FACILE DA SCEGLIERE.";
  const verdictBody = strongQuality
    ? "I segnali che ho trovato fanno pensare a un'attività valida. Il lavoro non è inventare una reputazione: è fare in modo che un cliente nuovo la capisca prima."
    : "Non serve aggiungere marketing a caso. Serve rendere più chiari i segnali che aiutano una persona a fidarsi, scegliere e contattarti.";

  return {
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    business: {
      name: prospect.name,
      category: prospect.category,
      city: run.city,
      address: prospect.address,
      rating: prospect.rating,
      reviews: prospect.reviews,
      positionSignal: prospect.positionSignal,
      googleMapsUri: prospect.googleMapsUri,
    },
    benchmark: {
      observedBusinesses: run.prospects.length,
      medianReviews: run.medianReviews,
      medianRating: run.medianRating,
    },
    signals: {
      websitePresent: Boolean(prospect.website),
      socialLinked: Boolean(prospect.instagram || prospect.facebook),
      directActionPresent: Boolean(prospect.whatsapp || prospect.bookingUrl),
    },
    query: run.query,
    searchCategory: run.category,
    headline: "Ti ho cercato come ti cercherebbe un cliente.",
    journey: buildJourney(run, prospect),
    actions: buildActions(run, prospect),
    verdict: {
      eyebrow: "QUELLO CHE PENSO DOPO AVERTI CERCATO",
      title: verdictTitle,
      body: verdictBody,
    },
    evidence: prospect.evidence.filter((item) =>
      item.startsWith("Google Places:") ||
      item.startsWith("Ricerca osservata:") ||
      item === "Sito pubblico trovato" ||
      item === "Instagram collegato dal sito" ||
      item === "Facebook collegato dal sito" ||
      item === "WhatsApp collegato dalla homepage" ||
      item === "Percorso booking osservato sulla homepage"
    ),
    claimRule: "Questa è una fotografia di una ricerca osservata, non una dichiarazione di ranking Google assoluto.",
    offer: {
      label: "Attivazione Trovatemi",
      priceEur,
      note: "Una tantum. Eventuali servizi ricorrenti sono separati e non partono automaticamente.",
    },
    cta: {
      label: "Sistemamelo",
      href: `/go/${token}`,
    },
  };
}

export function buildOutreachMessage(check: PublicCheck, shareUrl: string): string {
  return [
    `Ciao, ho cercato ${check.business.name} come farebbe una persona che cerca ${check.searchCategory.toLowerCase()} a ${check.business.city}.`,
    "La cosa interessante è che online sembri meno forte di quello che i tuoi segnali fanno pensare.",
    `Ti ho fatto vedere il percorso in un minuto: ${shareUrl}`,
  ].join(" ");
}
