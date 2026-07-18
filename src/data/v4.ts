export type V4Category = {
  slug: string;
  name: string;
  singular: string;
  territory: string;
  query: string;
  accent: string;
  code: string;
  hero: string;
  subhero: string;
  problemSlug: string;
  problemLabel: string;
  problemTitle: string;
  problemBody: string;
  solutionTitle: string;
  solutionBody: string;
  proof: readonly string[];
  cta: string;
};

export const v4Categories: readonly V4Category[] = [
  {
    slug: 'agenzie-immobiliari',
    name: 'Agenzie immobiliari',
    singular: 'agenzia immobiliare',
    territory: 'Formia',
    query: 'agenzia immobiliare formia',
    accent: '#f4b400',
    code: '01 / CASA',
    hero: 'Il prossimo incarico non lo perdi in trattativa.',
    subhero: 'Lo perdi prima ancora di sapere che esiste: quando il proprietario apre Google, confronta le agenzie e chiama quella che gli trasmette più fiducia.',
    problemSlug: 'poche-recensioni-google',
    problemLabel: 'Poche recensioni Google',
    problemTitle: 'Se il concorrente ha quattro volte le tue recensioni, parte quattro passi avanti.',
    problemBody: 'Tu conosci il territorio, sai valutare un immobile e segui il cliente fino al rogito. Ma chi non ti conosce vede soltanto ciò che Google gli mette davanti.',
    solutionTitle: 'Rendiamo pubblica la fiducia che hai già guadagnato.',
    solutionBody: 'Profilo ordinato, recensioni vere, NFC sulla scrivania e un ritmo semplice da mantenere mentre continui a vendere case.',
    proof: ['Confronto con le agenzie della zona', 'Contatore recensioni verificabile', 'Ricerca Google dal telefono del titolare'],
    cta: 'Guarda cosa vede un proprietario',
  },
  {
    slug: 'cardiologi',
    name: 'Cardiologi',
    singular: 'cardiologo',
    territory: 'Pescara',
    query: 'cardiologo pescara',
    accent: '#6ed2c2',
    code: '02 / SALUTE',
    hero: 'Prima di prenotare, il paziente cerca conferme.',
    subhero: 'Controlla dove ricevi, quanto sono chiare le informazioni e cosa raccontano le persone che hanno avuto un’esperienza reale con te.',
    problemSlug: 'profilo-google-poco-chiaro',
    problemLabel: 'Profilo Google poco chiaro',
    problemTitle: 'Il paziente non può valutare la tua competenza da una schermata. Può valutare la chiarezza.',
    problemBody: 'Se orari, sede, fotografie e recensioni non riducono il dubbio, continua a cercare. Non perché tu sia meno competente: perché non ha ancora elementi sufficienti per scegliere.',
    solutionTitle: 'Facciamo trovare informazioni chiare e prove autentiche.',
    solutionBody: 'Una presenza ordinata, aggiornata e verificabile che aiuta il paziente a capire chi sei prima della telefonata, senza promesse sanitarie e senza forzature.',
    proof: ['Informazioni dello studio controllate', 'Recensioni autentiche e non filtrate', 'Percorso di contatto semplice'],
    cta: 'Guarda il profilo con gli occhi del paziente',
  },
  {
    slug: 'palestre',
    name: 'Palestre',
    singular: 'palestra',
    territory: 'Formia',
    query: 'palestra formia',
    accent: '#ff6b51',
    code: '03 / FITNESS',
    hero: 'La persona vuole già allenarsi.',
    subhero: 'La domanda non è se si iscriverà a una palestra. È quale palestra chiamerà dopo avere confrontato fotografie, orari e recensioni.',
    problemSlug: 'profilo-google-fermo',
    problemLabel: 'Profilo Google fermo',
    problemTitle: 'Una sala piena alle 19 non serve a niente se alle 11 su Google sembri chiuso.',
    problemBody: 'I social mostrano energia a chi già ti segue. Chi cerca una palestra vicino a sé, invece, decide da una scheda: se sembra trascurata, passa alla successiva.',
    solutionTitle: 'Mostriamo un’attività viva nel momento della scelta.',
    solutionBody: 'Recensioni costanti, fotografie vere, informazioni corrette e NFC alla reception: il lavoro fatto in sala diventa fiducia visibile.',
    proof: ['Orari e servizi sempre leggibili', 'Fotografie recenti e reali', 'Recensioni facili da lasciare'],
    cta: 'Guarda cosa vede chi cerca una palestra',
  },
  {
    slug: 'barbieri',
    name: 'Barbieri',
    singular: 'barbiere',
    territory: 'Formia',
    query: 'barbiere formia',
    accent: '#85a7ff',
    code: '04 / GROOMING',
    hero: 'Una poltrona vuota non fa rumore.',
    subhero: 'Ma a fine mese si sente. Ogni settimana qualcuno cerca un barbiere nella tua zona e sceglie usando le prove che trova sul telefono.',
    problemSlug: 'clienti-soddisfatti-invisibili',
    problemLabel: 'Clienti soddisfatti invisibili',
    problemTitle: 'I clienti escono contenti. Poi quella soddisfazione sparisce insieme a loro.',
    problemBody: 'Chi non ti conosce non vede la precisione del taglio, l’ambiente o il modo in cui tratti le persone. Vede poche fotografie e un contatore che magari non sale da mesi.',
    solutionTitle: 'Trasformiamo il gesto finale in una prova che resta.',
    solutionBody: 'Un tocco sull’NFC, lo stesso link Google per tutti e una richiesta semplice: il lavoro ben fatto continua a parlare anche dopo che il cliente è uscito.',
    proof: ['NFC e QR vicino alla cassa', 'Stesso link per ogni cliente', 'Risposte che mostrano attenzione'],
    cta: 'Scopri chi compare prima di te',
  },
  {
    slug: 'bar',
    name: 'Bar e cocktail bar',
    singular: 'bar',
    territory: 'Formia',
    query: 'aperitivo formia',
    accent: '#d9a9ff',
    code: '05 / HOSPITALITY',
    hero: 'Il locale può essere pieno il sabato e invisibile il martedì.',
    subhero: 'Quando qualcuno cerca un aperitivo o un posto dove incontrarsi, non sente la musica e non assaggia il cocktail. Guarda Google.',
    problemSlug: 'locale-vivo-profilo-spento',
    problemLabel: 'Locale vivo, profilo spento',
    problemTitle: 'Il tuo bancone racconta una storia. Le fotografie di tre anni fa ne raccontano un’altra.',
    problemBody: 'Chi ti conosce torna. Il problema è chi deve scegliere per la prima volta e trova informazioni incomplete, immagini vecchie e poche recensioni recenti.',
    solutionTitle: 'Teniamo accesa la vetrina che le persone guardano prima di uscire.',
    solutionBody: 'Fotografie vere, informazioni corrette, recensioni costanti e NFC sul bancone: l’esperienza del locale arriva sul telefono prima della visita.',
    proof: ['Atmosfera raccontata da immagini vere', 'Orari e servizi aggiornati', 'Recensioni richieste senza pressione'],
    cta: 'Guarda cosa vede chi cerca un locale',
  },
] as const;

export type V4Post = {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  readTime: string;
  intro: string;
  sections: readonly { title: string; body: string }[];
};

export const v4Posts: readonly V4Post[] = [
  {
    slug: 'agenzia-piu-brava-non-riceve-telefonata',
    categorySlug: 'agenzie-immobiliari',
    title: 'Perché l’agenzia più brava non è sempre quella che riceve la telefonata',
    excerpt: 'Prima dell’incarico, il proprietario non può misurare la competenza. Usa le prove che trova.',
    readTime: '4 min',
    intro: 'La decisione comincia molto prima della valutazione dell’immobile. Comincia quando un proprietario apre Google e prova a ridurre il rischio scegliendo tra nomi che spesso non conosce.',
    sections: [
      { title: 'La bravura è invisibile prima del primo incontro', body: 'Esperienza, negoziazione e conoscenza del territorio emergono dopo una conversazione. Prima, il proprietario vede voto, numero di recensioni, risposte, fotografie e chiarezza delle informazioni.' },
      { title: 'Il confronto avviene comunque', body: 'Anche se non prepari la tua presenza, Google la mette accanto a quella dei concorrenti. Il vuoto non resta vuoto: viene interpretato come un segnale.' },
      { title: 'La soluzione non è sembrare perfetti', body: 'È rendere visibile ciò che esiste già: clienti reali, esperienze reali e un professionista che risponde. La fiducia cresce quando le prove sono recenti e verificabili.' },
    ],
  },
  {
    slug: 'cosa-controlla-paziente-prima-di-prenotare',
    categorySlug: 'cardiologi',
    title: 'Cosa controlla un paziente su Google prima di prenotare una visita',
    excerpt: 'La prima esigenza non è stupire. È ridurre l’incertezza con informazioni chiare.',
    readTime: '5 min',
    intro: 'Quando si tratta di salute, fiducia e chiarezza contano più di qualunque slogan. Una presenza digitale utile risponde alle domande pratiche senza fare promesse che non dovrebbe fare.',
    sections: [
      { title: 'Dove, quando, come', body: 'Indirizzo, orari, modalità di prenotazione e contatto devono essere immediatamente comprensibili. Ogni dubbio non risolto diventa un motivo per continuare la ricerca.' },
      { title: 'Le recensioni raccontano l’esperienza, non l’esito clinico', body: 'Accoglienza, puntualità, ascolto e chiarezza possono essere raccontati da chi ha vissuto il servizio. Non si chiedono giudizi sanitari né contenuti specifici.' },
      { title: 'Una presenza seria non ha bisogno di urlare', body: 'Informazioni accurate, fotografie reali e risposte rispettose sono segnali più credibili di qualsiasi superlativo.' },
    ],
  },
  {
    slug: 'palestra-vicino-a-me-cosa-vede',
    categorySlug: 'palestre',
    title: '“Palestra vicino a me”: cosa vede davvero una persona pronta a iscriversi',
    excerpt: 'Non sta cercando un contenuto da guardare. Sta cercando un posto da scegliere.',
    readTime: '4 min',
    intro: 'La ricerca locale ha un’intenzione precisa: capire quale palestra visitare, chiamare o provare. La decisione si costruisce con dettagli molto concreti.',
    sections: [
      { title: 'La scheda viene prima del tour', body: 'Orari, distanza, fotografie degli spazi, servizi e recensioni aiutano a decidere se valga la pena fare il primo passo.' },
      { title: 'I social non sostituiscono Google', body: 'I social mostrano identità e comunità. Google intercetta chi ha già formulato una domanda. Sono due momenti diversi e devono lavorare insieme.' },
      { title: 'La costanza batte il picco', body: 'Una fotografia reale ogni tanto e recensioni che arrivano con naturalezza raccontano meglio l’attività rispetto a una campagna intensa seguita da mesi di silenzio.' },
    ],
  },
  {
    slug: 'taglio-riuscito-recensione-google',
    categorySlug: 'barbieri',
    title: 'Come trasformare un taglio riuscito in una recensione Google senza insistere',
    excerpt: 'La richiesta funziona quando è semplice, volontaria e uguale per tutti.',
    readTime: '3 min',
    intro: 'Il momento migliore non è quello in cui il cliente viene spinto a scrivere. È quello in cui trova un passaggio semplice e può scegliere liberamente se raccontare la propria esperienza.',
    sections: [
      { title: 'Riduci i passaggi', body: 'Una targhetta NFC o un QR vicino alla cassa apre direttamente il collegamento corretto. Niente istruzioni lunghe e nessuna applicazione da installare.' },
      { title: 'Non suggerire il voto', body: 'La richiesta deve essere neutra. Lo stesso collegamento viene mostrato a ogni cliente reale, senza separare contenti e scontenti.' },
      { title: 'Rispondi come lavori', body: 'Una risposta breve, personale e coerente mostra che l’attenzione non finisce quando il cliente esce dal negozio.' },
    ],
  },
  {
    slug: 'foto-recensioni-bar-giorni-vuoti',
    categorySlug: 'bar',
    title: 'Perché fotografie e recensioni del tuo bar valgono soprattutto nei giorni vuoti',
    excerpt: 'Il cliente abituale conosce il locale. La presenza online serve a chi deve ancora scoprirlo.',
    readTime: '4 min',
    intro: 'Un locale non viene cercato soltanto nel momento di massimo afflusso. Le persone pianificano, confrontano e scelgono durante il resto della settimana.',
    sections: [
      { title: 'Le immagini anticipano l’atmosfera', body: 'Spazi, luce, bancone, prodotti e persone danno un’idea concreta dell’esperienza. Immagini vecchie o generiche interrompono questo racconto.' },
      { title: 'Le recensioni riducono il rischio della prima visita', body: 'Chi non è mai entrato usa esperienze recenti per capire se il locale è adatto all’occasione che ha in mente.' },
      { title: 'La vetrina deve restare accesa', body: 'Informazioni corrette e segnali recenti fanno sì che il locale sembri vivo anche quando chi lo cerca è ancora sul divano.' },
    ],
  },
] as const;

export const v4Faq = [
  ['TROVATEMI garantisce la prima posizione su Google?', 'No. Nessuno può garantire una posizione. Lavoriamo sugli elementi che puoi controllare e verificare: informazioni, fotografie, recensioni, risposte e continuità.'],
  ['Le recensioni negative vengono filtrate?', 'No. Ogni cliente arriva allo stesso link Google. Nessun filtro, nessun trucco e nessun voto gonfiato.'],
  ['Come funziona l’NFC?', 'Il cliente avvicina il telefono alla targhetta o all’anello e apre il collegamento per lasciare la recensione. È sempre disponibile anche un QR.'],
  ['Devo installare un’app?', 'No. Il cliente usa il proprio telefono e apre il collegamento.'],
  ['TROVATEMI sostituisce chi gestisce i social?', 'No. I social parlano a chi sta scorrendo; TROVATEMI lavora quando qualcuno sta già cercando. Sono due lavori diversi.'],
  ['Come verifico se sta funzionando?', 'Aprendo il tuo profilo Google. Il contatore delle recensioni è pubblico e controllabile dal tuo telefono.'],
  ['Quanto lavoro richiede?', 'Pochi secondi per invitare il cliente e qualche minuto per controllare e rispondere alle nuove recensioni.'],
  ['Chi risponde se ho bisogno?', 'Chris. Se chiami, risponde Chris.'],
] as const;

export const getV4Category = (slug: string) => v4Categories.find((category) => category.slug === slug);
export const getV4Post = (slug: string) => v4Posts.find((post) => post.slug === slug);
export const getV4PostForCategory = (categorySlug: string) => v4Posts.find((post) => post.categorySlug === categorySlug);
