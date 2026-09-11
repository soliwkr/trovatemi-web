# S01 — PILOT CARD

**Scopo:** chiudere il gate reale della Proof Story senza inventare dati e senza aprire S02 in anticipo.

## Regola

Questa card si usa con **tre attività Beauty & Wellness reali**.  
Le cinque risposte private devono arrivare dal titolare o da chi gestisce davvero il post-servizio. Non si simulano.

Preview:

`https://trovatemi-beauty-check-v2-preview.soliwkr.workers.dev/beauty-check/`

## Una sessione = 10 minuti

### 1. Cerca
Apri la preview davanti al titolare.

Fagli scrivere:

`NOME ATTIVITÀ + CITTÀ`

Deve riconoscere la propria attività nei risultati reali.

**FAIL** se non riesce a trovarla o se i dati pubblici mostrati sono chiaramente sbagliati.

### 2. Conferma
Il titolare conferma la propria attività.

Controlla insieme a lui:
- nome;
- località/categoria quando disponibile;
- rating;
- numero recensioni;
- eventuali altri risultati emersi dalla stessa ricerca.

Non chiamare gli altri risultati “ranking” o “concorrenti top”. Sono solo contesto reale della stessa ricerca.

### 3. Fai le 5 scene
Il titolare risponde come lavora **oggi**, non come vorrebbe lavorare.

Le cinque aree sono:
1. come chiede una recensione dopo una cliente felice;
2. chi risponde alle recensioni;
3. cosa succede a una recensione forte quando arriva;
4. dove viene riusata/mostrata la prova dei clienti;
5. volume approssimativo di clienti settimanali.

Non suggerire la risposta.

### 4. Flash
Lascia che legga il risultato senza spiegarlo.

Poi chiedi solo:

**“Secondo te, dove dice che si perde il tuo passaparola?”**

PASS comprensione se il titolare sa indicare il punto dominante senza che Chris glielo traduca.

### 5. Difendibilità
Chris verifica:

- la diagnosi deriva dalle risposte date;
- eventuali dati Google mostrati sono reali o degradano esplicitamente se mancanti;
- non compare un punteggio scientifico inventato;
- non viene promessa una posizione su Google;
- non viene presentato come vero un automatismo non ancora operativo;
- le tre mosse sono coerenti con la diagnosi.

Se una di queste fallisce: **FAIL**, annota lo schermo rotto e correggi solo quello.

## Evidence record

Per ciascuna delle tre sessioni annotare:

```
data:
attività:
città:
ruolo della persona:
query usata:
attività trovata: sì/no
dati pubblici credibili: sì/no/parziali
diagnosi:
titolare ha capito il punto senza spiegazione: sì/no
tre mosse coerenti: sì/no
dato mancante gestito correttamente: sì/no/non applicabile
frase spontanea del titolare:
schermo che ha creato attrito:
esito: PASS/FAIL
```

Non salvare in repository dati personali non necessari, email, telefono, token o credenziali.

## Gate S01

S01 passa soltanto con:

```
3 attività reali
+ 3 attività trovate correttamente
+ 3 set di risposte reali
+ 3 diagnosi difendibili
+ 3 comprehension check PASS
```

A quel punto — e non prima — si apre S02:

`D1 persistence → report persistente/email → privacy/measurement gate → trial assistito → primo invio reale`.

## Definizione economica che resta valida

- **MVP built:** una attività Beauty reale arriva al primo invio reale di richiesta recensione.
- **MVP repeatable:** una seconda attività arriva al primo valore senza nuova architettura.
- **MVP proven:** batch di 10 con lifecycle misurabile e almeno un primo pagamento post-trial.

Questa card non è un nuovo prodotto e non cambia pricing, funnel o architettura. Serve solo a far passare il prossimo cancello con prove vere.
