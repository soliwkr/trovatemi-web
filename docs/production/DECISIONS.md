# Decision log — Beauty & Wellness production

Questo log registra decisioni del conversion plane. Non sostituisce il decision log di TROVATEMI OS.

## P0-001 — Scope verticale

- **Decisione:** il primo prodotto production serve Beauty & Wellness locale, con una singola attività per audit.
- **Conseguenza:** multisede e altri settori richiedono una decisione successiva.

## P0-002 — Audit Engine come core asset

- **Decisione:** inbound, social/DM, outbound, QR e NFC convergono nello stesso Audit Engine.
- **Conseguenza:** non esistono report o funnel alternativi per canale.

## P0-003 — Places-first e cost-controlled

- **Decisione:** l’attività viene identificata prima del capture; Places resta demo fino a P3 e live solo dietro feature flag, cap e field mask.
- **Conseguenza:** nessun form generico come ingresso principale e nessuna chiamata fatturabile in P0–P2.

## P0-004 — Economics F0

- **Fonte:** [issue #25, approvata e chiusa](https://github.com/soliwkr/trovatemi-web/issues/25).
- **Decisione:** 21 giorni, carta all’attivazione, €0 durante il trial, €149/mese dopo il trial salvo cancellazione.
- **Conseguenza:** economics completi prima della carta; checkout non viene implementato prima di P8.

## P0-005 — Kit

- **Decisione:** Starter Review Kit digitale incluso nel trial; Welcome Kit fisico solo dopo primo pagamento riuscito.
- **Decisione economica:** target €25 all-in, hard cap €40 all-in spedizione inclusa.
- **Conseguenza:** nessun fulfillment trial; ordine oltre cap richiede review umana.

## P0-006 — Unlock code

- **Decisione:** validità predefinita 14 giorni e binding immutabile a una singola attività.
- **Conseguenza:** il code non avvia il trial e non può essere riutilizzato per un’altra attività.

## P0-007 — Review solicitation

- **Decisione:** neutrale e universale; incentivi mai dipendenti da recensione positiva.
- **Conseguenza:** review gating, diversion dei feedback negativi e recensioni false sono vietati.

## P0-008 — Authority e dati

- **Decisione:** TROVATEMI OS resta governance owner; D1 possiede lead/consenso/attribuzione/stato, Stripe i pagamenti, Climbo i dati nativi delivery.
- **Conseguenza:** `trovatemi-web` referenzia i contratti e non crea fonti concorrenti.

## P0-009 — Quattro reference screen P1

- **Decisione:** homepage, selezione attività, report e attivazione trial.
- **Conseguenza:** P1 non amplia scope o integra provider live.

## Decisioni aperte

- F1: contenuti e formati Starter Review Kit;
- F2: composizione/BOM Welcome Kit;
- valore approvato del cap giornaliero Places;
- policy retention/privacy applicabile prima di P4;
- dettagli Stripe, dunning e cancellazione prima di P8;
- capability e provisioning Climbo prima di P10.

Le decisioni aperte non impediscono P1, ma impediscono la fase che le usa.
