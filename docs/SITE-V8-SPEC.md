# TROVATEMI.IT V8 — Specifica del sito pubblico

**Stato:** proposta di Gate 1, non implementata e non canonica  
**Business line:** `climbo_white_label`  
**Conversion plane:** `soliwkr/trovatemi-web`  
**Data:** 1 agosto 2026  
**Direzione:** Trustars per desiderabilità, Mister Review per diagnosi, Trovatemi per identità e confini

---

## 1. Decisione progettuale

La V8 non è una nuova riscrittura dell'offerta e non è un restyling cosmetico della V7.2.

La V7.2 conserva il flusso direct response approvato. La V8 deve cambiare la percezione del sito: da landing SaaS ben costruita a esperienza diagnostica premium, concreta e accompagnata da una persona reale.

La promessa madre resta invariata:

> **Il cliente ti sta già cercando. Il problema è che trova un altro.**

Il prodotto visibile non è una dashboard. È la sequenza:

> **Profilo reale → gesto NFC o QR → recensione pubblica → controllo umano.**

La tecnologia resta dietro le quinte. Chris traduce, fa vedere, dimostra e accompagna.

---

## 2. Fonti e autorità

La V8 deve rispettare, nell'ordine:

1. Stella Polare e Documento Totale in `soliwkr/trovatemi-os`;
2. decisioni approvate e conflitti registrati in TROVATEMI OS;
3. specifica commerciale della linea `climbo_white_label`;
4. prompt severo del sito importato come fonte grezza;
5. implementazione corrente V7.2 in `trovatemi-web`;
6. audit del 1 agosto 2026 su Climbo e sedici reseller;
7. benchmark visuali Trustars e Mister Review.

Trustars e Mister Review sono riferimenti, non fonti normative. Nessuna loro promessa, funzione, metrica o pratica commerciale sovrascrive i confini Trovatemi.

### Conflitto commerciale aperto

La direzione Cashflow approvata propone due piani pubblici:

- TROVATO — €199/mese;
- INEVITABILE — €399/mese.

Le fonti canoniche superiori conservano ancora il listino precedente. La V8 può progettare l'esperienza dei due piani, ma il passaggio in root e la pubblicazione definitiva dei prezzi richiedono prima una PR commerciale dedicata in `trovatemi-os`, approvata da Chris.

---

## 3. Scope

### Incluso

- architettura informativa del sito pubblico;
- homepage direct response;
- audit come conversione primaria;
- demo NFC/QR da sessanta secondi;
- prova assistita di quattordici giorni;
- presentazione di TROVATO e INEVITABILE;
- prova trasparente e futuro archivio casi studio;
- presenza di Chris;
- FAQ, legalità, accessibilità, SEO tecnico e performance;
- sistema visuale e componenti V8;
- progettazione mobile-first;
- preview isolata prima di qualsiasi passaggio in root.

### Escluso

- RankEmpire, renter, portali e asset-first;
- TROVATEMI OS e strumenti interni;
- D1, Climbo API, Stripe e automazioni;
- checkout;
- CRM;
- pSEO e pagine territoriali nel primo rilascio;
- campagne pubblicitarie;
- produzione editoriale del cliente;
- modifica delle promesse o dei prezzi canonici;
- deploy della V8 senza gate umano.

---

## 4. Obiettivo della pagina

La homepage deve portare il titolare a questa sequenza mentale:

1. «Sta parlando di quello che succede alla mia attività.»
2. «Non è detto che il concorrente lavori meglio: online sembra più facile fidarsi di lui.»
3. «Capisco il gesto che mancava.»
4. «Non devo imparare un software: Chris lo installa e lo segue.»
5. «Posso provarlo sulla mia attività prima di decidere.»
6. «Voglio vedere cosa trova oggi un cliente quando cerca me.»

### Test dei 5, 10 e 30 secondi

Entro 5 secondi il visitatore deve capire il rischio:

> il cliente cerca e trova un altro.

Entro 10 secondi deve capire cosa fa Trovatemi:

> trasforma clienti soddisfatti in prove pubbliche che aiutano la scelta.

Entro 30 secondi deve capire il prossimo passo:

> audit reale oppure demo NFC, seguiti da una prova assistita di 14 giorni.

---

## 5. Pubblico

La homepage parla a titolari e responsabili di attività locali che:

- lavorano bene;
- servono clienti reali;
- hanno un momento riconoscibile di soddisfazione;
- ricevono meno recensioni del proprio potenziale;
- vengono confrontati su Google e Maps;
- non vogliono gestire un altro software;
- possono nominare una persona responsabile dell'utilizzo;
- accettano un percorso trasparente e senza review gating.

Non parla a:

- chi cerca recensioni false;
- chi vuole filtrare clienti insoddisfatti;
- chi pretende posizioni, telefonate o fatturato garantiti;
- chi vuole soltanto una dashboard economica;
- chi non ha clienti reali durante il trial;
- chi cerca gestione social completa, advertising o lavoro manuale illimitato.

---

## 6. Sintesi dei benchmark

| Riferimento | Principio da adottare | Pratica da rifiutare |
|---|---|---|
| Trustars | eleganza nero/crema, ritmo, visualizzazione chiara del processo, sensazione premium | review gating, overclaim, metriche senza provenienza, promessa AI assoluta |
| Mister Review | problema prima del prodotto, diagnosi, linguaggio umano, accompagnamento, settore | freemium, ancoraggio da software economico, routing selettivo delle opinioni |
| QuickSuite | personalità territoriale, accesso al fondatore, audit e demo | proliferazione di pacchetti e promessa troppo ampia |
| Collecty | caso studio con attività, problema, intervento e risultato | risultato senza baseline e periodo completi |
| RecenSì | livello visuale e dimostrazione del prodotto | AI e piattaforma protagoniste |
| ReviewMint | descrizione del momento operativo della richiesta | review gating e promessa Maps |
| reseller economici | conferma che le funzioni sono commodity | feature wall e trial self-service |

La formula progettuale è:

> **Trustars per il desiderio. Mister Review per la conversione. Trovatemi per l'anima.**

---

## 7. Architettura del sito

### Rilascio V8 iniziale

| Route | Ruolo | CTA primaria |
|---|---|---|
| `/` | pagina direct response e orientamento | Fammi vedere cosa trova un cliente |
| `/audit` | richiesta analisi reale | Analizza la mia attività |
| `/demo` | dimostrazione guidata NFC/QR | Provalo sulla mia attività |
| `/prova-14-giorni` | qualifica e spiegazione del trial | Richiedi la prova assistita |
| `/trovato` | dettaglio del problema raccolta/gestione | Prova TROVATO |
| `/inevitabile` | dettaglio del problema trasformazione/distribuzione | Scopri se ti serve INEVITABILE |
| `/prove` | protocollo di prova e casi autorizzati | Guarda come misuriamo |
| `/privacy` | informativa | — |
| `/cookie` | informativa | — |

### Rilascio successivo, dopo dati reali

- `/per/[categoria]`;
- `/prove/[caso]`;
- `/domande/[problema]`;
- eventuale hub editoriale.

Nessuna pagina categoria o territorio viene generata prima di avere dati, call, linguaggio e prove pertinenti.

---

## 8. Navigazione

### Desktop

- wordmark TROVATEMI.IT;
- Perché;
- Come funziona;
- Prova 14 giorni;
- Piani;
- Prove;
- CTA: Analizza la mia attività.

### Mobile

- wordmark;
- pulsante menu accessibile;
- CTA audit sempre raggiungibile;
- barra inferiore persistente soltanto dopo il primo viewport;
- nessun menu a schermo intero decorativo.

La navigazione non deve includere RankEmpire, OS, AI, dashboard o termini tecnici.

---

## 9. Homepage — flusso completo

Il flusso persuasivo della V7.2 viene preservato. La V8 riduce il linguaggio da landing e aumenta esperienza, prova e presenza umana.

### 9.1 Hero — La perdita

**Eyebrow**

> Per attività locali che lavorano bene, ma online non lo dimostrano abbastanza.

**H1**

> Il cliente ti sta già cercando.  
> Il problema è che trova un altro.

**Subheadline**

> Trovatemi installa nella tua attività un sistema semplice per trasformare clienti soddisfatti in recensioni, risposte e prove pubbliche che aiutano chi ti cerca a scegliere te.

**CTA primaria**

> Fammi vedere cosa trova un cliente

**CTA secondaria**

> Guarda come funziona in 60 secondi

**Microcopy**

> 14 giorni di prova assistita. Sulla tua vera attività. Con clienti reali.

**Visual**

Un filmato verticale o una sequenza documentaristica:

1. cliente soddisfatto;
2. anello o supporto NFC;
3. telefono che si avvicina;
4. percorso che si apre;
5. recensione pubblica;
6. titolare che vede il risultato;
7. Chris che controlla con lui.

Vietati dashboard, agenti AI, grafici e metriche decorative.

### 9.2 Diagnosi persistente — Il filo della pagina

Subito dopo la hero compare un invito breve:

> Vuoi vedere il tuo confronto?

Azioni:

- incolla il profilo Google;
- oppure richiedi l'audit con i dati minimi.

Il sito non genera risultati finti. Dopo l'invio comunica che Chris controllerà il profilo e mostrerà il confronto.

Su mobile l'invito diventa una barra inferiore persistente dopo il primo viewport.

### 9.3 Scena reale — Il complimento dimenticato

**Titolo**

> Ogni mese servi clienti soddisfatti. Quanti diventano una recensione?

**Sequenza narrativa**

- il cliente paga;
- ringrazia;
- promette di recensire;
- esce;
- torna alla propria giornata;
- dimentica.

Il trattamento visuale deve essere editoriale, non una card dentro un'altra card. Foto reale ampia, testo corto, frase «Certo, la faccio dopo» come unico colpo visuale.

### 9.4 Confronto — La scelta

**Titolo**

> Non significa che il concorrente lavori meglio. Significa che online sembra più facile fidarsi di lui.

Mostrare due profili dimostrativi con:

- quantità di recensioni;
- data dell'ultima recensione;
- presenza di risposte;
- aggiornamenti recenti.

Ogni dato dimostrativo deve essere etichettato «Esempio illustrativo».

Domanda:

> Se non conoscessi nessuna delle due attività, quale chiameresti per prima?

CTA:

> Ora guardiamo il tuo confronto

### 9.5 Chi cerca contro chi scrolla — Il valore del momento

**Claim**

> Chi cerca vale molto più di chi scrolla.

Visualizzazione sobria a due colonne:

- chi scrolla vede e passa;
- chi cerca confronta, legge e decide chi chiamare.

Nessuna affermazione «chi cerca compra».

### 9.6 Come funziona — Dal complimento alla prova

Massimo quattro passaggi:

1. il cliente è soddisfatto;
2. avvicina il telefono o apre il QR;
3. lascia la propria esperienza;
4. attività e Chris vedono cosa sta succedendo.

Il passaggio 2 deve essere interattivo. Il visitatore può simulare il tap e aprire la demo.

Il passaggio 3 deve dichiarare:

> Tutti ricevono lo stesso percorso. Nessun filtro sul voto.

### 9.7 Chris — Il servizio che il software non contiene

Questa sezione entra prima del trial e prima dei prezzi.

**Titolo**

> Non ti lasciamo una piattaforma. La installiamo nella tua attività.

**Copy**

> Chris collega il profilo, prepara NFC e QR, mostra al personale quando chiedere e controlla che il sistema venga davvero utilizzato.

Elementi:

- ritratto reale;
- nome e cognome;
- «Se chiami, risponde Chris»;
- WhatsApp;
- nessun avatar o chatbot.

### 9.8 Trial — Giorno 1, 7 e 14

**Titolo**

> Non devi crederci sulla parola. Provalo per 14 giorni sulla tua attività.

Timeline:

- giorno 1: attivazione e prima richiesta;
- giorno 7: controllo di utilizzo e blocchi;
- giorno 14: lettura degli output e decisione.

Deve essere chiaro che:

- non è self-service;
- non è una visita gratuita alla dashboard;
- richiede clienti reali;
- richiede una persona responsabile;
- il prezzo è comunicato prima;
- la decisione del giorno 14 è programmata.

### 9.9 Scelta del piano — La domanda discriminante

Prima delle card compare:

> Se raccogliessimo più recensioni, sarebbe sufficiente oppure rimarrebbe il problema di mantenere attivi Google, contenuti e presenza?

Risposta A:

> Sarebbe sufficiente → TROVATO

Risposta B:

> Resterebbe il secondo problema → INEVITABILE

Questo è un orientamento, non un configuratore automatico e non sostituisce la raccomandazione di Chris.

### 9.10 TROVATO e INEVITABILE

Le offerte non devono sembrare due licenze.

**TROVATO**

> Raccoglie e gestisce la prova.

**INEVITABILE**

> Raccoglie, trasforma e distribuisce la prova.

Ordine informativo:

1. problema risolto;
2. per chi è;
3. trasformazione;
4. prezzo e modalità;
5. cosa comprende;
6. cosa non comprende;
7. CTA.

Nessun badge «più popolare». Nessuna spinta automatica al piano più costoso.

### 9.11 Visione

**Claim**

> Non devi diventare virale. Devi diventare inevitabile.

Sezione prevalentemente tipografica, con un solo segno Stella e nessuna feature.

### 9.12 Prova — Quello che possiamo mostrare

Prima dei casi studio:

- demo reale;
- baseline datata;
- output controllabili;
- protocollo del trial;
- accesso a Chris;
- limiti dichiarati.

Dopo casi autorizzati:

> Prima → periodo → cosa è stato installato → utilizzo → output → cosa è successo → limiti.

Vietati testimonial placeholder, avatar generici, loghi inventati e numeri decorativi.

### 9.13 FAQ — Dove diciamo no

Domande minime:

- garantite il primo posto su Google?
- filtrate le recensioni negative?
- devo imparare un software?
- cosa succede nei 14 giorni?
- devo avere qualcuno per i social?
- posso scegliere il mensile?
- garantite nuovi clienti?
- in cosa siete diversi da un software economico?

### 9.14 CTA finale — Il profilo reale

**Titolo**

> Vuoi vedere cosa trova oggi un cliente quando cerca il tuo servizio?

**Copy**

> Partiamo dal tuo profilo, non da una presentazione. Guardiamo il confronto e capiamo se esiste davvero qualcosa da correggere.

**CTA primaria**

> Analizza la mia attività

**CTA secondaria**

> Scrivi a Chris su WhatsApp

**Microcopy**

> Nessuna promessa di primo posto. Nessuna recensione falsa. Nessuna presentazione da agenzia.

---

## 10. Audit

### Campi

- nome;
- attività;
- città;
- categoria;
- telefono o WhatsApp;
- link del profilo Google, se disponibile.

### Messaggio dopo invio

> Chris guarderà il profilo e ti ricontatterà per mostrarti cosa vede oggi un cliente.

### Stati

- vuoto;
- compilazione;
- errore campo;
- invio;
- conferma;
- errore tecnico con alternativa WhatsApp.

### Regole

- nessun punteggio reputazionale automatico inventato;
- consenso e privacy visibili;
- nessuna iscrizione marketing implicita;
- WhatsApp come fallback chiaro;
- nessuna promessa di tempi non approvata.

---

## 11. Demo NFC/QR

La demo deve durare meno di sessanta secondi e funzionare senza account.

### Sequenza

1. scegli «simula il tap»;
2. il telefono si avvicina all'anello o supporto;
3. il percorso dimostrativo si apre;
4. viene mostrato lo stesso link per ogni cliente;
5. si chiarisce cosa vede il titolare;
6. CTA alla prova assistita.

### Vincoli

- non pubblica recensioni reali;
- non suggerisce il contenuto della recensione;
- non filtra sentiment o voto;
- non usa una dashboard come climax;
- ogni schermata dimostrativa è etichettata;
- funziona con tastiera e riduzione movimento.

---

## 12. Prova e claim

### Output controllabili

- richieste inviate;
- utilizzo di NFC o QR quando disponibile;
- recensioni pubblicate;
- risposte preparate o pubblicate;
- contenuti prodotti;
- aggiornamenti pubblicati;
- partecipazione del personale;
- tempi e checkpoint del trial.

### Risultati non garantibili

- posizione Google;
- chiamate;
- clienti;
- fatturato;
- citazioni nei motori AI;
- quantità minima di recensioni;
- rating.

### Protocollo caso studio

- attività identificata e autorizzata;
- screenshot baseline datato;
- periodo;
- clienti serviti, quando disponibile;
- richieste effettuate;
- output pubblici;
- intervento Trovatemi;
- attività svolta dal personale;
- limiti;
- screenshot finale;
- testimonianza soltanto dopo il risultato.

---

## 13. Design system

### Personalità

- premium;
- locale;
- concreta;
- umana;
- autorevole;
- contemporanea;
- mai corporate;
- mai futuristica.

### Colori

| Token | Valore | Uso |
|---|---|---|
| Ink | `#12161B` | testo, fondi scuri, contrasto |
| Paper | `#F7F5EF` | fondo principale |
| White | `#FFFFFF` | superfici reali e modali |
| Star | `#F5B301` | CTA primaria, Stella, momenti decisivi |
| Pin | `#D93025` | problema, perdita, errore; mai CTA primaria |
| Bone | `#E9E5DC` | separazione e superfici secondarie |
| Muted ink | `rgba(18,22,27,.68)` | testo secondario, con contrasto verificato |

Il giallo è una firma, non un riempimento continuo. Il rosso segnala il nemico o un errore, non il brand positivo.

### Tipografia

| Ruolo | Font | Desktop | Mobile | Line-height |
|---|---|---:|---:|---:|
| H1 | Anton | `clamp(72px, 8vw, 120px)` | `clamp(48px, 14vw, 64px)` | `0.90–0.94` |
| H2 | Anton | `clamp(50px, 5vw, 80px)` | `38–50px` | `0.94–1.00` |
| H3 | Archivo | `28–36px` | `24–30px` | `1.10–1.20` |
| Lede | Archivo | `20–22px` | `18–20px` | `1.45–1.55` |
| Body | Archivo | `18px` | `17px` | `1.55–1.65` |
| Micro | Space Grotesk | `12–13px` | `12–13px` | `1.35–1.50` |
| Numeri | Space Grotesk | fluido | fluido | `1` |

Anton non viene usato per paragrafi, FAQ, form o feature.

### Spaziatura

- gutter mobile: 20px;
- gutter tablet: 32px;
- container desktop: 1240–1320px;
- sezione desktop: 120–160px;
- sezione mobile: 72–96px;
- distanza H2/testo: 24–32px;
- distanza testo/CTA: 28–36px;
- target interattivo minimo: 44×44px;
- CTA principale: altezza minima 52px.

### Bordi e profondità

- bordo standard: 1px;
- bordo forte: 2px soltanto per CTA, confronto o oggetto NFC;
- hard shadow: massimo due occorrenze nella homepage;
- raggio: contenuto e sobrio, non pillole SaaS generalizzate;
- nessun muro di card.

### Fotografia

- persone e attività reali;
- luce naturale;
- mani e gesti;
- telefono leggibile;
- dettagli di bancone, reception, laboratorio o studio;
- Chris presente come operatore, non come guru;
- niente strette di mano stock;
- niente team finti;
- niente robot, globi o cervelli AI.

---

## 14. Shot list per la produzione

### Filmato hero

1. cliente conclude l'esperienza e sorride;
2. dettaglio dell'anello NFC;
3. doppio tap o avvicinamento del telefono;
4. percorso che si apre sul telefono;
5. conferma del gesto;
6. titolare guarda il profilo;
7. Chris e titolare controllano insieme.

### Fotografie

- ritratto verticale di Chris;
- Chris davanti a un'attività reale;
- anello NFC in mano;
- telefono sul punto di contatto;
- titolare dietro bancone o reception;
- cliente soddisfatto non riconoscibile senza consenso;
- dettaglio Google leggibile e autorizzato;
- eventuale fondatore soltanto con autorizzazione.

### Requisiti

- formati 4:5, 3:2 e 9:16;
- nessun dato personale non autorizzato;
- schermate dimostrative chiaramente distinguibili;
- versione senza audio;
- sottotitoli quando esiste voce;
- liberatorie per persone identificabili.

---

## 15. Movimento

Sono consentite soltanto animazioni con una funzione:

- impulso NFC;
- apertura del percorso;
- comparsa dell'output dimostrativo;
- avanzamento giorno 1 → 7 → 14;
- apertura audit e FAQ.

Da eliminare:

- reveal generalizzato di ogni blocco;
- parallasse decorativa;
- contatori animati;
- orbit e flywheel;
- scroll hijacking;
- caroselli automatici;
- elementi che si muovono senza aiutare la comprensione.

`prefers-reduced-motion` deve produrre un'esperienza completa e non degradata.

---

## 16. Componenti V8

| Componente | Responsabilità |
|---|---|
| `HeroSequence` | claim, CTA e sequenza documentaristica |
| `AuditPanel` | raccolta dati minima e stati del form |
| `MobileAuditBar` | CTA persistente dopo il primo viewport |
| `ProfileComparison` | confronto dimostrativo etichettato |
| `SearchVsScroll` | valore del momento della ricerca |
| `NfcDemo` | simulazione accessibile del gesto |
| `ChrisPromise` | persona, installazione e contatto umano |
| `TrialTimeline` | giorno 1, 7 e 14 |
| `PlanDecision` | domanda discriminante e orientamento |
| `PlanSummary` | trasformazione, prezzo, confini e CTA |
| `ProofProtocol` | prova disponibile e struttura futura dei casi |
| `FaqAccordion` | domande reali e schema coerente |
| `FinalAuditCta` | conversione finale |

I componenti non devono diventare una nuova UI library generica. Servono solo a rendere coerente il sito Trovatemi.

---

## 17. Implementazione tecnica prevista

### Stack esistente

- Astro;
- Cloudflare Workers;
- Tailwind CSS;
- daisyUI per primitive accessibili;
- font locali già installati.

### Regole

- nessuna nuova dipendenza senza bisogno dimostrato;
- Astro statico dove possibile;
- JavaScript solo per audit, demo, menu, FAQ e misurazione eventi;
- nessuna island React generalizzata;
- contenuti separati dalla presentazione;
- V7.2 conservata durante tutta la preview;
- preview su route separata;
- root modificata soltanto dopo approvazione.

### Struttura prevista

    src/
    ├── components/v8/
    ├── data/v8-content.ts
    ├── layouts/V8Layout.astro
    ├── pages/brand-demo-v8/index.astro
    └── styles/v8.css

    public/
    └── images/v8/

La struttura definitiva sarà verificata contro il repository prima dell'implementazione.

---

## 18. SEO e dati strutturati

### Homepage

- un solo H1;
- title specifico;
- description concreta;
- Organization schema appropriato;
- FAQ schema soltanto per FAQ visibili;
- breadcrumb sulle pagine interne;
- canonical coerenti;
- OG e Twitter card;
- nessun testo essenziale dentro immagini.

### Title di riferimento

> Trovatemi.it | Recensioni e presenza Google per attività locali

### Description di riferimento

> Trasforma clienti soddisfatti in recensioni e presenza pubblica. Prova Trovatemi per 14 giorni sulla tua vera attività, con attivazione assistita.

Le pagine categoria verranno progettate soltanto dopo keyword grounding e prova reale per la categoria.

---

## 19. Accessibilità

- WCAG 2.2 AA come obiettivo;
- contrasto verificato per ogni token;
- focus visibile;
- ordine di tab coerente;
- form con label reali;
- errori associati ai campi;
- dialog con focus trap e chiusura Escape;
- menu accessibile;
- target minimi 44×44px;
- immagini con alt funzionale;
- nessuna informazione affidata soltanto al colore;
- demo utilizzabile senza movimento;
- FAQ utilizzabili da tastiera;
- testo mobile minimo 17px salvo microcopy.

---

## 20. Performance

Target di progetto:

- LCP inferiore a 2,5 secondi su mobile rappresentativo;
- CLS inferiore a 0,1;
- INP inferiore a 200 ms quando misurabile;
- immagini AVIF/WebP responsive;
- poster leggero per il filmato hero;
- video lazy dopo il poster, salvo segmento essenziale ottimizzato;
- font locali e subset quando applicabile;
- niente librerie di animazione pesanti;
- niente JavaScript per contenuti statici;
- nessun asset non utilizzato.

---

## 21. Eventi di conversione da predisporre

La specifica definisce i nomi; l'integrazione analytics è fuori dal Gate 1.

- `audit_open`;
- `audit_submit`;
- `audit_error`;
- `whatsapp_click`;
- `demo_start`;
- `demo_complete`;
- `trial_request_open`;
- `plan_recommendation_view`;
- `trovato_cta_click`;
- `inevitabile_cta_click`;
- `faq_open`.

Nessun evento deve contenere dati personali nel nome o payload analytics.

---

## 22. Criteri di accettazione della preview

### Posizionamento

- [ ] il claim madre è l'unico H1;
- [ ] la hero parla del problema prima del prodotto;
- [ ] AI e dashboard non sono protagoniste;
- [ ] Climbo non viene nominato;
- [ ] RankEmpire non compare;
- [ ] Chris è visibile prima del trial e dei prezzi;
- [ ] il sistema appare installato e seguito, non soltanto accessibile.

### Conversione

- [ ] CTA primaria: audit;
- [ ] CTA secondaria: demo 60 secondi;
- [ ] trial comprensibile entro trenta secondi;
- [ ] audit chiede soltanto i sei campi previsti;
- [ ] WhatsApp è disponibile come alternativa;
- [ ] la scelta dei piani parte dalla domanda discriminante;
- [ ] nessun checkout è CTA primaria.

### Prova ed etica

- [ ] nessuna testimonianza fittizia;
- [ ] nessuna metrica inventata presentata come risultato;
- [ ] ogni esempio è etichettato;
- [ ] tutti ricevono lo stesso percorso recensione;
- [ ] nessun claim di ranking, clienti o fatturato;
- [ ] output e risultati sono distinti.

### Design

- [ ] sensazione premium senza perdere umanità;
- [ ] Trustars influenza il livello visuale, non le pratiche vietate;
- [ ] Mister Review influenza diagnosi e accompagnamento, non il freemium;
- [ ] massimo due hard shadow;
- [ ] nessun muro di card;
- [ ] fotografia reale come asset principale;
- [ ] gerarchia tipografica armonica;
- [ ] mobile progettato prima del desktop.

### Tecnica

- [ ] `npm run check` verde;
- [ ] `npm run build` verde;
- [ ] `npm run deploy:dry` verde;
- [ ] nessun overflow a 390, 430, 768, 1280 e 1440px;
- [ ] accessibilità tastiera verificata;
- [ ] reduced motion verificata;
- [ ] title, description, OG e schema verificati;
- [ ] V7.2 e root non modificate nella PR di preview.

---

## 23. Gate di rilascio

### Gate 1 — Specifica e wireframe

Chris approva:

- direzione Trustars × Mister Review × Trovatemi;
- sitemap;
- ordine delle sezioni;
- gerarchia mobile;
- componenti;
- asset da produrre.

### Gate 2 — Preview V8

Chris riceve:

- URL preview;
- screenshot mobile e desktop;
- confronto V7.2/V8;
- esiti check/build/dry-run;
- lista dei limiti e asset mancanti.

La preview non modifica root.

### Gate 3 — Produzione

Richiede:

- approvazione esplicita di Chris;
- risoluzione del conflitto commerciale prezzi;
- PR separata per il passaggio in root;
- preview finale della stessa commit candidata;
- merge e deploy autorizzati;
- verifica live successiva.

---

## 24. Decisione richiesta al Gate 1

La sola decisione richiesta è:

> Approvare o correggere la struttura V8 prima che inizi l'implementazione del frontend.

Nessuna decisione tecnica, commerciale o irreversibile viene incorporata silenziosamente in questa specifica.
