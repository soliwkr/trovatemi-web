# 09 — Roadmap production

## Regole

- massimo una attività BUILD in `Doing`;
- massimo una attività FOUNDER in `Doing`;
- nessuna fase parte prima del gate della precedente;
- integrazioni esterne partono demo/read-only e fail-closed;
- ogni fase preserva la separazione `trovatemi-web` conversion plane / TROVATEMI OS control plane.

## Sequenza obbligatoria

```text
P0 + F0
→ P1
→ P2
→ P3/P4
→ P5
→ F1
→ P8/P9
→ F2
→ P10
→ F3/F4
→ P6/P7
→ F5
→ P11
```

Una coppia sulla stessa riga non autorizza lavoro concorrente se viola il limite di una attività per stream in `Doing`.

## BUILD

| Fase | Risultato | Gate di uscita |
|---|---|---|
| P0 | Production Contract completo | coerenza documentale e `NEXT` unico |
| P1 | design system production + quattro reference screen | review visuale, accessibilità e nessuna integrazione live |
| P2 | Beauty Check UX definitivo con dati demo | percorso end-to-end demo e QA stati |
| P3 | Places cost-controlled + Audit Engine reale | budget/cap, evidence e fail-closed verificati |
| P4 | D1 capture, attribution, consent e diagnostic session | contratto OS, idempotenza, privacy e test |
| P5 | report persistente, email delivery e token | accesso sicuro, scadenza/revoca e delivery verificata |
| P6 | acquisition adapter social/DM | attribution e opt-out verificati |
| P7 | nurture e intent scoring | ruleset versionato, nessuna decisione AI autonoma |
| P8 | unlock, pricing e checkout | Stripe test, €0 trial, €149 renewal e cancellazione |
| P9 | Starter Review Kit digitale | F1 approvata, asset neutrali e accesso trial |
| P10 | conversione, Welcome Kit e onboarding Climbo | primo pagamento, cap costi, fulfillment e binding |
| P11 | retirement legacy e production release | SEO/privacy/analytics, rollback e approvazione production |

## FOUNDER

| Fase | Decisione | Stato |
|---|---|---|
| F0 | economics trial e kit | chiusa; canonizzata in P0 |
| F1 | formati/copy Starter Review Kit per categoria | non iniziata |
| F2 | composizione e BOM Welcome Kit fisico | non iniziata |
| F3 | 30 prospect Beauty & Wellness per batch | non iniziata |
| F4 | Mystery NFC/lumpy mail e copy | non iniziata |
| F5 | lancio batch offline | non iniziata |
| F6 | review conversione, CAC fisico, activation, retention | non iniziata |

## Dipendenze esterne

- TROVATEMI OS: governance, pricing approvato, lifecycle, D1/Climbo contract;
- Google Places: disponibilità, policy, billing e quote;
- Stripe: payment method, trial, renewal, cancellation e webhook;
- Climbo: capability e binding verificati;
- fulfillment: BOM, costo e spedizione entro hard cap.

Una dipendenza non pronta blocca solo la fase che la richiede; non autorizza workaround che creino una seconda fonte della verità.
