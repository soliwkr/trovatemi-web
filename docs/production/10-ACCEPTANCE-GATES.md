# 10 — Gate di accettazione

## Gate P0 — completezza

P0 passa solo se esistono e sono leggibili tutti i documenti elencati nell’issue #24:

- README;
- costituzione, brief e motori;
- funnel, dati, social/DM e design;
- conversione/onboarding, roadmap e gate;
- decision log, status e next.

Il set deve essere raggiungibile dall’indice e comprensibile a un maintainer senza contesto della conversazione.

## Gate P0 — matrice di coerenza

Ogni documento pertinente deve concordare sui seguenti valori:

| Decisione | Valore canonico P0 |
|---|---|
| business line | `climbo_white_label` |
| target | Beauty & Wellness locale, prima singola attività |
| trial | 21 giorni |
| carta | raccolta all’attivazione |
| costo trial | €0 |
| rinnovo | €149/mese salvo cancellazione |
| Starter Review Kit | digitale, incluso nel trial |
| Welcome Kit | fisico, solo dopo primo pagamento riuscito |
| target costo Welcome Kit | €25 all-in |
| hard cap Welcome Kit | €40 all-in, spedizione inclusa |
| unlock code | 14 giorni, una attività |
| solicitation | neutrale e universale |
| Audit Engine | core asset condiviso da inbound/outbound |
| dati P0–P2 | demo, nessuna Maps/D1 live |
| authority | TROVATEMI OS governa; web referenzia |

Qualsiasi secondo valore, valore ambiguo o promessa incompatibile fallisce il gate.

## Gate P0 — confini

- nessuna copia della governance TROVATEMI OS;
- nessuna tabella D1 o state machine Climbo inventata;
- nessuna chiamata Maps, D1, Stripe o Climbo;
- nessun deploy production;
- nessun file visuale o runtime nel primo commit P0;
- lavoro visuale precedente preservato ma successivo al commit P0 nella storia;
- `NEXT.md` contiene esattamente un prossimo build step: P1.

## Gate P0 — reader test

Un lettore a freddo deve poter rispondere senza cercare nella chat:

1. qual è il problema e per chi;
2. dove convergono inbound, DM e NFC;
3. cosa rende valido un report;
4. chi possiede lead, pagamenti e delivery;
5. quando parte il trial e quando viene addebitato;
6. quando può essere spedito il Welcome Kit;
7. quali quattro schermate costruire in P1;
8. quali integrazioni sono vietate prima dei rispettivi gate.

## Gate P1 — design system e quattro reference screen

P1 passerà quando:

- esistono homepage, selezione attività, report e attivazione trial;
- gli stati demo/live, loading, empty, error, scadenza e mismatch sono progettati;
- mobile 320 px, tastiera, zoom 200%, focus e reduced motion sono verificati;
- economics completi sono visibili prima della carta;
- nessun componente legacy entra nel percorso;
- QA e review visuale sono verdi;
- non sono state abilitate integrazioni live.

## Evidenza P0

Il checkpoint di P0 registra in `STATUS.md`:

- base e branch verificati;
- first commit docs-only;
- elenco documenti completo;
- decisioni F0 canonizzate;
- riferimenti TROVATEMI OS controllati;
- esito del reader test;
- unico next step.
