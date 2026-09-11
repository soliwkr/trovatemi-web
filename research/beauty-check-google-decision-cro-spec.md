# Beauty Check — Google Decision CRO Spec

> **SUPERSEDED 2026-09-11.** Founder direction replaced this visual/CRO system with `docs/design-system/trovatemi-public-v2.md`. Keep this file only as historical context; do not use it to drive current public UI or copy.

Status: **S01 frontend acceptance spec**  
Scope: `/beauty-check/` only  
Product truth unchanged: one product, Beauty & Wellness first campaign layer, same deterministic Audit Engine, no invented score/benchmark/ranking claim.

## North star

> **TROVATEMI tone + Google decision environment + visual truths at the exact moments where the prospect forms an opinion.**

The Beauty Check must not feel like a SaaS funnel or an editorial microsite. It should feel like the instant a customer searches, compares and decides — then Trovatemi reveals where the business's existing word of mouth stops becoming visible proof.

One screen = **one dominant idea + one visual truth + one action**.

## Visual language

### Trovatemi layer
- black / white / yellow as the dominant campaign skin;
- giant condensed / ultra-bold headlines;
- yellow as signal, emphasis and action — not decoration;
- hard borders, poster-like CTA blocks, little ornamental UI;
- direct-response hierarchy: HOOK → PROOF → PUNCH → ACTION.

### Google-decision layer
Use the familiar mental model of local search without imitating Google's brand/trade dress or inventing data:
- business name;
- category/locality/address;
- rating;
- review count;
- verified/current public evidence when returned by the approved Places flow;
- optional public imagery/status only when actually available and permitted by the data contract;
- recognizable local-choice hierarchy: search → result → business proof → compare → decide.

Google attribution remains explicit where required. Trovatemi remains the visible brand.

### Never
- fake Google screens;
- fabricated competitors;
- fake review counts;
- fake `open now`, photos, ranking or Maps position;
- public 0–100 score;
- unsupported statement that a competitor is better/worse;
- invented local benchmark;
- crowded dashboard UI;
- cream/wine/editorial styling as the primary Beauty Check skin;
- stock photography on every step.

---

# Screen 1 — ENTRY / HOOK

## CRO job
Make the prospect immediately recognize the buying situation: **people search, compare quickly, and choose what looks safer/more obvious.** Drive the first micro-commitment: search the business.

## Headline
Preferred:

> **TI CERCANO.  
> TI CONFRONTANO.  
> SCELGONO QUELLO CHE SEMBRA OVVIO.**

Alternative campaign hook when message-match requires it:

> **QUANTE CLIENTI FELICI STAI LASCIANDO USCIRE SENZA LASCIARE UNA TRACCIA?**

The `/go/<code>` campaign layer may select the hook later; `/beauty-check/` gets one canonical default.

## Visual truth
A single compact local-search motif, not a decorative hero:
- search field / local intent cue;
- stars + review count motif;
- one strong yellow statement strip.

Optional photography is allowed **only here** when it creates message-match with the acquisition creative. It must not become required runtime content.

## Supporting copy
Maximum 2 short lines:

> Cerca la tua attività. In meno di un minuto vediamo cosa può vedere una nuova cliente e dove il passaparola smette di lavorare per te.

## Primary action
**CERCA LA MIA ATTIVITÀ →**

The search field should be visible above the fold on common mobile viewports where practical; do not force an extra explanatory screen if the direct search interaction can begin immediately.

## Success signal
The page answers in ~2 seconds:
1. what is this about?
2. why should I care?
3. what do I do now?

---

# Screen 2 — SEARCH / REAL BUSINESS

## CRO job
Move from marketing claim to personal reality. The user must feel: **“this is about my business, not a generic audit.”**

## Headline
> **SCRIVI IL NOME DEL TUO CENTRO.**

## Interaction
- one large search field;
- placeholder: `Es. Nails Formia`;
- request only on explicit submit;
- max 5 candidates;
- no technical explanation about API cost/caching in prospect copy.

## Visual truth
The result list itself is the proof:
- real name;
- real category;
- real locality/address;
- clear `Google Maps` provenance;
- rating/review count only after selected-place details if that is the approved data contract.

Results should look like **real choices**, not table rows in an admin panel.

## Primary action
Selecting a result is the action. The entire result card/row is clickable.

## Secondary state
No result:
> Non è lei? Prova **nome + città**.

No fake fixture should visually masquerade as live. Demo fallback must remain explicitly labeled in non-production environments.

## Success signal
The correct business is findable with a human query such as `Nails Formia`, and the user can recognize it without reading instructions.

---

# Screen 3 — CONFIRM / “YOUR STOREFRONT”

## CRO job
Create the first **visual truth hit**. Before asking private questions, show what the market can actually see.

## Eyebrow
> **QUESTO È QUELLO CHE VEDE UNA NUOVA CLIENTE.**

## Headline
> **QUESTA È LA TUA VETRINA.**

## Visual truth card
A large high-contrast white card on the Trovatemi black canvas:
- business name as the hero;
- category/locality/address;
- rating `★`;
- review count;
- Google Maps attribution;
- any additional public element only if actually available in the approved provider response.

The numbers must dominate visually. Do not bury `4,8 ★` and `41 recensioni` in metadata-sized text.

## Punch line
> **Non dice quanto sei brava. Dice quanta prova vede una persona prima di scegliere.**

## Primary action
**SÌ. FAMMI VEDERE DOVE SI PERDE →**

Secondary:
**Non è questa**

## Success signal
The owner pauses because the displayed business is recognizably theirs and the public evidence feels concrete.

---

# Screen 4 — BRIDGE / THE MISSING MOMENT

## CRO job
Make the five private questions feel inevitable rather than like a lead quiz.

## Visual truth
Use the mother meme as a functional transition:

```text
“Mi sono trovata benissimo.”
          ↓
        PAGA
          ↓
        ESCE
          ↓
        FINE?
```

Then the yellow punch:

> **PECCATO CHE GOOGLE NON ERA LÌ.**

## Headline / explanation
> **Google vede ciò che resta pubblico.  
> Non vede cosa fai quando una cliente esce contenta.**

## Action
**DIMMI COSA SUCCEDE DAVVERO →**

If implementation speed matters, this may be visually integrated into the first quiz question rather than becoming an extra state; the bridge must still be perceptible.

## Success signal
The prospect understands why public data alone cannot diagnose the leak and accepts giving private operational answers.

---

# Screen 5 — FIVE PRIVATE QUESTIONS

## CRO job
Collect the minimum private reality with near-zero cognitive friction.

## Visual language
- black background;
- white question;
- yellow counter/progress;
- giant answer tiles;
- one tap advances;
- minimal helper copy.

## Header
> **5 DOMANDE. NIENTE TEORIA.**

## Questions
Preserve the five canonical semantic domains:
1. how reviews are requested;
2. who replies;
3. what happens to a strong review;
4. where proof is published/distributed;
5. approximate customer volume per week.

Question wording can be conversational, but **question versioning/semantics must remain deterministic**.

## Visual truth
At this stage the truth is the owner's own behavior. The selected answer must feel physically obvious and retained in the UI for the moment of selection.

Do not show diagnosis hints while answering. Do not bias the answer.

## Success signal
Five answers can be completed quickly on one thumb without feeling like a questionnaire or consultation form.

---

# Screen 6 — FLASH / THE REVEAL

## CRO job
Deliver the value **before email capture**. The owner must see a defensible conclusion derived from real public evidence + their five answers.

## Eyebrow
> **ECCOLO.**

## Headline structure
> **IL TUO PASSAPAROLA SI PERDE SOPRATTUTTO QUI:**

Then giant diagnosis label, e.g. the current deterministic family translated into prospect language.

## Visual truth board
This is not a dashboard. It is a **truth board** with 2–4 large facts:

### Public evidence
Examples only when returned live:
- `4,8 ★`
- `41 RECENSIONI`
- `GOOGLE MAPS · snapshot corrente`

### Private evidence
One or two concise facts from answers that explain the diagnosis, e.g.:
- `NON CHIEDI IN MODO SISTEMATICO`
- `LE RECENSIONI RESTANO DOVE NASCONO`

### Explanation
One short sentence:
> Hai già la materia prima: clienti soddisfatte. Questo è il primo punto dove smette di diventare prova visibile.

## Important guardrail
If no valid cohort exists, **do not** say `41 vs 384`, `sotto la media`, `il concorrente ha…` or similar. The creative comparison pattern is permitted only when later backed by a controlled cohort/real comparison methodology.

## Primary action
**DAMMI LE 3 MOSSE →**

## Success signal
A reasonable owner can explain back:
- what Trovatemi observed publicly;
- what they told us privately;
- where the first leak is;
- why that conclusion follows.

---

# Screen 7 — CAPTURE / THREE MOVES

## CRO job
Convert delivered insight into permission to continue, without making contact capture feel like the price of seeing the diagnosis.

## Eyebrow
> **ORA SAI DOVE PERDE.**

## Headline
> **VUOI SAPERE COSA FARE DOMANI?**

## Value promise
> Ti preparo le 3 mosse in ordine per **{business_name}**. Prima. Seconda. Terza.

## Visual truth preview
Show the three-move format visually before/around the form, without giving away fake generic prescriptions:

```text
01 — PRIMA
02 — POI
03 — INFINE
```

The actual actions come from the deterministic diagnosis/report logic.

## Capture
At S01 preview, capture may remain local/non-persistent. S02 owns real D1 persistence + transactional email.

Delivery consent and marketing/follow-up consent remain separate.

## CTA
**MANDAMI LE 3 MOSSE →**

## Reassurance
> Nessuna demo obbligatoria. Prima capisci cosa fare. Poi decidi se vuoi che Trovatemi faccia il lavoro con te.

## Success signal
Email capture feels like continuation of value, not a lead wall.

---

# Report direction (S02 surface, not S01 blocker)

When the persistent report is built, preserve the same visual language:

1. business/public truth card;
2. five private answers;
3. giant diagnosis banner;
4. three moves as three hard panels;
5. `oggi → con Trovatemi` mechanism;
6. activation CTA only when L3 is actually implemented.

The report must not become a dashboard or a long consultant PDF.

---

# Visual truth taxonomy

A **visual truth** is a concrete fact, behavior or transition the prospect can inspect without trusting marketing prose.

Allowed classes:

### V1 — Provider truth
Fact returned by the approved live provider flow, with provenance.
Example: rating/review count/name/address.

### V2 — User-declared truth
A direct answer the owner supplied in the five-question flow.

### V3 — Engine truth
A deterministic conclusion produced by the versioned diagnosis rules from V1 + V2.

### V4 — Operational truth
A product behavior Trovatemi actually supports in the current delivered product. Do not claim an automation before Climbo/runtime verification.

Every strong screen after search should primarily display one of these four truth classes.

---

# Direct-response copy rules

- prefer nouns/verbs over marketing adjectives;
- use short declarative sentences;
- write what the prospect can verify;
- curiosity is allowed; unsupported fear is not;
- never claim lost revenue/clients without data;
- never imply quality from review quantity;
- never imply Maps ranking causality;
- avoid `audit`, `score`, `performance dashboard` as the central public metaphor;
- default CTA language is first-person / outcome-oriented: `fammi vedere`, `dammi`, `mandami`.

---

# Mobile acceptance

Primary target: phone / in-app browser.

For every state:
- dominant idea visible without hunting;
- primary action comfortably tappable;
- no horizontal overflow;
- minimum practical body text;
- no multi-column layout that collapses into visual clutter;
- visual proof appears before long explanation;
- page should feel native to a social/DM click, not like leaving the campaign for a corporate website.

---

# S01 frontend PASS gate

S01 visual/CRO is acceptable only when **3 real Beauty businesses** can complete:

```text
entry
→ search
→ select real business
→ recognize public truth
→ understand why private questions matter
→ answer five
→ see deterministic flash
```

For each case the founder/operator must be able to answer YES to:

1. **Does it feel like the same world as the acquisition creative?**
2. **Is the business itself the protagonist, not Trovatemi UI?**
3. **Is there one dominant visual truth per transition?**
4. **Can every public factual claim be traced to provider evidence?**
5. **Can every diagnosis claim be traced to deterministic rules + answers?**
6. **Does each screen have one obvious next action?**
7. **Would a Beauty owner understand the point without founder explanation?**

If any answer is NO, fix that screen only. Do not reopen the homepage, product architecture, pricing, Territory Intelligence, D1/S02 or Climbo.

## Frozen operating rule

> **One active branch. One preview. One broken screen at a time.**
