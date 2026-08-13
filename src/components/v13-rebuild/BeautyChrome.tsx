import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import { AnimatedModal } from '../v12/Aceternity';
import { siteCopy } from '../../data/site-copy';
import { Wordmark } from './Shared';

export function BeautySiteChrome({ onAudit }: { onAudit: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="v13a-site-chrome">
    <a className="v12-skip" href="#v13a-main">Vai al contenuto</a>
    <div className="v12-concept-bar"><span>PER IL TUO SALONE</span><span>SALONI · BARBER · CENTRI ESTETICI</span></div>
    <header className="v12-nav-shell"><nav className="v12-nav v12-wrap" aria-label="Navigazione principale">
      <Wordmark />
      <div className="v12-nav__links"><a href="#come-funziona">Come funziona</a><a href="#demo-reale">Demo</a><a href="#prezzo">Prezzo</a></div>
      <div className="v12-nav__actions"><a className="v12-ghost-button" href="#demo-reale">Guarda come funziona</a><button className="v12-yellow-button" type="button" onClick={onAudit}>{siteCopy.primaryCta}</button></div>
      <button className="v12-menu-button" type="button" aria-expanded={menuOpen} aria-label="Apri il menu" onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
    </nav>{menuOpen && <div className="v12-mobile-menu"><a href="#come-funziona" onClick={() => setMenuOpen(false)}>Come funziona</a><a href="#demo-reale" onClick={() => setMenuOpen(false)}>Demo</a><a href="#prezzo" onClick={() => setMenuOpen(false)}>Prezzo</a><button className="v12-yellow-button" type="button" onClick={() => { setMenuOpen(false); onAudit(); }}>{siteCopy.primaryCta}</button></div>}</header>
  </div>;
}

export function BeautySiteFooter() {
  return <footer className="v12-footer v13a-site-footer"><div className="v12-wrap">
    <div><Wordmark /><p>Recensioni Google, risposte e contenuti dalle recensioni per saloni, barber e centri estetici.</p></div>
    <nav aria-label="Link del prodotto"><a href="#come-funziona">Come funziona</a><a href="#demo-reale">Demo</a><a href="#prezzo">€149/mese</a></nav>
    <div><span>Preview · noindex</span><span>Nessun checkout attivo</span><b>Se parli con Trovatemi, parli con Chris.</b></div>
  </div><small>© 2026 Trovatemi.it · Preview beauty · Produzione invariata</small></footer>;
}

export function BeautyAuditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  useEffect(() => { if (open) setDone(false); }, [open]);
  const submit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => { event.preventDefault(); setDone(true); };
  return <AnimatedModal open={open} onClose={onClose} labelledBy="beauty-audit-title"><div className="v13a-audit-modal">
    <div className="v13a-audit-modal__intro"><span>VEDIAMO IL TUO SALONE</span><h2 id="beauty-audit-title">Partiamo da come lavori oggi.</h2><p>Mi dici che tipo di salone hai e come chiedi oggi le recensioni. In questa preview il modulo non invia dati.</p><ol><li><b>01</b>Il tuo salone</li><li><b>02</b>Come chiedi oggi</li><li><b>03</b>Demo con Chris</li></ol></div>
    <form onSubmit={submit}><label><span>Nome del salone</span><input name="business" placeholder="Nome del salone" autoFocus required /></label><div><label><span>Che cosa fai?</span><input name="service" placeholder="Parrucchiere, barber, estetica" required /></label><label><span>Città</span><input name="city" placeholder="Dove lavori" required /></label></div><label><span>Telefono o WhatsApp</span><input name="contact" type="tel" placeholder="Il numero su cui ricontattarti" required /></label><button className="v12-yellow-button" type="submit">Fammi vedere il mio caso →</button><small>Nessun dato lascia questa pagina.</small>{done && <p className="v12-form-success"><i>✓</i><span><b>Simulazione completata.</b> Nessun dato è stato inviato.</span></p>}</form>
  </div></AnimatedModal>;
}

export function BeautyWhatsAppModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatedModal open={open} onClose={onClose} labelledBy="beauty-whatsapp-title"><div className="v13a-whatsapp-modal"><span>CONTATTO DIRETTO</span><h2 id="beauty-whatsapp-title">Il messaggio è pronto.</h2><p>Il numero WhatsApp ufficiale non è collegato alla preview.</p><blockquote>Ciao Chris, vorrei vedere come Trovatemi funzionerebbe nel mio salone.</blockquote><button className="v12-black-button" type="button" onClick={onClose}>Ho capito</button></div></AnimatedModal>;
}
