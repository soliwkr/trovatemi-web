import type { SyntheticEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AnimatedModal,
  BackgroundBeams,
  CardSpotlight,
  MovingBorderButton,
  Reveal,
  Spotlight,
  StickyReveal,
  TextGenerate,
  TracingBeam,
  WobbleCard,
} from './Aceternity';
import {
  DiscoveryMockup,
  EchoMockup,
  MessageMockup,
  QrNfcMockup,
  ReplyMockup,
  ReviewHeroMockup,
  SystemHub,
} from './Mockups';

const plans = [
  {
    name: 'TROVATO',
    scope: '01 / Reputazione',
    description: 'Raccoglie e gestisce la prova.',
    annual: '1.990',
    monthly: '199',
    annualNote: '12 mesi: 398 € in meno · attivazione inclusa',
    monthlyNote: 'Attivazione: 290 € una tantum',
    custom: false,
    features: ['Raccolta centralizzata delle recensioni', 'QR personalizzato e NFC', 'Richieste automatiche nei limiti previsti', 'Risposte assistite, sempre sotto il tuo controllo', 'Monitoraggio degli output', 'Configurazione e assistenza'],
    cta: 'Prova TROVATO per 14 giorni →',
  },
  {
    name: 'INEVITABILE',
    scope: '02 / Presenza',
    description: 'Raccoglie, trasforma e distribuisce la prova.',
    annual: '3.990',
    monthly: '399',
    annualNote: '12 mesi: 798 € in meno · attivazione inclusa',
    monthlyNote: 'Attivazione: 490 € una tantum',
    custom: false,
    features: ['Tutto TROVATO', 'Recensioni trasformate in contenuti', 'Distribuzione sui canali collegati', 'Aggiornamenti Google', 'Contenuti locali da servizi, territorio e domande reali', 'Hub editoriale, revisioni e supporto prioritario'],
    cta: 'Scopri se ti serve INEVITABILE →',
  },
  {
    name: 'RETE',
    scope: '03 / Multi-sede',
    description: 'Coordina più sedi senza perdere la lettura locale.',
    annual: 'Su misura',
    monthly: 'Su misura',
    annualNote: 'Configurazione definita dopo l’analisi delle sedi',
    monthlyNote: 'Configurazione definita dopo l’analisi delle sedi',
    custom: true,
    features: ['Tutto INEVITABILE', 'Più sedi in un’unica regia', 'Vista e monitoraggio per singola sede', 'Ruoli e accessi per il team', 'Flussi configurati per sede', 'Onboarding e assistenza dedicati'],
    cta: 'Parliamo della tua rete →',
  },
];

const faqs = [
  ['È un software che devo imparare a usare?', 'No. Trovatemi configura il sistema sulla tua attività, prepara gli strumenti e ti accompagna nell’utilizzo. La tecnologia lavora dietro le quinte; tu mantieni il controllo sugli output.'],
  ['Cosa succede nei 14 giorni?', 'Partiamo dalla situazione reale, colleghiamo l’attività, prepariamo QR, NFC e prima richiesta. Al giorno 7 controlliamo utilizzo e blocchi; al giorno 14 leggiamo gli output e decidiamo insieme se continuare.'],
  ['Filtrate le recensioni negative?', 'No. Ogni cliente riceve lo stesso percorso. Non compriamo recensioni, non selezioniamo chi può lasciare un’opinione e non utilizziamo review gating.'],
  ['Che differenza c’è tra TROVATO e INEVITABILE?', 'TROVATO raccoglie e gestisce la prova: richieste, recensioni e risposte. INEVITABILE aggiunge la trasformazione e la distribuzione della prova su Google, social e contenuti locali. RETE estende la regia a più sedi.'],
  ['L’intelligenza artificiale pubblica senza controllo?', 'Puoi lavorare con bozze da approvare oppure configurare gli automatismi previsti. La voce dell’attività e il controllo finale restano tuoi. In questa preview non viene pubblicato nulla.'],
  ['Mi garantite il primo posto su Google o una citazione nelle risposte AI?', 'No. Trovatemi rende servizi, territorio, domande e prove reali più chiari e continuativi online. Nessuno può garantire una posizione, una citazione o una risposta specifica.'],
  ['Devo avere qualcuno che segue i social?', 'No per TROVATO. Con INEVITABILE, eventuali professionisti già presenti possono essere coinvolti senza essere sostituiti. Non vendiamo gestione social completa.'],
  ['Posso scegliere il mensile?', 'Sì. Il mensile prevede una quota di attivazione; l’annuale la include. La preview mostra la struttura dell’offerta ma non apre checkout o pagamenti.'],
];

const systemSteps = [
  ['01', 'Chiediamo nel momento giusto', 'QR, NFC o messaggio portano il cliente al percorso concordato.'],
  ['02', 'La recensione va online', 'Lo stesso percorso vale per tutti: nessun filtro in base al voto.'],
  ['03', 'Prepariamo la risposta', 'Una bozza specifica usa tono, servizio e contesto della recensione.'],
  ['04', 'Creiamo gli output', 'Con INEVITABILE, la prova diventa aggiornamento Google, post o contenuto locale.'],
  ['05', 'Misuriamo cosa è successo', 'Richieste, recensioni, risposte e contenuti restano visibili e controllabili.'],
];

export default function V12Experience() {
  const [trialOpen, setTrialOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [demoStep, setDemoStep] = useState(0);
  const [trialDone, setTrialDone] = useState(false);
  const [mobileCta, setMobileCta] = useState(false);
  const [mobileCtaDismissed, setMobileCtaDismissed] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setNavVisible(current < 80 || current < previous);
      setMobileCta(current > 720 && !mobileCtaDismissed);
      previous = current;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileCtaDismissed]);

  const closeTrial = useCallback(() => setTrialOpen(false), []);
  const closeDemo = useCallback(() => setDemoOpen(false), []);
  const closeAccess = useCallback(() => setAccessOpen(false), []);

  const agents = useMemo(() => [
    {
      icon: '◎',
      label: 'INEVITABILE · GEO Agent',
      title: 'Spiega cosa fai, dove e per chi.',
      body: 'Usa servizi, territorio, domande frequenti e recensioni reali per preparare pagine e contenuti locali più precisi.',
      outcome: 'Google e gli assistenti AI trovano informazioni più chiare. Nessuna posizione o citazione è garantita.',
      visual: <DiscoveryMockup />,
    },
    {
      icon: '✦',
      label: 'TROVATO · SEO Agent',
      title: 'Prepara una risposta diversa per ogni recensione.',
      body: 'Legge ciò che il cliente ha scritto e propone una risposta coerente con tono, servizio e città. Puoi controllarla e modificarla prima che esca.',
      outcome: 'Ogni cliente riceve attenzione senza risposte copia-incolla.',
      visual: <ReplyMockup />,
    },
    {
      icon: '↗',
      label: 'INEVITABILE · Social Agent',
      title: 'Trasforma le recensioni migliori in contenuti pronti.',
      body: 'Estrae dalla voce del cliente una frase, un angolo e un formato da usare per aggiornamenti Google, post e storie sui canali collegati.',
      outcome: 'La presenza resta viva usando prove vere, senza ripartire ogni volta da zero.',
      visual: <EchoMockup />,
    },
  ], []);

  const openTrial = () => {
    setMenuOpen(false);
    setTrialDone(false);
    setTrialOpen(true);
  };

  const handleTrial = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTrialDone(true);
  };

  return (
    <div className="v12-page">
      <a className="v12-skip" href="#v12-main">Vai al contenuto</a>
      <div className="v12-concept-bar"><span>V12 · ACETERNITY CONCEPT</span><span>FUNZIONI, DATI E LISTINO SIMULATI · PRODUZIONE INTATTA</span></div>

      <motion.header
        className="v12-nav-shell"
        animate={{ y: navVisible ? 0 : -96, opacity: navVisible ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="v12-nav v12-wrap" aria-label="Navigazione principale">
          <a className="v12-wordmark" href="/brand-demo-v12/"><span>★</span><strong>TROVΛTEMI</strong></a>
          <div className="v12-nav__links">
            <a href="#come-funziona">Come funziona</a><a href="#agenti">Agenti AI</a><a href="#prezzi">Offerta</a><a href="#faq">FAQ</a>
          </div>
          <div className="v12-nav__actions">
            <button className="v12-ghost-button" type="button" onClick={() => setAccessOpen(true)}>Accedi</button>
            <button className="v12-yellow-button" type="button" onClick={openTrial}>Prova 14 giorni</button>
          </div>
          <button className="v12-menu-button" type="button" aria-expanded={menuOpen} aria-label="Apri il menu" onClick={() => setMenuOpen((value) => !value)}><i /><i /></button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="v12-mobile-menu" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <a href="#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</a><a href="#agenti" onClick={() => setMenuOpen(false)}>Agenti AI</a><a href="#prezzi" onClick={() => setMenuOpen(false)}>Offerta</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
              <button className="v12-yellow-button" type="button" onClick={openTrial}>Avvia la prova guidata</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main id="v12-main">
        <section className="v12-hero">
          <Spotlight />
          <BackgroundBeams className="v12-hero-beams" />
          <div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v12-hero__grid">
            <div className="v12-hero__copy">
              <p className="v12-eyebrow"><i /><i /><i /> Sistema assistito per recensioni e presenza locale</p>
              <h1><TextGenerate text="Ogni cliente soddisfatto può portarti il prossimo." /></h1>
              <p>Trovatemi chiede recensioni ai clienti, prepara le risposte e usa le prove migliori per tenere vivi Google, social e contenuti locali. Noi installiamo e seguiamo il sistema; tu continui a gestire l’attività.</p>
              <div className="v12-hero__actions">
                <MovingBorderButton onClick={openTrial}>Provalo 14 giorni sulla tua attività <span>→</span></MovingBorderButton>
                <button className="v12-play-button" type="button" onClick={() => { setDemoStep(0); setDemoOpen(true); }}><i>▶</i> Guarda cosa succede</button>
              </div>
              <small>Prova assistita · Attività reale · Nessuna carta nella preview</small>
            </div>
            <Reveal className="v12-hero__visual" delay={0.18}><ReviewHeroMockup /></Reveal>
          </div>
          <div className="v12-hero-flow" aria-label="Il percorso Trovatemi"><div className="v12-wrap"><span>CLIENTE SODDISFATTO</span><i>→</i><b>RICHIESTA</b><i>→</i><b>RECENSIONE</b><i>→</i><b>RISPOSTA + CONTENUTO</b><i>→</i><strong>NUOVA SCELTA</strong></div></div>
        </section>

        <section id="come-funziona" className="v12-choice">
          <div className="v12-wrap">
            <Reveal><SectionHead index="01" label="Il problema" title="Il lavoro è già buono. La prova non arriva online da sola." body="Il cliente ti ringrazia, promette che lascerà una recensione e torna alla sua giornata. Quando qualcuno ti cerca, quella soddisfazione spesso non si vede." /></Reveal>
            <div className="v12-choice__grid">
              {[
                ['01', 'Il cliente è soddisfatto', 'Il valore esiste già: lo senti al bancone, al tavolo o alla fine del servizio.'],
                ['02', 'Dice: “la faccio dopo”', 'Senza un gesto semplice o un promemoria, la recensione resta una buona intenzione.'],
                ['03', 'La prova non arriva', 'Online restano meno esperienze recenti, meno risposte e meno motivi per fidarsi.'],
                ['04', 'Chi cerca confronta', 'Google, Maps e assistenti AI possono capire soltanto ciò che trovano pubblicamente.'],
              ].map(([number, title, body], index) => (
                <Reveal key={number} delay={index * 0.08}><CardSpotlight><b>{number}</b><h3>{title}</h3><p>{body}</p><span>↗</span></CardSpotlight></Reveal>
              ))}
            </div>
            <Reveal><p className="v12-choice__statement">Il problema non è la qualità del tuo lavoro. È <em>quanta qualità riesce a vedere</em> chi ancora non ti conosce.</p></Reveal>
          </div>
        </section>

        <section className="v12-collection">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="02" label="Raccolta recensioni" title="Il momento migliore per chiedere esiste già." body="Trovatemi fa entrare la richiesta nella giornata reale: di persona con QR e NFC, oppure dopo il servizio con il messaggio concordato." /></Reveal>
            <Reveal>
              <WobbleCard className="v12-product-row">
                <QrNfcMockup />
                <div className="v12-product-copy"><span>QR + NFC</span><h3>Il cliente tocca quando è ancora soddisfatto.</h3><p>Prepariamo il supporto per bancone, cassa, tavolo o reception. Il cliente avvicina il telefono o inquadra il QR e arriva al percorso corretto senza cercare l’attività.</p><ul><li>Supporto pronto per il punto vendita</li><li>Percorso semplice sul telefono</li><li>Stessa destinazione per ogni opinione</li></ul></div>
              </WobbleCard>
            </Reveal>
            <Reveal>
              <WobbleCard className="v12-product-row v12-product-row--reverse">
                <MessageMockup />
                <div className="v12-product-copy"><span>Richieste automatiche</span><h3>Quando il cliente è già uscito, arriva il messaggio.</h3><p>Configuriamo canale, testo e momento della richiesta. Trovatemi prepara o invia il messaggio previsto, così il titolare non deve ricordarsi ogni singolo cliente.</p><ul><li>WhatsApp, SMS ed email</li><li>Consegna e stato della richiesta visibili</li><li>Promemoria concordati, mai aggressivi</li></ul></div>
              </WobbleCard>
            </Reveal>
          </div>
        </section>

        <section id="agenti" className="v12-agents">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="03" label="Agenti AI" title="Tre lavori diversi. Tutti partono da ciò che i clienti hanno già detto." body="Uno prepara le risposte, uno trasforma le recensioni in contenuti e uno organizza servizi, territorio e domande in pagine locali più chiare." /></Reveal>
            <StickyReveal items={agents} />
          </div>
        </section>

        <section className="v12-lamp-cta">
          <div className="v12-lamp" aria-hidden="true"><i /><span /></div>
          <Reveal className="v12-wrap v12-lamp-cta__inner"><small>DUE LIVELLI DI LAVORO</small><h2>Una recensione non dovrebbe fermarsi a cinque stelle.</h2><p>TROVATO la raccoglie e la gestisce. INEVITABILE la trasforma anche in contenuti e la distribuisce sui canali collegati.</p><button className="v12-yellow-button" type="button" onClick={() => { setDemoStep(0); setDemoOpen(true); }}>Vedi cosa produce una recensione →</button></Reveal>
        </section>

        <section className="v12-system">
          <BackgroundBeams />
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="04" label="Il sistema" title="Una recensione entra. Il sistema produce cose visibili." body="Raccolta, risposta, contenuti e distribuzione restano nello stesso flusso. Tu vedi cosa è successo e cosa è pronto da controllare." /></Reveal>
            <Reveal><SystemHub /></Reveal>
            <TracingBeam className="v12-system-steps">
              {systemSteps.map(([number, title, body], index) => <Reveal key={number} delay={index * 0.04}><article><b>{number}</b><div><h3>{title}</h3><p>{body}</p></div><span>{index === systemSteps.length - 1 ? '↻' : '↓'}</span></article></Reveal>)}
            </TracingBeam>
          </div>
        </section>

        <section className="v12-use-cases">
          <div className="v12-wrap">
            <Reveal><SectionHead dark label="Dove entra nella giornata" title="Il momento cambia. Il processo resta semplice." body="Trovatemi viene configurato attorno al momento in cui il cliente può valutare davvero il servizio." /></Reveal>
            <div className="v12-bento">
              <WobbleCard className="v12-bento-card v12-bento-card--wide"><span>BAR E RISTORAZIONE</span><h3>Il cliente tocca mentre è ancora soddisfatto.</h3><p>QR e NFC vivono al tavolo, sul bancone o alla cassa. La richiesta entra nel momento naturale, senza rallentare il servizio.</p><div className="v12-bento-visual"><i>☕</i><b>TOCCA</b><span>★★★★★</span></div></WobbleCard>
              <CardSpotlight className="v12-bento-card"><span>STUDI E SERVIZI</span><h3>La richiesta arriva quando può valutare.</h3><p>Un messaggio discreto raggiunge il cliente dopo l’appuntamento o quando il risultato del servizio è già chiaro.</p><div className="v12-bento-message">Grazie per esserti affidato a noi. Ti va di raccontarlo?<small>✓✓ 10:42</small></div></CardSpotlight>
              <CardSpotlight className="v12-bento-card"><span>PIÙ SEDI</span><h3>Ogni sede resta leggibile.</h3><p>RETE riunisce controllo e monitoraggio, mantenendo separati risultati, flussi e responsabilità di ogni punto.</p><div className="v12-location-stack"><i>FORMIA <b>18</b></i><i>GAETA <b>12</b></i><i>LATINA <b>21</b></i></div></CardSpotlight>
            </div>
            <p className="v12-use-cases__note">I visual mostrano casi d’uso, non risultati attribuiti a clienti reali.</p>
          </div>
        </section>

        <section className="v12-onboarding">
          <div className="v12-wrap">
            <Reveal><SectionHead index="05" label="Prova assistita" title="Non ti diamo un login. Lo mettiamo in funzione." body="Nei 14 giorni partiamo dalla tua attività reale, facciamo partire il processo e controlliamo insieme se viene usato." /></Reveal>
            <TracingBeam className="v12-onboarding__steps">
              {[
                ['01', 'Installiamo il processo', 'Segniamo la situazione iniziale, colleghiamo l’attività e prepariamo QR, NFC e prima richiesta.', 'GIORNO 1'],
                ['02', 'Guardiamo l’uso reale', 'Controlliamo cosa è stato usato, dove il gesto si blocca e cosa va corretto.', 'GIORNO 7'],
                ['03', 'Leggiamo gli output e decidiamo', 'Confrontiamo richieste, recensioni, risposte e contenuti. Poi scegli se continuare.', 'GIORNO 14'],
              ].map(([number, title, body, time], index) => <Reveal key={number} delay={index * 0.08}><article><b>{number}</b><div><h3>{title}</h3><p>{body}</p></div><span>{time}</span></article></Reveal>)}
            </TracingBeam>
          </div>
        </section>

        <section id="prezzi" className="v12-pricing">
          <div className="v12-wrap">
            <Reveal><SectionHead index="06" label="Offerta" title="Due problemi. Due piani. Una soluzione per le reti." body="Se basta raccogliere e gestire la prova, c’è TROVATO. Se la prova deve tenere vivi anche Google, social e contenuti locali, c’è INEVITABILE. Per più sedi c’è RETE." /></Reveal>
            <Reveal><div className="v12-concept-note"><b>Listino mostrato per valutare la V12.</b><span>Il checkout è disattivato. Prezzo, attivazione e condizioni vengono comunicati prima dell’avvio della prova assistita.</span></div></Reveal>
            <Reveal><div className="v12-billing" role="group" aria-label="Periodo di fatturazione"><button type="button" className={!annual ? 'is-active' : ''} aria-pressed={!annual} onClick={() => setAnnual(false)}>Mensile</button><button type="button" className={annual ? 'is-active' : ''} aria-pressed={annual} onClick={() => setAnnual(true)}>Annuale</button><span>Nei piani standard, l’annuale include l’attivazione</span></div></Reveal>
            <div className="v12-pricing__grid">
              {plans.map((plan, index) => {
                const price = annual ? plan.annual : plan.monthly;
                const priceNote = annual ? plan.annualNote : plan.monthlyNote;

                return (
                <Reveal key={plan.name} delay={index * 0.1}>
                  <CardSpotlight className="v12-price-card">
                    <header><small>{plan.scope}</small><h3>{plan.name}</h3><p>{plan.description}</p></header>
                    <div className={`v12-price ${plan.custom ? 'v12-price--custom' : ''}`}>{!plan.custom && <span>€</span>}<AnimatePresence mode="wait"><motion.b key={`${annual}-${price}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{price}</motion.b></AnimatePresence>{!plan.custom && <em>{annual ? '/ anno' : '/ mese'}</em>}<small>{plan.custom ? 'configurazione dedicata' : annual ? 'fatturazione annuale' : 'fatturazione mensile'}</small></div>
                    <div className="v12-saving">{priceNote}</div>
                    <ul>{plan.features.map((feature) => <li key={feature}><i>✓</i>{feature}</li>)}</ul>
                    <button className="v12-black-button" type="button" onClick={openTrial}>{plan.cta}</button>
                    <small>Prova assistita · Nessun pagamento nella preview</small>
                  </CardSpotlight>
                </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="v12-faq">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="07" label="Domande frequenti" title="Prima di dirci di sì, ecco dove ti diciamo di no." /></Reveal>
            <Reveal><div className="v12-faq__list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></Reveal>
          </div>
        </section>

        <section className="v12-final-cta">
          <Spotlight className="v12-final-spotlight" /><BackgroundBeams />
          <Reveal className="v12-wrap v12-final-cta__inner"><span>14 GIORNI · PROVA ASSISTITA · ATTIVITÀ REALE</span><h2>I clienti soddisfatti esistono già. Fai lavorare la loro voce.</h2><p>Partiamo dal tuo profilo, guardiamo cosa trova oggi un cliente e installiamo il primo percorso di richiesta.</p><MovingBorderButton onClick={openTrial}>Analizza la mia attività <b>→</b></MovingBorderButton><small>Nessuna promessa di primo posto · Nessun pagamento nella preview</small></Reveal>
        </section>
      </main>

      <footer className="v12-footer"><div className="v12-wrap"><div><a className="v12-wordmark" href="/brand-demo-v12/"><span>★</span><strong>TROVΛTEMI</strong></a><p>Un sistema assistito per recensioni e presenza locale.</p></div><nav aria-label="Link del prodotto"><a href="#come-funziona">Come funziona</a><a href="#agenti">Agenti AI</a><a href="#prezzi">Offerta</a><a href="#faq">FAQ</a></nav><div><span>V12 · noindex</span><span>Nessun acquisto reale</span><b>Ti facciamo trovare dove conta.</b></div></div><small>© 2026 Trovatemi.it · Concept isolato</small></footer>

      <AnimatePresence>{mobileCta && !trialOpen && !demoOpen && <motion.aside className="v12-mobile-cta" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}><button type="button" aria-label="Nascondi" onClick={() => { setMobileCta(false); setMobileCtaDismissed(true); }}>×</button><button className="v12-yellow-button" type="button" onClick={openTrial}>Avvia la prova guidata →</button></motion.aside>}</AnimatePresence>

      <AnimatedModal open={trialOpen} onClose={closeTrial} labelledBy="v12-trial-title">
        <div className="v12-trial-modal">
          <div className="v12-trial-modal__intro"><span>14 GIORNI · PROVA ASSISTITA</span><h2 id="v12-trial-title">Provalo sulla tua vera attività.</h2><p>Partiamo dalla situazione reale, attiviamo la prima richiesta e controlliamo insieme cosa succede. In questa preview il modulo non invia dati e non crea account.</p><ol><li><b>01</b>Baseline, collegamento e prima richiesta</li><li><b>07</b>Controllo di utilizzo e blocchi</li><li><b>14</b>Lettura degli output e decisione</li></ol></div>
          <form onSubmit={handleTrial}><label><span>Nome</span><input name="name" placeholder="Il tuo nome" required /></label><label><span>Attività</span><input name="business" placeholder="Nome dell’attività" required /></label><div><label><span>Categoria</span><input name="category" placeholder="Es. ristorante" required /></label><label><span>Città</span><input name="city" placeholder="Dove lavori" required /></label></div><label><span>Telefono o WhatsApp</span><input name="contact" type="tel" placeholder="Il numero su cui ricontattarti" required /></label><button className="v12-yellow-button" type="submit">Prepara la prova →</button><small>Nessun dato lascia questa pagina.</small>{trialDone && <motion.p className="v12-form-success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><i>✓</i><span><b>Simulazione completata.</b> Il modulo funziona, ma non ha inviato nulla.</span></motion.p>}</form>
        </div>
      </AnimatedModal>

      <AnimatedModal open={demoOpen} onClose={closeDemo} labelledBy="v12-demo-title">
        <div className="v12-demo-modal">
          <header><span>DEMO INTERATTIVA · NESSUNA AZIONE REALE</span><h2 id="v12-demo-title">Da cliente soddisfatto a prova pubblica che continua a lavorare.</h2></header>
          <div className="v12-demo-modal__grid"><ol>{['Richiesta', 'Recensione', 'Risposta', 'Contenuto'].map((label, index) => <li key={label}><button className={demoStep === index ? 'is-active' : ''} type="button" aria-pressed={demoStep === index} onClick={() => setDemoStep(index)}><b>0{index + 1}</b><span>{label}</span></button></li>)}</ol><div className="v12-demo-stage"><AnimatePresence mode="wait"><motion.section key={demoStep} initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0)' }} exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }}><small>{['RICHIESTA CONFIGURATA', 'RECENSIONE PUBBLICA', 'RISPOSTA ASSISTITA', 'CONTENUTO PRONTO'][demoStep]}</small><strong>{['Ciao Elena, com’è andata?', '★★★★★', 'Risposta pronta da controllare.', 'La prova diventa un contenuto.'][demoStep]}</strong><p>{['Il messaggio porta il cliente al percorso concordato.', '“Precisi, disponibili e tutto spiegato bene.”', '“Grazie Elena. Siamo felici che chiarezza e disponibilità abbiano fatto la differenza.”', 'Con INEVITABILE, la frase reale viene adattata a post, aggiornamento Google o contenuto locale.'][demoStep]}</p>{demoStep < 3 && <button type="button" onClick={() => setDemoStep((step) => step + 1)}>Passo successivo →</button>}</motion.section></AnimatePresence></div><aside><span>DUE LIVELLI</span><p>TROVATO raccoglie e gestisce recensioni e risposte. INEVITABILE trasforma la stessa prova anche in contenuti da distribuire.</p><button className="v12-yellow-button" type="button" onClick={() => { setDemoOpen(false); openTrial(); }}>Provalo sulla mia attività</button></aside></div>
        </div>
      </AnimatedModal>

      <AnimatedModal open={accessOpen} onClose={closeAccess} labelledBy="v12-access-title"><div className="v12-access-modal"><span>AREA CLIENTI</span><h2 id="v12-access-title">Questa è una preview.</h2><p>L’accesso non è collegato. Qui stiamo valutando struttura, copy, mockup ed effetti Aceternity della V12.</p><button className="v12-black-button" type="button" onClick={closeAccess}>Ho capito</button></div></AnimatedModal>
    </div>
  );
}

function SectionHead({
  index,
  label,
  title,
  body,
  dark = false,
}: {
  index?: string;
  label: string;
  title: string;
  body?: string;
  dark?: boolean;
}) {
  return <header className={`v12-section-head ${dark ? 'v12-section-head--dark' : ''}`}><span>{index && `${index} · `}{label}</span><h2>{title}</h2>{body && <p>{body}</p>}</header>;
}
