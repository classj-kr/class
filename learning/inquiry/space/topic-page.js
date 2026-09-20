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
        const identity = document.createElement('div');
        identity.className = 'topic-identity';
        const back = document.createElement('a');
        back.href = '../';
        back.className = 'topic-back';
        back.textContent = '← 우주';
        const title = document.createElement('h1');
        title.textContent = topic.title;
        identity.append(back, title);
        header.prepend(identity);
        header.removeAttribute('style');
        const main = document.querySelector('.view-container');
        const concepts = document.createElement('section');
        concepts.id = 'tab-topic-concepts';
        concepts.className = 'tab-pane topic-concepts';
        const intro = document.createElement('div');
        intro.className = 'topic-concept-grid';
        topic.concepts.forEach(([heading, text]) => {
            const article = document.createElement('article');
            const h2 = document.createElement('h2');
            h2.textContent = heading;
            const p = document.createElement('p');
            p.textContent = text;
            article.append(h2, p);
            intro.append(article);
        });
        concepts.append(intro);
        main.append(concepts);
        const calc = document.querySelector('#tab-calc .calc-container');
        if (calc && topic.extras === 'star-table') {
            const table = calc.lastElementChild;
            table.classList.add('topic-table-wrap');
            concepts.append(table);
        }
        if (calc && topic.mode === 'stellar') calc.lastElementChild.hidden = true;
        if (topic.extras === 'seasons') {
            const cards = document.querySelector('#tab-cards > div');
            if (cards && cards.firstElementChild) concepts.append(cards.firstElementChild);
        }
        if (topic.extras === 'moon') {
            const knowledge = document.querySelector('#tab-knowledge');
            if (knowledge && knowledge.firstElementChild) concepts.append(knowledge.firstElementChild);
        }
        if (topic.extras === 'eclipses') {
            const diagrams = document.createElement('div');
            diagrams.className = 'topic-eclipse-diagrams';
            // Positions show alignment only; sizes and distances are schematic.
            diagrams.innerHTML = '<figure><figcaption>일식 · 태양–달–지구</figcaption><div class="eclipse-alignment"><span class="eclipse-sun">태양</span><span class="eclipse-moon">달</span><span class="eclipse-earth">지구</span></div><p>달의 그림자가 닿는 지역에서 태양이 가려집니다.</p></figure>' +
                '<figure><figcaption>월식 · 태양–지구–달</figcaption><div class="eclipse-alignment"><span class="eclipse-sun">태양</span><span class="eclipse-earth">지구</span><span class="eclipse-moon">달</span></div><p>달이 지구의 그림자 안으로 들어갑니다.</p></figure>';
            concepts.append(diagrams);
        }
        if (topic.app === 'solar-system') {
            const atlas = document.getElementById('tab-atlas');
            Array.from(atlas.children).forEach(child => concepts.append(child));
        }
        const related = document.createElement('nav');
        related.className = 'topic-related';
        related.setAttribute('aria-label', '관련 주제');
        const relatedLabel = document.createElement('strong');
        relatedLabel.textContent = '관련 주제';
        related.append(relatedLabel);
        window.SpaceTopics.topics.filter(other => other.group === topic.group && other.id !== topic.id).forEach(other => {
            const a = document.createElement('a');
            a.href = '../' + window.SpaceTopics.href(other);
            a.textContent = other.title;
            related.append(a);
        });
        concepts.append(related);
        const observation = document.getElementById(topic.mode === 'stellar' ? 'tab-calc' : 'tab-sim');
        const hasObservation = topic.app === 'solar-system' || Boolean(topic.mode);
        if (hasObservation && topic.observe) {
            const guide = document.createElement('p');
            guide.className = 'topic-observation-guide';
            guide.textContent = topic.observe;
            observation.prepend(guide);
        }
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
        // Keep viewport accounting correct after all application initialization.
        const sizeHeader = () => document.documentElement.style.setProperty('--space-header-height', header.offsetHeight + 'px');
        sizeHeader();
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(sizeHeader).observe(header);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
