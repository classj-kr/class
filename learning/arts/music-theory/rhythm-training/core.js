(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.RhythmTrainer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const LEVELS = ['기본 박자', '쉼표 섞기', '8분음표', '16분음표', '당김음·긴 음표', '점음표', '셋잇단음표', '모두 섞기'];
    const VALUES = { w: 4, h: 2, hd: 3, q: 1, qd: 1.5, e: .5, ed: .75, s: .25, te: 1 / 3, tq: 2 / 3 };
    // One-beat figures from the reference: eighths, all sixteenths, mixed
    // beams, dotted eighths, and figures beginning with a sixteenth rest.
    const SIXTEENTH_BEATS = [
        ['e', 'e'], ['s', 's', 's', 's'],
        ['e', 's', 's'], ['s', 's', 'e'], ['s', 'e', 's'],
        ['ed', 's'], ['s', 'ed'],
        ['rs', 's', 'e'], ['rs', 's', 's', 's']
    ];
    const PATTERNS = [
        [['h', 'h'], ['q', 'q', 'q', 'q'], ['h', 'q', 'q'], ['q', 'q', 'h'], ['w'], ['hd', 'q']],
        [['q', 'rq', 'q', 'q'], ['rq', 'q', 'h'], ['q', 'q', 'rq', 'q'], ['h', 'rq', 'q'], ['e', 're', 'q', 'q', 'q'], ['re', 'e', 'q', 'q', 'q'], ['e', 'e', 're', 'e', 'h']],
        [['q', 'e', 'e', 'q', 'q'], ['e', 'e', 'q', 'rq', 'q'], ['q', 'q', 'e', 'e', 'q'], ['e', 'e', 'e', 'e', 'q', 'q']],
        [],
        [['q', 'h', 'q'], ['e', 'q', 'q', 'q', 'e'], ['e', 'h', 'qd'], ['re', 'q', 'q', 'q', 'e']],
        [['qd', 'e', 'q', 'q'], ['hd', 'q'], ['ed', 's', 'ed', 's', 'q', 'q'], ['s', 'ed', 'q', 'qd', 'e']],
        [['te', 'te', 'te', 'q', 'te', 'te', 'te', 'q'], ['q', 'te', 'te', 'te', 'h'], ['te', 'te', 'rte', 'e', 'e', 'q', 'q'], ['e', 'e', 'te', 'te', 'te', 'te', 'te', 'te', 'q']],
        []
    ];
    function shuffle(items, random) {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }
    function beatOrder(pool, count, random) {
        const order = [];
        while (order.length < count) {
            const batch = shuffle(pool.map((_, index) => index), random);
            if (order.length && batch[0] === order[order.length - 1]) {
                [batch[0], batch[1]] = [batch[1], batch[0]];
            }
            order.push(...batch.slice(0, count - order.length));
        }
        return order.map(index => pool[index]);
    }
    function settings(input = {}) {
        const level = Number(input.level), bpm = Number(input.bpm);
        return { level: Number.isInteger(level) && level >= 0 && level < LEVELS.length ? level : 1,
            bpm: Number.isFinite(bpm) ? Math.max(70, Math.min(140, Math.round(bpm / 5) * 5)) : 100 };
    }
    function chart(input, seed = 1, barCount = 8) {
        const config = settings(input);
        const count = [1, 4, 8].includes(barCount) ? barCount : 8;
        let state = Number(seed) >>> 0;
        const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
        const pool = PATTERNS[config.level];
        const figures = config.level === 3 ? SIXTEENTH_BEATS : config.level === 7
            ? [...SIXTEENTH_BEATS, ['q'], ['rq'], ['te', 'te', 'te'], ['te', 'te', 'rte']] : null;
        const order = figures ? beatOrder(figures, count * 4, random) : null;
        const patterns = order
            ? Array.from({ length: count }, (_, bar) => config.level === 7 && random() < .25
                ? PATTERNS[4][Math.floor(random() * PATTERNS[4].length)] : order.slice(bar * 4, bar * 4 + 4).flat())
            : Array.from({ length: count }, () => pool[Math.floor(random() * pool.length)]);
        const bars = patterns.map(pattern => pattern.map(token => ({
            v: token.replace('r', ''), rest: token.startsWith('r')
        })));
        return fromBars(config, bars, seed);
    }
    function fromBars(input, bars, seed = 1) {
        const config = settings(input), targets = [];
        bars.forEach((bar, index) => {
            let cells = index * 48;
            bar.forEach((note, i) => {
                if (!note.rest && !(i && bar[i - 1].tie && !bar[i - 1].rest)) targets.push(cells / 12 * 60 / config.bpm);
                cells += Math.round(VALUES[note.v] * 12);
            });
        });
        return { ...config, seed: Number(seed) >>> 0, bars, targets, duration: bars.length * 4 * 60 / config.bpm };
    }
    // One onset is one tap. Release times and key-hold duration never enter scoring.
    const hitWindow = chart => 60 / chart.bpm * .22;
    // Compare only the written attacks. Empty sixteenth subdivisions are not
    // timing targets: the boundary between two attacks is their BPM-based midpoint.
    function noteWindow(chart, index) {
        const targets = chart.targets, time = targets[index];
        const previous = index ? (time - targets[index - 1]) / 2 : Infinity;
        const next = index + 1 < targets.length ? (targets[index + 1] - time) / 2 : Infinity;
        return Math.min(hitWindow(chart), previous, next) - .000001;
    }
    function judge(chart, taps) {
        const clean = taps.filter(Number.isFinite).slice().sort((a, b) => a - b);
        const { errorSum, ...result } = match(chart, clean);
        return result;
    }
    function match(chart, clean) {
        const marks = chart.targets.map(time => ({ time, hit: false, error: null, points: 0 }));
        let extras = 0;
        for (const raw of clean) {
            const best = marks.findIndex((mark, index) => !mark.hit
                && Math.abs(raw - mark.time) <= noteWindow(chart, index));
            if (best < 0) { extras++; continue; }
            const mark = marks[best];
            mark.hit = true;
            mark.error = raw - mark.time;
            mark.points = 1;
        }
        const hits = marks.filter(mark => mark.hit);
        const errorSum = hits.reduce((sum, m) => sum + Math.abs(m.error), 0);
        const accuracy = Math.max(0, Math.round(1000 * (hits.reduce((sum, m) => sum + m.points, 0) - extras * .5) / marks.length) / 10);
        return { accuracy, perfect: hits.filter(m => m.points === 1).length, hits: hits.length,
            misses: marks.length - hits.length, extras, wrong: extras + hits.filter(m => m.points === 0).length, marks,
            errorMs: hits.length ? Math.round(errorSum * 1000 / hits.length) : null, lagMs: 0, errorSum };
    }
    return { LEVELS, VALUES, settings, chart, fromBars, judge, hitWindow, noteWindow };
});
