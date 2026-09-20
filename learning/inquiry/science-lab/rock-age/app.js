'use strict';

/* Decay is the only clock here: the remaining parent fraction is 2^(-t/T) and
   everything else is read off it. The section's absolute ages are chosen once
   and then have to survive every relative-dating rule the picture shows, so
   the two halves of the page cannot disagree. */

const ISO = {
    c14: { name: '¹⁴C', full: '탄소-14', half: 5730, daughter: '¹⁴N', dfull: '질소-14', use: '나무·뼈·조개껍데기' },
    k40: { name: '⁴⁰K', full: '칼륨-40', half: 1.25e9, daughter: '⁴⁰Ar', dfull: '아르곤-40', use: '화산암·변성암' },
    u238: { name: '²³⁸U', full: '우라늄-238', half: 4.47e9, daughter: '²⁰⁶Pb', dfull: '납-206', use: '아주 오래된 암석' },
};
// Outside these fractions there is either too little daughter or too little
// parent left to measure, which is what limits each isotope's usable range.
/* 기호가 아니라 우리말 이름을 읽으므로, 이름 끝 숫자의 소리로 조사를 고릅니다.
   질소-14는 '사'로 끝나 받침이 없어 '로', 아르곤-40과 납-206은 받침이 있어 '으로'. */
const DIGIT_JONG = { '0': 21, '1': 8, '2': 0, '3': 16, '4': 0, '5': 0, '6': 1, '7': 8, '8': 8, '9': 0 };
const roParticle = w => {
    const d = String(w).replace(/[^0-9]/g, '').slice(-1);
    const j = d === '' ? 0 : DIGIT_JONG[d];
    return j === 0 || j === 8 ? '로' : '으로';
};
const MIN_FRAC = 0.001, MAX_FRAC = 0.999;

const TARGETS = {
    ash: { name: '화산재층', age: 1.2e4, why: '맨 위에 덮여 있으므로 무엇보다 젊습니다' },
    D: { name: '지층 D', age: 4.0e7, why: '부정합면 위에 쌓였으므로 아래 것들보다 모두 젊습니다' },
    dyke: { name: '관입암', age: 1.8e8, why: '지층 C를 뚫었으니 C보다 젊고, 부정합면에서 끊겼으니 D보다 오래되었습니다' },
    fault: { name: '단층', age: 3.0e8, why: '지층 C까지 끊었으니 C보다 젊고, 부정합면에서 끊겼으니 D보다 오래되었습니다' },
    C: { name: '지층 C', age: 4.0e8, why: '누중의 법칙에 따라 아래의 A·B보다 젊습니다' },
    A: { name: '지층 A', age: 1.2e9, why: '맨 아래에 있으므로 이 단면에서 가장 오래되었습니다' },
};
const HIDDEN_B = 8.0e8;   // 지층 B, drawn but not offered as a target

const state = {
    mode: 'decay', iso: 'k40', hl: 2, target: 'C',
    prediction: null, checked: false,
    running: false, phase: 0, cursor: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function koYears(y) {
    y = Math.round(y);
    if (y < 10000) return `${y.toLocaleString('ko-KR')}년`;
    const eok = Math.floor(y / 1e8);
    const man = Math.floor((y - eok * 1e8) / 1e4);
    const rest = y - eok * 1e8 - man * 1e4;
    const parts = [];
    if (eok) parts.push(`${eok.toLocaleString('ko-KR')}억`);
    if (man) parts.push(`${man.toLocaleString('ko-KR')}만`);
    if (rest) parts.push(`${rest.toLocaleString('ko-KR')}`);
    const s = parts.join(' ');
    return /[만억]$/.test(s) ? `${s} 년` : `${s}년`;
}

function iso() { return ISO[state.iso]; }
function fracAfter(n) { return Math.pow(2, -n); }
function fracAtAge(age, T) { return Math.pow(2, -age / T); }
function halvesForAge(age, T) { return age / T; }
function windowFor(T) { return [Math.log2(1 / MAX_FRAC) * T, Math.log2(1 / MIN_FRAC) * T]; }
function datable(age, T) {
    const [lo, hi] = windowFor(T);
    return age < lo ? 'young' : (age > hi ? 'old' : 'ok');
}

function decayVerdict() {
    const f = fracAfter(state.hl);
    return f > 0.5 ? 'p1' : (f >= 0.03 ? 'p2' : 'p3');
}
function strataVerdict() {
    const d = datable(TARGETS[state.target].age, iso().half);
    return d === 'ok' ? 'p1' : (d === 'old' ? 'p2' : 'p3');
}
function verdict() { return state.mode === 'decay' ? decayVerdict() : strataVerdict(); }

function analyse() {
    const T = iso().half;
    if (state.mode === 'decay') {
        const f = fracAfter(state.hl);
        return {
            frac: f, daughter: 1 - f, ratio: f > 0 ? (1 - f) / f : Infinity,
            years: state.hl * T, verdict: verdict(),
        };
    }
    const t = TARGETS[state.target];
    const f = fracAtAge(t.age, T);
    return {
        target: t, age: t.age, frac: f, daughter: 1 - f,
        halves: halvesForAge(t.age, T), state: datable(t.age, T),
        window: windowFor(T), verdict: verdict(),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

// --- drawing: decay ---------------------------------------------------------
const ATOMS = 256;
// A fixed order in which atoms flip, so watching the box is watching one
// steady process rather than a reshuffle at every frame.
const ORDER = (() => {
    const a = [...Array(ATOMS).keys()];
    let s = 12345;
    for (let i = a.length - 1; i > 0; i -= 1) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const j = s % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
})();

function drawAtoms(g) {
    const a = analyse();
    const parents = Math.round(ATOMS * a.frac);
    const isParent = new Array(ATOMS).fill(false);
    for (let i = 0; i < parents; i += 1) isParent[ORDER[i]] = true;

    g.appendChild(el('rect', { x: 26, y: 36, width: 168, height: 168, rx: 8, class: 'atom-box' }));
    for (let i = 0; i < ATOMS; i += 1) {
        const col = i % 16, row = Math.floor(i / 16);
        g.appendChild(el('circle', {
            cx: 34 + col * 10.5, cy: 44 + row * 10.5, r: 3.6,
            class: `atom ${isParent[i] ? 'parent' : 'daughter'}`,
        }));
    }
    g.appendChild(el('text', { x: 110, y: 26, 'text-anchor': 'middle', class: 'small-label' }, `원자 ${ATOMS}개 · 파랑이 모원소`));

    g.appendChild(el('text', { x: 220, y: 44, class: 'small-label' }, `남은 모원소 ${iso().name}`));
    g.appendChild(el('text', { x: 220, y: 68, class: 'big-count' }, `${fmt(a.frac * 100, 1)}%`));
    g.appendChild(el('text', { x: 220, y: 96, class: 'small-label' }, `생긴 딸원소 ${iso().daughter}`));
    g.appendChild(el('text', { x: 220, y: 116, class: 'read-text', style: 'fill:#ffab6b' }, `${fmt(a.daughter * 100, 1)}%`));
    g.appendChild(el('text', { x: 220, y: 144, class: 'small-label' }, '딸원소 ÷ 모원소'));
    g.appendChild(el('text', { x: 220, y: 162, class: 'read-text' },
        a.frac > 0 ? `${fmt(a.ratio, 2)} 배` : '잴 수 없음'));
    g.appendChild(el('text', { x: 220, y: 188, class: 'small-label' }, `지난 시간 (반감기 ${fmt(state.hl, 2)}번)`));
    g.appendChild(el('text', { x: 220, y: 206, class: 'read-text' }, koYears(a.years)));
}

function drawDecayGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146;
    const X = n => x0 + (n / 8) * (x1 - x0);
    const Y = f => yBot - f * (yBot - yTop);

    for (let f = 0; f <= 1.0001; f += 0.25) {
        g.appendChild(el('line', { x1: x0, y1: Y(f), x2: x1, y2: Y(f), class: 'grid-line' }));
        if (f > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(f) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `${Math.round(f * 100)}%`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let n = 0; n <= 8; n += 1) {
        g.appendChild(el('line', { x1: X(n), y1: yBot, x2: X(n), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(n), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(n)));
    }

    let dp = '', dd = '';
    for (let i = 0; i <= 200; i += 1) {
        const n = (i / 200) * 8;
        dp += `${i ? 'L' : 'M'} ${fmt(X(n), 2)} ${fmt(Y(fracAfter(n)), 2)} `;
        dd += `${i ? 'L' : 'M'} ${fmt(X(n), 2)} ${fmt(Y(1 - fracAfter(n)), 2)} `;
    }
    g.appendChild(el('path', { d: dd, class: 'daughter-line' }));
    g.appendChild(el('path', { d: dp, class: 'parent-line' }));

    // The two curves meet at one half-life, where parent and daughter are equal.
    g.appendChild(el('line', { x1: X(1), y1: Y(0.5), x2: X(1), y2: yBot, class: 'mark-line' }));
    g.appendChild(el('circle', { cx: X(1), cy: Y(0.5), r: 3.6, style: 'fill:#d97706' }));
    g.appendChild(el('text', { x: X(1) + 5, y: Y(0.5) - 7, class: 'axis-text' }, '1번 지나면 반반'));
    g.appendChild(el('circle', { cx: X(state.hl), cy: Y(a.frac), r: 5, class: 'trace-dot', style: 'fill:#0284c7' }));

    g.appendChild(el('line', { x1: x0, y1: 172, x2: x0 + 15, y2: 172, style: 'stroke:#0284c7;stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 20, y: 175.5, class: 'legend-text', style: 'fill:#0284c7' }, `남은 모원소 ${iso().name}`));
    g.appendChild(el('line', { x1: x0 + 130, y1: 172, x2: x0 + 145, y2: 172, style: 'stroke:#ffab6b;stroke-width:3;stroke-dasharray:5 3' }));
    g.appendChild(el('text', { x: x0 + 150, y: 175.5, class: 'legend-text', style: 'fill:#ffab6b' }, `생긴 딸원소 ${iso().daughter}`));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, `지난 반감기 횟수 — 반감기 한 번은 ${koYears(iso().half)}`));
}

// --- drawing: strata --------------------------------------------------------
const SEC = { x0: 26, x1: 300, unc: 112, throwUp: 14 };
const faultX = y => 110 + (200 - y) * (40 / 112);

function drawSection(g) {
    const a = analyse();
    const pick = state.target;
    const LAYERS = [
        { k: 'A', top: 168, bot: 200, fill: '#8a7a63', tag: 'A' },
        { k: 'B', top: 140, bot: 168, fill: '#a8926f', tag: 'B' },
        { k: 'C', top: 112, bot: 140, fill: '#c2ab84', tag: 'C' },
    ];
    // Faulted blocks first; anything they push above the erosion surface is
    // painted over by the beds that were laid down on top of it.
    LAYERS.forEach(L => {
        const cls = `layer${pick === L.k ? ' picked' : ''}`;
        g.appendChild(el('polygon', {
            points: `${SEC.x0},${L.top} ${fmt(faultX(L.top), 1)},${L.top} ${fmt(faultX(L.bot), 1)},${L.bot} ${SEC.x0},${L.bot}`,
            class: cls, style: `fill:${L.fill}`,
        }));
        const t2 = L.top - SEC.throwUp, b2 = L.bot - SEC.throwUp;
        g.appendChild(el('polygon', {
            points: `${fmt(faultX(t2), 1)},${t2} ${SEC.x1},${t2} ${SEC.x1},${b2} ${fmt(faultX(b2), 1)},${b2}`,
            class: cls, style: `fill:${L.fill}`,
        }));
    });

    g.appendChild(el('rect', {
        x: 215, y: SEC.unc - SEC.throwUp, width: 14, height: 200 - (SEC.unc - SEC.throwUp),
        class: `dyke${pick === 'dyke' ? ' picked' : ''}`,
    }));
    g.appendChild(el('line', {
        x1: 110, y1: 200, x2: fmt(faultX(SEC.unc), 1), y2: SEC.unc,
        class: `fault-line${pick === 'fault' ? ' picked' : ''}`,
    }));

    g.appendChild(el('rect', { x: SEC.x0, y: 74, width: SEC.x1 - SEC.x0, height: SEC.unc - 74, class: `layer${pick === 'D' ? ' picked' : ''}`, style: 'fill:#9ab89a' }));
    g.appendChild(el('rect', { x: SEC.x0, y: 62, width: SEC.x1 - SEC.x0, height: 12, class: `layer${pick === 'ash' ? ' picked' : ''}`, style: 'fill:#b9c4cc' }));

    let w = `M ${SEC.x0} ${SEC.unc} `;
    for (let x = SEC.x0; x <= SEC.x1; x += 12) w += `Q ${x + 6} ${SEC.unc + (x % 24 ? 4 : -4)} ${x + 12} ${SEC.unc} `;
    g.appendChild(el('path', { d: w, class: 'unconformity' }));

    g.appendChild(el('text', { x: 62, y: 190, class: 'layer-tag' }, '지층 A'));
    g.appendChild(el('text', { x: 62, y: 160, class: 'layer-tag' }, '지층 B'));
    g.appendChild(el('text', { x: 62, y: 132, class: 'layer-tag' }, '지층 C'));
    g.appendChild(el('text', { x: 62, y: 98, class: 'layer-tag' }, '지층 D'));
    g.appendChild(el('text', { x: 62, y: 72, class: 'layer-tag' }, '화산재'));
    g.appendChild(el('text', { x: 240, y: 196, class: 'small-label' }, '관입암'));
    g.appendChild(el('text', { x: 96, y: 210, 'text-anchor': 'middle', class: 'small-label' }, '단층'));
    g.appendChild(el('text', { x: 232, y: 58, class: 'tiny-label' }, '물결선은 부정합면'));

    g.appendChild(el('text', { x: 316, y: 26, class: 'small-label' }, '고른 곳'));
    g.appendChild(el('text', { x: 316, y: 46, class: 'read-text' }, a.target.name));
    g.appendChild(el('text', { x: 316, y: 72, class: 'small-label' }, `${iso().name}로 재면`));
    if (a.state === 'ok') {
        g.appendChild(el('text', { x: 316, y: 92, class: 'note-text' }, `남은 모원소 ${fmt(a.frac * 100, 1)}%`));
        g.appendChild(el('text', { x: 316, y: 108, class: 'note-text' }, `반감기 ${fmt(a.halves, 2)}번`));
        g.appendChild(el('text', { x: 316, y: 138, class: 'small-label' }, '절대 연령'));
        g.appendChild(el('text', { x: 316, y: 160, class: 'big-count' }, koYears(a.age)));
    } else {
        g.appendChild(el('text', { x: 316, y: 92, class: 'warn-text' }, a.state === 'old' ? '너무 오래되어' : '너무 젊어'));
        g.appendChild(el('text', { x: 316, y: 108, class: 'warn-text' }, '잴 수 없습니다'));
        g.appendChild(el('text', { x: 316, y: 132, class: 'note-text' }, a.state === 'old' ? '모원소가 남지' : '딸원소가 쌓이지'));
        g.appendChild(el('text', { x: 316, y: 146, class: 'note-text' }, '않았습니다'));
        g.appendChild(el('text', { x: 316, y: 172, class: 'small-label' }, '다른 동위 원소로'));
        g.appendChild(el('text', { x: 316, y: 186, class: 'small-label' }, '바꿔 보세요'));
    }
}

const LOG_LO = 3, LOG_HI = 10.6;

function drawStrataGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, bandTop = 52, bandBot = 92, axisY = 130;
    const X = years => x0 + ((Math.log10(years) - LOG_LO) / (LOG_HI - LOG_LO)) * (x1 - x0);

    for (let d = LOG_LO; d <= LOG_HI; d += 1) {
        const x = X(Math.pow(10, d));
        g.appendChild(el('line', { x1: x, y1: 34, x2: x, y2: axisY, class: 'grid-line' }));
        g.appendChild(el('text', { x, y: axisY + 15, 'text-anchor': 'middle', class: 'axis-text' }, koYears(Math.pow(10, d)).replace('년', '').trim()));
    }
    g.appendChild(el('line', { x1: x0, y1: axisY, x2: x1, y2: axisY, class: 'axis' }));

    const [lo, hi] = a.window;
    const bx0 = Math.max(x0, X(lo)), bx1 = Math.min(x1, X(hi));
    g.appendChild(el('rect', { x: bx0, y: bandTop, width: Math.max(2, bx1 - bx0), height: bandBot - bandTop, rx: 4, class: 'window-band' }));
    g.appendChild(el('text', { x: (bx0 + bx1) / 2, y: bandTop - 7, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#059669' },
        `${iso().name}로 잴 수 있는 범위`));

    Object.entries(TARGETS).forEach(([k, t]) => {
        const x = X(t.age), on = k === state.target;
        g.appendChild(el('line', { x1: x, y1: axisY - 20, x2: x, y2: axisY, class: `age-tick${on ? ' picked' : ''}` }));
        if (on) {
            g.appendChild(el('circle', { cx: x, cy: axisY - 24, r: 4.5, class: 'trace-dot', style: 'fill:#d97706' }));
            const anchor = x > x1 - 70 ? 'end' : (x < x0 + 70 ? 'start' : 'middle');
            g.appendChild(el('text', { x: clamp(x, x0, x1), y: axisY - 32, 'text-anchor': anchor, class: 'axis-text', style: 'fill:#d97706' },
                `${t.name} ${koYears(t.age)}`));
        }
    });

    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 168, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#475569' },
        '눈금 하나가 10배입니다 · 세로 막대는 이 단면에 있는 여섯 곳의 나이'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 189, 'text-anchor': 'middle', class: 'axis-title' }, '몇 년 전인가 (로그 눈금)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    if (state.mode === 'decay') { drawAtoms(m); drawDecayGraph(gr); }
    else { drawSection(m); drawStrataGraph(gr); }
    updateReadout();
}

const ORDERED = ['ash', 'D', 'dyke', 'fault', 'C', 'A'];

function updateReadout() {
    const a = analyse();
    if (state.mode === 'decay') {
        $('stageBadge').textContent = `${iso().full} · 반감기 ${koYears(iso().half)}`;
        $('labelA').textContent = '남은 모원소';
        $('valueA').textContent = `${fmt(a.frac * 100, 2)}%`;
        $('labelB').textContent = '지난 시간';
        $('valueB').textContent = koYears(a.years);
        const rows = [
            ['반감기', koYears(iso().half), false],
            ['생긴 딸원소', `${iso().daughter} ${fmt(a.daughter * 100, 2)}%`, false],
            ['딸원소 ÷ 모원소', a.frac > 0 ? `${fmt(a.ratio, 3)}배` : '잴 수 없음', false],
            ['남은 원자 수', `${ATOMS}개 가운데 ${Math.round(ATOMS * a.frac)}개`, false],
            ['한 번 더 지나면', `${fmt(a.frac * 50, 2)}%`, false],
            ['이 원소를 쓰는 곳', iso().use, false],
        ];
        $('dataNote').innerHTML = rows.map(([n, v, m]) =>
            `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    } else {
        $('stageBadge').textContent = `${a.target.name} · ${iso().full}`;
        $('labelA').textContent = '절대 연령';
        $('valueA').textContent = a.state === 'ok' ? koYears(a.age) : '잴 수 없음';
        $('labelB').textContent = '남은 모원소';
        $('valueB').textContent = a.state === 'ok' ? `${fmt(a.frac * 100, 1)}%` : (a.state === 'old' ? '거의 0' : '거의 100');
        const rows = [
            ['상대 연령 근거', a.target.why, false],
            ['반감기 몇 번', a.halves < 0.001 ? '0.001번 미만' : `${fmt(a.halves, 3)}번`, a.state === 'ok'],
            [`${iso().name}로 잴 수 있는 범위`, `${koYears(a.window[0])} ~ ${koYears(a.window[1])}`, false],
            ['오래된 차례', ORDERED.slice().reverse().map(k => TARGETS[k].name).join(' → '), false],
            ['지층 B', `${koYears(HIDDEN_B)} · A와 C 사이`, false],
            ['단층과 관입암', '서로 만나지 않아 상대 연령만으로는 순서를 알 수 없음', false],
        ];
        $('dataNote').innerHTML = rows.map(([n, v, m]) =>
            `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    }
    if (state.checked) explain(a);
}

const DECAY_WORDS = { p1: '절반 이상', p2: '절반 이하', p3: '거의 없음' };
const STRATA_WORDS = { p1: '잴 수 있다', p2: '너무 오래됨', p3: '너무 젊음' };

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const words = state.mode === 'decay' ? DECAY_WORDS : STRATA_WORDS;
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

    if (state.mode === 'decay') {
        let s = `${iso().full}의 반감기는 ${koYears(iso().half)}입니다. 반감기가 ${fmt(state.hl, 2)}번 지났으므로 남은 모원소는 2를 ${fmt(state.hl, 2)}번 나눈 만큼, 곧 ${fmt(a.frac * 100, 2)}%입니다. `;
        s += `사라진 것이 아니라 ${fmt(a.daughter * 100, 2)}%가 ${iso().dfull}(${iso().daughter})${roParticle(iso().dfull)} 바뀌어 암석 속에 그대로 남아 있고, 그래서 둘의 비를 재면 지난 시간을 알 수 있습니다. `;
        s += `지금 딸원소는 모원소의 ${a.frac > 0 ? `${fmt(a.ratio, 2)}배` : '헤아릴 수 없을 만큼 여러 배'}이고, 실제로 흐른 시간은 ${koYears(a.years)}입니다. `;
        s += `여기서 중요한 것은 반감기가 온도나 압력에 아무런 영향을 받지 않는다는 점입니다. 그래서 땅속 깊이 묻혔던 암석도 같은 시계로 잴 수 있습니다.`;
        $('elementaryExplanation').textContent = s;
    } else {
        let s = `${a.target.name}은 ${a.target.why}. `;
        if (a.state === 'ok') {
            s += `${iso().full}로 재면 모원소가 ${fmt(a.frac * 100, 1)}% 남아 있으니 반감기가 ${fmt(a.halves, 2)}번 지난 셈이고, 나이는 ${koYears(a.age)}입니다. `;
        } else if (a.state === 'old') {
            s += `그런데 ${iso().full}로는 잴 수 없습니다. 반감기가 ${koYears(iso().half)}뿐이라 ${koYears(a.age)} 동안 반감기가 ${a.halves > 1000 ? Math.round(a.halves).toLocaleString('ko-KR') : fmt(a.halves, 1)}번이나 지났고, 모원소가 하나도 남지 않아 잴 것이 없습니다. `;
            s += `이럴 때는 반감기가 훨씬 긴 ⁴⁰K나 ²³⁸U를 씁니다. `;
        } else {
            s += `그런데 ${iso().full}로는 잴 수 없습니다. 반감기가 ${koYears(iso().half)}이나 되는데 겨우 ${koYears(a.age)}밖에 지나지 않아, 딸원소가 잴 수 있을 만큼 쌓이지 않았습니다. `;
            s += `이렇게 젊은 것에는 반감기가 짧은 ¹⁴C를 씁니다. `;
        }
        s += `이 단면에서 오래된 것부터 늘어놓으면 ${ORDERED.slice().reverse().map(k => TARGETS[k].name).join(', ')} 차례입니다. 다만 단층과 관입암은 서로 자르지도 얹히지도 않아 상대 연령만으로는 순서를 정할 수 없고, 각각의 절대 연령을 재고 나서야 단층이 ${koYears(TARGETS.fault.age)}, 관입암이 ${koYears(TARGETS.dyke.age)}으로 단층이 더 오래되었음을 알게 됩니다.`;
        $('elementaryExplanation').textContent = s;
    }
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    if (state.mode === 'decay') {
        state.hl = Math.min(8, state.hl + dt * 8 / 12);
        $('hlRange').value = String(Math.round(state.hl * 4) / 4);
        $('hlOutput').textContent = `${fmt(state.hl, 2)}번`;
        if (state.hl >= 8) {
            state.running = false;
            $('runBtn').textContent = '시간 흘려보내기';
            state.checked = true;
            return true;
        }
    } else {
        state.cursor += dt / 1.2;
        const i = Math.floor(state.cursor);
        if (i >= ORDERED.length) {
            state.running = false;
            $('runBtn').textContent = '차례로 훑기';
            state.checked = true;
            return true;
        }
        if (state.target !== ORDERED[i]) {
            state.target = ORDERED[i];
            markSelected('[data-target]', 'target', state.target);
        }
    }
    return false;
}

let last = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    requestAnimationFrame(frame);
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

function applyMode() {
    markSelected('[data-mode]', 'mode', state.mode);
    $('decayControls').hidden = state.mode !== 'decay';
    $('strataControls').hidden = state.mode === 'decay';
    const dc = state.mode === 'decay';
    $('predictionLegend').textContent = dc ? '지금 남아 있는 모원소는?' : '이 동위 원소로 여기 나이를 잴 수 있을까요?';
    const words = dc ? DECAY_WORDS : STRATA_WORDS;
    document.querySelectorAll('[data-prediction]').forEach(b => { b.textContent = words[b.dataset.prediction]; });
    $('runBtn').textContent = dc ? '시간 흘려보내기' : '차례로 훑기';
    $('unitNote').textContent = dc ? '암석이 굳을 때 딸원소는 0이었다고 봅니다'
        : '단면은 아래가 오래된 것, 위가 젊은 것입니다';
    $('stageCaption').textContent = dc
        ? '반감기가 한 번 지날 때마다 남은 모원소는 절반이 됩니다. 줄어든 만큼이 딸원소로 바뀌어 쌓입니다.'
        : '노란 테두리가 지금 고른 곳입니다. 단층은 부정합면에서 끊겨 있고, 관입암도 그 위로는 올라가지 못했습니다.';
    state.running = false;
    state.cursor = 0;
    render();
}

document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode; state.prediction = null; state.checked = false;
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    applyMode();
}));
document.querySelectorAll('[data-iso]').forEach(b => b.addEventListener('click', () => {
    state.iso = b.dataset.iso; markSelected('[data-iso]', 'iso', state.iso); render();
}));
document.querySelectorAll('[data-target]').forEach(b => b.addEventListener('click', () => {
    state.target = b.dataset.target; markSelected('[data-target]', 'target', state.target); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('hlRange').addEventListener('input', e => {
    state.hl = Number(e.target.value);
    state.running = false;
    $('runBtn').textContent = '시간 흘려보내기';
    $('hlOutput').textContent = `${fmt(state.hl, 2)}번`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; applyMode(); return; }
    state.checked = true;
    if (state.mode === 'decay') { state.hl = 0; $('hlRange').value = '0'; $('hlOutput').textContent = '0.00번'; }
    else state.cursor = 0;
    state.running = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.mode = 'decay'; state.iso = 'k40'; state.hl = 2; state.target = 'C';
    state.prediction = null; state.checked = false; state.running = false; state.cursor = 0;
    $('hlRange').value = '2'; $('hlOutput').textContent = '2.00번';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-iso]', 'iso', 'k40'); markSelected('[data-target]', 'target', 'C');
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

markSelected('[data-iso]', 'iso', state.iso);
markSelected('[data-target]', 'target', state.target);
applyMode();
requestAnimationFrame(frame);

window.__rockModel = {
    state, analyse, tick, render, fracAfter, fracAtAge, windowFor, datable, koYears,
    ISO, TARGETS, ORDERED, HIDDEN_B, ATOMS,
    setMode(v) { document.querySelector(`[data-mode="${v}"]`).click(); },
    setIso(v) { document.querySelector(`[data-iso="${v}"]`).click(); },
    setTarget(v) { document.querySelector(`[data-target="${v}"]`).click(); },
    setHl(v) { const r = $('hlRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, hl: state.hl, target: state.target };
    },
};
