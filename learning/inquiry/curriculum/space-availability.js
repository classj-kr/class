/* 2022 과학 [4과13], [6과12~13], [9과07], [9과15], [12지구03], [12고지03]. */
(function () {
    'use strict';
    const restricted = {
        'celestial-sphere':['high'], 'stellar-life':['high'],
        'star-properties':['middle','high'], 'eclipses':['middle','high']
    };
    const supports = (topic, level) => !restricted[topic] || restricted[topic].includes(level);
    window.SpaceAvailability = {supports};
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    const initial = params.get('school') || 'middle';
    function route(level) {
        if (topic && !supports(topic, level)) {
            document.documentElement.hidden = true;
            location.replace(new URL('../?school=' + level, location.href));
            return false;
        }
        return true;
    }
    if (!route(initial)) return;
    function init() {
        const S = window.SchoolLevel;
        if (!S) return;
        const hub = document.querySelector('.hub-container');
        if (hub) {
            const controls = document.createElement('nav');
            controls.className = 'space-school-picker';
            controls.setAttribute('aria-label','학교급 선택');
            hub.prepend(controls);
            S.mount(controls);
        }
        function update(level) {
            if (!route(level)) return;
            document.querySelectorAll('.hub-card').forEach(card => {
                const url = new URL(card.href, location.href);
                card.hidden = !supports(url.searchParams.get('topic'), level);
                url.searchParams.set('school',level); card.href=url.href;
                if (url.searchParams.get('topic') === 'zodiac') card.querySelector('strong').textContent = level === 'elementary' ? '계절별 별자리' : '황도 12궁과 계절별 별자리';
            });
        }
        S.subscribe(update); update(S.value);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
