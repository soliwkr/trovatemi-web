# Trovatemi Web

Sito marketing SSR di Trovatemi.it, costruito con Astro e distribuito su Cloudflare Workers.

## Sviluppo

```bash
npm install
npm run dev
```

## Verifica

```bash
npm run check
npm run build
npm run deploy:dry
```

Lo smoke test runtime è disponibile su `/api/health`.

## Deploy

```bash
npx wrangler login
npm run deploy
```

Il deploy usa il custom entrypoint `src/worker.ts`, che inoltra le richieste all'handler ufficiale Astro e registra log strutturati per Cloudflare Observability.

Il workflow `Deploy to Cloudflare Workers` distribuisce automaticamente le modifiche a `main` e può essere avviato manualmente da GitHub Actions. Richiede i repository secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
