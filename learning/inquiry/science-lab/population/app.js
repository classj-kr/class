'use strict';

/* Two things a population lets you measure. How it grows when something stops
   it, and how well a handful of sample squares stand in for counting the lot.
   The growth curves are the closed-form solutions, and the survey is a real
   random sample of a real field, so its scatter is earned rather than drawn. */

const DAYS = 40;
const CELLS = 10;          // the field is a 10 x 10 grid of quadrats
const TRUE_N = 400;        // individuals actually in the field
const TRIALS = 120;

const state = {
    mode: 'growth',
    model: 'log', K: 500, n0: 10, r: 0.3, day: DAYS,
    dist: 'random', quad: 5, sample: [], trials: [],
    prediction: null, checked: false,
    running: false, phase: 0, dirty: true,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
// Unchecked growth reaches numbers with fifteen digits, which neither fit on
// the canvas nor mean anything read out loud. 39.7조 does both jobs.
function koNum(n) {
    if (n < 1e4) return Math.round(n).toLocaleString('ko-KR');
    if (n < 1e8) return `${fmt(n / 1e4, 1)}만 `;
    if (n < 1e12) return `${fmt(n / 1e8, 1)}억 `;
    if (n < 1e16) return `${fmt(n / 1e12, 1)}조 `;
    return `${n.toExponential(1).replace('e+', '×10^')} `;
}
// A population that has settled at K is not growing at "−0.0" a day.
function koRate(n) {
    if (Math.abs(n) < 0.05) return '0.0';
    if (Math.abs(n) < 1e4) return fmt(n, 1);
    return (n < 0 ? '−' : '') + koNum(Math.abs(n));
}

// --- growth -----------------------------------------------------------------
function expAt(t) { return state.n0 * Math.exp(state.r * t); }
function logAt(t) {
    const { K, n0, r } = state;
    return K / (1 + ((K - n0) / n0) * Math.exp(-r * t));
}
function popAt(t) { return state.model === 'exp' ? expAt(t) : logAt(t); }
function slopeAt(t) {
    const N = popAt(t);
    return state.model === 'exp' ? state.r * N : state.r * N * (1 - N / state.K);
}
// The share of the potential increase that crowding takes away is exactly N/K.
function resistanceAt(t) { return state.model === 'exp' ? 0 : clamp(popAt(t) / state.K, 0, 2); }

function growthVerdict() {
    if (state.model === 'exp') return 'p1';
    return state.n0 > state.K ? 'p3' : 'p2';
}

// --- survey -----------------------------------------------------------------
function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

const FIELDS = {};
function field(dist) {
    if (FIELDS[dist]) return FIELDS[dist];
    const rand = rng(dist === 'even' ? 11 : dist === 'random' ? 22 : 33);
    const pts = [];
    if (dist === 'even') {
        // A 5 m lattice, jittered less than its distance to any cell edge, so
        // every quadrat holds exactly four and the count never varies.
        for (let i = 0; i < 20; i += 1) for (let j = 0; j < 20; j += 1) {
            pts.push([i * 5 + 2.5 + (rand() - 0.5) * 1.6, j * 5 + 2.5 + (rand() - 0.5) * 1.6]);
        }
    } else if (dist === 'random') {
        for (let i = 0; i < TRUE_N; i += 1) pts.push([rand() * 100, rand() * 100]);
    } else {
        for (let c = 0; c < 20; c += 1) {
            const cx = 8 + rand() * 84, cy = 8 + rand() * 84;
            for (let k = 0; k < 20; k += 1) {
                const ang = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * 6;
                pts.push([clamp(cx + Math.cos(ang) * rr, 0.1, 99.9), clamp(cy + Math.sin(ang) * rr, 0.1, 99.9)]);
            }
        }
    }
    const counts = new Array(CELLS * CELLS).fill(0);
    pts.forEach(([x, y]) => {
        counts[Math.floor(y / 10) * CELLS + Math.floor(x / 10)] += 1;
    });
    FIELDS[dist] = { pts, counts };
    return FIELDS[dist];
}

function cellStats(dist) {
    const c = field(dist).counts;
    const mean = c.reduce((s, v) => s + v, 0) / c.length;
    const varr = c.reduce((s, v) => s + (v - mean) ** 2, 0) / c.length;
    return { mean, varr, dispersion: mean ? varr / mean : 0 };
}

// Sampling n of 100 cells without replacement. The finite-population
// correction is what makes 100 quadrats give the exact answer.
function estimateSpread(dist, n) {
    const { varr } = cellStats(dist);
    const N = CELLS * CELLS;
    const varMean = (varr / n) * ((N - n) / (N - 1));
    return { sd: Math.sqrt(varMean) * N, cv: Math.sqrt(varMean) / 4 };
}

function drawSample(seed) {
    const rand = rng(seed);
    const idx = [...Array(CELLS * CELLS).keys()];
    for (let i = idx.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, state.quad).sort((a, b) => a - b);
}

function estimateFrom(cells) {
    const c = field(state.dist).counts;
    const total = cells.reduce((s, i) => s + c[i], 0);
    return { total, estimate: total * (CELLS * CELLS) / cells.length };
}

function surveyVerdict() {
    const { cv } = estimateSpread(state.dist, state.quad);
    return cv < 0.10 ? 'p1' : (cv < 0.30 ? 'p2' : 'p3');
}

function verdict() { return state.mode === 'growth' ? growthVerdict() : surveyVerdict(); }

function analyse() {
    if (state.mode === 'growth') {
        const t = state.day;
        return {
            N: popAt(t), slope: slopeAt(t), resist: resistanceAt(t),
            final: popAt(DAYS), atHalfK: state.K / 2,
            peakDay: state.model === 'log' && state.n0 < state.K
                ? Math.log((state.K - state.n0) / state.n0) / state.r : null,
            verdict: verdict(),
        };
    }
    const { total, estimate } = estimateFrom(state.sample);
    const sp = estimateSpread(state.dist, state.quad);
    const st = cellStats(state.dist);
    const tr = state.trials;
    const mean = tr.length ? tr.reduce((s, v) => s + v, 0) / tr.length : null;
    const sd = tr.length > 1 ? Math.sqrt(tr.reduce((s, v) => s + (v - mean) ** 2, 0) / (tr.length - 1)) : null;
    return {
        counted: total, estimate, trueN: TRUE_N, error: estimate - TRUE_N,
        sd: sp.sd, cv: sp.cv, dispersion: st.dispersion,
        trialMean: mean, trialSd: sd, trialCount: tr.length,
        verdict: verdict(),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

// --- drawing: growth --------------------------------------------------------
const DISH = { cx: 148, cy: 116, r: 88 };

function drawDish(g) {
    const a = analyse();
    const fill = clamp(a.N / state.K, 0, 1.4);
    const dots = Math.min(96, Math.round(fill * 80));
    const over = a.N > state.K * 1.02;

    g.appendChild(el('circle', { cx: DISH.cx, cy: DISH.cy, r: DISH.r, class: `dish${over ? ' dish-full' : ''}` }));
    const rand = rng(7);
    for (let i = 0; i < dots; i += 1) {
        const ang = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * (DISH.r - 9);
        const wob = Math.sin(state.phase * 2 + i) * 1.6;
        g.appendChild(el('ellipse', {
            cx: DISH.cx + Math.cos(ang) * rr + wob, cy: DISH.cy + Math.sin(ang) * rr,
            rx: 4.2, ry: 2.6, transform: `rotate(${Math.round(ang * 57.3)} ${fmt(DISH.cx + Math.cos(ang) * rr + wob, 1)} ${fmt(DISH.cy + Math.sin(ang) * rr, 1)})`,
            class: `critter${fill > 0.85 ? ' crowded' : ''}`,
        }));
    }
    g.appendChild(el('text', { x: DISH.cx, y: 212, 'text-anchor': 'middle', class: 'small-label' },
        `${Math.round(state.day)}일째 · 점은 K를 채운 정도`));

    g.appendChild(el('text', { x: 262, y: 40, class: 'small-label' }, '개체 수'));
    g.appendChild(el('text', { x: 262, y: 64, class: 'big-count' }, koNum(a.N)));
    g.appendChild(el('text', { x: 262, y: 92, class: 'small-label' }, '하루에 늘어나는 수'));
    g.appendChild(el('text', { x: 262, y: 112, class: 'read-text' }, `${koRate(a.slope)}마리`));

    g.appendChild(el('text', { x: 262, y: 142, class: 'small-label' }, '환경 저항이 깎는 몫'));
    g.appendChild(el('rect', { x: 262, y: 150, width: 168, height: 14, rx: 4, class: 'meter-frame' }));
    g.appendChild(el('rect', { x: 263, y: 151, width: clamp(a.resist, 0, 1) * 166, height: 12, rx: 3, class: 'meter-fill' }));
    g.appendChild(el('text', { x: 262, y: 180, class: 'note-text' },
        state.model === 'exp' ? '지수 성장에는 저항이 없습니다' : `${Math.round(clamp(a.resist, 0, 1) * 100)}% — 개체 수 ÷ K`));
    if (over) g.appendChild(el('text', { x: 262, y: 198, class: 'warn-text' }, 'K를 넘어 그릇이 비좁습니다'));
}

function drawGrowthGraph(g) {
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146;
    const top = Math.max(state.K * 1.2, state.n0 * 1.15);
    const X = t => x0 + (t / DAYS) * (x1 - x0);
    const Y = n => yBot - (clamp(n, 0, top) / top) * (yBot - yTop);

    const step = top > 900 ? 250 : (top > 400 ? 100 : 50);
    for (let n = 0; n <= top; n += step) {
        g.appendChild(el('line', { x1: x0, y1: Y(n), x2: x1, y2: Y(n), class: 'grid-line' }));
        if (n > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(n) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, String(n)));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let t = 0; t <= DAYS; t += 10) {
        g.appendChild(el('line', { x1: X(t), y1: yBot, x2: X(t), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(t), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(t)));
    }

    // The gap between the two curves is what the environment took.
    let band = '', de = '', dl = '';
    for (let i = 0; i <= 160; i += 1) {
        const t = (i / 160) * DAYS;
        de += `${i ? 'L' : 'M'} ${fmt(X(t), 2)} ${fmt(Y(expAt(t)), 2)} `;
        dl += `${i ? 'L' : 'M'} ${fmt(X(t), 2)} ${fmt(Y(logAt(t)), 2)} `;
    }
    for (let i = 0; i <= 160; i += 1) {
        const t = (i / 160) * DAYS;
        band += `${i ? 'L' : 'M'} ${fmt(X(t), 2)} ${fmt(Y(expAt(t)), 2)} `;
    }
    for (let i = 160; i >= 0; i -= 1) {
        const t = (i / 160) * DAYS;
        band += `L ${fmt(X(t), 2)} ${fmt(Y(logAt(t)), 2)} `;
    }
    if (state.n0 < state.K) g.appendChild(el('path', { d: band + 'Z', class: 'resist-band' }));
    g.appendChild(el('path', { d: de, class: 'exp-line' }));
    g.appendChild(el('path', { d: dl, class: 'log-line' }));

    g.appendChild(el('line', { x1: x0, y1: Y(state.K), x2: x1, y2: Y(state.K), class: 'k-line' }));
    g.appendChild(el('text', { x: x1 - 2, y: Y(state.K) - 5, 'text-anchor': 'end', class: 'axis-text', style: 'fill:#ff9d9d' }, `K = ${state.K}`));

    const a = analyse();
    if (a.peakDay !== null && a.peakDay <= DAYS) {
        g.appendChild(el('line', { x1: X(a.peakDay), y1: Y(state.K / 2), x2: X(a.peakDay), y2: yBot, class: 'mark-line' }));
        g.appendChild(el('circle', { cx: X(a.peakDay), cy: Y(state.K / 2), r: 3.6, style: 'fill:#d97706' }));
        g.appendChild(el('text', { x: X(a.peakDay) + 5, y: yBot - 6, class: 'axis-text' }, `가장 빠른 때 ${fmt(a.peakDay, 1)}일`));
    }
    g.appendChild(el('circle', { cx: X(state.day), cy: Y(a.N), r: 5, class: 'trace-dot', style: 'fill:#059669' }));

    g.appendChild(el('line', { x1: x0, y1: 172, x2: x0 + 15, y2: 172, style: 'stroke:#d97706;stroke-width:3;stroke-dasharray:5 3' }));
    g.appendChild(el('text', { x: x0 + 20, y: 175.5, class: 'legend-text', style: 'fill:#d97706' }, '지수 성장 (J자)'));
    g.appendChild(el('line', { x1: x0 + 122, y1: 172, x2: x0 + 137, y2: 172, style: 'stroke:#059669;stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 142, y: 175.5, class: 'legend-text', style: 'fill:#059669' }, '로지스틱 성장 (S자)'));
    g.appendChild(el('rect', { x: x0 + 266, y: 168, width: 14, height: 7, class: 'resist-band' }));
    g.appendChild(el('text', { x: x0 + 286, y: 175.5, class: 'legend-text', style: 'fill:#d8a98d' }, '환경 저항'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '지난 날수 (일) — 세로는 개체 수'));
}

// --- drawing: survey --------------------------------------------------------
const FIELD = { x: 128, y: 18, w: 178 };

function drawField(g) {
    const a = analyse();
    const f = field(state.dist);
    const S = FIELD.w / 100;
    const inSample = new Set(state.sample);

    g.appendChild(el('rect', { x: FIELD.x, y: FIELD.y, width: FIELD.w, height: FIELD.w, rx: 4, class: 'field' }));
    for (let i = 1; i < CELLS; i += 1) {
        g.appendChild(el('line', { x1: FIELD.x + i * FIELD.w / CELLS, y1: FIELD.y, x2: FIELD.x + i * FIELD.w / CELLS, y2: FIELD.y + FIELD.w, class: 'cell-line' }));
        g.appendChild(el('line', { x1: FIELD.x, y1: FIELD.y + i * FIELD.w / CELLS, x2: FIELD.x + FIELD.w, y2: FIELD.y + i * FIELD.w / CELLS, class: 'cell-line' }));
    }
    state.sample.forEach(i => {
        const cx = i % CELLS, cy = Math.floor(i / CELLS);
        g.appendChild(el('rect', {
            x: FIELD.x + cx * FIELD.w / CELLS, y: FIELD.y + cy * FIELD.w / CELLS,
            width: FIELD.w / CELLS, height: FIELD.w / CELLS, class: 'quadrat',
        }));
    });
    f.pts.forEach(([x, y]) => {
        const cell = Math.floor(y / 10) * CELLS + Math.floor(x / 10);
        g.appendChild(el('circle', { cx: FIELD.x + x * S, cy: FIELD.y + y * S, r: 1.9, class: `dot${inSample.has(cell) ? ' counted' : ''}` }));
    });
    g.appendChild(el('text', { x: FIELD.x + FIELD.w / 2, y: 209, 'text-anchor': 'middle', class: 'small-label' }, '100 m × 100 m · 한 칸은 10 m × 10 m'));

    g.appendChild(el('text', { x: 20, y: 38, class: 'small-label' }, '센 칸'));
    g.appendChild(el('text', { x: 20, y: 58, class: 'read-text' }, `${state.quad}칸 / 100칸`));
    g.appendChild(el('text', { x: 20, y: 84, class: 'small-label' }, '센 개체'));
    g.appendChild(el('text', { x: 20, y: 104, class: 'read-text' }, `${a.counted}마리`));

    g.appendChild(el('text', { x: 322, y: 38, class: 'small-label' }, '어림한 전체'));
    g.appendChild(el('text', { x: 322, y: 62, class: 'big-count' }, Math.round(a.estimate).toLocaleString('ko-KR')));
    g.appendChild(el('text', { x: 322, y: 84, class: 'small-label' }, `참값 ${TRUE_N}마리`));
    g.appendChild(el('text', { x: 322, y: 102, class: a.error === 0 ? 'read-text' : 'warn-text' },
        a.error === 0 ? '딱 맞음' : `${a.error > 0 ? '+' : '−'}${Math.abs(Math.round(a.error))}마리`));
    if (a.trialCount > 1) {
        g.appendChild(el('text', { x: 322, y: 132, class: 'small-label' }, `${a.trialCount}번 되풀이하면`));
        g.appendChild(el('text', { x: 322, y: 150, class: 'note-text' }, `평균 ${Math.round(a.trialMean)}마리`));
        g.appendChild(el('text', { x: 322, y: 165, class: 'note-text' }, `± ${Math.round(a.trialSd)}마리`));
    }
}

function drawSurveyGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const LO = 0, HI = 900, BINS = 30;
    const X = v => x0 + ((v - LO) / (HI - LO)) * (x1 - x0);

    const bins = new Array(BINS).fill(0);
    state.trials.forEach(v => { bins[clamp(Math.floor((v - LO) / (HI - LO) * BINS), 0, BINS - 1)] += 1; });
    const peak = Math.max(1, ...bins);
    const Y = c => yBot - (c / peak) * (yBot - yTop);

    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let v = 0; v <= HI; v += 150) {
        g.appendChild(el('line', { x1: X(v), y1: yBot, x2: X(v), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(v), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(v)));
    }
    const bw = (x1 - x0) / BINS;
    bins.forEach((c, i) => {
        if (!c) return;
        g.appendChild(el('rect', { x: x0 + i * bw + 0.6, y: Y(c), width: bw - 1.2, height: yBot - Y(c), class: 'hist-bar' }));
    });
    g.appendChild(el('line', { x1: X(TRUE_N), y1: yTop - 4, x2: X(TRUE_N), y2: yBot, class: 'true-line' }));
    g.appendChild(el('text', { x: X(TRUE_N) + 5, y: yTop + 2, class: 'axis-text', style: 'fill:#ff9d9d' }, `참값 ${TRUE_N}`));

    if (!state.trials.length) {
        g.appendChild(el('text', { x: (x0 + x1) / 2, y: 92, 'text-anchor': 'middle', class: 'note-text' }, '되풀이 조사를 돌리면 어림값이 얼마나 흩어지는지 쌓입니다'));
    }
    g.appendChild(el('text', { x: x0 + 4, y: 175.5, class: 'legend-text', style: 'fill:#475569' },
        `이론상 흩어짐 ± ${fmt(a.sd, 0)}마리 · 칸마다 수의 고른 정도 ${fmt(a.dispersion, 2)}`));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '어림한 개체 수 — 세로는 그 값이 나온 횟수'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    if (state.mode === 'growth') { drawDish(m); drawGrowthGraph(gr); }
    else { drawField(m); drawSurveyGraph(gr); }
    updateReadout();
}

function updateReadout() {
    const a = analyse();
    if (state.mode === 'growth') {
        $('stageBadge').textContent = `${state.model === 'exp' ? '지수' : '로지스틱'} · K ${state.K} · r ${fmt(state.r, 2)}`;
        $('labelA').textContent = '지금 개체 수';
        $('valueA').textContent = `${koNum(a.N)}마리`;
        $('labelB').textContent = '늘어나는 빠르기';
        $('valueB').textContent = `${koRate(a.slope)}마리/일`;
        const rows = [
            ['40일 뒤', `${koNum(a.final)}마리`, false],
            ['환경 수용력 K', `${state.K}마리`, false],
            ['환경 저항이 깎는 몫', state.model === 'exp' ? '없음' : `${Math.round(clamp(a.resist, 0, 1) * 100)}%`, false],
            ['가장 빠르게 느는 때', a.peakDay === null ? '해당 없음' : `${fmt(a.peakDay, 1)}일 · ${state.K / 2}마리`, false],
            ['그때의 빠르기', a.peakDay === null ? '해당 없음' : `${fmt(state.r * state.K / 4, 1)}마리/일`, false],
            ['같은 날 지수 성장이라면', `${koNum(expAt(state.day))}마리`, false],
        ];
        $('dataNote').innerHTML = rows.map(([n, v, m]) =>
            `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    } else {
        const DN = { even: '고르게', random: '무작위', clump: '뭉쳐서' };
        $('stageBadge').textContent = `${DN[state.dist]} · 방형구 ${state.quad}칸`;
        $('labelA').textContent = '어림한 개체 수';
        $('valueA').textContent = `${Math.round(a.estimate).toLocaleString('ko-KR')}마리`;
        $('labelB').textContent = '참값과의 차이';
        $('valueB').textContent = a.error === 0 ? '0마리' : `${a.error > 0 ? '+' : '−'}${Math.abs(Math.round(a.error))}마리`;
        const rows = [
            ['참 개체 수', `${TRUE_N}마리`, false],
            ['센 칸에서 찾은 수', `${a.counted}마리`, false],
            ['칸마다 수의 고른 정도', `${fmt(a.dispersion, 2)} (분산 ÷ 평균)`, a.dispersion < 1.2],
            ['이론상 흩어짐', `± ${fmt(a.sd, 0)}마리`, a.cv < 0.1],
            ['되풀이 조사', a.trialCount > 1 ? `${a.trialCount}번 · 평균 ${Math.round(a.trialMean)} ± ${Math.round(a.trialSd)}마리` : '아직 안 함', false],
            ['100칸을 다 세면', `${TRUE_N}마리 — 오차 없음`, false],
        ];
        $('dataNote').innerHTML = rows.map(([n, v, m]) =>
            `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    }
    if (state.checked) explain(a);
}

const GROWTH_WORDS = { p1: '계속 늘어난다', p2: 'K에 멈춘다', p3: 'K로 줄어든다' };
const SURVEY_WORDS = { p1: '잘 맞는다', p2: '그럭저럭', p3: '크게 흔들린다' };

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const words = state.mode === 'growth' ? GROWTH_WORDS : SURVEY_WORDS;
    const v = a.verdict;
    if (state.prediction) {
        const ok = state.prediction === v;
        $('predictionResult').textContent = ok ? `예상이 맞았습니다 — ${words[v]}.`
            : `예상은 ${words[state.prediction]}였지만 결과는 ${words[v]}입니다.`;
        $('predictionResult').className = `prediction-result ${ok ? 'correct' : 'wrong'}`;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
    }

    if (state.mode === 'growth') {
        let s = `${Math.round(state.day)}일째 개체 수는 ${koNum(a.N)}마리이고, 하루에 ${koRate(a.slope)}마리씩 늘고 있습니다. `;
        if (state.model === 'exp') {
            s += `막는 것이 없는 지수 성장에서는 늘어나는 빠르기가 개체 수에 그대로 비례하므로, 개체 수가 많아질수록 더 가파르게 치솟아 J자를 그립니다. 40일이면 ${koNum(a.final)}마리가 되는데, 이만한 수가 실제로 살 자리는 어디에도 없습니다. `;
            s += `그래서 자연에서는 이 곡선이 오래가지 못합니다.`;
        } else if (state.n0 > state.K) {
            s += `처음 개체 수 ${state.n0}마리는 이 그릇이 감당할 수 있는 ${state.K}마리보다 많습니다. 남은 자리가 음수인 셈이라 늘어나는 빠르기가 음수가 되고, 개체 수는 오히려 줄면서 K로 내려앉습니다. 넘치게 넣어도 결국 K에서 만납니다.`;
        } else {
            s += `늘어나는 빠르기는 개체 수와 남은 자리를 곱한 만큼입니다. 지금은 그릇의 ${Math.round(clamp(a.resist, 0, 1) * 100)}%가 찼으므로 그만큼이 환경 저항으로 깎였습니다. `;
            if (a.peakDay !== null) {
                s += `가장 빠르게 늘어나는 때는 개체 수가 K의 절반인 ${state.K / 2}마리일 때, 곧 ${fmt(a.peakDay, 1)}일째이고 그때 하루 ${fmt(state.r * state.K / 4, 1)}마리가 늘어납니다. `;
            }
            s += `그 뒤로는 남은 자리가 줄어 곡선이 눕고, 개체 수는 ${state.K}마리에 다가가 멈춥니다. 같은 날 지수 성장이었다면 ${koNum(expAt(state.day))}마리였을 테니, 그 차이가 환경 저항이 가져간 몫입니다.`;
        }
        $('elementaryExplanation').textContent = s;
    } else {
        const DN = { even: '고르게 퍼진', random: '무작위로 흩어진', clump: '무리 지어 뭉친' };
        let s = `${state.quad}칸을 세어 ${a.counted}마리를 찾았으니, 한 칸에 평균 ${fmt(a.counted / state.quad, 2)}마리입니다. 100칸이면 ${Math.round(a.estimate).toLocaleString('ko-KR')}마리로 어림되고, 참값 ${TRUE_N}마리와는 ${Math.abs(Math.round(a.error))}마리 차이입니다. `;
        s += `${DN[state.dist]} 분포에서는 칸마다 들어 있는 수의 분산을 평균으로 나눈 값이 ${fmt(a.dispersion, 2)}입니다. `;
        if (state.dist === 'even') {
            s += `이 값이 0에 가깝다는 것은 어느 칸을 뽑아도 같은 수가 나온다는 뜻이라, 한 칸만 세어도 답이 맞습니다. `;
        } else if (state.dist === 'random') {
            s += `무작위로 흩어져 있으면 이 값이 1 언저리가 됩니다. 칸마다 어느 정도 차이가 나므로 몇 칸은 세어야 합니다. `;
        } else {
            s += `1보다 훨씬 크다는 것은 무리를 품은 칸과 텅 빈 칸의 차이가 크다는 뜻입니다. 어느 칸을 뽑느냐에 따라 어림값이 크게 달라집니다. `;
        }
        s += `이 조건에서 어림값은 참값 둘레로 ± ${fmt(a.sd, 0)}마리쯤 흩어지고, 칸을 늘릴수록 좁아져 100칸을 다 세면 정확히 ${TRUE_N}마리가 됩니다.`;
        if (a.trialCount > 1) {
            s += ` 실제로 ${a.trialCount}번 되풀이해 보니 평균 ${Math.round(a.trialMean)}마리에 흩어짐은 ± ${Math.round(a.trialSd)}마리였습니다. 어림값 자체는 치우치지 않고, 다만 흔들릴 뿐입니다.`;
        }
        $('elementaryExplanation').textContent = s;
    }
}

// --- animation --------------------------------------------------------------
let trialSeed = 1000;
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    if (state.mode === 'growth') {
        state.day = Math.min(DAYS, state.day + dt * DAYS / 10);
        if (state.day >= DAYS) {
            state.running = false;
            $('runBtn').textContent = '40일 키우기';
            state.checked = true;
            return true;
        }
    } else {
        const per = Math.max(1, Math.round(dt * 16));
        for (let i = 0; i < per && state.trials.length < TRIALS; i += 1) {
            trialSeed += 1;
            state.sample = drawSample(trialSeed);
            state.trials.push(estimateFrom(state.sample).estimate);
        }
        if (state.trials.length >= TRIALS) {
            state.running = false;
            $('runBtn').textContent = '되풀이 조사';
            state.checked = true;
            return true;
        }
    }
    return false;
}

let last = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    // The field draws 400 dots, so it is only redrawn when something moved.
    if (state.running || state.dirty || state.mode === 'growth') { render(); state.dirty = false; }
    requestAnimationFrame(frame);
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}
function touch() { state.dirty = true; render(); }

function applyMode() {
    markSelected('[data-mode]', 'mode', state.mode);
    $('growthControls').hidden = state.mode !== 'growth';
    $('surveyControls').hidden = state.mode === 'growth';
    const gr = state.mode === 'growth';
    $('predictionLegend').textContent = gr ? '시간이 지나면 개체 수는?' : '이 분포에서 방형구법이 얼마나 믿을 만할까요?';
    const words = gr ? GROWTH_WORDS : SURVEY_WORDS;
    document.querySelectorAll('[data-prediction]').forEach(b => { b.textContent = words[b.dataset.prediction]; });
    $('runBtn').textContent = gr ? '40일 키우기' : '되풀이 조사';
    $('unitNote').textContent = gr ? '개체 수는 배양 접시 하나에 사는 짚신벌레의 수입니다'
        : '들판 100 m × 100 m를 100칸으로 나누고 몇 칸만 셉니다';
    $('stageCaption').textContent = gr
        ? '환경 저항은 자리와 먹이가 모자라 죽거나 태어나지 못하는 몫입니다. 개체 수가 K에 가까울수록 커집니다.'
        : '노란 칸이 세기로 고른 방형구입니다. 그 안의 개체만 세어 100칸 전체를 어림합니다.';
    state.running = false;
    touch();
}

document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode; state.prediction = null; state.checked = false;
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    applyMode();
}));
document.querySelectorAll('[data-model]').forEach(b => b.addEventListener('click', () => {
    state.model = b.dataset.model; markSelected('[data-model]', 'model', state.model); touch();
}));
document.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    state.K = Number(b.dataset.k); markSelected('[data-k]', 'k', state.K); touch();
}));
document.querySelectorAll('[data-n0]').forEach(b => b.addEventListener('click', () => {
    state.n0 = Number(b.dataset.n0); markSelected('[data-n0]', 'n0', state.n0); touch();
}));
document.querySelectorAll('[data-dist]').forEach(b => b.addEventListener('click', () => {
    state.dist = b.dataset.dist; state.trials = []; markSelected('[data-dist]', 'dist', state.dist); touch();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('rRange').addEventListener('input', e => {
    state.r = Number(e.target.value);
    $('rOutput').textContent = `${fmt(state.r, 2)} /일`;
    touch();
});
$('quadRange').addEventListener('input', e => {
    state.quad = Number(e.target.value);
    $('quadOutput').textContent = `${state.quad}칸`;
    state.trials = [];
    trialSeed += 1;
    state.sample = drawSample(trialSeed);
    touch();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; applyMode(); return; }
    state.checked = true;
    if (state.mode === 'growth') { state.day = 0; state.running = true; $('runBtn').textContent = '멈추기'; }
    else { state.trials = []; state.running = true; $('runBtn').textContent = '멈추기'; }
    touch();
});
$('resetBtn').addEventListener('click', () => {
    state.mode = 'growth'; state.model = 'log'; state.K = 500; state.n0 = 10; state.r = 0.3; state.day = DAYS;
    state.dist = 'random'; state.quad = 5; state.trials = []; state.running = false;
    state.prediction = null; state.checked = false;
    $('rRange').value = '0.3'; $('rOutput').textContent = '0.30 /일';
    $('quadRange').value = '5'; $('quadOutput').textContent = '5칸';
    state.sample = drawSample(1000);
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-model]', 'model', 'log'); markSelected('[data-k]', 'k', 500);
    markSelected('[data-n0]', 'n0', 10); markSelected('[data-dist]', 'dist', 'random');
    applyMode();
});

document.querySelectorAll('.quiz-card').forEach(card => {
    card.querySelector('.answer-button').addEventListener('click', () => {
        const picked = card.querySelector('input:checked');
        const result = card.querySelector('.answer-result');
        const why = card.querySelector('.answer-explanation');
        if (!picked) { result.textContent = '먼저 답을 골라 보세요.'; result.className = 'answer-result'; return; }
        const ok = picked.value === card.dataset.answer;
        result.textContent = ok ? '맞았습니다.' : '다시 생각해 볼까요?';
        result.className = `answer-result ${ok ? 'correct' : 'wrong'}`;
        why.hidden = false;
    });
});

state.sample = drawSample(1000);
markSelected('[data-model]', 'model', state.model);
markSelected('[data-k]', 'k', state.K);
markSelected('[data-n0]', 'n0', state.n0);
markSelected('[data-dist]', 'dist', state.dist);
applyMode();
requestAnimationFrame(frame);

window.__popModel = {
    state, analyse, tick, render, expAt, logAt, slopeAt, popAt,
    field, cellStats, estimateSpread, drawSample, estimateFrom, DAYS, TRUE_N, CELLS,
    setMode(v) { document.querySelector(`[data-mode="${v}"]`).click(); },
    setModel(v) { document.querySelector(`[data-model="${v}"]`).click(); },
    setK(v) { document.querySelector(`[data-k="${v}"]`).click(); },
    setN0(v) { document.querySelector(`[data-n0="${v}"]`).click(); },
    setR(v) { const r = $('rRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    setDist(v) { document.querySelector(`[data-dist="${v}"]`).click(); },
    setQuad(v) { const r = $('quadRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    setDay(v) { state.day = v; touch(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, day: state.day, trials: state.trials.length };
    },
    // Repeat the whole survey many times without drawing, to see whether the
    // estimator is actually unbiased and how wide it really scatters.
    sampleStats(dist, quad, n = 4000) {
        const keepD = state.dist, keepQ = state.quad, keepS = state.sample;
        state.dist = dist; state.quad = quad;
        const vals = [];
        for (let i = 0; i < n; i += 1) vals.push(estimateFrom(drawSample(500000 + i)).estimate);
        state.dist = keepD; state.quad = keepQ; state.sample = keepS;
        const mean = vals.reduce((s, v) => s + v, 0) / n;
        const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1));
        return { mean, sd };
    },
};

/* 그림 속 문장을 HTML로 내린다. 액자를 벗어나거나 서로 겹치는 글자만 옮기므로
   조건이 바뀌어도 스스로 맞는다. 그림에는 짧은 이름표만 남는다. */
(function () {
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    if (!stageReadout) return;
    const pairs = [['mainGroup', '.main-svg'], ['graphGroup', '.graph-svg']]
        .map(([id, sel]) => [document.getElementById(id), document.querySelector(sel)])
        .filter(([g, s]) => g && s);
    if (!pairs.length) return;

    // 그림에서 쓰던 색이 흰 바탕에서는 너무 흐린 경우가 있어, 그런 색은 버리고 기본색을 쓴다.
    function readableOnWhite(c) {
        let r, g, b;
        if (c[0] === '#') {
            let h = c.slice(1);
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            if (h.length !== 6) return false;
            r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
        } else {
            const m = c.match(/[\d.]+/g);
            if (!m || m.length < 3) return false;
            r = +m[0]; g = +m[1]; b = +m[2];
            const a = m.length > 3 ? +m[3] : 1;
            r = a * r + (1 - a) * 255; g = a * g + (1 - a) * 255; b = a * b + (1 - a) * 255;
        }
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        return 1.05 / (L + 0.05) >= 3.5;
    }

    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        pairs.forEach(([g, svg]) => {
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            const outside = b => b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text|prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                // 눈금 같은 짧은 이름표는 밖으로 내보내면 뜻을 잃는다. 액자 안으로 밀어 넣어 본다.
                if (!must && outside(b) && b.width < W * 0.6 && !t.getAttribute('transform')) {
                    const x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
                    if (!Number.isNaN(x)) {
                        const dx = b.x + b.width > W - 2 ? (W - 2) - (b.x + b.width) : (b.x < 2 ? 2 - b.x : 0);
                        if (dx) { t.setAttribute('x', (x + dx).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                    if (!Number.isNaN(y)) {
                        const dy = b.y + b.height > H - 1 ? (H - 1) - (b.y + b.height) : (b.y < 1 ? 1 - b.y : 0);
                        if (dy) { t.setAttribute('y', (y + dy).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                }
                if (must || outside(b)) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => {
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; }
                return { t, b, len: t.textContent.trim().length };
            }).filter(o => o.b);
            const drop = new Set();
            for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
                if (drop.has(i) || drop.has(j)) continue;
                const a = items[i].b, c = items[j].b;
                if (Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) <= 3) continue;
                if (Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y) <= 1.5) continue;
                const k = items[i].len >= items[j].len ? i : j;
                if (items[k].len < 8) continue;
                drop.add(k);
            }
            [...drop].sort((x, y) => x - y).forEach(k => takeOut(items[k].t));
        });
        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.
        if (!rows.length && !notes.length && !verdicts.length) return;
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        stageReadout.textContent = '';
        rows.forEach(r => {
            const s = document.createElement('span');
            s.textContent = r.txt;
            if (r.fill && readableOnWhite(r.fill)) s.style.color = r.fill;
            stageReadout.appendChild(s);
        });
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    // 화면이 다시 그려지면 곧바로 돈다. 옮기는 동안 스스로를 깨우지 않도록 잠근다.
    let busy = false, obs;
    // 글자를 옮기는 것도 화면 변경이라 감시기가 다시 불린다. 그때는 기록이 비어 있으므로
    // 그냥 돌아가야 한다. 그러지 않으면 두 번째 실행이 방금 옮긴 결과를 지운다.
    const run = recs => {
        if (busy || (recs && recs.length === 0)) return;
        busy = true;
        try { liftProse(); } finally { obs.takeRecords(); busy = false; }
    };
    obs = new MutationObserver(run);
    pairs.forEach(([g]) => obs.observe(g, { childList: true, subtree: true }));
    run();
    document.addEventListener('DOMContentLoaded', run);
})();
