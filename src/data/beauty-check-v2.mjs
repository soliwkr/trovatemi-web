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
    shortLabel: 'RICHIESTA RECENSIONE',
    headline: 'Il primo punto debole è la raccolta.',
    why: (answers, volume) => `Hai indicato che ${answerSentences.reviewAsk[answers.reviewAsk] ?? 'la richiesta recensione non è ancora stabile'}. Con ${volume.label}, il problema principale non è il numero di clienti: è la continuità con cui la soddisfazione diventa una recensione pubblica.`,
    actions: [
      'Rendi la richiesta recensione un passaggio stabile del servizio.',
      'Usa un metodo semplice e ripetibile — link, QR o NFC — che non dipenda dalla memoria del singolo.',
      'Verifica ogni settimana quante richieste vengono fatte e quante recensioni vengono effettivamente pubblicate.',
    ],
  },
  reply_leak: {
    shortLabel: 'RISPOSTE',
    headline: 'Le recensioni arrivano, ma la gestione si interrompe dopo.',
    why: (answers) => `La raccolta è più solida, ma hai indicato che ${answerSentences.replies[answers.replies] ?? 'le risposte non sono ancora costanti'}. La prova pubblica esiste; ciò che manca è una gestione regolare dopo la pubblicazione.`,
    actions: [
      'Porta le risposte alle recensioni dentro una routine definita.',
      'Definisci un tono e una struttura di risposta coerenti, così da non ricominciare ogni volta da zero.',
      'Individua le recensioni più utili e stabilisci dove riutilizzarle dopo la risposta.',
    ],
  },
  reuse_leak: {
    shortLabel: 'RIUSO DELLA PROVA',
    headline: 'La prova esiste, ma resta ferma.',
    why: (answers) => `Hai indicato che ${answerSentences.reuse[answers.reuse] ?? 'le recensioni vengono riutilizzate poco'}. La prova è già stata raccolta; il punto debole è quanto poco viene rimessa davanti a nuovi potenziali clienti.`,
    actions: [
      'Seleziona le recensioni più utili e trasformale in materiale riutilizzabile.',
      'Definisci pochi formati standard per riutilizzarle senza dover riprogettare ogni contenuto.',
      'Fai lavorare la stessa recensione più di una volta, mantenendo una revisione umana prima della pubblicazione.',
    ],
  },
  distribution_leak: {
    shortLabel: 'VISIBILITÀ DELLA PROVA',
    headline: 'La prova viene raccolta, ma circola poco.',
    why: (answers) => `Raccolta e riuso sono più solidi, ma hai indicato che ${answerSentences.channels[answers.channels] ?? 'la visibilità della prova è ancora limitata'}. Il limite principale è quante volte e in quanti punti quella prova torna visibile.`,
    actions: [
      'Scegli solo i canali che usi davvero e assegna a ciascuno una cadenza sostenibile.',
      'Riusa la stessa prova in più formati invece di creare nuovi contenuti da zero ogni volta.',
      'Mantieni coerenti punto vendita, profilo Google e altri canali in cui mostri la prova dei clienti.',
    ],
  },
  healthy_no_dominant_leak: {
    shortLabel: 'CONTINUITÀ',
    headline: 'Non emerge un punto debole dominante.',
    why: () => 'Dalle cinque risposte non emerge un singolo punto di rottura dominante. La priorità è mantenere continuità tra richiesta recensioni, risposte e riuso della prova.',
    actions: [
      'Mantieni la richiesta recensione come passaggio stabile del servizio.',
      'Controlla periodicamente che risposte e riuso della prova non stiano diventando irregolari.',
      'Misura la continuità prima di aggiungere nuovi canali, formati o automazioni.',
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

function buildEvidence(business) {
  const reviews = Number.isInteger(business?.reviews) ? business.reviews : null;
  const cohortMedianReviews = Number.isInteger(business?.cohortMedianReviews)
    ? business.cohortMedianReviews
    : null;
  const reviewGap = reviews !== null && cohortMedianReviews !== null
    ? reviews - cohortMedianReviews
    : null;

  let note = 'Mostriamo soltanto i dati pubblici disponibili, senza trasformarli in un voto sulla qualità.';

  if (reviewGap !== null && reviewGap < 0) {
    note = `Online oggi si vede meno prova rispetto alla mediana demo del gruppo comparabile: ${Math.abs(reviewGap)} recensioni di differenza.`;
  } else if (reviewGap !== null) {
    note = 'Online oggi la tua attività è sopra la mediana demo del gruppo comparabile per numero di recensioni.';
  } else if (reviews !== null) {
    note = `${reviews} recensioni sono visibili oggi. Non aggiungiamo confronti statistici finché non esiste un gruppo comparabile metodologicamente valido.`;
  }

  return {
    reviews,
    cohortMedianReviews,
    reviewGap,
    note,
  };
}

export function buildPassaparolaDiagnosis(business, answers) {
  const code = chooseDiagnosis(answers);
  const copy = diagnosisCopy[code];
  const volume = weeklyVolume[answers.weeklyClients] ?? weeklyVolume.low;

  return {
    version: diagnosisVersion,
    code,
    shortLabel: copy.shortLabel,
    headline: copy.headline,
    why: copy.why(answers, volume),
    actions: [...copy.actions],
    answerSummary: answerSummary(answers),
    weeklyVolumeLabel: volume.label,
    evidence: buildEvidence(business),
  };
}
