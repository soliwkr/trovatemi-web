# 04 — Funnel e route

## Principio

Il percorso è una diagnosi progressiva, non una sequenza di landing commerciali. Ogni route ha un solo lavoro e una sola azione primaria.

## Route production

| Route | Lavoro dell’utente | CTA primaria | Dati |
|---|---|---|---|
| `/` | capire il valore e iniziare | cercare l’attività | nessuna persistenza |
| `/check/` | cercare e selezionare un profilo | selezionare l’attività | demo fino a P3 |
| `/report/{report-ref}/` | capire segnali e priorità | salvare o attivare | demo fino a P4/P5 |
| `/attiva/{unlock-code}/` | verificare attività e offerta | continua all’attivazione | code single-business, 14 giorni |
| `/checkout/` | accettare economics e inserire carta | attiva trial | Stripe da P8 |
| `/onboarding/` | completare prerequisiti e avvio | completa il setup | D1/Climbo secondo gate |

Le route dinamiche non devono esporre ID provider, email, telefono o token raw nei log. I riferimenti pubblici sono opachi, revocabili e separati dagli ID canonici.

## Funnel

```text
visit
→ search_started
→ business_selected
→ report_viewed
→ report_saved (opzionale)
→ activation_started
→ card_authorized
→ trial_activated
→ starter_kit_accessed
→ first_paid_conversion
→ welcome_kit_released
→ onboarding_completed
```

`report_saved` e `activation_started` non implicano conversione. `trial_activated` esiste solo dopo conferma del sistema di pagamento. `welcome_kit_released` esiste solo dopo il primo pagamento riuscito.

## Unlock code

- legato a una sola attività auditata;
- validità predefinita di 14 giorni dall’emissione;
- confronto server-side su valore hashato, mai token raw persistito nei log;
- uso non trasferibile a un’altra attività;
- scadenza o mismatch producono una schermata esplicita;
- apre il percorso personalizzato, ma non avvia da solo il trial;
- l’attivazione richiede conferma dell’attività, economics e carta.

## Route legacy

Route demo, preview bar, Sunny Cafe, tenant V13, contatti personali e vecchi funnel possono continuare a esistere come archivio tecnico durante la migrazione, ma non sono collegati dal percorso production e non sono una fonte di componenti o copy.

## Indicizzazione

- homepage e futuri contenuti editoriali: indicizzabili solo dopo P11;
- check, report, attivazione, checkout e onboarding: `noindex`;
- preview Cloudflare: sempre `noindex` e senza custom domain;
- nessuna sitemap include route diagnostiche personali o tokenizzate.

## Errori e ritorni

Ogni route preserva il minimo contesto necessario per tornare indietro senza duplicare sessioni. Refresh e retry non devono creare un nuovo lead, addebito o provisioning. Gli errori esterni mostrano uno stato recuperabile e un correlation ID non sensibile.
