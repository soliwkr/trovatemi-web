import { demoBusinesses, diagnosticQuestions } from './beauty-lean-demo.mjs';

export { demoBusinesses, diagnosticQuestions };

export const diagnosisVersion = 'passaparola-v3';

const collectionSeverity = { never: 4, sometimes: 3, physical: 2, systematic: 0 };
const replySeverity = { never: 4, sometimes: 2, always: 0, structured: 0 };
const reuseSeverity = { nothing: 4, reshare: 2, manual: 1, systematic: 0 };

const answerSentences = {
  reviewAsk: {
    never: 'la richiesta recensione non fa ancora parte del lavoro quotidiano',
    sometimes: 'la richiesta recensione dipende ancora dal momento',
    physical: 'hai già QR o NFC, ma il passaggio dipende ancora da chi lo propone',
    systematic: 'la richiesta recensione fa già parte del processo',
  },
  replies: {
    never: 'molte recensioni restano senza risposta',
    sometimes: 'le risposte dipendono dal tempo disponibile',
    always: 'rispondi quasi sempre',
    structured: 'hai già un processo strutturato per rispondere',
  },
  reuse: {
    nothing: 'le recensioni forti restano quasi sempre su Google',
    reshare: 'qualche recensione viene ricondivisa ogni tanto',
    manual: 'trasformi manualmente alcune recensioni in contenuto',
    systematic: 'hai già un processo di riuso della prova',
  },
};

const diagnosisCopy = {
  collection_leak: {
    shortLabel: 'SI FERMA ALL’USCITA',
    headline: 'Il tuo passaparola si ferma all’uscita.',
    why: (answers) => 'Hai indicato che ' + (answerSentences.reviewAsk[answers.reviewAsk] ?? 'la richiesta recensione non è ancora stabile') + '. Il primo punto da correggere è il passaggio cliente soddisfatto → recensione pubblica.',
    actions: [
      'Metti la richiesta recensione nel momento esatto in cui il cliente è più soddisfatto.',
      'Usa un gesto semplice e ripetibile — QR, NFC o link — che non dipenda dalla memoria.',
      'Controlla ogni settimana quante richieste vengono fatte e quante recensioni arrivano davvero.',
    ],
  },
  reply_leak: {
    shortLabel: 'SI FERMA SU GOOGLE',
    headline: 'Le recensioni arrivano. Poi smettono di lavorare.',
    why: (answers) => 'La raccolta è più solida, ma ' + (answerSentences.replies[answers.replies] ?? 'le risposte non sono ancora costanti') + '. La prova esiste: manca il passaggio che la rende curata, credibile e riutilizzabile.',
    actions: [
      'Porta le risposte dentro una routine definita.',
      'Definisci un tono semplice e coerente, così ogni recensione non riparte da zero.',
      'Dopo la risposta, seleziona le recensioni più forti da far riapparire altrove.',
    ],
  },
  reuse_leak: {
    shortLabel: 'LA PROVA RESTA FERMA',
    headline: 'Hai prove. Le vede troppo poca gente.',
    why: (answers) => 'Raccolta e risposta sono più solide, ma ' + (answerSentences.reuse[answers.reuse] ?? 'la prova viene riutilizzata poco') + '. Il problema non è creare altro contenuto: è far lavorare meglio quello che i clienti hanno già detto.',
    actions: [
      'Seleziona le recensioni che raccontano meglio il valore del tuo lavoro.',
      'Trasformale in pochi formati riutilizzabili per i canali che usi davvero.',
      'Fai lavorare la stessa prova più di una volta, mantenendo una revisione umana prima della pubblicazione.',
    ],
  },
  healthy_no_dominant_leak: {
    shortLabel: 'IL CIRCUITO REGGE',
    headline: 'Il sistema regge. Adesso conta la costanza.',
    why: () => 'Dalle tre risposte non emerge un punto di rottura dominante. La priorità è mantenere continuità tra richiesta, risposta e riuso della prova.',
    actions: [
      'Mantieni la richiesta recensione come passaggio stabile del servizio.',
      'Controlla periodicamente che le risposte non diventino irregolari.',
      'Misura il riuso della prova prima di aggiungere nuovi canali o automazioni.',
    ],
  },
};

function chooseDiagnosis(answers) {
  const ranked = [
    ['collection_leak', collectionSeverity[answers.reviewAsk] ?? 0],
    ['reply_leak', replySeverity[answers.replies] ?? 0],
    ['reuse_leak', reuseSeverity[answers.reuse] ?? 0],
  ].sort((a, b) => b[1] - a[1]);

  return ranked[0][1] <= 1 ? 'healthy_no_dominant_leak' : ranked[0][0];
}

function buildEvidence(business) {
  const reviews = Number.isInteger(business?.reviews) ? business.reviews : null;
  const rating = Number.isFinite(business?.rating) ? business.rating : null;

  return {
    reviews,
    rating,
    note: reviews === null
      ? 'Google non ha restituito un numero recensioni utilizzabile per questa attività.'
      : String(reviews) + ' recensioni sono visibili oggi sul profilo selezionato.',
  };
}

export function buildPassaparolaMath({ weeklyClients, recentReviews }) {
  const weekly = Math.max(0, Math.round(Number(weeklyClients) || 0));
  const recent = Math.max(0, Math.round(Number(recentReviews) || 0));
  const estimatedMonthlyClients = Math.round(weekly * 4.33);
  const visibleShare = estimatedMonthlyClients > 0
    ? Math.min(100, Math.round((recent / estimatedMonthlyClients) * 100))
    : null;

  return {
    weeklyClients: weekly,
    recentReviews: recent,
    estimatedMonthlyClients,
    visibleShare,
    disclaimer: 'È una lettura orientativa: non tutti i clienti lascerebbero una recensione. Serve a confrontare il volume di esperienze con la quantità di nuova prova pubblica.',
  };
}

export function buildPassaparolaDiagnosis(business, answers) {
  const code = chooseDiagnosis(answers);
  const copy = diagnosisCopy[code];

  return {
    version: diagnosisVersion,
    code,
    shortLabel: copy.shortLabel,
    headline: copy.headline,
    why: copy.why(answers),
    actions: [...copy.actions],
    answerSummary: [
      answerSentences.reviewAsk[answers.reviewAsk],
      answerSentences.replies[answers.replies],
      answerSentences.reuse[answers.reuse],
    ].filter(Boolean).join(', '),
    evidence: buildEvidence(business),
  };
}
