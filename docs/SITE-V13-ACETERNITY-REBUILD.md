# Trovatemi.it V13 — Aceternity rebuild

Stato: **copy gate — frontend bloccato fino ad approvazione esplicita**  
Branch: `agent/v13-aceternity-rebuild`  
Base: `agent/v13-climbo-demos` @ `239362d9cc54ad69311f64c6611b5a8d382ca705`  
Data: 8 agosto 2026

## 1. Decisione

La V13 non introduce una nuova identità e non riscrive Trovatemi come prodotto SaaS.

La ricostruzione combina quattro fonti con responsabilità distinte:

1. la V12 definisce UI, proporzioni, tipografia e componenti Aceternity;
2. `SITE-V8-SPEC.md` definisce la sequenza persuasiva e la voce commerciale;
3. la demo platform V13 conserva tenant, URL reali, embed e modalità di presentazione;
4. il materiale Climbo dimostra che dashboard e automazioni sono prova del servizio, non il suo messaggio iniziale.

La promessa madre torna a essere:

> **Il cliente ti sta già cercando. Il problema è che trova un altro.**

Il meccanismo visibile è:

> **Profilo reale → gesto NFC o QR → recensione pubblica → controllo umano.**

Il backend reale è una prova. Non è il protagonista del sito.

## 2. Regole non negoziabili

1. La root di produzione resta invariata.
2. La UI torna al sistema nero, crema, bianco e giallo della V12.
3. Nessuna superficie pubblica cambia palette in base al tenant.
4. Nessun nuovo effetto visuale viene costruito fuori dalla libreria Aceternity già presente.
5. Ogni pagina pubblica ha un solo H1 e una sola CTA primaria.
6. Le parole `backend`, `tenant` e `playground` non compaiono nel copy rivolto al prospect.
7. La demo mostra il prodotto reale con dati dimostrativi, senza attribuire risultati a clienti veri.
8. Il trial assistito non è una CTA pubblica universale.
9. Chris entra prima dell'offerta: installa, mostra e accompagna.
10. Nessuna posizione, citazione AI, quantità di recensioni o risultato commerciale viene garantito.

## 3. Gerarchia del messaggio

### 3.1 Perdita

> Il cliente ti sta già cercando. Il problema è che trova un altro.

### 3.2 Causa

> Non significa che il concorrente lavori meglio. Online sembra semplicemente più facile fidarsi di lui.

### 3.3 Meccanismo

> Trovatemi trasforma il momento in cui il cliente è soddisfatto in una richiesta semplice, una recensione pubblica e una prova che resta visibile.

### 3.4 Servizio umano

> Non ti lasciamo una piattaforma. La installiamo nella tua attività.

### 3.5 Prova

> Non devi crederci sulla parola. Puoi vedere il sistema con attività e dati costruiti per la dimostrazione.

### 3.6 Visione

> Non devi diventare virale. Devi diventare inevitabile.

## 4. Sequenza mentale richiesta

La homepage deve far pensare al titolare, in quest'ordine:

1. «Sta descrivendo qualcosa che succede davvero nel mio locale.»
2. «Il mio concorrente non deve essere più bravo: online può sembrare più affidabile.»
3. «Capisco quale gesto manca dopo che il cliente è soddisfatto.»
4. «Non devo imparare un altro software.»
5. «Posso vedere il sistema prima di parlare con qualcuno.»
6. «Voglio sapere cosa trova oggi un cliente quando cerca la mia attività.»

La demo non sostituisce questa sequenza. La rende credibile.

## 5. Vocabolario

### 5.1 Parole da usare

- attività;
- cliente soddisfatto;
- momento giusto;
- richiesta;
- recensione;
- risposta;
- prova pubblica;
- profilo Google;
- presenza;
- sistema;
- installare;
- accompagnare;
- controllare;
- dimostrazione;
- dati dimostrativi.

### 5.2 Parole da non usare nel copy pubblico

- backend;
- tenant;
- playground;
- stack;
- automazione AI come apertura;
- motore o flywheel;
- dashboard come prodotto;
- agenti come promessa madre;
- modalità live come CTA pubblica;
- trial come esca universale.

I nomi delle sezioni del prodotto possono comparire soltanto nella guida interna alla demo, perché aiutano realmente a navigarla.

## 6. Architettura delle CTA

| Superficie | CTA primaria | CTA secondaria | Trial |
| --- | --- | --- | --- |
| Homepage | `Fammi vedere cosa trova un cliente` | `Guarda una demo reale` | non promosso |
| Demo hub | `Scegli l'attività più simile alla tua` | nessuna | non promosso |
| Demo verticale | `Apri la dimostrazione` | `Apri a schermo intero` | solo conversazione |
| Biolink universale | `Scegli una demo reale` | `Scrivi a Chris` | non promosso |
| Biolink verticale | `Guarda la demo per il tuo settore` | `Scrivi a Chris` | non promosso |
| Landing verticale | `Fammi vedere cosa trova un cliente` | `Guarda la demo` | solo dopo contatto |
| Modalità presentazione | `Apri a schermo intero` | controllo del presentatore | dichiarato a voce |

## 7. Homepage — copy e wireframe

Route di preview: `/brand-demo-v13/`

### 7.1 Hero — La perdita

**Eyebrow**

> Per attività locali che lavorano bene, ma online non lo dimostrano abbastanza.

**H1**

> Il cliente ti sta già cercando.  
> Il problema è che trova un altro.

**Lede**

> Trovatemi installa nella tua attività un sistema semplice per trasformare clienti soddisfatti in recensioni, risposte e prove pubbliche che aiutano chi ti cerca a scegliere te.

**CTA primaria**

> Fammi vedere cosa trova un cliente

**CTA secondaria**

> Guarda una demo reale

**Microcopy**

> Nessuna promessa di primo posto. Nessuna recensione falsa. Nessuna presentazione da agenzia.

**Composizione Aceternity**

- `Spotlight`;
- `BackgroundBeams`;
- `TextGenerate`;
- `MovingBorderButton`;
- `TiltCard` per il confronto dimostrativo.

La hero non contiene dashboard, piani, prezzi o trial.

### 7.2 Scena — Il complimento dimenticato

**H2**

> Ogni mese servi clienti soddisfatti. Quanti diventano una recensione?

**Body**

> Il cliente paga, ti ringrazia e dice che scriverà qualcosa più tardi. Poi esce, torna alla propria giornata e quella buona intenzione sparisce.

**Colpo visuale**

> «Certo, la faccio dopo.»

**Chiusura**

> Il problema non è la qualità del tuo lavoro. È quanta qualità riesce a vedere chi ancora non ti conosce.

**Composizione**

- `Reveal` soltanto sull'introduzione;
- `WobbleCard` per la scena;
- nessuna griglia di quattro feature.

### 7.3 Confronto — La scelta

**H2**

> Non significa che il concorrente lavori meglio. Online sembra più facile fidarsi di lui.

**Body**

> Chi non conosce nessuna delle due attività vede quantità, freschezza, risposte e informazioni recenti. Decide con quello che trova, non con quello che tu sai di valere.

**Domanda**

> Se non conoscessi nessuna delle due attività, quale chiameresti per prima?

**CTA**

> Ora guardiamo il tuo confronto

**Composizione**

- due `CardSpotlight` chiaramente etichettate `Esempio illustrativo`;
- nessuna metrica inventata presentata come risultato;
- giallo usato soltanto per evidenziare il divario decisivo.

### 7.4 Meccanismo — Dal complimento alla prova

**H2**

> Il momento giusto esiste già. Trovatemi gli dà un seguito.

**Intro**

> Non chiediamo al titolare di ricordarsi tutto e non chiediamo al cliente di cercare il profilo da solo.

**Passaggi**

1. **Il cliente è soddisfatto.** Il servizio si è appena concluso e l'esperienza è ancora precisa.
2. **Avvicina il telefono o apre il QR.** Il percorso corretto si apre senza ricerche.
3. **Lascia la propria esperienza.** Tutti ricevono lo stesso percorso, senza filtro sul voto.
4. **Tu e Chris vedete cosa succede.** Richieste, recensioni e risposte restano controllabili.

**Composizione**

- `TracingBeam` per i quattro passaggi;
- `TiltCard` per il gesto NFC/QR;
- una sola animazione funzionale: apertura del percorso.

### 7.5 Chris — Il servizio che il software non contiene

**Eyebrow**

> Una persona reale, prima e dopo l'attivazione.

**H2**

> Non ti lasciamo una piattaforma. La installiamo nella tua attività.

**Body**

> Chris collega il profilo, prepara NFC e QR, mostra al personale quando chiedere e controlla che il sistema venga davvero utilizzato.

**Support copy**

> Se chiami, risponde Chris. Se qualcosa si blocca, non ricevi un link a una guida: lo guardiamo insieme.

**CTA**

> Scrivi a Chris su WhatsApp

**Composizione**

- `WobbleCard` con ritratto reale, quando disponibile;
- nessun avatar, chatbot o fotografia stock;
- la sezione precede demo, piani e qualsiasi eventuale trial.

### 7.6 Prova — Guarda il sistema

**Eyebrow**

> Una dimostrazione vera, con dati costruiti apposta.

**H2**

> Guarda cosa succede dopo che il cliente ha detto sì.

**Body**

> Scegli un'attività simile alla tua e naviga il sistema. Recensioni, richieste, risposte e contenuti sono dimostrativi; il prodotto che li organizza è reale.

**CTA**

> Scegli una demo reale

**Composizione**

- `CardSpotlight` per la scelta delle cinque attività;
- `AnimatedModal` oppure area espansa per l'embed;
- nessun autoload dell'iframe nella homepage;
- nessuna palette tenant fuori dall'iframe.

### 7.7 Scelta — Due problemi diversi

**H2**

> Più recensioni sarebbero sufficienti, oppure resterebbe il problema di mantenere viva la presenza?

**Risposta A**

> **TROVATO**  
> Raccoglie e gestisce la prova.

**Risposta B**

> **INEVITABILE**  
> Raccoglie, trasforma e distribuisce la prova.

**RETE**

> Coordina lo stesso sistema su più sedi, senza perdere la lettura locale.

**Nota**

> Questa domanda orienta la conversazione. Non sostituisce l'analisi di Chris e non apre un checkout.

**Composizione**

- `CardSpotlight` per TROVATO e INEVITABILE;
- RETE come fascia subordinata, non terza card identica;
- nessun badge `più popolare`;
- prezzi esclusi finché non approvati nel sistema commerciale canonico.

### 7.8 Visione

**H2**

> Non devi diventare virale.  
> Devi diventare inevitabile.

**Body**

> Quando qualcuno cerca, confronta o chiede consiglio a un assistente, deve trovare prove recenti, risposte curate e informazioni abbastanza chiare da poterti scegliere.

**Composizione**

- `Spotlight`;
- `BackgroundBeams`;
- nessuna feature e nessuna card.

### 7.9 FAQ — Dove diciamo no

1. **Garantite il primo posto su Google?**  
   No. Rendiamo più continuo e leggibile il lavoro su recensioni e presenza; nessuno può garantire una posizione.
2. **Filtrate le recensioni negative?**  
   No. Ogni cliente riceve lo stesso percorso. Non utilizziamo review gating.
3. **Devo imparare un software?**  
   No. Chris configura il sistema e ti mostra soltanto ciò che serve controllare.
4. **La demo modifica il mio profilo?**  
   No. Usa attività e dati dimostrativi e non collega il tuo account.
5. **Cosa succede dopo la demo?**  
   Se esiste un problema concreto, Chris può proporti audit, configurazione o prova assistita. Non esiste un passaggio automatico uguale per tutti.
6. **Fate gestione social completa?**  
   No. INEVITABILE può trasformare prove reali in contenuti e distribuirli sui canali collegati; non sostituisce una strategia social completa.
7. **Garantite nuovi clienti o citazioni nelle risposte AI?**  
   No. Possiamo rendere più chiare e continuative le informazioni pubbliche, non controllare la scelta di Google, degli assistenti o delle persone.

**Composizione**

- `AnimatedModal` non è necessario;
- accordion accessibile nativo, senza un nuovo effetto visuale;
- motion limitato all'apertura funzionale.

### 7.10 CTA finale — Il profilo reale

**H2**

> Vuoi vedere cosa trova oggi un cliente quando cerca il tuo servizio?

**Body**

> Partiamo dal tuo profilo, non da una presentazione. Guardiamo il confronto e capiamo se esiste davvero qualcosa da correggere.

**CTA primaria**

> Analizza la mia attività

**CTA secondaria**

> Scrivi a Chris su WhatsApp

**Microcopy**

> Nessuna promessa di primo posto. Nessuna recensione falsa. Nessun pagamento dal sito.

**Composizione**

- `Spotlight`;
- `BackgroundBeams`;
- `MovingBorderButton`.

## 8. Demo hub e demo verticali

### 8.1 Hub `/demo/`

**Eyebrow**

> Cinque attività dimostrative. Un solo sistema.

**H1**

> Guarda il prodotto mentre lavora.

**Lede**

> Scegli l'attività più vicina alla tua e naviga un ambiente reale con dati costruiti per la dimostrazione. Non serve un account e non puoi modificare profili veri.

**Istruzione**

> Non cercare tutte le funzioni. Segui il percorso: richiesta, recensione, risposta, prova pubblica.

Le card mostrano una situazione, non un elenco di feature.

### 8.2 Pagina `/demo/{id}/`

**Eyebrow**

> Dimostrazione per {settore} · dati dimostrativi

**H1**

Usa l'headline verticale definita nella sezione 11.

**Body comune**

> Entra nel sistema e guarda come vengono organizzate richieste, recensioni, risposte e contenuti. Nessuna azione raggiunge attività o clienti reali.

**CTA primaria**

> Apri la dimostrazione

**CTA secondaria**

> Apri a schermo intero

**Guida breve**

1. Apri la vista iniziale e leggi cosa è successo di recente.
2. Entra nelle recensioni e apri un'esperienza completa.
3. Guarda la risposta e gli output preparati dal sistema.

La guida può usare i nomi reali del menu soltanto quando sono necessari a orientare la navigazione.

### 8.3 Codice embed

Il codice embed resta disponibile, ma non compete con la dimostrazione.

- compare in `Strumenti per presentare`;
- si apre con `AnimatedModal`;
- è accompagnato da `Copia codice` e fallback a schermo intero;
- non compare nella homepage o nelle biolink;
- resta `noindex` insieme alle demo finché il sistema non viene promosso.

## 9. Biolink universale

Route: `/link/`

La pagina serve il profilo personale di Chris e i canali Trovatemi non verticali.

**Identità**

> Chris · Trovatemi.it

**H1**

> Il cliente ti sta già cercando. Vediamo cosa trova.

**Body**

> Aiuto attività locali a trasformare clienti soddisfatti in recensioni e prove pubbliche. Puoi vedere il sistema oppure scrivermi direttamente.

**CTA primaria**

> Scegli una demo reale

**CTA secondaria**

> Scrivi a Chris su WhatsApp

**Titolo selettore**

> Quale giornata assomiglia di più alla tua?

**Voci**

- Orologeria e retail premium;
- Spa e attività su appuntamento;
- Bar e caffetteria;
- Palestra e fitness;
- Hotel e ospitalità.

**Microcopy**

> Le attività e i dati delle demo sono dimostrativi. Il sistema che puoi navigare è reale.

### Regole visuali

- palette Trovatemi unica;
- nessun colore tenant;
- `MovingBorderButton` per la CTA primaria;
- `CardSpotlight` per le cinque voci;
- `Reveal` soltanto sull'ingresso della pagina;
- nessun orb personalizzato;
- nessuna azione `backend diretto` o `modalità live`.

## 10. Biolink verticali

Route: `/link/{id}/`

Ogni pagina risponde a una sola domanda: «Perché dovrei guardare questa demo?»

Struttura comune:

1. Wordmark e `Chris · Trovatemi`;
2. settore;
3. headline specifica;
4. due righe di spiegazione;
5. CTA primaria alla demo;
6. CTA secondaria WhatsApp;
7. ritorno alla scelta dei settori.

Non contiene landing, backend diretto, modalità live o quattro CTA equivalenti.

### 10.1 Orologeria

**H1**

> Prima di affidarti un acquisto importante, il cliente cerca prove.

**Body**

> Guarda come recensioni recenti, risposte curate e contenuti reali possono rendere più facile fidarsi della tua attività.

**CTA**

> Guarda la demo orologeria

### 10.2 Spa e benessere

**H1**

> Il trattamento finisce. La fiducia che ha creato può restare visibile.

**Body**

> Guarda come inserire la richiesta nel momento giusto e dare un seguito alle parole del cliente senza spezzare l'esperienza.

**CTA**

> Guarda la demo benessere

### 10.3 Bar e caffetteria

**H1**

> Il cliente dice «tutto perfetto». Poi esce e se ne dimentica.

**Body**

> Guarda come QR, NFC e richieste semplici trasformano quel momento al bancone in una prova che resta online.

**CTA**

> Guarda la demo bar

### 10.4 Palestra e fitness

**H1**

> I risultati degli iscritti si vedono in palestra. Fuori, spesso no.

**Body**

> Guarda come raccogliere esperienze legate a trainer, corsi e percorsi e renderle utili a chi sta confrontando le palestre.

**CTA**

> Guarda la demo fitness

### 10.5 Hotel e ospitalità

**H1**

> L'ospite vive decine di momenti. Online devono raccontare la stessa qualità.

**Body**

> Guarda come richieste, recensioni, risposte e contenuti possono restare leggibili anche quando l'esperienza attraversa più servizi.

**CTA**

> Guarda la demo hotel

## 11. Landing verticali

Route: `/per/{id}/`

Le landing condividono la UI, non il ragionamento. Ognuna possiede scena, perdita, meccanismo, prova e obiezione proprie.

### 11.1 Orologeria e retail premium

**Hero H1**

> Prima di affidarti un acquisto importante, il cliente cerca prove.

**Lede**

> Quando il valore della scelta è alto, il cliente legge recensioni, risposte e dettagli prima di entrare. Trovatemi rende più visibile la qualità che oggi dimostri soltanto in boutique.

**Scena H2**

> La vendita comincia prima della boutique.

**Scena body**

> Competenza, autenticità, assistenza e cura si capiscono davvero durante la consulenza. Prima dell'appuntamento, però, chi cerca deve ricostruirle da ciò che trova online.

**Obiezione**

> Non serve inseguire più persone. Serve non perdere chi sta già confrontando.

**Lente della demo**

> Apri una recensione, guarda la risposta e segui come quella prova può continuare nei contenuti.

### 11.2 Spa e centro benessere

**Hero H1**

> Il trattamento finisce. Il ricordo può continuare a lavorare.

**Lede**

> Trovatemi inserisce la richiesta quando l'esperienza è ancora precisa, senza trasformare il saluto finale in una pressione commerciale.

**Scena H2**

> Il momento giusto non è tre giorni dopo.

**Scena body**

> Dopo il trattamento il cliente sa esattamente cosa ha apprezzato. Quando la richiesta arriva troppo tardi, quella precisione si perde insieme alla voglia di scrivere.

**Obiezione**

> Non devi chiedere recensioni a voce a ogni cliente. Devi rendere naturale il gesto quando ha senso.

**Lente della demo**

> Guarda richieste post-appuntamento, recensioni legate al servizio e risposte coerenti con il tono dell'attività.

### 11.3 Bar e caffetteria

**Hero H1**

> «Certo, la faccio dopo.» È qui che perdi la recensione.

**Lede**

> Ogni giorno servi clienti soddisfatti che tornano alla propria giornata. Trovatemi rende semplice lasciare una prova mentre l'esperienza è ancora davanti a loro.

**Scena H2**

> Il momento migliore è ancora al bancone.

**Scena body**

> Il cliente ha appena finito, ti ringrazia e prende il telefono per pagare. QR e NFC entrano lì: non in un messaggio dimenticato una settimana dopo.

**Obiezione**

> Non servono clienti nuovi per avere più prove. Prima bisogna non perdere quelle prodotte dai clienti che hai già.

**Lente della demo**

> Segui una richiesta, apri la recensione e guarda come la stessa voce può diventare risposta e contenuto.

### 11.4 Palestra e fitness club

**Hero H1**

> I risultati degli iscritti sono reali. Online, però, spesso non si vedono.

**Lede**

> Le prove migliori emergono dopo una milestone, una lezione riuscita o un confronto con il trainer. Trovatemi aiuta a raccoglierle quando hanno ancora un significato preciso.

**Scena H2**

> La recensione nasce in una milestone, non in una campagna generica.

**Scena body**

> Un iscritto rinnova, raggiunge un risultato o finalmente si sente seguito. È quello il momento in cui può raccontare staff, metodo e ambiente.

**Obiezione**

> Non devi trasformare ogni allenamento in marketing. Devi riconoscere pochi momenti giusti e renderli facili da usare.

**Lente della demo**

> Cerca feedback su trainer, corsi e struttura; poi guarda come vengono organizzati risposta e contenuti.

### 11.5 Hotel e ospitalità

**Hero H1**

> Ogni soggiorno lascia un ricordo. Il problema è farlo arrivare online.

**Lede**

> Check-in, camera, colazione, ristorante, spa e assistenza producono impressioni diverse. Trovatemi aiuta a raccoglierle e mantenerle leggibili nello stesso processo.

**Scena H2**

> Il check-out non è l'unico momento che conta.

**Scena body**

> L'ospite può essere soddisfatto del soggiorno e avere parole precise su un solo servizio. La richiesta deve rispettare il viaggio e il contesto, non ridurli a un messaggio generico.

**Obiezione**

> Non basta rispondere su una sola piattaforma. Serve una regia che mantenga coerenti fonti, temi e responsabilità.

**Lente della demo**

> Confronta fonti e temi, segui la richiesta post-soggiorno e guarda gli output costruiti dalla voce degli ospiti.

### CTA comune delle landing

**CTA primaria**

> Fammi vedere cosa trova un cliente

**CTA secondaria**

> Guarda la demo per {settore}

**Chiusura**

> Partiamo dal profilo reale. Se il problema esiste, Chris ti mostra il passo successivo. Nessun trial viene attivato automaticamente.

## 12. Modalità presentazione

URL tecnico conservato: `/demo/{id}/?mode=live`

La modalità presentazione è uno strumento di Chris per walk-in, call e live online.

Regole:

- non è linkata dalle biolink o dalle landing;
- resta `noindex`;
- carica direttamente la demo;
- mostra soltanto wordmark, una frase di contesto, embed e fullscreen;
- nasconde related demos, codice embed, footer esteso e CTA commerciali;
- il trial viene spiegato a voce, se pertinente al prospect.

## 13. Ruolo del trial

Il trial non viene eliminato dal processo commerciale. Cambia posizione.

| Origine | Percorso |
| --- | --- |
| Visitatore del sito | diagnosi → demo → conversazione → eventuale trial |
| Lead social | biolink → demo verticale → WhatsApp → eventuale trial |
| Walk-in freddo | confronto o NFC → mini-demo → eventuale trial |
| Referral caldo | demo → proposta; trial opzionale |
| Multi-sede | audit → demo → analisi sedi → proposta dedicata |

Il sito non usa `14 giorni gratis`, `prova gratuita` o equivalenti come CTA generale.

## 14. Sistema visuale

### 14.1 Palette unica

| Token | Valore | Uso |
| --- | --- | --- |
| Ink | `#050505` / `#12161B` | fondi scuri e testo |
| Paper | `#F7F5EF` | fondo editoriale |
| White | `#FFFFFF` | superfici e contrasto |
| Star | `#F5B301` | CTA, Stella, momento decisivo |
| Bone | `#E9E5DC` | separazioni |
| Muted | coerente con V12 | testo secondario |

Il giallo è una firma, non il fondo di ogni elemento. I colori dei tenant restano confinati all'app incorporata, se presenti nell'app stessa.

### 14.2 Tipografia

- Anton: H1, H2 brevi, nomi TROVATO/INEVITABILE/RETE;
- Archivo: body, H3, FAQ e form;
- Space Grotesk: label, numeri, microcopy e controlli;
- nessun heading lungo costruito come testo da dashboard;
- nessun H1 oltre tre righe desktop o quattro righe mobile.

### 14.3 Proporzioni

- container desktop: `1200px` come V12;
- gutter mobile: `18–20px`;
- sezioni desktop: `112–144px`;
- sezioni mobile: `72–92px`;
- body: massimo `62ch`;
- massimo due colonne narrative;
- nessun muro di card;
- un solo elemento dominante per viewport.

## 15. Libreria Aceternity ammessa

Fonte: `src/components/v12/Aceternity.tsx`.

Componenti disponibili:

- `Reveal`;
- `TextGenerate`;
- `Spotlight`;
- `BackgroundBeams`;
- `MovingBorderButton`;
- `CardSpotlight`;
- `WobbleCard`;
- `TiltCard`;
- `StickyReveal`;
- `TracingBeam`;
- `AnimatedModal`.

Regola implementativa:

> Si possono creare componenti di dominio, ma nessuna nuova primitiva di effetto.

Esempi ammessi:

- `HomeExperience` compone `Spotlight`, `TextGenerate` e `TracingBeam`;
- `BioLinkExperience` compone `MovingBorderButton` e `CardSpotlight`;
- `DemoExperience` compone `AnimatedModal` e l'embed reale.

Esempi vietati:

- un nuovo orb CSS;
- un secondo moving border;
- un'altra implementazione di beams;
- reveal manuali con `IntersectionObserver`;
- effetti hover non presenti nella libreria;
- palette dinamica per tenant.

## 16. Separazione dei dati

L'attuale catalogo mescola configurazione tecnica, colore e copy. Va separato.

### `demo-tenants.ts`

Contiene soltanto:

- id;
- category Climbo;
- nome dimostrativo;
- nome breve;
- URL;
- nomi reali delle sezioni da aprire;
- istruzioni tecniche della demo.

### `vertical-messaging.ts`

Contiene:

- settore;
- scena;
- perdita;
- momento;
- obiezione;
- headline biolink;
- headline landing;
- lente della demo;
- CTA.

### `site-copy.ts`

Contiene:

- promessa madre;
- meccanismo;
- CTA globali;
- FAQ;
- confini etici;
- copy di TROVATO, INEVITABILE e RETE.

Nessun file dati contiene colori tenant utilizzati dal sito pubblico.

## 17. Route e intento

| Route | Intento unico | Indicizzazione |
| --- | --- | --- |
| `/brand-demo-v13/` | valutare homepage | noindex |
| `/demo/` | scegliere una dimostrazione | noindex |
| `/demo/{id}/` | provare il sistema | noindex |
| `/demo/{id}/?mode=live` | presentare il sistema | noindex |
| `/link/` | convertire traffico social generico | noindex |
| `/link/{id}/` | convertire traffico social verticale | noindex |
| `/per/` | scegliere un settore | noindex |
| `/per/{id}/` | riconoscersi nel problema del settore | noindex |
| `/archivio/home-v7-2/` | rollback editoriale | noindex |
| `/` | produzione attuale | invariata |

## 18. Gate prima del frontend

Il frontend può iniziare soltanto dopo l'approvazione di:

- promessa e CTA della homepage;
- struttura della biolink;
- cinque headline verticali;
- posizione del trial;
- lessico vietato;
- mapping dei componenti Aceternity.

## 19. Gate della preview

La preview deve dimostrare:

1. nessun colore tenant nelle superfici Trovatemi;
2. nessuna occorrenza pubblica di `backend`, `tenant` o `playground`;
3. nessuna CTA pubblica al trial;
4. un solo H1 e una CTA primaria per pagina;
5. demo reali funzionanti per tutti e cinque i settori;
6. codice embed copiabile dalla sola pagina demo;
7. modalità presentazione non linkata pubblicamente;
8. componenti visuali importati soltanto dalla libreria Aceternity ammessa;
9. nessun nuovo `@keyframes` fuori dallo stylesheet della libreria;
10. root di produzione invariata;
11. resa verificata a 390, 768, 1280 e 1440 px;
12. tastiera, focus, reduced motion e fallback iframe verificati.

## 20. Strategia Git e rilascio

1. Questa branch sostituisce il percorso UI/copy delle PR #18 e #19.
2. Le PR #16 e #17 restano la base tecnica valida.
3. Nessuna vecchia PR viene chiusa prima che la nuova preview sia approvata.
4. La prima PR della rebuild contiene questo contratto e il frontend conseguente.
5. La preview usa un Worker Cloudflare isolato.
6. La root cambia soltanto con una PR di promozione separata e autorizzazione sul commit esatto.

## 21. Input reali ancora mancanti

La ricostruzione non inventa destinazioni o asset non presenti nel repository.

Prima di rendere operative le conversioni servono:

- URL o numero WhatsApp ufficiale di Chris;
- destinazione reale dell'audit e relativi campi;
- ritratto autorizzato di Chris;
- eventuale prezzo pubblico approvato in fonte canonica.

Finché mancano, la preview usa modali esplicitamente dimostrative e non trasmette dati.
