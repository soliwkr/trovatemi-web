import { auditQuestions, demoBusinesses } from './beauty-lean-demo.mjs';

export { auditQuestions, demoBusinesses };

export const diagnosisVersion = 'passaparola-v2';

const weeklyVolume = {
  low: { label: 'fino a 20 clienti a settimana', boost: 0 },
  medium: { label: '21–50 clienti a settimana', boost: 1 },
  high: { label: '51–100 clienti a settimana', boost: 2 },
  veryHigh: { label: 'più di 100 clienti a settimana', boost: 2 },
};

const collectionSeverity = { never: 4, sometimes: 3, physical: 2, systematic: 0 };
const replySeverity = { never: 4, sometimes: 2, always: 0, automated: 0 };
const reuseSeverity = { nothing: 4, reshare: 2, manual: 1, automatic: 0 };
const distributionSeverity = { none: 4, one: 2, two: 1, many: 0 };

const answerSentences = {
  reviewAsk: {
    never: 'non chiedi quasi mai una recensione',
    sometimes: 'chiedi una recensione solo ogni tanto',
    physical: 'hai già un QR o NFC, ma il passaggio dipende ancora dal momento',
    systematic: 'la richiesta recensione fa già parte del servizio',
  },
  replies: {
    never: 'le recensioni restano senza risposta',
    sometimes: 'rispondi quando trovi tempo',
    always: 'rispondi quasi sempre',
    automated: 'hai già un sistema che gestisce le risposte',
  },
  reuse: {
    nothing: 'le recensioni migliori restano quasi sempre su Google',
    reshare: 'ricondividi qualche recensione ogni tanto',
    manual: 'trasformi qualche recensione in contenuto a mano',
    automatic: 'hai già un processo che riutilizza le recensioni',
  },
  channels: {
    none: 'non fai vedere le recensioni con costanza su altri canali',
    one: 'le fai vedere con continuità su un solo canale',
    two: 'le distribuisci su due canali',
    many: 'le distribuisci già su più canali',
  },
};

const diagnosisCopy = {
  collection_leak: {
    shortLabel: "ALL'USCITA",
    headline: "Si perde all'uscita.",
    why: (answers, volume) => `Mi hai detto che ${answerSentences.reviewAsk[answers.reviewAsk] ?? 'la richiesta recensione non è ancora stabile'}. Con ${volume.label}, la materia prima non manca: è il passaggio cliente contento → richiesta che oggi si interrompe per primo.`,
    actions: [
      'Rendi la richiesta recensione un passaggio fisso subito dopo il servizio.',
      'Usa un gesto semplice e ripetibile — link, QR o NFC — senza dipendere dalla memoria.',
      'Controlla ogni settimana quante richieste partono e quante recensioni arrivano davvero.',
    ],
  },
  reply_leak: {
    shortLabel: 'DOPO GOOGLE',
    headline: 'Arriva su Google. Poi si ferma lì.',
    why: (answers) => `La raccolta regge meglio, ma mi hai detto che ${answerSentences.replies[answers.replies] ?? 'le risposte non sono ancora costanti'}. La prova pubblica esiste: manca il secondo passaggio che la tiene viva e curata.`,
    actions: [
      'Porta le risposte alle recensioni dentro una routine, non nel tempo che avanza.',
      'Definisci un tono semplice e coerente per rispondere senza ricominciare ogni volta.',
      'Dopo la risposta, scegli le recensioni migliori da far riapparire altrove.',
    ],
  },
  reuse_leak: {
    shortLabel: 'NEL PROFILO',
    headline: 'La recensione c’è. Poi sparisce nel profilo.',
    why: (answers) => `Mi hai detto che ${answerSentences.reuse[answers.reuse] ?? 'le recensioni vengono riutilizzate poco'}. Hai già raccolto una prova vera: il problema è che quasi nessuno la vede una seconda volta.`,
    actions: [
      'Scegli le recensioni migliori e trasformale in materiale riutilizzabile.',
      'Crea un formato fisso per farle diventare post, story o prova sul punto vendita.',
      'Fai lavorare la stessa recensione più di una volta, senza riscrivere tutto a mano.',
    ],
  },
  distribution_leak: {
    shortLabel: 'NEL GIRO',
    headline: 'La prova esiste. La vede troppo poca gente.',
    why: (answers) => `La recensione viene raccolta e riutilizzata meglio, ma mi hai detto che ${answerSentences.channels[answers.channels] ?? 'la distribuzione è ancora stretta'}. Il passaparola non si perde alla nascita: si ferma perché gira poco.`,
    actions: [
      'Scegli i canali che usi davvero e pubblica con una cadenza semplice.',
      'Riusa la stessa prova in più formati invece di inventare contenuti nuovi ogni volta.',
      'Collega contenuto, punto vendita e profilo Google allo stesso racconto.',
    ],
  },
  healthy_no_dominant_leak: {
    shortLabel: 'NESSUN BUCO NETTO',
    headline: 'Il sistema tiene. Adesso conta la costanza.',
    why: () => 'Non emerge un punto di rottura dominante dalle cinque risposte. Il lavoro adesso è mantenere raccolta, risposte e riuso abbastanza costanti da non tornare a dipendere dalla memoria.',
    actions: [
      'Mantieni la richiesta recensione come passaggio fisso del servizio.',
      'Controlla una volta al mese che risposte e riuso non stiano rallentando.',
      'Misura la continuità prima di aggiungere nuovi canali o nuove automazioni.',
    ],
  },
};

function chooseDiagnosis(answers) {
  const volume = weeklyVolume[answers.weeklyClients] ?? weeklyVolume.low;
  const collectionBase = collectionSeverity[answers.reviewAsk] ?? 0;
  const collectionRisk = collectionBase === 0 ? 0 : collectionBase + volume.boost;
  const ranked = [
    ['collection_leak', collectionRisk],
    ['reply_leak', replySeverity[answers.replies] ?? 0],
    ['reuse_leak', reuseSeverity[answers.reuse] ?? 0],
    ['distribution_leak', distributionSeverity[answers.channels] ?? 0],
  ].sort((a, b) => b[1] - a[1]);

  return ranked[0][1] <= 1 ? 'healthy_no_dominant_leak' : ranked[0][0];
}

function answerSummary(answers) {
  return [
    answerSentences.reviewAsk[answers.reviewAsk],
    answerSentences.replies[answers.replies],
    answerSentences.reuse[answers.reuse],
    answerSentences.channels[answers.channels],
  ].filter(Boolean).join(', ');
}

export function buildPassaparolaDiagnosis(business, answers) {
  const code = chooseDiagnosis(answers);
  const copy = diagnosisCopy[code];
  const volume = weeklyVolume[answers.weeklyClients] ?? weeklyVolume.low;
  const reviewGap = business.reviews - business.cohortMedianReviews;

  return {
    version: diagnosisVersion,
    code,
    shortLabel: copy.shortLabel,
    headline: copy.headline,
    why: copy.why(answers, volume),
    actions: [...copy.actions],
    answerSummary: answerSummary(answers),
    weeklyVolumeLabel: volume.label,
    evidence: {
      reviews: business.reviews,
      cohortMedianReviews: business.cohortMedianReviews,
      reviewGap,
      note: reviewGap < 0
        ? `Online oggi si vede meno prova rispetto alla mediana demo del gruppo comparabile: ${Math.abs(reviewGap)} recensioni di differenza.`
        : `Online oggi la tua attività è sopra la mediana demo del gruppo comparabile per numero di recensioni.`,
    },
  };
}
