# TROVATEMI.IT — Climbo white-label reset

**Branch:** `refactor/climbo-white-label-reset`  
**Base tecnica:** V13 Aceternity rebuild  
**Stato:** preview isolata, noindex, produzione invariata

## Mandato

TROVATEMI viene ridotto a una sola linea commerciale attiva: `climbo_white_label`.

Il sito deve spiegare un unico servizio installato e seguito:

```text
cliente soddisfatto
→ recensione Google autentica
→ risposta
→ recensione trasformata in contenuto
→ distribuzione sui canali collegati
→ nuova prova pubblica
```

Canali del nucleo, quando collegati e configurati: Google Business Profile, Instagram, Facebook e TikTok.

## KEEP

Queste parti della V13 restano patrimonio tecnico:

- Astro + React;
- Cloudflare adapter, Worker e deploy esistente;
- `V13AceternityLayout.astro` come shell preview noindex;
- libreria visuale Aceternity V12;
- mockup riutilizzabili del flusso recensione/risposta/contenuto;
- `DemoFrame.tsx` e demo Climbo come evidence layer;
- palette, tipografia e responsive V12/V13;
- accessibilità, reduced motion e QA;
- zero review gating;
- installazione e assistenza umana come parte del servizio.

## REWRITE

Il reset riscrive:

- homepage;
- copy centrale;
- navigazione e footer;
- gerarchia CTA;
- pricing;
- demo mostrata in homepage;
- messaging verticale;
- modo in cui vengono spiegate le automazioni.

Gli agenti Climbo non vengono venduti come prodotti separati. Sono meccanismi sotto il servizio.

## ARCHIVE

Questi concetti non appartengono al nuovo prodotto pubblico e restano soltanto nella Git history o in branch storiche:

- la vecchia scala di tre livelli;
- i listini €199 / €399 e relativi annuali/setup;
- trial 14 giorni come CTA pubblica;
- GEO/AI visibility come promessa;
- multi-sede come piano del Super MVP;
- rank-and-rent nella narrativa white-label;
- pagine V4–V12 come fonti operative correnti;
- pSEO e vecchie sales narrative nel perimetro del Super MVP;
- biolink e landing verticali generaliste finché non servono a una vendita reale.

## Prodotto candidato

### Promessa

**I tuoi clienti parlano bene di te. Facciamo in modo che si veda.**

### Piano unico

**TROVATEMI — €149/mese**

Comprende:

- una attività / una location;
- Google Business Profile;
- NFC + QR;
- raccolta recensioni senza gating;
- risposte alle recensioni;
- trasformazione delle recensioni migliori in contenuti;
- distribuzione sui canali collegati, incluso TikTok quando configurato;
- installazione e assistenza.

Mensile. Nessun catalogo di tier nel Super MVP.

Il prezzo è candidato nella preview e non autorizza checkout o pubblicazione in produzione prima del gate commerciale.

## Verticale iniziale

La prima campagna di acquisizione è beauty-first: parrucchieri, barber shop e centri estetici. Il brand madre resta abbastanza generale da poter estendere in seguito il servizio senza rifare l'architettura.

## Gate prima della produzione

1. Un solo prodotto e una sola CTA primaria.
2. Nessuna vecchia tassonomia di piani nel copy della homepage.
3. Nessun trial universale.
4. Nessuna promessa GEO, ranking o citazione AI.
5. Zero gating esplicito.
6. Flywheel recensione → risposta → contenuto → distribuzione comprensibile in meno di un minuto.
7. Build e QA mobile verdi.
8. Approvazione esplicita di copy e prezzo.
