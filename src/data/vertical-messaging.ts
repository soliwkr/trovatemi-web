export type VerticalMessaging = {
  id: string;
  bioHeadline: string;
  bioBody: string;
  bioCta: string;
  landingHeadline: string;
  landingLede: string;
  sceneTitle: string;
  sceneBody: string;
  objection: string;
  demoLens: string;
  moment: string;
};

export const verticalMessaging: VerticalMessaging[] = [
  {
    id: 'luxury-watches',
    bioHeadline: 'Prima di affidarti un acquisto importante, il cliente cerca prove.',
    bioBody: 'Guarda come recensioni recenti, risposte curate e contenuti reali possono rendere più facile fidarsi della tua attività.',
    bioCta: 'Guarda la demo orologeria',
    landingHeadline: 'Prima di affidarti un acquisto importante, il cliente cerca prove.',
    landingLede: 'Quando il valore della scelta è alto, il cliente legge recensioni, risposte e dettagli prima di entrare. Trovatemi rende più visibile la qualità che oggi dimostri soltanto in boutique.',
    sceneTitle: 'La vendita comincia prima della boutique.',
    sceneBody: 'Competenza, autenticità, assistenza e cura si capiscono davvero durante la consulenza. Prima dell’appuntamento, però, chi cerca deve ricostruirle da ciò che trova online.',
    objection: 'Non serve inseguire più persone. Serve non perdere chi sta già confrontando.',
    demoLens: 'Apri una recensione, guarda la risposta e segui come quella prova può continuare nei contenuti.',
    moment: 'Dopo la consulenza, il ritiro o l’assistenza sul prodotto.',
  },
  {
    id: 'wellness-spa',
    bioHeadline: 'Il trattamento finisce. La fiducia che ha creato può restare visibile.',
    bioBody: 'Guarda come inserire la richiesta nel momento giusto e dare un seguito alle parole del cliente senza spezzare l’esperienza.',
    bioCta: 'Guarda la demo benessere',
    landingHeadline: 'Il trattamento finisce. Il ricordo può continuare a lavorare.',
    landingLede: 'Trovatemi inserisce la richiesta quando l’esperienza è ancora precisa, senza trasformare il saluto finale in una pressione commerciale.',
    sceneTitle: 'Il momento giusto non è tre giorni dopo.',
    sceneBody: 'Dopo il trattamento il cliente sa esattamente cosa ha apprezzato. Quando la richiesta arriva troppo tardi, quella precisione si perde insieme alla voglia di scrivere.',
    objection: 'Non devi chiedere recensioni a voce a ogni cliente. Devi rendere naturale il gesto quando ha senso.',
    demoLens: 'Guarda richieste post-appuntamento, recensioni legate al servizio e risposte coerenti con il tono dell’attività.',
    moment: 'Dopo il trattamento, quando l’esperienza è ancora precisa e personale.',
  },
  {
    id: 'sunny-cafe',
    bioHeadline: 'Il cliente dice «tutto perfetto». Poi esce e se ne dimentica.',
    bioBody: 'Guarda come QR, NFC e richieste semplici trasformano quel momento al bancone in una prova che resta online.',
    bioCta: 'Guarda la demo bar',
    landingHeadline: '«Certo, la faccio dopo.» È qui che perdi la recensione.',
    landingLede: 'Ogni giorno servi clienti soddisfatti che tornano alla propria giornata. Trovatemi rende semplice lasciare una prova mentre l’esperienza è ancora davanti a loro.',
    sceneTitle: 'Il momento migliore è ancora al bancone.',
    sceneBody: 'Il cliente ha appena finito, ti ringrazia e prende il telefono per pagare. QR e NFC entrano lì: non in un messaggio dimenticato una settimana dopo.',
    objection: 'Non servono clienti nuovi per avere più prove. Prima bisogna non perdere quelle prodotte dai clienti che hai già.',
    demoLens: 'Segui una richiesta, apri la recensione e guarda come la stessa voce può diventare risposta e contenuto.',
    moment: 'Al tavolo, al bancone o subito dopo il pagamento.',
  },
  {
    id: 'fitness-club',
    bioHeadline: 'I risultati degli iscritti si vedono in palestra. Fuori, spesso no.',
    bioBody: 'Guarda come raccogliere esperienze legate a trainer, corsi e percorsi e renderle utili a chi sta confrontando le palestre.',
    bioCta: 'Guarda la demo fitness',
    landingHeadline: 'I risultati degli iscritti sono reali. Online, però, spesso non si vedono.',
    landingLede: 'Le prove migliori emergono dopo una milestone, una lezione riuscita o un confronto con il trainer. Trovatemi aiuta a raccoglierle quando hanno ancora un significato preciso.',
    sceneTitle: 'La recensione nasce in una milestone, non in una campagna generica.',
    sceneBody: 'Un iscritto rinnova, raggiunge un risultato o finalmente si sente seguito. È quello il momento in cui può raccontare staff, metodo e ambiente.',
    objection: 'Non devi trasformare ogni allenamento in marketing. Devi riconoscere pochi momenti giusti e renderli facili da usare.',
    demoLens: 'Cerca feedback su trainer, corsi e struttura; poi guarda come vengono organizzati risposta e contenuti.',
    moment: 'Dopo una milestone, una lezione o un confronto con il trainer.',
  },
  {
    id: 'grand-hotel-riviera',
    bioHeadline: 'L’ospite vive decine di momenti. Online devono raccontare la stessa qualità.',
    bioBody: 'Guarda come richieste, recensioni, risposte e contenuti possono restare leggibili anche quando l’esperienza attraversa più servizi.',
    bioCta: 'Guarda la demo hotel',
    landingHeadline: 'Ogni soggiorno lascia un ricordo. Il problema è farlo arrivare online.',
    landingLede: 'Check-in, camera, colazione, ristorante, spa e assistenza producono impressioni diverse. Trovatemi aiuta a raccoglierle e mantenerle leggibili nello stesso processo.',
    sceneTitle: 'Il check-out non è l’unico momento che conta.',
    sceneBody: 'L’ospite può essere soddisfatto del soggiorno e avere parole precise su un solo servizio. La richiesta deve rispettare il viaggio e il contesto, non ridurli a un messaggio generico.',
    objection: 'Non basta rispondere su una sola piattaforma. Serve una regia che mantenga coerenti fonti, temi e responsabilità.',
    demoLens: 'Confronta fonti e temi, segui la richiesta post-soggiorno e guarda gli output costruiti dalla voce degli ospiti.',
    moment: 'Dopo il check-out oppure dopo un servizio preciso del soggiorno.',
  },
];

export const getVerticalMessaging = (id: string) => verticalMessaging.find((item) => item.id === id);
