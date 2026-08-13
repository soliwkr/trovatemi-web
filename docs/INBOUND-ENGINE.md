# Trovatemi Beauty Inbound Engine

Status: proposal implemented as isolated noindex preview. Production is unchanged.

## 1. Unit of design

The product is not a sales homepage. The unit is the full acquisition loop:

```text
content / social / search
→ link or DM entry
→ Beauty Reputation Score
→ contact capture after value
→ personalized report
→ automated nurture
→ self-service activation
→ guided onboarding
→ Climbo delivery
→ customer outcomes
→ new proof/content
```

Human contact is an exception path, not the primary CTA.

## 2. Audience

First validation audience only:

- hair salons;
- barber shops;
- beauty centres;
- nail / lashes / adjacent appointment-based beauty specialists.

No generic local-business messaging is allowed in the primary inbound surfaces.

## 3. Lead magnet

Name: **Beauty Reputation Score**.

Promise: seven questions in about one minute to understand how consistently the salon turns customer satisfaction into visible online proof.

The score is based only on quiz answers. It must never be presented as Google ranking, revenue prediction, review quality score or independent audit of the business.

### Questions

1. business type;
2. weekly customer volume;
3. review request consistency;
4. new reviews in the last 30 days;
5. response consistency;
6. reuse of reviews as content;
7. publishing continuity across channels.

### Output

- score 0–100;
- strongest pillar;
- first bottleneck;
- operational opportunity: low / medium / high;
- three next actions.

## 4. Capture rule

Do not request contact details before the diagnostic is completed.

After the final answer:

> Il report è pronto. Dove te lo mando?

Required target fields:

- salon name;
- city;
- email;
- consent.

Optional:

- WhatsApp.

Attribution fields are collected silently from URL/context when available:

- source;
- medium;
- campaign;
- content;
- keyword;
- referring surface;
- landing version;
- score version.

## 5. Social acquisition

Every Trovatemi social asset should have one job: move the right beauty operator into the diagnostic.

Primary CTA families:

- link in bio → Beauty Reputation Score;
- DM keyword → diagnostic link;
- comment keyword → DM diagnostic link where the platform/provider supports it;
- story/reel CTA → diagnostic link;
- retarget/nurture content → reopen the existing report rather than restart a generic sales conversation.

Initial content pillars:

1. **Il complimento che sparisce** — familiar salon moments where praise never becomes public proof.
2. **Review-to-content** — show one authentic review becoming reply + social proof.
3. **Checkup breakdowns** — explain one Beauty Score dimension at a time.
4. **Before the tool** — operational mistakes such as asking too late or responding inconsistently.
5. **Aggregate insights** — only after enough real quiz data exists; use anonymized aggregates, never fabricated benchmarks.

No post should end with “scrivi a Chris”. The default destination is the diagnostic or an existing report.

## 6. DM layer

DM is a routing layer, not manual sales chat by default.

Target flow:

```text
keyword / inbound message
→ short automated acknowledgement
→ tracked Beauty Score URL
→ quiz completion event
→ report event
→ nurture branch
```

If a provider cannot safely automate a platform, the fallback is the tracked profile link. Do not invent platform capability.

## 7. Data and systems

Target architecture:

```text
Web / social / DM
      ↓
Attribution + quiz events
      ↓
D1 — canonical inbound lead + event history
      ↓
Report generator
      ↓
Email / optional WhatsApp delivery
      ↓
Climbo contact + nurture only after the approved sync gate
      ↓
Self-service activation / onboarding
```

D1 owns acquisition identity, attribution, quiz answers, score version, report status, consent and funnel events.

Climbo remains downstream for its native CRM/delivery capabilities. Do not make the quiz front-end a second CRM.

## 8. Two scores, never one

### Beauty Reputation Score

Customer-facing. Derived only from diagnostic answers. It describes process maturity.

### Intent Score

Internal only. Derived from behavior such as:

- quiz completion;
- report delivery/open;
- repeat report visit;
- activation-page visit;
- checkout start;
- onboarding start.

The commercial intent score must never alter the diagnostic score.

## 9. Nurture

Nurture is triggered by the report and bottleneck, not a generic newsletter.

Example branches:

- weak collection → timing/NFC/QR education;
- weak replies → response examples and consistency;
- weak reuse → review-to-social examples;
- high maturity + high intent → activation path quickly;
- low intent → educational follow-up without sales pressure.

Every message links back to the existing report or the relevant next step.

## 10. Conversion

Target primary conversion:

```text
report
→ what Trovatemi automates for this diagnosis
→ price and scope
→ checkout
→ onboarding form
→ connect Google/social
→ configure rules
→ NFC/QR fulfilment
→ active client
```

No mandatory discovery call. Human help can be offered for exceptions, access problems, complex ownership or fulfilment.

## 11. Current preview

Implemented now:

- `/inbound/` — Beauty Score intro, seven-question quiz, post-value contact capture, report and product reveal;
- `/inbound/next/` — target self-service path after the report;
- deterministic score engine in `src/data/beauty-score.ts`;
- isolated visual system in `src/styles/inbound.css`;
- no old cafe/hotel/fitness links on the inbound surfaces;
- no Chris/WhatsApp CTA;
- no network transmission of submitted preview fields.

Not yet connected:

- D1 persistence;
- report email;
- WhatsApp delivery;
- DM automation provider;
- Climbo contact sync/nurture;
- checkout;
- onboarding/provisioning;
- analytics event transport.

## 12. Release gates

Before production:

1. decide D1 inbound schema and consent/event model;
2. implement server-side capture and score versioning;
3. implement real report delivery;
4. verify Climbo sync path and approved contact lifecycle;
5. choose/verify DM automation capabilities per platform;
6. connect checkout and onboarding;
7. add privacy/retention policy;
8. prove attribution end to end;
9. QA mobile and accessibility;
10. promote to root only in a separate explicit release PR.
