# TROVATEMI Radar Worker v1

Cloudflare-native internal prospecting preview.

## Purpose

Turn a local query into a ranked queue of businesses worth inspecting:

```text
category + city
→ Google Places
→ public homepage enrichment
→ deterministic opportunity score
→ evidence
→ check brief
→ CSV
```

This is not the public TROVATEMI product and it does not send outreach.

## Stack

Base applicativa: official `cloudflare/templates/vite-react-template` (Vite + React + Hono + Cloudflare Workers), adattata al Radar.

- Cloudflare Workers + Static Assets
- Cloudflare Vite plugin
- React 19
- Hono
- Durable Objects
- Google Places API
- native `fetch` for bounded homepage inspection
- GitHub Actions for CI/deploy

No VPS, browser farm, CRM write, D1 production write, or external crawler is required for v1.

Lo starter Cloudflare è il guscio; discovery, enrichment, scoring e storage restano moduli TROVATEMI separati.

## Why Hono

Hono is a small Web Standards framework designed for Workers. The Radar keeps provider logic independent from routing so it can be replaced without changing scoring.

## Safety / cost controls

- maximum 12 Places results per run;
- 6 runs/day per hashed client IP in preview;
- 6-hour query cache;
- homepage body capped at 400 KB;
- 4 concurrent website requests;
- 4.5 second site timeout;
- private/local URLs rejected;
- no reviewer/follower personal data;
- no automatic email/DM;
- no public master score.

## Future adapters

Browser-heavy enrichment should use Cloudflare Browser Run / Queues as a separate fallback, not block the initial Radar request.

Apify/Google Maps/social actors can later emit the observation contract defined in the parent `prospect_radar_sim` spike.


## Shareable Check

Il Radar può trasformare un prospect idoneo in una snapshot pubblica minimizzata:

```text
prospect
→ Genera check
→ token opaco
→ /c/<token>
→ messaggio outreach pronto
```

Regole:

- il link scade dopo 30 giorni;
- lo score interno non entra mai nella snapshot pubblica;
- email e telefono del prospect non vengono serializzati nel check;
- il check pubblico contiene solo evidenze business necessarie alla conversazione;
- il messaggio viene copiato manualmente: nessun invio automatico;
- la CTA pubblica apre il contatto TROVATEMI, senza hardcodare un prezzo non ancora canonico.

La CI esercita il flusso end-to-end: scan live → prospect idoneo → share → fetch check → privacy assertions.


## Narrative Check v2

Il check pubblico non mostra più etichette interne come score, gap, confidence o conversion friction.

Percorso cliente:

```text
Ti cerco
→ ti confronto
→ provo a contattarti
→ verdetto
→ 3 cose che sistemerei
→ Sistemamelo
```

Il Radar interno conserva score e bande di priorità. Il cliente vede solo linguaggio umano e prove osservate.

## Conversion telemetry

Ogni check condiviso mantiene contatori separati:

- aperture;
- click su `Sistemamelo`;
- intenti di attivazione.

Questi segnali servono a migliorare il prospecting nel tempo e non vengono esposti nel check pubblico.

## Activation — €197 one-time

La preview espone una pagina `/a/<token>` con:

- identità del titolare (nome + email);
- `Attivazione Trovatemi — €197 una tantum`;
- dichiarazione esplicita che eventuali servizi ricorrenti sono separati;
- redirect a un checkout reale solo se `ACTIVATION_CHECKOUT_URL` è configurato.

Senza checkout configurato, nessun pagamento viene simulato.

## Climbo provisioning gate

Il Worker include un adapter server-side per la creazione cliente Climbo. Non è invocabile dal browser.

Configurazione richiesta:

- `CLIMBO_API_KEY` secret;
- `CLIMBO_PLAN_ID` secret/config;
- `PROVISIONING_SECRET` secret.

Endpoint operativo protetto:

```text
POST /api/activations/<token>/provision
x-provisioning-secret: ...
```

Il provisioning è idempotente sullo stato locale: un'attivazione già provisionata non viene ricreata.

Il flusso target diventa:

```text
Radar
→ check
→ apertura
→ Sistemamelo
→ €197 checkout
→ pagamento confermato / human gate
→ provisioning Climbo
→ OAuth/consensi cliente
→ review system attivo
```
