import type { ProspectResult, RadarRun, PublicCheck } from "./types.ts";

export function createShareToken(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

export function buildPublicCheck(run: RadarRun, prospect: ProspectResult, token: string): PublicCheck {
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
    query: run.query,
    headline: prospect.checkBrief.headline,
    threeThingsToShow: prospect.checkBrief.threeThingsToShow,
    evidence: prospect.evidence.filter((item) =>
      item.startsWith("Google Places:") ||
      item.startsWith("Ricerca osservata:") ||
      item === "Sito pubblico trovato" ||
      item === "Instagram collegato dal sito" ||
      item === "Facebook collegato dal sito" ||
      item === "WhatsApp collegato dalla homepage" ||
      item === "Percorso booking osservato sulla homepage"
    ),
    claimRule: prospect.checkBrief.claimRule,
    cta: {
      label: "Voglio sistemarlo",
      href: "https://www.instagram.com/trovatemi.it/",
    },
  };
}

export function buildOutreachMessage(check: PublicCheck, shareUrl: string): string {
  return [
    `Ciao, ho cercato ${check.business.name} come farebbe una persona che cerca ${check.business.category.toLowerCase()} a ${check.business.city}.`,
    "Ho trovato 3 cose abbastanza evidenti prima ancora di arrivare alla scelta.",
    `Te le ho messe qui: ${shareUrl}`,
  ].join(" ");
}
