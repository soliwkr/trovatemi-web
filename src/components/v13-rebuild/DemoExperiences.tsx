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
import type { DemoTenant } from '../../data/demo-tenants';
import { demoTenants, getDemoUrl } from '../../data/demo-tenants';
import type { VerticalMessaging } from '../../data/vertical-messaging';
import { getVerticalMessaging } from '../../data/vertical-messaging';
import { DemoFrame } from './DemoFrame';
import {
  AuditModal,
  DemoChoiceCard,
  DemoChoiceGrid,
  Disclosure,
  PageShell,
  SectionHead,
  SiteChrome,
  SiteFooter,
  Wordmark,
} from './Shared';

export function DemoHubExperience() {
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <PageShell>
      <SiteChrome onAudit={() => setAuditOpen(true)} />
      <main id="v13a-main">
        <section className="v13a-editorial-hero v13a-demo-hub-hero">
          <Spotlight />
          <BackgroundBeams />
          <div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v13a-editorial-hero__inner">
            <p className="v12-eyebrow"><i /><i /><i /> Cinque attività dimostrative. Un solo sistema.</p>
            <h1><TextGenerate text="Guarda il prodotto mentre lavora." /></h1>
            <p>Scegli l'attività più vicina alla tua e naviga un ambiente reale con dati costruiti per la dimostrazione. Non serve un account e non puoi modificare profili veri.</p>
            <a className="v12-play-button" href="#scegli-demo"><i>↓</i> Scegli un contesto</a>
          </div>
        </section>

        <section id="scegli-demo" className="v13a-paper-section v13a-demo-chooser">
          <div className="v12-wrap">
            <Reveal><SectionHead index="01" label="Scegli il contesto" title="La funzione è la stessa. Il momento in cui serve cambia." body="Non cercare tutte le funzioni. Segui il percorso: richiesta, recensione, risposta, prova pubblica." /></Reveal>
            <DemoChoiceGrid />
            <Disclosure />
          </div>
        </section>

        <section className="v13a-dark-section v13a-demo-rules">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="02" label="Prima di entrare" title="È il prodotto vero. Non sono risultati veri." /></Reveal>
            <div className="v13a-rule-grid">
              <CardSpotlight><b>01</b><h3>Puoi navigare.</h3><p>Menu, viste e dati dimostrativi ti permettono di capire il prodotto senza collegare un'attività.</p></CardSpotlight>
              <CardSpotlight><b>02</b><h3>Non puoi toccare profili veri.</h3><p>La dimostrazione è separata dagli account dei clienti e non pubblica azioni reali.</p></CardSpotlight>
              <CardSpotlight><b>03</b><h3>Puoi portarla con te.</h3><p>Ogni settore ha una pagina autonoma, una biolink e strumenti riservati alla presentazione.</p></CardSpotlight>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </PageShell>
  );
}

export function DemoDetailExperience({ demo, message }: { demo: DemoTenant; message: VerticalMessaging }) {
  const [auditOpen, setAuditOpen] = useState(false);
  const related = demoTenants.filter((item) => item.id !== demo.id).slice(0, 2);

  const scrollToDemo = () => document.getElementById('dimostrazione')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <PageShell>
      <div className="v13a-standard-only"><SiteChrome onAudit={() => setAuditOpen(true)} /></div>
      <div className="v13a-live-only v13a-live-bar"><Wordmark href="/demo/" /><p>{message.demoLens}</p></div>

      <main id="v13a-main" className="v13a-demo-detail">
        <section className="v13a-editorial-hero v13a-demo-detail-hero v13a-standard-only">
          <Spotlight />
          <BackgroundBeams />
          <div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v13a-detail-hero-grid">
            <div>
              <a className="v13a-back-link" href="/demo/">← Tutte le dimostrazioni</a>
              <p className="v12-eyebrow"><i /><i /><i /> Dimostrazione per {demo.sectorLabel} · dati dimostrativi</p>
              <h1><TextGenerate text={message.landingHeadline} /></h1>
              <p>Entra nel sistema e guarda come vengono organizzate richieste, recensioni, risposte e contenuti. Nessuna azione raggiunge attività o clienti reali.</p>
              <div className="v13a-hero-actions">
                <MovingBorderButton onClick={scrollToDemo}>Apri la dimostrazione <span>↓</span></MovingBorderButton>
                <a className="v12-ghost-button" href={getDemoUrl(demo)} target="_blank" rel="noopener noreferrer">Apri a schermo intero ↗</a>
              </div>
            </div>
            <WobbleCard className="v13a-moment-card"><span aria-hidden="true">{demo.icon}</span><small>IL MOMENTO GIUSTO</small><h2>{message.moment}</h2><p>{message.demoLens}</p></WobbleCard>
          </div>
        </section>

        <section id="dimostrazione" className="v13a-demo-stage-section">
          <div className="v12-wrap">
            <div className="v13a-demo-stage-heading v13a-standard-only"><div><span>DIMOSTRAZIONE {demo.shortName}</span><h2>Apri. Segui il percorso. Guarda cosa resta leggibile.</h2></div><p>{message.demoLens}</p></div>
            <DemoFrame demo={demo} intro={message.demoLens} autoload showCode surface="demo" />
          </div>
        </section>

        <div className="v13a-standard-only">
          <section className="v13a-paper-section v13a-walkthrough">
            <div className="v12-wrap">
              <Reveal><SectionHead index="02" label="Percorso consigliato · 3 minuti" title="Se non sai dove cliccare, parti da qui." /></Reveal>
              <TracingBeam className="v13a-walkthrough-list">
                {demo.walkthrough.map((step, index) => <article key={step.label}><b>0{index + 1}</b><div><small>{step.label}</small><h3>{step.title}</h3><p>{step.body}</p></div></article>)}
              </TracingBeam>
            </div>
          </section>

          <section className="v13a-dark-section v13a-demo-context">
            <div className="v12-wrap v13a-context-grid">
              <Reveal><SectionHead dark index="03" label="Il contesto" title={message.sceneTitle} body={message.sceneBody} /></Reveal>
              <CardSpotlight><span>OBIEZIONE REALE</span><blockquote>{message.objection}</blockquote><div><a href={`/per/${demo.id}/`}>Apri la landing del settore →</a><a href={`/link/${demo.id}/`}>Apri la biolink →</a></div></CardSpotlight>
            </div>
          </section>

          <section className="v13a-paper-section v13a-related">
            <div className="v12-wrap">
              <Reveal><SectionHead index="04" label="Confronta" title="Stesso sistema. Un'altra giornata reale." /></Reveal>
              <div className="v13a-related-grid">
                {related.map((item) => {
                  const itemMessage = getVerticalMessaging(item.id);
                  return itemMessage ? <DemoChoiceCard key={item.id} demo={item} message={itemMessage} href={`/demo/${item.id}/`} /> : null;
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="v13a-standard-only"><SiteFooter /></div>
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </PageShell>
  );
}
