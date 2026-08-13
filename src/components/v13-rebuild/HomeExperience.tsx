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
import { EchoMockup, QrNfcMockup, ReplyMockup, ReviewHeroMockup } from '../v12/Mockups';
import { getDemoTenant } from '../../data/demo-tenants';
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
  ['01', 'Il cliente è soddisfatto', 'Il servizio è appena finito e il momento è ancora vivo.'],
  ['02', 'Lascia una recensione Google', 'NFC o QR aprono il percorso senza far cercare il profilo.'],
  ['03', 'La recensione riceve una risposta', 'Il tono resta coerente con l’attività e l’output resta controllabile.'],
  ['04', 'La prova diventa contenuto', 'Le recensioni migliori possono essere trasformate in post e formati riutilizzabili.'],
  ['05', 'La prova viene distribuita', 'Google Business Profile, Instagram, Facebook e TikTok lavorano sulla stessa esperienza reale.'],
] as const;

const channels = ['Google Business Profile', 'Instagram', 'Facebook', 'TikTok'] as const;

export default function HomeExperience() {
  const [auditOpen, setAuditOpen] = useState(false);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const demo = getDemoTenant('wellness-spa');

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
              <p className="v12-eyebrow"><i /><i /><i /> Un solo sistema. Installato e seguito per te.</p>
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
          <div className="v12-hero-flow" aria-label="Il flywheel Trovatemi"><div className="v12-wrap"><span>CLIENTE SODDISFATTO</span><i>→</i><b>RECENSIONE</b><i>→</i><b>RISPOSTA</b><i>→</i><b>CONTENUTO</b><i>→</i><strong>NUOVA PROVA</strong></div></div>
        </section>

        <section className="v13a-scene">
          <div className="v12-wrap">
            <Reveal><SectionHead index="01" label="Il problema" title="Il cliente ti fa il complimento. Poi quella prova sparisce." body="Ogni giorno hai clienti che escono soddisfatti. Senza un gesto semplice nel momento giusto, gran parte di quella soddisfazione non arriva mai online." /></Reveal>
            <WobbleCard className="v13a-scene-card">
              <span>LA FRASE CHE CONOSCI</span>
              <blockquote>«Sì sì, la recensione la faccio dopo.»</blockquote>
              <p>Trovatemi serve a togliere attrito tra quel momento e una prova pubblica reale.</p>
            </WobbleCard>
          </div>
        </section>

        <section id="come-funziona" className="v12-collection v13a-mechanism">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="02" label="Il sistema" title="Una recensione non deve finire su Google e basta." body="La stessa esperienza può essere raccolta, gestita e riutilizzata senza chiederti di inventare contenuti ogni volta." /></Reveal>
            <TracingBeam className="v12-system-steps v13a-process-steps">
              {processSteps.map(([number, title, body]) => <article key={number}><b>{number}</b><div><h3>{title}</h3><p>{body}</p></div><span>↓</span></article>)}
            </TracingBeam>
          </div>
        </section>

        <section id="cosa-include" className="v13a-comparison">
          <div className="v12-wrap">
            <Reveal><SectionHead index="03" label="Cosa installiamo" title="Raccogli. Rispondi. Riutilizza." body="Tre movimenti dello stesso servizio. Non tre prodotti da scegliere." /></Reveal>

            <WobbleCard className="v12-product-row">
              <QrNfcMockup />
              <div className="v12-product-copy"><span>01 / RACCOGLI</span><h3>Il momento giusto entra nella giornata reale.</h3><p>Prepariamo NFC e QR per il punto in cui il cliente è davvero soddisfatto: bancone, cassa, reception o fine servizio.</p><ul><li>Percorso semplice verso la recensione</li><li>Zero review gating</li><li>Una sola attività, configurata bene</li></ul></div>
            </WobbleCard>

            <WobbleCard className="v12-product-row v12-product-row--reverse">
              <ReplyMockup />
              <div className="v12-product-copy"><span>02 / RISPONDI</span><h3>Ogni nuova recensione può ricevere attenzione.</h3><p>Il sistema prepara una risposta coerente con tono e contesto. L’automazione resta un mezzo: la voce dell’attività viene prima.</p><ul><li>Risposte specifiche, non copia-incolla</li><li>Controllo degli output</li><li>Google Business Profile collegato</li></ul></div>
            </WobbleCard>

            <WobbleCard className="v12-product-row">
              <EchoMockup />
              <div className="v12-product-copy"><span>03 / RIUTILIZZA</span><h3>Le recensioni migliori continuano a lavorare.</h3><p>La voce del cliente può diventare contenuto e venire distribuita sui canali collegati senza trasformare Trovatemi in un’agenzia social.</p><ul>{channels.map((channel) => <li key={channel}>{channel}</li>)}</ul></div>
            </WobbleCard>
          </div>
        </section>

        <section className="v13a-chris">
          <div className="v12-wrap">
            <Reveal><SectionHead index="04" label="Done for you" title={siteCopy.humanPromise} body="Colleghiamo il profilo, prepariamo i supporti, configuriamo il flusso e controlliamo che venga davvero usato. Il cliente non compra un’altra dashboard da studiare." /></Reveal>
            <WobbleCard className="v13a-chris-card">
              <div className="v13a-chris-sign"><span>★</span><strong>CHRIS</strong><small>Trovatemi.it</small></div>
              <div><h3>Una visita per partire. Poi il sistema deve alleggerirti, non creare lavoro.</h3><p>Il setup è locale e concreto. Dopo l’installazione, assistenza e controllo possono essere gestiti quasi interamente da remoto.</p><button className="v12-black-button" type="button" onClick={() => setWhatsAppOpen(true)}>{siteCopy.contactCta} →</button></div>
            </WobbleCard>
          </div>
        </section>

        {demo && (
          <section id="demo-reale" className="v12-use-cases v13a-home-demo">
            <div className="v12-wrap">
              <Reveal><SectionHead dark index="05" label="Demo" title="Guarda il sistema in un contesto vicino al beauty." body="La demo wellness usa dati costruiti apposta. Il sistema che organizza recensioni, risposte e contenuti è reale." /></Reveal>
              <DemoFrame demo={demo} intro="Segui il percorso: richiesta, recensione, risposta e riutilizzo della prova." surface="home" />
              <Disclosure />
            </div>
          </section>
        )}

        <section id="prezzo" className="v12-pricing v13a-plans">
          <div className="v12-wrap">
            <Reveal><SectionHead index="06" label="Un piano" title="Un solo servizio, senza livelli da scegliere." body="Il Super MVP parte con una attività, una configurazione e un risultato operativo leggibile." /></Reveal>
            <div className="v13a-plan-grid">
              <CardSpotlight className="v13a-plan-card v13a-plan-card--dark">
                <span>TROVATEMI · CLIMBO WHITE LABEL</span>
                <h3>€{siteCopy.price}<small>/mese</small></h3>
                <strong>Recensioni → risposte → contenuti → distribuzione.</strong>
                <p>Una location. Setup fatto per te. Mensile. Nessun catalogo da decifrare.</p>
                <ul><li>Google Business Profile</li><li>NFC + QR</li><li>Raccolta recensioni senza gating</li><li>Risposte alle recensioni</li><li>Contenuti dalle migliori recensioni</li><li>Google, Instagram, Facebook e TikTok quando collegati</li><li>Installazione e assistenza</li></ul>
                <button className="v12-yellow-button" type="button" onClick={() => setAuditOpen(true)}>Voglio vedere il mio caso →</button>
              </CardSpotlight>
            </div>
            <p className="v13a-boundary-line">Prezzo candidato della branch di reset. Nessun checkout è attivo e la produzione resta invariata.</p>
          </div>
        </section>

        <section className="v13a-vision">
          <Spotlight />
          <BackgroundBeams />
          <Reveal className="v12-wrap"><small>IL PRINCIPIO</small><h2>UNA BUONA ESPERIENZA DEVE CONTINUARE A LAVORARE.</h2><p>{siteCopy.vision}</p></Reveal>
        </section>

        <section id="faq" className="v12-faq">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="07" label="FAQ" title="Le cose che il servizio fa. E quelle che non promette." /></Reveal>
            <div className="v12-faq__list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="v12-final-cta">
          <Spotlight className="v12-final-spotlight" /><BackgroundBeams />
          <Reveal className="v12-wrap v12-final-cta__inner"><span>IL TUO CASO REALE</span><h2>QUANTE BUONE ESPERIENZE STAI LASCIANDO SUL BANCONE?</h2><p>Partiamo da come lavori oggi. Se il sistema ha senso per la tua attività, te lo faccio vedere sul tuo caso.</p><MovingBorderButton onClick={() => setAuditOpen(true)}>{siteCopy.primaryCta} <b>→</b></MovingBorderButton><button className="v13a-contact-link" type="button" onClick={() => setWhatsAppOpen(true)}>{siteCopy.contactCta}</button><BoundaryLine /></Reveal>
        </section>
      </main>

      <SiteFooter />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
      <WhatsAppModal open={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
    </PageShell>
  );
}
