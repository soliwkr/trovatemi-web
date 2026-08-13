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
    return auditDemoBusinesses.filter((item) => `${item.name} ${item.city}`.toLowerCase().includes(needle));
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
        <span className="inbound-kicker">Beauty Check · prototipo</span>
        <h1>Quanto è forte il tuo salone su Google?</h1>
        <p>Cerca la tua attività, rispondi a cinque domande che Google non può conoscere e scopri dove si interrompe il passaparola.</p>
        <button className="inbound-primary" type="button" onClick={() => setStage('search')}>Cerca il mio salone <b>→</b></button>
        <small>Preview con dati dimostrativi. Nessuna chiamata Google Maps viene eseguita.</small>
      </section>
    );
  }

  if (stage === 'search') {
    return (
      <section className="inbound-card inbound-search">
        <span className="inbound-kicker">01 · Trova la tua attività</span>
        <h2>Cerca il tuo salone.</h2>
        <p>Nel prodotto reale la ricerca partirà solo quando confermi, non a ogni tasto.</p>
        <label className="inbound-searchbox">
          <span>Nome attività o città</span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Es. Hair Style Formia" />
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
        <span className="inbound-kicker">02 · Attività trovata</span>
        <h2>È questa?</h2>
        <article className="business-card">
          <div><b>{business.name}</b><span>{business.category} · {business.address}</span></div>
          <div className="business-stats"><strong>{business.rating.toFixed(1)} ★</strong><span>{business.reviews} recensioni</span></div>
        </article>
        <p className="inbound-demo-disclaimer">Dati dimostrativi per validare il funnel. Nel prodotto reale questi campi arriveranno da Places con field mask minima.</p>
        <div className="inbound-actions-row">
          <button className="inbound-primary" type="button" onClick={() => setStage('quiz')}>Sì, continua <b>→</b></button>
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
    return (
      <section className="inbound-report inbound-flash">
        <span className="inbound-kicker">Risultato flash · {business.name}</span>
        <h1>Qui si interrompe il tuo passaparola.</h1>
        <div className="audit-public-strip">
          <article><span>Rating demo</span><strong>{business.rating.toFixed(1)} ★</strong></article>
          <article><span>Recensioni</span><strong>{business.reviews}</strong></article>
          <article><span>Mediana cohort demo</span><strong>{business.cohortMedianReviews}</strong></article>
          <article><span>Gap</span><strong>{report.reviewGap}</strong></article>
        </div>
        <div className="audit-pillars">
          <article><span>Reputazione Google</span><b>{report.reputation}/100</b><i><em style={{ width: `${report.reputation}%` }} /></i></article>
          <article><span>Sistema recensioni</span><b>{report.collection}/100</b><i><em style={{ width: `${report.collection}%` }} /></i></article>
          <article><span>Risposte</span><b>{report.replies}/100</b><i><em style={{ width: `${report.replies}%` }} /></i></article>
          <article><span>Social proof</span><b>{report.socialProof}/100</b><i><em style={{ width: `${report.socialProof}%` }} /></i></article>
        </div>
        <div className="flash-callout"><span>Primo collo di bottiglia</span><strong>{report.weakestPillar}</strong><p>Il report completo ti mostra perché e quali tre mosse fare prima.</p></div>
        <button className="inbound-primary" type="button" onClick={() => setStage('capture')}>Apri il report completo <b>→</b></button>
      </section>
    );
  }

  if (stage === 'capture' && business) {
    return (
      <section className="inbound-card inbound-capture">
        <span className="inbound-kicker">04 · Report pronto</span>
        <h2>Dove te lo mando?</h2>
        <p>Abbiamo già il nome dell’attività. Ci serve solo il recapito per consegnare il report.</p>
        <form onSubmit={submitContact}>
          <label>Email<input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="nome@email.it" /></label>
          <label>WhatsApp <small>facoltativo</small><input type="tel" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} /></label>
          <label className="inbound-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Voglio ricevere il report e i follow-up collegati a questa diagnosi.</span></label>
          <button className="inbound-primary" type="submit" disabled={!consent}>Mostrami il report <b>→</b></button>
          <small className="inbound-preview-note">Preview: i dati restano nel browser e non vengono inviati.</small>
        </form>
      </section>
    );
  }

  if (!business || !report) return null;

  return (
    <section className="inbound-report">
      <header className="inbound-report-hero">
        <span className="inbound-kicker">Beauty Check · {business.name}</span>
        <h1>Non ti serve più traffico. Ti serve far lavorare meglio quello che succede già nel salone.</h1>
        <p><b>{business.reviews}</b> recensioni contro una mediana demo di <b>{business.cohortMedianReviews}</b>. Il punto più debole del processo è <b>{report.weakestPillar}</b>.</p>
      </header>

      <section className="inbound-actions">
        <span className="inbound-kicker">Le prime 3 mosse</span>
        {report.actions.map((action, index) => <article key={action}><b>0{index + 1}</b><p>{action}</p></article>)}
      </section>

      <section className="inbound-product">
        <span className="inbound-kicker">Automazione</span>
        <h2>Trovatemi serve solo se vuoi togliere questi passaggi dalla memoria del team.</h2>
        <p>Raccolta recensioni, risposte e riutilizzo della prova diventano un flusso operativo. Il report resta il punto di partenza, non una demo commerciale.</p>
        <a className="inbound-primary" href="/inbound/next/">Vedi cosa automatizza <b>→</b></a>
      </section>
    </section>
  );
}
