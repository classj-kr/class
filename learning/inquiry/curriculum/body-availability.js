/* Topic availability follows the school curriculum, not the presence of a simplified paragraph. */
(function () {
    'use strict';
    const levels = ['elementary', 'middle', 'high'];
    const topics = {
        nervous: ['middle', 'high'],
        homeostasis: ['middle', 'high'],
        immune: ['middle', 'high']
    };
    const elementaryNames = {
        digestion: '소화기관', circulation: '순환기관', respiration: '호흡기관',
        excretion: '배설기관', skeleton: '뼈와 근육'
    };
    function supports(topic, level) {
        return (topics[topic] || levels).includes(level);
    }
    window.BodyAvailability = { supports };
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.at(-1) === 'index.html') parts.pop();
    const topic = parts.at(-1);
    const isHub = topic === 'human-body';
    function route(level) {
        if (!isHub && !supports(topic, level)) {
            document.documentElement.hidden = true;
            const catalog = new URL('../', location.href);
            catalog.searchParams.set('school', level);
            location.replace(catalog.href);
            return false;
        }
        return true;
    }
    const initial = new URLSearchParams(location.search).get('school') || 'middle';
    if (!route(initial)) return;
    function init() {
        const school = window.SchoolLevel;
        if (!school) return;
        if (isHub) school.mount(document.querySelector('.hub-school-level'));
        function update(level) {
            if (!route(level)) return;
            if (isHub) document.querySelectorAll('.hub-card').forEach(card => {
                const destination = new URL(card.getAttribute('href'), location.href);
                const cardTopic = destination.pathname.split('/').filter(Boolean).at(-1);
                card.hidden = !supports(cardTopic, level);
                const title = card.querySelector('.card-title');
                if (title) {
                    if (!title.dataset.fullTitle) title.dataset.fullTitle = title.textContent;
                    title.textContent = level === 'elementary' && elementaryNames[cardTopic]
                        ? elementaryNames[cardTopic] : title.dataset.fullTitle;
                }
                destination.searchParams.set('school', level);
                card.href = destination.href;
            });
        }
        school.subscribe(update);
        update(school.value);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
