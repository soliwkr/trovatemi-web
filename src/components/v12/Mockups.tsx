import { motion, useReducedMotion } from 'motion/react';
import { BackgroundBeams, TiltCard } from './Aceternity';

export function ReviewHeroMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="v12-hero-product" aria-label="Esempio illustrativo: recensione, risposta e contenuto Trovatemi">
      <BackgroundBeams />
      <motion.div
        className="v12-hero-orbit"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      ><i /><i /><i /></motion.div>
      <TiltCard className="v12-hero-review-scene">
        <article className="v12-window v12-review-window">
          <WindowBar label="trovatemi · scheda google" />
          <div className="v12-review-person"><i>LR</i><p><strong>Laura R.</strong><small>Local Guide · 23 recensioni</small></p><time>ieri</time></div>
          <div className="v12-review-stars">★★★★★ <small>ieri</small></div>
          <blockquote>Precisi, disponibili e finalmente tutto spiegato in modo semplice.</blockquote>
          <div className="v12-owner-answer"><span>Risposta del titolare <b>bozza pronta</b></span><p>Grazie Laura. Chiarezza e disponibilità sono esattamente il modo in cui vogliamo lavorare.</p></div>
        </article>
      </TiltCard>
      <motion.article
        className="v12-float-chip v12-float-chip--review"
        animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      ><span>+1</span><p><b>Nuova recensione</b><small>pubblica · adesso</small></p><em>★★★★★</em></motion.article>
      <motion.article
        className="v12-float-chip v12-float-chip--content"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      ><i>✦</i><p><b>Contenuto pronto</b><small>dalla voce del cliente</small></p><em>✓</em></motion.article>
      <motion.article
        className="v12-float-chip v12-float-chip--reply"
        animate={reduceMotion ? undefined : { x: [0, 7, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      ><i>↗</i><p><b>Risposta preparata</b><small>da approvare</small></p><em>2s</em></motion.article>
      <span className="v12-demo-badge">CONCEPT INTERATTIVO</span>
    </div>
  );
}
export function QrNfcMockup() {
  return (
    <div className="v12-product-art v12-qr-art" aria-label="Esempio illustrativo di raccolta recensioni tramite QR e NFC">
      <div className="v12-ambient-grid" aria-hidden="true" />
      <motion.div className="v12-nfc-ring" animate={{ boxShadow: ['0 0 0 0 rgba(245,179,1,.35)', '0 0 0 24px rgba(245,179,1,0)'] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <TiltCard className="v12-qr-scene">
        <div className="v12-qr-card">
          <span>RACCONTACI COM’È ANDATA</span>
          <div className="v12-qr-code" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <small>INQUADRA CON LA FOTOCAMERA</small>
        </div>
      </TiltCard>
      <motion.div className="v12-mini-phone" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <i /><small>OFFICINA CENTRO</small><strong>Com’è andata oggi?</strong><span>★★★★★</span><button type="button">Continua su Google</button>
      </motion.div>
      <motion.div className="v12-nfc-token" whileHover={{ rotate: -7, scale: 1.05 }}><span>)))</span><b>TOCCA</b><small>NFC</small></motion.div>
      <span className="v12-demo-badge v12-demo-badge--dark">MOCKUP ORIGINALE</span>
    </div>
  );
}

export function MessageMockup() {
  return (
    <div className="v12-product-art v12-message-art" aria-label="Esempio illustrativo di richiesta automatica via WhatsApp">
      <div className="v12-message-orbit" aria-hidden="true"><i>SMS</i><i>MAIL</i><i>WA</i></div>
      <TiltCard>
        <article className="v12-message-window">
          <header><i>OC</i><p><b>Officina Centro</b><small>WhatsApp · oggi 14:01</small></p><span>•••</span></header>
          <div className="v12-message-bubble">Ciao Marco, grazie per essere passato. Ti va di raccontare com’è andata? Bastano 30 secondi.<small>✓✓ Consegnato</small></div>
          <motion.blockquote initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>Fatto! ★★★★★</motion.blockquote>
          <footer>✓✓ Letto 14:06 · pubblicata su Google</footer>
        </article>
      </TiltCard>
      <motion.article className="v12-delivery-card" animate={{ y: [0, -8, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}><span>RICHIESTE</span><b>24</b><small>questa settimana</small><i>↗</i></motion.article>
      <span className="v12-demo-badge v12-demo-badge--dark">FLUSSO SIMULATO</span>
    </div>
  );
}

export function DiscoveryMockup() {
  return (
    <div className="v12-agent-visual v12-search-visual" aria-label="Esempio illustrativo di contenuto locale mostrato nella ricerca">
      <span className="v12-demo-badge">ESEMPIO ILLUSTRATIVO</span>
      <WindowBar label="google · servizio in città" />
      <article className="v12-ai-overview"><span>✦ Risposta AI</span><p>Tra le attività locali apprezzate per chiarezza e assistenza, Officina Centro viene citata spesso per tempi rispettati e spiegazioni semplici.</p><small><b>T</b> trovatemi.it · Google ★ 4,9</small></article>
      <div className="v12-search-result"><i>O</i><p><small>trovatemi.it › servizio-citta</small><strong>Perché i clienti scelgono Officina Centro</strong><span>Tempi chiari, assistenza presente e un servizio che i clienti descrivono come semplice...</span></p></div>
      <motion.div className="v12-index-chip" animate={{ x: [0, 7, 0] }} transition={{ duration: 3.8, repeat: Infinity }}><i>◎</i><span><b>Pagina aggiornata</b><small>fonte: 12 recensioni reali</small></span><em>✓</em></motion.div>
    </div>
  );
}

export function ReplyMockup() {
  return (
    <div className="v12-agent-visual v12-reply-visual" aria-label="Esempio illustrativo di risposta a una recensione">
      <span className="v12-demo-badge">BOZZA CONTROLLABILE</span>
      <WindowBar label="scheda google · risposte" />
      <article className="v12-review-card"><div><i>AC</i><p><b>Andrea C.</b><small>Local Guide · 31 recensioni</small></p><em>G</em></div><span>★★★★★ · 1 settimana fa</span><blockquote>Intervento preciso e tempi rispettati. Finalmente tutto spiegato bene.</blockquote></article>
      <section className="v12-reply-card"><header><span>Risposta del titolare</span><b>Generata · 2s</b></header><p>Grazie Andrea. Chiarezza e puntualità fanno parte del nostro modo di lavorare. Siamo felici che si sia visto.</p><footer><button type="button">Modifica</button><motion.button type="button" whileTap={{ scale: 0.96 }}>Approva</motion.button></footer></section>
    </div>
  );
}

export function EchoMockup() {
  return (
    <div className="v12-agent-visual v12-social-visual" aria-label="Esempio illustrativo di post creato da una recensione">
      <span className="v12-demo-badge">POST DIMOSTRATIVO</span>
      <article className="v12-social-post">
        <header><i>OC</i><p><b>officina.centro</b><small>Latina</small></p><span>•••</span></header>
        <div><i>”</i><blockquote>Intervento preciso e tempi rispettati. Finalmente tutto spiegato bene.</blockquote><small>— ANDREA C. · ★★★★★</small><div aria-hidden="true" /></div>
        <footer><span>♡　⌁　✈</span><b>Salva</b><p><strong>officina.centro</strong> Grazie Andrea per aver raccontato la tua esperienza.</p></footer>
      </article>
      <motion.div className="v12-export-chip" animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity }}><i>↗</i><span><b>Formato pronto</b><small>post · storia · scheda</small></span></motion.div>
    </div>
  );
}

export function SystemHub() {
  const reduceMotion = useReducedMotion();
  const nodes = [
    ['01', 'Esperienza', 'il cliente parla'],
    ['02', 'Risposta', 'la fiducia cresce'],
    ['03', 'Contenuto', 'la prova circola'],
    ['04', 'Ricerca', 'l’attività si capisce'],
    ['05', 'Scelta', 'arriva il prossimo cliente'],
  ];

  return (
    <div className="v12-system-hub" aria-label="Ciclo illustrativo del sistema Trovatemi">
      <svg aria-hidden="true" viewBox="0 0 1000 420" preserveAspectRatio="none">
        <path d="M80 210C150 60 310 40 430 150C500 215 540 215 610 150C730 40 900 70 940 210C900 360 730 380 610 270C540 205 500 205 430 270C310 380 150 360 80 210Z" />
        <motion.path
          d="M80 210C150 60 310 40 430 150C500 215 540 215 610 150C730 40 900 70 940 210C900 360 730 380 610 270C540 205 500 205 430 270C310 380 150 360 80 210Z"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 2.2, ease: 'easeInOut' }}
        />
      </svg>
      {nodes.map(([number, title, body], index) => (
        <motion.article
          className={`v12-system-node v12-system-node--${index + 1}`}
          key={number}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.16, type: 'spring', stiffness: 170, damping: 18 }}
        ><b>{number}</b><strong>{title}</strong><small>{body}</small></motion.article>
      ))}
      <div className="v12-system-center"><span>★</span><b>TROVATEMI</b><small>un solo sistema</small></div>
    </div>
  );
}

function WindowBar({ label }: { label: string }) {
  return <header className="v12-window-bar"><span><i /><i /><i /></span><small>{label}</small><b>G</b></header>;
}
