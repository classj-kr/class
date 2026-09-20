(function () {
    'use strict';
    function start() {
        const topic = window.SpaceTopics.current(window.location);
        if (!topic) return;
        document.body.classList.add('space-topic-page');
        document.body.dataset.spaceTopic = topic.id;
        document.title = topic.title + ' · 우주';
        const header = document.querySelector('.top-header');
        const nav = header.querySelector('.nav-tabs');
        const back = document.createElement('a');
        back.href = '../';
        back.className = 'topic-back';
        back.textContent = '←';
        back.setAttribute('aria-label', '우주 메뉴로 돌아가기');
        document.body.prepend(back);
        header.removeAttribute('style');
        const main = document.querySelector('.view-container');
        const concepts = document.createElement('section');
        concepts.id = 'tab-topic-concepts';
        concepts.className = 'tab-pane topic-concepts';
        const intro = document.createElement('div');
        intro.className = 'topic-concept-grid';
        function conceptCard([heading, text], parent) {
            const article = document.createElement('article');
            const h2 = document.createElement('h2');
            h2.textContent = heading;
            const p = document.createElement('p');
            p.textContent = text;
            article.append(h2, p);
            parent.append(article);
        }
        if (topic.conceptSections) {
            intro.classList.add('topic-concept-sections');
            topic.conceptSections.forEach(section => {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = section.title;
                const content = document.createElement('div');
                content.className = 'topic-concept-section-content';
                section.concepts.forEach(concept => conceptCard(concept, content));
                details.append(summary, content);
                intro.append(details);
            });
        } else topic.concepts.forEach(concept => conceptCard(concept, intro));
        concepts.append(intro);
        if (topic.id === 'star-properties' && window.StarProperties) window.StarProperties.mount(concepts);
        if (topic.id === 'stellar-life' && window.StellarStudy) window.StellarStudy.mount(concepts);
        main.append(concepts);
        const calc = document.querySelector('#tab-calc .calc-container');
        if (calc && topic.extras === 'star-table' && topic.id !== 'star-properties') {
            const table = calc.lastElementChild;
            table.classList.add('topic-table-wrap');
            concepts.append(table);
        }

        if (topic.extras === 'seasons') {
            const cards = document.querySelector('#tab-cards > div');
            if (cards && cards.firstElementChild) concepts.append(cards.firstElementChild);
        }
        if (topic.extras === 'moon') {
            const knowledge = document.querySelector('#tab-knowledge');
            if (knowledge && knowledge.firstElementChild) concepts.append(knowledge.firstElementChild);
        }
        if (topic.app === 'solar-system') {
            const atlas = document.getElementById('tab-atlas');
            Array.from(atlas.children).forEach(child => concepts.append(child));
        }
        let observation = document.getElementById('tab-sim');
        if (topic.mode === 'stellar') {
            observation = document.createElement('section');
            observation.id = 'tab-stellar';
            observation.className = 'tab-pane';
            main.append(observation);
            window.StellarLab.mount(observation);
        }
        if (topic.mode === 'eclipse') {
            observation = document.createElement('section');
            observation.id = 'tab-eclipse';
            observation.className = 'tab-pane';
            main.append(observation);
            window.EclipseLab.mount(observation);
        }
        const hasObservation = topic.app === 'solar-system' || Boolean(topic.mode);
        if (topic.app === 'constellations' && topic.mode && topic.mode !== 'stellar') {
            const button = document.querySelector('[data-sim-mode="' + topic.mode + '"]');
            if (button) button.click();
        }
        if (topic.app === 'earth-moon' && topic.mode) {
            const button = document.querySelector('[data-em-simulator="' + topic.mode + '"]');
            if (button) button.click();
        }
        // Each URL owns a single subject; the old cross-subject mode selectors are hidden.
        ['simModeSwitcher'].forEach(id => { const node = document.getElementById(id); if (node) node.hidden = true; });
        const switcher = document.querySelector('.em-simulation-toolbar');
        if (switcher) switcher.hidden = true;
        const buttons = Array.from(nav.querySelectorAll('.nav-tab'));
        buttons.forEach(button => {
            button.dataset.topicView = button.dataset.tab === 'sim' ? 'observe' : button.dataset.tab === 'quiz' ? 'quiz' : 'concept';
            if (!hasObservation && button.dataset.topicView === 'observe') button.hidden = true;
        });
        function show(view, save) {
            if (!hasObservation && view === 'observe') view = 'concept';
            const selected = view === 'quiz' ? document.getElementById('tab-quiz') : view === 'concept' ? concepts : observation;
            main.querySelectorAll(':scope > .tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane === selected);
                pane.style.display = pane === selected ? 'block' : 'none';
            });
            buttons.forEach(button => {
                const active = button.dataset.topicView === view;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });
            document.body.dataset.topicView = view;
            if (save) history.replaceState(null, '', '#'+view);
            window.dispatchEvent(new Event('resize'));
        }
        nav.addEventListener('click', event => {
            const button = event.target.closest('[data-topic-view]');
            if (!button) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            show(button.dataset.topicView, true);
        }, true);
        function fromHash() {
            const hash = location.hash.slice(1);
            show(['observe', 'concept', 'quiz'].includes(hash) ? hash : hasObservation ? 'observe' : 'concept', false);
        }
        window.addEventListener('hashchange', fromHash);
        fromHash();
        // Floating controls do not reserve a title row above the content.
        document.documentElement.style.setProperty('--space-header-height', '0px');
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
