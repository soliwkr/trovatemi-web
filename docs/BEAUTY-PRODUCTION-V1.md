# Beauty Production V1 — PR 1

## Obiettivo

Costruire il primo percorso pubblico di Trovatemi.it dedicato a beauty e wellness, partendo dal `main` reale e usando il Beauty Check come ingresso principale.

## Incluso

- nuovo `ProductionLayout`, indipendente dai layout demo;
- design system mobile-first dedicato a beauty e wellness;
- homepage production con ricerca attività come azione primaria;
- percorso Places-first simulato con un dataset locale;
- selezione del profilo e report demo coerente per quattro attività;
- metadati production e `noindex` sulle pagine `/check/` e `/report/`;
- configurazione Cloudflare separata per una preview `workers.dev` senza custom domain;
- gate QA dedicato a contenuti, route e assenza di integrazioni live.

## Escluso

- Google Places / Maps API;
- letture o scritture D1;
- persistenza dei dati inseriti;
- autenticazione, pagamento e onboarding;
- WhatsApp, contatti personali e riferimenti a Chris;
- riuso di V13 demo chrome, tenant demo o vecchie route nel percorso production;
- deploy su `trovatemi.it` o `www.trovatemi.it`.

## Percorso utente

1. `/` — proposta di valore e Beauty Check.
2. `/check/?q=...` — risultati simulati simili a una ricerca Places.
3. `/report/{slug}/` — report dimostrativo specifico dell’attività scelta.

I dati sono locali e identificati come dimostrativi in ogni fase rilevante.
