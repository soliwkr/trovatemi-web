# Trovatemi Web

Sito marketing SSR di Trovatemi.it, costruito con Astro e distribuito su Cloudflare Workers.

## Sviluppo

```bash
npm install
npm run dev
```

## Verifica

```bash
npm test
npm run check
npm run build
npm run deploy:dry
```

Lo smoke test runtime è disponibile su `/api/health`.

## Revenue MVP

La prima slice assistita è separata dalla homepage pubblica:

- `/preview/<token>` mostra la lettura privata preparata per un prospect;
- `/attiva/<token>` mostra offerta, condizioni e checkout;
- `/benvenuto` descrive il passaggio successivo senza dichiarare riuscito un pagamento non ancora verificato.

Le preview e le condizioni commerciali non sono salvate nel repository. In locale, copia `.dev.vars.example` in `.dev.vars`, sostituisci tutti i valori dimostrativi e usa un token casuale non indovinabile. Il link da aprire sarà:

```text
http://localhost:4321/preview/<token>
```

In Cloudflare configura `PILOT_PREVIEWS_JSON`, `FOUNDERS_OFFER_JSON` e `FOUNDERS_CHECKOUT_URL` come secret. Il checkout rimane bloccato se offerta o link Stripe non sono completi. Il Payment Link deve tornare a `https://trovatemi.it/benvenuto` dopo il checkout.

Prima di accettare denaro reale, sostituisci identità del venditore, P.IVA, trattamento IVA, regola al giorno 91, rimborso, condizioni e privacy con testi approvati. Non inserire chiavi Stripe nel repository o nella chat.

## Deploy

```bash
npx wrangler login
npm run deploy
```

Il deploy usa il custom entrypoint `src/worker.ts`, che inoltra le richieste all'handler ufficiale Astro e registra log strutturati per Cloudflare Observability.

Il workflow `Deploy to Cloudflare Workers` distribuisce automaticamente le modifiche a `main` e può essere avviato manualmente da GitHub Actions. Richiede i repository secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
