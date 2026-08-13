import { useState } from 'react';
import {
  BackgroundBeams,
  CardSpotlight,
  MovingBorderButton,
  Reveal,
  Spotlight,
  TextGenerate,
  WobbleCard,
} from '../v12/Aceternity';
import { EchoMockup, QrNfcMockup, ReplyMockup, ReviewHeroMockup } from '../v12/Mockups';
import { getDemoTenant } from '../../data/demo-tenants';
import { faqs, siteCopy } from '../../data/site-copy';
import { DemoFrame } from './DemoFrame';
import { AuditModal, BoundaryLine, Disclosure, PageShell, SectionHead, SiteChrome, SiteFooter, WhatsAppModal } from './Shared';

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
          <Spotlight /><BackgroundBeams className="v12-hero-beams" /><div className="v12-grid-bg" aria-hidden="true" />
          <div className="v12-wrap v12-hero__grid">
            <div className="v12-hero__copy">
              <p className="v12-eyebrow"><i /><i /><i /> Per saloni, barber e centri estetici.</p>
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
          <div className="v12-hero-flow"><div className="v12-wrap"><span>CLIENTE CONTENTO</span><i>→</i><b>RECENSIONE</b><i>→</i><b>RISPOSTA</b><i>→</i><b>CONTENUTO</b><i>→</i><strong>ALTRA PROVA VISIBILE</strong></div></div>
        </section>

        <section className="v13a-scene">
          <div className="v12-wrap">
            <Reveal><SectionHead index="01" label="Succede ogni giorno" title="«Bellissimo. Torno sicuramente.» Poi esce e la recensione spesso non arriva." body="Quando il cliente è ancora davanti allo specchio sai quanto è contento. Dopo, la giornata riparte e quella buona intenzione si perde." /></Reveal>
            <WobbleCard className="v13a-scene-card"><span>LA FRASE CHE CONOSCI</span><blockquote>«Sì, la recensione te la faccio dopo.»</blockquote><p>Trovatemi trasforma quel “dopo” in un gesto semplice mentre il cliente è ancora lì.</p></WobbleCard>
          </div>
        </section>

        <section id="come-funziona" className="v13a-comparison">
          <div className="v12-wrap">
            <Reveal><SectionHead index="02" label="Nel tuo salone" title="Tu fai il lavoro. La prova non deve andare persa." body="Raccogli, rispondi e riutilizza: tre passaggi dello stesso sistema." /></Reveal>
            <WobbleCard className="v12-product-row">
              <QrNfcMockup />
              <div className="v12-product-copy"><span>01 / RACCOGLI</span><h3>Chiedi la recensione quando il cliente è ancora contento.</h3><p>NFC o QR nel punto giusto: cassa, reception o fine servizio.</p><ul><li>Pochi secondi</li><li>Nessuna ricerca del profilo</li><li>Stesso accesso alla recensione per tutti</li></ul></div>
            </WobbleCard>
            <WobbleCard className="v12-product-row v12-product-row--reverse">
              <ReplyMockup />
              <div className="v12-product-copy"><span>02 / RISPONDI</span><h3>Chi ti scrive non trova il silenzio.</h3><p>La recensione può ricevere una risposta coerente con il tono del tuo salone.</p><ul><li>Risposte specifiche</li><li>Il tuo tono</li><li>Google collegato</li></ul></div>
            </WobbleCard>
            <WobbleCard className="v12-product-row">
              <EchoMockup />
              <div className="v12-product-copy"><span>03 / RIUTILIZZA</span><h3>Una bella recensione può lavorare più di una volta.</h3><p>Le parole dei tuoi clienti possono diventare contenuti senza trasformarti in un content creator.</p><ul>{channels.map((channel) => <li key={channel}>{channel}</li>)}</ul></div>
            </WobbleCard>
          </div>
        </section>

        <section className="v13a-chris">
          <div className="v12-wrap">
            <Reveal><SectionHead index="03" label="Lo facciamo noi" title={siteCopy.humanPromise} body="Colleghiamo il tuo Google, prepariamo NFC e QR e configuriamo il flusso. Non ti consegniamo un’altra dashboard da studiare." /></Reveal>
            <WobbleCard className="v13a-chris-card"><div className="v13a-chris-sign"><span>★</span><strong>CHRIS</strong><small>Trovatemi.it</small></div><div><h3>Partiamo dal tuo salone, non da una presentazione.</h3><p>Vedo dove saluti il cliente e dove ha senso inserire il gesto. Dopo il setup deve toglierti lavoro, non aggiungerlo.</p><button className="v12-black-button" type="button" onClick={() => setWhatsAppOpen(true)}>{siteCopy.contactCta} →</button></div></WobbleCard>
          </div>
        </section>

        {demo && <section id="demo-reale" className="v12-use-cases v13a-home-demo"><div className="v12-wrap">
          <Reveal><SectionHead dark index="04" label="Guarda dentro" title="La demo è wellness. Immaginala con il nome del tuo salone." body="I dati sono dimostrativi. Il sistema che organizza recensioni, risposte e contenuti è reale." /></Reveal>
          <DemoFrame demo={demo} intro="Segui il percorso: richiesta, recensione, risposta e riutilizzo della prova." surface="home" /><Disclosure />
        </div></section>}

        <section id="prezzo" className="v12-pricing v13a-plans"><div className="v12-wrap">
          <Reveal><SectionHead index="05" label="Un solo piano" title="Un salone. Tutto il flusso. €149 al mese." body="Per la validazione non ci sono livelli da scegliere." /></Reveal>
          <div className="v13a-plan-grid"><CardSpotlight className="v13a-plan-card v13a-plan-card--dark">
            <span>TROVATEMI · PER IL TUO SALONE</span><h3>€{siteCopy.price}<small>/mese</small></h3><strong>Recensioni → risposte → contenuti → distribuzione.</strong>
            <p>Setup fatto per te. Mensile. Una attività.</p>
            <ul><li>Il tuo Google Business Profile</li><li>NFC + QR</li><li>Recensioni senza filtri sul voto</li><li>Risposte</li><li>Contenuti dalle recensioni migliori</li><li>Google, Instagram, Facebook e TikTok quando collegati</li><li>Installazione e assistenza</li></ul>
            <button className="v12-yellow-button" type="button" onClick={() => setAuditOpen(true)}>Fammi vedere sul mio salone →</button>
          </CardSpotlight></div>
        </div></section>

        <section id="faq" className="v12-faq"><div className="v12-wrap"><Reveal><SectionHead dark index="06" label="Prima di partire" title="Le domande che mi faresti davanti alla cassa." /></Reveal><div className="v12-faq__list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></div></section>

        <section className="v12-final-cta"><Spotlight className="v12-final-spotlight" /><BackgroundBeams /><Reveal className="v12-wrap v12-final-cta__inner"><span>IL TUO SALONE</span><h2>QUANTI COMPLIMENTI STANNO USCENDO DALLA PORTA SENZA DIVENTARE UNA RECENSIONE?</h2><p>Fammi vedere il tuo profilo Google e come lavori oggi. Ti faccio vedere dove entrerebbe Trovatemi.</p><MovingBorderButton onClick={() => setAuditOpen(true)}>{siteCopy.primaryCta} <b>→</b></MovingBorderButton><button className="v13a-contact-link" type="button" onClick={() => setWhatsAppOpen(true)}>{siteCopy.contactCta}</button><BoundaryLine /></Reveal></section>
      </main>
      <SiteFooter />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
      <WhatsAppModal open={whatsAppOpen} onClose={() => setWhatsAppOpen(false)} />
    </PageShell>
  );
}
