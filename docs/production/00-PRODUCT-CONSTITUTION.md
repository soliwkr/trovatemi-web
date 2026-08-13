# 00 — Costituzione del prodotto

## Mandato

Trovatemi Beauty & Wellness rende visibile la fiducia che un’attività locale ha già costruito e la trasforma in un processo continuo, misurabile e corretto di raccolta della prova pubblica.

Il prodotto pubblico non vende “SEO”, posizioni garantite o recensioni. Fa tre cose in sequenza:

1. mostra cosa vede oggi una persona che confronta l’attività;
2. traduce i segnali pubblici in priorità comprensibili;
3. abilita un sistema neutrale per chiedere, gestire e valorizzare le recensioni.

## Pubblico

La prima verticale production comprende:

- parrucchieri e barber;
- centri estetici;
- nails e lashes;
- studi massaggi e massaggiatrici;
- spa, centri benessere e attività wellness.

Il decisore primario è il titolare o responsabile di una singola attività locale. Multisede, franchising e settori diversi restano fuori dal primo rilascio salvo decisione successiva.

## Invarianti

1. **L’Audit Engine è l’asset centrale.** Homepage, contenuti, DM, QR e NFC convergono nello stesso audit.
2. **Places-first, non form-first.** Prima si identifica l’attività; i dati di contatto arrivano solo quando servono a salvare, ricevere o attivare.
3. **Una sola attività per sessione diagnostica e unlock code.** Nessun token può migrare silenziosamente verso un’altra attività.
4. **Nessuna promessa di risultato garantito.** Il report descrive evidence, limiti e priorità.
5. **Solicitation neutrale e universale.** Lo stesso invito alla recensione viene rivolto a tutti; non si filtra in base alla soddisfazione e non si incentiva una recensione positiva.
6. **Dati demo dichiarati come demo.** Nessun numero simulato può sembrare proveniente da Google o da un’attività reale.
7. **Fail closed sulle integrazioni.** Maps, D1, Stripe e Climbo restano disattivati finché il rispettivo gate non è chiuso.
8. **Mobile-first.** Il percorso principale deve funzionare con una mano, su connessione mobile e senza dipendere da hover.

## Economia approvata per questa linea

- trial di **21 giorni**;
- carta raccolta all’attivazione;
- **€0 durante il trial**;
- **€149/mese** dopo il trial, salvo cancellazione prima del rinnovo;
- Starter Review Kit digitale incluso nel trial;
- Welcome Kit fisico rilasciato solo dopo il primo pagamento riuscito;
- costo all-in target del Welcome Kit: **€25**;
- hard cap all-in del Welcome Kit: **€40**, spedizione inclusa;
- unlock code valido **14 giorni**, single-business use.

Queste decisioni provengono dall’approvazione F0. `trovatemi-web` ne implementa la presentazione e i gate; TROVATEMI OS resta governance owner della linea commerciale e Stripe resta system of record dei pagamenti quando sarà introdotto.

## Non-obiettivi

- non replicare TROVATEMI OS, D1 o Climbo;
- non costruire un CRM nel frontend;
- non pubblicare un listino applicabile ad altre business line;
- non introdurre review gating, recensioni false o incentivi legati al voto;
- non attivare chiamate live o deploy production durante P0;
- non portare nel percorso production chrome, tenant o contatti delle demo legacy.

## Regola di conflitto

Se questo contratto diverge dalle fonti canoniche del control plane su governance, lifecycle o dati, prevale TROVATEMI OS. Se diverge dall’approvazione F0 su economics, l’implementazione si blocca e richiede una decisione esplicita: non sceglie automaticamente un valore.
