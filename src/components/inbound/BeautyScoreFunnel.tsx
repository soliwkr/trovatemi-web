import { useMemo, useState } from 'react';
import {
  auditDemoBusinesses,
  auditQuestions,
  buildAuditReport,
  type AuditAnswers,
  type AuditBusiness,
} from '../../data/beauty-audit-demo';

type Stage = 'intro' | 'search' | 'confirm' | 'quiz' | 'flash' | 'capture' | 'report';
type Contact = { email: string; whatsapp: string };

export default function BeautyScoreFunnel() {
  const [stage, setStage] = useState<Stage>('intro');
  const [query, setQuery] = useState('');
  const [business, setBusiness] = useState<AuditBusiness | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AuditAnswers>({});
  const [contact, setContact] = useState<Contact>({ email: '', whatsapp: '' });
  const [consent, setConsent] = useState(false);

  const question = auditQuestions[step];
  const progress = Math.round(((step + 1) / auditQuestions.length) * 100);
  const report = useMemo(() => (business ? buildAuditReport(business, answers) : null), [business, answers]);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return auditDemoBusinesses;
    return auditDemoBusinesses.filter((item) => `${item.name} ${item.city} ${item.category}`.toLowerCase().includes(needle));
  }, [query]);

  const chooseAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
    if (step < auditQuestions.length - 1) setStep(step + 1);
    else setStage('flash');
  };

  const submitContact = (event: React.FormEvent) => {
    event.preventDefault();
    if (consent) setStage('report');
  };

  if (stage === 'intro') {
    return (
      <section className="inbound-card inbound-intro">
        <span className="inbound-kicker">Beauty & Wellness Check</span>
        <h1>Hai clienti che ti adorano. Google lo sa?</h1>
        <p>Cerca la tua attività. Incrociamo quello che si vede online con cinque cose che Google non può sapere e ti facciamo vedere dove il passaparola smette di lavorare.</p>
        <button className="inbound-primary" type="button" onClick={() => setStage('search')}>Cerca la mia attività <b>→</b></button>
        <small>Parrucchieri, barber, centri estetici, nails/lashes, studi massaggi, spa e wellness. Preview con dati demo: zero chiamate Maps.</small>
      </section>
    );
  }

  if (stage === 'search') {
    return (
      <section className="inbound-card inbound-search">
        <span className="inbound-kicker">01 · Vediamo chi sei</span>
        <h2>Cerca la tua attività.</h2>
        <p>Scrivi nome o città. Nel prodotto reale Google viene interrogato solo quando serve, non mentre digiti ogni lettera.</p>
        <label className="inbound-searchbox">
          <span>Nome attività o città</span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Es. studio massaggi Formia" />
        </label>
        <div className="inbound-results">
          {matches.map((item) => (
            <button key={item.id} type="button" onClick={() => { setBusiness(item); setStage('confirm'); }}>
              <span><b>{item.name}</b><small>{item.category} · {item.address}</small></span><strong>→</strong>
            </button>
          ))}
        </div>
        <button className="inbound-back" type="button" onClick={() => setStage('intro')}>← Indietro</button>
      </section>
    );
  }

  if (stage === 'confirm' && business) {
    return (
      <section className="inbound-card inbound-confirm">
        <span className="inbound-kicker">02 · Ok, ti abbiamo trovato</span>
        <h2>È questa?</h2>
        <article className="business-card">
          <div><b>{business.name}</b><span>{business.category} · {business.address}</span></div>
          <div className="business-stats"><strong>{business.rating.toFixed(1)} ★</strong><span>{business.reviews} recensioni</span></div>
        </article>
        <p className="inbound-demo-disclaimer">Qui sono dati dimostrativi. Nel prodotto reale arriveranno da Places con il minimo indispensabile.</p>
        <div className="inbound-actions-row">
          <button className="inbound-primary" type="button" onClick={() => setStage('quiz')}>Sì, sono io <b>→</b></button>
          <button className="inbound-secondary" type="button" onClick={() => setStage('search')}>No, cerca di nuovo</button>
        </div>
      </section>
    );
  }

  if (stage === 'quiz' && question) {
    return (
      <section className="inbound-card inbound-quiz">
        <div className="inbound-progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="inbound-step"><span>{step + 1} / {auditQuestions.length}</span><b>{progress}%</b></div>
        <span className="inbound-kicker">03 · Quello che Google non sa</span>
        <h2>{question.title}</h2>
        <div className="inbound-options">
          {question.options.map(([value, label]) => (
            <button key={value} type="button" onClick={() => chooseAnswer(value)}>{label}<span>→</span></button>
          ))}
        </div>
        {step > 0 && <button className="inbound-back" type="button" onClick={() => setStep(step - 1)}>← Indietro</button>}
      </section>
    );
  }

  if (stage === 'flash' && business && report) {
    const gapCopy = report.reviewGap < 0
      ? `Hai ${business.reviews} recensioni. La mediana demo del gruppo locale è ${business.cohortMedianReviews}. Mancano ${Math.abs(report.reviewGap)} prove pubbliche solo per arrivare in pari.`
      : `Hai ${business.reviews} recensioni e sei sopra la mediana demo del gruppo locale. Bene. Ora vediamo se le stai facendo lavorare davvero.`;

    return (
      <section className="inbound-report inbound-flash">
        <span className="inbound-kicker">Risultato flash · {business.name}</span>
        <h1>Le recensioni non sono soprammobili.</h1>
        <p>{gapCopy}</p>
        <div className="audit-public-strip">
          <article><span>Rating demo</span><strong>{business.rating.toFixed(1)} ★</strong></article>
          <article><span>Recensioni</span><strong>{business.reviews}</strong></article>
          <article><span>Mediana demo</span><strong>{business.cohortMedianReviews}</strong></article>
          <article><span>Gap</span><strong>{report.reviewGap}</strong></article>
        </div>
        <div className="audit-pillars">
          <article><span>Reputazione Google</span><b>{report.reputation}/100</b><i><em style={{ width: `${report.reputation}%` }} /></i></article>
          <article><span>Sistema recensioni</span><b>{report.collection}/100</b><i><em style={{ width: `${report.collection}%` }} /></i></article>
          <article><span>Risposte</span><b>{report.replies}/100</b><i><em style={{ width: `${report.replies}%` }} /></i></article>
          <article><span>Social proof</span><b>{report.socialProof}/100</b><i><em style={{ width: `${report.socialProof}%` }} /></i></article>
        </div>
        <div className="flash-callout"><span>Primo collo di bottiglia</span><strong>{report.weakestPillar}</strong><p>La radiografia veloce finisce qui. Nel report completo ti facciamo vedere cosa sistemare prima e perché.</p></div>
        <button className="inbound-primary" type="button" onClick={() => setStage('capture')}>Voglio il report completo <b>→</b></button>
      </section>
    );
  }

  if (stage === 'capture' && business) {
    return (
      <section className="inbound-card inbound-capture">
        <span className="inbound-kicker">04 · Il report è pronto</span>
        <h2>Dove te lo mando?</h2>
        <p>Nome e attività li abbiamo già. Ci serve solo il recapito per consegnarti il report completo.</p>
        <form onSubmit={submitContact}>
          <label>Email<input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="nome@email.it" /></label>
          <label>WhatsApp <small>facoltativo</small><input type="tel" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} /></label>
          <label className="inbound-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Voglio ricevere il report e i follow-up collegati a questa diagnosi.</span></label>
          <button className="inbound-primary" type="submit" disabled={!consent}>Mandami il report <b>→</b></button>
          <small className="inbound-preview-note">Non ti chiamiamo mentre hai un cliente sul lettino o sotto il phon. In questa preview, comunque, i dati non partono proprio.</small>
        </form>
      </section>
    );
  }

  if (!business || !report) return null;

  return (
    <section className="inbound-report">
      <header className="inbound-report-hero">
        <span className="inbound-kicker">Beauty & Wellness Check · {business.name}</span>
        <h1>Il punto non è avere clienti contenti. È non far evaporare quello che dicono di te.</h1>
        <p><b>{business.reviews}</b> recensioni contro una mediana demo di <b>{business.cohortMedianReviews}</b>. Il pezzo più debole oggi è <b>{report.weakestPillar}</b>.</p>
      </header>

      <section className="inbound-actions">
        <span className="inbound-kicker">Le prime 3 mosse</span>
        {report.actions.map((action, index) => <article key={action}><b>0{index + 1}</b><p>{action}</p></article>)}
      </section>

      <section className="inbound-product">
        <span className="inbound-kicker">La parte interessante</span>
        <h2>Quasi tutto questo si può togliere dalla tua testa.</h2>
        <p>Cliente contento → recensione → risposta → contenuto → pubblicazione. Trovatemi serve a far girare questo flusso mentre tu continui a fare il lavoro che ti paga davvero.</p>
        <a className="inbound-primary" href="/inbound/next/">Vedi cosa automatizza <b>→</b></a>
      </section>
    </section>
  );
}
