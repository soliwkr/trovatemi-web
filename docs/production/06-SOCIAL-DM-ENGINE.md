# 06 — Social/DM Engine

## Scopo

Il Social/DM Engine porta l’utente al medesimo Audit Engine usato dall’inbound organico. Non crea un secondo funnel, non replica report e non trasforma DM in un CRM parallelo.

## Formati di ingresso

- contenuto educativo con CTA al Beauty Check;
- contenuto diagnostico basato su pattern anonimi;
- risposta a commento o DM con link attribuito;
- link in bio;
- outreach manuale a prospect selezionati;
- QR/NFC o lumpy mail con link/unlock personalizzato.

## Convergenza

```text
content / DM / outbound / NFC
→ attributed link
→ attività precompilata o ricerca
→ selezione esplicita
→ Audit Engine
→ report
→ attivazione opzionale
```

L’attività può essere suggerita dal link, mai silently bound: l’utente conferma sempre il profilo prima di usare dati live o attivare.

## Attribution contract

Ogni link può contenere riferimenti opachi a source, campaign, content e creative. Non contiene PII. Il primo touch, l’ultimo touch e l’evento di conversione restano distinti; il modello di attribuzione è versionato e D1 conserva l’attribuzione canonica quando nasce il lead.

## DM

- il messaggio promette una diagnosi, non un risultato;
- niente dati del profilo presentati come certi senza osservazione verificata;
- niente invio automatico prima dei gate P6 e consenso/canale applicabile;
- opt-out rispettato e propagato al sistema canonico;
- nessuna automazione usa un feedback privato per filtrare chi può recensire pubblicamente.

## Mystery NFC / lumpy mail

L’asset offline serve ad aprire una diagnosi già contestualizzata:

1. il prospect è selezionato e l’attività verificata;
2. viene emesso un unlock code single-business valido 14 giorni;
3. NFC/QR apre `/attiva/{unlock-code}/` o il report associato;
4. il destinatario conferma l’attività;
5. la scansione registra solo attribution consentita;
6. il trial parte soltanto dopo economics, carta e conferma server-side.

Il Mystery NFC non è il Welcome Kit. È acquisition spend sperimentale, viene lanciato solo dopo tracking e report reali e non anticipa il fulfillment del kit cliente.

## Gate outbound

Prima di qualsiasi batch:

- report live e tracking verificati;
- 30 prospect del batch con provenance e owner;
- costo unitario e limite batch approvati;
- code generation, revoca e scadenza testate;
- copy approvato e neutralità verificata;
- gestione risposte e opt-out operativa;
- una sola attività FOUNDER in Doing.

## Metriche

Scansione, audit start, report view, activation start e conversione sono eventi distinti. Open rate o click non valgono come interesse commerciale canonico senza regola approvata.
