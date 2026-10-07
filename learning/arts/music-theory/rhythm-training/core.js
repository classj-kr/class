(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.RhythmTrainer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const LEVELS = ['기본 박자', '쉼표 섞기', '8분음표', '16분음표'];
    const VALUES = { h: 2, q: 1, e: .5, s: .25 };
    const PATTERNS = [
        [['h', 'h'], ['q', 'q', 'q', 'q'], ['h', 'q', 'q'], ['q', 'q', 'h']],
        [['q', 'rq', 'q', 'q'], ['rq', 'q', 'h'], ['q', 'q', 'rq', 'q'], ['h', 'rq', 'q']],
        [['q', 'e', 'e', 'q', 'q'], ['e', 'e', 'q', 'rq', 'q'], ['q', 'q', 'e', 'e', 'q'], ['e', 'e', 'e', 'e', 'q', 'q']],
        [['q', 's', 's', 's', 's', 'q', 'q'], ['e', 's', 's', 'q', 'e', 'e', 'q'], ['q', 'e', 'e', 's', 's', 'e', 'q'], ['rq', 'q', 's', 's', 's', 's', 'q']]
    ];
    function settings(input = {}) {
        const level = Number(input.level), bpm = Number(input.bpm);
        return { level: Number.isInteger(level) && level >= 0 && level < 4 ? level : 1,
            bpm: Number.isFinite(bpm) ? Math.max(70, Math.min(140, Math.round(bpm / 5) * 5)) : 100 };
    }
    function chart(input, seed = 1) {
        const config = settings(input);
        let state = Number(seed) >>> 0;
        const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
        const pool = PATTERNS[config.level];
        const bars = Array.from({ length: 8 }, () => pool[Math.floor(random() * pool.length)].map(token => ({
            v: token.replace('r', ''), rest: token.startsWith('r')
        })));
        const targets = [];
        bars.forEach((bar, index) => {
            let beat = index * 4;
            bar.forEach(note => { if (!note.rest) targets.push(beat * 60 / config.bpm); beat += VALUES[note.v]; });
        });
        return { ...config, seed: Number(seed) >>> 0, bars, targets, duration: 32 * 60 / config.bpm };
    }
    // One onset is one tap. Release times and key-hold duration never enter scoring.
    const hitWindow = chart => Math.min(.14, 60 / chart.bpm * .22);
    function judge(chart, taps) {
        const window = hitWindow(chart);
        const marks = chart.targets.map(time => ({ time, hit: false, error: null, points: 0 }));
        let extras = 0;
        const clean = taps.filter(Number.isFinite).slice().sort((a, b) => a - b);
        for (const tap of clean) {
            let best = -1, distance = window + .000001;
            marks.forEach((mark, index) => {
                const delta = Math.abs(tap - mark.time);
                if (!mark.hit && delta <= distance) { best = index; distance = delta; }
            });
            if (best < 0) { extras++; continue; }
            const mark = marks[best];
            mark.hit = true;
            mark.error = tap - mark.time;
            mark.points = distance <= .05 ? 1 : 0;
        }
        const hits = marks.filter(mark => mark.hit);
        const accuracy = Math.max(0, Math.round(1000 * (hits.reduce((sum, m) => sum + m.points, 0) - extras * .5) / marks.length) / 10);
        return { accuracy, perfect: hits.filter(m => m.points === 1).length, hits: hits.length,
            misses: marks.length - hits.length, extras, wrong: extras + hits.filter(m => m.points === 0).length, marks,
            errorMs: hits.length ? Math.round(hits.reduce((sum, m) => sum + Math.abs(m.error), 0) * 1000 / hits.length) : null };
    }
    return { LEVELS, VALUES, settings, chart, judge, hitWindow };
});
