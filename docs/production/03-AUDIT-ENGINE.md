# 03 — Audit Engine

## Ruolo

L’Audit Engine è il core asset di Trovatemi Beauty & Wellness. Riceve evidence pubblica relativa a una singola attività, la normalizza e produce una diagnosi spiegabile. Homepage, social, outbound e attivazione devono riusare questa stessa lettura.

## Input minimo

- identificatore opaco dell’attività e provider;
- nome, categoria, indirizzo/città presentabili;
- rating e volume recensioni, se disponibili;
- distribuzione temporale necessaria alla freschezza;
- conteggio risposte del titolare, se verificabile;
- immagini e completezza dei segnali ammessi;
- timestamp di osservazione e provenance;
- versione delle regole di scoring.

Un campo assente resta `unknown`: non vale zero e non viene inventato.

## Output

1. **Snapshot:** facts osservati, fonte e tempo.
2. **Segnali:** reputazione, freschezza, conversazione, completezza/immagini.
3. **Punteggi spiegabili:** valore, denominatore, regola e confidence.
4. **Lettura:** una sintesi specifica, senza linguaggio assoluto.
5. **Priorità:** massimo tre azioni ordinate per impatto e fattibilità.
6. **Limiti:** cosa non è stato osservato o cosa richiede verifica.

## Regole di scoring

- deterministiche e versionate;
- stesse evidence producono lo stesso output per la stessa versione;
- nessun confronto usa concorrenti non identificati o dati non osservati;
- confidence distinta dal punteggio;
- copy derivato da regole approvate, non da testo AI non verificato;
- eventuale AI futura può proporre la spiegazione, ma non alterare facts o score.

## Profondità del report

- **Preview anonima:** segnali essenziali e priorità principali.
- **Report salvato:** snapshot persistente, provenance e link sicuro.
- **Report attivato:** piano operativo collegato al trial e allo Starter Review Kit.

La progressione non nasconde artificialmente errori o facts negativi per forzare la conversione.

## Audit demo

In P0/P1/P2 l’engine usa fixture locali. Ogni report deve mostrare chiaramente “dati dimostrativi” e non può usare date, loghi o indirizzi che inducano a credere che sia stato interrogato un profilo reale.

## Audit live

L’audit live richiede P3 e P4 chiusi: cost gate Places, contratto dati, consent/attribution, ID canonici, redazione log e persistenza D1 autorizzata. La semplice disponibilità di una API key non chiude il gate.

## Neutralità

Le priorità possono consigliare un processo di richiesta recensioni, ma devono sempre specificare che:

- l’invito va a tutti i clienti eleggibili secondo lo stesso criterio operativo;
- nessuna ricompensa dipende dal voto o dalla pubblicazione positiva;
- un feedback negativo non viene deviato per impedire una recensione pubblica;
- recensioni false, acquistate o generate non fanno parte del prodotto.

## Versionabilità

Ogni snapshot persistente porta `audit_version` e `ruleset_version`. Un nuovo ruleset non riscrive silenziosamente report storici; un ricalcolo crea una nuova versione collegata alla precedente.
