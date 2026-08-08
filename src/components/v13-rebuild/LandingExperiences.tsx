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
import { QrNfcMockup } from '../v12/Mockups';
import type { DemoTenant } from '../../data/demo-tenants';
import type { VerticalMessaging } from '../../data/vertical-messaging';
import { DemoFrame } from './DemoFrame';
import {
  AuditModal,
  BoundaryLine,
  DemoChoiceGrid,
  Disclosure,
  PageShell,
  SectionHead,
  SiteChrome,
  SiteFooter,
} from './Shared';

export function LandingHubExperience() {
  const [auditOpen, setAuditOpen] = useState(false);
  return (
    <PageShell>
      <SiteChrome onAudit={() => setAuditOpen(true)} />
      <main id="v13a-main">
        <section className="v13a-editorial-hero v13a-sector-hub-hero">
          <Spotlight /><BackgroundBeams /><div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v13a-editorial-hero__inner">
            <p className="v12-eyebrow"><i /><i /><i /> Un sistema. Cinque giornate diverse.</p>
            <h1><TextGenerate text="Il momento giusto cambia. La prova deve restare." /></h1>
            <p>Scegli il settore più vicino alla tua attività. Ogni pagina parte da una scena reale, non da un elenco di funzioni.</p>
          </div>
        </section>
        <section className="v13a-paper-section v13a-sector-chooser"><div className="v12-wrap"><SectionHead index="01" label="Settori" title="Dove si perde oggi la buona intenzione del cliente?" /><DemoChoiceGrid linkPrefix="/per" /></div></section>
      </main>
      <SiteFooter />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </PageShell>
  );
}

export function VerticalLandingExperience({ demo, message }: { demo: DemoTenant; message: VerticalMessaging }) {
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <PageShell>
      <SiteChrome onAudit={() => setAuditOpen(true)} />
      <main id="v13a-main">
        <section className="v13a-editorial-hero v13a-vertical-hero">
          <Spotlight /><BackgroundBeams /><div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v13a-detail-hero-grid">
            <div>
              <a className="v13a-back-link" href="/per/">← Tutti i settori</a>
              <p className="v12-eyebrow"><i /><i /><i /> Trovatemi per {demo.sectorLabel}</p>
              <h1><TextGenerate text={message.landingHeadline} /></h1>
              <p>{message.landingLede}</p>
              <div className="v13a-hero-actions"><MovingBorderButton onClick={() => setAuditOpen(true)}>Fammi vedere cosa trova un cliente <span>→</span></MovingBorderButton><a className="v12-play-button" href="#demo-settore"><i>▶</i> Guarda la demo per {demo.shortName}</a></div>
            </div>
            <WobbleCard className="v13a-moment-card"><span aria-hidden="true">{demo.icon}</span><small>IL MOMENTO GIUSTO</small><h2>{message.moment}</h2><p>Qui la soddisfazione è ancora precisa. Qui la richiesta può avere senso.</p></WobbleCard>
          </div>
        </section>

        <section className="v13a-paper-section v13a-vertical-scene">
          <div className="v12-wrap v13a-scene-grid">
            <Reveal><SectionHead index="01" label="La scena" title={message.sceneTitle} body={message.sceneBody} /></Reveal>
            <CardSpotlight><span>IL PUNTO</span><blockquote>{message.objection}</blockquote></CardSpotlight>
          </div>
        </section>

        <section className="v12-collection v13a-vertical-mechanism">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="02" label="Il meccanismo" title="La richiesta entra nella giornata. La prova resta fuori." body="Trovatemi prepara il gesto, il percorso e il controllo senza chiederti di trasformare ogni servizio in una campagna." /></Reveal>
            <div className="v13a-mechanism-grid">
              <WobbleCard className="v13a-vertical-visual"><QrNfcMockup /></WobbleCard>
              <TracingBeam className="v13a-vertical-steps">
                <article><b>01</b><div><h3>Momento</h3><p>{message.moment}</p></div></article>
                <article><b>02</b><div><h3>Gesto</h3><p>NFC, QR o messaggio concordato aprono il percorso corretto.</p></div></article>
                <article><b>03</b><div><h3>Prova</h3><p>Recensione, risposta e contenuti restano leggibili nello stesso sistema.</p></div></article>
                <article><b>04</b><div><h3>Controllo umano</h3><p>Chris configura il sistema e guarda con te cosa succede davvero.</p></div></article>
              </TracingBeam>
            </div>
          </div>
        </section>

        <section id="demo-settore" className="v13a-dark-section v13a-landing-demo">
          <div className="v12-wrap">
            <Reveal><SectionHead dark index="03" label={`Demo · ${demo.shortName}`} title="Non immaginarlo. Aprilo." body={message.demoLens} /></Reveal>
            <DemoFrame demo={demo} intro={message.demoLens} surface="landing" />
            <Disclosure />
          </div>
        </section>

        <section className="v12-final-cta v13a-vertical-final">
          <Spotlight className="v12-final-spotlight" /><BackgroundBeams />
          <Reveal className="v12-wrap v12-final-cta__inner"><span>IL PROFILO REALE</span><h2>ORA GUARDIAMO COSA TROVA UN CLIENTE.</h2><p>Partiamo dal profilo reale. Se il problema esiste, Chris ti mostra il passo successivo. Nessun trial viene attivato automaticamente.</p><MovingBorderButton onClick={() => setAuditOpen(true)}>Fammi vedere cosa trova un cliente <b>→</b></MovingBorderButton><a className="v13a-final-demo-link" href={`/demo/${demo.id}/`}>Guarda la demo per {demo.shortName} →</a><BoundaryLine /></Reveal>
        </section>
      </main>
      <SiteFooter />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </PageShell>
  );
}
