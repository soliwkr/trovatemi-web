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
      <div className="v12-concept-bar"><span>V13 · ACETERNITY REBUILD</span><span>PREVIEW ISOLATA · DATI DIMOSTRATIVI · NOINDEX</span></div>
      <header className="v12-nav-shell">
        <nav className="v12-nav v12-wrap" aria-label="Navigazione principale">
          <Wordmark />
          <div className="v12-nav__links">
            <a href="/brand-demo-v13/#come-funziona">Come funziona</a>
            <a href="/demo/">Demo</a>
            <a href="/brand-demo-v13/#soluzioni">Soluzioni</a>
            <a href="/per/">Settori</a>
          </div>
          <div className="v12-nav__actions">
            <a className="v12-ghost-button" href="/demo/">Guarda una demo</a>
            <button className="v12-yellow-button" type="button" onClick={onAudit}>Analizza la mia attività</button>
          </div>
          <button className="v12-menu-button" type="button" aria-expanded={menuOpen} aria-label="Apri il menu" onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
        </nav>
        {menuOpen && (
          <div className="v12-mobile-menu">
            <a href="/brand-demo-v13/#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</a>
            <a href="/demo/" onClick={() => setMenuOpen(false)}>Demo</a>
            <a href="/brand-demo-v13/#soluzioni" onClick={() => setMenuOpen(false)}>Soluzioni</a>
            <a href="/per/" onClick={() => setMenuOpen(false)}>Settori</a>
            <button className="v12-yellow-button" type="button" onClick={() => { setMenuOpen(false); onAudit(); }}>Analizza la mia attività</button>
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
        <div><Wordmark /><p>Un sistema installato e seguito per trasformare clienti soddisfatti in prove pubbliche.</p></div>
        <nav aria-label="Link del prodotto"><a href="/brand-demo-v13/#come-funziona">Come funziona</a><a href="/demo/">Demo reali</a><a href="/per/">Settori</a><a href="/link/">Biolink</a></nav>
        <div><span>V13 · noindex</span><span>Nessun acquisto dal sito</span><b>Se parli con Trovatemi, parli con Chris.</b></div>
      </div>
      <small>© 2026 Trovatemi.it · Preview isolata · Produzione invariata</small>
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
        <div className="v13a-audit-modal__intro"><span>ANALISI DIMOSTRATIVA</span><h2 id="v13a-audit-title">Partiamo dal profilo reale.</h2><p>Guardiamo cosa trova oggi un cliente e capiamo se esiste davvero qualcosa da correggere. In questa preview il modulo non invia dati.</p><ol><li><b>01</b>Attività e servizio</li><li><b>02</b>Città e profilo</li><li><b>03</b>Confronto con Chris</li></ol></div>
        <form onSubmit={submit}>
          <label><span>Attività</span><input name="business" placeholder="Nome dell’attività" autoFocus required /></label>
          <div><label><span>Servizio principale</span><input name="service" placeholder="Es. centro benessere" required /></label><label><span>Città</span><input name="city" placeholder="Dove lavori" required /></label></div>
          <label><span>Telefono o WhatsApp</span><input name="contact" type="tel" placeholder="Il numero su cui ricontattarti" required /></label>
          <button className="v12-yellow-button" type="submit">Prepara l’analisi →</button>
          <small>Nessun dato lascia questa pagina.</small>
          {done && <p className="v12-form-success"><i>✓</i><span><b>Simulazione completata.</b> Il flusso è pronto, ma non ha inviato nulla.</span></p>}
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
        <p>Il numero WhatsApp ufficiale non è ancora collegato alla preview. Nella versione definitiva questo pulsante aprirà direttamente la conversazione con Chris.</p>
        <blockquote>Ciao Chris, vorrei vedere cosa trova oggi un cliente quando cerca la mia attività.</blockquote>
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
