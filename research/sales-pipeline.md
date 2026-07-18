# TROVATEMI.IT — percorso sito → telefonata → cliente

Questo documento collega il sito pubblico alla vendita telefonica o di persona. La pipeline è privata: il cliente vede soltanto il confronto, la demo e i prossimi passi; non vede strumenti, stati o automazioni interne.

## Principio

Il sito non deve chiudere il contratto. Deve far avanzare una persona da una sensazione generica (“forse dovrei curare Google”) a un problema osservabile (“chi mi cerca vede meno prove dei concorrenti”) e preparare una conversazione con Chris.

La prova avviene sul telefono del titolare:

1. ricerca della categoria;
2. confronto con le attività visibili;
3. contatore delle recensioni e data dell’ultima;
4. prova NFC/QR;
5. dimostrazione del prodotto;
6. scelta del livello soltanto se esiste un problema reale.

## Pipeline privata

| Stato | Criterio di ingresso | Prossima azione | Uscita verificabile |
| --- | --- | --- | --- |
| Target | Attività con un segnale pubblico osservabile | Preparare il confronto | Dati verificati dal telefono |
| Audit pronto | Confronto e problema specifico disponibili | Contatto WhatsApp o di persona | Il titolare risponde |
| Conversazione | Interesse o curiosità esplicita | Vendere l’incontro, non spiegare tutto | Giorno e ora concordati |
| Appuntamento | Slot reale fissato | Conferma e reminder | Presente / no-show |
| Demo fatta | Ricerca, NFC e prodotto mostrati | Diagnosi e qualifica | Fit chiaro per ★, ★★, ★★★ o nessun fit |
| Proposta | Problema e livello concordati | Patto e decisione | Sì / no entro 48 ore |
| Onboarding | Accettazione e piano assegnato | Call 1 già in calendario | GBP, richiesta e baseline configurati |
| Attivo | Sistema avviato | Check giorno 7 e 14 | Contatore e flusso verificati |
| Raccolto | Giorno 90 | Caso studio, testimonianza solo dopo risultato, referral | Numeri pubblici documentati |

## Dati minimi prodotti dal sito

La demo V4.2 prepara questi campi senza conservarli:

- nome attività;
- categoria;
- fascia recensioni attuale;
- presenza percepita di un concorrente più forte;
- preferenza telefono / incontro di persona.

Il browser genera un messaggio pronto per Chris e pubblica l’evento front-end `trovatemi:lead-qualified`. Il collegamento a un sistema di acquisizione va aggiunto solo quando è stato scelto il tracker canonico e resta soggetto a gate umano.

## Script di apertura dell’incontro

> Prima di farti vedere il prodotto, apriamo Google dal tuo telefono. Cerchiamo quello che cercherebbe un tuo cliente e guardiamo gli stessi numeri che vede lui. Se non c’è un problema reale, te lo dico subito.

## Demo breve

1. **Problema — 2 minuti:** ricerca, confronto, freschezza e contatore.
2. **Gesto — 1 minuto:** tocco NFC o QR sul telefono del titolare.
3. **Prodotto — 4 minuti:** richiesta, risposta, contenuto, pagina e livello di approvazione.
4. **Misura — 1 minuto:** baseline pubblica e cosa sarà verificato.
5. **Decisione — 2 minuti:** livello adatto oppure nessun fit.

## Confini

- Nessuna promessa di posizione su Google o citazione nelle AI.
- Nessun filtro tra clienti contenti e scontenti.
- Nessun numero inventato o trasferito da un’altra attività.
- Nessun CRM, dashboard o “pipeline” venduto al cliente.
- Il tab Sales osservato nello snapshot Climbo mostra pagamenti e volumi; la route `#/sales` dello snapshot restituisce 404. Non va trattato come CRM operativo finché il prodotto live non dimostra il contrario.
- Prezzi e condizioni restano quelli delle fonti canoniche TROVATEMI.IT.
