# TROVATEMI.IT V8 — Wireframe mobile-first

**Stato:** proposta Gate 1  
**Viewport primario:** 390 × 844 px  
**Viewport di controllo:** 430 × 932 px  
**Dipendenza:** `SITE-V8-SPEC.md`  
**Nota:** questo documento definisce gerarchia, contenuto e comportamento; non è un mockup visuale definitivo.

---

## 1. Principio mobile

Il titolare può arrivare da WhatsApp, aprire la pagina con una mano e decidere in pochi secondi se continuare.

Il wireframe deve quindi garantire:

- claim leggibile senza zoom;
- CTA primaria entro il primo viewport;
- demo raggiungibile senza menu;
- nessun testo sotto 17px salvo microcopy;
- nessuna griglia desktop schiacciata;
- nessuna card orizzontale da trascinare;
- nessun elemento importante affidato a hover;
- form compilabile con tastiera mobile;
- barra audit persistente dopo la hero;
- WhatsApp sempre riconoscibile ma non invasivo.

---

## 2. Griglia e misure

| Token | Valore mobile |
|---|---:|
| viewport di progetto | 390px |
| gutter | 20px |
| colonna utile | 350px |
| spazio sezione minimo | 72px |
| spazio sezione ampio | 96px |
| distanza verticale standard | 24px |
| altezza CTA | 54–58px |
| target minimo | 44×44px |
| body | 17px / 1.6 |
| lede | 19px / 1.5 |
| H1 | 48–58px / 0.94 |
| H2 | 40–48px / 0.98 |
| H3 | 25–29px / 1.15 |

Nessuna sezione deve dipendere da un'altezza fissa. Il contenuto può crescere con zoom e preferenze del sistema.

---

## 3. Navigazione

### Stato iniziale

    ┌──────────────────────────────────────┐
    │ TROVATEMI.IT                  [MENU] │
    └──────────────────────────────────────┘

- altezza indicativa: 68px;
- fondo Ink;
- wordmark Paper con Stella;
- menu 44×44px;
- posizione sticky;
- nessuna CTA aggiuntiva nel primo stato.

### Menu aperto

    ┌──────────────────────────────────────┐
    │ TROVATEMI.IT                 [CHIUDI]│
    ├──────────────────────────────────────┤
    │ Perché                               │
    │ Come funziona                       │
    │ Prova 14 giorni                     │
    │ Piani                               │
    │ Prove                               │
    │                                      │
    │ [ Analizza la mia attività      → ] │
    │ Scrivi a Chris su WhatsApp           │
    └──────────────────────────────────────┘

Il menu non contiene AI, dashboard, Climbo, RankEmpire o strumenti interni.

---

## 4. Hero — schermate 1 e 2

### Schermata 1

    ┌──────────────────────────────────────┐
    │ Per attività locali che lavorano     │
    │ bene, ma online non lo dimostrano.   │
    │                                      │
    │ IL CLIENTE TI STA                    │
    │ GIÀ CERCANDO.                        │
    │                                      │
    │ IL PROBLEMA È CHE                    │
    │ TROVA UN ALTRO.                      │
    │                                      │
    │ Trovatemi installa nella tua         │
    │ attività un sistema semplice per     │
    │ trasformare clienti soddisfatti...   │
    │                                      │
    │ [ Fammi vedere cosa trova        → ] │
    │ [ ▶ Guarda come funziona in 60 sec ] │
    └──────────────────────────────────────┘

Regole:

- il primo colpo deve essere interamente leggibile senza decorazioni sovrapposte;
- la seconda riga del claim può usare Star come sottolineatura o campo ridotto;
- CTA primaria piena Star;
- CTA secondaria testuale o outline;
- nessun filmato dietro il testo;
- nessun prezzo nella hero.

### Schermata 2

    ┌──────────────────────────────────────┐
    │ ┌──────────────────────────────────┐ │
    │ │                                  │ │
    │ │  FILMATO 9:16 / POSTER REALE     │ │
    │ │                                  │ │
    │ │  cliente → anello → telefono     │ │
    │ │  → percorso → prova pubblica     │ │
    │ │                                  │ │
    │ │                    [▶ 00:60]      │ │
    │ └──────────────────────────────────┘ │
    │                                      │
    │ 14                                   │
    │ giorni di prova assistita.           │
    │ Sulla tua attività. Con clienti reali│
    └──────────────────────────────────────┘

Il video parte soltanto dopo un'azione se la versione ottimizzata non rispetta performance e preferenze di movimento.

---

## 5. Barra audit persistente

Compare dopo che la hero è quasi uscita dal viewport.

    ┌──────────────────────────────────────┐
    │ Vuoi vedere il tuo confronto?        │
    │ [ Analizza la mia attività       → ] │
    └──────────────────────────────────────┘

Regole:

- posizione fixed in basso;
- safe-area iOS rispettata;
- non copre contenuto o CTA;
- si nasconde quando audit, menu o demo sono aperti;
- può essere chiusa;
- non ricompare aggressivamente nella stessa sessione;
- non viene mostrata prima che il visitatore abbia letto il claim.

---

## 6. Diagnosi rapida

    ┌──────────────────────────────────────┐
    │ VUOI VEDERE IL TUO CONFRONTO?        │
    │                                      │
    │ Partiamo dal tuo profilo.            │
    │ Non da una presentazione.            │
    │                                      │
    │ [ Incolla il link Google          ]  │
    │ [ Controlla la mia attività      → ] │
    │                                      │
    │ Non hai il link? Richiedi l'audit.   │
    └──────────────────────────────────────┘

La funzione di controllo automatico non è implicita. Nella prima versione il risultato è preparato da Chris.

---

## 7. Scena reale — schermate 3 e 4

### Testo

    ┌──────────────────────────────────────┐
    │ 01 · UNA SCENA CHE CONOSCI           │
    │                                      │
    │ OGNI MESE SERVI                      │
    │ CLIENTI SODDISFATTI.                 │
    │ QUANTI DIVENTANO                     │
    │ UNA RECENSIONE?                      │
    │                                      │
    │ Il cliente paga.                     │
    │ Ti ringrazia.                        │
    │ Dice che si è trovato benissimo.     │
    │ Gli chiedi una recensione.           │
    │                                      │
    │ ┌──────────────────────────────────┐ │
    │ │ «Certo, la faccio dopo.»         │ │
    │ └──────────────────────────────────┘ │
    │                                      │
    │ Poi esce. Torna alla sua giornata.   │
    │ E se ne dimentica.                   │
    └──────────────────────────────────────┘

### Fotografia

    ┌──────────────────────────────────────┐
    │                                      │
    │ FOTO 4:5                             │
    │ TITOLARE / BANCO / TELEFONO          │
    │                                      │
    ├──────────────────────────────────────┤
    │ NEL FRATTEMPO                        │
    │ Chi cerca trova il concorrente con   │
    │ prove più recenti e visibili.        │
    └──────────────────────────────────────┘

La frase non viene rinchiusa in più card. Una sola fotografia e un solo colpo.

---

## 8. Confronto — schermate 5 e 6

### Introduzione

    ┌──────────────────────────────────────┐
    │ 02 · LA SCELTA AVVIENE QUI           │
    │                                      │
    │ NON SIGNIFICA CHE                    │
    │ IL CONCORRENTE                       │
    │ LAVORI MEGLIO.                       │
    │                                      │
    │ Online sembra semplicemente più      │
    │ facile fidarsi di lui.               │
    └──────────────────────────────────────┘

### Confronto impilato

    ┌──────────────────────────────────────┐
    │ ATTIVITÀ A                           │
    │ 4,7 ★★★★★ · 23 recensioni            │
    │ Ultima recensione          5 mesi fa │
    │ Risposte                  Non presenti│
    │ Ultimo aggiornamento       7 mesi fa │
    └──────────────────────────────────────┘
                     VS
    ┌──────────────────────────────────────┐
    │ ATTIVITÀ B                       ★   │
    │ 4,8 ★★★★★ · 84 recensioni            │
    │ Ultima recensione          3 giorni fa│
    │ Risposte                      Presenti│
    │ Ultimo aggiornamento     1 settimana │
    └──────────────────────────────────────┘

    Esempio illustrativo. Attività e numeri
    non rappresentano risultati Trovatemi.

    Se non conoscessi nessuna delle due,
    quale chiameresti per prima?

    [ Ora guardiamo il tuo confronto    → ]

Regole:

- nessun carosello orizzontale;
- entrambe le attività leggibili nello stesso flusso;
- la seconda non viene presentata come risultato Trovatemi;
- label illustrativa vicino ai dati, non nel footer lontano.

---

## 9. Chi cerca contro chi scrolla

    ┌──────────────────────────────────────┐
    │ 03 · IL MOMENTO CHE CONTA            │
    │                                      │
    │ CHI CERCA VALE                      │
    │ MOLTO PIÙ DI                        │
    │ CHI SCROLLA.                        │
    │                                      │
    │ ┌──────────────────────────────────┐ │
    │ │ STA SCORRENDO                    │ │
    │ │ Vede. Passa. Dimentica.          │ │
    │ └──────────────────────────────────┘ │
    │ ┌──────────────────────────────────┐ │
    │ │ STA CERCANDO                     │ │
    │ │ [ servizio vicino a me       🔍 ]│ │
    │ │ Confronta → legge → sceglie      │ │
    │ └──────────────────────────────────┘ │
    │                                      │
    │ Non devi farti vedere da tutti.      │
    │ Devi essere credibile nel momento    │
    │ giusto.                              │
    └──────────────────────────────────────┘

Il contrasto è semantico e tipografico. Nessun numero o percentuale.

---

## 10. Come funziona — schermate 7 e 8

    ┌──────────────────────────────────────┐
    │ 04 · COME FUNZIONA                   │
    │                                      │
    │ DAL COMPLIMENTO                      │
    │ ALLA RECENSIONE.                     │
    │                                      │
    │ 01                                   │
    │ Il cliente è soddisfatto.            │
    │ La richiesta avviene ora.            │
    │                                      │
    │ 02                                   │
    │ Avvicina il telefono o apre il QR.   │
    │ [ Simula il gesto NFC            ▶ ] │
    │                                      │
    │ 03                                   │
    │ Lascia la propria esperienza.        │
    │ Tutti ricevono lo stesso percorso.   │
    │                                      │
    │ 04                                   │
    │ Tu vedi cosa sta succedendo.         │
    │ Richiesta → recensione → risposta.   │
    └──────────────────────────────────────┘

Non usare una timeline orizzontale compressa. I quattro passaggi sono verticali, numerati e brevi.

---

## 11. Chris — schermata 9

    ┌──────────────────────────────────────┐
    │ FOTO 4:5 DI CHRIS                    │
    │                                      │
    │ NON TI LASCIAMO                     │
    │ UNA PIATTAFORMA.                    │
    │ LA INSTALLIAMO NELLA               │
    │ TUA ATTIVITÀ.                       │
    │                                      │
    │ Collego il profilo, preparo NFC e QR,│
    │ mostro quando chiedere e controllo   │
    │ che il sistema venga utilizzato.     │
    │                                      │
    │ Christian Fioravanti                 │
    │ Se chiami, rispondo io.              │
    │                                      │
    │ [ Scrivi a Chris su WhatsApp     → ] │
    └──────────────────────────────────────┘

Questa è la cesura che impedisce al sito di sembrare una licenza SaaS.

---

## 12. Trial — schermate 10 e 11

    ┌──────────────────────────────────────┐
    │ 05 · LA PROVA                        │
    │                                      │
    │ NON DEVI CREDERCI                    │
    │ SULLA PAROLA.                        │
    │                                      │
    │ Provalo per 14 giorni sulla tua      │
    │ attività.                            │
    │                                      │
    │ ┌───────────── GIORNO 1 ───────────┐ │
    │ │ Attivazione e prima richiesta.   │ │
    │ └──────────────────────────────────┘ │
    │ ┌───────────── GIORNO 7 ───────────┐ │
    │ │ Controlliamo dove si blocca.     │ │
    │ └──────────────────────────────────┘ │
    │ ┌──────────── GIORNO 14 ───────────┐ │
    │ │ Guardiamo cosa è successo.       │ │
    │ │ Poi decidi se continuare.        │ │
    │ └──────────────────────────────────┘ │
    │                                      │
    │ [ Richiedi la prova assistita   → ] │
    │                                      │
    │ Riservata ad attività con clienti    │
    │ reali e una persona responsabile.    │
    └──────────────────────────────────────┘

Il giorno 14 non viene presentato come garanzia di risultati organici.

---

## 13. Domanda discriminante — schermata 12

    ┌──────────────────────────────────────┐
    │ 06 · DUE PROBLEMI DIVERSI            │
    │                                      │
    │ Se raccogliessimo più recensioni,    │
    │ sarebbe sufficiente?                 │
    │                                      │
    │ [ Sì, sarebbe sufficiente          ] │
    │                                      │
    │ [ No, resterebbe il problema della ] │
    │ [ continuità                       ] │
    │                                      │
    │ La risposta orienta la scelta.       │
    │ Chris verifica il piano corretto.    │
    └──────────────────────────────────────┘

### Stato A

    ┌──────────────────────────────────────┐
    │ PER QUELLO CHE HAI INDICATO          │
    │ PARTIREMMO DA TROVATO.               │
    │ Raccoglie e gestisce la prova.       │
    │ [ Vedi TROVATO                   → ] │
    └──────────────────────────────────────┘

### Stato B

    ┌──────────────────────────────────────┐
    │ NEL TUO CASO VA VALUTATO             │
    │ INEVITABILE.                         │
    │ Raccoglie, trasforma e distribuisce. │
    │ [ Vedi INEVITABILE               → ] │
    └──────────────────────────────────────┘

Nessuna scelta viene salvata come decisione commerciale automatica.

---

## 14. Piani — schermate 13 e 14

### TROVATO

    ┌──────────────────────────────────────┐
    │ ★ TROVATO                            │
    │                                      │
    │ RACCOGLIE E GESTISCE LA PROVA.       │
    │                                      │
    │ Per attività che vogliono rendere    │
    │ semplice e continua la raccolta.     │
    │                                      │
    │ [PREZZO — PUBBLICAZIONE CON GATE]    │
    │                                      │
    │ ✓ QR personalizzato                  │
    │ ✓ NFC                                │
    │ ✓ richieste previste                 │
    │ ✓ risposte assistite                 │
    │ ✓ monitoraggio e supporto            │
    │                                      │
    │ [ Prova TROVATO per 14 giorni    → ] │
    └──────────────────────────────────────┘

### INEVITABILE

    ┌──────────────────────────────────────┐
    │ ★★ INEVITABILE                       │
    │                                      │
    │ RACCOGLIE, TRASFORMA E DISTRIBUISCE. │
    │                                      │
    │ Per attività che devono mantenere    │
    │ continuativa la presenza.            │
    │                                      │
    │ [PREZZO — PUBBLICAZIONE CON GATE]    │
    │                                      │
    │ ✓ tutto TROVATO                      │
    │ ✓ recensioni trasformate             │
    │ ✓ aggiornamenti Google               │
    │ ✓ contenuti locali                   │
    │ ✓ revisione periodica                │
    │                                      │
    │ Cosa non comprende               [+] │
    │                                      │
    │ [ Scopri se ti serve             → ] │
    └──────────────────────────────────────┘

Regole:

- piani impilati, non carousel;
- nessun «più popolare»;
- nessun colore che obblighi la scelta del più caro;
- la differenza viene spiegata prima della lista;
- prezzo finale subordinato al gate commerciale registrato.

---

## 15. Visione — schermata 15

    ┌──────────────────────────────────────┐
    │                                      │
    │ NON DEVI DIVENTARE                  │
    │ VIRALE.                             │
    │                                      │
    │ DEVI DIVENTARE                      │
    │ INEVITABILE.                  ★     │
    │                                      │
    │ Essere presente, credibile e         │
    │ riconoscibile quando cercano proprio │
    │ quello che fai.                      │
    │                                      │
    └──────────────────────────────────────┘

Fondo Ink, testo Paper, una sola Stella. Nessuna funzione e nessuna CTA obbligatoria.

---

## 16. Prova — schermata 16

    ┌──────────────────────────────────────┐
    │ 08 · QUELLO CHE POSSIAMO PROVARE     │
    │                                      │
    │ NIENTE TESTIMONIANZE INVENTATE.      │
    │ TI FACCIAMO VEDERE IL PROCESSO.      │
    │                                      │
    │ 01 Una demo che puoi toccare.        │
    │ 02 Una baseline prima di partire.    │
    │ 03 Output, non miracoli.              │
    │ 04 Una persona che risponde.         │
    │                                      │
    │ [ Apri la demo                   → ] │
    └──────────────────────────────────────┘

Quando esiste un caso autorizzato, il primo elemento diventa una sintesi reale con link a `/prove/[caso]`.

---

## 17. FAQ — schermate 17 e 18

    ┌──────────────────────────────────────┐
    │ 09 · DOMANDE VERE                    │
    │                                      │
    │ PRIMA DI DIRCI DI SÌ,                │
    │ ECCO DOVE TI DICIAMO DI NO.          │
    │                                      │
    │ 01 Garantite il primo posto?     [+] │
    │ 02 Filtrate le recensioni?       [+] │
    │ 03 Devo imparare un software?    [+] │
    │ 04 Cosa succede nei 14 giorni?   [+] │
    │ 05 Servono i social?             [+] │
    │ 06 Posso scegliere il mensile?   [+] │
    │ 07 Garantite nuovi clienti?      [+] │
    │ 08 Perché non un software?       [+] │
    └──────────────────────────────────────┘

Una sola risposta aperta alla volta su mobile. Lo stato aperto non sposta il focus in modo inatteso.

---

## 18. CTA finale — schermata 19

    ┌──────────────────────────────────────┐
    │ 10 · PARTIAMO DA GOOGLE              │
    │                                      │
    │ VUOI VEDERE COSA TROVA OGGI          │
    │ UN CLIENTE QUANDO CERCA              │
    │ IL TUO SERVIZIO?                     │
    │                                      │
    │ Partiamo dal tuo profilo, non da una │
    │ presentazione.                       │
    │                                      │
    │ [ Analizza la mia attività       → ] │
    │ [ Scrivi a Chris su WhatsApp       ] │
    │                                      │
    │ Nessun primo posto promesso.         │
    │ Nessuna recensione falsa.            │
    │ Nessuna presentazione da agenzia.    │
    └──────────────────────────────────────┘

---

## 19. Footer

    ┌──────────────────────────────────────┐
    │ TROVATEMI.IT                         │
    │ Ti facciamo trovare dove conta.      │
    │                                      │
    │ Come funziona · Prova · Piani        │
    │ Privacy · Cookie                     │
    │                                      │
    │ © TROVATEMI.IT                       │
    └──────────────────────────────────────┘

Nessun link a strumenti interni, Climbo o RankEmpire.

---

## 20. Audit panel mobile

Il pannello si apre dal basso e può diventare pagina completa quando lo spazio non è sufficiente.

### Step unico, non wizard artificiale

    ┌──────────────────────────────────────┐
    │ [CHIUDI]                             │
    │                                      │
    │ VEDIAMO COSA TROVA UN CLIENTE        │
    │                                      │
    │ Nome                                 │
    │ [                                  ] │
    │ Attività                             │
    │ [                                  ] │
    │ Città                                │
    │ [                                  ] │
    │ Categoria                            │
    │ [                                  ] │
    │ Telefono o WhatsApp                  │
    │ [                                  ] │
    │ Profilo Google, se disponibile       │
    │ [                                  ] │
    │                                      │
    │ □ Ho letto l'informativa privacy     │
    │                                      │
    │ [ Analizza la mia attività       → ] │
    │                                      │
    │ Preferisci? Scrivi a Chris           │
    └──────────────────────────────────────┘

### Conferma

    ┌──────────────────────────────────────┐
    │ ★ RICHIESTA RICEVUTA                 │
    │                                      │
    │ Chris guarderà il profilo e ti       │
    │ ricontatterà per mostrarti cosa vede │
    │ oggi un cliente.                     │
    │                                      │
    │ [ Chiudi ]  [ Apri WhatsApp      → ] │
    └──────────────────────────────────────┘

### Errore tecnico

    ┌──────────────────────────────────────┐
    │ Non siamo riusciti a inviare.        │
    │ I dati restano nel modulo.           │
    │                                      │
    │ [ Riprova ]  [ Scrivi su WhatsApp →] │
    └──────────────────────────────────────┘

---

## 21. Demo mobile

La demo usa un dialog full-screen, non un piccolo video modale.

    ┌──────────────────────────────────────┐
    │ DEMO · 00:60                 [CHIUDI]│
    ├──────────────────────────────────────┤
    │                                      │
    │     ANELLO / SUPPORTO NFC            │
    │                                      │
    │       [ SIMULA IL TAP ]              │
    │                                      │
    ├──────────────────────────────────────┤
    │ 1 Cliente soddisfatto                │
    │ 2 Il percorso si apre                │
    │ 3 Lascia la propria esperienza       │
    │ 4 Tu vedi l'output                    │
    │                                      │
    │ ● ○ ○ ○                              │
    └──────────────────────────────────────┘

### Completamento

    ┌──────────────────────────────────────┐
    │ HAI VISTO IL GESTO.                  │
    │                                      │
    │ Ora possiamo configurarlo sulla tua  │
    │ vera attività e vedere se viene usato│
    │ davvero.                             │
    │                                      │
    │ [ Richiedi la prova assistita    → ] │
    │ [ Torna alla pagina                 ]│
    └──────────────────────────────────────┘

Vincoli:

- controlli Play/Pausa;
- testo alternativo alla sequenza;
- nessuna riproduzione obbligatoria;
- nessuna recensione reale inviata;
- stessa esperienza indipendentemente dal voto;
- progresso non basato soltanto sul colore.

---

## 22. Ordine del focus

1. skip link;
2. logo;
3. menu;
4. CTA audit hero;
5. CTA demo;
6. contenuto sequenziale;
7. audit persistente soltanto quando visibile;
8. CTA e controlli delle sezioni;
9. FAQ;
10. CTA finale;
11. footer.

Quando si apre audit, demo o menu:

- il focus entra nel pannello;
- il contenuto sotto diventa non interattivo;
- Escape chiude;
- il focus torna al trigger;
- lo scroll della pagina sotto viene bloccato senza salto.

---

## 23. Stati responsive

### 390–430px

- una colonna;
- CTA a piena larghezza;
- confronto impilato;
- piani impilati;
- filmato 4:5 o 9:16;
- audit full-screen o bottom sheet;
- barra audit persistente.

### 600–768px

- una colonna larga;
- CTA possono diventare affiancate;
- confronto ancora impilato se la leggibilità lo richiede;
- immagini 4:3;
- audit dialog centrato soltanto se la tastiera non lo penalizza.

### 1024px+

- layout editoriale asimmetrico;
- hero 7/5 o 6.5/5.5;
- confronto affiancato;
- sezione Chris in split layout;
- piani affiancati dopo la domanda discriminante;
- nessuna variazione dell'ordine narrativo.

---

## 24. Contenuto visibile senza JavaScript

Devono funzionare e restare leggibili senza JavaScript:

- hero;
- scena;
- confronto;
- principi;
- processo;
- Chris;
- trial;
- descrizione dei piani;
- visione;
- prove;
- FAQ almeno come contenuto espanso o semantico;
- CTA come link alle pagine dedicate.

JavaScript migliora:

- audit panel;
- demo;
- menu;
- domanda discriminante;
- barra persistente;
- accordion.

Non deve essere necessario per capire l'offerta.

---

## 25. Controllo della densità

Per ogni schermata mobile:

- un solo messaggio principale;
- massimo una CTA primaria;
- massimo due livelli di enfasi;
- nessuna lista oltre otto elementi senza raggruppamento;
- nessun paragrafo oltre 70–90 parole;
- nessuna riga di testo oltre circa 35–42 caratteri medi;
- spazio reale fra le sezioni;
- nessuna ripetizione del claim senza una nuova funzione.

---

## 26. Criteri di accettazione del wireframe

### Comprensione

- [ ] il rischio è visibile nel primo viewport;
- [ ] la CTA audit è visibile senza scroll eccessivo;
- [ ] la demo è raggiungibile dalla hero;
- [ ] il trial è comprensibile prima dei prezzi;
- [ ] Chris compare prima del trial e dei piani;
- [ ] la differenza TROVATO/INEVITABILE nasce da una domanda;
- [ ] l'ultima CTA riparte dal profilo reale.

### Mobile

- [ ] nessun elemento richiede hover;
- [ ] nessun carosello obbligatorio;
- [ ] CTA minime 52px;
- [ ] body minimo 17px;
- [ ] confronto e piani sono impilati;
- [ ] barra audit rispetta safe area e può essere chiusa;
- [ ] dialog e form funzionano con tastiera mobile;
- [ ] nessun contenuto viene coperto.

### Identità

- [ ] il sito appare premium ma locale;
- [ ] Trustars influenza ritmo e visualità;
- [ ] Mister Review influenza diagnosi e accompagnamento;
- [ ] Trovatemi domina linguaggio, promessa ed etica;
- [ ] il gesto NFC è memorabile;
- [ ] Chris è una parte dell'offerta;
- [ ] il software resta dietro le quinte.

### Prova

- [ ] ogni numero dimostrativo è etichettato;
- [ ] nessun testimonial placeholder;
- [ ] nessun risultato garantito;
- [ ] no review gating;
- [ ] audit e demo non fingono automazioni inesistenti;
- [ ] output e risultati sono separati.

---

## 27. Gate successivo

Dopo l'approvazione di questo wireframe si può iniziare soltanto la preview isolata `/brand-demo-v8/`.

La root V7.2, la produzione, i prezzi canonici e le integrazioni restano fuori scope fino ai gate successivi.
