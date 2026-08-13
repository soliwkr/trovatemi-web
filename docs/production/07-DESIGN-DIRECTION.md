# 07 — Direzione design

## Tesi

Il prodotto deve sembrare uno strumento editoriale costruito per chi lavora con persone, rituali e fiducia; non una dashboard SaaS generica. Il tono è caldo, tattile e preciso: energia beauty senza cliché cosmetici, autorevolezza senza freddezza enterprise.

## Principi

1. **Il motore è visibile.** La ricerca attività è l’azione dominante del primo schermo.
2. **Evidence prima della vendita.** Numeri, provenienza e limiti precedono pricing e form.
3. **Una gerarchia netta.** Titoli editoriali, body leggibile, microcopy operativa.
4. **Mobile-first reale.** Target touch adeguati, input visibile con tastiera, CTA non coperte, layout senza hover necessario.
5. **Specificità verticale.** Copy e casi includono hair, estetica, nails/lashes, massaggi, spa e wellness.
6. **Trasparenza demo/live.** Lo stato dei dati è sempre leggibile nello stesso punto del pattern.

## Sistema visivo

- palette dominante calda e neutra, accento energico e colori business usati con parsimonia;
- display condensato per tesi e numeri, sans leggibile per corpo e controlli, serif solo per citazioni umane;
- bordi, indici e griglie editoriali al posto di card galleggianti indistinte;
- motion breve e funzionale: progressione, conferma e cambio stato;
- nessuna purple gradient, glassmorphism gratuito, mascotte o mock dashboard fittizia.

## Accessibilità

- contrasto WCAG AA per testo e controlli;
- focus visibile e ordine tastiera logico;
- label persistenti, non solo placeholder;
- errori associati al campo e annunciati;
- `prefers-reduced-motion` rispettato;
- stelle e colori mai unica codifica del significato;
- contenuto utilizzabile a 320 px e zoom 200%.

## Le quattro reference screen di P1

P1 produce esattamente quattro schermate production, con stati mobile e desktop documentati dove necessario:

1. **Homepage / Beauty Check:** tesi, ricerca, vertical scope e trasparenza dati.
2. **Selezione attività:** query, risultati Places/demo, empty/error/quota state.
3. **Report:** evidence, score spiegabili, priorità e limite demo/live.
4. **Attivazione trial:** attività vincolata, economics completi, carta, Starter Kit e timing Welcome Kit.

P1 non collega ancora Places, D1, Stripe o Climbo e non amplia le route. La reference screen è accettata solo se rappresenta contenuto e stato reali del contratto, non un’immagine statica senza comportamento.

## Copy

- diretto, concreto, italiano;
- nessun “potenzia”, “rivoluziona”, “AI-powered” o superlativo non dimostrato;
- nessuna colpevolizzazione del titolare;
- “recensioni” è prova pubblica, non valuta da estrarre;
- il costo dopo il trial è mostrato prima della raccolta carta.

## Legacy isolation

Componenti e token possono essere riscritti, non promossi per somiglianza. V13 demo chrome, preview bar, tenant, Sunny Cafe, WhatsApp e contatti personali non appartengono al design system production.
