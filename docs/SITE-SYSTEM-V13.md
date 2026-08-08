# Trovatemi.it V13 — Site, demo e sales system

Stato: architettura approvata, implementazione isolata dalla produzione  
Base: `agent/v12-aceternity-recensi` @ `1c986453ba302eb255955008e107d443ec9bb751`  
Ultimo aggiornamento: 8 agosto 2026

## 1. Decisione

V13 non è un'altra variante grafica della homepage. È il sistema condiviso che collega:

- homepage di orientamento;
- landing per intento e per settore;
- demo reali del backend Trovatemi/Climbo;
- pagine biolink per Instagram e Facebook;
- modalità di presentazione per visite di persona e live;
- pagine prodotto TROVATO, INEVITABILE e RETE.

Aceternity definisce la coreografia e i momenti di enfasi. Non definisce la griglia, la gerarchia dei testi o l'altezza delle sezioni.

## 2. Regole non negoziabili

1. La root di produzione resta invariata fino a una PR di promozione dedicata.
2. La homepage V7.2 viene conservata in `/archivio/home-v7-2/`, con `noindex`.
3. Le demo pubbliche mostrano tenant dimostrativi reali; non simulano risultati di clienti reali.
4. Un tenant si definisce una volta e alimenta demo, embed, biolink e landing.
5. Il backend non viene caricato automaticamente nelle pagine editoriali: il visitatore sceglie di aprire la demo reale.
6. Ogni pagina ha un solo intento, un solo H1 e una CTA primaria.
7. Il trial assistito non è la CTA universale del sito.
8. Nessuna posizione Google, citazione AI, quantità di recensioni o risultato commerciale viene garantito.

## 3. CTA e percorso commerciale

### CTA pubblica predefinita

`Prova il pannello demo`

La pagina permette di esplorare il sistema con dati dimostrativi, senza account e senza collegare un'attività reale.

### CTA commerciale contestuale

`Mostramelo sulla mia attività`

Questa azione può essere proposta durante:

- walk-in;
- live;
- call;
- conversazione Instagram o Facebook;
- follow-up dopo una demo.

### Trial assistito

Il trial rimane una leva commerciale, non una promessa obbligatoria della homepage.

| Origine | Percorso consigliato |
| --- | --- |
| Prospect freddo / walk-in | demo reale → eventuale attivazione assistita |
| Lead da social | biolink → landing → demo → conversazione |
| Referral caldo | demo → proposta, senza trial obbligatorio |
| Multi-sede | demo → analisi sedi → proposta dedicata |

La decisione di mostrare pubblicamente durata, condizioni e gratuità del trial viene rimandata al gate commerciale. Fino ad allora il sito parla di demo e configurazione, non di “14 giorni gratis”.

## 4. Catalogo tenant canonico

| ID | Settore italiano | Category Climbo | Ruolo |
| --- | --- | --- | --- |
| `luxury-watches` | Orologeria di fascia alta | `luxury-watches` | retail premium |
| `wellness-spa` | Spa e centro benessere | `wellness-spa` | appuntamenti / hospitality |
| `sunny-cafe` | Bar e caffetteria | `sunny-cafe` | esperienza al banco |
| `fitness-club` | Palestra e fitness club | `fitness-club` | membership / staff |
| `grand-hotel-riviera` | Hotel e ospitalità | `grand-hotel-riviera` | reputazione multi-touchpoint |

URL backend:

`https://app.trovatemi.it/try/#/home?category={category}`

## 5. Superfici generate da ogni tenant

| Superficie | Route | Scopo |
| --- | --- | --- |
| Demo autonoma | `/demo/{id}/` | prova completa e condivisibile |
| Presentazione | `/demo/{id}/?mode=live` | uso rapido durante visite e live |
| Biolink | `/link/{id}/` | link in bio IG/FB del verticale |
| Landing | `/per/{id}/` | spiegazione specifica del problema |
| Embed | componente condiviso | backend dentro homepage/landing |

Il namespace `/demo/` contiene anche un hub per scegliere il settore.

## 6. Architettura del frontend

### Shell

- Astro genera struttura, copy, metadata e navigazione.
- JavaScript viene usato soltanto per menu, copia del codice embed e caricamento controllato dell'iframe.
- Non si idrata l'intera pagina.

### Dati

`src/data/climbo-demos.ts` è la fonte unica per:

- slug e category;
- nome, settore e scenario;
- palette e microcopy;
- URL backend;
- CTA e route correlate;
- passaggi consigliati dentro la demo.

### Componenti

- `DemoEmbed.astro`: backend reale, loading, fallback e fullscreen.
- `DemoCard.astro`: selezione tenant.
- `BioLink.astro`: superficie compatta per social.
- `V13Layout.astro`: metadata, shell e navigazione.

## 7. Contratto dell'embed

L'app `app.trovatemi.it/try/` è attualmente incorporabile: alla verifica dell'8 agosto 2026 non restituiva `X-Frame-Options` né una CSP `frame-ancestors` restrittiva.

L'embed deve comunque includere:

- `title` specifico;
- `loading="lazy"`;
- `referrerpolicy="strict-origin-when-cross-origin"`;
- sandbox con soli permessi necessari;
- link alternativo “Apri a schermo intero”;
- messaggio di caricamento;
- dichiarazione “dati dimostrativi”;
- controllo periodico degli header, perché la policy del backend può cambiare.

Nelle landing editoriali l'iframe viene attivato con un click. Questo evita di caricare subito il bundle completo e le risorse di terze parti usate dal backend.

## 8. Homepage V13

La homepage di preview contiene massimo sei capitoli:

1. Promessa: i clienti soddisfatti possono continuare a lavorare per l'attività.
2. Demo reale: il visitatore entra nel pannello, non guarda un mockup.
3. Ciclo: chiedi → raccogli → rispondi → distribuisci → misura.
4. Scelta: TROVATO, INEVITABILE, RETE.
5. Casi: accesso alle landing verticali, senza raccontarli tutti nella home.
6. Chiusura: scegli una demo o parla con Chris attraverso il canale da cui sei arrivato.

### Scala tipografica

| Livello | Desktop | Mobile | Regola |
| --- | --- | --- | --- |
| H1 | 72–88 px | 44–56 px | massimo tre righe |
| H2 | 48–64 px | 34–44 px | sentence case se lungo |
| H3 | 26–34 px | 24–30 px | una sola idea |
| Body | 17–19 px | 16–18 px | max 62–65ch |

Anton è riservato a wordmark, numeri, etichette brevi e frasi-display. I titoli esplicativi lunghi usano Archivo/Space Grotesk.

## 9. Landing page

### Pagine per intento

- `/recensioni-google/`
- `/rispondere-alle-recensioni/`
- `/contenuti-dalle-recensioni/`
- `/presenza-locale/`
- `/multi-sede/`

### Pagine prodotto

- `/trovato/`
- `/inevitabile/`
- `/rete/`

### Pagine verticali iniziali

Le cinque landing `/per/{id}/` vengono alimentate dal catalogo demo. Non sono pagine pSEO: ognuna deve cambiare momento della richiesta, obiezione, esempio, passaggi della demo e call to action.

## 10. Misurazione

Eventi minimi:

- `demo_selected`;
- `demo_loaded`;
- `demo_fullscreen_opened`;
- `embed_code_copied`;
- `biolink_action_clicked`;
- `landing_demo_opened`;
- `contact_intent` quando sarà definito il canale reale.

Ogni evento porta almeno `tenant`, `surface` e `source`.

## 11. Gate di rilascio

### Gate 0 — Contratto

Questo documento e `DEMO-CONTRACT.md` sono canonici.

### Gate 1 — Fondazione

- archivio V7.2;
- token e shell V13;
- root invariata.

### Gate 2 — Demo platform

- catalogo;
- hub;
- cinque demo;
- embed copiabile;
- modalità live.

### Gate 3 — Biolink e verticali

- cinque biolink;
- cinque landing;
- collegamenti coerenti con le demo.

### Gate 4 — Homepage

- home ridotta e demo-first;
- proporzioni verificate a 360, 390, 768, 1280 e 1440 px;
- nessuna island React full-page.

### Gate 5 — Preview e QA

- build e typecheck;
- verifica header iframe;
- test tastiera e reduced motion;
- preview Cloudflare isolata;
- `noindex` su tutte le nuove route.

### Gate 6 — Promozione

Una PR separata cambia `/`. Richiede approvazione esplicita sul commit esatto e verifica live. L'archivio V7.2 resta disponibile come rollback editoriale.

