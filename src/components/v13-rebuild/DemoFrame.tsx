import { useEffect, useState } from 'react';
import { AnimatedModal, CardSpotlight } from '../v12/Aceternity';
import type { DemoTenant } from '../../data/demo-tenants';
import { getDemoEmbedCode, getDemoUrl } from '../../data/demo-tenants';

type Props = {
  demo: DemoTenant;
  intro: string;
  autoload?: boolean;
  showCode?: boolean;
  surface: 'home' | 'landing' | 'demo';
};

export function DemoFrame({ demo, intro, autoload = false, showCode = false, surface }: Props) {
  const [loaded, setLoaded] = useState(autoload);
  const [loading, setLoading] = useState(autoload);
  const [codeOpen, setCodeOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const url = getDemoUrl(demo);
  const embedCode = getDemoEmbedCode(demo);

  const sendEvent = (event: string) => {
    const detail = { event, demo: demo.id, surface };
    window.dispatchEvent(new CustomEvent(`trovatemi:${event}`, { detail }));
    const dataLayer = (window as Window & { dataLayer?: Array<Record<string, string>> }).dataLayer;
    if (Array.isArray(dataLayer)) dataLayer.push(detail);
  };

  useEffect(() => {
    if (autoload) sendEvent('demo_loaded');
  }, []);

  const load = () => {
    if (loaded) return;
    setLoaded(true);
    setLoading(true);
    sendEvent('demo_loaded');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopyStatus('Codice copiato negli appunti.');
      sendEvent('embed_code_copied');
    } catch {
      setCopyStatus('Copia non disponibile: seleziona il codice qui sopra.');
    }
  };

  return (
    <section className="v13a-demo-frame" aria-label={`Demo Trovatemi per ${demo.name}`}>
      <header className="v13a-demo-frame__toolbar">
        <div className="v13a-browser-dots" aria-hidden="true"><i /><i /><i /></div>
        <div className="v13a-browser-address"><span>★</span><strong>app.trovatemi.it</strong><small>dimostrazione · {demo.shortName}</small></div>
        <div>
          {showCode && <button type="button" onClick={() => setCodeOpen(true)}>Strumenti per presentare</button>}
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => sendEvent('demo_fullscreen_opened')}>Apri a schermo intero ↗</a>
        </div>
      </header>

      <div className="v13a-demo-frame__viewport">
        {!loaded && (
          <CardSpotlight className="v13a-demo-cover">
            <span aria-hidden="true">{demo.icon}</span>
            <small>DIMOSTRAZIONE REALE · DATI DIMOSTRATIVI</small>
            <h2>{demo.shortName}</h2>
            <p>{intro}</p>
            <button className="v12-yellow-button" type="button" onClick={load}>Apri la dimostrazione →</button>
            <em>Il click carica l’applicazione e le sue risorse esterne.</em>
          </CardSpotlight>
        )}

        {loaded && loading && <div className="v13a-demo-loading" aria-live="polite"><span /><strong>Sto aprendo la dimostrazione {demo.shortName}…</strong><small>Il primo caricamento può richiedere qualche secondo.</small></div>}

        {loaded && (
          <iframe
            src={url}
            title={`Demo Trovatemi — ${demo.name}`}
            loading={autoload ? 'eager' : 'lazy'}
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
            allow="clipboard-read; clipboard-write; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
          />
        )}
      </div>

      <footer><p><i /><span><strong>Ambiente dimostrativo.</strong> Attività, recensioni e numeri non appartengono a clienti Trovatemi.</span></p>{surface !== 'demo' && <a href={`/demo/${demo.id}/`}>Apri la guida →</a>}</footer>

      <AnimatedModal open={codeOpen} onClose={() => setCodeOpen(false)} labelledBy={`v13a-code-${demo.id}`}>
        <div className="v13a-code-modal">
          <span>STRUMENTI PER PRESENTARE</span>
          <h2 id={`v13a-code-${demo.id}`}>Porta questa demo dentro una pagina.</h2>
          <p>Il codice mantiene titolo, permessi minimi e caricamento differito.</p>
          <pre><code>{embedCode}</code></pre>
          <button className="v12-yellow-button" type="button" onClick={copy}>Copia il codice</button>
          <small aria-live="polite">{copyStatus}</small>
        </div>
      </AnimatedModal>
    </section>
  );
}
