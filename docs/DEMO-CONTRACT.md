# Contratto demo backend Trovatemi

Ultima verifica: 8 agosto 2026

## Scopo

Le demo V13 incorporano il playground reale disponibile su `app.trovatemi.it/try/`. I dati sono dimostrativi e generati dal prodotto; nessun tenant rappresenta un cliente Trovatemi reale.

## URL

```text
https://app.trovatemi.it/try/#/home?category=luxury-watches
https://app.trovatemi.it/try/#/home?category=wellness-spa
https://app.trovatemi.it/try/#/home?category=sunny-cafe
https://app.trovatemi.it/try/#/home?category=fitness-club
https://app.trovatemi.it/try/#/home?category=grand-hotel-riviera
```

Il fragment `#/home?...` è necessario: il playground usa un router client-side basato su hash.

## Verifica HTTP

Alla data indicata:

- risposta `200`;
- nessun header `X-Frame-Options`;
- nessuna CSP `frame-ancestors`;
- shell HTML servita da Cloudflare;
- bundle JavaScript del playground circa 4,9 MB non compresso;
- foglio Google Fonts richiesto dalla shell del playground.

Conseguenze:

1. L'iframe è tecnicamente consentito oggi.
2. Nelle pagine editoriali va caricato soltanto dopo l'azione del visitatore.
3. La demo autonoma può caricarlo immediatamente perché il visitatore ha scelto esplicitamente quella superficie.
4. Prima della promozione in produzione vanno ricontrollati header e dipendenze.

## Sandbox

Permessi iniziali:

```text
allow-scripts
allow-same-origin
allow-forms
allow-popups
allow-popups-to-escape-sandbox
allow-downloads
allow-modals
```

Non viene concesso `allow-top-navigation`. Il link per l'apertura completa usa `target="_blank"` nella pagina genitore.

## Codice embed diretto

```html
<iframe
  src="https://app.trovatemi.it/try/#/home?category=sunny-cafe"
  title="Demo Trovatemi per bar e caffetterie"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
  allow="clipboard-read; clipboard-write; fullscreen"
  style="width:100%;min-height:760px;border:0;border-radius:24px"
></iframe>
```

Il valore `category` e il titolo devono cambiare insieme.

## Stati obbligatori del componente

- cover prima del caricamento;
- loading;
- iframe attivo;
- fallback con link esterno;
- disclosure dati dimostrativi;
- pulsante fullscreen/apertura in nuova scheda;
- copia del codice embed;
- feedback accessibile dopo la copia.

## Limiti noti

- Il genitore non può leggere il contenuto interno dell'iframe per la same-origin policy.
- Non è possibile adattare automaticamente l'altezza al contenuto senza supporto `postMessage` dal playground.
- La navigazione interna resta confinata nell'iframe.
- Il contenuto demo può cambiare quando viene ridistribuito il backend.
- L'assenza attuale di header anti-iframe non è una garanzia futura.

## Regola editoriale

Usare “pannello demo reale” o “ambiente dimostrativo”. Non usare “account cliente”, “risultati ottenuti” o formule che facciano sembrare reali attività, recensioni, ranking o numeri mostrati nel playground.

