# Trovatemi Revenue MVP — reset zero-base

**Versione:** 0.1
**Data:** 7 settembre 2026
**Stato:** proposta decisionale — nessuna implementazione o pubblicazione autorizzata
**Obiettivo:** arrivare al primo incasso reale con il minimo sistema che consegna valore, senza trasformare Trovatemi in un progetto infinito.

## 0. Ricostruzione e gerarchia delle fonti

Il reset nasce da fonti che oggi si contraddicono. Non ne viene cancellata nessuna; cambia il ruolo che svolgono.

| Fonte | Cosa contiene | Ruolo nel reset |
|---|---|---|
| `trovatemi-os` PR #14 | prodotto €149/mese, trial 21 giorni, Beauty first configuration, D1 → Climbo | baseline architetturale e ipotesi commerciale precedente |
| chat successiva “Kit dispositivi Trovatemi” | check → preview → €149 subito → attivazione, field sales e loop inbound locale | ipotesi commerciale più recente, da trattare come first-class |
| web PR #31 / H0 | sistema creativo, meme e master-home preview | libreria creativa; accettazione H0 revocata |
| web PR #33 / Check v2 | Places lookup e diagnosi deterministica, ma persistenza/email/payment assenti | prototipo tecnico da estrarre selettivamente |
| audit Climbo | onboarding, review flow, limiti e stato operativo fotografato | evidenza di delivery da riconfermare prima del pilot |
| branch e PR precedenti | molte iterazioni di prodotto, funnel e design | archivio storico, non backlog da fondere |

Questo documento non diventa canonico perché è stato scritto: diventa canonico solo dopo decisione esplicita del founder. Se approvato, sostituisce l'ordine `H0 → L2 → trial` con l'ordine `revenue spine → demo reale → pagamento → delivery`.

## 1. Decisione executive proposta

Trovatemi non va lanciato come directory, software self-service, audit SEO o homepage elegante. Il primo prodotto vendibile deve essere un servizio-prodotto assistito che usa software dietro le quinte:

> **Trovatemi rende visibile il valore che un'attività ha già, sistema il percorso con cui un cliente la capisce e la contatta, e mette in moto il primo flusso autentico di passaparola online.**

La domanda MVP non è “piace il sito?” e non è “un utente inizia un trial gratuito?”. È:

> **Dopo aver visto la propria attività, il problema reale e una preview concreta del dopo, un titolare paga €149 nella stessa sessione?**

### Offerta raccomandata per la sola coorte MVP

**Trovatemi — Attivazione Fondatori**

- €149 pagati subito; trattamento IVA da confermare prima della pubblicazione;
- massimo 10 attività, una sede ciascuna;
- 90 giorni inclusi, senza rinnovo automatico nel test iniziale;
- Trovatemi Check personalizzato;
- preview “oggi / con Trovatemi”;
- pagina Trovatemi verificata e pronta da condividere;
- contatti, servizi essenziali, indicazioni e social proof disponibile;
- link e QR digitale;
- setup review flow assistito;
- primo invio autentico, neutrale e autorizzato;
- verifica finale before/after.

Questa non è l'offerta definitiva. È un'offerta di validazione a disponibilità limitata. Serve a testare disponibilità a pagare, tempo di delivery e valore percepito senza aspettare il giorno 22 di un trial gratuito.

### Perché questa ipotesi viene prima

Il modello precedente `21 giorni €0 → €149/mese` testa la ricorrenza, ma non produce denaro subito e può confondere interesse gratuito con volontà di acquisto. La coorte `€149 subito / 90 giorni` testa invece la variabile più urgente: il titolare paga davvero per essere attivato?

Se il test funziona, il modello ricorrente viene deciso con dati di uso e retention. Se non funziona, non abbiamo trascorso tre settimane a costruire una macchina di trial per scoprire che l'offerta non vende.

## 2. Cosa cambia rispetto al piano precedente

### H0 non è più il gate

L'accettazione informale di H0 è revocata. La pagina corrente resta un deposito di direzione creativa e messaggi utili, ma non blocca il percorso al denaro e non viene trattata come master home approvata.

Conserviamo:

- `Hai già clienti felici. Fai in modo che si veda.`
- `Peccato che Google non era lì.`
- `50 clienti felici. 4 recensioni.`
- il contrasto fra qualità reale e prova visibile;
- la grammatica scena → contraddizione → prova personale → azione;
- il test “ogni frame deve poter vivere come screenshot o messaggio WhatsApp”.

Non conserviamo automaticamente:

- la struttura della H0 attuale;
- Beauty come linguaggio del master;
- il lookup finto/disabilitato;
- il confronto con rating o recensioni costruite ad arte;
- claim come “più clienti” non ancora dimostrati;
- H0 come prerequisito alla vendita.

### Il Check cambia ruolo

Il Check resta la prima esperienza del prodotto e un pre-onboarding diagnostico, ma non culmina in un report lungo. Culmina nella preview del dopo e in una decisione commerciale.

```text
evidenza pubblica vera
  +
5 risposte operative
  +
diagnosi deterministica
  =
preview concreta del dopo
  →
attivazione pagata
```

### Climbo resta downstream

Climbo non è la proposta commerciale, il CRM o la UI pubblica. È un motore operativo dopo il pagamento. Nei primi clienti viene configurato manualmente e in modo assistito. Nessuna automazione API è prerequisito per il primo incasso.

Il primo valore controllabile non è una nuova recensione, un ranking o un nuovo cliente. È:

> **la prima richiesta di recensione autentica, neutrale e autorizzata inviata con successo a un cliente reale.**

## 3. Cliente iniziale e campo di battaglia

### Beachhead

Il primo campo non è “tutte le attività italiane”. È:

> **Formia e dintorni, bar/caffetterie/piccoli locali vivi, raggiungibili direttamente dal founder.**

Il criterio non è la nicchia teoricamente perfetta. È il founder-market fit: accesso al titolare, linguaggio naturale, possibilità di fare una demo sul business reale e chiudere sul posto.

Beauty non viene cancellata. Diventa la seconda configurazione da riusare dopo la prima prova commerciale, non il vincolo che decide la root e il prodotto.

### Profilo del prospect

Cerchiamo attività che:

- lavorano già e hanno clienti reali;
- hanno una scheda Google esistente;
- mostrano un divario evidente fra qualità offline e prova online;
- hanno informazioni, servizi o prossimo passo poco chiari;
- possono autorizzare l'accesso e fornire una piccola lista di clienti contattabili;
- hanno il titolare o decisore raggiungibile.

Escludiamo attività moribonde, senza capacità di delivery o che chiedono promesse di ranking/lead garantiti.

## 4. Il prodotto MVP

### Il rito commerciale

```text
contatto caldo / visita / WhatsApp
  → cerca la tua attività
  → conferma identità
  → guarda i fatti pubblici
  → rispondi a 5 domande semplici
  → vedi dove il passaparola si spegne
  → vedi la preview del dopo
  → “Vuoi che te lo attivi?”
  → checkout €149
  → onboarding essenziale
  → pagina live + review flow
  → prima richiesta inviata
```

La demo deve durare 5–7 minuti. Il cliente deve vedere il proprio business, non una presentazione generica di Trovatemi.

### Due modalità, una sola macchina

Il percorso non si duplica:

- **Field/assistito:** il founder apre direttamente il business preparato, conduce il Check e arriva alla preview. Nessuna email obbligatoria prima del checkout; Stripe raccoglie il contatto dell'acquirente.
- **Inbound/self-serve:** il titolare cerca la propria attività. Dopo la preview può pagare oppure salvare il risultato via email. L'eventuale consenso marketing è separato e facoltativo.

Il field mode viene costruito e validato per primo. L'inbound non può aggiungere complessità finché la demo assistita non converte.

### Le cinque domande

Le domande raccolgono solo ciò che i dati pubblici non possono sapere e devono essere riutilizzate nell'onboarding:

1. Come chiedi oggi una recensione?
2. Chi risponde alle recensioni?
3. Cosa fai quando arriva una recensione molto buona?
4. Dove rendi visibile la prova dei clienti?
5. Quanti clienti servi indicativamente in una settimana?

Ogni risposta restituisce una micro-osservazione prima della domanda successiva. Nessun punteggio pubblico `67/100`.

### La preview del dopo

È il principale oggetto di vendita. Deve mostrare la stessa attività con:

- identità e proposta leggibili;
- foto approvate;
- servizi essenziali;
- rating e recensioni senza manipolazioni;
- telefono, WhatsApp, indicazioni e CTA corretti;
- link/QR per il percorso concordato;
- spiegazione visiva del review flow;
- stato `PREVIEW`, mai confuso con una pagina già pubblicata.

La preview non promette traffico. Fa vedere una presenza e un processo più chiari.

### La delivery pagata

Entro 24 ore dall'onboarding completo:

- pagina Trovatemi pubblicata o condivisibile secondo consenso del cliente;
- dati e CTA verificati dal titolare;
- QR digitale consegnato;
- Climbo configurato manualmente con preset minimo;
- Google Business Profile collegato solo via accesso Manager/OAuth;
- template neutrale approvato;
- singolo invio di prova;
- piccolo lotto reale solo dopo conferma del test.

Niente credenziali Google condivise. Niente review gating. Niente incentivi o copy prefabbricato per ottenere cinque stelle. Google consente di condividere link e QR per chiedere recensioni autentiche, ma vieta incentivi e manipolazioni: [guida ufficiale](https://support.google.com/business/answer/16816815) e [policy](https://support.google.com/contributionpolicy/answer/16597558).

## 5. Superficie tecnica minima

Le route sono indicative; il contratto funzionale conta più dei nomi:

| Superficie | Responsabilità |
|---|---|
| `/go/<codice>` | ingresso attribuito per visita, WhatsApp, QR o asset |
| `/check` | lookup reale, conferma, fatti pubblici e cinque domande |
| `/r/<token>` | diagnosi persistente e privata |
| `/preview/<token>` | preview personalizzata del dopo |
| `/attiva/<token>` | riepilogo offerta e avvio checkout |
| Stripe Checkout | pagamento ospitato, wallet e ricevuta |
| `/benvenuto` | raccolta dei soli dati mancanti e stato attivazione |
| `/a/<slug>` | presenza Trovatemi approvata del cliente |

### D1 minimo

D1 deve essere la fonte di verità pre e post vendita per:

- `business` — identità pubblica e provenance;
- `check_session` — stato, versione e campaign context;
- `answer` — risposte private versionate;
- `diagnosis` — output deterministico e replayable;
- `lead` — contatto e consensi separati;
- `order` — importo, valuta, stato e riferimenti Stripe;
- `activation` — onboarding, delivery e timestamp;
- `event` — eventi idempotenti della macchina.

Climbo riceve un cliente solo dopo `payment_succeeded`. Per i primi 1–3 clienti il provisioning è manuale; ogni effetto viene comunque registrato in D1.

### Stripe minimo

Il vecchio payment link nel repository è inattivo e non può essere riutilizzato. Il nuovo checkout deve:

- vendere un solo prodotto una tantum;
- ricevere un riferimento opaco all'attività;
- reindirizzare a `/benvenuto`;
- registrare `checkout.session.completed` con firma e idempotenza;
- distinguere completamento del checkout da fondi effettivamente confermati per metodi asincroni;
- essere provato prima in test mode, poi con un pagamento reale controllato.

Il lookup deve avere timeout, rate limit per sessione/IP, quota giornaliera, cache/deduplica e kill switch. La preview pilot non può dichiararsi valida se sta usando fixture al posto del provider reale.

Stripe Payment Links supporta pagamenti una tantum, redirect e webhook di completamento: [documentazione ufficiale](https://docs.stripe.com/payment-links) e [tracking](https://docs.stripe.com/payment-links/url-parameters). Le commissioni pubblicate per carte SEE standard sono attualmente `1,5% + €0,25`, da riverificare al go-live: [pricing Italia](https://stripe.com/it/pricing).

## 6. Cosa riusiamo e cosa no

### Da riusare come componenti, non come architettura

- PR #31: asset, ritmo, meme, tipografia e alcune scene;
- PR #33: adapter Google Places, field mask ridotte, escape UI e motore diagnostico deterministico;
- specifica L2: provenance, fallback onesti, token privati, eventi e separazione dei consensi;
- audit Climbo: onboarding assistito, preset reviews-first e sequenza primo invio;
- D1 refinement: command/effect identity e idempotenza.

### Da lasciare fuori

- root Beauty;
- report PDF o Reportly;
- benchmark non verificabili;
- ranking locale promesso;
- score pubblico 0–100;
- dashboard cliente;
- app mobile;
- CRM custom;
- agenti GEO/social/SEO come proposta commerciale;
- directory nazionale e programmatic SEO;
- ads a pagamento;
- scorte NFC o tablet prima dei primi due pagamenti;
- automazione completa Climbo;
- più piani e sconti permanenti.

## 7. Strategia Git e convergenza

Il reset deve essere reale anche tecnicamente.

1. `main` resta congelato sulla produzione attuale.
2. PR #28, #31 e #33 diventano sorgenti da cui estrarre parti, non una stack da mergiare.
3. Dopo l'approvazione del presente piano, si crea un solo branch pulito da `main`, proposto: `codex/revenue-mvp-v0`.
4. Si importano solo i moduli necessari, preferibilmente come patch/squash leggibili.
5. Quando la nuova vertical slice riproduce gli elementi riusati, PR #28/#31/#33 vengono chiuse come superseded.
6. PR #11–#22 e #6 vengono chiuse come archivio storico, senza cancellare subito i branch.
7. Nessun merge su `main` prima del pagamento test, della QA mobile e del gate esplicito di produzione.

La CI del nuovo branch deve eseguire test, typecheck, build e dry-run. L'attuale CI principale non esegue `npm test` e lo smoke test produzione è legato a copy V7.2: entrambi vanno corretti prima di qualsiasi cutover.

I token di report e preview non devono finire nei log del Worker. I dati Google usati nel Check restano evidenza diagnostica soggetta ai termini del provider; la pagina pubblica usa dati first-party verificati dal titolare e soltanto integrazioni Google consentite, non una copia permanente indiscriminata dello snapshot Places.

## 8. Piano operativo dopo approvazione

### R0 — Decisione e revenue readiness (mezza giornata)

- approvare offerta, durata, IVA e condizioni;
- identificare il primo business reale e il decisore;
- congelare il nuovo contratto di prodotto nel repo canonico;
- verificare identità del venditore, fatturazione e documenti legali;
- creare il nuovo branch unico e mettere in pausa le PR precedenti.

**Gate R0:** possiamo descrivere in una frase cosa compra il cliente, cosa riceve, entro quando, cosa non è garantito e cosa succede al giorno 91.

### R1 — Spina dorsale transazionale (1 giorno)

- schema D1 minimo e migrazioni;
- checkout Stripe test;
- webhook idempotente;
- pagina benvenuto;
- timeline ordine/attivazione;
- test end-to-end con pagamento simulato.

**Gate R1:** un pagamento test crea una sola attivazione, è ripetibile senza duplicati e può essere riconciliato.

### R2 — Demo che chiude (2 giorni)

- lookup reale cost-controlled;
- conferma attività;
- fatti pubblici con fonte e timestamp;
- cinque domande con micro-risposta;
- diagnosi deterministica;
- preview personalizzata;
- CTA `Attiva questa attività — €149`.

**Gate R2:** una vera attività completa il flusso su telefono in meno di 7 minuti, senza dati finti o claim non provati.

### R3 — Delivery reale (1–2 giorni)

- template pagina Trovatemi;
- onboarding essenziale;
- preset Climbo verificato nell'interfaccia corrente;
- collegamento GBP via percorso autorizzato;
- richiesta singola di test;
- piccolo batch reale;
- log `first_request_sent` e `first_request_delivered`.

**Gate R3:** un cliente pagato può arrivare al primo valore entro 48 ore dalle autorizzazioni necessarie.

### R4 — Sprint incasso (massimo 5 giorni)

- 10 prospect qualificati nella stessa zona/categoria;
- preparazione massima 10 minuti per prospect;
- 10 conversazioni col decisore;
- demo 5–7 minuti;
- richiesta esplicita di attivazione in ogni caso con fit;
- follow-up entro la giornata, non preventivi su misura.

**Gate R4:**

- `2+ pagamenti / 10 demo` → GO, iniziare test di delivery/retention;
- `1 pagamento / 10 demo` → ITERATE offerta, preview o target;
- `0 pagamenti / 10 demo` → STOP sviluppo, rivedere promessa/prezzo/demo;
- nessuna feature aggiuntiva può compensare un gate commerciale fallito.

## 9. Money math e limiti operativi

La coorte non deve dimostrare margine definitivo; deve impedire che vendiamo un servizio ingestibile.

- 2 vendite = €298 di ricavi contrattuali prima di IVA, commissioni, imposte e costi;
- 10 vendite = €1.490 prima di IVA, commissioni, imposte e costi;
- alla tariffa Stripe SEE oggi pubblicata, una transazione da €149 costa circa €2,49 se il checkout è €149 complessivi;
- nessun tablet, scorta NFC o advertising prima dei primi due pagamenti;
- QR e kit iniziale sono digitali o stampati on-demand;
- massimo 3 clienti contemporanei finché non misuriamo il carico.

Dopo i primi 3 clienti devono essere veri questi limiti:

- onboarding founder ≤ 60 minuti;
- preparazione/delivery aggiuntiva ≤ 30 minuti;
- supporto medio ≤ 15 minuti a settimana per cliente;
- costi cash diretti dei 90 giorni ≤ €20 per cliente, esclusi costi fissi già sostenuti;
- ogni eccezione viene registrata, non assorbita silenziosamente.

Se i limiti saltano, il prezzo, la durata o la delivery cambiano prima di vendere la coorte successiva.

## 10. Scoreboard unico

### Funnel commerciale

- owner conversations;
- business confirmed;
- check completed;
- preview viewed;
- checkout started;
- payment succeeded;
- `demo → paid`;
- euro incassati.

### Delivery

- onboarding minutes;
- page approved/live;
- GBP connected;
- template approved;
- first request sent;
- first request delivered;
- first review observed, separata dal valore controllabile;
- support minutes per customer;
- refund/cancellation reason.

### Soglie MVP

- almeno 2 pagamenti veri da 10 demo;
- almeno 1 cliente a first value entro 48 ore;
- onboarding assistito entro 60 minuti;
- nessuna anomalia di pagamento o duplicazione;
- nessuna promessa di risultato usata per chiudere;
- massimo 3 attivazioni contemporanee finché non conosciamo il carico reale.

## 11. Gate legali e operativi non negoziabili

I documenti non tracciati del 15 agosto sono bozze generiche e non sono pronti per un checkout reale. Prima dell'incasso devono essere allineati al prodotto effettivo e verificati da un professionista quando necessario. In particolare mancano o sono incoerenti:

- identità completa del venditore e dati fiscali;
- prezzo con/senza IVA;
- contenuto, SLA e durata esatti dell'Attivazione Fondatori;
- regole al giorno 91, recesso, rimborso e sospensione;
- ruolo di Trovatemi e Climbo nel trattamento dati;
- subprocessori effettivi e DPA;
- basi giuridiche e prova del consenso per i destinatari delle richieste;
- cookie e analytics realmente usati;
- gestione delle pagine pubbliche e autorizzazione del titolare;
- fatturazione elettronica e riconciliazione Stripe.

Nessun dato cliente reale viene importato in Climbo e nessuna richiesta viene inviata prima di questo gate.

## 12. Decisioni richieste prima di costruire

### D1 — Offerta di validazione

Raccomandazione: **€149 subito / 90 giorni / massimo 10 / nessun rinnovo automatico**.

Alternative:

- `21 giorni €0 → €149/mese`: migliore test di ricorrenza, primo incasso più lento;
- `€149 setup → €149/mese dal giorno 31`: economics migliori, frizione commerciale più alta.

### D2 — Cosa accade al giorno 91

Raccomandazione MVP: la pagina base resta consultabile; automazioni, gestione e aggiornamenti si fermano. La proposta ricorrente viene definita solo dopo aver misurato uso, risultati e costo di servizio.

### D3 — Primo campo

Raccomandazione: **10 bar/caffetterie/piccoli locali di Formia e dintorni**, partendo dai contatti più caldi. Beauty è la seconda replica.

### D4 — Strategia tecnica

Raccomandazione: **branch pulito da `main`**, con estrazione selettiva da PR #31/#33; nessun merge della stack corrente.

## 13. Definizione di vittoria

Il Revenue MVP è validato quando:

> **un titolare reale vede Trovatemi, trova e conferma la propria attività, riconosce un problema vero, desidera la preview del dopo, paga €149 nella stessa sessione e arriva alla prima richiesta autentica inviata senza dover imparare un software.**

Tutto ciò che non aumenta la probabilità o l'affidabilità di questa sequenza è fuori scope.
