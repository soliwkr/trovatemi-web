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
    scope: '1 sede',
    description: 'Per trasformare ogni cliente soddisfatto in una prova pubblica e curata.',
    annual: 79,
    monthly: 99,
    saving: '240 € in meno su 12 mesi',
    popular: true,
    features: ['3 agenti inclusi', 'QR e NFC senza limiti', '100 richieste WhatsApp/mese', '2.000 richieste email/mese', 'Monitoraggio delle principali piattaforme', 'Widget recensioni per il sito'],
  },
  {
    name: 'VISIBILE',
    scope: 'Fino a 3 sedi',
    description: 'Per attività con più punti o un flusso più alto di clienti da ricontattare.',
    annual: 119,
    monthly: 149,
    saving: '360 € in meno su 12 mesi',
    popular: false,
    features: ['Tutto TROVATO', '3 sedi in un solo spazio', '250 richieste WhatsApp/mese', '4.000 richieste email/mese', '100 richieste SMS/mese', 'Vista aggregata per sede'],
  },
  {
    name: 'INEVITABILE',
    scope: 'Fino a 10 sedi',
    description: 'Per reti locali che vogliono volume, ruoli e coerenza su ogni punto vendita.',
    annual: 239,
    monthly: 319,
    saving: '960 € in meno su 12 mesi',
    popular: false,
    features: ['Tutto VISIBILE', 'Fino a 10 sedi', '1.000 richieste WhatsApp/mese', '10.000 richieste email/mese', '200 richieste SMS/mese', 'Ruoli team e supporto prioritario'],
  },
];

const faqs = [
  ['Che cos’è Trovatemi in questa V12?', 'È una proposta di prodotto per attività locali: raccoglie recensioni, prepara risposte e riusa le esperienze reali dei clienti per rendere più chiara l’attività su Google, social e sistemi AI. Questa route è una preview isolata, non un servizio acquistabile.'],
  ['In che modo arrivano le recensioni?', 'Il cliente può usare QR o NFC nel punto vendita oppure ricevere una richiesta configurata via WhatsApp, SMS o email. Il percorso è uguale per tutti: non cambia in base al voto e non filtra le opinioni negative.'],
  ['L’intelligenza artificiale pubblica senza controllo?', 'La V12 mostra due modalità: bozza da approvare oppure pubblicazione automatica configurabile. Nella preview non viene pubblicato nulla e nessuna integrazione è attiva.'],
  ['È adatto a qualunque attività?', 'È pensato per attività locali che vengono cercate e confrontate online: ristorazione, retail, studi, salute, benessere, palestre, hospitality e servizi sul territorio.'],
  ['Quali piattaforme può riunire?', 'La dimostrazione rappresenta Google, TripAdvisor, Trustpilot e Facebook come possibili fonti. Sono interfacce illustrative: in V12 non avvengono collegamenti reali.'],
  ['Può farmi comparire nelle risposte di ChatGPT o Gemini?', 'Può organizzare parole, servizi, domande e prove reali in contenuti più comprensibili dai motori e dagli assistenti. Non può garantire una citazione, una posizione o una risposta specifica.'],
  ['I prezzi sono quelli definitivi?', 'No. Il listino a tre livelli serve a valutare la stessa architettura commerciale del riferimento. Non sostituisce l’offerta approvata di Trovatemi e non apre checkout.'],
  ['Posso interrompere quando voglio?', 'Nel concept l’opzione mensile è senza vincoli lunghi. Termini, prova, pagamenti e condizioni devono essere approvati prima di qualunque pubblicazione commerciale.'],
];

const systemSteps = [
  ['01', 'Il cliente racconta', 'QR, NFC o messaggio aprono il percorso nel momento più naturale.'],
  ['02', 'La prova diventa pubblica', 'L’esperienza resta attribuita al cliente e raggiunge la piattaforma scelta.'],
  ['03', 'La relazione continua', 'Una risposta contestuale dimostra presenza e attenzione.'],
  ['04', 'La voce si moltiplica', 'Gli elementi utili diventano bozze di contenuti per altri canali.'],
  ['05', 'La prossima scelta è più facile', 'Chi cerca trova più informazioni recenti e una prova più leggibile.'],
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
      label: 'Agente Scoperta',
      title: 'Fa capire dove sei utile.',
      body: 'Riconosce servizi, domande, territorio e parole ricorrenti nelle recensioni. Da lì prepara contenuti che descrivono l’attività con più precisione.',
      outcome: 'Più contesti pubblici in cui Google e l’AI possono comprenderti.',
      visual: <DiscoveryMockup />,
    },
    {
      icon: '✦',
      label: 'Agente Relazione',
      title: 'Tiene viva ogni conversazione.',
      body: 'Legge ciò che il cliente ha scritto e prepara una risposta specifica, legata al tono, ai servizi e alla città. Tu puoi rivederla prima che esca.',
      outcome: 'Una presenza curata, senza risposte copia-incolla.',
      visual: <ReplyMockup />,
    },
    {
      icon: '↗',
      label: 'Agente Diffusione',
      title: 'Fa viaggiare la prova.',
      body: 'Estrae dalle recensioni migliori una frase, un angolo e un visual pronti da adattare a post, storie e pagine locali.',
      outcome: 'Più riprova sociale usando materiale che esiste davvero.',
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
            <a href="#come-funziona">Come funziona</a><a href="#agenti">Agenti AI</a><a href="#prezzi">Prezzi</a><a href="#faq">FAQ</a>
          </div>
          <div className="v12-nav__actions">
            <button className="v12-ghost-button" type="button" onClick={() => setAccessOpen(true)}>Accedi</button>
            <button className="v12-yellow-button" type="button" onClick={openTrial}>Prova gratis</button>
          </div>
          <button className="v12-menu-button" type="button" aria-expanded={menuOpen} aria-label="Apri il menu" onClick={() => setMenuOpen((value) => !value)}><i /><i /></button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="v12-mobile-menu" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <a href="#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</a><a href="#agenti" onClick={() => setMenuOpen(false)}>Agenti AI</a><a href="#prezzi" onClick={() => setMenuOpen(false)}>Prezzi</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
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
              <p className="v12-eyebrow"><i /><i /><i /> Reputazione + AI per attività locali</p>
              <h1><TextGenerate text="Ogni cliente soddisfatto può portarti il prossimo." /></h1>
              <p>Trovatemi raccoglie ciò che i clienti dicono, prepara le risposte e trasforma ogni esperienza reale in segnali chiari per Google, social e assistenti AI. Tu continui a gestire l’attività.</p>
              <div className="v12-hero__actions">
                <MovingBorderButton onClick={openTrial}>Avvia 14 giorni di prova guidata <span>→</span></MovingBorderButton>
                <button className="v12-play-button" type="button" onClick={() => { setDemoStep(0); setDemoOpen(true); }}><i>▶</i> Guarda il percorso</button>
              </div>
              <small>Nessuna carta · Nessun dato inviato · Demo V12 isolata</small>
            </div>
            <Reveal className="v12-hero__visual" delay={0.18}><ReviewHeroMockup /></Reveal>
          </div>
          <div className="v12-hero-flow" aria-label="Il percorso Trovatemi"><div className="v12-wrap"><span>DAL CLIENTE</span><i>→</i><b>RECENSIONE</b><i>→</i><b>RISPOSTA</b><i>→</i><b>CONTENUTO</b><i>→</i><strong>NUOVA SCELTA</strong></div></div>
        </section>

        <section id="come-funziona" className="v12-choice">
          <div className="v12-wrap">
            <Reveal><SectionHead index="01" label="Perché serve" title="La scelta comincia prima della porta." body="Prima di telefonarti o entrare, una persona ha già cercato, confrontato e deciso chi sembra più credibile." /></Reveal>
            <div className="v12-choice__grid">
              {[
                ['01', 'Ti cercano', 'Il primo incontro avviene sul telefono, mentre il bisogno è già vivo.'],
                ['02', 'Ti mettono accanto agli altri', 'Voto, quantità, freschezza e risposte rendono il confronto immediato.'],
                ['03', 'Credono alla prova', 'Le parole di altri clienti pesano più di una promessa scritta dal brand.'],
                ['04', 'Ora chiedono anche all’AI', 'Gli assistenti costruiscono risposte con ciò che riescono a capire online.'],
              ].map(([number, title, body], index) => (
                <Reveal key={number} delay={index * 0.08}><CardSpotlight><b>{number}</b><h3>{title}</h3><p>{body}</p><span>↗</span></CardSpotlight></Reveal>
              ))}
            </div>
            <Reveal><p className="v12-choice__statement">Essere bravi non basta, se online non risulti <em>chiaro, recente e credibile</em> nel momento esatto della scelta.</p></Reveal>
          </div>
        </section>

        <section className="v12-collection">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="02" label="Raccolta recensioni" title="Il momento migliore per chiedere esiste già." body="È subito dopo un’esperienza positiva, quando il cliente ricorda ancora perché ti ha apprezzato. Trovatemi rende quel passaggio breve e naturale." /></Reveal>
            <Reveal>
              <WobbleCard className="v12-product-row">
                <QrNfcMockup />
                <div className="v12-product-copy"><span>QR + NFC</span><h3>Un gesto breve, mentre il valore è ancora fresco.</h3><p>Il supporto vive sul bancone, alla cassa, al tavolo o in reception. Il cliente tocca o inquadra e arriva al percorso corretto senza cercare il nome dell’attività.</p><ul><li>Materiali pronti per il punto vendita</li><li>Percorso costruito per il telefono</li><li>Stessa destinazione per ogni opinione</li></ul></div>
              </WobbleCard>
            </Reveal>
            <Reveal>
              <WobbleCard className="v12-product-row v12-product-row--reverse">
                <MessageMockup />
                <div className="v12-product-copy"><span>Richieste automatiche</span><h3>Se il momento passa, il sistema lo recupera.</h3><p>Trovatemi prepara o invia il messaggio sul canale configurato, quando ha senso per quella attività. Il titolare non deve ricordarsi ogni singola richiesta.</p><ul><li>WhatsApp, SMS ed email</li><li>Consegna e lettura visibili</li><li>Promemoria misurati, mai aggressivi</li></ul></div>
              </WobbleCard>
            </Reveal>
          </div>
        </section>

        <section id="agenti" className="v12-agents">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="03" label="Agenti AI" title="Tre agenti. Una sola materia prima: la verità dei clienti." body="Ognuno prende la stessa esperienza reale e la usa per uno scopo diverso: farti capire, curare la relazione, distribuire la prova." /></Reveal>
            <StickyReveal items={agents} />
          </div>
        </section>

        <section className="v12-lamp-cta">
          <div className="v12-lamp" aria-hidden="true"><i /><span /></div>
          <Reveal className="v12-wrap v12-lamp-cta__inner"><small>UN SOLO SISTEMA</small><h2>Una recensione non dovrebbe fermarsi a cinque stelle.</h2><p>Può diventare risposta, prova sociale, contenuto e una ragione in più per scegliere te.</p><button className="v12-yellow-button" type="button" onClick={() => { setDemoStep(0); setDemoOpen(true); }}>Guarda il flusso completo →</button></Reveal>
        </section>

        <section className="v12-system">
          <BackgroundBeams />
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="04" label="Il sistema" title="Ogni prova accende il passaggio successivo." body="Il valore non sta in un singolo automatismo. Sta nel modo in cui ogni esperienza alimenta la successiva." /></Reveal>
            <Reveal><SystemHub /></Reveal>
            <TracingBeam className="v12-system-steps">
              {systemSteps.map(([number, title, body], index) => <Reveal key={number} delay={index * 0.04}><article><b>{number}</b><div><h3>{title}</h3><p>{body}</p></div><span>{index === systemSteps.length - 1 ? '↻' : '↓'}</span></article></Reveal>)}
            </TracingBeam>
          </div>
        </section>

        <section className="v12-use-cases">
          <div className="v12-wrap">
            <Reveal><SectionHead dark label="Dove entra nella giornata" title="Stesso motore. Momenti diversi." body="Non tutte le attività chiedono una recensione nello stesso modo. Il sistema si adatta al momento in cui il cliente percepisce il valore." /></Reveal>
            <div className="v12-bento">
              <WobbleCard className="v12-bento-card v12-bento-card--wide"><span>BAR E RISTORAZIONE</span><h3>Il tap arriva prima del conto.</h3><p>Il cliente è ancora al tavolo o al bancone: QR e NFC trasformano quel momento in una recensione semplice.</p><div className="v12-bento-visual"><i>☕</i><b>TOCCA</b><span>★★★★★</span></div></WobbleCard>
              <CardSpotlight className="v12-bento-card"><span>STUDI E SERVIZI</span><h3>Il messaggio arriva dopo.</h3><p>Una richiesta discreta raggiunge il cliente quando ha avuto il tempo di valutare davvero il servizio.</p><div className="v12-bento-message">Grazie per esserti affidato a noi. Ti va di raccontarlo?<small>✓✓ 10:42</small></div></CardSpotlight>
              <CardSpotlight className="v12-bento-card"><span>PIÙ SEDI</span><h3>Una regia, più punti.</h3><p>Ogni sede mantiene la propria voce, mentre volumi, canali e stato restano leggibili insieme.</p><div className="v12-location-stack"><i>FORMIA <b>18</b></i><i>GAETA <b>12</b></i><i>LATINA <b>21</b></i></div></CardSpotlight>
            </div>
            <p className="v12-use-cases__note">I visual mostrano casi d’uso, non risultati attribuiti a clienti reali.</p>
          </div>
        </section>

        <section className="v12-onboarding">
          <div className="v12-wrap">
            <Reveal><SectionHead index="05" label="Come si parte" title="Tre mosse. Non tre mesi." body="La configurazione segue l’attività reale: ciò che fai, quando chiedere e cosa vuoi controllare." /></Reveal>
            <TracingBeam className="v12-onboarding__steps">
              {[
                ['01', 'Raccontaci l’attività', 'Colleghiamo la scheda, definiamo servizi, tono e luoghi della richiesta.', 'GIORNI 1–2'],
                ['02', 'Accendiamo i punti di raccolta', 'Prepariamo QR, NFC e messaggi per i momenti che hai davvero.', 'GIORNI 3–7'],
                ['03', 'Controlli ciò che il sistema prepara', 'Risposte, contenuti e richieste entrano nel ritmo scelto.', 'DAL GIORNO 7'],
              ].map(([number, title, body, time], index) => <Reveal key={number} delay={index * 0.08}><article><b>{number}</b><div><h3>{title}</h3><p>{body}</p></div><span>{time}</span></article></Reveal>)}
            </TracingBeam>
          </div>
        </section>

        <section id="prezzi" className="v12-pricing">
          <div className="v12-wrap">
            <Reveal><SectionHead index="06" label="Prezzi" title="Scegli il ritmo, non un mucchio di funzioni." body="Tre livelli per valutare la stessa struttura commerciale del riferimento, dal singolo punto alla rete locale." /></Reveal>
            <Reveal><div className="v12-concept-note"><b>Listino concept V12.</b><span>Serve a valutare architettura e percezione. Non sostituisce l’offerta approvata e non apre pagamenti.</span></div></Reveal>
            <Reveal><div className="v12-billing" role="group" aria-label="Periodo di fatturazione"><button type="button" className={!annual ? 'is-active' : ''} aria-pressed={!annual} onClick={() => setAnnual(false)}>Mensile</button><button type="button" className={annual ? 'is-active' : ''} aria-pressed={annual} onClick={() => setAnnual(true)}>Annuale</button><span>Fino a 960 € di differenza</span></div></Reveal>
            <div className="v12-pricing__grid">
              {plans.map((plan, index) => (
                <Reveal key={plan.name} delay={index * 0.1}>
                  <CardSpotlight className={`v12-price-card ${plan.popular ? 'v12-price-card--popular' : ''}`}>
                    {plan.popular && <span className="v12-popular">PIÙ SCELTO NEL CONCEPT</span>}
                    <header><small>{plan.scope}</small><h3>{plan.name}</h3><p>{plan.description}</p></header>
                    <div className="v12-price"><span>€</span><AnimatePresence mode="wait"><motion.b key={annual ? plan.annual : plan.monthly} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{annual ? plan.annual : plan.monthly}</motion.b></AnimatePresence><em>/ mese</em><small>{annual ? 'fatturazione annuale' : 'fatturazione mensile'}</small></div>
                    <div className="v12-saving">{annual ? plan.saving : 'Flessibilità mensile'}</div>
                    <ul>{plan.features.map((feature) => <li key={feature}><i>✓</i>{feature}</li>)}</ul>
                    <button className="v12-black-button" type="button" onClick={openTrial}>Simula questo piano →</button>
                    <small>14 giorni · Nessuna carta · Preview</small>
                  </CardSpotlight>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="v12-faq">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="07" label="Domande frequenti" title="Quello che vorresti sapere prima di provarlo." /></Reveal>
            <Reveal><div className="v12-faq__list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></Reveal>
          </div>
        </section>

        <section className="v12-final-cta">
          <Spotlight className="v12-final-spotlight" /><BackgroundBeams />
          <Reveal className="v12-wrap v12-final-cta__inner"><span>14 GIORNI · PROVA GUIDATA · CONCEPT</span><h2>I clienti soddisfatti esistono già. Fai lavorare la loro voce.</h2><p>Guarda il percorso sulla tua attività, senza checkout e senza modificare la produzione.</p><MovingBorderButton onClick={openTrial}>Prepara la mia prova <b>→</b></MovingBorderButton><small>Demo V12 · nessuna trasmissione di dati</small></Reveal>
        </section>
      </main>

      <footer className="v12-footer"><div className="v12-wrap"><div><a className="v12-wordmark" href="/brand-demo-v12/"><span>★</span><strong>TROVΛTEMI</strong></a><p>Recensioni, risposte e presenza per attività locali.</p></div><nav aria-label="Link del prodotto"><a href="#come-funziona">Come funziona</a><a href="#agenti">Agenti AI</a><a href="#prezzi">Prezzi</a><a href="#faq">FAQ</a></nav><div><span>V12 · noindex</span><span>Nessun acquisto reale</span><b>Ti facciamo trovare dove conta.</b></div></div><small>© 2026 Trovatemi.it · Concept isolato</small></footer>

      <AnimatePresence>{mobileCta && !trialOpen && !demoOpen && <motion.aside className="v12-mobile-cta" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}><button type="button" aria-label="Nascondi" onClick={() => { setMobileCta(false); setMobileCtaDismissed(true); }}>×</button><button className="v12-yellow-button" type="button" onClick={openTrial}>Avvia la prova guidata →</button></motion.aside>}</AnimatePresence>

      <AnimatedModal open={trialOpen} onClose={closeTrial} labelledBy="v12-trial-title">
        <div className="v12-trial-modal">
          <div className="v12-trial-modal__intro"><span>14 GIORNI · PREVIEW V12</span><h2 id="v12-trial-title">Provalo sulla tua attività.</h2><p>Il modulo simula la richiesta. Non invia dati, non crea account e non attiva pagamenti.</p><ol><li><b>01</b>Collega l’attività</li><li><b>02</b>Prepara QR e richieste</li><li><b>03</b>Configura gli agenti</li></ol></div>
          <form onSubmit={handleTrial}><label><span>Nome</span><input name="name" placeholder="Il tuo nome" required /></label><label><span>Attività</span><input name="business" placeholder="Nome dell’attività" required /></label><div><label><span>Categoria</span><input name="category" placeholder="Es. ristorante" required /></label><label><span>Città</span><input name="city" placeholder="Dove lavori" required /></label></div><label><span>Telefono o WhatsApp</span><input name="contact" type="tel" placeholder="Il numero su cui ricontattarti" required /></label><button className="v12-yellow-button" type="submit">Prepara la prova →</button><small>Nessun dato lascia questa pagina.</small>{trialDone && <motion.p className="v12-form-success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><i>✓</i><span><b>Simulazione completata.</b> Il modulo funziona, ma non ha inviato nulla.</span></motion.p>}</form>
        </div>
      </AnimatedModal>

      <AnimatedModal open={demoOpen} onClose={closeDemo} labelledBy="v12-demo-title">
        <div className="v12-demo-modal">
          <header><span>DEMO INTERATTIVA · NESSUNA AZIONE REALE</span><h2 id="v12-demo-title">Da esperienza privata a prova che lavora.</h2></header>
          <div className="v12-demo-modal__grid"><ol>{['Richiesta', 'Recensione', 'Risposta', 'Contenuto'].map((label, index) => <li key={label}><button className={demoStep === index ? 'is-active' : ''} type="button" aria-pressed={demoStep === index} onClick={() => setDemoStep(index)}><b>0{index + 1}</b><span>{label}</span></button></li>)}</ol><div className="v12-demo-stage"><AnimatePresence mode="wait"><motion.section key={demoStep} initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0)' }} exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }}><small>{['MESSAGGIO CONFIGURATO', 'ESPERIENZA DEL CLIENTE', 'AGENTE RELAZIONE', 'AGENTE DIFFUSIONE'][demoStep]}</small><strong>{['Ciao Elena, com’è andata?', '★★★★★', 'Risposta pronta da controllare.', 'La prova diventa un contenuto.'][demoStep]}</strong><p>{['Un invito semplice porta la persona al percorso corretto.', '“Precisi, disponibili e tutto spiegato bene.”', '“Grazie Elena. Siamo felici che chiarezza e disponibilità abbiano fatto la differenza.”', 'La frase reale viene adattata a post, storia e pagina locale.'][demoStep]}</p>{demoStep < 3 && <button type="button" onClick={() => setDemoStep((step) => step + 1)}>Passo successivo →</button>}</motion.section></AnimatePresence></div><aside><span>UN SOLO FLUSSO</span><p>La stessa esperienza alimenta raccolta, risposta e distribuzione senza cambiare la voce del cliente.</p><button className="v12-yellow-button" type="button" onClick={() => { setDemoOpen(false); openTrial(); }}>Provalo sulla mia attività</button></aside></div>
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
