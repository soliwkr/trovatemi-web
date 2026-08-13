import { useMemo, useState } from 'react';
import { beautyQuestions, calculateBeautyScore, type BeautyAnswers } from '../../data/beauty-score';

type Stage = 'intro' | 'quiz' | 'capture' | 'report';

type Contact = {
  businessName: string;
  city: string;
  email: string;
  whatsapp: string;
};

export default function BeautyScoreFunnel() {
  const [stage, setStage] = useState<Stage>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<BeautyAnswers>({});
  const [contact, setContact] = useState<Contact>({ businessName: '', city: '', email: '', whatsapp: '' });
  const [consent, setConsent] = useState(false);
  const question = beautyQuestions[step];
  const progress = Math.round(((step + 1) / beautyQuestions.length) * 100);
  const report = useMemo(() => calculateBeautyScore(answers), [answers]);

  const choose = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
    if (step < beautyQuestions.length - 1) setStep(step + 1);
    else setStage('capture');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (consent) setStage('report');
  };

  if (stage === 'intro') {
    return (
      <section className="inbound-card inbound-intro">
        <span className="inbound-kicker">Beauty Reputation Score</span>
        <h1>Quanto sta lavorando online il passaparola del tuo salone?</h1>
        <p>Sette domande. Circa un minuto. Alla fine ottieni un punteggio e tre azioni concrete da correggere prima.</p>
        <button className="inbound-primary" type="button" onClick={() => setStage('quiz')}>Inizia il checkup <b>→</b></button>
        <small>Nessuna call. Nessuna demo obbligatoria.</small>
      </section>
    );
  }

  if (stage === 'quiz' && question) {
    return (
      <section className="inbound-card inbound-quiz">
        <div className="inbound-progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="inbound-step"><span>{step + 1} / {beautyQuestions.length}</span><b>{progress}%</b></div>
        <h2>{question.title}</h2>
        <div className="inbound-options">
          {question.options.map(([value, label]) => (
            <button key={value} type="button" onClick={() => choose(value)}>{label}<span>→</span></button>
          ))}
        </div>
        {step > 0 && <button className="inbound-back" type="button" onClick={() => setStep(step - 1)}>← Indietro</button>}
      </section>
    );
  }

  if (stage === 'capture') {
    return (
      <section className="inbound-card inbound-capture">
        <span className="inbound-kicker">Checkup completato</span>
        <h2>Il report è pronto. Dove te lo mando?</h2>
        <p>Il risultato usa solo le risposte che hai appena dato. Non inventa dati sul tuo profilo Google.</p>
        <form onSubmit={submit}>
          <label>Nome del salone<input required value={contact.businessName} onChange={(e) => setContact({ ...contact, businessName: e.target.value })} /></label>
          <div className="inbound-fields-two">
            <label>Città<input required value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} /></label>
            <label>Email<input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></label>
          </div>
          <label>WhatsApp <small>facoltativo</small><input type="tel" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} /></label>
          <label className="inbound-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Voglio ricevere il report e gli aggiornamenti collegati al checkup.</span></label>
          <button className="inbound-primary" type="submit" disabled={!consent}>Apri il report <b>→</b></button>
          <small className="inbound-preview-note">In questa preview i dati restano nel browser e non vengono inviati.</small>
        </form>
      </section>
    );
  }

  return (
    <section className="inbound-report">
      <header className="inbound-report-hero">
        <span className="inbound-kicker">Beauty Reputation Score · {contact.businessName}</span>
        <div className="inbound-score"><strong>{report.score}</strong><span>/100</span></div>
        <h1>Il tuo passaparola funziona. Il punto è quanto riesci a farlo lavorare anche dopo che il cliente esce.</h1>
        <p>Opportunità operativa: <b>{report.opportunity}</b>. Il punteggio misura il processo descritto nelle tue risposte, non il ranking su Google.</p>
      </header>

      <div className="inbound-report-grid">
        <article><span>Punto più forte</span><h3>{report.strongestPillar}</h3><p>È il pezzo del sistema che oggi risulta più strutturato.</p></article>
        <article><span>Primo collo di bottiglia</span><h3>{report.weakestPillar}</h3><p>È da qui che conviene partire prima di aggiungere altra complessità.</p></article>
      </div>

      <section className="inbound-actions">
        <span className="inbound-kicker">Le prime 3 mosse</span>
        {report.actions.map((action, index) => <article key={action}><b>0{index + 1}</b><p>{action}</p></article>)}
      </section>

      <section className="inbound-product">
        <span className="inbound-kicker">Se vuoi automatizzare questi passaggi</span>
        <h2>Trovatemi collega recensioni, risposte e contenuti nello stesso flusso.</h2>
        <p>Il passaggio successivo non è una call: è vedere cosa viene attivato, il prezzo e l’onboarding.</p>
        <a className="inbound-primary" href="/inbound/attiva/">Vedi l’attivazione <b>→</b></a>
      </section>
    </section>
  );
}
