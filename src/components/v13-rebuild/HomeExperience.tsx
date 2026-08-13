import { useState } from 'react';
import {
  BackgroundBeams,
  CardSpotlight,
  MovingBorderButton,
  Reveal,
  Spotlight,
  TextGenerate,
  TracingBeam,
  WobbleCard,
} from '../v12/Aceternity';
import { MessageMockup, QrNfcMockup, ReviewHeroMockup } from '../v12/Mockups';
import { demoTenants, getDemoTenant } from '../../data/demo-tenants';
import { getVerticalMessaging } from '../../data/vertical-messaging';
import { faqs, siteCopy } from '../../data/site-copy';
import { DemoFrame } from './DemoFrame';
import {
  AuditModal,
  BoundaryLine,
  Disclosure,
  PageShell,
  SectionHead,
  SiteChrome,
  SiteFooter,
  WhatsAppModal,
} from './Shared';

const processSteps = [
  ['01', 'Il cliente è soddisfatto', 'Il servizio si è appena concluso e l’esperienza è ancora precisa.'],
  ['02', 'Avvicina il telefono', 'NFC o QR aprono il percorso corretto senza costringerlo a cercare il profilo.'],
  ['03', 'Lascia la propria esperienza', 'Tutti ricevono lo stesso percorso, senza filtro sul voto.'],
  ['04', 'Tu e Chris vedete cosa succede', 'Richieste, recensioni e risposte restano leggibili e controllabili.'],
] as const;

export default function HomeExperience() {
  const [auditOpen, setAuditOpen] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);

  return (
    <PageShell>
      <SiteChrome onAudit={() => setAuditOpen(true)} />

      <main id="v13a-main">
        <section className="v12-hero v13a-home-hero">
          <Spotlight />
          <BackgroundBeams className="v12-hero-beams" />
          <div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v12-hero__grid">
            <div className="v12-hero__copy">
              <p className="v12-eyebrow"><i /><i /><i /> Per attività locali che lavorano bene, ma online non lo dimostrano abbastanza.</p>
              <h1><TextGenerate text={siteCopy.promise} /></h1>
              <p>{siteCopy.mechanism}</p>
              <div className="v12-hero__actions">
                <MovingBorderButton onClick={() => setAuditOpen(true)}>{siteCopy.primaryCta} <span>→</span></MovingBorderButton>
                <a className="v12-play-button" href="#demo-reale"><i>▶</i> {siteCopy.demoCta}</a>
              </div>
              <small>{siteCopy.boundary}</small>
            </div>
            <Reveal className="v12-hero__visual" delay={0.18}><ReviewHeroMockup /></Reveal>
          </div>
          <div className="v12-hero-flow" aria-label="Il percorso Trovatemi"><div className="v12-wrap"><span>PROFILO REALE</span><i>→</i><b>NFC O QR</b><i>→</i><b>RECENSIONE PUBBLICA</b><i>→</i><strong>CONTROLLO UMANO</strong></div></div>
        </section>

        <section className="v13a-scene">
          <div className="v12-wrap">
            <Reveal><SectionHead index="01" label="La scena reale" title="Ogni mese servi clienti soddisfatti. Quanti diventano una recensione?" body="Il cliente paga, ti ringrazia e dice che scriverà qualcosa più tardi. Poi esce, torna alla propria giornata e quella buona intenzione sparisce." /></Reveal>
            <WobbleCard className="v13a-scene-card">
              <span>IL COMPLIMENTO DIMENTICATO</span>
              <blockquote>«Certo, la faccio dopo.»</blockquote>
              <p>Il problema non è la qualità del tuo lavoro. È quanta qualità riesce a vedere chi ancora non ti conosce.</p>
            </WobbleCard>
          </div>
        </section>

        <section className="v13a-comparison">
          <div className="v12-wrap">
            <Reveal><SectionHead index="02" label="La scelta" title="Non significa che il concorrente lavori meglio. Online sembra più facile fidarsi di lui." body="Chi non conosce nessuna delle due attività decide con ciò che trova: quantità, freschezza, risposte e informazioni recenti." /></Reveal>
            <div className="v13a-profile-grid">
              <CardSpotlight className="v13a-profile-card">
                <small>ESEMPIO ILLUSTRATIVO</small><header><i>OC</i><div><h3>Officina Centro</h3><span>Servizio locale</span></div></header><strong>4,7 <b>★★★★★</b></strong><p>23 recensioni · ultima 5 mesi fa</p><footer>Nessuna risposta recente</footer>
              </CardSpotlight>
              <CardSpotlight className="v13a-profile-card v13a-profile-card--active">
                <small>ESEMPIO ILLUSTRATIVO</small><header><i>ON</i><div><h3>Officina Nord</h3><span>Servizio locale</span></div></header><strong>4,8 <b>★★★★★</b></strong><p>84 recensioni · ultima 3 giorni fa</p><footer>Risposte e aggiornamenti recenti</footer>
              </CardSpotlight>
            </div>
            <Reveal className="v13a-comparison-question"><p>Se non conoscessi nessuna delle due attività, quale chiameresti per prima?</p><button className="v12-yellow-button" type="button" onClick={() => setAuditOpen(true)}>Ora guardiamo il tuo confronto →</button></Reveal>
          </div>
        </section>

        <section id="come-funziona" className="v12-collection v13a-mechanism">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="03" label="Dal complimento alla prova" title="Il momento giusto esiste già. Trovatemi gli dà un seguito." body="Non chiediamo al titolare di ricordarsi tutto e non chiediamo al cliente di cercare il profilo da solo." /></Reveal>
            <WobbleCard className="v12-product-row">
              <QrNfcMockup />
              <div className="v12-product-copy"><span>NFC + QR</span><h3>Il gesto entra quando l’esperienza è ancora viva.</h3><p>Il supporto viene preparato per bancone, tavolo, cassa o reception. Il cliente avvicina il telefono e arriva al percorso corretto.</p><ul><li>Un gesto semplice nel punto giusto</li><li>Nessuna ricerca manuale del profilo</li><li>Stesso percorso per ogni opinione</li></ul></div>
            </WobbleCard>
            <WobbleCard className="v12-product-row v12-product-row--reverse">
              <MessageMockup />
              <div className="v12-product-copy"><span>DOPO IL SERVIZIO</span><h3>Quando è già uscito, arriva il messaggio concordato.</h3><p>Configuriamo canale, testo e momento. Il titolare non deve ricordarsi ogni singolo cliente e la richiesta non arriva fuori contesto.</p><ul><li>WhatsApp, SMS o email</li><li>Momento e tono definiti insieme</li><li>Stato della richiesta leggibile</li></ul></div>
            </WobbleCard>
            <TracingBeam className="v12-system-steps v13a-process-steps">
              {processSteps.map(([number, title, body]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{body}</p></div><span>↓</span></article>)}
            </TracingBeam>
          </div>
        </section>

        <section className="v13a-chris">
          <div className="v12-wrap">
            <Reveal><SectionHead index="04" label="Una persona reale" title={siteCopy.humanPromise} body="Chris collega il profilo, prepara NFC e QR, mostra al personale quando chiedere e controlla che il sistema venga davvero utilizzato." /></Reveal>
            <WobbleCard className="v13a-chris-card">
              <div className="v13a-chris-sign"><span>★</span><strong>CHRIS</strong><small>Trovatemi.it</small></div>
              <div><h3>Se chiami, risponde Chris.</h3><p>Se qualcosa si blocca, non ricevi un link a una guida: lo guardiamo insieme. Il ritratto reale verrà inserito soltanto quando sarà disponibile l’asset autorizzato.</p><button className="v12-black-button" type="button" onClick={() => setWhatsAppOpen(true)}>{siteCopy.contactCta} →</button></div>
            </WobbleCard>
          </div>
        </section>

        <section id="demo-reale" className="v12-use-cases v13a-home-demo">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="05" label="Una dimostrazione vera" title="Guarda cosa succede dopo che il cliente ha detto sì." body="Scegli un’attività simile alla tua e naviga il sistema. Recensioni, richieste, risposte e contenuti sono dimostrativi; il prodotto che li organizza è reale." /></Reveal>
            <HomeDemoShowcase />
            <Disclosure />
          </div>
        </section>

        <section id="soluzioni" className="v12-pricing v13a-plans">
          <div className="v12-wrap">
            <Reveal><SectionHead index="06" label="Due problemi diversi" title="Più recensioni sarebbero sufficienti, oppure resterebbe il problema di mantenere viva la presenza?" body="La risposta orienta la conversazione. Non sostituisce l’analisi di Chris e non apre un checkout." /></Reveal>
            <div className="v13a-plan-grid">
              <CardSpotlight className="v13a-plan-card"><span>01 / REPUTAZIONE</span><h3>TROVATO</h3><strong>Raccoglie e gestisce la prova.</strong><p>Per chi deve rendere più semplice la richiesta, riunire le recensioni e curare le risposte.</p><ul><li>NFC, QR e richieste configurate</li><li>Recensioni in un unico sistema</li><li>Risposte assistite e controllabili</li></ul><a href="/demo/sunny-cafe/">Guarda il nucleo del sistema →</a></CardSpotlight>
              <CardSpotlight className="v13a-plan-card v13a-plan-card--dark"><span>02 / PRESENZA</span><h3>INEVITABILE</h3><strong>Raccoglie, trasforma e distribuisce la prova.</strong><p>Per chi, oltre alle recensioni, deve mantenere vivi contenuti e informazioni pubbliche.</p><ul><li>Tutto ciò che fa TROVATO</li><li>Prove trasformate in contenuti</li><li>Distribuzione sui canali collegati</li></ul><a href="/demo/grand-hotel-riviera/">Guarda il ciclo completo →</a></CardSpotlight>
            </div>
            <CardSpotlight className="v13a-network-card"><span>03 / MULTI-SEDE</span><div><h3>RETE</h3><p>Coordina lo stesso sistema su più sedi, senza perdere la lettura locale.</p></div><a href="/demo/grand-hotel-riviera/">Esplora un contesto multi-servizio →</a></CardSpotlight>
          </div>
        </section>

        <section className="v13a-vision">
          <Spotlight />
          <BackgroundBeams />
          <Reveal className="v12-wrap"><small>LA VISIONE</small><h2>NON DEVI DIVENTARE VIRALE.<br />DEVI DIVENTARE INEVITABILE.</h2><p>Quando qualcuno cerca, confronta o chiede consiglio a un assistente, deve trovare prove recenti, risposte curate e informazioni abbastanza chiare da poterti scegliere.</p></Reveal>
        </section>

        <section id="faq" className="v12-faq">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="07" label="Domande frequenti" title="Prima di dirci di sì, ecco dove ti diciamo di no." /></Reveal>
            <div className="v12-faq__list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="v12-final-cta">
          <Spotlight className="v12-final-spotlight" /><BackgroundBeams />
          <Reveal className="v12-wrap v12-final-cta__inner"><span>IL PROFILO REALE</span><h2>VUOI VEDERE COSA TROVA OGGI UN CLIENTE?</h2><p>Partiamo dal tuo profilo, non da una presentazione. Guardiamo il confronto e capiamo se esiste davvero qualcosa da correggere.</p><MovingBorderButton onClick={() => setAuditOpen(true)}>Analizza la mia attività <b>→</b></MovingBorderButton><button className="v13a-contact-link" type="button" onClick={() => setWhatsAppOpen(true)}>{siteCopy.contactCta}</button><BoundaryLine /></Reveal>
        </section>
      </main>

      <SiteFooter />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
      <WhatsAppModal open={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
    </PageShell>
  );
}

function HomeDemoShowcase() {
  const [selectedId, setSelectedId] = useState('sunny-cafe');
  const selected = getDemoTenant(selectedId) ?? demoTenants[0];
  const message = getVerticalMessaging(selected.id);

  return (
    <div className="v13a-demo-showcase">
      <div className="v13a-demo-selector" role="tablist" aria-label="Scegli la demo">
        {demoTenants.map((demo) => (
          <CardSpotlight className={`v13a-demo-tab ${selected.id === demo.id ? 'is-active' : ''}`} key={demo.id}>
            <button type="button" role="tab" aria-selected={selected.id === demo.id} onClick={() => setSelectedId(demo.id)}><span>{demo.icon}</span><b>{demo.shortName}</b><small>{demo.sectorLabel}</small></button>
          </CardSpotlight>
        ))}
      </div>
      <DemoFrame key={selected.id} demo={selected} intro={message?.demoLens ?? 'Apri il sistema e segui richiesta, recensione e risposta.'} surface="home" />
    </div>
  );
}
