# 01 — Product brief

## Problema

Le attività Beauty & Wellness lavorano in un contesto ad alta fiducia e bassa attenzione operativa: il valore viene percepito durante il servizio, ma spesso non diventa una prova pubblica recente. Il profilo può quindi sembrare meno vivo, curato o autorevole dell’attività reale.

Gli strumenti generici mostrano metriche; non aiutano il titolare a capire quale segnale conta, cosa fare per primo e come inserire la richiesta di recensione nel lavoro quotidiano senza forzature.

## Promessa

> In meno di un minuto capisci cosa racconta oggi il tuo profilo e quali prove stai lasciando invisibili.

La promessa riguarda chiarezza e priorità, non ranking, volume garantito di recensioni o fatturato.

## Job to be done

Quando un titolare vede che il proprio lavoro è apprezzato ma online non viene rappresentato bene, vuole una diagnosi credibile e un modo semplice per chiedere recensioni nel momento giusto, così da rendere la fiducia visibile senza diventare aggressivo o manipolativo.

## Unità di valore

L’unità iniziale è una **diagnostic session legata a una singola attività**. Produce:

- identità dell’attività selezionata;
- snapshot dei segnali osservabili con provenienza e tempo;
- punteggi spiegabili, mai opachi;
- tre priorità ordinate;
- un percorso di attivazione coerente con la diagnosi.

## Prodotto e offerta

Il prodotto non è il report isolato. Il report è la prova iniziale di un sistema ricorrente:

```text
diagnosi → attivazione trial → Starter Review Kit digitale
→ adozione del processo → conversione ricorrente
→ Welcome Kit fisico → onboarding e delivery continuativa
```

## Metriche di prodotto

Le metriche vengono definite senza trasformare il frontend in fonte canonica:

- `search_started`: avvio della ricerca attività;
- `business_selected`: attività selezionata;
- `report_viewed`: report leggibile raggiunto;
- `report_saved`: contatto e consenso validi per ricezione/salvataggio;
- `activation_started`: apertura del percorso di attivazione;
- `trial_activated`: evento confermato dal sistema di pagamento;
- `starter_kit_accessed`: primo uso di un asset digitale;
- `first_paid_conversion`: primo pagamento ricorrente riuscito;
- `welcome_kit_released`: rilascio fulfillment dopo il pagamento.

Gli eventi analytics descrivono comportamento web. Lead, consenso, attribuzione, stato commerciale e outcome restano canonici in D1 secondo TROVATEMI OS.

## Vincoli del primo rilascio

- una sola lingua e mercato: Italia, italiano, timezone `Europe/Rome`;
- una singola attività per audit;
- dati demo fino alla chiusura dei gate P3/P4;
- nessuna dipendenza necessaria da account utente per vedere il primo report;
- accessibilità, velocità e trasparenza sui dati sono requisiti di prodotto, non rifiniture.
