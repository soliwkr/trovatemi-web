# 08 — Conversione e onboarding

## Economics F0 canonizzati

| Voce | Decisione approvata |
|---|---|
| durata trial | 21 giorni |
| metodo di pagamento | carta richiesta all’attivazione |
| addebito durante il trial | €0 |
| rinnovo | €149/mese dopo il trial |
| cancellazione | evita il rinnovo se completata prima della scadenza |
| trial kit | Starter Review Kit digitale incluso |
| kit fisico | solo dopo il primo pagamento riuscito |
| target costo fisico | €25 all-in |
| hard cap fisico | €40 all-in, spedizione inclusa |
| unlock code | 14 giorni, una sola attività |
| solicitation | neutrale e universale |

## Attivazione

L’utente arriva con un’attività confermata. Prima della carta vede:

- nome e sede dell’attività vincolata;
- cosa include il trial;
- durata di 21 giorni;
- addebito di €0 oggi;
- data prevista del primo addebito;
- prezzo successivo di €149/mese;
- modalità di cancellazione;
- Starter Review Kit digitale incluso;
- condizione del Welcome Kit fisico.

Il client non calcola lo stato economico. Mostra la conferma firmata dal backend/Stripe. Refresh e retry riusano la stessa idempotency key.

## Trial

Il trial inizia solo dopo:

1. unlock/business binding valido;
2. economics accettati nella versione corrente;
3. carta autorizzata e metodo valido confermato;
4. evento server-side `trial_activated` persistito;
5. next step di onboarding assegnato.

Non è trial attivo un click, una redirect Stripe incompleta o uno stato solo client-side.

## Starter Review Kit digitale

È incluso durante il trial e può contenere:

- QR/review link personalizzato;
- asset stampabili/digitali approvati per la categoria;
- microcopy neutrale;
- istruzioni su momento, frequenza e utilizzo;
- reminder operativi senza incentivo al voto.

I formati e il copy definitivo sono F1. P0 definisce il confine, non li inventa.

## Conversione a pagamento

Alla scadenza del giorno 21, salvo cancellazione valida, Stripe tenta il primo addebito di €149. Solo un evento server-side verificato di pagamento riuscito produce `first_paid_conversion`.

Fallimento, autenticazione richiesta o stato ambiguo non rilasciano il Welcome Kit e non vengono marcati come conversione riuscita. Retry e dunning appartengono al workflow approvato successivo.

## Welcome Kit fisico

- nessun fulfillment durante il trial;
- release solo dopo primo pagamento riuscito;
- indirizzo e conferma spedizione raccolti con finalità dichiarata;
- target all-in €25, hard cap €40 spedizione inclusa;
- distinta base e composizione definitive sono F2;
- un ordine oltre hard cap passa a review umana, non viene spedito automaticamente;
- stato fulfillment distinto da pagamento e onboarding.

## Onboarding Climbo

La conversione non autorizza scritture browser→Climbo. Provisioning, business/location, GBP e contact sync seguono i gate e i binding del control plane. Un guasto Climbo non riscrive lo stato pagamento; produce uno stato operativo separato e recuperabile.

## Cancellazione e neutralità

La cancellazione deve essere accessibile prima del rinnovo e produrre conferma persistente. La neutralità delle richieste recensioni vale durante trial e paid: nessun flusso seleziona solo clienti soddisfatti, devia quelli insoddisfatti o lega un vantaggio a una recensione positiva.
