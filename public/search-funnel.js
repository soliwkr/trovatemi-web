import { buildLocalAnalysis } from './funnel-analysis.js';

const stageIds = ['landing', 'loading', 'results', 'decision', 'prescription'];
      const stageLabels = {
        landing: 'Cercati come ti cerca un cliente',
        loading: 'Sto costruendo il confronto',
        results: '1 · Fatti trovare',
        decision: '2 · Fatti scegliere',
        prescription: '3 · Sistemiamolo',
      };
      const progress = {
        landing: '8%',
        loading: '28%',
        results: '52%',
        decision: '76%',
        prescription: '100%',
      };

      const state = {
        businessName: '',
        category: '',
        city: '',
        business: null,
        places: [],
        analysis: null,
        demo: false,
      };

      const $ = (selector) => document.querySelector(selector);
      const searchForm = $('#searchForm');
      const searchButton = $('#searchButton');
      const candidatePanel = $('#candidatePanel');
      const candidateList = $('#candidateList');
      const searchError = $('#searchError');

      function showStage(id) {
        for (const stageId of stageIds) {
          const node = document.getElementById(stageId);
          if (node) node.hidden = stageId !== id;
        }
        document.querySelector('.app')?.setAttribute('data-stage', id);
        $('#stageLabel').textContent = stageLabels[id] || '';
        $('#progressBar').style.width = progress[id] || '8%';
        $('#restartTop').hidden = id === 'landing';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function formatRating(value) {
        return Number.isFinite(value) ? value.toFixed(1).replace('.', ',') + ' ★' : '—';
      }

      function formatReviews(value) {
        return Number.isFinite(value) ? new Intl.NumberFormat('it-IT').format(value) : '—';
      }

      function clearSearchFeedback() {
        candidatePanel.hidden = true;
        candidateList.replaceChildren();
        searchError.hidden = true;
      }

      function showError(title, message) {
        $('#searchErrorTitle').textContent = title;
        $('#searchErrorText').textContent = message;
        searchError.hidden = false;
      }

      async function fetchJson(url) {
        const response = await fetch(url, { headers: { accept: 'application/json' } });
        let body = {};
        try { body = await response.json(); } catch {}
        if (!response.ok) {
          const error = new Error(body?.error || 'request_failed');
          error.status = response.status;
          error.code = body?.error || 'request_failed';
          throw error;
        }
        return body;
      }

      function businessButton(place) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'candidate';

        const copy = document.createElement('span');
        const strong = document.createElement('strong');
        strong.textContent = place.name;
        const small = document.createElement('small');
        small.textContent = [place.category, place.address].filter(Boolean).join(' · ');
        copy.append(strong, small);

        const choose = document.createElement('b');
        choose.textContent = 'Sono io →';

        button.append(copy, choose);
        button.addEventListener('click', () => loadBusiness(place));
        return button;
      }

      async function runSearch() {
        clearSearchFeedback();

        const businessName = String($('#businessInput').value || '').trim();
        const category = String($('#categoryInput').value || '').trim();
        const city = String($('#cityInput').value || '').trim();

        if (!businessName || !category || !city) {
          showError('Manca qualcosa.', 'Inserisci nome attività, categoria e città.');
          return;
        }

        state.businessName = businessName;
        state.category = category;
        state.city = city;
        state.demo = false;

        searchButton.disabled = true;
        searchButton.textContent = 'Cerco…';

        try {
          const query = businessName + ' ' + city;
          const data = await fetchJson('/api/places/search?q=' + encodeURIComponent(query));
          const places = Array.isArray(data.places) ? data.places : [];

          if (!places.length) {
            showError('Non ti ho trovato con questa ricerca.', 'Prova con il nome esatto mostrato su Google Maps oppure aggiungi una zona più precisa.');
            return;
          }

          for (const place of places) candidateList.append(businessButton(place));
          candidatePanel.hidden = false;
          candidatePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
          if (error?.code === 'places_unconfigured') {
            showError('La ricerca live non è ancora collegata su questa preview.', 'Il funnel è pronto; manca solo il secret GOOGLE_PLACES_API_KEY nell’ambiente Cloudflare. Puoi comunque provare il percorso completo con dati demo dichiarati.');
          } else {
            showError('La ricerca live non ha risposto.', 'Puoi riprovare oppure aprire la demo per vedere il funnel completo.');
          }
        } finally {
          searchButton.disabled = false;
          searchButton.textContent = 'Cercami';
        }
      }

      async function loadBusiness(place) {
        state.demo = false;
        state.business = place;
        $('#loadingQuery').textContent = 'Cerco “' + state.category + ' ' + state.city + '” e confronto ' + place.name + ' con le alternative restituite.';
        showStage('loading');

        try {
          const detailsUrl = '/api/places/details?id=' + encodeURIComponent(place.id);
          const contextQuery = state.category + ' ' + state.city;
          const contextUrl = '/api/places/context?q=' + encodeURIComponent(contextQuery);

          const [details, context] = await Promise.all([
            fetchJson(detailsUrl),
            fetchJson(contextUrl),
            new Promise((resolve) => setTimeout(resolve, 520)),
          ]);

          state.business = details.business || place;
          state.places = Array.isArray(context.places) ? context.places : [];
          renderAnalysis();
          showStage('results');
        } catch (error) {
          showStage('landing');
          if (error?.code === 'places_unconfigured') {
            showError('La ricerca live non è ancora configurata.', 'Aggiungi GOOGLE_PLACES_API_KEY a Cloudflare per usare dati reali. La demo qui sotto usa dati fittizi e lo dichiara chiaramente.');
          } else {
            showError('Non sono riuscito a costruire il confronto.', 'La ricerca iniziale ha funzionato, ma il contesto locale non è arrivato. Riprova o usa la demo.');
          }
        }
      }

      function setDemoBadges() {
        for (const id of ['demoBadgeResults', 'demoBadgeDecision', 'demoBadgePrescription']) {
          const node = document.getElementById(id);
          if (node) node.hidden = !state.demo;
        }
      }

      function runDemo() {
        clearSearchFeedback();
        state.demo = true;
        state.businessName = 'Studio Aurora';
        state.category = 'parrucchiere';
        state.city = 'Formia';
        state.business = {
          id: 'demo-you',
          name: 'Studio Aurora',
          address: 'Formia LT',
          category: 'Parrucchiere',
          rating: 4.3,
          reviews: 31,
        };
        state.places = [
          { id: 'demo-1', name: 'Linea 21', address: 'Formia LT', category: 'Parrucchiere', rating: 4.8, reviews: 326 },
          { id: 'demo-2', name: 'Atelier 9', address: 'Formia LT', category: 'Parrucchiere', rating: 4.7, reviews: 184 },
          { id: 'demo-3', name: 'Nodo Studio', address: 'Formia LT', category: 'Parrucchiere', rating: 4.6, reviews: 112 },
          { id: 'demo-4', name: 'Forma Hair', address: 'Formia LT', category: 'Parrucchiere', rating: 4.6, reviews: 96 },
          { id: 'demo-5', name: 'Spazio 12', address: 'Formia LT', category: 'Parrucchiere', rating: 4.5, reviews: 77 },
          state.business,
        ];

        $('#businessInput').value = state.businessName;
        $('#categoryInput').value = state.category;
        $('#cityInput').value = state.city;
        $('#loadingQuery').textContent = 'Demo: cerco “parrucchiere Formia” e confronto Studio Aurora con attività fittizie.';
        showStage('loading');
        setTimeout(() => {
          renderAnalysis();
          showStage('results');
        }, 520);
      }

      function renderLocalResults() {
        const container = $('#localResults');
        container.replaceChildren();

        const analysis = state.analysis;
        const target = state.business;
        const firstFive = state.places.slice(0, 5);
        const targetInFirstFive = firstFive.some((place) => place.id === target.id);
        const shown = targetInFirstFive ? firstFive : [...firstFive, target];

        shown.forEach((place, index) => {
          const isTarget = place.id === target.id;
          const actualIndex = state.places.findIndex((item) => item.id === place.id);
          const rank = actualIndex >= 0 ? actualIndex + 1 : null;

          const item = document.createElement('article');
          item.className = 'local-item' + (isTarget ? ' you' : '') + (isTarget && !targetInFirstFive ? ' outside' : '');

          const copy = document.createElement('div');
          const rankNode = document.createElement('div');
          rankNode.className = 'rank';
          rankNode.textContent = isTarget
            ? 'LA TUA ATTIVITÀ · ' + (rank ? 'POSIZIONE ' + rank : 'FUORI DAL GRUPPO RESTITUITO')
            : 'RISULTATO LOCALE · ' + (rank || index + 1);

          const name = document.createElement('div');
          name.className = 'business-name';
          name.textContent = place.name;

          const rating = document.createElement('div');
          rating.className = 'rating';
          rating.textContent = formatRating(place.rating) + ' · ' + formatReviews(place.reviews) + ' recensioni';

          const address = document.createElement('div');
          address.className = 'address';
          address.textContent = [place.category, place.address].filter(Boolean).join(' · ');

          copy.append(rankNode, name, rating, address);

          const thumb = document.createElement('div');
          thumb.className = 'thumb';
          thumb.setAttribute('aria-hidden', 'true');

          item.append(copy, thumb);
          container.append(item);
        });

        $('#verdict').textContent = analysis.verdict;
        $('#verdictDetail').textContent = analysis.verdictDetail;
        $('#contextQuery').textContent = state.category + ' ' + state.city;
      }

      function renderDecision() {
        const leader = state.analysis.leader;
        const business = state.business;

        $('#businessNameDecision').textContent = business.name;
        $('#businessRating').textContent = formatRating(business.rating);
        $('#businessReviews').textContent = formatReviews(business.reviews);
        $('#businessRank').textContent = state.analysis.rank ? '#' + state.analysis.rank : 'oltre il gruppo';

        if (leader) {
          $('#leaderName').textContent = leader.name;
          $('#leaderRating').textContent = formatRating(leader.rating);
          $('#leaderReviews').textContent = formatReviews(leader.reviews);
          $('#leaderCategory').textContent = leader.category || 'Attività locale';
        } else {
          $('#leaderName').textContent = 'Nessuna alternativa confrontabile';
          $('#leaderRating').textContent = '—';
          $('#leaderReviews').textContent = '—';
          $('#leaderCategory').textContent = '—';
        }
      }

      function renderIssues() {
        const list = $('#issueList');
        list.replaceChildren();

        state.analysis.issues.forEach((issue, index) => {
          const row = document.createElement('article');
          row.className = 'issue ' + issue.tone;

          const number = document.createElement('div');
          number.className = 'issue-index';
          number.textContent = String(index + 1);

          const copy = document.createElement('div');
          const label = document.createElement('small');
          label.textContent = issue.label;
          const title = document.createElement('h3');
          title.textContent = issue.title;
          const detail = document.createElement('p');
          detail.textContent = issue.detail;
          copy.append(label, title, detail);

          const priority = document.createElement('span');
          priority.className = 'priority';
          priority.textContent = issue.priority;

          row.append(number, copy, priority);
          list.append(row);
        });
      }

      function renderAnalysis() {
        state.analysis = buildLocalAnalysis(state.business, state.places);
        setDemoBadges();
        renderLocalResults();
        renderDecision();
        renderIssues();
      }

      function restart() {
        state.business = null;
        state.places = [];
        state.analysis = null;
        state.demo = false;
        clearSearchFeedback();
        showStage('landing');
        $('#businessInput').focus();
      }

      searchForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        runSearch();
      });
      $('#demoButton')?.addEventListener('click', runDemo);
      $('#errorDemoButton')?.addEventListener('click', runDemo);
      $('#toDecision')?.addEventListener('click', () => showStage('decision'));
      $('#backToResults')?.addEventListener('click', () => showStage('results'));
      $('#toPrescription')?.addEventListener('click', () => showStage('prescription'));
      $('#restartTop')?.addEventListener('click', restart);
      $('#restartBottom')?.addEventListener('click', restart);
