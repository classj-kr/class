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
    function tempoRange(level) {
        return { min: 40, max: level === 3 || level === 7 ? 90 : level === 6 ? 120 : 140,
            initial: level === 3 || level === 7 ? 60 : 80 };
    }
    function settings(input = {}) {
        const level = Number(input.level), bpm = Number(input.bpm);
        const validLevel = Number.isInteger(level) && level >= 0 && level < LEVELS.length ? level : 1;
        const range = tempoRange(validLevel);
        return { level: validLevel, bpm: Number.isFinite(bpm) ? Math.max(range.min, Math.min(range.max, Math.round(bpm / 5) * 5)) : range.initial };
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
    // Virtual outer boundary only; interior boundaries come from adjacent attacks.
    const hitWindow = chart => 60 / chart.bpm / 2;
    // Preserve a 100 ms practice margin when subdivisions get faster. Windows
    // may overlap; ordered alignment resolves them without stealing later notes.
    // The cap still excludes an attack made on the neighboring note itself.
    const MIN_HIT_WINDOW = .1;
    function noteWindow(chart, index, side = 'both') {
        const targets = chart.targets, time = targets[index];
        const margin = gap => Math.min(Math.max(gap / 2, MIN_HIT_WINDOW), gap * .9) - 60 / chart.bpm * 1e-9;
        const previous = margin(index ? time - targets[index - 1] : hitWindow(chart) * 2);
        const next = margin(index + 1 < targets.length ? targets[index + 1] - time : hitWindow(chart) * 2);
        return side === 'early' ? previous : side === 'late' ? next : Math.min(previous, next);
    }
    // The notation adds spacing at beat and measure boundaries. Interpolate
    // between its actual written positions so the cursor cannot jump that space.
    function playheadX(anchors, beat) {
        if (beat <= anchors[0][0]) return anchors[0][1];
        for (let i = 1; i < anchors.length; i++) {
            if (beat > anchors[i][0]) continue;
            const [fromBeat, fromX] = anchors[i - 1], [toBeat, toX] = anchors[i];
            return fromX + (toX - fromX) * (beat - fromBeat) / (toBeat - fromBeat);
        }
        return anchors[anchors.length - 1][1];
    }
    function judge(chart, taps) {
        return analyze(chart, taps).result;
    }
    function trace(chart, taps) {
        return analyze(chart, taps).inputs;
    }
    // Keep a small error band outside the correct practice window. It records a
    // mistimed strike against its current note without counting it as correct.
    function connectionWindow(chart, index, side = 'both') {
        const previous = index ? chart.targets[index] - chart.targets[index - 1] : Infinity;
        const next = index + 1 < chart.targets.length ? chart.targets[index + 1] - chart.targets[index] : Infinity;
        const gap = side === 'early' ? previous : side === 'late' ? next : Math.min(previous, next);
        return Math.min(noteWindow(chart, index, side) * 1.5, gap * .95);
    }
    function analyze(chart, taps) {
        const clean = taps.filter(Number.isFinite).slice().sort((a, b) => a - b);
        const targets = chart.targets, marks = targets.map(time => ({ time, hit: false, error: null, points: 0, input: null })), inputs = [];
        for (const raw of clean) {
            let nearest = -1, gap = Infinity;
            targets.forEach((time, target) => {
                const distance = Math.abs(raw - time);
                if (distance < gap) { nearest = target; gap = distance; }
            });
            const input = { time: raw, nearest, target: -1, error: nearest < 0 ? 0 : raw - targets[nearest], accepted: false, reason: 'extra' };
            inputs.push(input);
        }
        // Align ordered attacks and inputs one-to-one, allowing real omissions and
        // extras. Preserve note order before awarding timing points, so moving a
        // late tap to the next note cannot make a real strike look like an omission.
        const width = clean.length + 1, size = (targets.length + 1) * width;
        const hits = new Uint16Array(size), playedCount = new Uint16Array(size), positions = new Float64Array(size);
        const errors = new Float64Array(size), path = new Uint8Array(size);
        for (let i = 0; i <= targets.length; i++) for (let j = 0; j <= clean.length; j++) {
            if (!i && !j) continue;
            const at = i * width + j;
            function choose(from, point, connected, position, error, step) {
                const h = hits[from] + point, p = playedCount[from] + connected;
                const order = positions[from] + position, cost = errors[from] + error;
                if (!path[at] || p > playedCount[at] || p === playedCount[at] && (order < positions[at]
                    || order === positions[at] && (h > hits[at] || h === hits[at] && cost < errors[at]))) {
                    hits[at] = h; playedCount[at] = p; positions[at] = order; errors[at] = cost; path[at] = step;
                }
            }
            if (i) choose(at - width, 0, 0, 0, 0, 1);
            if (j) choose(at - 1, 0, 0, 0, 0, 2);
            if (i && j) {
                const error = clean[j - 1] - targets[i - 1], side = error < 0 ? 'early' : 'late';
                if (Math.abs(error) <= connectionWindow(chart, i - 1, side)) {
                    const from = at - width - 1;
                    const accepted = Math.abs(error) <= noteWindow(chart, i - 1, side);
                    const nearest = inputs[j - 1].nearest, nearestError = inputs[j - 1].error;
                    // Before any note has been connected, allow starting on a
                    // later, correctly timed note instead of inventing a late start.
                    const startsOnNeighbor = !playedCount[from] && !accepted && nearest >= 0
                        && Math.abs(nearestError) <= noteWindow(chart, nearest, nearestError < 0 ? 'early' : 'late');
                    if (!startsOnNeighbor) choose(from, accepted ? 1 : 0, 1, i - 1, Math.abs(error), 3);
                }
            }
        }
        let i = targets.length, j = clean.length;
        while (i || j) {
            const step = path[i * width + j];
            if (step === 1) i--;
            else if (step === 2) j--;
            else {
                const input = inputs[j - 1], error = input.time - targets[i - 1];
                const accepted = Math.abs(error) <= noteWindow(chart, i - 1, error < 0 ? 'early' : 'late');
                Object.assign(marks[i - 1], { hit: true, error, points: accepted ? 1 : 0, input: j - 1 });
                Object.assign(input, { target: i - 1, error, accepted, reason: accepted ? 'hit' : 'timing' });
                i--; j--;
            }
        }
        const played = marks.filter(mark => mark.hit), correct = played.filter(mark => mark.points === 1);
        const extras = clean.length - played.length, timingWrong = played.length - correct.length;
        const errorSum = played.reduce((sum, mark) => sum + Math.abs(mark.error), 0);
        const accuracy = marks.length ? Math.max(0, Math.round(1000 * (correct.length - extras * .5) / marks.length) / 10) : 0;
        const result = { accuracy, perfect: correct.length, hits: correct.length, played: played.length,
            misses: marks.length - played.length, extras, timingWrong, wrong: extras + timingWrong, marks,
            errorMs: played.length ? Math.round(errorSum * 1000 / played.length) : null, lagMs: 0 };
        return { result, inputs };
    }
    return { LEVELS, VALUES, settings, tempoRange, chart, fromBars, judge, trace, analyze, hitWindow, noteWindow, connectionWindow, playheadX };
});
