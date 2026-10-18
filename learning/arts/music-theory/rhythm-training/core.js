(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.RhythmTrainer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const LEVELS = ['기본 박자', '쉼표 섞기', '8분음표', '16분음표'];
    const VALUES = { h: 2, q: 1, e: .5, ed: .75, s: .25 };
    // One-beat figures from the reference: eighths, all sixteenths, mixed
    // beams, dotted eighths, and figures beginning with a sixteenth rest.
    const SIXTEENTH_BEATS = [
        ['e', 'e'], ['s', 's', 's', 's'],
        ['e', 's', 's'], ['s', 's', 'e'], ['s', 'e', 's'],
        ['ed', 's'], ['s', 'ed'],
        ['rs', 's', 'e'], ['rs', 's', 's', 's']
    ];
    const PATTERNS = [
        [['h', 'h'], ['q', 'q', 'q', 'q'], ['h', 'q', 'q'], ['q', 'q', 'h']],
        [['q', 'rq', 'q', 'q'], ['rq', 'q', 'h'], ['q', 'q', 'rq', 'q'], ['h', 'rq', 'q']],
        [['q', 'e', 'e', 'q', 'q'], ['e', 'e', 'q', 'rq', 'q'], ['q', 'q', 'e', 'e', 'q'], ['e', 'e', 'e', 'e', 'q', 'q']],
        []
    ];
    function shuffle(items, random) {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }
    function sixteenthBeats(random) {
        const order = [];
        while (order.length < 32) {
            const batch = shuffle(SIXTEENTH_BEATS.map((_, index) => index), random);
            if (order.length && batch[0] === order[order.length - 1]) {
                [batch[0], batch[1]] = [batch[1], batch[0]];
            }
            order.push(...batch.slice(0, 32 - order.length));
        }
        return order.map(index => SIXTEENTH_BEATS[index]);
    }
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
        const sixteenthOrder = config.level === 3 ? sixteenthBeats(random) : null;
        const patterns = config.level === 3
            ? Array.from({ length: 8 }, (_, bar) => sixteenthOrder.slice(bar * 4, bar * 4 + 4).flat())
            : Array.from({ length: 8 }, () => pool[Math.floor(random() * pool.length)]);
        const bars = patterns.map(pattern => pattern.map(token => ({
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
    return { LEVELS, VALUES, settings, chart, judge, hitWindow, noteWindow };
});
