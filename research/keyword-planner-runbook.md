# Keyword Planner — grounding V4

## Obiettivo

Validare con dati reali quali categorie, problemi, città e intenti meritano una pagina TROVATEMI.IT. Il CSV contiene seed keyword, non volumi e non prove di domanda.

## Esecuzione

1. In Keyword Planner usare **Trova nuove parole chiave**.
2. Eseguire un `set_id` alla volta, evitando di mischiare categorie diverse.
3. Fare due letture distinte:
   - termini `customer_demand`: mostrano cosa cerca il cliente finale e alimentano audit e copy;
   - termini `owner_problem`: mostrano se il titolare cerca direttamente una soluzione e alimentano landing e guide TROVATEMI.
4. Per `IMM_SP_01`, `PAL_SP_01`, `BARB_SP_01` e `BAR_SP_01` impostare prima le località del Sud Pontino; ripetere poi senza filtro locale per distinguere domanda nazionale e locale.
5. Per `CAR_PE_01` impostare Pescara e comuni limitrofi; ripetere poi senza filtro locale.
6. Esportare almeno:
   - parola chiave;
   - media ricerche mensili;
   - variazione ultimi 3 mesi;
   - variazione anno su anno;
   - concorrenza;
   - offerta parte superiore pagina, fascia bassa;
   - offerta parte superiore pagina, fascia alta.

## Regole di lettura

- Non sommare automaticamente varianti molto vicine.
- Una keyword con volume non autorizza da sola una pagina.
- Una pagina passa il gate solo se ha domanda, problema distinto, contenuto originale e prova reale della categoria.
- Le query mediche diventano pagine soltanto se il servizio è realmente offerto e il contenuto viene verificato da un professionista competente.
- Le città limitrofe restano backlog finché non esistono dati e una ragione concreta per trattarle separatamente.

## Output per la rifinitura

Unire l’export di Keyword Planner al CSV tramite `set_id` e `keyword`. Ordinare per:

1. intento coerente con TROVATEMI;
2. domanda media;
3. valore economico della chiamata;
4. possibilità di produrre una prova verificabile;
5. priorità territoriale.
