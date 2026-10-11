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
        // Reading opens over the study view without reducing the model's width.
        const study = document.createElement('section');
        study.id = 'topic-study';
        study.className = 'tab-pane topic-study-layout';
        study.setAttribute('aria-label', topic.title);
        study.dataset.hasObservation = String(hasObservation);
        concepts.classList.add('topic-reading-panel');
        concepts.classList.add('active');
        concepts.style.display = 'block';
        if (hasObservation) {
            observation.classList.add('topic-observation-panel', 'active');
            observation.style.display = 'block';
            study.append(observation);
        }
        let explanation, explainButton;
        if (hasObservation) {
            explanation = document.createElement('dialog');
            explanation.id = 'topic-explanation';
            explanation.className = 'topic-explanation';
            explanation.setAttribute('aria-labelledby', 'topic-explanation-title');
            const dialogHeader = document.createElement('div');
            dialogHeader.className = 'topic-explanation-header';
            const dialogTitle = document.createElement('h2');
            dialogTitle.id = 'topic-explanation-title';
            dialogTitle.textContent = topic.title;
            const dialogSubject = document.createElement('span');
            dialogSubject.className = 'topic-explanation-subject';
            const dialogHeading = document.createElement('div');
            dialogHeading.className = 'topic-explanation-heading';
            dialogHeading.append(dialogTitle, dialogSubject);
            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'topic-explanation-close';
            closeButton.textContent = '닫기 ×';
            closeButton.setAttribute('aria-label', '설명 닫기');
            dialogHeader.append(dialogHeading, closeButton);
            const reading = document.createElement('div');
            reading.className = 'topic-explanation-body';
            reading.append(concepts);
            explanation.append(dialogHeader, reading);
            document.body.append(explanation);
            explainButton = document.createElement('button');
            explainButton.type = 'button';
            explainButton.className = 'topic-explain-button';
            explainButton.textContent = '설명 보기';
            explainButton.setAttribute('aria-haspopup', 'dialog');
            explainButton.setAttribute('aria-controls', explanation.id);
            explainButton.setAttribute('aria-expanded', 'false');
            header.append(explainButton);
            explainButton.addEventListener('click', () => {
                explanation.showModal();
                explainButton.setAttribute('aria-expanded', 'true');
                document.body.classList.add('topic-explanation-open');
                closeButton.focus();
                window.dispatchEvent(new Event('resize'));
            });
            closeButton.addEventListener('click', () => explanation.close());
            explanation.addEventListener('click', event => {
                if (event.target !== explanation) return;
                const box = explanation.getBoundingClientRect();
                if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) explanation.close();
            });
            explanation.addEventListener('close', () => {
                explainButton.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('topic-explanation-open');
                explainButton.focus();
            });
        } else study.append(concepts);
        main.append(study);
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
        const buttons = Array.from(nav.querySelectorAll('.nav-tab')).filter(button => {
            button.dataset.topicView = button.dataset.tab === 'sim' ? 'observe' : button.dataset.tab === 'quiz' ? 'quiz' : 'concept';
            if (button.dataset.topicView === 'concept') { button.remove(); return false; }
            if (button.dataset.topicView === 'observe' && !hasObservation) button.textContent = '탐구';
            return true;
        });
        function show(view, save) {
            if (view === 'concept') view = 'observe';
            const selected = view === 'quiz' ? document.getElementById('tab-quiz') : study;
            if (explanation?.open) explanation.close();
            if (explainButton) explainButton.hidden = view === 'quiz';
            main.querySelectorAll(':scope > .tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane === selected);
                pane.style.display = pane === selected ? (pane === study ? 'grid' : 'block') : 'none';
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
            show(['observe', 'concept', 'quiz'].includes(hash) ? hash : 'observe', false);
        }
        window.addEventListener('hashchange', fromHash);
        fromHash();
        // Navigation must not cover dates, observation status or model controls.
        document.documentElement.style.setProperty('--space-header-height', '0px');
        window.dispatchEvent(new Event('resize'));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
