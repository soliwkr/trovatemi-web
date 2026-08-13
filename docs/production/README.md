# Beauty & Wellness Production Contract

**Stato:** canonico per la linea production di `trovatemi-web`

**Business line:** `climbo_white_label`

**Decisione di origine:** [BUILD P0 — issue #24](https://github.com/soliwkr/trovatemi-web/issues/24)

**Economics approvati:** [FOUNDER F0 — issue #25](https://github.com/soliwkr/trovatemi-web/issues/25)

## Per chi è questo contratto

Questo set è per chi progetta, implementa o revisiona il conversion plane pubblico Beauty & Wellness. Dopo averlo letto deve poter costruire il prossimo incremento senza inventare promessa, funnel, pricing, ownership dei dati o criteri di rilascio.

## Perimetro di autorità

Questo repository possiede l’esperienza pubblica, la composizione delle route e i dati nativi e temporanei del frontend. Non governa strategia aziendale, lifecycle commerciale, pricing globale, D1 o Climbo.

Le autorità esterne restano nel repository [`soliwkr/trovatemi-os`](https://github.com/soliwkr/trovatemi-os):

- [fonti della verità](https://github.com/soliwkr/trovatemi-os/blob/main/docs/00-governance/04-sources-of-truth.md);
- [costituzione del control plane](https://github.com/soliwkr/trovatemi-os/blob/main/docs/00-governance/05-control-plane-constitution.md);
- [convergenza dei due motori](https://github.com/soliwkr/trovatemi-os/blob/main/docs/01-architecture/two-engine-convergence.md);
- [contratto D1 ↔ Climbo](https://github.com/soliwkr/trovatemi-os/blob/main/docs/01-architecture/adr-001-d1-climbo-lead-contract.md);
- [motore commerciale Climbo white-label](https://github.com/soliwkr/trovatemi-os/blob/main/docs/06-commercial-climbo/README.md).

Questi documenti vengono referenziati, non copiati. In caso di conflitto, l’implementazione si ferma e il conflitto viene risolto nel control plane.

## Ordine di lettura

1. [Costituzione del prodotto](./00-PRODUCT-CONSTITUTION.md)
2. [Product brief](./01-PRODUCT-BRIEF.md)
3. [Inbound Engine](./02-INBOUND-ENGINE.md)
4. [Audit Engine](./03-AUDIT-ENGINE.md)
5. [Funnel e route](./04-FUNNEL-AND-ROUTES.md)
6. [Architettura dati](./05-DATA-ARCHITECTURE.md)
7. [Social/DM Engine](./06-SOCIAL-DM-ENGINE.md)
8. [Direzione design](./07-DESIGN-DIRECTION.md)
9. [Conversione e onboarding](./08-CONVERSION-AND-ONBOARDING.md)
10. [Roadmap](./09-ROADMAP.md)
11. [Gate di accettazione](./10-ACCEPTANCE-GATES.md)
12. [Decisioni](./DECISIONS.md), [stato](./STATUS.md) e [prossimo passo](./NEXT.md)

## Regola di modifica

Ogni modifica che cambia promessa, prezzo, durata del trial, kit, neutralità delle richieste o ownership richiede una decisione esplicita e un nuovo gate di coerenza. Il codice non può anticipare una decisione aperta.
