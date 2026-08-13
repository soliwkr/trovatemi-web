import { useState } from 'react';
import { BackgroundBeams, CardSpotlight, MovingBorderButton, Spotlight, TextGenerate } from '../v12/Aceternity';
import type { DemoTenant } from '../../data/demo-tenants';
import type { VerticalMessaging } from '../../data/vertical-messaging';
import { DemoChoiceGrid, Disclosure, WhatsAppModal, Wordmark } from './Shared';

type Props = {
  demo?: DemoTenant;
  message?: VerticalMessaging;
};

export default function BioLinkExperience({ demo, message }: Props) {
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const isVertical = Boolean(demo && message);
  const title = message?.bioHeadline ?? 'Il cliente ti sta già cercando. Vediamo cosa trova.';
  const body = message?.bioBody ?? 'Aiuto attività locali a trasformare clienti soddisfatti in recensioni e prove pubbliche. Puoi vedere il sistema oppure scrivermi direttamente.';

  const primaryAction = () => {
    if (demo) {
      window.location.assign(`/demo/${demo.id}/`);
      return;
    }
    document.getElementById('settori')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main id="v13a-main" className="v13a-bio-page">
      <Spotlight />
      <BackgroundBeams />
      <div className="v12-grid-bg" aria-hidden="true" />
      <div className="v13a-bio-shell">
        <header className="v13a-bio-identity"><Wordmark /><span>Chris · Trovatemi.it</span></header>
        <section className="v13a-bio-hero">
          <p className="v12-eyebrow"><i /><i /><i /> {demo?.sectorLabel ?? 'Attività locali · reputazione · presenza'}</p>
          <h1><TextGenerate text={title} /></h1>
          <p>{body}</p>
          <div className="v13a-bio-actions">
            <MovingBorderButton onClick={primaryAction}>{message?.bioCta ?? 'Scegli una demo reale'} <span>→</span></MovingBorderButton>
            <button className="v12-ghost-button" type="button" onClick={() => setWhatsAppOpen(true)}>Scrivi a Chris su WhatsApp</button>
          </div>
        </section>

        {isVertical ? (
          <CardSpotlight className="v13a-bio-note"><small>PERCHÉ GUARDARLA</small><p>{message?.demoLens}</p><a href="/link/">← Scegli un altro settore</a></CardSpotlight>
        ) : (
          <section id="settori" className="v13a-bio-sectors"><h2>Quale giornata assomiglia di più alla tua?</h2><DemoChoiceGrid linkPrefix="/link" /></section>
        )}
        <Disclosure />
        <footer><span>Preview isolata · noindex</span><a href="/brand-demo-v13/">Scopri Trovatemi.it →</a></footer>
      </div>
      <WhatsAppModal open={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
    </main>
  );
}
