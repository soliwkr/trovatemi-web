import { useState } from 'react';
import { beautyQuestions, type BeautyAnswers } from '../../data/beauty-score';

type Stage = 'intro' | 'quiz' | 'capture';

export default function BeautyScoreFunnel() {
  const [stage, setStage] = useState<Stage>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<BeautyAnswers>({});
  const question = beautyQuestions[step];
  const progress = Math.round(((step + 1) / beautyQuestions.length) * 100);

  const choose = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
    if (step < beautyQuestions.length - 1) setStep(step + 1);
    else setStage('capture');
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

  return (
    <section className="inbound-card inbound-capture">
      <span className="inbound-kicker">Checkup completato</span>
      <h2>Il tuo report è pronto.</h2>
      <p>Adesso scegliamo dove riceverlo e completiamo il profilo del salone.</p>
    </section>
  );
}
