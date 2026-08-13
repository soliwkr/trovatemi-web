# 05 — Architettura dati

## Confine

Questo documento definisce il contratto del conversion plane, non uno schema fisico D1. Tabelle, lifecycle canonici, outbox, binding e reconciliation restano governati da TROVATEMI OS e dal contratto D1 ↔ Climbo.

## Ownership

| Dominio | Governance owner | System of record | Ruolo di `trovatemi-web` |
|---|---|---|---|
| strategia, offerta, pricing e gate | TROVATEMI OS | canon commerciale approvato | presentazione fedele |
| lead, consenso, attribuzione, stato, next step e outcome | TROVATEMI OS | D1 | producer tramite interfaccia autorizzata |
| dati nativi Google/GBP | TROVATEMI OS | Google nei dati nativi | lettura cost-controlled |
| audit snapshot e regole | TROVATEMI OS per regole | datastore assegnato da P4/P5 | calcolo/versione e rendering |
| comportamento web grezzo | TROVATEMI OS | GA4 | emissione eventi minimizzati |
| pagamenti e metodo di pagamento | TROVATEMI OS | Stripe | checkout e rendering stato confermato |
| business/location e delivery | TROVATEMI OS | Climbo nei dati nativi | nessuna scrittura diretta dal browser |
| asset di frontend temporanei | `trovatemi-web` | sessione/browser quando applicabile | owner limitato al percorso UI |

## Oggetti concettuali del frontend

### Diagnostic session

Contiene un ID opaco, business reference, attribution reference, mode `demo|live`, timestamps, versione contratto e stato UI. Non è un lead e non contiene automaticamente consenso marketing.

### Place candidate

È una proiezione effimera di un risultato provider. Contiene solo i campi necessari alla selezione. Non viene usato come identità canonica finché l’utente non seleziona esplicitamente il profilo.

### Audit snapshot

Raccoglie evidence, provenance, observed time, ruleset e output. Le versioni sono immutabili; correzioni e ricalcoli generano una nuova versione.

### Capture intent

Descrive lo scopo dichiarato per cui vengono raccolti contatto e consenso: ricezione report, attivazione o comunicazione commerciale. Le finalità non vengono fuse.

### Unlock grant

Collega un code hash a una business reference, emissione, scadenza a 14 giorni, stato e provenance campagna. Non contiene il token raw e non può cambiare business reference.

## ID

- opachi, immutabili e non derivati da nome, email o attività;
- ID provider separati dagli ID interni;
- correlation e causation ID privi di PII;
- timestamp canonici UTC, presentazione `Europe/Rome`;
- nessun ID viene riutilizzato dopo revoca o scadenza.

## Consenso e finalità

La selezione di un’attività non è consenso marketing. Salvare il report, iniziare il trial e accettare comunicazioni sono atti distinti. Ogni consenso persistente include versione copy, source, timestamp e finalità. Revoca e scadenza non cancellano la storia richiesta per audit, ma interrompono gli usi futuri non più autorizzati.

## PII e logging

- nessuna PII nei log applicativi, URL, analytics properties o error fingerprint;
- token, API key, Stripe secret e unlock raw mai nel repository o nell’HTML;
- payload esterni minimizzati e redatti;
- retention definita prima di P4, non inventata nel frontend;
- accesso a report persistenti tramite riferimento opaco e policy di scadenza/revoca.

## Scritture e affidabilità

Il browser non scrive direttamente D1, Stripe o Climbo. Ogni mutazione passa da un endpoint server-side autorizzato, valida contratto e versione, usa idempotency key e restituisce uno stato verificabile. Un timeout ambiguo non viene trattato come successo né ritentato alla cieca.

## Demo data

Le fixture demo sono codice di esempio, non evidence e non lead. Devono usare identità chiaramente fittizie o autorizzate, restare separate dai namespace live e non poter essere inviate downstream.
