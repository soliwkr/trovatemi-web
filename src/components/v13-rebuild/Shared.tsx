import type { PropsWithChildren, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { AnimatedModal, CardSpotlight } from '../v12/Aceternity';
import type { DemoTenant } from '../../data/demo-tenants';
import { demoTenants } from '../../data/demo-tenants';
import type { VerticalMessaging } from '../../data/vertical-messaging';
import { getVerticalMessaging } from '../../data/vertical-messaging';
import { siteCopy } from '../../data/site-copy';

export function Wordmark({ href = '/brand-demo-v13/' }: { href?: string }) {
  return <a className="v12-wordmark" href={href}><span>★</span><strong>TROVΛTEMI</strong></a>;
}

export function SiteChrome({ onAudit }: { onAudit: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="v13a-site-chrome">
      <a className="v12-skip" href="#v13a-main">Vai al contenuto</a>
      <div className="v12-concept-bar"><span>CLIMBO WHITE-LABEL RESET</span><span>PREVIEW ISOLATA · UN SOLO PRODOTTO · NOINDEX</span></div>
      <header className="v12-nav-shell">
        <nav className="v12-nav v12-wrap" aria-label="Navigazione principale">
          <Wordmark />
          <div className="v12-nav__links">
            <a href="/brand-demo-v13/#come-funziona">Come funziona</a>
            <a href="/brand-demo-v13/#cosa-include">Cosa include</a>
            <a href="/brand-demo-v13/#demo-reale">Demo</a>
            <a href="/brand-demo-v13/#prezzo">Prezzo</a>
          </div>
          <div className="v12-nav__actions">
            <a className="v12-ghost-button" href="#demo-reale">Guarda il sistema</a>
            <button className="v12-yellow-button" type="button" onClick={onAudit}>{siteCopy.primaryCta}</button>
          </div>
          <button className="v12-menu-button" type="button" aria-expanded={menuOpen} aria-label="Apri il menu" onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
        </nav>
        {menuOpen && (
          <div className="v12-mobile-menu">
            <a href="/brand-demo-v13/#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</a>
            <a href="/brand-demo-v13/#cosa-include" onClick={() => setMenuOpen(false)}>Cosa include</a>
            <a href="/brand-demo-v13/#demo-reale" onClick={() => setMenuOpen(false)}>Demo</a>
            <a href="/brand-demo-v13/#prezzo" onClick={() => setMenuOpen(false)}>Prezzo</a>
            <button className="v12-yellow-button" type="button" onClick={() => { setMenuOpen(false); onAudit(); }}>{siteCopy.primaryCta}</button>
          </div>
        )}
      </header>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="v12-footer v13a-site-footer">
      <div className="v12-wrap">
        <div><Wordmark /><p>Recensioni Google, risposte e distribuzione della prova. Un solo sistema installato e seguito per te.</p></div>
        <nav aria-label="Link del prodotto"><a href="/brand-demo-v13/#come-funziona">Come funziona</a><a href="/brand-demo-v13/#cosa-include">Cosa include</a><a href="/brand-demo-v13/#demo-reale">Demo</a><a href="/brand-demo-v13/#prezzo">€149/mese</a></nav>
        <div><span>Preview · noindex</span><span>Nessun checkout attivo</span><b>Se parli con Trovatemi, parli con Chris.</b></div>
      </div>
      <small>© 2026 Trovatemi.it · Branch di reset · Produzione invariata</small>
    </footer>
  );
}

export function SectionHead({
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

export function AuditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) setDone(false);
  }, [open]);

  const submit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setDone(true);
  };

  return (
    <AnimatedModal open={open} onClose={onClose} labelledBy="v13a-audit-title">
      <div className="v13a-audit-modal">
        <div className="v13a-audit-modal__intro"><span>VEDIAMO IL TUO CASO</span><h2 id="v13a-audit-title">Partiamo dalla tua attività.</h2><p>Guardiamo insieme come chiedi oggi le recensioni e cosa succede dopo. In questa preview il modulo non invia dati.</p><ol><li><b>01</b>Attività e servizio</li><li><b>02</b>Come chiedi oggi</li><li><b>03</b>Demo con Chris</li></ol></div>
        <form onSubmit={submit}>
          <label><span>Attività</span><input name="business" placeholder="Nome dell’attività" autoFocus required /></label>
          <div><label><span>Servizio principale</span><input name="service" placeholder="Es. parrucchiere" required /></label><label><span>Città</span><input name="city" placeholder="Dove lavori" required /></label></div>
          <label><span>Telefono o WhatsApp</span><input name="contact" type="tel" placeholder="Il numero su cui ricontattarti" required /></label>
          <button className="v12-yellow-button" type="submit">Prepara la demo →</button>
          <small>Nessun dato lascia questa pagina.</small>
          {done && <p className="v12-form-success"><i>✓</i><span><b>Simulazione completata.</b> Nessun dato è stato inviato.</span></p>}
        </form>
      </div>
    </AnimatedModal>
  );
}

export function WhatsAppModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatedModal open={open} onClose={onClose} labelledBy="v13a-whatsapp-title">
      <div className="v13a-whatsapp-modal">
        <span>CONTATTO DIRETTO</span>
        <h2 id="v13a-whatsapp-title">Il messaggio è pronto.</h2>
        <p>Il numero WhatsApp ufficiale non è collegato alla preview. Nella versione definitiva il pulsante aprirà direttamente la conversazione con Chris.</p>
        <blockquote>Ciao Chris, vorrei vedere come Trovatemi può gestire recensioni, risposte e contenuti della mia attività.</blockquote>
        <button className="v12-black-button" type="button" onClick={onClose}>Ho capito</button>
      </div>
    </AnimatedModal>
  );
}

export function Disclosure() {
  return <p className="v13a-disclosure"><i /> Le attività e i dati delle demo sono dimostrativi. Il sistema che puoi navigare è reale.</p>;
}

export function DemoChoiceGrid({ linkPrefix = '/demo' }: { linkPrefix?: '/demo' | '/link' | '/per' }) {
  return (
    <div className="v13a-choice-grid">
      {demoTenants.map((demo) => {
        const message = getVerticalMessaging(demo.id);
        if (!message) return null;
        return <DemoChoiceCard key={demo.id} demo={demo} message={message} href={`${linkPrefix}/${demo.id}/`} />;
      })}
    </div>
  );
}

export function DemoChoiceCard({ demo, message, href }: { demo: DemoTenant; message: VerticalMessaging; href: string }) {
  return (
    <CardSpotlight className="v13a-choice-card">
      <header><span aria-hidden="true">{demo.icon}</span><small>{demo.sectorLabel}</small></header>
      <h3>{message.bioHeadline}</h3>
      <p>{message.bioBody}</p>
      <a href={href}><span>Guarda questo contesto</span><b>→</b></a>
    </CardSpotlight>
  );
}

export function PageShell({ children }: PropsWithChildren) {
  return <div className="v13a-page">{children}</div>;
}

export function BoundaryLine() {
  return <p className="v13a-boundary-line">{siteCopy.boundary}</p>;
}
