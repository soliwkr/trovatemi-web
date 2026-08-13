# 02 — Inbound Engine

## Scopo

L’Inbound Engine trasforma traffico anonimo in una diagnostic session utile prima di chiedere dati personali. Tutte le sorgenti pubbliche devono convergere nel Beauty Check, non in landing scollegate.

## Ingressi

- ricerca organica e brand;
- contenuti social;
- link in bio e DM;
- referral e link diretti;
- QR/NFC su asset digitali o fisici;
- Mystery NFC/lumpy mail con unlock code univoco;
- campagne future, solo dopo consenso e attribution gate.

## Flusso canonico

```text
touch attribuito
→ homepage o ingresso contestuale
→ ricerca attività
→ candidati Places
→ selezione esplicita
→ audit snapshot
→ report
→ salvataggio/attivazione opzionale
```

Il form di contatto non precede la prova. Nome, email o telefono vengono chiesti solo per una funzione dichiarata: ricevere il report, proseguire l’attivazione o essere ricontattati con consenso separato.

## Modalità dati

### Demo — P0/P1/P2

- dataset locale versionato;
- risultati e report marcati come dimostrativi;
- nessuna chiamata Maps, D1 o Climbo;
- query usata solo nel browser o nel rendering della demo;
- nessuna persistenza di dati inseriti.

### Live cost-controlled — da P3

L’integrazione Places può essere accesa solo se tutti i gate sono presenti:

1. feature flag server-side disattivata per default;
2. API key server-side con restrizioni di servizio e ambiente;
3. session token per ogni ricerca;
4. autocomplete solo dopo intenzione sufficiente, con debounce e cancellazione delle richieste superate;
5. field mask minima;
6. Place Details chiamato solo dopo selezione esplicita;
7. massimo per-sessione configurabile e limite giornaliero fail-closed;
8. budget e alert Cloudflare/Google approvati;
9. logging senza query o PII in chiaro;
10. fallback dichiarato, senza spacciare dati demo per live.

Il valore del limite giornaliero non viene inventato in questo contratto: deve essere configurato e approvato prima dell’abilitazione. Superato il cap, il sistema non effettua altre chiamate fatturabili.

## Attribution

Ogni ingresso può portare una source, campaign e content reference. Il frontend conserva solo quanto serve alla sessione; la persistenza canonica avviene in D1 quando nasce un lead o un consenso valido. Gli eventi GA4 grezzi non vengono copiati in D1.

## Stati di errore

- query insufficiente: suggerire nome + città;
- nessun candidato: permettere correzione, non forzare un match;
- quota/cap raggiunto: dichiarare indisponibilità temporanea;
- provider non disponibile: non creare risultati sintetici silenziosi;
- attività errata: tornare alla selezione senza perdere attribution della sessione.

## Gate di uscita

L’Inbound Engine consegna all’Audit Engine soltanto un’identità attività selezionata esplicitamente, la provenienza della sessione e l’evidence consentita. Non crea un client, non attiva Climbo e non avanza autonomamente uno stato commerciale.
